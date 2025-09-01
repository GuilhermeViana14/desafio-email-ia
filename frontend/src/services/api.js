/**
 * URL base da API do backend.
 * Altere para o endpoint correto em produção.
 */
const API_BASE_URL = 'https://guilhermev14-email-analyzer-ai.hf.space';

/**
 * Verifica o status de saúde da API.
 * @returns {Promise<Object>} Dados do endpoint /health.
 */
export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao verificar health da API:', error);
    throw error;
  }
};

/**
 * Analisa o conteúdo de um email (texto).
 * @param {string} text - Texto do email a ser analisado.
 * @returns {Promise<Object>} Dados de categoria e sugestão.
 */
export const analyzeEmail = async (text) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text: text
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao analisar email:', error);
    throw error;
  }
};

/**
 * Analisa um arquivo enviado (.txt ou .pdf).
 * @param {File} file - Arquivo a ser analisado.
 * @returns {Promise<Object>} Dados de categoria e sugestão.
 */
export const analyzeFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/v1/analyze-file`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao analisar arquivo:', error);
    throw error;
  }
};

/**
 * Obtém as categorias disponíveis para classificação de emails.
 * @returns {Promise<Object>} Lista de categorias e descrições.
 */
export const getCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    throw error;
  }
};

/**
 * Analisa múltiplos emails em lote.
 * @param {string[]} emails - Lista de textos de emails.
 * @returns {Promise<Object>} Resultados da análise em lote.
 */
export const batchAnalyze = async (emails) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/batch-analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emails: emails
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro na análise em lote:', error);
    throw error;
  }
};

/**
 * Exporta todos os serviços da API.
 */
export default {
  checkHealth,
  analyzeEmail,
  analyzeFile,
  getCategories,
  batchAnalyze
};