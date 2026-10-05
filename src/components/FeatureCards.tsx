import React from 'react';
import { BookOpen, Sigma, FileText, Lightbulb } from 'lucide-react';
import './FeatureCards.css';

interface FeatureCardsProps {
  onCardClick: (text: string) => void;
}

export const FeatureCards: React.FC<FeatureCardsProps> = ({ onCardClick }) => {
  const cards = [
    {
      title: 'Explain a Concept',
      example: 'e.g. What is\nFourier Transform?',
      icon: BookOpen,
      colorClass: 'card-blue',
      prompt: 'What concept would you like me to explain?'
    },
    {
      title: 'Solve a Problem',
      example: 'e.g. Solve this\ncircuit question',
      icon: Sigma,
      colorClass: 'card-green',
      prompt: 'Send me the problem you want to solve.'
    },
    {
      title: 'Summarize Notes',
      example: 'e.g. Make short notes\non Fluid Mechanics',
      icon: FileText,
      colorClass: 'card-coral',
      prompt: 'Upload or paste the notes you want summarized.'
    },
    {
      title: 'Get Study Plan',
      example: 'e.g. Plan for\nSemester Exams',
      icon: Lightbulb,
      colorClass: 'card-lavender',
      prompt: 'Tell me your subject and exam timeline.'
    }
  ];

  return (
    <div className="feature-cards-grid">
      {cards.map((card, idx) => (
        <button 
          key={idx} 
          className={`feature-card ${card.colorClass} scale-in delay-${(idx + 2) * 100}`}
          onClick={() => onCardClick(card.prompt)}
        >
          <div className="card-icon-container">
            <card.icon size={24} strokeWidth={2} />
          </div>
          <h3 className="card-title">{card.title}</h3>
          <p className="card-example" style={{ whiteSpace: 'pre-line' }}>{card.example}</p>
        </button>
      ))}
    </div>
  );
};
