import enum
from datetime import datetime
from uuid import UUID

from sqlalchemy import JSON, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, UUIDMixin


class IncidentSeverity(str, enum.Enum):
    info = "info"
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class IncidentStatus(str, enum.Enum):
    detected = "detected"
    analyzing = "analyzing"
    awaiting_action = "awaiting_action"
    in_progress = "in_progress"
    resolved = "resolved"
    closed = "closed"


class Incident(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "incidents"

    title: Mapped[str] = mapped_column(String(300))
    source: Mapped[str] = mapped_column(String(50))  # promanage, sap, manual_upload
    severity: Mapped[IncidentSeverity] = mapped_column(
        Enum(IncidentSeverity), default=IncidentSeverity.info
    )
    status: Mapped[IncidentStatus] = mapped_column(
        Enum(IncidentStatus), default=IncidentStatus.detected
    )

    summary: Mapped[str | None] = mapped_column(Text)
    root_cause: Mapped[str | None] = mapped_column(Text)
    resolution: Mapped[str | None] = mapped_column(Text)
    resolver: Mapped[str | None] = mapped_column(String(120))
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    raw_payload: Mapped[dict | None] = mapped_column(JSON)
    tags: Mapped[list[str] | None] = mapped_column(JSON)

    knowledge_entry_id: Mapped[UUID | None] = mapped_column(ForeignKey("knowledge_entries.id"))
    knowledge_entry = relationship("KnowledgeEntry", back_populates="incidents")

    actions = relationship("Action", back_populates="incident", cascade="all, delete-orphan")
    chat_messages = relationship(
        "ChatMessage", back_populates="incident", cascade="all, delete-orphan"
    )
    files = relationship("FileAsset", back_populates="incident", cascade="all, delete-orphan")
    log_events = relationship("LogEvent", back_populates="incident")
