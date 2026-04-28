"""
Sistemin canlı durumu — tarayıcı topbar'da kullanıcının her an görmesi için.
"""
import asyncio

import httpx
import redis.asyncio as aioredis
from fastapi import APIRouter, Depends

from app.api.auth import require_user
from app.core.config import get_settings

router = APIRouter()


async def _check_redis(url: str) -> bool:
    try:
        client = aioredis.from_url(url, decode_responses=True)
        await client.ping()
        await client.close()
        return True
    except Exception:
        return False


async def _check_ollama(base_url: str) -> bool:
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            r = await client.get(f"{base_url.rstrip('/')}/api/tags")
            return r.is_success
    except Exception:
        return False


async def _check_openrouter(base_url: str, api_key: str) -> bool:
    if not base_url or not api_key:
        return False
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            r = await client.get(
                f"{base_url.rstrip('/')}/auth/key",
                headers={"Authorization": f"Bearer {api_key}"},
            )
            return r.is_success
    except Exception:
        return False


@router.get("/status")
async def system_status(_: str = Depends(require_user)):
    s = get_settings()

    redis_ok, ollama_ok, openrouter_ok = await asyncio.gather(
        _check_redis(s.redis_url),
        _check_ollama(s.ollama_base_url),
        _check_openrouter(s.openai_compat_base_url, s.openai_compat_api_key),
        return_exceptions=False,
    )

    return {
        "ai": {
            "primary": s.ai_provider,
            "fallback": s.ai_fallback_provider,
            "embedding": s.embedding_provider,
            "openrouter_reachable": openrouter_ok,
            "ollama_reachable": ollama_ok,
            "anthropic_configured": bool(s.anthropic_api_key),
            "models": {
                "text": s.openai_compat_text_model,
                "vision": s.openai_compat_vision_model,
                "triage": s.openai_compat_triage_model,
                "heavy": s.openai_compat_heavy_model,
                "embedding": s.ollama_embed_model
                if s.embedding_provider == "ollama"
                else s.openai_compat_embed_model,
            },
        },
        "infra": {
            "redis_reachable": redis_ok,
        },
        "promanage": {
            "configured": bool(s.promanage_log_stream_url),
            "stream_mode": s.promanage_stream_mode,
            "actions_configured": bool(s.promanage_base_url),
        },
        "ticket": {
            "smtp_configured": bool(s.smtp_host),
            "to_email": s.ticket_to_email or None,
        },
    }
