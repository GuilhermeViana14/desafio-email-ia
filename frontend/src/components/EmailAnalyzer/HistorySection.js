import React from 'react';
import '../../styles/EmailAnalyzer/History.css';


const HistorySection = ({ history }) => {
  return (
    <div className="history-section">
      <h3>📈 Histórico de Análises</h3>
      <div className="history-list">
        {history.map((item) => (
          <div key={item.id} className="history-item">
            <div className={`history-badge ${item.category.toLowerCase()}`}>
              {item.category === 'Produtivo' ? '🟢' : '🔴'}
            </div>
            <div className="history-content">
              <p>"{item.text}"</p>
              <small>{item.timestamp}</small>
            </div>
            <span className="history-category">{item.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorySection;