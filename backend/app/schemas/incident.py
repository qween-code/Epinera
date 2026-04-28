from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class IncidentRead(BaseModel):
    id: UUID
    title: str
    source: str
    severity: str
    status: str
    summary: str | None = None
    root_cause: str | None = None
    resolution: str | None = None
    resolver: str | None = None
    created_at: datetime
    updated_at: datetime
    resolved_at: datetime | None = None
    tags: list[str] | None = None

    class Config:
        from_attributes = True


class IncidentUpdate(BaseModel):
    title: str | None = None
    severity: str | None = None
    status: str | None = None
    summary: str | None = None
    root_cause: str | None = None
    resolution: str | None = None
    resolver: str | None = None
    tags: list[str] | None = None


class ActionRead(BaseModel):
    id: UUID
    type: str
    status: str
    title: str
    description: str | None
    requires_approval: bool
    payload: dict | None
    result: dict | None

    class Config:
        from_attributes = True
