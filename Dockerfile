FROM python:3.9-slim

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements primeiro (para cache do Docker)
COPY requirements.txt .

# Instalar dependências Python
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Verificar se uvicorn foi instalado (debug)
RUN which uvicorn || echo "uvicorn not found"
RUN pip list | grep uvicorn || echo "uvicorn not in pip list"

# Copiar código da aplicação
COPY backend/ ./backend/

# Configurar PYTHONPATH
ENV PYTHONPATH=/app/backend
ENV PATH="/usr/local/bin:$PATH"

# Expor porta
EXPOSE 7860

# Usar python -m uvicorn em vez de uvicorn direto
CMD ["python", "-m", "uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "7860"]