import base64
from pathlib import Path

from anthropic import AsyncAnthropic

from app.core.config import get_settings
from app.services.ai.base import AIMessage, AIProvider, AIResponse


def _image_block(path: str) -> dict:
    p = Path(path)
    media_type = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".gif": "image/gif",
    }.get(p.suffix.lower(), "image/png")
    data = base64.b64encode(p.read_bytes()).decode()
    return {
        "type": "image",
        "source": {"type": "base64", "media_type": media_type, "data": data},
    }


class AnthropicProvider(AIProvider):
    name = "anthropic"

    def __init__(self) -> None:
        settings = get_settings()
        self.client = AsyncAnthropic(api_key=settings.anthropic_api_key)
        self.text_model = settings.ai_text_model
        self.vision_model = settings.ai_vision_model

    async def complete(
        self,
        messages: list[AIMessage],
        system: str | None = None,
        temperature: float = 0.2,
        max_tokens: int = 2048,
    ) -> AIResponse:
        anth_messages = []
        has_image = any(m.image_paths for m in messages)
        for m in messages:
            if m.role == "system":
                system = (system or "") + ("\n" + m.text if system else m.text)
                continue
            content: list[dict] = [{"type": "text", "text": m.text}]
            for path in m.image_paths or []:
                content.append(_image_block(path))
            anth_messages.append({"role": m.role, "content": content})

        model = self.vision_model if has_image else self.text_model
        resp = await self.client.messages.create(
            model=model,
            system=system or "",
            messages=anth_messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        text = "".join(b.text for b in resp.content if getattr(b, "type", None) == "text")
        return AIResponse(text=text, raw=resp.model_dump())

    async def embed(self, texts: list[str]) -> list[list[float]]:
        # Anthropic henüz native embedding sunmuyor → Ollama'ya delege ediyoruz.
        from app.services.ai.ollama_provider import OllamaProvider

        return await OllamaProvider().embed(texts)
