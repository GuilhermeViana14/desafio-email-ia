import React from 'react';
import './App.css';
import Header from './components/Header';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;