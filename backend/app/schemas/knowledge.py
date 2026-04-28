from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class KnowledgeIn(BaseModel):
    title: str
    problem: str
    root_cause: str | None = None
    resolution: str | None = None
    actors: list[str] | None = None
    duration_minutes: int | None = None
    tags: list[str] | None = None
    system: str | None = None


class KnowledgeOut(KnowledgeIn):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class KnowledgeSearchHit(BaseModel):
    entry: KnowledgeOut
    distance: float
