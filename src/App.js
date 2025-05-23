import React, { useState, useEffect } from 'react';
import './App.css';
import GameBoard from './components/GameBoard';
import Header from './components/Header';
import RulesModal from './components/modals/RulesModal';
import StatsModal from './components/modals/StatsModal';
import SettingsModal from './components/modals/SettingsModal';
import { getRandomWord } from './services/wordService';
import { loadGameState, saveGameState, getStats, updateStats } from './services/storageService';
import Confetti from './components/Confetti';

function App() {
  const [gameState, setGameState] = useState(null);
  const [showRules, setShowRules] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hardMode, setHardMode] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [definition, setDefinition] = useState(null);
  const [stats, setStats] = useState(null);
  const [gameCount, setGameCount] = useState(1);

  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem('notwordle_theme');
    if (savedTheme) {
      setDarkTheme(savedTheme === 'dark');
    }
    
    // Check if first visit
    const hasVisitedBefore = localStorage.getItem('notwordle_visited');
    if (!hasVisitedBefore) {
      // Show rules on first visit
      setShowRules(true);
      localStorage.setItem('notwordle_visited', 'true');
    }
    
    const initGame = async () => {
      // Try to load saved game state
      const savedState = loadGameState();
      const savedStats = getStats();
      setStats(savedStats);
      
      if (savedState) {
        setGameState(savedState);
        
        // If game is completed, fetch definition
        if (savedState.gameStatus !== 'playing') {
          fetchDefinition(savedState.targetWord);
        }
        
        // Show stats if game is over
        if (savedState.gameStatus !== 'playing' && !savedState.statsShown) {
          setTimeout(() => {
            setShowStats(true);
            setGameState(prev => ({...prev, statsShown: true}));
          }, 1500);
        }
        
        // Show confetti if game is won
        if (savedState.gameStatus === 'won' && !savedState.confettiShown) {
          setShowConfetti(true);
          setGameState(prev => ({...prev, confettiShown: true}));
        }
      } else {
        // Start a new game
        const targetWord = await getRandomWord();
        const newState = {
          targetWord,
          guesses: [],
          currentGuess: '',
          gameStatus: 'playing',
          date: new Date().toISOString(),
          hardMode: hardMode,
          confettiShown: false,
          statsShown: false,
          gameCount: 1,
          hintLevel: 1,
          usedHints: []
        };
        setGameState(newState);
      }
    };

    initGame();
  }, [hardMode]);

  // Update body class when theme changes
  useEffect(() => {
    if (darkTheme) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
    localStorage.setItem('notwordle_theme', darkTheme ? 'dark' : 'light');
  }, [darkTheme]);

  useEffect(() => {
    if (gameState) {
      saveGameState(gameState);
      
      // Update stats when game status changes
      if (gameState.gameStatus !== 'playing') {
        const newStats = updateStats(gameState);
        setStats(newStats);
      }
    }
  }, [gameState]);

  const fetchDefinition = async (word) => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (response.ok) {
        const data = await response.json();
        setDefinition(data[0]);
      }
    } catch (error) {
      console.error("Error fetching definition:", error);
    }
  };

  const toggleRules = () => setShowRules(!showRules);
  const toggleStats = () => setShowStats(!showStats);
  const toggleSettings = () => setShowSettings(!showSettings);
  
  const toggleTheme = () => setDarkTheme(!darkTheme);
  
  const toggleHardMode = () => {
    setHardMode(!hardMode);
    if (gameState && gameState.guesses.length === 0) {
      setGameState({...gameState, hardMode: !hardMode});
    }
  };

  const handleGameComplete = (status) => {
    if (status === 'won') {
      setShowConfetti(true);
    }
    
    // Show stats after game completion
    setTimeout(() => {
      setShowStats(true);
    }, 1500);
    
    // Fetch definition 
    fetchDefinition(gameState.targetWord);
  };

  const startNewGame = async () => {
    // Get a new random word, excluding the current word
    const newWord = await getRandomWord(gameState?.targetWord);
    
    // Create new game state
    const newState = {
      targetWord: newWord,
      guesses: [],
      currentGuess: '',
      gameStatus: 'playing',
      date: new Date().toISOString(),
      hardMode: gameState?.hardMode || false,
      confettiShown: false,
      statsShown: false,
      gameCount: gameCount + 1,
      hintLevel: 1,
      usedHints: []
    };
    
    setGameState(newState);
    setShowStats(false);
    setShowConfetti(false);
    setDefinition(null);
    setGameCount(prev => prev + 1);
  };

  if (!gameState) return (
    <div className="loading">
      <div className="loading-spinner"></div>
    </div>
  );

  return (
    <div className="app">
      <Header 
        onRulesClick={toggleRules} 
        onStatsClick={toggleStats} 
        onSettingsClick={toggleSettings}
        onThemeToggle={toggleTheme}
        darkTheme={darkTheme}
      />
      <GameBoard 
        gameState={gameState} 
        setGameState={setGameState}
        onGameComplete={handleGameComplete}
      />
      
      {showConfetti && <Confetti />}
      
      {showRules && (
        <>
          <div className="overlay" onClick={toggleRules}></div>
          <RulesModal onClose={toggleRules} darkTheme={darkTheme} />
        </>
      )}
      
      {showStats && (
        <>
          <div className="overlay" onClick={toggleStats}></div>
          <StatsModal 
            onClose={toggleStats} 
            stats={stats} 
            darkTheme={darkTheme}
            gameState={gameState}
            definition={definition}
            onPlayAgain={startNewGame}
          />
        </>
      )}
      
      {showSettings && (
        <>
          <div className="overlay" onClick={toggleSettings}></div>
          <SettingsModal 
            onClose={toggleSettings}
            darkTheme={darkTheme}
            hardMode={hardMode}
            toggleHardMode={toggleHardMode}
            toggleTheme={toggleTheme}
            gameInProgress={gameState.guesses.length > 0}
          />
        </>
      )}
    </div>
  );
}

export default App;
