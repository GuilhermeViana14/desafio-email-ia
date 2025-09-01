from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
import base64
from email.mime.text import MIMEText
from src.services.ai_services import classify_email, suggest_response  

# Escopos necessários para ler e enviar emails pelo Gmail API
SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send'
]

def get_gmail_service_with_token(access_token):
    """
    Cria e retorna o serviço Gmail autenticado usando o access_token do usuário.
    """
    creds = Credentials(token=access_token, scopes=SCOPES)
    service = build('gmail', 'v1', credentials=creds)
    return service

def fetch_latest_emails(access_token, max_results=10):
    """
    Busca os últimos emails da caixa de entrada do usuário, classifica cada email usando IA,
    gera uma sugestão de resposta e verifica se já foi respondido na thread.

    Retorna uma lista de dicionários com informações dos emails.
    """
    service = get_gmail_service_with_token(access_token)
    results = service.users().messages().list(
        userId='me',
        labelIds=['INBOX'],
        maxResults=max_results
    ).execute()
    messages = results.get('messages', [])
    emails = []

    for msg in messages:
        # Busca os dados completos do email
        msg_data = service.users().messages().get(userId='me', id=msg['id'], format='full').execute()
        headers = msg_data['payload']['headers']
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        from_ = next((h['value'] for h in headers if h['name'] == 'From'), '')
        body = ''
        parts = msg_data['payload'].get('parts', [])
        for part in parts:
            if part['mimeType'] == 'text/plain':
                body = base64.urlsafe_b64decode(part['body'].get('data', '')).decode('utf-8', errors='ignore')

        # Texto completo para análise
        text = f"{subject}\n\n{body}"

        # Classificação e sugestão de resposta via IA
        category = classify_email(text).capitalize()
        suggestion = suggest_response(text, category)

        # Verifica se já foi respondido na thread
        thread_id = msg_data.get('threadId')
        already_replied = False
        if thread_id:
            # Busca todas as mensagens da thread
            thread_msgs = service.users().messages().list(userId='me', q=f'thread:{thread_id}').execute().get('messages', [])
            for tm in thread_msgs:
                tm_data = service.users().messages().get(userId='me', id=tm['id'], format='metadata').execute()
                print(f"Mensagem {tm['id']} labelIds: {tm_data.get('labelIds', [])}")  # Log para depuração
                # Se for uma mensagem enviada pelo usuário (label 'SENT') e não for o próprio email original
                if 'SENT' in tm_data.get('labelIds', []) and tm['id'] != msg['id']:
                    already_replied = True
                    break

        # Monta o dicionário do email para retorno
        emails.append({
            'subject': subject,
            'from': from_,
            'category': category,
            'suggestion': suggestion,
            'body_preview': body[:100] + "..." if len(body) > 100 else body,
            'thread_id': thread_id,
            'already_replied': already_replied
        })
    return emails

def send_gmail_reply(access_token, to_email, subject, body, thread_id=None):
    """
    Envia uma resposta automática para o email informado, usando o access_token do usuário.
    O email é enviado na mesma thread, se o thread_id for informado.
    """
    service = get_gmail_service_with_token(access_token)
    message = MIMEText(body)
    message['to'] = to_email
    message['subject'] = f"Re: {subject}"
    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
    msg = {'raw': raw}
    if thread_id:
        msg['threadId'] = thread_id
    sent = service.users().messages().send(userId='me', body=msg).execute()
    return sent