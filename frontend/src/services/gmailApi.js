/**
 * Busca os últimos emails do Gmail do usuário autenticado via OAuth2.
 * @param {string} accessToken - Token de acesso do Google.
 * @param {number} maxResults - Quantidade máxima de emails a buscar.
 * @returns {Promise<Object>} Lista de emails analisados pelo backend.
 */
export const fetchEmails = async (accessToken, maxResults = 10) => {
  const formData = new FormData();
  formData.append('access_token', accessToken);
  formData.append('max_results', maxResults);

  const response = await fetch('https://guilhermev14-email-analyzer-ai.hf.space/api/v1/gmail-auto-analyze', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Erro ao buscar emails');
  }

  return await response.json();
};

/**
 * Envia respostas automáticas para os emails selecionados pelo usuário.
 * @param {string} accessToken - Token de acesso do Google.
 * @param {Array<Object>} replies - Lista de respostas automáticas a serem enviadas.
 * @returns {Promise<Object>} Status do envio para cada email.
 */
export const sendReplies = async (accessToken, replies) => {
  const formData = new FormData();
  formData.append('access_token', accessToken);
  formData.append('replies', JSON.stringify(replies));

  const response = await fetch('https://guilhermev14-email-analyzer-ai.hf.space/api/v1/gmail-auto-reply', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Erro ao enviar respostas');
  }

  return await response.json();
};