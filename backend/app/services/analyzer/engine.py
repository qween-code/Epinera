"""
Analiz motoru: kullanıcı bir dosya/log/resim yüklediğinde veya canlı log
akışında bir anomali tespit edildiğinde çağrılır. LLM'e geçmiş benzer
vakaları + ham içeriği verir, yapılandırılmış öneri döndürür.
"""
import json
import re
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

KRİTİK: Yanıtı SADECE geçerli JSON olarak ver. Markdown code fence (```)
KULLANMA. Açıklama, ön/son metin EKLEME. Sadece JSON nesnesi.
Tüm string değerleri TÜRKÇE yaz.

Şema:
{
  "title": "kısa başlık (Türkçe)",
  "severity": "info|low|medium|high|critical",
  "summary": "ne olduğu, 2-3 cümle (Türkçe)",
  "root_cause": "muhtemel kök neden (Türkçe)",
  "proactive_actions": [
    {
      "type": "promanage_inplace|email|ticket|note",
      "title": "kısa başlık (Türkçe)",
      "description": "ne yapılacak, adım adım (Türkçe)",
      "system": "promanage|sap|other",
      "requires_approval": true,
      "payload": {}
    }
  ],
  "tags": ["..."]
}
"""


_FENCE_RE = re.compile(r"```(?:json)?\s*(.+?)\s*```", re.DOTALL)


def _extract_json(text: str) -> dict:
    """Code-fence ya da serbest metinden ilk geçerli JSON nesnesini çıkar."""
    candidates: list[str] = []
    for m in _FENCE_RE.finditer(text):
        candidates.append(m.group(1))
    s, e = text.find("{"), text.rfind("}")
    if s != -1 and e != -1 and e > s:
        candidates.append(text[s : e + 1])
    for c in candidates:
        try:
            return json.loads(c)
        except json.JSONDecodeError:
            continue
    return {}


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
    try:
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
    except Exception as e:  # noqa: BLE001 — AI down olsa da incident kaydı oluşmalı
        from app.core.logging import get_logger

        get_logger("analyzer").error("analyzer.ai_failed", error=str(e))
        return AnalysisResult(
            title=(text.splitlines()[0][:120] if text.strip() else "AI offline — manuel inceleme"),
            severity="info",
            summary=f"AI sağlayıcısı şu an erişilemez ({type(e).__name__}). "
                    f"Ham içerik aşağıdadır; manuel olarak inceleyin.\n\n{text[:1500]}",
            root_cause="",
            proactive_actions=[
                {
                    "type": "note",
                    "title": "Manuel inceleme gerekli",
                    "description": "AI servisi erişilemediği için otomatik öneri çıkarılamadı. "
                                   "Ham içeriği gözden geçirip aksiyon planlayın.",
                    "system": source,
                    "requires_approval": False,
                }
            ],
            tags=["ai-unavailable"],
            similar_entries=similar_brief,
            raw_text="",
        )

    raw = response.text or ""
    # GLM/qwen gibi thinking modeller <think>...</think> blokları döndürebilir
    raw_clean = re.sub(r"<think>.*?</think>", "", raw, flags=re.DOTALL).strip()
    parsed = _extract_json(raw_clean) or _extract_json(raw)

    if not parsed:
        from app.core.logging import get_logger

        get_logger("analyzer").warning(
            "analyzer.json_parse_failed",
            raw_preview=raw[:300],
        )

    summary_fallback = (raw_clean or raw)[:600] or "Model yanıtı boş"

    return AnalysisResult(
        title=parsed.get("title") or "Otomatik analiz",
        severity=parsed.get("severity") or "info",
        summary=parsed.get("summary") or summary_fallback,
        root_cause=parsed.get("root_cause") or "",
        proactive_actions=parsed.get("proactive_actions") or [],
        tags=parsed.get("tags") or [],
        similar_entries=similar_brief,
        raw_text=raw,
    )
