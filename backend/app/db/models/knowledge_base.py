from sqlalchemy import JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from pgvector.sqlalchemy import Vector

from app.db.base import Base, TimestampMixin, UUIDMixin

EMBEDDING_DIM = 1024


class KnowledgeEntry(Base, UUIDMixin, TimestampMixin):
    """
    Geçmiş vakalardan damıtılmış know-how kaydı.
    Her giriş: problem / kök neden / çözüm / aktör + vector embedding.
    """

    __tablename__ = "knowledge_entries"

    title: Mapped[str] = mapped_column(String(300))
    problem: Mapped[str] = mapped_column(Text)
    root_cause: Mapped[str | None] = mapped_column(Text)
    resolution: Mapped[str | None] = mapped_column(Text)
    actors: Mapped[list[str] | None] = mapped_column(JSON)  # kim ne yaptı
    duration_minutes: Mapped[int | None] = mapped_column()
    tags: Mapped[list[str] | None] = mapped_column(JSON)
    system: Mapped[str | None] = mapped_column(String(50))  # sap | promanage | other

    embedding: Mapped[list[float] | None] = mapped_column(Vector(EMBEDDING_DIM))

    incidents = relationship("Incident", back_populates="knowledge_entry")
