from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class AIMessage:
    role: str  # "user" | "assistant" | "system"
    text: str
    image_paths: list[str] | None = None  # multimodal


@dataclass
class AIResponse:
    text: str
    raw: dict | None = None


class AIProvider(ABC):
    name: str = "base"

    @abstractmethod
    async def complete(
        self,
        messages: list[AIMessage],
        system: str | None = None,
        temperature: float = 0.2,
        max_tokens: int = 2048,
        profile: str | None = None,  # "triage" | "heavy" | None — provider içinde model seçer
    ) -> AIResponse:
        ...

    @abstractmethod
    async def embed(self, texts: list[str]) -> list[list[float]]:
        ...
