import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import Keyboard from './Keyboard';
import { checkWordValidity } from '../services/wordService';
import { calculateGuessResults } from '../services/gameLogic';
import './GameBoard.css';

function GameBoard({ gameState, setGameState, onGameComplete }) {
  const [message, setMessage] = useState('');
  const [showGiveUpConfirm, setShowGiveUpConfirm] = useState(false);
  
  const handleKeyPress = async (key) => {
    if (gameState.gameStatus !== 'playing') return;
    
    if (key === 'Backspace') {
      setGameState({
        ...gameState,
        currentGuess: gameState.currentGuess.slice(0, -1)
      });
    } else if (key === 'Enter') {
      if (gameState.currentGuess.length !== 5) {
        setMessage('Word must be 5 letters');
        return;
      }
      
      // Check if word is valid
      const isValid = await checkWordValidity(gameState.currentGuess);
      if (!isValid) {
        setMessage('Not in word list');
        return;
      }
      
      // Hard mode check
      if (gameState.hardMode && gameState.guesses.length > 0) {
        const lastGuessResult = calculateGuessResults(
          gameState.guesses[gameState.guesses.length - 1], 
          gameState.targetWord
        );
        
        // Check if confirmed letters are used
        for (let i = 0; i < lastGuessResult.length; i++) {
          if (lastGuessResult[i].status !== 'absent') {
            if (!gameState.currentGuess.includes(lastGuessResult[i].letter)) {
              setMessage(`Must use ${lastGuessResult[i].letter.toUpperCase()}`);
              return;
            }
          }
        }
      }
      
      // Add guess to list
      const newGuesses = [...gameState.guesses, gameState.currentGuess];
      
      // Check if won
      let newStatus = gameState.gameStatus;
      if (gameState.currentGuess === gameState.targetWord) {
        newStatus = 'won';
      } else if (newGuesses.length === 6) {
        newStatus = 'lost';
      }
      
      setGameState({
        ...gameState,
        guesses: newGuesses,
        currentGuess: '',
        gameStatus: newStatus
      });
    } else if (/^[a-zA-Z]$/.test(key) && gameState.currentGuess.length < 5) {
      setGameState({
        ...gameState,
        currentGuess: gameState.currentGuess + key.toLowerCase()
      });
    }
  };
  
  useEffect(() => {
    // Clear message after 2 seconds
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);
  
  // Result/endgame message
  let endMessage = '';
  if (gameState.gameStatus === 'won') {
    endMessage = 'Congratulations!';
  } else if (gameState.gameStatus === 'lost') {
    endMessage = `The word was ${gameState.targetWord.toUpperCase()}`;
  }

  // Handle Give Up action
  const handleGiveUp = () => {
    setShowGiveUpConfirm(true);
  };

  const confirmGiveUp = () => {
    setGameState({
      ...gameState,
      gameStatus: 'lost',
      gaveUp: true
    });
    
    if (onGameComplete) {
      onGameComplete('lost');
    }
    
    setShowGiveUpConfirm(false);
  };

  const cancelGiveUp = () => {
    setShowGiveUpConfirm(false);
  };

  return (
    <div className="game-board">
      {message && <div className="message">{message}</div>}
      {endMessage && <div className="end-message">{endMessage}</div>}
      
      <Grid 
        guesses={gameState.guesses}
        currentGuess={gameState.currentGuess}
        targetWord={gameState.targetWord}
      />
      
      {gameState.gameStatus === 'playing' && (
        <button 
          className="give-up-button" 
          onClick={handleGiveUp}
          aria-label="Give up and reveal word"
        >
          Reveal Word
        </button>
      )}
      
      <Keyboard 
        onKeyPress={handleKeyPress}
        guesses={gameState.guesses}
        targetWord={gameState.targetWord}
      />
      
      {/* Give Up Confirmation Modal */}
      {showGiveUpConfirm && (
        <div className="give-up-modal">
          <div className="give-up-content">
            <p>Are you sure you want to give up and reveal the word?</p>
            <div className="give-up-buttons">
              <button onClick={confirmGiveUp} className="confirm-button">
                Yes, Show Word
              </button>
              <button onClick={cancelGiveUp} className="cancel-button">
                No, Keep Playing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameBoard;
