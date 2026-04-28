from datetime import UTC, datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.auth import require_user
from app.db.models import Incident
from app.db.models.action import Action, ActionStatus, ActionType
from app.db.session import get_db
from app.schemas.incident import ActionRead
from app.services.actions import execute_promanage_action, open_ticket, send_email

router = APIRouter()


@router.get("/incident/{incident_id}", response_model=list[ActionRead])
async def list_actions(
    incident_id: UUID,
    db: Session = Depends(get_db),
    _: str = Depends(require_user),
):
    incident = db.get(Incident, incident_id)
    if not incident:
        raise HTTPException(404, "Incident bulunamadı")
    return incident.actions


@router.post("/{action_id}/execute")
async def execute_action(
    action_id: UUID,
    db: Session = Depends(get_db),
    _: str = Depends(require_user),
):
    action = db.get(Action, action_id)
    if not action:
        raise HTTPException(404, "Action bulunamadı")

    action.status = ActionStatus.executing
    db.commit()

    payload = action.payload or {}
    result: dict
    try:
        if action.type == ActionType.email:
            result = await send_email(
                to=payload.get("to") or "",
                subject=payload.get("subject") or action.title,
                body=payload.get("body") or action.description or "",
            )
        elif action.type == ActionType.ticket:
            result = await open_ticket(
                title=action.title,
                description=action.description or "",
                severity=payload.get("severity") or "medium",
                system=payload.get("system") or "sap",
                extra=payload.get("extra"),
            )
        elif action.type == ActionType.promanage_inplace:
            result = await execute_promanage_action(
                action=payload.get("operation") or "noop",
                payload=payload.get("data") or {},
            )
        else:
            result = {"note": action.description}
        action.result = result
        action.status = ActionStatus.succeeded
    except Exception as e:  # noqa: BLE001
        action.result = {"error": str(e)}
        action.status = ActionStatus.failed

    action.executed_at = datetime.now(UTC)
    db.commit()
    db.refresh(action)
    return {"status": action.status.value, "result": action.result}
