import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Save game state to Firestore
export const saveUserGameState = async (userId, gameState) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // Update existing document
      await updateDoc(userDocRef, { 
        gameState,
        lastUpdated: new Date()
      });
    } else {
      // Create new user document
      await setDoc(userDocRef, {
        gameState,
        stats: {
          gamesPlayed: 0,
          gamesWon: 0,
          currentStreak: 0,
          maxStreak: 0,
          hintsUsed: 0,
          guessDistribution: {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
          },
        },
        lastUpdated: new Date(),
        createdAt: new Date()
      });
    }
    return { success: true };
  } catch (error) {
    console.error('Error saving game state:', error);
    return { success: false, error: error.message };
  }
};

// Load game state from Firestore
export const loadUserGameState = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return { 
        data: userDoc.data(), 
        success: true 
      };
    }
    return { data: null, success: true };
  } catch (error) {
    console.error('Error loading game state:', error);
    return { data: null, success: false, error: error.message };
  }
};

// Update user statistics
export const updateUserStats = async (userId, stats) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { 
      stats,
      lastUpdated: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating stats:', error);
    return { success: false, error: error.message };
  }
};
