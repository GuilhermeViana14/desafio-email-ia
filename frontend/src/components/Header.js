import React, { useState, useEffect } from 'react';
import { Brain, Mail, Zap, Menu, X, Github, ExternalLink } from 'lucide-react';
import '../styles/Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detectar scroll para efeito glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <nav className="navbar">
          {/* Logo */}
          <div className="logo">
            <div className="logo-icon">
              <Brain className="brain-icon" />
              <Zap className="zap-icon" />
            </div>
            <div className="logo-text">
              <h2>Email<span className="ai-accent">AI</span></h2>
              <span className="tagline">Smart Analysis</span>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="nav-links">
            <a href="#analyzer" className="nav-link">
              <Mail size={18} />
              Analisar
            </a>
            <a href="#features" className="nav-link">
              <Brain size={18} />
              Recursos
            </a>
            <a href="#api" className="nav-link">
              <Zap size={18} />
              API Docs
            </a>
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

          {/* CTA Buttons */}
          <div className="nav-actions">
            <a 
              href="https://github.com/guilhermeViana14" 
              target="_blank" 
              rel="noopener noreferrer"
              className="github-btn"
              title="Ver código no GitHub"
            >
              <Github size={20} />
            </a>
            <button className="demo-btn">
              <Zap size={18} />
              Demo Live
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            <a href="#analyzer" className="mobile-link" onClick={toggleMenu}>
              <Mail size={20} />
              <span>Analisar Emails</span>
            </a>
            <a href="#features" className="mobile-link" onClick={toggleMenu}>
              <Brain size={20} />
              <span>Recursos IA</span>
            </a>
            <a href="#api" className="mobile-link" onClick={toggleMenu}>
              <Zap size={20} />
              <span>Documentação</span>
            </a>
            <a 
              href="https://guilhermev14-email-analyzer-ai.hf.space/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mobile-link"
              onClick={toggleMenu}
            >
              <ExternalLink size={20} />
              <span>API Swagger</span>
            </a>
            
            <div className="mobile-actions">
              <a 
                href="https://github.com/guilhermev14" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mobile-github-btn"
              >
                <Github size={20} />
                <span>GitHub</span>
              </a>
              <button className="mobile-demo-btn">
                <Zap size={18} />
                <span>Testar Demo</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Animation Background */}
      <div className="ai-background">
        <div className="neural-network">
          <div className="node"></div>
          <div className="node"></div>
          <div className="node"></div>
          <div className="connection"></div>
          <div className="connection"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;