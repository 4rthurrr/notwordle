import React, { createContext, useContext, useState, useEffect } from 'react';
import { observeAuthState } from '../services/authService';
import { loadUserGameState, saveUserGameState, updateUserStats } from '../services/userDataService';
import { loadGameState as loadLocalGameState, saveGameState as saveLocalGameState } from '../services/storageService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = observeAuthState((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  // Save game state function that handles both local and cloud storage
  const saveGameState = async (gameState) => {
    // Always save locally for fast access
    saveLocalGameState(gameState);
    
    // If logged in, also save to the cloud
    if (currentUser) {
      try {
        await saveUserGameState(currentUser.uid, gameState);
      } catch (err) {
        setError('Failed to save game to cloud. Changes saved locally.');
        console.error(err);
      }
    }
  };

  // Load game state with cloud priority
  const loadGameState = async () => {
    if (currentUser) {
      try {
        const { data, success } = await loadUserGameState(currentUser.uid);
        if (success && data && data.gameState) {
          return data.gameState;
        }
      } catch (err) {
        setError('Failed to load from cloud. Using local data.');
        console.error(err);
      }
    }
    
    // Fall back to local storage
    return loadLocalGameState();
  };

  const value = {
    currentUser,
    loading,
    error,
    setError,
    saveGameState,
    loadGameState
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
