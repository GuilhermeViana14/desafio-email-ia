import React, { useState, useEffect } from 'react';
import { analyzeEmail, checkHealth } from '../../services/api';
import AnalyzerHeader from './Header';
import InputSection from './InputSection';
import ResultSection from './ResultSection';
import HistorySection from './HistorySection';
import ExamplesSection from './ExamplesSection';
import '../../styles/EmailAnalyzer.css';

const EmailAnalyzer = () => {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiStatus, setApiStatus] = useState('checking');
  const [analysisHistory, setAnalysisHistory] = useState([]);

  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      await checkHealth();
      setApiStatus('online');
    } catch (err) {
      setApiStatus('offline');
    }
  };

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
      
      // Adicionar ao histórico
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

  const handleClear = () => {
    setEmail('');
    setResult(null);
    setError('');
  };

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
        <AnalyzerHeader 
          apiStatus={apiStatus}
          analysisCount={analysisHistory.length}
        />
        
        <InputSection
          email={email}
          setEmail={setEmail}
          loading={loading}
          error={error}
          onAnalyze={handleAnalyze}
          onClear={handleClear}
          onFileUpload={handleFileUpload}
        />
        
        {result && (
          <ResultSection result={result} />
        )}
        
        {analysisHistory.length > 0 && (
          <HistorySection history={analysisHistory} />
        )}
        
        <ExamplesSection onSelectExample={setEmail} />
      </div>
    </section>
  );
};

export default EmailAnalyzer;