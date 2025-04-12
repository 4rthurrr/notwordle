const GAME_STATE_KEY = 'notwordle_gameState';
const STATS_KEY = 'notwordle_stats';

// Save current game state to localStorage
export const saveGameState = (gameState) => {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
};

// Load game state from localStorage
export const loadGameState = () => {
  try {
    const savedState = localStorage.getItem(GAME_STATE_KEY);
    return savedState ? JSON.parse(savedState) : null;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
};

// Initialize player stats object
const initializeStats = () => {
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    hintsUsed: 0,
    guessDistribution: {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
    },
    lastCompleted: null,
    continuousGamesPlayed: 0,
    continuousGamesWon: 0
  };
};

// Update stats after game completion
export const updateStats = (gameState) => {
  try {
    // Load current stats or initialize if not exists
    const savedStatsString = localStorage.getItem(STATS_KEY);
    const stats = savedStatsString ? JSON.parse(savedStatsString) : initializeStats();
    
    const today = new Date().toISOString().slice(0, 10);
    
    // Only update stats for daily games or if the game is completed
    if (gameState.gameStatus !== 'playing') {
      // For daily mode, only update once per day
      if (gameState.gameMode === 'daily' && stats.lastCompleted !== today) {
        stats.gamesPlayed += 1;
        
          stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
          
          // Update guess distribution
          const numGuesses = gameState.guesses.length;
          stats.guessDistribution[numGuesses] += 1;
        } else {
          // Lost game
          stats.currentStreak = 0;
        }
        
        stats.lastCompleted = today;
      } 
      // For continuous mode, always update stats
      else if (gameState.gameMode === 'continuous') {
        stats.continuousGamesPlayed = (stats.continuousGamesPlayed || 0) + 1;
        if (gameState.gameStatus === 'won') {
          stats.continuousGamesWon = (stats.continuousGamesWon || 0) + 1;
        }
      }
      
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    }
    
    return stats;
  } catch (error) {
    console.error('Failed to update stats:', error);
    return initializeStats();
  }
};

// Load player stats
export const getStats = () => {
  try {
    const savedStats = localStorage.getItem(STATS_KEY);
    return savedStats ? JSON.parse(savedStats) : initializeStats();
  } catch (error) {
    console.error('Failed to load stats:', error);
    return initializeStats();
  }
};
