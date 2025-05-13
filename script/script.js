let targetWord = ""; // Replace with a random word generator
let currentGuess = "";
let attempts = 0;

//six letter variables
let target6Word = "";
let current6Guess = "";
let attempts6 = 0;



const maxAttempts = 6;
let wordleGameInProgress = false;


// scoring system variables
let startTime, endTime, timeTaken;
let currentStreak = 0; // Tracks the current streak
let highestStreak = 0; // Tracks the highest streak achieved
let highestScore = 0;
let currentScore = 0;
let score = 0; // Total score for the game
let gameCorrect = false;
let hintsUsed = 0;
let maxHints = 3; // max number of hints for five letter words

//game letter mode
let gameLetterMode = 0;

//six letter variables
let currentSixLetterStreak = 0; // Tracks the current streak
let highestSixLetterStreak = 0; // Tracks the highest streak achieved
let highestSixLetterScore = 0;
let currentSixLetterScore = 0;
let scoreSixLetter = 0; // Total score for the game
let gameSixLetterCorrect = false;
let hintsUsedSixLetter = 0;
let maxHintsSixLetter = 3; // max number of hints for six letter words


// Check if the user is on a mobile device
const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
// let isMobileInputFocused = false; // Flag to track mobile input focus state


const dbName = "WordleDB";
const wordsStore = "words";
const sixLetterWordsStore = "sixletterwords";
const wordStoreKey = "wordlist";
const wordSixLetterStoreKey = "sixletterwordlist";

const usedWordsStore = "usedwords";
const usedSixLetterWordsStore = "usedsixletterwords";
const resultsStore = "gameResults";
const resultsSixLetterStore = "gameSixLetterResults";
const scoreStore = "scores";
const scoreSixLetterStore = "scoresSixLetter";
const streakStore = "streaks";
const streakSixLetterStore = "streaksSixLetter";
const globalGameStore = "globalScores";
const globalGameSixLetterStore = "globalScoresSixLetter";

let dailyChartInstance;
let monthlyChartInstance;
let overallChartInstance;

function logToScreen(message) {
  let logElement = document.getElementById("log");
  if (!logElement) {
    logElement = document.createElement("div");
    logElement.id = "log";

    logElement.style.position = "fixed";
    logElement.style.bottom = "10px";
    logElement.style.left = "10px"; // Add left positioning for visibility
    logElement.style.backgroundColor = "rgba(0,0,0,0.8)";
    logElement.style.color = "white";
    logElement.style.padding = "10px";
    logElement.style.zIndex = "9999";
    logElement.style.maxHeight = "200px"; // Limit height for overflow
    logElement.style.overflowY = "auto"; // Add scroll for overflow
    document.body.appendChild(logElement);
  }

  const messageElement = document.createElement("div");
  messageElement.textContent = message;
  logElement.appendChild(messageElement); // Add the new message to the log
}


function setLetterMode() {
  // Get all radio buttons with name 'options'
  const radios = document.querySelectorAll('input[name="gameLetterMode"]');

  // Loop through the radio buttons to find the checked one
  for (const radio of radios) {
      if (radio.checked) {
          gameLetterMode =  Number(radio.value);
          break;
      }
  }
  //console.log("game letter mode: " +  gameLetterMode);
  return gameLetterMode;

}


// function setLetterMode(value) {
//   // Get all radio buttons with name 'options'
//   const radios = document.querySelectorAll('input[name="options"]');
//   let isSet = false;

//   // Loop through the radio buttons
//   for (const radio of radios) {
//       if (radio.value === value) {
//           radio.checked = true; // Set this radio button as checked
//           isSet = true;
//           break;
//       }
//   }

//   // Update the status message
//   const status = document.getElementById('status');
//   if (isSet) {
//       status.textContent = `Option "${value}" is now selected.`;
//   } else {
//       status.textContent = `Option "${value}" not found.`;
//   }
// }


// Initialize the game with the target word
async function initializeGame(isChangeGameMode) {
  //console.log("Initializing game...");
  setLetterMode();

  const board = document.getElementById("board");
  board.innerHTML = ""; // Reset the board content

  const sixboard = document.getElementById("sixboard");
  sixboard.innerHTML = ""; // Reset the six letter board content

  const keyboard = document.getElementById("keyboard");
  keyboard.innerHTML = ""; // Reset keyboard

  const answerElement = document.getElementById("answer");
  answerElement.innerHTML = ""; // Clear the answer display

  const wordDescriptionElement = document.getElementById("wordDescription");
  wordDescriptionElement.innerHTML = ""; // Clear the answer display

  //await loadAndFilterWords();


  if(gameLetterMode === 5) {

    targetWord = await getRandomWord(); // Fetch a new target word
    if (!/^[A-Z]{5}$/.test(targetWord.toUpperCase())) {
      console.error("Invalid target word:", targetWord);
      alert("Failed to reset the game. Try again!");
      return;
    }

  } else {
    target6Word = await getRandomSixLetterWord(); // Fetch a new target word
    if (!/^[A-Z]{6}$/.test(target6Word.toUpperCase())) {
      console.error("Invalid target word:", target6Word);
      alert("Failed to reset the game. Try again!");
      return;
    }
  }


  
  if(gameLetterMode == 5)
  {
    create5Board(); // Recreate the game board (changing the game mode should not recreate just load)
  }
  else if(gameLetterMode == 6) 
  {
    create6Board(); // Recreate the game board (changing the game mode should not recreate just load)
  }

  //changing the game mode should load the correct scores
  populateGameScoresOnUI(gameLetterMode);

  createKeyboard(); // Recreate the keyboard

  if (isMobileDevice) {

    logToScreen('is mobile device');

  } else {
    document.removeEventListener("keydown", handleKeyboardInput);
    document.addEventListener("keydown", handleKeyboardInput);
  }


  // Get all radio buttons in the group and register handlers
  const radios = document.querySelectorAll('input[name="gameLetterMode"]');
  radios.forEach(radio => addChangeHandlerSafely(radio, handleRadioChange));

  const checkedRadio = document.querySelector('input[name="gameLetterMode"]:checked');
  
  setSubmitButtonDisabled(false);
  setResetButtonDisabled(true);

  updateProgress(checkedRadio.value);
  // starts the timer
  startGame();

}


function resetGame() {
  console.log("Resetting game...");

  // Reset game state
  currentGuess = "";
  current6Guess = "";
  attempts = 0;
  attempts6 = 0;


  // Reinitialize the game
  initializeGame(false)
    .then(() => {
      logToScreen("Resetting game...Successfull");
      //console.log("Game reset successfully.");
    })
    .catch((error) => {
      console.error("Error resetting game:", error);
      logToScreen(`Reset failed: ${error.message}`);
    });
}


// Initialize the app
window.onload = async () => {

  // creating the dictionary for 6 letters (once only during development)
  //extractWordsByLengthWithXHR("../dictionaries/words_dictionary.json" , 6 , "sixletter_dictionary.json");

  await loadAndFilterWords();
  await loadAndFilterSixLetterWords();
  await initializeGame(false);
  

};



// Register the Service Worker
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js') // Path to your sw.js file
//       .then((registration) => {
//         console.log('Service Worker registered with scope:', registration.scope);
//       })
//       .catch((error) => {
//         console.error('Service Worker registration failed:', error);
//       });
//   });
// }

// Add event listener to reset button
document.getElementById("reset-btn").addEventListener("click", resetGame);


function createKeyboard() {
  const keyboard = document.getElementById("keyboard");
  const rows = [
    "QWERTYUIOP",
    "ASDFGHJKL",
    "ZXCVBNM",
  ];

  rows.forEach((row, rowIndex) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("keyboard-row");

    row.split("").forEach((key) => {
      const button = document.createElement("button");
      button.textContent = key;
      button.onclick = () => handleInput(key);
      button.classList.add("key");
      rowDiv.appendChild(button);
    });

    // Add Backspace key at the end of the third row
    if (rowIndex === 2) {
      const backspaceButton = document.createElement("button");
      backspaceButton.innerHTML = "&#x232B;"; // Unicode for Backspace icon
      backspaceButton.onclick = () => handleDelete("Delete");; // Custom Backspace handler
      backspaceButton.classList.add("special-key" , "backspace");
      rowDiv.appendChild(backspaceButton);
    }

    keyboard.appendChild(rowDiv);
  });

  // Add Enter key in its own row
  const enterRow = document.createElement("div");
  enterRow.classList.add("keyboard-row");

  const enterButton = document.createElement("button");
  enterButton.textContent = "Submit";
  enterButton.onclick = () => handleEnter("Enter");
  enterButton.id = "submit"
  enterButton.classList.add("special-key");
  enterRow.appendChild(enterButton);
  keyboard.appendChild(enterRow);
}


function populateGameScoresOnUI(gameLetterMode)
{
  currentSixLetterScore
  currentSixLetterStreak
  highestSixLetterScore
  highestSixLetterStreak
}

function updateProgress(gameMode){
let glm = gameMode;
//console.log("letter mode" + glm);
  getGlobalValues((globalValues , glm) => {
    if (globalValues) {
        // console.log("Highest Streak:", globalValues.highestStreak ? globalValues.highestStreak : 0);
        // console.log("Current Streak:", globalValues.currentStreak ? globalValues.currentStreak : 0);
        // console.log("Previous Score:", globalValues.currentScore ? globalValues.currentScore : 0);
        // console.log("Highest Score:", globalValues.highestScore ? globalValues.highestScore : 0);
        // console.log("Overall Score:", globalValues.overallScore ? globalValues.overallScore : 0);

        const highestStreakElement = document.getElementById('highestStreak');
        //'Highest Streak:' +
        highestStreakElement.textContent =  (globalValues.highestStreak ? globalValues.highestStreak : 0).toString();
      
        const currentStreakElement = document.getElementById('currentStreak');
        currentStreakElement.textContent =  (globalValues.currentStreak ? globalValues.currentStreak : 0).toString();
      
        //'Highest Score:' + 
        const highestScoreElement = document.getElementById('highestScore');
        highestScoreElement.textContent = (globalValues.highestScore ? globalValues.highestScore : 0).toString();
      
        //const currentScoreElement = document.getElementById('currentScore');
        //currentScoreElement.textContent = 'Current Score:' + (globalValues.currentScore ? globalValues.currentScore : 0).toString();

        //'Overall Score:' +
        const overallScoreElement = document.getElementById('overallScore');
        overallScoreElement.textContent =  (globalValues.overallScore? globalValues.overallScore : 0).toString();

    } else {
      const highestStreakElement1 = document.getElementById('highestStreak');
      //'Highest Streak:' +
      highestStreakElement1.textContent =  highestStreak.toString();
    
      const currentStreakElement1 = document.getElementById('currentStreak');
      //'Current Streak:' +
      currentStreakElement1.textContent =  currentStreak.toString();
    
      const highestScoreElement1 = document.getElementById('highestScore');
      //'Highest Score:' +
      highestScoreElement1.textContent =  highestScore.toString();
    
      //const currentScoreElement1 = document.getElementById('currentScore');
      //currentScoreElement1.textContent = 'Current Score:' + score.toString();

      //'Overall Score:' +
      const overallScoreElement1 = document.getElementById('overallScore');
      overallScoreElement1.textContent =  overallScore.toString();
    }
  },glm);

  // to do current attemps and attemptsLeft (Not used In UI)
  // not worried as the logic in the engine is fine
  const currentAttempts = document.getElementById('attempts');
  currentAttempts.textContent = 'Attemps:' + attempts; 

  const attemptsLeft = document.getElementById('attemptsLeft');
  attemptsLeft.textContent = 'Remaining:' + (maxAttempts - attempts); 

}



function check5Guess() {
  const tiles = document.querySelectorAll(".tile");
  const startIndex = attempts * 5;
  const targetArray = targetWord.toUpperCase().split("");
  const guessArray = currentGuess.split("");

  const matchedIndices = new Set();

  // Green: Correct position
  for (let i = 0; i < 5; i++) {
    if (guessArray[i] === targetArray[i]) {
      tiles[startIndex + i].style.backgroundColor = "green";
      matchedIndices.add(i);
      targetArray[i] = null;
      updateKeyboardKey(guessArray[i] , "green")
    }
  }

  // Yellow: Correct letter, wrong position
  for (let i = 0; i < 5; i++) {
    if (!matchedIndices.has(i) && targetArray.includes(guessArray[i])) {
      tiles[startIndex + i].style.backgroundColor = "gold";
      targetArray[targetArray.indexOf(guessArray[i])] = null;
      updateKeyboardKey(guessArray[i] , "gold")
    }
  }

  // Gray: Incorrect letter
  for (let i = 0; i < 5; i++) {
    if (!matchedIndices.has(i) && tiles[startIndex + i].style.backgroundColor === "") {
      tiles[startIndex + i].style.backgroundColor = "gray";
      updateKeyboardKey(guessArray[i], "gray")
    }
  }
}

function check6Guess() {
  const tiles6 = document.querySelectorAll(".tile6");
  const startIndex6 = attempts6 * 6;
  const targetArray6 = target6Word.toUpperCase().split("");
  const guessArray6 = current6Guess.split("");

  const matchedIndices6 = new Set();

  // Green: Correct position
  for (let i = 0; i < 6; i++) {
    if (guessArray6[i] === targetArray6[i]) {
      tiles6[startIndex6 + i].style.backgroundColor = "green";
      matchedIndices6.add(i);
      targetArray6[i] = null;
      updateKeyboardKey(guessArray6[i] , "green")
    }
  }

  // Yellow: Correct letter, wrong position
  for (let i = 0; i < 6; i++) {
    if (!matchedIndices6.has(i) && targetArray6.includes(guessArray6[i])) {
      tiles6[startIndex6 + i].style.backgroundColor = "gold";
      targetArray6[targetArray6.indexOf(guessArray6[i])] = null;
      updateKeyboardKey(guessArray6[i] , "gold")
    }
  }

  // Gray: Incorrect letter
  for (let i = 0; i < 6; i++) {
    if (!matchedIndices6.has(i) && tiles6[startIndex6 + i].style.backgroundColor === "") {
      tiles6[startIndex6 + i].style.backgroundColor = "gray";
      updateKeyboardKey(guessArray6[i], "gray")
    }
  }
}

function updateKeyboardKey(letter, color) {
  // Convert letter to uppercase to match keyboard button text content
  const upperLetter = letter.toUpperCase();

  // Find the key element that matches the letter
  const key = Array.from(document.querySelectorAll(".key")).find(
    (button) => button.textContent === upperLetter
  );

  if (key) {
    // Determine the current background color of the key
    const currentColor = key.style.backgroundColor;

    // Define color mapping
    const colorMapping = {
      green: "green",
      gold: "#C5BB66",
      gray: "#494444",
    };

    // Set the background color based on priority: green > yellow > gray
    if (
      color === "green" || 
      (color === "gold" && currentColor !== "green") || 
      (color === "gray" && !["green", colorMapping.gold].includes(currentColor))
    ) {
      key.style.backgroundColor = colorMapping[color]; // Apply the new background color
    }
  } else {
    console.warn(`No key found for letter: ${letter}`);
  }
}


function toggleStats() {
  const board = document.getElementById('board');
  const dailyStatsChart = document.getElementById('daily-chart-wrapper');
  const monthlyStatsChart = document.getElementById('monthly-chart-wrapper');
  const overallStatsChart = document.getElementById('overall-chart-wrapper');
  const showStatsButton = document.getElementById('show-stats-btn');
  const answerElement = document.getElementById('answer');
  const wordDescriptionElement = document.getElementById('wordDescription');
  const keyboardElement = document.getElementById('keyboard');
  const gameProgressElement = document.getElementById('gameProgress');
  const overallElement = document.getElementById('overall');

  if (dailyStatsChart.style.display === 'none') {
      // Hide the game board and show the chart
      board.style.display = 'none';
      dailyStatsChart.style.display = 'flex';
      monthlyStatsChart.style.display = 'flex';
      overallStatsChart.style.display = 'flex';
      showStatsButton.textContent = 'Show Game';
      answerElement.style.display = 'none';
      wordDescriptionElement.style.display = 'none';
      keyboardElement.style.display = 'none';
      gameProgressElement.style.display = 'none';
      overallElement.style.display = 'none';
      showStats();

  } else {
      // Show the game board and hide the chart
      dailyStatsChart.style.display = 'none';
      monthlyStatsChart.style.display = 'none';
      overallStatsChart.style.display = 'none';
      board.style.display = 'grid';
      showStatsButton.textContent = 'Show Stats';
      answerElement.style.display = 'block';
      wordDescriptionElement.style.display = 'block';
      keyboardElement.style.display = 'flex';
      gameProgressElement.style.display = 'flex';
      overallElement.style.display = 'flex';

  }
}
