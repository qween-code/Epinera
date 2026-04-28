"""
ProManage event ayrıştırıcısı. Gerçek format netleştiğinde genişletilecek.
Şu an JSON satır satır + key=value satırlarını destekliyor.
"""
import json
from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Any


@dataclass
class ProManageEvent:
    timestamp: datetime
    severity: str
    module: str | None
    message: str
    raw: dict[str, Any]


def _parse_iso(value: str | None) -> datetime:
    if not value:
        return datetime.now(UTC)
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return datetime.now(UTC)


def parse_promanage_event(payload: str | dict) -> ProManageEvent:
    data: dict[str, Any]
    if isinstance(payload, dict):
        data = payload
    else:
        try:
            data = json.loads(payload)
        except json.JSONDecodeError:
            return ProManageEvent(
                timestamp=datetime.now(UTC),
                severity="INFO",
                module=None,
                message=payload.strip(),
                raw={"raw_text": payload},
            )

    return ProManageEvent(
        timestamp=_parse_iso(data.get("timestamp") or data.get("time") or data.get("ts")),
        severity=str(data.get("severity") or data.get("level") or "INFO").upper(),
        module=data.get("module") or data.get("source") or data.get("component"),
        message=str(data.get("message") or data.get("msg") or ""),
        raw=data,
    )
