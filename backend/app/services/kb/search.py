from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import KnowledgeEntry
from app.services.ai import get_ai_provider


async def search_similar(
    db: Session, query: str, limit: int = 5
) -> list[tuple[KnowledgeEntry, float]]:
    ai = get_ai_provider()
    embeddings = await ai.embed([query])
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
