from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class ChatMessageIn(BaseModel):
    incident_id: UUID | None = None
    content: str


class ChatMessageOut(BaseModel):
    id: UUID
    incident_id: UUID | None
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
