from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """
    Gerencia as configurações da aplicação. Carrega variáveis de ambiente se existirem.
    """
    APP_NAME: str = "Analisador de Email com IA"
    API_V1_STR: str = "/api/v1"
    CORS_ORIGINS: list[str] = ["*"]  # Em produção, restrinja para o domínio do seu frontend

settings = Settings()