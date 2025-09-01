import React from 'react';
import '../styles/ApiDocs.css';

const ApiDocs = () => (
  <div className="api-docs-container">
    <h1>📚 Documentação da API</h1>
    <p>
      Veja abaixo os principais endpoints da API de análise de emails. Para detalhes técnicos completos, acesse o <a href="https://guilhermev14-email-analyzer-ai.hf.space/docs" target="_blank" rel="noopener noreferrer">Swagger</a>.
    </p>

    <section className="api-section">
      <h2>🔗 Endpoints Principais</h2>
      <ul>
        <li>
          <strong>POST /analyze</strong><br />
          <span>
            Analisa o conteúdo de um email enviado como texto ou arquivo (.txt, .pdf). Retorna categoria (<b>Produtivo</b>/<b>Improdutivo</b>), sugestão de resposta e metadados.<br />
            <b>Campos:</b> <code>text</code> (form), <code>file</code> (form)
          </span>
        </li>
        <li>
          <strong>GET /categories</strong><br />
          <span>
            Lista as categorias disponíveis para classificação.<br />
            <b>Retorno:</b> <code>["Produtivo", "Improdutivo"]</code>
          </span>
        </li>
        <li>
          <strong>POST /batch-analyze</strong><br />
          <span>
            Analisa múltiplos emails de uma vez.<br />
            <b>Body:</b> <code>emails: string[]</code>
          </span>
        </li>
        <li>
          <strong>GET /health</strong><br />
          <span>
            Verifica a saúde da API.<br />
            <b>Retorno:</b> status, timestamp, versão.
          </span>
        </li>
        <li>
          <strong>GET /stats</strong><br />
          <span>
            Retorna estatísticas básicas da API (em desenvolvimento).
          </span>
        </li>
        <li>
          <strong>POST /auto-analyze</strong><br />
          <span>
            Lê emails não lidos de uma caixa de entrada via IMAP e analisa automaticamente.<br />
            <b>Campos:</b> <code>email_address</code>, <code>password</code>, <code>imap_server</code>, <code>max_emails</code>
          </span>
        </li>
        <li>
          <strong>POST /gmail-auto-analyze</strong><br />
          <span>
            Recebe o token do Google e retorna os últimos emails do Gmail classificados.<br />
            <b>Campos:</b> <code>access_token</code>, <code>max_results</code>
          </span>
        </li>
        <li>
          <strong>POST /gmail-auto-reply</strong><br />
          <span>
            Envia respostas automáticas para emails do Gmail.<br />
            <b>Campos:</b> <code>access_token</code>, <code>replies</code> (JSON string)
          </span>
        </li>
      </ul>
    </section>

    <section className="api-section">
      <h2>🔑 Autenticação</h2>
      <p>
        Para endpoints do Gmail, é necessário autenticar com Google OAuth2.<br />
        Envie o token de acesso no campo <code>access_token</code> (form-data).
      </p>
    </section>

    <section className="api-section">
      <h2>📦 Exemplos de Requisição</h2>
      <pre>
{`POST /analyze
Content-Type: multipart/form-data

text: "Prezados, gostaria de solicitar um orçamento urgente..."
file: (opcional) arquivo.txt ou arquivo.pdf
`}
      </pre>
      <pre>
{`POST /batch-analyze
Content-Type: application/json

{
  "emails": [
    "Email 1...",
    "Email 2..."
  ]
}
`}
      </pre>
      <pre>
{`POST /gmail-auto-analyze
Content-Type: multipart/form-data

access_token: <token>
max_results: 10
`}
      </pre>
    </section>

    <section className="api-section">
      <h2>📝 Dúvidas?</h2>
      <p>
        Consulte o <a href="https://guilhermev14-email-analyzer-ai.hf.space/docs" target="_blank" rel="noopener noreferrer">Swagger</a> para exemplos detalhados ou entre em contato pelo <a href="https://github.com/guilhermeViana14" target="_blank" rel="noopener noreferrer">GitHub</a>.
      </p>
    </section>
  </div>
);

export default ApiDocs;