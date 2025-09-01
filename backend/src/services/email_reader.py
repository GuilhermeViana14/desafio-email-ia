import imapclient
import pyzmail
import os

def fetch_unread_emails(
    email_address: str, 
    password: str, 
    imap_server: str = 'imap.gmail.com', 
    max_emails: int = 5
):
    """
    Lê os últimos emails não lidos da caixa de entrada do usuário via IMAP.

    Parâmetros:
        email_address (str): Endereço de email do usuário.
        password (str): Senha ou app password do email.
        imap_server (str): Servidor IMAP (padrão: imap.gmail.com).
        max_emails (int): Número máximo de emails a retornar.

    Retorna:
        List[dict]: Lista de dicionários com informações dos emails:
            {
                'subject': Assunto do email,
                'from': Remetente,
                'body': Corpo do email (texto ou HTML)
            }
    """
    # Conecta ao servidor IMAP usando SSL
    server = imapclient.IMAPClient(imap_server, ssl=True)
    server.login(email_address, password)
    server.select_folder('INBOX')

    # Busca mensagens não lidas
    messages = server.search(['UNSEEN'])
    emails = []

    # Itera sobre os UIDs das mensagens não lidas (limitado por max_emails)
    for uid in messages[:max_emails]:
        raw_message = server.fetch([uid], ['BODY[]'])[uid][b'BODY[]']
        msg = pyzmail.PyzMessage.factory(raw_message)
        subject = msg.get_subject()
        from_ = msg.get_addresses('from')[0][1]
        # Tenta extrair o corpo do email (prioriza texto, depois HTML)
        if msg.text_part:
            body = msg.text_part.get_payload().decode(msg.text_part.charset)
        elif msg.html_part:
            body = msg.html_part.get_payload().decode(msg.html_part.charset)
        else:
            body = ""
        emails.append({'subject': subject, 'from': from_, 'body': body})

    # Encerra a conexão com o servidor
    server.logout()
    return emails