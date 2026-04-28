"""
ProManage canlı log toplayıcısı. Yapılandırmaya göre üç moddan biriyle çalışır:
  - poll: REST endpoint'i belirli aralıkla sorgular
  - sse:  Server-Sent Events
  - websocket: WS bağlantısı
Tüm modlar normalize edilmiş ProManageEvent dict'i Redis pub/sub kanalına basar
("logs:promanage"). API katmanı bu kanalı okuyup WebSocket istemcilerine iletir.
"""
import asyncio
import json

import httpx
import redis.asyncio as aioredis

from app.core.config import get_settings
from app.core.logging import get_logger
from app.services.parser.promanage import parse_promanage_event

log = get_logger("promanage.stream")
CHANNEL = "logs:promanage"


async def _publish(redis: aioredis.Redis, payload: dict) -> None:
    await redis.publish(CHANNEL, json.dumps(payload, default=str))


async def _poll_loop(redis: aioredis.Redis) -> None:
    settings = get_settings()
    if not settings.promanage_log_stream_url:
        log.warning("promanage.stream.disabled", reason="PROMANAGE_LOG_STREAM_URL boş")
        return
    auth = None
    if settings.promanage_username:
        auth = (settings.promanage_username, settings.promanage_password)
    last_cursor: str | None = None
    interval = settings.promanage_poll_interval_seconds

    async with httpx.AsyncClient(timeout=20.0, auth=auth) as client:
        while True:
            try:
                params = {"since": last_cursor} if last_cursor else None
                r = await client.get(settings.promanage_log_stream_url, params=params)
                r.raise_for_status()
                batch = r.json()
                if isinstance(batch, dict) and "events" in batch:
                    last_cursor = batch.get("cursor", last_cursor)
                    batch = batch["events"]
                for raw in batch or []:
                    evt = parse_promanage_event(raw)
                    await _publish(
                        redis,
                        {
                            "ts": evt.timestamp.isoformat(),
                            "severity": evt.severity,
                            "module": evt.module,
                            "message": evt.message,
                            "raw": evt.raw,
                        },
                    )
            except Exception as e:  # noqa: BLE001
                log.error("promanage.poll.error", error=str(e))
            await asyncio.sleep(interval)


async def run_collector() -> None:
    settings = get_settings()
    redis = aioredis.from_url(settings.redis_url, decode_responses=True)
    mode = settings.promanage_stream_mode
    if mode == "poll":
        await _poll_loop(redis)
    else:
        log.warning("promanage.stream.mode_not_implemented", mode=mode)
