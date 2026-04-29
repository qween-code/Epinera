from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.logging import get_logger
from app.db.models import KnowledgeEntry
from app.services.ai import get_ai_provider

log = get_logger("kb.search")


async def search_similar(
    db: Session, query: str, limit: int = 5
) -> list[tuple[KnowledgeEntry, float]]:
    ai = get_ai_provider()
    try:
        embeddings = await ai.embed([query])
    except Exception as e:  # noqa: BLE001 — embedding kapalıysa RAG'i atla
        log.warning("kb.search.embed_failed", error=str(e))
        return []

    if not embeddings or not embeddings[0]:
        return []

    vector = embeddings[0]
    distance = KnowledgeEntry.embedding.cosine_distance(vector)
    stmt = (
        select(KnowledgeEntry, distance.label("distance"))
        .where(KnowledgeEntry.embedding.is_not(None))
        .order_by(distance)
        .limit(limit)
    )
    rows = db.execute(stmt).all()
    return [(row[0], float(row[1])) for row in rows]
