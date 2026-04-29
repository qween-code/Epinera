from sqlalchemy.orm import Session

from app.core.logging import get_logger
from app.db.models import KnowledgeEntry
from app.services.ai import get_ai_provider

log = get_logger("kb.store")


async def upsert_knowledge_entry(
    db: Session,
    *,
    title: str,
    problem: str,
    root_cause: str | None = None,
    resolution: str | None = None,
    actors: list[str] | None = None,
    duration_minutes: int | None = None,
    tags: list[str] | None = None,
    system: str | None = None,
) -> KnowledgeEntry:
    entry = KnowledgeEntry(
        title=title,
        problem=problem,
        root_cause=root_cause,
        resolution=resolution,
        actors=actors,
        duration_minutes=duration_minutes,
        tags=tags,
        system=system,
    )

    ai = get_ai_provider()
    text_blob = "\n".join(
        filter(None, [title, problem, root_cause or "", resolution or ""])
    )
    try:
        embeddings = await ai.embed([text_blob])
        if embeddings and embeddings[0]:
            entry.embedding = embeddings[0]
    except Exception as e:  # noqa: BLE001 — embedding kapalıysa kaydı yine yaz
        log.warning("kb.store.embed_failed", error=str(e))

    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry
