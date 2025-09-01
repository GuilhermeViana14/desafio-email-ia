import React, { useState, useEffect, useContext } from 'react';
import { fetchEmails, sendReplies } from '../services/gmailApi';
import '../styles/GmailAnalyzer.css';
import { Home } from 'lucide-react';
import { UserContext } from '../context/UserContext';

/**
 * Componente GmailAnalyzer
 * Permite ao usuário analisar seus emails do Gmail via OAuth2,
 * visualizar classificação e sugestão de resposta, e responder automaticamente.
 * Agora exibe emails paginados, 5 por página.
 * Usa contexto global para pegar o accessToken do usuário logado.
 */
const GmailAnalyzer = () => {
  const { user } = useContext(UserContext);
  const accessToken = user?.accessToken;

  const [emails, setEmails] = useState([]);
  const [selected, setSelected] = useState([]);
  const [responded, setResponded] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [maxResults, setMaxResults] = useState(10);

  const [currentPage, setCurrentPage] = useState(1);
  const emailsPerPage = 5;
  const totalPages = Math.ceil(emails.length / emailsPerPage);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleAnalyzeGmail = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const data = await fetchEmails(accessToken, maxResults);
      setEmails(data.results || []);
      setSelected([]);
      setResponded([]);
      setCurrentPage(1);
    } catch (err) {
      setError('Erro ao buscar emails do Gmail.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = idx => {
    setSelected(prev =>
      prev.includes(idx)
        ? prev.filter(i => i !== idx)
        : [...prev, idx]
    );
  };

  const handleSendReplies = async () => {
    setSending(true);
    setError('');
    setSuccess('');
    try {
      const replies = selected.map(idx => ({
        to_email: emails[idx].from,
        subject: emails[idx].subject,
        body: emails[idx].suggestion,
        thread_id: emails[idx].thread_id || undefined
      }));
      const res = await sendReplies(accessToken, replies);

      const sentIndexes = selected.filter((idx, i) => res.results[i]?.status === 'sent');
      setResponded(prev => [...prev, ...sentIndexes]);
      setSelected([]);

      if (sentIndexes.length > 0) {
        setSuccess(`Email(s) respondido(s) com sucesso: ${sentIndexes.length}`);
      } else {
        setError('Nenhum email foi respondido com sucesso.');
      }
    } catch (err) {
      setError('Erro ao enviar respostas automáticas.');
    } finally {
      setSending(false);
    }
  };

  const startIdx = (currentPage - 1) * emailsPerPage;
  const endIdx = startIdx + emailsPerPage;
  const emailsToShow = emails.slice(startIdx, endIdx);

  const renderPagination = () => (
    <div className="gmail-pagination">
      <button
        onClick={() => setCurrentPage(1)}
        disabled={currentPage === 1}
        title="Primeira página"
        className="gmail-pagination-btn"
      >
        <Home size={18} />
      </button>
      <button
        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        title="Anterior"
        className="gmail-pagination-btn"
      >
        ←
      </button>
      <span className="gmail-pagination-info">
        {currentPage} / {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        title="Próxima"
        className="gmail-pagination-btn"
      >
        →
      </button>
    </div>
  );

  // Se não estiver logado, mostra mensagem centralizada
  if (!accessToken) {
    return (
      <section className="gmail-login-bg">
        <div className="gmail-login-card">
          <h2>
            <span role="img" aria-label="cadeado">🔒</span> <span className="gmail-login-title">Login necessário</span>
          </h2>
          <p>
            Para analisar seus emails do Gmail, faça login com sua conta Google.
          </p>
          <p>
            Clique em "Login com Google" no topo da página para continuar.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="gmail-analyzer">
      <h2>📧 Analisar meus emails do Gmail</h2>
      <div className="gmail-analyzer-form">
        <label>
          Quantidade de emails:&nbsp;
          <input
            type="number"
            min={1}
            max={50}
            value={maxResults}
            onChange={e => setMaxResults(Number(e.target.value))}
          />
        </label>
        <button onClick={handleAnalyzeGmail} disabled={loading || !accessToken}>
          {loading ? 'Analisando...' : 'Analisar Gmail'}
        </button>
      </div>
      {error && <div className="gmail-analyzer-error">{error}</div>}
      {success && (
        <div className="popup-success">
          {success}
          <button className="close-popup" onClick={() => setSuccess('')}>×</button>
        </div>
      )}
      {emails.length > 0 && (
        <div className="gmail-results">
          <h3>Resultados:</h3>
          {renderPagination()}
          <div className="emails-list">
            {emailsToShow.map((email, idx) => {
              const globalIdx = startIdx + idx;
              return (
                <div key={globalIdx} className={`email-card ${email.category.toLowerCase()}${responded.includes(globalIdx) ? ' responded' : ''}`}>
                  <div className="email-header">
                    <span className="email-subject">{email.subject}</span>
                    <span className="email-category">{email.category === 'Produtivo' ? '🟢 Produtivo' : '🔴 Improdutivo'}</span>
                  </div>
                  <div className="email-from">
                    <strong>De:</strong> {email.from}
                  </div>
                  <div className="email-preview">
                    <strong>Preview:</strong> {email.body_preview}
                  </div>
                  <div className="email-suggestion">
                    <strong>Sugestão:</strong> <span>{email.suggestion}</span>
                  </div>
                  {email.category === 'Produtivo' && !responded.includes(globalIdx) && (
                    <label className="select-reply">
                      <input
                        type="checkbox"
                        checked={selected.includes(globalIdx)}
                        onChange={() => handleSelect(globalIdx)}
                        disabled={email.already_replied}
                      />
                      Responder automaticamente
                      {email.already_replied && (
                        <span style={{ color: '#f59e42', marginLeft: 8 }}>Já respondido</span>
                      )}
                    </label>
                  )}
                  {responded.includes(globalIdx) && (
                    <div className="email-responded">
                      ✔️ Respondido automaticamente
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {selected.length > 0 && (
            <button
              className="send-replies-btn"
              onClick={handleSendReplies}
              disabled={sending}
            >
              {sending ? 'Enviando...' : `Enviar respostas automáticas (${selected.length})`}
            </button>
          )}
          {renderPagination()}
        </div>
      )}
    </section>
  );
};

export default GmailAnalyzer;