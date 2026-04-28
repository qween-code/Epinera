"""
Pano (dashboard) için yoğun-tutulmuş KPI verisi.
Tek endpoint ile front-end tek istek atıp tüm widget'ları doldurur.
"""
from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.auth import require_user
from app.db.models import Incident, IncidentSeverity, IncidentStatus, LogEvent
from app.db.session import get_db

router = APIRouter()


@router.get("/dashboard")
async def dashboard_stats(
    db: Session = Depends(get_db),
    _: str = Depends(require_user),
):
    now = datetime.now(UTC)
    last_24h = now - timedelta(hours=24)
    last_7d = now - timedelta(days=7)

    # severity dağılımı (açık olanlar)
    open_status = [
        IncidentStatus.detected,
        IncidentStatus.analyzing,
        IncidentStatus.awaiting_action,
        IncidentStatus.in_progress,
    ]
    sev_rows = db.execute(
        select(Incident.severity, func.count())
        .where(Incident.status.in_(open_status))
        .group_by(Incident.severity)
    ).all()
    by_severity = {s.value: 0 for s in IncidentSeverity}
    for sev, cnt in sev_rows:
        by_severity[sev.value if hasattr(sev, "value") else str(sev)] = cnt

    # status dağılımı
    status_rows = db.execute(
        select(Incident.status, func.count()).group_by(Incident.status)
    ).all()
    by_status = {s.value: 0 for s in IncidentStatus}
    for st, cnt in status_rows:
        by_status[st.value if hasattr(st, "value") else str(st)] = cnt

    # son 24 saat / 7 gün açılan
    opened_24h = db.scalar(
        select(func.count(Incident.id)).where(Incident.created_at >= last_24h)
    ) or 0
    opened_7d = db.scalar(
        select(func.count(Incident.id)).where(Incident.created_at >= last_7d)
    ) or 0
    resolved_24h = db.scalar(
        select(func.count(Incident.id)).where(Incident.resolved_at >= last_24h)
    ) or 0

    # MTTR — son 30 gün (saat cinsinden)
    last_30d = now - timedelta(days=30)
    mttr_rows = db.execute(
        select(Incident.created_at, Incident.resolved_at)
        .where(
            Incident.resolved_at.is_not(None),
            Incident.resolved_at >= last_30d,
        )
        .limit(500)
    ).all()
    mttr_seconds: list[float] = [
        (r.total_seconds()) for c, r in (
            (c, r - c) for c, r in mttr_rows if c and r
        )
    ]
    mttr_hours = round((sum(mttr_seconds) / len(mttr_seconds)) / 3600, 1) if mttr_seconds else None

    # source bazlı (sap / promanage / manual)
    source_rows = db.execute(
        select(Incident.source, func.count()).group_by(Incident.source)
    ).all()
    by_source = {src or "unknown": cnt for src, cnt in source_rows}

    # log_events son 1 saat
    last_1h = now - timedelta(hours=1)
    log_count_1h = db.scalar(
        select(func.count(LogEvent.id)).where(LogEvent.observed_at >= last_1h)
    ) or 0

    # son 24 saat hourly trend (incident açılışı)
    trend_rows = db.execute(
        select(
            func.date_trunc("hour", Incident.created_at).label("h"),
            func.count(),
        )
        .where(Incident.created_at >= last_24h)
        .group_by("h")
        .order_by("h")
    ).all()
    trend_24h = [
        {"hour": h.isoformat() if h else "", "count": c} for h, c in trend_rows
    ]

    return {
        "opened_24h": opened_24h,
        "opened_7d": opened_7d,
        "resolved_24h": resolved_24h,
        "open_total": sum(by_severity.values()),
        "by_severity": by_severity,
        "by_status": by_status,
        "by_source": by_source,
        "mttr_hours_30d": mttr_hours,
        "log_events_1h": log_count_1h,
        "trend_24h": trend_24h,
    }
