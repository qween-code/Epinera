"""
Canlı log akışı: Redis pub/sub kanalını dinler ve WebSocket istemcilerine iletir.
Ayrıca kalıcı log_event'leri sorgulamak için REST endpoint sağlar.
"""
import asyncio
import json

import redis.asyncio as aioredis
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.api.auth import require_user
from app.core.config import get_settings
from app.core.logging import get_logger
from app.core.security import decode_access_token
from app.db.models import LogEvent
from app.db.session import get_db
from app.services.collector.promanage_stream import CHANNEL

router = APIRouter()
log = get_logger("api.logs")


@router.get("/recent")
async def list_recent(
    source: str | None = None,
    limit: int = 200,
    db: Session = Depends(get_db),
    _: str = Depends(require_user),
):
    stmt = select(LogEvent).order_by(desc(LogEvent.observed_at)).limit(limit)
    if source:
        stmt = stmt.where(LogEvent.source == source)
    return [
        {
            "id": str(e.id),
            "source": e.source,
            "stream": e.stream,
            "severity": e.severity,
            "message": e.message,
            "observed_at": e.observed_at.isoformat(),
        }
        for e in db.scalars(stmt)
    ]


@router.websocket("/stream")
async def log_stream(websocket: WebSocket):
    settings = get_settings()
    token = websocket.query_params.get("token")
    if not token or not decode_access_token(token):
        await websocket.close(code=4401)
        return

    await websocket.accept()
    redis = aioredis.from_url(settings.redis_url, decode_responses=True)
    pubsub = redis.pubsub()
    await pubsub.subscribe(CHANNEL)

    async def reader():
        async for raw in pubsub.listen():
            if raw["type"] != "message":
                continue
            try:
                await websocket.send_text(raw["data"])
            except Exception:  # noqa: BLE001
                break

    task = asyncio.create_task(reader())
    try:
        while True:
            # ping/keep-alive — istemci bağlı kaldıkça bekle
            msg = await websocket.receive_text()
            if msg == "ping":
                await websocket.send_text(json.dumps({"type": "pong"}))
    except WebSocketDisconnect:
        log.info("ws.disconnect")
    finally:
        task.cancel()
        await pubsub.unsubscribe(CHANNEL)
        await pubsub.close()
        await redis.close()
