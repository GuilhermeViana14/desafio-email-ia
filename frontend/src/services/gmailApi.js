import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';

class GmailService {
  constructor() {
    this.auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
      credentials: {
        client_id: process.env.REACT_APP_GMAIL_CLIENT_ID,
        client_secret: process.env.REACT_APP_GMAIL_CLIENT_SECRET,
      }
    });
  }

  // Buscar emails não lidos
  async getUnreadEmails() {
    try {
      const gmail = google.gmail({ version: 'v1', auth: this.auth });
      
      const response = await gmail.users.messages.list({
        userId: 'me',
        q: 'is:unread',
        maxResults: 10
      });

      const emails = [];
      
      for (const message of response.data.messages || []) {
        const email = await this.getEmailContent(message.id);
        emails.push(email);
      }
      
      return emails;
    } catch (error) {
      console.error('Erro ao buscar emails:', error);
      throw error;
    }
  }

  // Pegar conteúdo do email
  async getEmailContent(messageId) {
    const gmail = google.gmail({ version: 'v1', auth: this.auth });
    
    const response = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'full'
    });

    const email = response.data;
    const headers = email.payload.headers;
    
    return {
      id: messageId,
      subject: headers.find(h => h.name === 'Subject')?.value || '',
      from: headers.find(h => h.name === 'From')?.value || '',
      date: headers.find(h => h.name === 'Date')?.value || '',
      body: this.extractEmailBody(email.payload),
    };
  }

  // Extrair corpo do email
  extractEmailBody(payload) {
    let body = '';
    
    if (payload.body?.data) {
      body = Buffer.from(payload.body.data, 'base64').toString();
    } else if (payload.parts) {
      for (const part of payload.parts) {
        if (part.mimeType === 'text/plain' && part.body?.data) {
          body += Buffer.from(part.body.data, 'base64').toString();
        }
      }
    }
    
    return body;
  }
}

export default new GmailService();