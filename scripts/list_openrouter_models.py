"""
OpenRouter free modellerini listeler. `:free` etiketli, multimodal /
görev kategorilerine göre gruplanmış model listesi yazdırır.

Çalıştırma (env içinden API key okur):
  docker compose exec backend python -m scripts.list_openrouter_models

Ya da CSV:
  docker compose exec backend python -m scripts.list_openrouter_models --csv > models.csv

Çıktıyı docs/ai-models-curation.md içine kopyalayın; haftada 1 yenileyin.
"""
from __future__ import annotations

import argparse
import asyncio
import csv
import sys

import httpx

from app.core.config import get_settings

API_URL = "https://openrouter.ai/api/v1/models"


async def fetch() -> list[dict]:
    settings = get_settings()
    headers: dict[str, str] = {}
    if settings.openai_compat_api_key:
        headers["Authorization"] = f"Bearer {settings.openai_compat_api_key}"
    async with httpx.AsyncClient(timeout=30.0) as client:
        r = await client.get(API_URL, headers=headers)
        r.raise_for_status()
        return r.json().get("data", [])


def is_free(model: dict) -> bool:
    if model.get("id", "").endswith(":free"):
        return True
    pricing = model.get("pricing") or {}
    try:
        prompt = float(pricing.get("prompt", "0") or 0)
        completion = float(pricing.get("completion", "0") or 0)
        return prompt == 0 and completion == 0
    except (ValueError, TypeError):
        return False


def supports_vision(model: dict) -> bool:
    modalities = model.get("architecture", {}).get("input_modalities") or []
    return "image" in modalities


def context_length(model: dict) -> int:
    return int(model.get("context_length") or 0)


def render_table(models: list[dict]) -> None:
    rows = [
        (
            m["id"],
            f"{context_length(m):,}",
            "✓" if supports_vision(m) else "",
            (m.get("name") or "")[:60],
        )
        for m in models
    ]
    headers = ("model id", "ctx", "vision", "name")
    widths = [max(len(str(r[i])) for r in [headers, *rows]) for i in range(len(headers))]

    def line(cols: tuple) -> str:
        return "  ".join(str(c).ljust(widths[i]) for i, c in enumerate(cols))

    print(line(headers))
    print(line(tuple("-" * w for w in widths)))
    for row in rows:
        print(line(row))


def render_csv(models: list[dict]) -> None:
    writer = csv.writer(sys.stdout)
    writer.writerow(["id", "context_length", "vision", "name"])
    for m in models:
        writer.writerow(
            [
                m["id"],
                context_length(m),
                int(supports_vision(m)),
                m.get("name") or "",
            ]
        )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--csv", action="store_true", help="CSV biçiminde çıktı")
    parser.add_argument(
        "--all", action="store_true", help="Sadece :free değil, tüm modelleri göster"
    )
    args = parser.parse_args()

    models = asyncio.run(fetch())
    if not args.all:
        models = [m for m in models if is_free(m)]

    # Önce vision destekli, sonra büyük bağlam, sonra alfabetik
    models.sort(key=lambda m: (-int(supports_vision(m)), -context_length(m), m["id"]))

    if args.csv:
        render_csv(models)
    else:
        print(f"# OpenRouter — {len(models)} model")
        print()
        render_table(models)


if __name__ == "__main__":
    main()
