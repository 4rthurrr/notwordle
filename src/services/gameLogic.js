// Calculate results for a guess compared to target word
export const calculateGuessResults = (guess, targetWord) => {
  const result = [];
  const targetLetters = targetWord.split('');
  
  // First pass: Mark correct letters
  for (let i = 0; i < guess.length; i++) {
    const guessLetter = guess[i];
    
    if (guessLetter === targetLetters[i]) {
      result[i] = { letter: guessLetter, status: 'correct' };
      targetLetters[i] = null; // Mark as used
    } else {
      result[i] = { letter: guessLetter, status: null }; // Temporarily null
    }
  }
  
  // Second pass: Mark present or absent letters
  for (let i = 0; i < guess.length; i++) {
    if (result[i].status === null) {
      const guessLetter = guess[i];
      const letterIndex = targetLetters.indexOf(guessLetter);
      
      if (letterIndex !== -1) {
        result[i].status = 'present';
        targetLetters[letterIndex] = null; // Mark as used
      } else {
        result[i].status = 'absent';
      }
    }
  }
  
  return result;
};

// For hard mode: Check if a guess uses all confirmed letters from previous guesses
export const checkHardModeConstraints = (newGuess, previousGuesses, targetWord) => {
  if (!previousGuesses.length) return { valid: true };
  
  const lastGuess = previousGuesses[previousGuesses.length - 1];
  const lastResults = calculateGuessResults(lastGuess, targetWord);
  
  // Check confirmed positions (green letters)
  for (let i = 0; i < lastResults.length; i++) {
    if (lastResults[i].status === 'correct' && newGuess[i] !== lastResults[i].letter) {
      return { 
        valid: false, 
        reason: `${i+1}th letter must be ${lastResults[i].letter.toUpperCase()}` 
      };
    }
  }
  
  // Check confirmed letters (yellow letters)
  for (let i = 0; i < lastResults.length; i++) {
    if (lastResults[i].status === 'present') {
      if (!newGuess.includes(lastResults[i].letter)) {
        return { 
          valid: false, 
          reason: `Guess must include ${lastResults[i].letter.toUpperCase()}` 
        };
      }
    }
  }
  
  return { valid: true };
};
