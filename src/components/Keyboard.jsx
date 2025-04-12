import React, { useEffect } from 'react';
import { calculateGuessResults } from '../services/gameLogic';
import './Keyboard.css';

function Keyboard({ onKeyPress, onKeyTouchStart, onKeyTouchEnd, guesses, targetWord }) {
  // Define keyboard layout
  const rows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace']
  ];
  
  // Track statuses of all letters
  const letterStatuses = {};
  
  // Calculate letter statuses based on guesses
  guesses.forEach(guess => {
    const results = calculateGuessResults(guess, targetWord);
    results.forEach(result => {
      const { letter, status } = result;
      
      // Only overwrite status if it's better than existing one
      // correct > present > absent
      if (!letterStatuses[letter] || 
          (letterStatuses[letter] === 'absent' && status !== 'absent') ||
          (letterStatuses[letter] === 'present' && status === 'correct')) {
        letterStatuses[letter] = status;
      }
    });
  });
  
  // Handle physical keyboard presses
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle letter keys, Enter, and Backspace
      if (/^[a-zA-Z]$/.test(e.key) || e.key === 'Enter' || e.key === 'Backspace') {
        onKeyPress(e.key);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onKeyPress]);
  
  // Get class name based on letter status
  const getKeyClassName = (key) => {
    let className = 'key';
    
    if (key === 'Enter' || key === 'Backspace') {
      className += ' wide-key';
    }
    
    // Add status class if applicable
    if (letterStatuses[key]) {
      className += ` ${letterStatuses[key]}`;
    }
    
    return className;
  };
  
  // Add touch handling
  const handleTouchStart = (key) => {
    const element = document.querySelector(`[data-key="${key}"]`);
    if (element) element.classList.add('key-active');
  };

  const handleTouchEnd = (key) => {
    const element = document.querySelector(`[data-key="${key}"]`);
    if (element) element.classList.remove('key-active');
  };
  
  return (
    <div className="keyboard">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map(key => (
            <button 
              key={key} 
              className={getKeyClassName(key)}
              onClick={() => onKeyPress(key)}
              onTouchStart={() => handleTouchStart(key)}
              onTouchEnd={() => handleTouchEnd(key)}
              data-key={key}
            >
              {key === 'Backspace' ? '⌫' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
