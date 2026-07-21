from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def normalize_database_url(url: str) -> str:
    """Railway/Heroku suelen dar postgres:// o postgresql://; SQLAlchemy + psycopg3 necesita +psycopg."""
    value = url.strip()
    if value.startswith("postgres://"):
        return "postgresql+psycopg://" + value.removeprefix("postgres://")
    if value.startswith("postgresql://"):
        return "postgresql+psycopg://" + value.removeprefix("postgresql://")
    return value


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str = Field(
        default="postgresql+psycopg://postgres:postgres@localhost:5432/salto",
        alias="DATABASE_URL",
    )
    jwt_secret: str = Field(default="dev-secret-change-me", alias="JWT_SECRET")
    jwt_expire_minutes: int = Field(default=60 * 24 * 7, alias="JWT_EXPIRE_MINUTES")
    anthropic_api_key: str = Field(default="", alias="ANTHROPIC_API_KEY")
    anthropic_model: str = Field(
        default="claude-sonnet-5",
        alias="ANTHROPIC_MODEL",
    )
    allowed_origins: str = Field(default="http://localhost:3000", alias="ALLOWED_ORIGINS")
    super_admin_email: str = Field(default="admin@example.com", alias="SUPER_ADMIN_EMAIL")
    super_admin_password: str = Field(default="change-me", alias="SUPER_ADMIN_PASSWORD")
    super_admin_nombre: str = Field(default="Super Admin", alias="SUPER_ADMIN_NOMBRE")
    revalidate_url: str = Field(default="", alias="REVALIDATE_URL")
    revalidate_secret: str = Field(default="", alias="REVALIDATE_SECRET")
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")

    @field_validator("database_url", mode="before")
    @classmethod
    def _normalize_database_url(cls, value: object) -> object:
        if isinstance(value, str) and value:
            return normalize_database_url(value)
        return value

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
