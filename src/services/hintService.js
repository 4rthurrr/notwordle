import { getWordDefinition } from './wordService';

// Generate a hint for the target word
export const generateHint = async (targetWord, hintLevel = 1, usedHints = []) => {
  // Different types of hints based on the level
  const hints = [
    { type: 'definition', generate: getDefinitionHint },
    { type: 'firstLetter', generate: getFirstLetterHint },
    { type: 'rhyme', generate: getRhymeHint },
    { type: 'anagram', generate: getAnagramHint },
    { type: 'pattern', generate: getPatternHint }
  ];
  
  // Filter out already used hint types
  const availableHints = hints.filter(hint => 
    !usedHints.some(used => used.type === hint.type)
  );
  
  // If all hint types used, allow repeating but give stronger versions
  const hintGenerator = availableHints.length > 0 
    ? availableHints[0] 
    : hints.find(h => h.type === 'pattern'); // Pattern hints can escalate
  
  // Generate the hint
  return await hintGenerator.generate(targetWord, hintLevel);
};

// Get a definition-based hint
const getDefinitionHint = async (word) => {
  try {
    const definition = await getWordDefinition(word);
    if (definition && definition.meanings && definition.meanings.length > 0) {
      return {
        type: 'definition',
        text: `Definition: ${definition.meanings[0].definitions[0].definition}`,
        level: 1
      };
    }
  } catch (error) {
    console.error("Error getting definition hint:", error);
  }
  
  // Fallback if definition not found
  return {
    type: 'definition',
    text: `This word has ${word.length} letters.`,
    level: 1
  };
};

// Get the first letter as a hint
const getFirstLetterHint = (word) => {
  return {
    type: 'firstLetter',
    text: `The word starts with "${word[0].toUpperCase()}".`,
    level: 1
  };
};

// Get a rhyming word as a hint
const getRhymeHint = (word) => {
  // Simple rhyme algorithm - match last 2 letters
  const commonRhymes = {
    'at': ['cat', 'hat', 'bat', 'rat'],
    'ar': ['car', 'far', 'bar', 'star'],
    'an': ['pan', 'man', 'fan', 'tan'],
    'ay': ['day', 'way', 'say', 'may'],
    'et': ['get', 'met', 'set', 'wet'],
    'it': ['bit', 'hit', 'sit', 'fit'],
    'og': ['dog', 'fog', 'log', 'bog'],
    'op': ['hop', 'top', 'pop', 'mop'],
    'ot': ['hot', 'lot', 'not', 'pot'],
    'un': ['fun', 'run', 'sun', 'gun'],
    'ed': ['bed', 'red', 'fed', 'led']
  };
  
  const ending = word.slice(-2);
  let rhymes = commonRhymes[ending] || [];
  
  // Filter out the target word itself
  rhymes = rhymes.filter(r => r !== word);
  
  if (rhymes.length > 0) {
    const randomRhyme = rhymes[Math.floor(Math.random() * rhymes.length)];
    return {
      type: 'rhyme',
      text: `It rhymes with "${randomRhyme}".`,
      level: 1
    };
  }
  
  // Fallback
  return {
    type: 'rhyme',
    text: `This word ends with "${ending}".`,
    level: 1
  };
};

// Get an anagram-style hint
const getAnagramHint = (word) => {
  // Scramble the letters
  const letters = word.split('');
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  
  return {
    type: 'anagram',
    text: `Unscramble: ${letters.join('').toUpperCase()}`,
    level: 1
  };
};

// Get a pattern hint (reveals some letters)
const getPatternHint = (word, level = 1) => {
  // For level 1: reveal one random letter position
  // For level 2+: reveal more letters
  const numLettersToReveal = Math.min(level, word.length - 1);
  
  // Create a masked version with underscores
  const pattern = Array(word.length).fill('_');
  
  // Create a pool of positions to reveal (not already revealed)
  let positions = [];
  for (let i = 0; i < word.length; i++) {
    positions.push(i);
  }
  
  // Shuffle positions
  positions.sort(() => Math.random() - 0.5);
  
  // Reveal n letters
  for (let i = 0; i < numLettersToReveal; i++) {
    if (positions.length > 0) {
      const pos = positions.pop();
      pattern[pos] = word[pos].toUpperCase();
    }
  }
  
  return {
    type: 'pattern',
    text: `Pattern: ${pattern.join(' ')}`,
    level: level
  };
};
