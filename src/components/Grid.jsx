import React from 'react';
import Letter from './Letter';
import { calculateGuessResults } from '../services/gameLogic';
import './Grid.css';

function Grid({ guesses, currentGuess, targetWord }) {
  // Create array of 6 rows (max guesses)
  const rows = Array(6).fill(null);
  
  return (
    <div className="grid">
      {rows.map((_, rowIndex) => {
        // Determine what to show in this row
        let rowContent;
        let results = null;
        
        if (rowIndex < guesses.length) {
          // Completed guess with results
          rowContent = guesses[rowIndex];
          results = calculateGuessResults(rowContent, targetWord);
        } else if (rowIndex === guesses.length) {
          // Current guess
          rowContent = currentGuess.padEnd(5);
        } else {
          // Empty row
          rowContent = '     ';
        }
        
        return (
          <div key={rowIndex} className="row">
            {rowContent.split('').map((letter, colIndex) => (
              <Letter 
                key={colIndex}
                letter={letter}
                status={results ? results[colIndex].status : null}
                revealed={results !== null}
                position={colIndex}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default Grid;
