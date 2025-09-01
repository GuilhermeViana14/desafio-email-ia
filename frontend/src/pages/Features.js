import React from 'react';
import { Brain, Zap, ShieldCheck, FileText, Clock, Github } from 'lucide-react';
import '../styles/Feature.css';

/**
 * Página de Recursos (Features)
 * Explica as principais funcionalidades e diferenciais do sistema de análise de emails com IA.
 * Segue o design e estrutura visual das demais páginas.
 */
const features = [
  {
    icon: <Brain size={32} color="#764ba2" />,
    title: "IA Avançada",
    description: "Utiliza modelos BART + T5 para classificar e sugerir respostas automáticas com alta precisão."
  },
  {
    icon: <Zap size={32} color="#667eea" />,
    title: "Sugestão Instantânea",
    description: "Receba sugestões de resposta em tempo real para emails produtivos, agilizando sua rotina."
  },
  {
    icon: <ShieldCheck size={32} color="#10b981" />,
    title: "Privacidade Garantida",
    description: "Nenhum dado é armazenado. Todo processamento é feito de forma segura e temporária."
  },
  {
    icon: <FileText size={32} color="#f59e0b" />,
    title: "Suporte a Arquivos",
    description: "Analise emails via texto ou arquivos .txt e .pdf, facilitando integração com outras ferramentas."
  },
  {
    icon: <Clock size={32} color="#059669" />,
    title: "Análise Rápida",
    description: "Processamento em menos de 0.1s por email, mesmo em lotes ou via integração Gmail."
  },
  {
    icon: <Github size={32} color="#374151" />,
    title: "Código Aberto",
    description: "Acesse o projeto completo no GitHub e contribua para melhorias e novas funcionalidades."
  }
];

const cardStyle = {
  minWidth: 260,
  maxWidth: 260,
  height: 180,
  background: '#fff',
  color: '#374151',
  margin: 12,
  boxShadow: '0 8px 32px rgba(102,126,234,0.08)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};

const Features = () => (
  <section id="features" className="features">
    <div className="container">
      <div className="analyzer-header">
        <div className="icon-container">
          <Brain size={48} style={{ color: '#ffffffff' }} />
          <Zap className="zap-overlay" size={28} />
        </div>
        <h1 style={{ color: '#ffffffff', background: 'none', WebkitBackgroundClip: 'unset', WebkitTextFillColor: 'unset' }}>
          Recursos & Funcionalidades
        </h1>
        <p className="subtitle" style={{ color: '#ffffffff' }}>
          Descubra tudo que o <span className="highlight" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Email AI</span> pode fazer por você.
        </p>
      </div>

      <div className="stats-row" style={{ flexWrap: 'wrap', justifyContent: 'center', marginTop: 40 }}>
        {features.map((f, idx) => (
          <div key={idx} className="stat-item" style={cardStyle}>
            {f.icon}
            <div>
              <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: 6 }}>{f.title}</strong>
              <span style={{ fontSize: '0.95rem', opacity: 0.85 }}>{f.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;