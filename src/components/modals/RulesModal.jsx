import React from 'react';
import './Modal.css';

function RulesModal({ onClose }) {
  return (
    <div className="modal rules-modal">
      <div className="modal-header">
        <h2 className="modal-title">How to Play</h2>
        <button className="close-button" onClick={onClose}>&times;</button>
      </div>
      
      <div className="modal-content">
        <p>Guess the word in 6 tries.</p>
        
        <ul>
          <li>Each guess must be a valid 5-letter word.</li>
          <li>The color of the tiles will change to show how close your guess was.</li>
        </ul>
        
        <div className="examples">
          <p><strong>Examples</strong></p>
          
          <div className="example">
            <div className="example-row">
              <div className="example-tile correct">W</div>
              <div className="example-tile">E</div>
              <div className="example-tile">A</div>
              <div className="example-tile">R</div>
              <div className="example-tile">Y</div>
            </div>
            <p><strong>W</strong> is in the word and in the correct spot.</p>
          </div>
          
          <div className="example">
            <div className="example-row">
              <div className="example-tile">P</div>
              <div className="example-tile present">I</div>
              <div className="example-tile">L</div>
              <div className="example-tile">O</div>
              <div className="example-tile">T</div>
            </div>
            <p><strong>I</strong> is in the word but in the wrong spot.</p>
          </div>
          
          <div className="example">
            <div className="example-row">
              <div className="example-tile">V</div>
              <div className="example-tile">A</div>
              <div className="example-tile">G</div>
              <div className="example-tile absent">U</div>
              <div className="example-tile">E</div>
            </div>
            <p><strong>U</strong> is not in the word in any spot.</p>
          </div>
        </div>
        
        <p className="hard-mode-info">
          <strong>Hard Mode</strong>: Any revealed hints must be used in subsequent guesses.
        </p>
        
        <p className="new-word-info">A new word will be available each day!</p>
      </div>
    </div>
  );
}

export default RulesModal;
