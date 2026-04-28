from app.core.config import get_settings
from app.services.ai.anthropic_provider import AnthropicProvider
from app.services.ai.base import AIProvider
from app.services.ai.ollama_provider import OllamaProvider
from app.services.ai.openai_compat_provider import OpenAICompatProvider


def _build(name: str) -> AIProvider:
    if name == "anthropic":
        return AnthropicProvider()
    if name == "ollama":
        return OllamaProvider()
    if name == "openai_compat":
        return OpenAICompatProvider()
    raise ValueError(f"Unknown AI provider: {name}")


class FallbackProvider(AIProvider):
    name = "fallback"

    def __init__(self, primary: AIProvider, fallback: AIProvider) -> None:
        self.primary = primary
        self.fallback = fallback

    async def complete(self, *args, **kwargs):
        try:
            return await self.primary.complete(*args, **kwargs)
        except Exception:
            return await self.fallback.complete(*args, **kwargs)

    async def embed(self, texts):
        try:
            return await self.primary.embed(texts)
        except Exception:
            return await self.fallback.embed(texts)


def get_ai_provider() -> AIProvider:
    settings = get_settings()
    primary = _build(settings.ai_provider)
    if settings.ai_fallback_provider == "none" or settings.ai_fallback_provider == settings.ai_provider:
        return primary
    fallback = _build(settings.ai_fallback_provider)
    return FallbackProvider(primary, fallback)
