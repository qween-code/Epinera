"""
ProManage'da yerinde aksiyon yürütücüsü.
Gerçek API endpoint'leri henüz netleşmedi → bu modül adapter pattern ile
hazır bekliyor; payload'ı yapılandırılmış olarak loglar ve placeholder döner.
PROMANAGE_BASE_URL ayarlandığında HTTP POST yapacak.
"""
import httpx

from app.core.config import get_settings
from app.core.logging import get_logger

log = get_logger("promanage")


async def execute_promanage_action(*, action: str, payload: dict) -> dict:
    settings = get_settings()
    if not settings.promanage_base_url:
        log.info("promanage.dry_run", action=action, payload=payload)
        return {"executed": False, "dry_run": True, "action": action, "payload": payload}

    auth = None
    if settings.promanage_username:
        auth = (settings.promanage_username, settings.promanage_password)

    async with httpx.AsyncClient(timeout=30.0, auth=auth) as client:
        resp = await client.post(
            f"{settings.promanage_base_url.rstrip('/')}/actions/{action}",
            json=payload,
        )
        return {
            "executed": resp.is_success,
            "status_code": resp.status_code,
            "response": resp.text[:2000],
        }
