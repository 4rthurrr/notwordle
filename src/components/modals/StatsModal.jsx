import React from 'react';
import './Modal.css';

function StatsModal({ onClose, stats, gameState, definition }) {
  if (!stats) return null;
  
  // Calculate win percentage
  const winPercentage = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
    : 0;
  
  // Find the highest value in guess distribution for scaling
  const maxDistribution = Math.max(...Object.values(stats.guessDistribution), 1);
  
  // Format distribution for display
  const renderDistribution = () => {
    return [1, 2, 3, 4, 5, 6].map(guessNumber => {
      const count = stats.guessDistribution[guessNumber] || 0;
      const percentage = (count / maxDistribution) * 100;
      const isCurrentGame = gameState.gameStatus === 'won' && gameState.guesses.length === guessNumber;
      
      return (
        <div key={guessNumber} className="distribution-row">
          <div className="guess-number">{guessNumber}</div>
          <div 
            className={`distribution-bar ${isCurrentGame ? 'current-game' : ''}`}
            style={{ width: `${Math.max(percentage, 8)}%` }}
          >
            {count}
          </div>
        </div>
      );
    });
  };
  
  // Format time until next word
  const formatNextWordTime = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diffMs = tomorrow - now;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    return `${diffHrs}h ${diffMins}m ${diffSecs}s`;
  };
  
  // Render word definition if available
  const renderDefinition = () => {
    if (!definition) return null;
    
    const titleMessage = gameState.gaveUp 
      ? "You gave up! The word was:"
      : "Word of the Day:";
    
    return (
      <div className="word-definition">
        <h3>{titleMessage} {gameState.targetWord.toUpperCase()}</h3>
        {definition.meanings && definition.meanings.length > 0 && (
          <>
            <p className="part-of-speech">{definition.meanings[0].partOfSpeech}</p>
            <p className="definition">{definition.meanings[0].definitions[0].definition}</p>
            {definition.meanings[0].definitions[0].example && (
              <p className="example">"{definition.meanings[0].definitions[0].example}"</p>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="modal stats-modal">
      <div className="modal-header">
        <h2 className="modal-title">Statistics</h2>
        <button className="close-button" onClick={onClose}>&times;</button>
      </div>
      
      <div className="modal-content">
        <div className="stats-container">
          <div className="stat-box">
            <div className="stat-number">{stats.gamesPlayed}</div>
            <div className="stat-label">Played</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{winPercentage}</div>
            <div className="stat-label">Win %</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{stats.currentStreak}</div>
            <div className="stat-label">Current Streak</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{stats.maxStreak}</div>
            <div className="stat-label">Max Streak</div>
          </div>
        </div>
        
        <h3>Guess Distribution</h3>
        <div className="guess-distribution">
          {renderDistribution()}
        </div>
        
        {gameState.gameStatus !== 'playing' && renderDefinition()}
        
        <div className="next-game-container">
          <h3>NEXT WORD</h3>
          <div className="countdown">{formatNextWordTime()}</div>
        </div>
        
        <div className="share-container">
          <button className="share-button" onClick={() => {
            // Create shareable results text
            const shareLines = [`NotWordle ${gameState.guesses.length}/6`];
            
            // Add emoji grid
            gameState.guesses.forEach(guess => {
              let line = '';
              for (let i = 0; i < guess.length; i++) {
                if (guess[i] === gameState.targetWord[i]) {
                  line += '🟩';
                } else if (gameState.targetWord.includes(guess[i])) {
                  line += '🟨';
                } else {
                  line += '⬛';
                }
              }
              shareLines.push(line);
            });
            
            // Share text
            const shareText = shareLines.join('\n');
            
            // Use Web Share API if available
            if (navigator.share) {
              navigator.share({
                title: 'My NotWordle Results',
                text: shareText
              });
            } else {
              // Fallback to clipboard
              navigator.clipboard.writeText(shareText);
              alert('Results copied to clipboard!');
            }
          }}>
            SHARE
          </button>
        </div>
      </div>
    </div>
  );
}

export default StatsModal;
