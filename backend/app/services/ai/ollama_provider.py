import base64
from pathlib import Path

import httpx

from app.core.config import get_settings
from app.services.ai.base import AIMessage, AIProvider, AIResponse


class OllamaProvider(AIProvider):
    name = "ollama"

    def __init__(self) -> None:
        settings = get_settings()
        self.base_url = settings.ollama_base_url.rstrip("/")
        self.text_model = settings.ollama_text_model
        self.vision_model = settings.ollama_vision_model
        self.embed_model = settings.ollama_embed_model

    async def complete(
        self,
        messages: list[AIMessage],
        system: str | None = None,
        temperature: float = 0.2,
        max_tokens: int = 2048,
    ) -> AIResponse:
        has_image = any(m.image_paths for m in messages)
        model = self.vision_model if has_image else self.text_model

        ollama_messages = []
        if system:
            ollama_messages.append({"role": "system", "content": system})
        for m in messages:
            entry: dict = {"role": m.role, "content": m.text}
            if m.image_paths:
                entry["images"] = [
                    base64.b64encode(Path(p).read_bytes()).decode() for p in m.image_paths
                ]
            ollama_messages.append(entry)

        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.post(
                f"{self.base_url}/api/chat",
                json={
                    "model": model,
                    "messages": ollama_messages,
                    "stream": False,
                    "options": {"temperature": temperature, "num_predict": max_tokens},
                },
            )
            resp.raise_for_status()
            data = resp.json()

        return AIResponse(text=data.get("message", {}).get("content", ""), raw=data)

    async def embed(self, texts: list[str]) -> list[list[float]]:
        async with httpx.AsyncClient(timeout=60.0) as client:
            out: list[list[float]] = []
            for t in texts:
                resp = await client.post(
                    f"{self.base_url}/api/embeddings",
                    json={"model": self.embed_model, "prompt": t},
                )
                resp.raise_for_status()
                out.append(resp.json()["embedding"])
            return out
