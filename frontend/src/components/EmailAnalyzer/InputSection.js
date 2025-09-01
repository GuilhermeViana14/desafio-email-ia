import React from 'react';
import { FileText, Upload, Send, Clock, XCircle } from 'lucide-react';
import '../../styles/EmailAnalyzer/InputSection.css';

/**
 * Componente InputSection
 * Exibe área para digitar ou carregar o texto do email a ser analisado.
 * - Permite digitação manual ou upload de arquivo .txt.
 * - Mostra contador de caracteres e palavras.
 * - Exibe botões para analisar e limpar o campo.
 * - Mostra mensagem de erro se houver.
 *
 * Props:
 *   email (string): Texto do email para análise.
 *   setEmail (function): Função para atualizar o texto do email.
 *   loading (boolean): Indica se está processando análise.
 *   error (string): Mensagem de erro a ser exibida.
 *   onAnalyze (function): Função chamada ao clicar em "Analisar".
 *   onClear (function): Função chamada ao clicar em "Limpar".
 *   onFileUpload (function): Função chamada ao selecionar arquivo .txt.
 */
const InputSection = ({ 
  email, 
  setEmail, 
  loading, 
  error, 
  onAnalyze, 
  onClear, 
  onFileUpload 
}) => {
  /**
   * Manipula seleção de arquivo .txt e chama função de upload.
   * @param {Event} event
   */
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    onFileUpload(file);
  };

  return (
    <div className="input-section">
      {/* Cabeçalho da área de input */}
      <div className="input-header">
        <FileText size={20} />
        <h3>Digite ou carregue o texto do email</h3>
      </div>
      
      {/* Área principal de input */}
      <div className="input-area">
        <textarea
          className="email-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Exemplo: Prezados, gostaria de solicitar um orçamento urgente para nosso projeto de desenvolvimento..."
          rows={6}
          maxLength={5000}
        />
        
        {/* Upload de arquivo .txt */}
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
      
      {/* Informações abaixo do input: contador de caracteres e palavras */}
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

      {/* Botões de ação: analisar e limpar */}
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

      {/* Mensagem de erro, se houver */}
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