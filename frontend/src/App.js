import React from 'react';
import './App.css';
import EmailAnalyzer from './components/EmailAnalyzer/index';
import Header from './components/Header';
import EmailAutoAnalyzer from './components/EmailAutoAnalyzer';
function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <EmailAnalyzer />
        <EmailAutoAnalyzer />
      </main>
    </div>
  );
}

export default App;