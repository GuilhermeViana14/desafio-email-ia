/**
 * Google OAuth2 Client ID para autenticação.
 * Troque para o seu client_id em produção.
 */
const GOOGLE_CLIENT_ID = "922505264175-14fraqq80tql6j5qmdnvk3krjtf6fakh.apps.googleusercontent.com";

/**
 * Escopos de permissão do Google OAuth2.
 * Permite leitura e envio de emails pelo Gmail API.
 */
const GOOGLE_SCOPE = "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send";

/**
 * URI de redirecionamento após login.
 * Troque para o domínio correto em produção.
 */
const REDIRECT_URI = "http://localhost:3000/auth/callback";

/**
 * Obtém informações do usuário autenticado via Google OAuth2.
 * @param {string} accessToken - Token de acesso do Google.
 * @returns {Promise<Object|null>} Dados do usuário ou null se falhar.
 */
export const getUserInfo = async (accessToken) => {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (res.ok) return await res.json();
  return null;
};

/**
 * Inicia o fluxo de login com Google OAuth2.
 * Redireciona o usuário para a tela de login do Google.
 */
export const loginWithGoogle = () => {
  window.location.href =
    "https://accounts.google.com/o/oauth2/v2/auth" +
    `?client_id=${GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${REDIRECT_URI}` +
    "&response_type=token" +
    `&scope=${GOOGLE_SCOPE}`;
};

/**
 * Salva os dados do usuário autenticado no localStorage.
 * @param {Object} user - Dados do usuário.
 */
export const saveUser = (user) => {
  localStorage.setItem("emailai_user", JSON.stringify(user));
};

/**
 * Recupera os dados do usuário autenticado do localStorage.
 * @returns {Object|null} Dados do usuário ou null se não existir.
 */
export const getSavedUser = () => {
  const savedUser = localStorage.getItem("emailai_user");
  return savedUser ? JSON.parse(savedUser) : null;
};

/**
 * Remove os dados do usuário autenticado do localStorage (logout).
 */
export const logoutUser = () => {
  localStorage.removeItem("emailai_user");
};