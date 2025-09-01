import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Features from '../pages/Features';
import EmailAnalyzer from '../pages/Home';
import Header from '../components/Header';
import GmailAnalyzer from '../pages/AutoAnalyzer';
import ApiDocs from '../pages/ApiDocs';
/**
 * Arquivo principal de rotas.
 * Adiciona navegação entre páginas usando React Router.
 * - /           : Página principal do analisador de emails
 * - /recursos   : Página de recursos e funcionalidades
 * - /analisar   : Página de análise automática via Gmail
 */
const AppRoutes = () => (
  <>
    <Header />
    <Routes>
      <Route path="/" element={<EmailAnalyzer />} />
      <Route path="/recursos" element={<Features />} />
      <Route path="/analisar" element={<GmailAnalyzer />} />
      <Route path="/api" element={<ApiDocs />} />
    </Routes>
  </>
);

export default AppRoutes;