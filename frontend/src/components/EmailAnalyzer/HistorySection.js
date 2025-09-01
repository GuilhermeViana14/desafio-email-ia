import React from 'react';
import '../../styles/EmailAnalyzer/History.css';

/**
 * Componente HistorySection
 * Exibe o histórico de análises realizadas pelo usuário.
 * - Mostra cada análise com categoria, texto analisado, data/hora e badge visual.
 *
 * Props:
 *   history (Array): Lista de objetos de histórico, cada um contendo:
 *     - id: identificador único
 *     - category: 'Produtivo' ou 'Improdutivo'
 *     - text: texto do email analisado
 *     - timestamp: data/hora da análise
 */
const HistorySection = ({ history }) => {
  return (
    <div className="history-section">
      <h3>📈 Histórico de Análises</h3>
      <div className="history-list">
        {history.map((item) => (
          <div key={item.id} className="history-item">
            {/* Badge visual da categoria */}
            <div className={`history-badge ${item.category.toLowerCase()}`}>
              {item.category === 'Produtivo' ? '🟢' : '🔴'}
            </div>
            {/* Conteúdo textual do histórico */}
            <div className="history-content">
              <p>"{item.text}"</p>
              <small>{item.timestamp}</small>
            </div>
            {/* Categoria do histórico */}
            <span className="history-category">{item.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorySection;