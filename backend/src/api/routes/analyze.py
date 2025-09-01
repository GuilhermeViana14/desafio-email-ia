from fastapi import APIRouter, FastAPI, UploadFile, File, Form, HTTPException, status, Body
from typing import Optional, List
import PyPDF2
import io
import logging
from datetime import datetime
from src.services.ai_services import classify_email, suggest_response
from src.schemas.analysis import AnalysisResponse
from src.services.email_reader import fetch_unread_emails
from src.services.gmail_oauth import  fetch_latest_emails, send_gmail_reply

# APIRouter funciona de forma muito similar a um Blueprint
app = FastAPI()
router = APIRouter()

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.post(
    "/analyze",
    response_model=AnalysisResponse,
    summary="Analisa o conteúdo de um email",
    description="Recebe um texto ou um arquivo (.txt, .pdf), classifica-o como Produtivo/Improdutivo e sugere uma resposta."
)
async def analyze_email_endpoint(
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    """
    Endpoint de análise.
    - **text**: Texto do email enviado como campo de formulário.
    - **file**: Arquivo (.txt ou .pdf) enviado.
    """
    start_time = datetime.now()
    
    # Log da tentativa de análise
    logger.info(f"Iniciando análise de email às {start_time}")
    
    if not text and (not file or not file.filename):
        logger.warning("Tentativa de análise sem texto ou arquivo")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nenhum texto ou arquivo foi enviado."
        )

    email_text = ""
    file_info = None
    
    try:
        if file and file.filename and file.filename.strip():
            filename = file.filename
            file_info = {"filename": filename, "content_type": file.content_type}
            logger.info(f"Processando arquivo: {filename}")
            
            if filename.endswith(".txt"):
                contents = await file.read()
                email_text = contents.decode('utf-8')
                logger.info(f"Arquivo TXT lido com sucesso: {len(email_text)} caracteres")
                
            elif filename.endswith(".pdf"):
                try:
                    contents = await file.read()
                    pdf_buffer = io.BytesIO(contents)
                    pdf_reader = PyPDF2.PdfReader(pdf_buffer)
                    email_text = "".join(page.extract_text() for page in pdf_reader.pages)
                    logger.info(f"PDF processado com sucesso: {len(pdf_reader.pages)} páginas, {len(email_text)} caracteres")
                except Exception as e:
                    logger.error(f"Erro ao processar PDF {filename}: {str(e)}")
                    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Erro ao ler PDF: {e}")
            else:
                logger.warning(f"Formato de arquivo inválido: {filename}")
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Formato de arquivo inválido. Use .txt ou .pdf")
                
        elif text and text.strip():
            email_text = text
            logger.info(f"Texto direto recebido: {len(email_text)} caracteres")

        if not email_text.strip():
            logger.warning("Conteúdo do email está vazio após processamento")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Conteúdo do email está vazio.")

        # Realizar classificação e sugestão
        logger.info("Iniciando classificação com IA")
        category = classify_email(email_text)
        suggestion = suggest_response(email_text, category)
        
        # Calcular tempo de processamento
        processing_time = (datetime.now() - start_time).total_seconds()
        
        logger.info(f"Email classificado como '{category}' em {processing_time:.2f}s")
        
        # Preparar resposta com informações adicionais
        response_data = {
            "category": category.capitalize(),
            "suggestion": suggestion,
            "metadata": {
                "processing_time_seconds": round(processing_time, 2),
                "text_length": len(email_text),
                "processed_at": datetime.now().isoformat(),
                "file_info": file_info
            }
        }
        
        return AnalysisResponse(**response_data)
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        processing_time = (datetime.now() - start_time).total_seconds()
        logger.error(f"Erro inesperado na análise após {processing_time:.2f}s: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Erro interno do servidor: {str(e)}"
        )

@router.get("/categories", summary="Lista as categorias disponíveis")
async def get_categories():
    """
    Retorna as categorias disponíveis para classificação.
    """
    logger.info("Consulta às categorias disponíveis")
    return {
        "categories": ["Produtivo", "Improdutivo"],
        "descriptions": {
            "Produtivo": "Emails que requerem ação ou resposta específica",
            "Improdutivo": "Emails que não necessitam ação imediata"
        }
    }

@router.post("/batch-analyze", summary="Analisa múltiplos emails")
async def batch_analyze(emails: List[str]):
    """
    Analisa múltiplos emails de uma vez.
    - **emails**: Lista de textos de emails para analisar
    """
    start_time = datetime.now()
    logger.info(f"Iniciando análise em lote de {len(emails)} emails")
    
    if len(emails) > 50:  # Limite de segurança
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Máximo de 50 emails por requisição."
        )
    
    results = []
    successful = 0
    failed = 0
    
    for i, email in enumerate(emails):
        try:
            if not email.strip():
                continue
                
            category = classify_email(email)
            suggestion = suggest_response(email, category)
            results.append({
                "index": i,
                "email_preview": email[:50] + "..." if len(email) > 50 else email,
                "category": category.capitalize(),
                "suggestion": suggestion,
                "status": "success"
            })
            successful += 1
            
        except Exception as e:
            logger.error(f"Erro ao analisar email {i}: {str(e)}")
            results.append({
                "index": i,
                "email_preview": email[:50] + "..." if len(email) > 50 else email,
                "error": str(e),
                "status": "failed"
            })
            failed += 1
    
    processing_time = (datetime.now() - start_time).total_seconds()
    logger.info(f"Análise em lote concluída: {successful} sucessos, {failed} falhas em {processing_time:.2f}s")
    
    return {
        "results": results,
        "summary": {
            "total": len(emails),
            "successful": successful,
            "failed": failed,
            "processing_time_seconds": round(processing_time, 2)
        }
    }

@router.get("/health", summary="Verifica a saúde da API")
async def health_check():
    """
    Endpoint de verificação de saúde da API.
    """
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "service": "Email Analysis API",
        "version": "1.0.0"
    }

@router.get("/stats", summary="Estatísticas da API")
async def get_stats():
    """
    Retorna estatísticas básicas da API (implementação futura).
    """
    return {
        "message": "Estatísticas em desenvolvimento",
        "available_endpoints": [
            "/analyze",
            "/batch-analyze", 
            "/categories",
            "/health",
            "/stats"
        ]
    }
    
    
@router.post("/auto-analyze", summary="Lê e analisa emails automaticamente")
async def auto_analyze_emails(
    email_address: str = Form(...),
    password: str = Form(...),
    imap_server: str = Form("imap.gmail.com"),
    max_emails: int = Form(5)
):
    """
    Lê emails não lidos da caixa de entrada e analisa automaticamente.
    """
    try:
        emails = fetch_unread_emails(email_address, password, imap_server, max_emails)
        results = []
        for email in emails:
            text = f"{email['subject']}\n\n{email['body']}"
            category = classify_email(text)
            suggestion = suggest_response(text, category)
            results.append({
                "subject": email['subject'],
                "from": email['from'],
                "category": category.capitalize(),
                "suggestion": suggestion,
                "body_preview": email['body'][:100] + "..." if len(email['body']) > 100 else email['body']
            })
        return {"results": results, "total": len(results)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao ler emails: {str(e)}")

@router.post("/gmail-auto-analyze")
async def gmail_auto_analyze(
    access_token: str = Form(...),
    max_results: int = Form(10)
):
    """
    Recebe o token do Google e retorna os últimos emails da caixa de entrada,
    classificados como Produtivo ou Improdutivo.
    """
    try:
        emails = fetch_latest_emails(access_token, max_results)
        return {"results": emails, "total": len(emails)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar emails: {str(e)}")
    
    

@router.post("/gmail-auto-reply")
async def gmail_auto_reply(
    access_token: str = Form(...),
    replies: str = Form(...)
):
    """
    Recebe o token e uma lista de respostas automáticas para enviar.
    replies: JSON string [{"to_email", "subject", "body", "thread_id"}]
    """
    import json
    try:
        replies_list = json.loads(replies)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Formato de replies inválido: {str(e)}")

    results = []
    for reply in replies_list:
        try:
            sent = send_gmail_reply(
                access_token,
                reply['to_email'],
                reply['subject'],
                reply['body'],
                reply.get('thread_id')
            )
            results.append({"to": reply['to_email'], "status": "sent", "id": sent.get('id')})
        except Exception as e:
            results.append({"to": reply['to_email'], "status": "error", "error": str(e)})
    return {"results": results}