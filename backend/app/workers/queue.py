"""
Hafif arka plan worker'ı. Şu an file_watcher'ı çalıştırıyor;
ileride RQ tabanlı task queue eklenecek.
"""
import asyncio

from app.core.config import get_settings
from app.core.logging import configure_logging, get_logger
from app.services.collector.file_watcher import watch_uploads

configure_logging()
log = get_logger("worker")


async def main() -> None:
    settings = get_settings()
    upload_path = f"{settings.storage_root}/{settings.upload_subdir}"
    await asyncio.gather(watch_uploads(upload_path))


if __name__ == "__main__":
    asyncio.run(main())
