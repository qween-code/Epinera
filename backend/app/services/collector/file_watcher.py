"""
Yerel klasör izleyici. backend/storage/uploads içine bir dosya düşerse
otomatik olarak analiz kuyruğuna ekler. Şu an yalnızca iskelet — workers
queue eklendiğinde tetikleyici buradan yapılacak.
"""
import asyncio
from pathlib import Path

from watchfiles import Change, awatch

from app.core.logging import get_logger

log = get_logger("collector.file_watcher")


async def watch_uploads(folder: str) -> None:
    path = Path(folder)
    path.mkdir(parents=True, exist_ok=True)
    log.info("file_watcher.start", folder=str(path))
    async for changes in awatch(str(path)):
        for change, file_path in changes:
            if change == Change.added:
                log.info("file_watcher.new_file", path=file_path)
                # TODO: kuyruğa görev ekle (workers.tasks.analyze_file)


if __name__ == "__main__":
    asyncio.run(watch_uploads("/app/storage/uploads"))
