import React, { useState, useEffect } from 'react';
import { analyzeEmail, checkHealth } from '../services/api';
import AnalyzerHeader from '../components/EmailAnalyzer/Header';
import InputSection from '../components/EmailAnalyzer/InputSection';
import ResultSection from '../components/EmailAnalyzer/ResultSection';
import HistorySection from '../components/EmailAnalyzer/HistorySection';
import ExamplesSection from '../components/EmailAnalyzer/ExamplesSection';
import '../styles/EmailAnalyzer.css';

/**
 * Componente principal EmailAnalyzer
 * - Gerencia o fluxo de análise de emails com IA.
 * - Permite análise manual (texto/arquivo) e análise automática via Gmail OAuth2.
 * - Exibe cabeçalho, input, resultado, histórico e exemplos.
 */
const EmailAnalyzer = () => {
  // Estado do texto do email para análise manual
  const [email, setEmail] = useState('');
  // Estado do resultado da análise
  const [result, setResult] = useState(null);
  // Estado de carregamento da análise
  const [loading, setLoading] = useState(false);
  // Estado de erro
  const [error, setError] = useState('');
  // Status da API (online/offline/checking)
  const [apiStatus, setApiStatus] = useState('checking');
  // Histórico das últimas análises realizadas
  const [analysisHistory, setAnalysisHistory] = useState([]);
  // Usuário autenticado via Google OAuth2
  const [user, setUser] = useState(null);

  /**
   * Efeito inicial:
   * - Verifica status da API.
   * - Recupera usuário autenticado do localStorage.
   */
  useEffect(() => {
    checkApiHealth();
    const savedUser = localStorage.getItem("emailai_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  /**
   * Verifica status de saúde da API.
   */
  const checkApiHealth = async () => {
    try {
      await checkHealth();
      setApiStatus('online');
    } catch (err) {
      setApiStatus('offline');
    }
  };

  /**
   * Realiza análise do texto do email.
   * - Valida entrada mínima.
   * - Chama API de análise.
   * - Atualiza resultado e histórico.
   */
  const handleAnalyze = async () => {
    if (!email.trim()) {
      setError('Por favor, digite um texto para analisar');
      return;
    }
    if (email.length < 10) {
      setError('Digite pelo menos 10 caracteres para uma análise precisa');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await analyzeEmail(email);
      setResult(data);

      // Adiciona ao histórico (máximo 5 itens)
      const historyItem = {
        id: Date.now(),
        text: email.substring(0, 100) + (email.length > 100 ? '...' : ''),
        category: data.category,
        timestamp: new Date().toLocaleString('pt-BR')
      };
      setAnalysisHistory(prev => [historyItem, ...prev.slice(0, 4)]);
    } catch (err) {
      setError('Erro ao analisar email. Verifique sua conexão e tente novamente.');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Limpa o campo de texto, resultado e erro.
   */
  const handleClear = () => {
    setEmail('');
    setResult(null);
    setError('');
  };

  /**
   * Lê arquivo .txt e preenche o campo de texto para análise.
   * - Limita tamanho máximo do arquivo.
   */
  const handleFileUpload = (file) => {
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        if (text.length > 5000) {
          setError('Arquivo muito grande. Máximo 5000 caracteres.');
          return;
        }
        setEmail(text);
        setError('');
      };
      reader.readAsText(file);
    } else {
      setError('Por favor, selecione um arquivo .txt válido');
    }
  };

  return (
    <section id="analyzer" className="email-analyzer">
      <div className="container">
        {/* Cabeçalho do analisador */}
        <AnalyzerHeader 
          apiStatus={apiStatus}
          analysisCount={analysisHistory.length}
        />

        {/* Seção de input manual (texto/arquivo) */}
        <InputSection
          email={email}
          setEmail={setEmail}
          loading={loading}
          error={error}
          onAnalyze={handleAnalyze}
          onClear={handleClear}
          onFileUpload={handleFileUpload}
        />
        
        {/* Exibe resultado da análise */}
        {result && (
          <ResultSection result={result} />
        )}
        
        {/* Exibe histórico das últimas análises */}
        {analysisHistory.length > 0 && (
          <HistorySection history={analysisHistory} />
        )}
        
        {/* Exemplos para teste rápido */}
        <ExamplesSection onSelectExample={setEmail} />
      </div>
    </section>
  );
};

export default EmailAnalyzer;