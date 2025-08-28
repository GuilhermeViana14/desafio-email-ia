import React from 'react';
import { FileText, Upload, Send, Clock, XCircle } from 'lucide-react';
import '../../styles/EmailAnalyzer/InputSection.css';

const InputSection = ({ 
  email, 
  setEmail, 
  loading, 
  error, 
  onAnalyze, 
  onClear, 
  onFileUpload 
}) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    onFileUpload(file);
  };

  return (
    <div className="input-section">
      <div className="input-header">
        <FileText size={20} />
        <h3>Digite ou carregue o texto do email</h3>
      </div>
      
      <div className="input-area">
        <textarea
          className="email-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Exemplo: Prezados, gostaria de solicitar um orçamento urgente para nosso projeto de desenvolvimento..."
          rows={6}
          maxLength={5000}
        />
        
        {/* Upload de arquivo */}
        <div className="upload-area">
          <input
            type="file"
            id="file-upload"
            accept=".txt"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="file-upload" className="upload-btn">
            <Upload size={16} />
            Carregar arquivo .txt
          </label>
        </div>
      </div>
      
      <div className="input-info">
        <span className={email.length > 4500 ? 'warning' : ''}>
          {email.length}/5000 caracteres
        </span>
        {email.length > 0 && (
          <span className="word-count">
            ~{email.split(' ').length} palavras
          </span>
        )}
      </div>

      <div className="button-group">
        <button 
          className="analyze-btn"
          onClick={onAnalyze}
          disabled={loading || !email.trim() || email.length < 10}
        >
          {loading ? (
            <>
              <Clock size={20} className="spinning" />
              Analisando com IA...
            </>
          ) : (
            <>
              <Send size={20} />
              Analisar Email
            </>
          )}
        </button>
        
        <button 
          className="clear-btn"
          onClick={onClear}
          disabled={loading}
        >
          Limpar
        </button>
      </div>

      {error && (
        <div className="error-message">
          <XCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
};

export default InputSection;