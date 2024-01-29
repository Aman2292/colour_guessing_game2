const readline = require('readline');
const axios = require('axios');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = [
  'red', 'blue', 'green', 'yellow', 'purple',
  'orange', 'cyan', 'pink', 'teal', 'maroon',
  'navy', 'lime', 'indigo', 'brown', 'olive',
  'coral', 'silver', 'gold', 'magenta', 'violet'
];

const maxAttempts = 5;

const getRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

let target = getRandomColor();
let guess;
let correct = false;
let numTries = 0;

const checkGuess = () => {
  if (!colors.includes(guess)) {
    console.log('That is not a valid color. Please try again.');
    return false;
  } else if (guess > target) {
    console.log('Too high! Try again.');
    return false;
  } else if (guess < target) {
    console.log('Too low! Try again.');
    return false;
  } else {
    correct = true;
    return true;
  }
};

const runGame = () => {
  numTries = 0;
  target = getRandomColor();
  correct = false;

  console.log(
    'I am thinking of one of these colors:\n\n' +
    colors.join(', ') +
    '\n\nWhat color am I thinking of?\n'
  );

  const promptUser = () => {
    rl.question('Enter your guess: ', (answer) => {
      guess = answer.toLowerCase();
      numTries++;

      if (!checkGuess()) {
        if (numTries < maxAttempts) {
          promptUser();
        } else {
          console.log(`Sorry, you've reached the maximum number of attempts. The correct color was "${target}".`);
          askToRestart();
        }
      } else {
        console.log(`Congratulations! You guessed the correct color "${target}" in ${numTries} tries!`);
        askToRestart();
      }
    });
  };

  promptUser();
};

const askToRestart = () => {
  rl.question('Do you want to play again? (yes/no): ', (answer) => {
    if (answer.toLowerCase() === 'yes') {
      runGame();
    } else {
      console.log('Thanks for playing! Goodbye.');
      rl.close();
    }
  });
};

// Check if the server is running before starting the game
axios.get('http://localhost:3000/health')
  .then(() => {
    // If the server is running, start the game
    runGame();
  })
  .catch(() => {
    console.error('Server is not running. Please start the server.');
    rl.close();
  });
