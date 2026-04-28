from uuid import UUID

from sqlalchemy import JSON, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, UUIDMixin


class FileAsset(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "file_assets"

    incident_id: Mapped[UUID | None] = mapped_column(ForeignKey("incidents.id"))
    incident = relationship("Incident", back_populates="files")

    filename: Mapped[str] = mapped_column(String(300))
    content_type: Mapped[str] = mapped_column(String(120))
    size_bytes: Mapped[int] = mapped_column(Integer)
    storage_path: Mapped[str] = mapped_column(String(500))
    sha256: Mapped[str | None] = mapped_column(String(64))

    extracted_text: Mapped[str | None] = mapped_column(Text)  # OCR / parser output
    analysis: Mapped[dict | None] = mapped_column(JSON)  # LLM yorumu, anomali skoru
