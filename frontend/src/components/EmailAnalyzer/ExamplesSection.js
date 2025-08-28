import React from 'react';
import { Send } from 'lucide-react';
import '../../styles/EmailAnalyzer/Examples.css';

const ExamplesSection = ({ onSelectExample }) => {
  const examples = [
    {
      text: "Prezados, gostaria de solicitar um orçamento urgente para nosso projeto de desenvolvimento de software. Precisamos finalizar até sexta-feira.",
      category: "Produtivo",
      label: "Email de Negócios"
    },
    {
      text: "🎉 PROMOÇÃO ESPECIAL! Ganhe 70% de desconto em todos os produtos! Clique aqui agora e não perca essa oportunidade única!",
      category: "Improdutivo", 
      label: "Email de Marketing"
    },
    {
      text: "Estamos enfrentando um problema crítico no sistema de produção. O servidor principal está fora do ar e precisamos de suporte imediato.",
      category: "Produtivo",
      label: "Suporte Técnico"
    },
    {
      text: "Boa tarde! Precisamos agendar uma reunião para discutir o andamento do projeto e definir os próximos passos.",
      category: "Produtivo",
      label: "Agendamento"
    }
  ];

  return (
    <div className="examples-section">
      <h3>📋 Exemplos para Testar</h3>
      <p className="examples-subtitle">
        Clique em qualquer exemplo para testá-lo automaticamente
      </p>
      
      <div className="examples-grid">
        {examples.map((example, index) => (
          <div 
            key={index} 
            className={`example-card ${example.category.toLowerCase()}`}
            onClick={() => onSelectExample(example.text)}
          >
            <div className="example-header">
              <span className="example-label">{example.label}</span>
              <span className={`example-category ${example.category.toLowerCase()}`}>
                {example.category === 'Produtivo' ? '🟢' : '🔴'} {example.category}
              </span>
            </div>
            <p>"{example.text}"</p>
            <div className="example-footer">
              <small>Clique para testar este exemplo</small>
              <Send size={14} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamplesSection;