"""
PaddleOCR wrapper. Lazy yükleme — modeller ilk çağrıda inşa edilir.
"""
from functools import lru_cache

from app.core.config import get_settings


@lru_cache(maxsize=1)
def _get_engine():
    from paddleocr import PaddleOCR  # lazy import (ağır)

    settings = get_settings()
    langs = settings.ocr_langs.split(",")
    primary_lang = langs[0].strip() if langs else "en"
    return PaddleOCR(use_angle_cls=True, lang=primary_lang, show_log=False)


def extract_text_from_image(image_path: str) -> str:
    engine = _get_engine()
    result = engine.ocr(image_path, cls=True)
    if not result:
        return ""
    lines: list[str] = []
    for page in result:
        if not page:
            continue
        for line in page:
            if line and len(line) >= 2 and isinstance(line[1], tuple | list) and line[1]:
                text = line[1][0]
                if text:
                    lines.append(str(text))
    return "\n".join(lines)
