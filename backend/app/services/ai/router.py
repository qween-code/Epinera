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
    """
    complete() — birincil sağlayıcı çağrılır, hata olursa fallback'e geçer.
    embed() — opsiyonel olarak ayrı bir provider'a (embedding_provider) yönlenir;
              bu sayede chat OpenRouter'da, embedding lokal Ollama'da kalabilir.
    """

    name = "fallback"

    def __init__(
        self,
        primary: AIProvider,
        fallback: AIProvider | None = None,
        embedder: AIProvider | None = None,
    ) -> None:
        self.primary = primary
        self.fallback = fallback
        self.embedder = embedder or primary

    async def complete(self, *args, **kwargs):
        try:
            return await self.primary.complete(*args, **kwargs)
        except Exception:
            if self.fallback is None:
                raise
            return await self.fallback.complete(*args, **kwargs)

    async def embed(self, texts):
        try:
            return await self.embedder.embed(texts)
        except Exception:
            if self.fallback is not None and self.fallback is not self.embedder:
                return await self.fallback.embed(texts)
            raise


def get_ai_provider() -> AIProvider:
    settings = get_settings()
    primary = _build(settings.ai_provider)

    fallback: AIProvider | None = None
    if (
        settings.ai_fallback_provider != "none"
        and settings.ai_fallback_provider != settings.ai_provider
    ):
        fallback = _build(settings.ai_fallback_provider)

    embedder: AIProvider | None = None
    if settings.embedding_provider == settings.ai_provider:
        embedder = primary
    elif settings.embedding_provider == settings.ai_fallback_provider and fallback is not None:
        embedder = fallback
    else:
        embedder = _build(settings.embedding_provider)

    return FallbackProvider(primary=primary, fallback=fallback, embedder=embedder)
