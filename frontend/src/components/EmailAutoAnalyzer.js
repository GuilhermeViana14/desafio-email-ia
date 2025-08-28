import React, { useState, useEffect } from 'react';
import { analyzeEmail } from '../services/api';
import gmailService from '../services/gmailApi'; // ← ADICIONAR ESTA LINHA
import { Mail, Play, Pause, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import '../styles/AutoAnalyzer.css';


const EmailAutoAnalyzer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [emails, setEmails] = useState([]);
  const [analyzedEmails, setAnalyzedEmails] = useState([]);
  const [currentEmail, setCurrentEmail] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    produtivos: 0,
    improdutivos: 0,
    processados: 0
  });

  // Auto-análise a cada 30 segundos
  useEffect(() => {
    let interval;
    
    if (isRunning) {
      interval = setInterval(() => {
        processNewEmails();
      }, 30000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning]);

  const startAutoAnalysis = async () => {
    setIsRunning(true);
    await processNewEmails();
  };

  const stopAutoAnalysis = () => {
    setIsRunning(false);
  };

  const processNewEmails = async () => {
    try {
      console.log('🔍 Buscando novos emails...');
      
      // Buscar emails não lidos
      const newEmails = await gmailService.getUnreadEmails();
      setEmails(newEmails);
      
      // Analisar cada email automaticamente
      for (const email of newEmails) {
        await analyzeEmailAutomatically(email);
      }
      
    } catch (error) {
      console.error('Erro no processamento automático:', error);
    }
  };

  const analyzeEmailAutomatically = async (email) => {
    try {
      setCurrentEmail(email);
      
      // Combinar subject + body para análise
      const fullText = `${email.subject}\n\n${email.body}`;
      
      if (fullText.trim().length < 10) return;
      
      console.log(`📧 Analisando: ${email.subject}`);
      
      // Chamar API de análise
      const result = await analyzeEmail(fullText);
      
      const analyzedEmail = {
        ...email,
        analysis: result,
        analyzedAt: new Date().toISOString(),
        priority: result.category === 'Produtivo' ? 'high' : 'low'
      };
      
      // Adicionar aos emails analisados
      setAnalyzedEmails(prev => [analyzedEmail, ...prev]);
      
      // Atualizar estatísticas
      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        processados: prev.processados + 1,
        produtivos: result.category === 'Produtivo' ? prev.produtivos + 1 : prev.produtivos,
        improdutivos: result.category === 'Improdutivo' ? prev.improdutivos + 1 : prev.improdutivos
      }));
      
      console.log(`✅ Email analisado: ${result.category}`);
      
    } catch (error) {
      console.error('Erro ao analisar email:', error);
    } finally {
      setCurrentEmail(null);
    }
  };

  const manualRefresh = async () => {
    await processNewEmails();
  };

  return (
    <section id="auto-analyzer" className="auto-analyzer">
      <div className="container">
        
        {/* Header */}
        <div className="auto-header">
          <div className="header-icon">
            <Mail size={48} />
            <RefreshCw className={`refresh-icon ${isRunning ? 'spinning' : ''}`} size={24} />
          </div>
          <h2>🤖 Análise Automática de Emails</h2>
          <p>Monitore sua caixa de entrada e classifique emails automaticamente</p>
        </div>

        {/* Controles */}
        <div className="controls-section">
          <div className="control-buttons">
            {!isRunning ? (
              <button className="start-btn" onClick={startAutoAnalysis}>
                <Play size={20} />
                Iniciar Monitoramento
              </button>
            ) : (
              <button className="stop-btn" onClick={stopAutoAnalysis}>
                <Pause size={20} />
                Parar Monitoramento
              </button>
            )}
            
            <button className="refresh-btn" onClick={manualRefresh} disabled={isRunning}>
              <RefreshCw size={20} />
              Verificar Agora
            </button>
          </div>

          {/* Status */}
          <div className="status-indicator">
            <div className={`status-light ${isRunning ? 'active' : 'inactive'}`}></div>
            <span>
              {isRunning ? '🟢 Monitoramento Ativo' : '🔴 Parado'}
            </span>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.total}</h3>
            <p>Total Analisados</p>
            <Mail size={24} />
          </div>
          <div className="stat-card produtivos">
            <h3>{stats.produtivos}</h3>
            <p>Produtivos</p>
            <CheckCircle size={24} />
          </div>
          <div className="stat-card improdutivos">
            <h3>{stats.improdutivos}</h3>
            <p>Improdutivos</p>
            <XCircle size={24} />
          </div>
          <div className="stat-card processing">
            <h3>{stats.processados}</h3>
            <p>Processados Hoje</p>
            <RefreshCw size={24} />
          </div>
        </div>

        {/* Email sendo processado */}
        {currentEmail && (
          <div className="current-processing">
            <div className="processing-header">
              <RefreshCw className="spinning" size={20} />
              <h4>Analisando Email...</h4>
            </div>
            <div className="email-preview">
              <strong>De:</strong> {currentEmail.from}<br />
              <strong>Assunto:</strong> {currentEmail.subject}
            </div>
          </div>
        )}

        {/* Lista de emails analisados */}
        <div className="analyzed-emails">
          <h3>📊 Emails Analisados Recentemente</h3>
          
          {analyzedEmails.length === 0 ? (
            <div className="empty-state">
              <Mail size={48} />
              <p>Nenhum email analisado ainda</p>
              <small>Inicie o monitoramento para ver os resultados</small>
            </div>
          ) : (
            <div className="emails-list">
              {analyzedEmails.slice(0, 10).map((email, index) => (
                <div key={index} className={`email-item ${email.priority}`}>
                  <div className="email-header">
                    <div className={`category-badge ${email.analysis.category.toLowerCase()}`}>
                      {email.analysis.category === 'Produtivo' ? '🟢' : '🔴'} {email.analysis.category}
                    </div>
                    <span className="email-time">
                      {new Date(email.analyzedAt).toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                  
                  <div className="email-content">
                    <h4>{email.subject}</h4>
                    <p><strong>De:</strong> {email.from}</p>
                    <div className="suggestion">
                      <strong>Sugestão:</strong> "{email.analysis.suggestion}"
                    </div>
                  </div>
                  
                  {email.priority === 'high' && (
                    <div className="priority-indicator">
                      ⚡ Alta Prioridade
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EmailAutoAnalyzer;