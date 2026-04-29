import enum
from uuid import UUID

from sqlalchemy import Enum, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, UUIDMixin


class ChatRole(str, enum.Enum):
    user = "user"
    assistant = "assistant"
    system = "system"


class ChatMessage(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "chat_messages"

    incident_id: Mapped[UUID | None] = mapped_column(ForeignKey("incidents.id"))
    incident = relationship("Incident", back_populates="chat_messages")

    role: Mapped[ChatRole] = mapped_column(Enum(ChatRole, native_enum=False, length=32))
    content: Mapped[str] = mapped_column(Text)
