# Desafio Email IA

## Como rodar o projeto

### Frontend (React)

1. Acesse a pasta do frontend:
    ```bash
    cd frontend
    ```
2. Instale as dependências:
    ```bash
    npm install
    ```
3. Inicie o servidor de desenvolvimento:
    ```bash
    npm start
    ```
    O app estará disponível em `http://localhost:3000`.

### Backend (Python FastAPI)

1. Acesse a pasta do backend:
    ```bash
    cd backend
    ```
2. (Opcional) Crie e ative um ambiente virtual:
    ```bash
    python -m venv venv
    venv\Scripts\activate  # Windows
    # ou
    source venv/bin/activate  # Linux/Mac
    ```
3. Instale as dependências:
    ```bash
    pip install -r requirements.txt
    ```
4. Inicie o servidor FastAPI:
    ```bash
    uvicorn src.app:app --reload
    ```
    O backend estará disponível em `http://localhost:8000`.


### ⚠️ Google OAuth2.0

Para usar os endpoints de integração com Gmail (OAuth2.0), é necessário um arquivo de credenciais do Google:

- Baixe o arquivo de credenciais (ex: `client_secret.json`) no Google Cloud Console.
- Coloque o arquivo na pasta apropriada do backend (ex:`backend/src/service`).
- O arquivo deve conter o `client_id`, `client_secret` e `redirect_uris`.

Sem esse arquivo, os endpoints `/gmail-auto-analyze` e `/gmail-auto-reply` não funcionarão.

### Observações
- O frontend e o backend devem rodar simultaneamente para funcionamento completo.
- Ajuste as URLs de API no frontend para apontar para o backend (`http://localhost:8000`).
- Para deploy, utilize serviços como Vercel (frontend) e serviços de nuvem para o backend.

=======
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
- `POST /analyze` - Analisar email (texto ou arquivo)
- `GET /categories` - Listar categorias disponíveis
- `POST /batch-analyze` - Analisar múltiplos emails
- `GET /health` - Status da API
- `GET /stats` - Estatísticas da API
- `POST /auto-analyze` - Ler e analisar emails via IMAP
- `POST /gmail-auto-analyze` - Ler e analisar emails via Gmail OAuth
- `POST /gmail-auto-reply` - Enviar respostas automáticas via Gmail OAuth

=======

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

