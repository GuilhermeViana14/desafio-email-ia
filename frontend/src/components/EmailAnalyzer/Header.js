import React from 'react';
import { Mail, Zap, BarChart3, Clock, CheckCircle } from 'lucide-react';
import '../../styles/EmailAnalyzer/Header.css';

/**
 * Componente AnalyzerHeader
 * Exibe o cabeçalho do analisador de emails com IA, incluindo:
 * - Ícone principal
 * - Título e subtítulo explicativo
 * - Status da API (online/offline/verificando)
 * - Estatísticas rápidas (precisão, tempo, total de análises)
 *
 * Props:
 *   apiStatus (string): Status da API ('online', 'offline', 'checking')
 *   analysisCount (number): Quantidade de análises realizadas hoje
 */
const AnalyzerHeader = ({ apiStatus, analysisCount }) => {
  return (
    <div className="analyzer-header">
  
      {/* Título principal */}
      <h1>🤖 Analisador de Emails com IA</h1>
      
      {/* Subtítulo explicativo */}
      <p className="subtitle">
        Classifique emails como <span className="highlight">Produtivos</span> ou <span className="highlight">Improdutivos</span> 
        <br />e receba sugestões de resposta automáticas em tempo real
      </p>
      
      {/* Status da API */}
      <div className={`api-status ${apiStatus}`}>
        <div className="status-indicator"></div>
        <span>
          {apiStatus === 'online' ? '🟢 API Online - Pronto para analisar' : 
           apiStatus === 'offline' ? '🔴 API Offline - Verifique conexão' : 
           '🟡 Verificando status da API...'}
        </span>
      </div>

      {/* Estatísticas rápidas */}
      <div className="stats-row">
        <div className="stat-item">
          <BarChart3 size={20} />
          <span>Precisão: 95%</span>
        </div>
        <div className="stat-item">
          <Clock size={20} />
          <span>Tempo: &lt;0.1s</span>
        </div>
        <div className="stat-item">
          <CheckCircle size={20} />
          <span>Análises hoje: {analysisCount}</span>
        </div>
      </div>
    </div>
  );
};

export default AnalyzerHeader;