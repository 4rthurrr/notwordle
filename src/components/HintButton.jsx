import React from 'react';
import './HintButton.css';

function HintButton({ onHint, showHint }) {
  return (
    <button 
      className={`hint-button ${showHint ? 'active' : ''}`} 
      onClick={onHint}
      aria-label="Get a hint"
    >
      {showHint ? 'Hide Hint' : 'Need a Hint?'}
    </button>
  );
}

export default HintButton;
