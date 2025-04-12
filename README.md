# NotWordle

NotWordle is a word-guessing game inspired by the popular Wordle game. Challenge yourself to guess a 5-letter word within 6 attempts, with color-coded feedback after each guess.

![image](https://github.com/user-attachments/assets/9b064f95-0470-4ad7-8268-ecb06f4c1eca)

![image](https://github.com/user-attachments/assets/50340524-a113-4002-910e-ab925ddb51f6)


## 🎮 Features

- **Core Wordle Gameplay**: Guess a 5-letter word in 6 attempts
- **Color Feedback System**: Green for correct letters in correct positions, yellow for correct letters in wrong positions
- **Word Validation**: Uses Free Dictionary API to validate guesses
- **Hint System**: Get hints when stuck on a difficult word
- **Continuous Play**: New word available immediately after completing a game
- **Statistics Tracking**: Track your win rate, streaks, and guess distribution
- **Share Results**: Share your results with emoji grid patterns
- **Responsive Design**: Works on both desktop and mobile devices
- **Dark/Light Themes**: Choose your preferred visual theme

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/4rthurrr/notwordle.git
cd notwordle
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
# or
yarn build
```

The production-ready files will be available in the `build` directory.

## 🎯 How to Play

1. Type a 5-letter word and press Enter
2. After each guess, the letters will change color:
   - 🟩 Green: Letter is in the correct position
   - 🟨 Yellow: Letter is in the word but in the wrong position
   - ⬛ Gray: Letter is not in the word
3. Try to guess the word in 6 attempts or fewer
4. Use the hint button if you're stuck

## 🛠️ Technologies Used

- **React**: Frontend UI library
- **CSS Grid/Flexbox**: For responsive layouts
- **Dictionary API**: For word validation
- **Local Storage**: For saving game state and statistics
