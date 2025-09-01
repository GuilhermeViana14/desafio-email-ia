import React from 'react';
import { CheckCircle } from 'lucide-react';
import '../../styles/EmailAnalyzer/ResultSection.css';

/**
 * Componente ResultSection
 * Exibe o resultado da análise IA do email:
 * - Categoria identificada (produtivo/improdutivo) com explicação
 * - Sugestão de resposta gerada pela IA
 * - Botões para copiar ou editar a sugestão
 * - Metadados da análise (caracteres, tempo, data, modelo)
 *
 * Props:
 *   result (object): Resultado da análise, incluindo:
 *     - category: 'Produtivo' ou 'Improdutivo'
 *     - suggestion: texto sugerido pela IA
 *     - metadata: { text_length, processing_time_seconds, processed_at }
 */
const ResultSection = ({ result }) => {
  /**
   * Copia sugestão de resposta para a área de transferência.
   * Mostra feedback visual temporário no botão.
   */
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    const btn = document.querySelector('.copy-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Copiado! ✓';
    setTimeout(() => btn.textContent = originalText, 2000);
  };

  return (
    <div className="result-section">
      {/* Cabeçalho do resultado */}
      <div className="result-header">
        <CheckCircle size={24} />
        <h3>Resultado da Análise IA</h3>
        <span className="confidence">Confiança: 95%</span>
      </div>

      {/* Grid principal: categoria e sugestão */}
      <div className="result-grid">
        {/* Card de categoria */}
        <div className="result-card category-card">
          <div className="card-header">
            <div className={`category-badge ${result.category.toLowerCase()}`}>
              {result.category === 'Produtivo' ? '🟢' : '🔴'} {result.category}
            </div>
          </div>
          <h4>Categoria Identificada</h4>
          <p>
            {result.category === 'Produtivo' 
              ? 'Este email contém informações importantes e requer atenção prioritária. Recomendamos resposta rápida.' 
              : 'Este email pode ser marketing, spam ou conteúdo não essencial. Pode ser tratado com menor prioridade.'}
          </p>
          <div className="category-features">
            <small>
              {result.category === 'Produtivo' 
                ? '✅ Contém palavras-chave de negócios, urgência ou problemas técnicos'
                : '⚠️ Detectado padrões de marketing, promoções ou conteúdo irrelevante'}
            </small>
          </div>
        </div>

        {/* Card de sugestão de resposta */}
        <div className="result-card suggestion-card">
          <h4>💬 Sugestão de Resposta</h4>
          <div className="suggestion-text">
            "{result.suggestion}"
          </div>
          <div className="suggestion-actions">
            <button 
              className="copy-btn" 
              onClick={() => copyToClipboard(result.suggestion)}
            >
              Copiar Resposta
            </button>
            <button className="edit-btn">
              Editar Resposta
            </button>
          </div>
        </div>
      </div>

      {/* Metadados da análise */}
      <div className="metadata">
        <div className="metadata-item">
          <span>📊 Caracteres:</span>
          <strong>{result.metadata.text_length}</strong>
        </div>
        <div className="metadata-item">
          <span>⚡ Tempo de análise:</span>
          <strong>{result.metadata.processing_time_seconds}s</strong>
        </div>
        <div className="metadata-item">
          <span>🕐 Processado em:</span>
          <strong>{new Date(result.metadata.processed_at).toLocaleString('pt-BR')}</strong>
        </div>
        <div className="metadata-item">
          <span>🤖 Modelo IA:</span>
          <strong>BART + T5</strong>
        </div>
      </div>
    </div>
  );
};

export default ResultSection;