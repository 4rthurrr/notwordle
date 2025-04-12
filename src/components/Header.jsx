import React from 'react';
import './Header.css';

function Header({ onRulesClick, onStatsClick, onSettingsClick, onThemeToggle, darkTheme }) {
  return (
    <header className="header">
      <div className="header-left">
        <button className="icon-button" onClick={onRulesClick} aria-label="Game Rules">
          <i className="icon icon-help">?</i>
        </button>
      </div>
      <h1>NotWordle</h1>
      <div className="header-right">
        <button className="icon-button" onClick={onStatsClick} aria-label="Statistics">
          <i className="icon icon-stats">📊</i>
        </button>
        <button className="icon-button" onClick={onSettingsClick} aria-label="Settings">
          <i className="icon icon-settings">⚙️</i>
        </button>
        <button className="icon-button theme-toggle" onClick={onThemeToggle} aria-label="Toggle Theme">
          {darkTheme ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}

export default Header;
