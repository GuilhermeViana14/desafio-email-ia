from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class AnalysisResponse(BaseModel):
    """
    Esquema de resposta para a análise de email.
    """
    category: str
    suggestion: str
    metadata: Optional[Dict[str, Any]] = None
   
    class Config:
        json_schema_extra = {
            "example": {
                "category": "Produtivo",
                "suggestion": "Prezado(a), recebemos sua solicitação e ela já está sendo analisada por nossa equipe.",
                "metadata": {
                    "processing_time_seconds": 1.23,
                    "text_length": 150,
                    "processed_at": "2024-01-15T10:30:00",
                    "file_info": None
                }
            }
        }