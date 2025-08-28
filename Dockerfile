FROM python:3.9-slim

# Configurar diretório de trabalho
WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements primeiro (cache Docker)
COPY requirements.txt .

# Instalar dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação
COPY backend/ ./backend/

# Definir PYTHONPATH para imports funcionarem
ENV PYTHONPATH=/app/backend

# Expor porta
EXPOSE 7860

# Comando para rodar a aplicação
CMD ["uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "7860"]