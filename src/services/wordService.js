// A list of 5-letter words for our game
const WORD_LIST = [
  'apple', 'baker', 'chunk', 'diode', 'evade', 'float', 'glory', 
  'house', 'input', 'jolly', 'knack', 'lemon', 'mango', 'novel', 
  'ocean', 'prime', 'quiet', 'river', 'stare', 'tango', 'under', 
  'valve', 'weary', 'xenon', 'youth', 'zebra', 'crank', 'blast',
  'plaid', 'skate', 'train', 'crane', 'study', 'slate', 'pixel',
  // ... more words
];

// Alternative difficulty word lists
const EASY_WORDS = [
  'apple', 'beach', 'cloud', 'dance', 'earth', 'fruit', 'happy',
  'light', 'money', 'night', 'plane', 'queen', 'river', 'smile',
  'table', 'water', 'young',
  // ... more common words
];

const HARD_WORDS = [
  'adept', 'blitz', 'cajun', 'dwarf', 'epoxy', 'fjord', 'glyph',
  'ivory', 'jazzy', 'khaki', 'lymph', 'myrth', 'onyx', 'proxy',
  'quartz', 'sphinx', 'vexed', 'waltz', 'yacht', 'zesty',
  // ... more obscure words
];

// Dictionary API cache
const definitionCache = {};

// Fetch complete word list when needed
const fetchFullWordList = async () => {
  // In a real app, we might fetch from an API or load from a larger file
  return WORD_LIST;
};

// Select a daily word based on date
export const getTodaysWord = async (difficulty = 'normal') => {
  let wordList;
  
  switch(difficulty) {
    case 'easy':
      wordList = EASY_WORDS;
      break;
    case 'hard':
      wordList = HARD_WORDS;
      break;
    default:
      wordList = await fetchFullWordList();
  }
  
  const today = new Date().toISOString().slice(0, 10);
  // Create a more complex hash based on date components
  const dateObj = new Date(today);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const day = dateObj.getDate();
  
  // Combine date components with prime numbers for better distribution
  const hash = (year * 37 + month * 31 + day * 41) % wordList.length;
  return wordList[Math.abs(hash)];
};

// Get a random word for continuous play
export const getRandomWord = async (difficulty = 'normal', excludeWord = null) => {
  let wordList;
  
  switch(difficulty) {
    case 'easy':
      wordList = EASY_WORDS;
      break;
    case 'hard':
      wordList = HARD_WORDS;
      break;
    default:
      wordList = await fetchFullWordList();
  }
  
  // Filter out the excluded word if provided
  if (excludeWord) {
    wordList = wordList.filter(word => word !== excludeWord);
  }
  
  // Get a random word from the list
  const randomIndex = Math.floor(Math.random() * wordList.length);
  return wordList[randomIndex];
};

// Check if a word is valid using Dictionary API
export const checkWordValidity = async (word) => {
  // First check our local word list for performance
  const wordList = await fetchFullWordList();
  if (wordList.includes(word.toLowerCase())) {
    return true;
  }
  
  // If not in our list, check with Free Dictionary API
  try {
    // Add cache to avoid repeated API calls
    if (definitionCache[word] !== undefined) {
      return definitionCache[word];
    }
    
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const isValid = response.ok;
    definitionCache[word] = isValid;
    return isValid;
  } catch (error) {
    console.error("Error checking word validity:", error);
    // If API fails, fall back to local list only
    return wordList.includes(word.toLowerCase());
  }
};

// Get word definition from Dictionary API
export const getWordDefinition = async (word) => {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (response.ok) {
      const data = await response.json();
      return data[0];  // Return first entry
    }
    return null;
  } catch (error) {
    console.error("Error fetching definition:", error);
    return null;
  }
};

// Get letter frequency data for hint system
export const getLetterFrequency = async () => {
  const wordList = await fetchFullWordList();
  const frequency = {};
  
  wordList.forEach(word => {
    // Count unique letters in each word
    const uniqueLetters = [...new Set(word.split(''))];
    uniqueLetters.forEach(letter => {
      frequency[letter] = (frequency[letter] || 0) + 1;
    });
  });
  
  return frequency;
};

// Get top starting word suggestions based on letter frequency
export const getStartingWordSuggestions = async () => {
  const wordList = await fetchFullWordList();
  const frequency = await getLetterFrequency();
  
  // Score words by sum of their letter frequencies (unique letters only)
  const scoredWords = wordList.map(word => {
    const uniqueLetters = [...new Set(word.split(''))];
    const score = uniqueLetters.reduce((sum, letter) => sum + (frequency[letter] || 0), 0);
    return { word, score };
  });
  
  // Sort by score and return top 5
  return scoredWords
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => item.word);
};
