"""
Analiz motoru: kullanıcı bir dosya/log/resim yüklediğinde veya canlı log
akışında bir anomali tespit edildiğinde çağrılır. LLM'e geçmiş benzer
vakaları + ham içeriği verir, yapılandırılmış öneri döndürür.
"""
import json
from dataclasses import dataclass

from sqlalchemy.orm import Session

from app.services.ai import get_ai_provider
from app.services.ai.base import AIMessage
from app.services.kb import search_similar

SYSTEM_PROMPT = """Sen, SAP ve ProManage sistemleri için proaktif bir
operasyon asistanısın. Üretimin durmaması için problemleri erkenden tespit
edip somut aksiyonlar önerirsin.

ProManage tarafında YAPILABİLİR aksiyonları doğrudan öner.
SAP tarafında erişim yok → ticket açılması veya mail gönderilmesi gereken
durumları belirt.

Yanıtı SADECE JSON olarak ver. Şema:
{
  "title": "kısa başlık",
  "severity": "info|low|medium|high|critical",
  "summary": "ne olduğu, 2-3 cümle",
  "root_cause": "muhtemel kök neden",
  "proactive_actions": [
    {
      "type": "promanage_inplace|email|ticket|note",
      "title": "...",
      "description": "...",
      "system": "promanage|sap|other",
      "requires_approval": true|false,
      "payload": { ... aksiyona özel veriler ... }
    }
  ],
  "tags": ["..."]
}
"""


@dataclass
class AnalysisResult:
    title: str
    severity: str
    summary: str
    root_cause: str
    proactive_actions: list[dict]
    tags: list[str]
    similar_entries: list[dict]
    raw_text: str


async def analyze_payload(
    db: Session,
    *,
    text: str,
    image_paths: list[str] | None = None,
    source: str = "manual_upload",
    extra_context: str | None = None,
) -> AnalysisResult:
    similar = await search_similar(db, text[:4000], limit=5) if text.strip() else []
    similar_brief = [
        {
            "title": e.title,
            "problem": (e.problem or "")[:300],
            "resolution": (e.resolution or "")[:300],
            "distance": d,
        }
        for e, d in similar
    ]

    user_text_parts = [f"Kaynak: {source}", "Geçmiş benzer vakalar:"]
    if similar_brief:
        user_text_parts.append(json.dumps(similar_brief, ensure_ascii=False, indent=2))
    else:
        user_text_parts.append("(yok)")
    if extra_context:
        user_text_parts.append("Ek bağlam:")
        user_text_parts.append(extra_context)
    user_text_parts.append("İçerik:")
    user_text_parts.append(text[:8000])

    ai = get_ai_provider()
    response = await ai.complete(
        messages=[
            AIMessage(
                role="user",
                text="\n\n".join(user_text_parts),
                image_paths=image_paths,
            )
        ],
        system=SYSTEM_PROMPT,
        temperature=0.1,
        max_tokens=2000,
    )

    parsed: dict = {}
    try:
        json_start = response.text.find("{")
        json_end = response.text.rfind("}")
        if json_start != -1 and json_end != -1:
            parsed = json.loads(response.text[json_start : json_end + 1])
    except json.JSONDecodeError:
        parsed = {}

    return AnalysisResult(
        title=parsed.get("title", "Otomatik analiz"),
        severity=parsed.get("severity", "info"),
        summary=parsed.get("summary", response.text[:500]),
        root_cause=parsed.get("root_cause", ""),
        proactive_actions=parsed.get("proactive_actions", []),
        tags=parsed.get("tags", []),
        similar_entries=similar_brief,
        raw_text=response.text,
    )
