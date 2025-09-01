from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from src.core.config import settings
from src.api.routes.analyze import router as analyze_router

# Criar app FastAPI
app = FastAPI(
    title=settings.APP_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS para frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rotas
app.include_router(analyze_router, prefix=settings.API_V1_STR)

# Handler para Vercel Serverless (manter para caso queira usar Vercel depois)
handler = Mangum(app, lifespan="off")

# Para desenvolvimento local E Hugging Face Spaces
if __name__ == "__main__":
    import uvicorn
    # Ajustar para HF Spaces (porta 7860) e produção
    import os
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=False)