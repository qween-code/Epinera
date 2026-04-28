"""
Ticket adapter. Şu an SAP/Albil ticketing sistemine doğrudan API erişimi yok,
bu yüzden ticket = yapılandırılmış email + lokal kayıt.
İleride bir ticket sistemi (Jira, ServiceNow, Albil API) eklenirse buraya
yeni bir adapter sınıfı eklenebilir.
"""
from app.core.config import get_settings
from app.services.actions.email_sender import send_email


async def open_ticket(
    *,
    title: str,
    description: str,
    severity: str,
    system: str,
    extra: dict | None = None,
) -> dict:
    settings = get_settings()
    body_lines = [
        f"Severity : {severity}",
        f"System   : {system}",
        "",
        description,
    ]
    if extra:
        body_lines.append("")
        body_lines.append("--- Ek bilgi ---")
        for k, v in extra.items():
            body_lines.append(f"{k}: {v}")

    if settings.ticket_to_email:
        result = await send_email(
            to=settings.ticket_to_email,
            subject=f"[Sentinel][{system.upper()}][{severity.upper()}] {title}",
            body="\n".join(body_lines),
        )
        return {"channel": "email", **result}

    return {"channel": "noop", "sent": False, "reason": "TICKET_TO_EMAIL boş"}
