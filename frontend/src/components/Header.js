import React, { useState, useEffect } from 'react';
import { Brain, Mail, Zap, Menu, X, Github, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom'; // Importa Link para navegação SPA
import '../styles/Header.css';
import LoginButton from '../components/LoginBtn';

/**
 * Componente Header fixo no topo da página.
 * - Exibe logo, links de navegação, botões de ação (GitHub, login/logout).
 * - Adapta visual ao scroll (efeito de sombra/fundo).
 * - Possui menu responsivo para mobile.
 * - Usa React Router para navegação SPA entre páginas.
 */
const Header = () => {
  // Estado para controlar menu mobile aberto/fechado
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Estado para aplicar estilo de header ao rolar a página
  const [isScrolled, setIsScrolled] = useState(false);

  /**
   * Adiciona/remover listener de scroll para aplicar classe 'scrolled' ao header.
   */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Alterna o menu mobile.
   */
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <nav className="navbar">
          {/* Logo do sistema - agora é um Link para a página principal */}
          <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
            <div className="logo-icon">
              <Brain className="brain-icon" />
              <Zap className="zap-icon" />
            </div>
            <div className="logo-text">
              <h2>Email<span className="ai-accent">AI</span></h2>
              <span className="tagline">Smart Analysis</span>
            </div>
          </Link>

          {/* Links de navegação (desktop) - SPA com React Router */}
          <div className="nav-links">
            {/* Página principal do analisador */}
            <Link to="/analisar" className="nav-link">
              <Mail size={18} />
              Analisar
            </Link>
            {/* Página de recursos e funcionalidades */}
            <Link to="/recursos" className="nav-link">
              <Brain size={18} />
              Recursos
            </Link>
            {/* Link âncora para documentação da API (pode ser ajustado para rota SPA se desejar) */}
           <Link to="/api" className="nav-link">
              <Zap size={18} />
              API Docs
          </Link>
            {/* Link externo para Swagger da API */}
            <a 
              href="https://guilhermev14-email-analyzer-ai.hf.space/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="nav-link external"
            >
              <ExternalLink size={18} />
              Swagger
            </a>
          </div>

          {/* Botões de ação (GitHub, login/logout) */}
          <div className="nav-actions">
            {/* Link externo para o GitHub do projeto */}
            <a 
              href="https://github.com/guilhermeViana14" 
              target="_blank" 
              rel="noopener noreferrer"
              className="github-btn"
              title="Ver código no GitHub"
            >
              <Github size={20} />
            </a>
            {/* Botão de login/logout */}
            <LoginButton />
          </div>

          {/* Botão do menu mobile */}
          <button 
            className="mobile-menu-btn"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Menu mobile responsivo - navegação SPA */}
        {isMenuOpen && (
          <div className="mobile-menu open">
            <div className="mobile-menu-content">
              <Link to="/analisar" className="mobile-link" onClick={toggleMenu}>
                <Mail size={18} /> Analisar
              </Link>
              <Link to="/recursos" className="mobile-link" onClick={toggleMenu}>
                <Brain size={18} /> Recursos
              </Link>
              <Link to="/api" className="mobile-link" onClick={toggleMenu}>
                <Zap size={18} /> API Docs
              </Link>
              <a
                href="https://guilhermev14-email-analyzer-ai.hf.space/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-link"
                onClick={toggleMenu}
              >
                <ExternalLink size={18} /> Swagger
              </a>
              <div className="mobile-actions">
                <a
                  href="https://github.com/guilhermeViana14"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-github-btn"
                  title="Ver código no GitHub"
                >
                  <Github size={20} />
                </a>
                <LoginButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;