import re
from dataclasses import dataclass
from datetime import UTC, datetime

# Birkaç yaygın log satır deseni — gerektikçe genişletilecek
_PATTERNS = [
    re.compile(
        r"^(?P<ts>\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:\.\d+)?)"
        r"\s+(?P<level>[A-Z]+)\s+(?P<msg>.*)$"
    ),
    re.compile(
        r"^\[(?P<ts>\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2})\]"
        r"\s*\[(?P<level>[A-Z]+)\]\s*(?P<msg>.*)$"
    ),
]


@dataclass
class ParsedLine:
    timestamp: datetime
    level: str
    message: str


def _parse_ts(raw: str) -> datetime:
    raw = raw.replace("T", " ")
    fmts = ["%Y-%m-%d %H:%M:%S.%f", "%Y-%m-%d %H:%M:%S"]
    for fmt in fmts:
        try:
            return datetime.strptime(raw, fmt).replace(tzinfo=UTC)
        except ValueError:
            continue
    return datetime.now(UTC)


def parse_generic_log(content: str) -> list[ParsedLine]:
    lines: list[ParsedLine] = []
    for raw in content.splitlines():
        raw = raw.rstrip()
        if not raw:
            continue
        matched = False
        for pat in _PATTERNS:
            m = pat.match(raw)
            if m:
                lines.append(
                    ParsedLine(
                        timestamp=_parse_ts(m.group("ts")),
                        level=m.group("level").upper(),
                        message=m.group("msg"),
                    )
                )
                matched = True
                break
        if not matched:
            lines.append(
                ParsedLine(timestamp=datetime.now(UTC), level="INFO", message=raw)
            )
    return lines
