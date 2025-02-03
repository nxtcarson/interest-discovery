import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const QuestionEngine = ({ category }) => {
  const [responses, setResponses] = useLocalStorage('questionnaireData', {});
  const [currentQIndex, setCurrentQIndex] = useState(0);

  const handleResponse = (answer) => {
    setResponses(prev => ({
      ...prev,
      [category.id]: {
        ...prev[category.id],
        [currentQIndex]: {
          question: category.questions[currentQIndex],
          answer,
          timestamp: new Date().toISOString()
        }
      }
    }));
  };

  return (
    <div className="question-container">
      <h3>{category.questions[currentQIndex]}</h3>
      <textarea 
        value={responses[category.id]?.[currentQIndex]?.answer || ''}
        onChange={(e) => handleResponse(e.target.value)}
        placeholder="Type as much or little as you want..."
      />
      <div className="navigation-buttons">
        {currentQIndex > 0 && (
          <button onClick={() => setCurrentQIndex(currentQIndex - 1)}>
            Previous
          </button>
        )}
        {currentQIndex < category.questions.length - 1 ? (
          <button onClick={() => setCurrentQIndex(currentQIndex + 1)}>
            Next
          </button>
        ) : (
          <button onClick={() => alert('Responses saved!')}>
            Complete Section
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionEngine; 