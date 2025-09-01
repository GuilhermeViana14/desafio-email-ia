import React, { useEffect, useContext } from 'react';
import { LogIn, LogOut, User } from 'lucide-react';
import {
  getUserInfo,
  loginWithGoogle,
  saveUser,
  getSavedUser,
  logoutUser
} from '../services/Auth';
import { UserContext } from '../context/UserContext';

const LoginButton = () => {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const saved = getSavedUser();
    if (saved) setUser(saved);

    const hash = window.location.hash;
    if (hash.includes("access_token")) {
      const params = new URLSearchParams(hash.replace("#", ""));
      const accessToken = params.get("access_token");
      if (accessToken) {
        getUserInfo(accessToken).then((info) => {
          const userData = { ...info, accessToken };
          setUser(userData);
          saveUser(userData);

          // Redireciona para a última página visitada
          const lastPage = localStorage.getItem('lastPage') || '/';
          window.location.replace(lastPage);
          localStorage.removeItem('lastPage');
        });
        window.location.hash = "";
      }
    }
  }, [setUser]);

  // Salva a página antes de iniciar o login
  const handleLogin = () => {
    localStorage.setItem('lastPage', window.location.pathname);
    loginWithGoogle();
  };

  const handleLogout = () => {
    setUser(null);
    logoutUser();
  };

  return user ? (
    <>
      <span className="user-info">
        <User size={18} style={{ marginRight: 4 }} />
        {user.name || user.email}
      </span>
      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={18} style={{ marginRight: 4 }} />
        Sair
      </button>
    </>
  ) : (
    <button className="login-btn" onClick={handleLogin}>
      <LogIn size={18} style={{ marginRight: 8 }} />
      Login com Google
    </button>
  );
};

export default LoginButton;