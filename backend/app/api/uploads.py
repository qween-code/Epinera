import hashlib
import shutil
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.api.auth import require_user
from app.core.config import get_settings
from app.db.models import (
    FileAsset,
    Incident,
    IncidentSeverity,
    IncidentStatus,
)
from app.db.session import get_db
from app.services.analyzer import analyze_payload
from app.services.ocr import extract_text_from_image
from app.services.parser import parse_generic_log, parse_sap_dump

router = APIRouter()

IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"}
TEXT_EXTS = {".log", ".txt", ".out", ".err"}


def _save_file(file: UploadFile) -> tuple[Path, int, str]:
    settings = get_settings()
    folder = Path(settings.storage_root) / settings.upload_subdir
    folder.mkdir(parents=True, exist_ok=True)
    suffix = Path(file.filename or "upload").suffix
    name = f"{uuid.uuid4().hex}{suffix}"
    target = folder / name

    hasher = hashlib.sha256()
    size = 0
    with target.open("wb") as out:
        while chunk := file.file.read(1 << 20):
            hasher.update(chunk)
            size += len(chunk)
            out.write(chunk)
    return target, size, hasher.hexdigest()


@router.post("/analyze")
async def upload_and_analyze(
    file: UploadFile = File(...),
    description: str | None = Form(None),
    source: str = Form("manual_upload"),
    db: Session = Depends(get_db),
    _: str = Depends(require_user),
) -> dict:
    if not file.filename:
        raise HTTPException(400, "Dosya adı yok")

    target, size, sha = _save_file(file)
    suffix = target.suffix.lower()

    extracted_text = ""
    image_paths: list[str] = []

    if suffix in IMAGE_EXTS:
        try:
            extracted_text = extract_text_from_image(str(target))
        except Exception as e:  # noqa: BLE001
            extracted_text = f"(OCR başarısız: {e})"
        image_paths = [str(target)]
    elif suffix in TEXT_EXTS:
        raw = target.read_text(errors="replace")
        if "ABAP" in raw or "Runtime Error" in raw:
            dump = parse_sap_dump(raw)
            extracted_text = (
                f"SAP Dump\nRuntime Error: {dump.runtime_error}\n"
                f"Short text: {dump.short_text}\nProgram: {dump.program}\n"
                f"Transaction: {dump.transaction}\nUser: {dump.user}\n\n"
                f"--- raw ---\n{raw[:6000]}"
            )
        else:
            parsed = parse_generic_log(raw)
            head = parsed[: min(len(parsed), 200)]
            extracted_text = "\n".join(
                f"{p.timestamp.isoformat()} {p.level} {p.message}" for p in head
            )
    else:
        try:
            extracted_text = target.read_text(errors="replace")[:8000]
        except Exception:  # noqa: BLE001
            extracted_text = ""

    incident = Incident(
        title=file.filename,
        source=source,
        severity=IncidentSeverity.info,
        status=IncidentStatus.analyzing,
        summary=description,
    )
    db.add(incident)
    db.flush()

    asset = FileAsset(
        incident_id=incident.id,
        filename=file.filename,
        content_type=file.content_type or "application/octet-stream",
        size_bytes=size,
        storage_path=str(target),
        sha256=sha,
        extracted_text=extracted_text,
    )
    db.add(asset)
    db.flush()

    analysis = await analyze_payload(
        db,
        text=extracted_text,
        image_paths=image_paths,
        source=source,
        extra_context=description,
    )

    incident.title = analysis.title or incident.title
    incident.severity = IncidentSeverity(analysis.severity) if analysis.severity in IncidentSeverity._value2member_map_ else incident.severity
    incident.summary = analysis.summary
    incident.root_cause = analysis.root_cause
    incident.tags = analysis.tags
    incident.status = IncidentStatus.awaiting_action

    asset.analysis = {
        "title": analysis.title,
        "severity": analysis.severity,
        "summary": analysis.summary,
        "actions": analysis.proactive_actions,
        "similar_entries": analysis.similar_entries,
    }

    # Önerilen aksiyonları kaydet
    from app.db.models.action import Action, ActionType

    for proposed in analysis.proactive_actions or []:
        action_type = proposed.get("type", "note")
        if action_type not in ActionType._value2member_map_:
            action_type = "note"
        db.add(
            Action(
                incident_id=incident.id,
                type=ActionType(action_type),
                title=proposed.get("title", "Aksiyon"),
                description=proposed.get("description"),
                payload=proposed.get("payload") or {"system": proposed.get("system")},
                requires_approval=bool(proposed.get("requires_approval", True)),
            )
        )

    db.commit()
    db.refresh(incident)

    return {
        "incident_id": str(incident.id),
        "file_id": str(asset.id),
        "analysis": {
            "title": analysis.title,
            "severity": analysis.severity,
            "summary": analysis.summary,
            "root_cause": analysis.root_cause,
            "tags": analysis.tags,
            "proactive_actions": analysis.proactive_actions,
            "similar_entries": analysis.similar_entries,
        },
    }
