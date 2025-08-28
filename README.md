# desafio-email-ia

---
title: Email Analyzer AI
emoji: 🤖
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
---

# 🤖 Email Analyzer AI

API para classificação de emails como **Produtivos** ou **Improdutivos** usando IA.

## 🚀 Endpoints

- `GET /docs` - Documentação Swagger
- `POST /api/v1/analyze` - Analisar email
- `GET /api/v1/health` - Status da API

## 💻 Uso

```python
import requests

response = requests.post(
    "https://seu-usuario-email-analyzer-ai.hf.space/api/v1/analyze",
    data={"text": "Preciso de um orçamento urgente"}
)

print(response.json())
```

## 🔧 Tecnologias

- FastAPI
- Transformers
- PyTorch
- Pydantic