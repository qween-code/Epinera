import enum
from datetime import datetime
from uuid import UUID

from sqlalchemy import JSON, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, UUIDMixin


class ActionType(str, enum.Enum):
    promanage_inplace = "promanage_inplace"
    email = "email"
    ticket = "ticket"
    note = "note"


class ActionStatus(str, enum.Enum):
    proposed = "proposed"
    approved = "approved"
    executing = "executing"
    succeeded = "succeeded"
    failed = "failed"
    skipped = "skipped"


class Action(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "actions"

    incident_id: Mapped[UUID] = mapped_column(ForeignKey("incidents.id"))
    incident = relationship("Incident", back_populates="actions")

    type: Mapped[ActionType] = mapped_column(Enum(ActionType, native_enum=False, length=32))
    status: Mapped[ActionStatus] = mapped_column(
        Enum(ActionStatus, native_enum=False, length=32),
        default=ActionStatus.proposed,
    )

    title: Mapped[str] = mapped_column(String(300))
    description: Mapped[str | None] = mapped_column(Text)
    payload: Mapped[dict | None] = mapped_column(JSON)
    result: Mapped[dict | None] = mapped_column(JSON)
    requires_approval: Mapped[bool] = mapped_column(default=True)
    executed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
