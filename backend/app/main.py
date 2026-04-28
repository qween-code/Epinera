import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import __version__
from app.api.router import api_router
from app.core.config import get_settings
from app.core.logging import configure_logging, get_logger

configure_logging()
log = get_logger("main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    tasks: list[asyncio.Task] = []

    if settings.promanage_log_stream_url:
        from app.services.collector.promanage_stream import run_collector

        tasks.append(asyncio.create_task(run_collector()))
        log.info("startup.promanage_collector_started")

    yield

    for t in tasks:
        t.cancel()


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="Sentinel API",
        version=__version__,
        description="SAP & ProManage Sentinel — proaktif gözetim API'si",
        lifespan=lifespan,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(api_router)
    return app


app = create_app()
