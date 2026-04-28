from fastapi import APIRouter, Depends
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.api.auth import require_user
from app.db.models import KnowledgeEntry
from app.db.session import get_db
from app.schemas.knowledge import KnowledgeIn, KnowledgeOut, KnowledgeSearchHit
from app.services.kb import search_similar, upsert_knowledge_entry

router = APIRouter()


@router.get("", response_model=list[KnowledgeOut])
async def list_entries(
    limit: int = 100,
    db: Session = Depends(get_db),
    _: str = Depends(require_user),
):
    stmt = select(KnowledgeEntry).order_by(desc(KnowledgeEntry.created_at)).limit(limit)
    return list(db.scalars(stmt))


@router.post("", response_model=KnowledgeOut)
async def create_entry(
    payload: KnowledgeIn,
    db: Session = Depends(get_db),
    _: str = Depends(require_user),
):
    entry = await upsert_knowledge_entry(db, **payload.model_dump())
    return entry


@router.get("/search", response_model=list[KnowledgeSearchHit])
async def search(
    q: str,
    limit: int = 5,
    db: Session = Depends(get_db),
    _: str = Depends(require_user),
):
    hits = await search_similar(db, q, limit=limit)
    return [KnowledgeSearchHit(entry=KnowledgeOut.model_validate(e), distance=d) for e, d in hits]
