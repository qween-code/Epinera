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

    ai_provider: Literal["anthropic", "ollama"] = "anthropic"
    ai_text_model: str = "claude-opus-4-7"
    ai_vision_model: str = "claude-opus-4-7"
    ai_fallback_provider: Literal["anthropic", "ollama", "none"] = "ollama"

    anthropic_api_key: str = ""
    ollama_base_url: str = "http://host.docker.internal:11434"
    ollama_text_model: str = "llama3.1:8b"
    ollama_vision_model: str = "qwen2-vl:7b"

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
