"""
OpenAI-compatible provider. Şu servislerle çalışır:
  - LM Studio (lokal, ücretsiz, web UI ile model indir)
  - vLLM / Text Generation Inference (self-hosted)
  - LiteLLM proxy (TÜM sağlayıcıları tek endpoint'te birleştirir)
  - OpenRouter, DeepInfra, Together, Groq, Fireworks (API)
  - OpenAI (resmi)

Aboneliğinizle giriş yapacağınız bir servisi LiteLLM ile köprüleyip
bu provider üzerinden kullanabilirsiniz; örnek için
docs/integration-ai-providers.md'ye bakın.
"""
import base64
from pathlib import Path

import httpx

from app.core.config import get_settings
from app.services.ai.base import AIMessage, AIProvider, AIResponse


def _image_data_url(path: str) -> str:
    p = Path(path)
    media_type = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".gif": "image/gif",
    }.get(p.suffix.lower(), "image/png")
    data = base64.b64encode(p.read_bytes()).decode()
    return f"data:{media_type};base64,{data}"


class OpenAICompatProvider(AIProvider):
    name = "openai_compat"

    def __init__(self) -> None:
        settings = get_settings()
        if not settings.openai_compat_base_url:
            raise RuntimeError("OPENAI_COMPAT_BASE_URL ayarlı değil")
        self.base_url = settings.openai_compat_base_url.rstrip("/")
        self.api_key = settings.openai_compat_api_key
        self.text_model = settings.openai_compat_text_model
        self.vision_model = settings.openai_compat_vision_model
        self.triage_model = settings.openai_compat_triage_model
        self.heavy_model = settings.openai_compat_heavy_model
        self.embed_model = settings.openai_compat_embed_model
        self._openrouter_referer = settings.openrouter_http_referer
        self._openrouter_title = settings.openrouter_x_title

    def _headers(self) -> dict:
        h = {"Content-Type": "application/json"}
        if self.api_key:
            h["Authorization"] = f"Bearer {self.api_key}"
        # OpenRouter önerilen başlıklar — hata durumunda zararsız
        if "openrouter.ai" in self.base_url:
            if self._openrouter_referer:
                h["HTTP-Referer"] = self._openrouter_referer
            if self._openrouter_title:
                h["X-Title"] = self._openrouter_title
        return h

    def _pick_model(self, has_image: bool, profile: str | None) -> str:
        if profile == "triage" and self.triage_model:
            return self.triage_model
        if profile == "heavy" and self.heavy_model:
            return self.heavy_model
        return self.vision_model if has_image else self.text_model

    async def complete(
        self,
        messages: list[AIMessage],
        system: str | None = None,
        temperature: float = 0.2,
        max_tokens: int = 2048,
        profile: str | None = None,
    ) -> AIResponse:
        has_image = any(m.image_paths for m in messages)
        model = self._pick_model(has_image, profile)

        oai_messages: list[dict] = []
        if system:
            oai_messages.append({"role": "system", "content": system})
        for m in messages:
            if not m.image_paths:
                oai_messages.append({"role": m.role, "content": m.text})
                continue
            content: list[dict] = [{"type": "text", "text": m.text}]
            for p in m.image_paths:
                content.append(
                    {"type": "image_url", "image_url": {"url": _image_data_url(p)}}
                )
            oai_messages.append({"role": m.role, "content": content})

        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.post(
                f"{self.base_url}/chat/completions",
                headers=self._headers(),
                json={
                    "model": model,
                    "messages": oai_messages,
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                },
            )
            resp.raise_for_status()
            data = resp.json()

        text = data["choices"][0]["message"]["content"] or ""
        return AIResponse(text=text, raw=data)

    async def embed(self, texts: list[str]) -> list[list[float]]:
        if not self.embed_model:
            raise RuntimeError(
                "OPENAI_COMPAT_EMBED_MODEL boş — embedding için ayrı bir provider "
                "kullanın (EMBEDDING_PROVIDER=ollama önerilir, OpenRouter free "
                "tier embedding sunmaz)."
            )
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(
                f"{self.base_url}/embeddings",
                headers=self._headers(),
                json={"model": self.embed_model, "input": texts},
            )
            resp.raise_for_status()
            data = resp.json()
        return [row["embedding"] for row in data["data"]]
