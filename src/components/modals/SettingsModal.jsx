import React, { useState } from 'react';
import './Modal.css';
import { getStartingWordSuggestions } from '../../services/wordService';

function SettingsModal({ 
  onClose, 
  hardMode, 
  toggleHardMode, 
  toggleTheme, 
  darkTheme, 
  gameInProgress 
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleShowSuggestions = async () => {
    if (!showSuggestions) {
      const words = await getStartingWordSuggestions();
      setSuggestions(words);
    }
    setShowSuggestions(!showSuggestions);
  };

  return (
    <div className="modal settings-modal">
      <div className="modal-header">
        <h2 className="modal-title">Settings</h2>
        <button className="close-button" onClick={onClose}>&times;</button>
      </div>
      
      <div className="modal-content">
        <div className="settings-section">
          <div className="setting-row">
            <div className="setting-info">
              <h3>Hard Mode</h3>
              <p className="setting-description">
                Any revealed hints must be used in subsequent guesses
              </p>
            </div>
            <div className="setting-control">
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={hardMode} 
                  onChange={toggleHardMode}
                  disabled={gameInProgress}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          
          <div className="setting-row">
            <div className="setting-info">
              <h3>Dark Theme</h3>
              <p className="setting-description">
                Toggle between light and dark theme
              </p>
            </div>
            <div className="setting-control">
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={darkTheme} 
                  onChange={toggleTheme}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          
          <div className="setting-row">
            <div className="setting-info">
              <h3>Word Suggestions</h3>
              <p className="setting-description">
                View optimal starting words based on letter frequency
              </p>
            </div>
            <div className="setting-control">
              <button 
                className="suggestions-button" 
                onClick={handleShowSuggestions}
              >
                {showSuggestions ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          
          {showSuggestions && (
            <div className="suggestions-container">
              <h4>Top Starting Words:</h4>
              <ul className="suggestions-list">
                {suggestions.map(word => (
                  <li key={word}>{word.toUpperCase()}</li>
                ))}
              </ul>
              <p className="suggestions-hint">
                These words contain the most frequent letters in our word list.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
