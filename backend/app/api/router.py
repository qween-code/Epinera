from fastapi import APIRouter

from app.api import (
    actions,
    auth,
    chat,
    health,
    incidents,
    knowledge,
    logs,
    stats,
    system,
    uploads,
)

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(uploads.router, prefix="/uploads", tags=["uploads"])
api_router.include_router(incidents.router, prefix="/incidents", tags=["incidents"])
api_router.include_router(actions.router, prefix="/actions", tags=["actions"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(knowledge.router, prefix="/knowledge", tags=["knowledge"])
api_router.include_router(logs.router, prefix="/logs", tags=["logs"])
api_router.include_router(stats.router, prefix="/stats", tags=["stats"])
api_router.include_router(system.router, prefix="/system", tags=["system"])
