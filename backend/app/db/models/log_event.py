from datetime import datetime
from uuid import UUID

from sqlalchemy import JSON, DateTime, ForeignKey, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, UUIDMixin


class LogEvent(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "log_events"
    __table_args__ = (
        Index("ix_log_events_source_observed", "source", "observed_at"),
        Index("ix_log_events_severity", "severity"),
    )

    source: Mapped[str] = mapped_column(String(50))  # promanage, sap, file
    stream: Mapped[str | None] = mapped_column(String(120))
    severity: Mapped[str | None] = mapped_column(String(20))
    message: Mapped[str] = mapped_column(Text)
    observed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    fingerprint: Mapped[str | None] = mapped_column(String(64))
    extra: Mapped[dict | None] = mapped_column(JSON)

    incident_id: Mapped[UUID | None] = mapped_column(ForeignKey("incidents.id"))
    incident = relationship("Incident", back_populates="log_events")
