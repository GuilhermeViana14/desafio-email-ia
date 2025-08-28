from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import sys
import os

# Adicionar backend ao path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from src.core.config import settings
from src.api.routes.analyze import router as analyze_router

# Criar app FastAPI
app = FastAPI(
    title=settings.APP_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS para Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rotas
app.include_router(analyze_router, prefix=settings.API_V1_STR)

# Handler para Vercel Serverless
handler = Mangum(app, lifespan="off")