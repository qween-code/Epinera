from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import asc, select
from sqlalchemy.orm import Session

from app.api.auth import require_user
from app.db.models import Incident
from app.db.models.chat_message import ChatMessage, ChatRole
from app.db.session import get_db
from app.schemas.chat import ChatMessageIn, ChatMessageOut
from app.services.ai import get_ai_provider
from app.services.ai.base import AIMessage
from app.services.kb import search_similar

router = APIRouter()

CHAT_SYSTEM_PROMPT = """Sen Sentinel asistanısın. Kullanıcı bir hata
ekranı / log / soru gönderir, sen geçmiş vakalardan yararlanarak somut,
adım adım çözüm önerirsin. Bilmiyorsan sor; tahminden kaçın.
Yanıtın Türkçe olsun."""


@router.get("/{incident_id}/messages", response_model=list[ChatMessageOut])
async def list_messages(
    incident_id: UUID,
    db: Session = Depends(get_db),
    _: str = Depends(require_user),
):
    stmt = (
        select(ChatMessage)
        .where(ChatMessage.incident_id == incident_id)
        .order_by(asc(ChatMessage.created_at))
    )
    return list(db.scalars(stmt))


@router.post("/", response_model=ChatMessageOut)
async def send_message(
    payload: ChatMessageIn,
    db: Session = Depends(get_db),
    _: str = Depends(require_user),
):
    if payload.incident_id:
        incident = db.get(Incident, payload.incident_id)
        if not incident:
            raise HTTPException(404, "Incident bulunamadı")

    user_msg = ChatMessage(
        incident_id=payload.incident_id,
        role=ChatRole.user,
        content=payload.content,
    )
    db.add(user_msg)
    db.commit()
    db.refresh(user_msg)

    similar = await search_similar(db, payload.content, limit=5)
    similar_text = "\n\n".join(
        f"- ({d:.3f}) {e.title}\n  Çözüm: {e.resolution or '-'}"
        for e, d in similar
    ) or "(yok)"

    history_stmt = (
        select(ChatMessage)
        .where(ChatMessage.incident_id == payload.incident_id)
        .order_by(asc(ChatMessage.created_at))
        .limit(40)
    )
    history = list(db.scalars(history_stmt)) if payload.incident_id else [user_msg]

    ai_messages = [
        AIMessage(role=m.role.value, text=m.content) for m in history
    ]
    ai_messages.insert(
        0,
        AIMessage(
            role="user",
            text=f"Geçmiş benzer vakalar:\n{similar_text}\n\n--- Kullanıcı sorusu aşağıda ---",
        ),
    )

    ai = get_ai_provider()
    response = await ai.complete(
        messages=ai_messages,
        system=CHAT_SYSTEM_PROMPT,
        temperature=0.3,
        max_tokens=1500,
    )

    assistant_msg = ChatMessage(
        incident_id=payload.incident_id,
        role=ChatRole.assistant,
        content=response.text,
    )
    db.add(assistant_msg)
    db.commit()
    db.refresh(assistant_msg)
    return assistant_msg
