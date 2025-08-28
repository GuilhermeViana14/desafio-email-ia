from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from src.core.config import settings
from src.api.routes.analyze import router as analyze_router

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Cria a instância principal do FastAPI
app = FastAPI(
    title=settings.APP_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclui o roteador da nossa API
app.include_router(analyze_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Servidor iniciado com sucesso!")
    logger.info(f"📚 Documentação disponível em: http://localhost:5001/docs")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("🛑 Servidor sendo encerrado...")

# Ponto de entrada para rodar com uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5001, reload=True)