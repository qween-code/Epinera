from datetime import UTC, datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.api.auth import require_user
from app.db.models import Incident, IncidentSeverity, IncidentStatus, KnowledgeEntry
from app.db.session import get_db
from app.schemas.incident import IncidentRead, IncidentUpdate
from app.services.kb.store import upsert_knowledge_entry

router = APIRouter()


@router.get("", response_model=list[IncidentRead])
async def list_incidents(
    status: str | None = None,
    severity: str | None = None,
    source: str | None = None,
    q: str | None = None,
    limit: int = 100,
    db: Session = Depends(get_db),
    _: str = Depends(require_user),
):
    stmt = select(Incident).order_by(desc(Incident.created_at)).limit(limit)
    if status:
        stmt = stmt.where(Incident.status == IncidentStatus(status))
    if severity:
        stmt = stmt.where(Incident.severity == IncidentSeverity(severity))
    if source:
        stmt = stmt.where(Incident.source == source)
    if q:
        like = f"%{q}%"
        stmt = stmt.where(
            (Incident.title.ilike(like))
            | (Incident.summary.ilike(like))
            | (Incident.root_cause.ilike(like))
        )
    return list(db.scalars(stmt))


@router.get("/{incident_id}", response_model=IncidentRead)
async def get_incident(
    incident_id: UUID,
    db: Session = Depends(get_db),
    _: str = Depends(require_user),
):
    incident = db.get(Incident, incident_id)
    if not incident:
        raise HTTPException(404, "Incident bulunamadı")
    return incident


@router.patch("/{incident_id}", response_model=IncidentRead)
async def update_incident(
    incident_id: UUID,
    payload: IncidentUpdate,
    db: Session = Depends(get_db),
    _: str = Depends(require_user),
):
    incident = db.get(Incident, incident_id)
    if not incident:
        raise HTTPException(404, "Incident bulunamadı")

    data = payload.model_dump(exclude_unset=True)
    if "severity" in data and data["severity"]:
        data["severity"] = IncidentSeverity(data["severity"])
    if "status" in data and data["status"]:
        data["status"] = IncidentStatus(data["status"])
        if data["status"] == IncidentStatus.resolved:
            incident.resolved_at = datetime.now(UTC)
    for k, v in data.items():
        setattr(incident, k, v)
    db.commit()
    db.refresh(incident)
    return incident


@router.post("/{incident_id}/save-as-knowledge")
async def save_as_knowledge(
    incident_id: UUID,
    db: Session = Depends(get_db),
    _: str = Depends(require_user),
):
    """Çözüldükten sonra incident'i KB girişi olarak kaydet (RAG için)."""
    incident = db.get(Incident, incident_id)
    if not incident:
        raise HTTPException(404, "Incident bulunamadı")
    if not incident.resolution:
        raise HTTPException(400, "Resolution boş — önce çözümü kaydedin")

    entry: KnowledgeEntry = await upsert_knowledge_entry(
        db,
        title=incident.title,
        problem=incident.summary or incident.title,
        root_cause=incident.root_cause,
        resolution=incident.resolution,
        actors=[incident.resolver] if incident.resolver else None,
        duration_minutes=(
            int((incident.resolved_at - incident.created_at).total_seconds() // 60)
            if incident.resolved_at
            else None
        ),
        tags=incident.tags,
        system=incident.source,
    )
    incident.knowledge_entry_id = entry.id
    db.commit()
    return {"knowledge_entry_id": str(entry.id)}
