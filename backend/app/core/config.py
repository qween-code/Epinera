from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_env: Literal["development", "production"] = "development"
    app_secret_key: str = "dev-secret"
    timezone: str = "Europe/Istanbul"

    database_url: str = "postgresql+psycopg://sentinel:sentinel@postgres:5432/sentinel"
    redis_url: str = "redis://redis:6379/0"

    admin_username: str = "admin"
    admin_password: str = "change-me"

    ai_provider: Literal["anthropic", "ollama", "openai_compat"] = "openai_compat"
    ai_text_model: str = "claude-opus-4-7"
    ai_vision_model: str = "claude-opus-4-7"
    ai_fallback_provider: Literal["anthropic", "ollama", "openai_compat", "none"] = "ollama"
    embedding_provider: Literal["anthropic", "ollama", "openai_compat"] = "ollama"

    anthropic_api_key: str = ""

    ollama_base_url: str = "http://host.docker.internal:11434"
    ollama_text_model: str = "qwen3.5:9b"
    ollama_vision_model: str = "qwen3-vl:8b"
    ollama_embed_model: str = "bge-m3"

    openai_compat_base_url: str = "https://openrouter.ai/api/v1"
    openai_compat_api_key: str = ""
    openai_compat_text_model: str = "z-ai/glm-4.5-air:free"
    openai_compat_vision_model: str = "z-ai/glm-4.5-air:free"
    openai_compat_triage_model: str = "z-ai/glm-4.5-air:free"
    openai_compat_heavy_model: str = "tencent/hy3-preview:free"
    openai_compat_embed_model: str = ""
    # Vision modeli görüntü ekini destekliyor mu? Free model çoğunlukla
    # account privacy guardrail'ine takıldığı için False; OCR text'i metin
    # model'e gider, ham resim payload'a eklenmez.
    openai_compat_vision_supports_images: bool = False

    openrouter_http_referer: str = "http://localhost:3000"
    openrouter_x_title: str = "Sentinel"
    # Free modeller veri toplamasına izin verilmesini ister
    # Kilo Code'un "Allow prompt training" toggle'ı ile aynı işlevde.
    openrouter_allow_training: bool = True

    ocr_langs: str = "tr,en"

    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = "sentinel@local"
    smtp_tls: bool = True
    ticket_to_email: str = ""

    promanage_base_url: str = ""
    promanage_username: str = ""
    promanage_password: str = ""
    promanage_log_stream_url: str = ""
    promanage_stream_mode: Literal["websocket", "sse", "poll"] = "poll"
    promanage_poll_interval_seconds: int = 5

    storage_root: str = "/app/storage"
    upload_subdir: str = "uploads"
    processed_subdir: str = "processed"

    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:3000"])


@lru_cache
def get_settings() -> Settings:
    return Settings()
