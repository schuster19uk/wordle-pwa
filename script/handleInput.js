// Function to handle mobile input
// function handleMobileInput(event) {
//   const input = event.target.value.toUpperCase(); // Get the input value and convert to uppercase
//   event.target.value = ""; // Clear the input field

//   if (/^[A-Z]$/.test(input)) {
//     handleInput(input); // Process single-letter input
//   } else if (input === "ENTER") {
//     handleEnter(); // Process Enter
//   } else if (input === "BACKSPACE" || input === "DELETE") {
//     handleDelete(); // Process Delete/Backspace
//   }
// }

// Function to handle keyboard input
function handleKeyboardInput(event) {
    const key = event.key.toUpperCase();
    console.log(key);
  
    if (/^[A-Z]$/.test(key)) {
        handleInput(key);
    } 
    else if (key === "ENTER") {
        handleEnter();
    } 
    else if (key === "BACKSPACE") {
        handleDelete();
    }
    

}
  
  // Handle the actual input (used by both mobile and keyboard events)
  function handleInput(letter) {
console.log("game letter mode hanlde input is: " + typeof(gameLetterMode));
    if(gameLetterMode === "5" || gameLetterMode === 5) {
        if(attempts < maxAttempts) {
            if (currentGuess.length < 5) {
                currentGuess += letter;
                update5Board();
            }
        }
    } 
    else if (gameLetterMode === "6" || gameLetterMode === 6) {
        if(attempts6 < maxAttempts) {
            if (current6Guess.length < 6) {
                current6Guess += letter;
                update6Board();
            }
        }
    }
  }
  
  function handleDelete() {
    if(gameLetterMode===5){
        if (currentGuess.length > 0) {
            currentGuess = currentGuess.slice(0, -1);
            update5Board();
          }
    } else if (gameLetterMode === 6) {
        if (current6Guess.length > 0) {
            current6Guess = current6Guess.slice(0, -1);
            update6Board();
          }
    }

  }
  
function handleEnter() {

    if(gameLetterMode===5){
        handle5Enter();
    } 
    else if (gameLetterMode === 6) {
        handle6Enter();
    }

}



  function displayWordInfo(apiResponse) {
    const wordInfoDiv = document.getElementById('wordDescription');
    wordInfoDiv.innerHTML = ''; // Clear any previous content
    
    // Parse the API response (it is assumed to be in the correct format)
    const wordData = JSON.parse(apiResponse)[0];  // As we have an array, we'll access the first element
    
    // Extract the word, phonetic, and meanings
    const word = wordData.word;
    //console.log("word from first element in apiResponse" + word);
    const phonetic = wordData.phonetic || (wordData.phonetics[0] ? wordData.phonetics[0].text : 'No phonetic available');
    const meanings = wordData.meanings;
  
    // Create the word and phonetic elements
    // const wordTitle = document.createElement('h3');
    // wordTitle.textContent = word;
    
    // const phoneticText = document.createElement('p');
    // phoneticText.textContent = `Phonetic: ${phonetic}`;
  
    // Append word and phonetic to the div
    //wordInfoDiv.appendChild(wordTitle);
    //wordInfoDiv.appendChild(phoneticText);
  
  
    //Create and append meanings (definitions)
    // meanings.forEach(meaning => {      
    //     const partOfSpeech = document.createElement('h3');
    //     partOfSpeech.textContent = meaning.partOfSpeech.charAt(0).toUpperCase() + meaning.partOfSpeech.slice(1);
    //     wordInfoDiv.appendChild(partOfSpeech);
    //     if( descriptionCount <= 3 ) {
    //     meaning.definitions.forEach(def => {
    //       const definitionText = document.createElement('p');
    //       definitionText.textContent = ` - ${def.definition}`;
    //       wordInfoDiv.appendChild(definitionText);
    //     });
    //   }
    // });
  
    let descriptionCount = 0; // Initialize a counter for the descriptions
  
    meanings.forEach((meaning) => {
      const partOfSpeech = document.createElement('h3');
      partOfSpeech.textContent =
        meaning.partOfSpeech.charAt(0).toUpperCase() + meaning.partOfSpeech.slice(1);
        if( descriptionCount <3) {
          wordInfoDiv.appendChild(partOfSpeech);
        }
  
      meaning.definitions.forEach((def) => {
        if (descriptionCount < 3) { // Check if the limit has been reached
          const definitionText = document.createElement('p');
          definitionText.textContent = ` - ${def.definition}`;
          wordInfoDiv.appendChild(definitionText);
          descriptionCount++; // Increment the counter
        }
      });
    });
  
  }
  

    //https://api.dictionaryapi.dev/api/v2/entries/en/hello
function getDictionaryXHR(path) {
    return new Promise((resolve, reject) => {
      try {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              resolve(xhr.responseText);
            } else {
              // Resolve with null for non-200 statuses
              resolve(null);
            }
          }
        };
        xhr.open("GET", path);
        xhr.send();
      } catch (e) {
        
        // Log only unexpected errors
        //console.error('Unexpected error: ' + e.message);
        reject(e);
      }
    });
  }

  // Function to handle correct guesses
function handleCorrectGuess() {
    currentStreak++; // Increase the streak
    highestStreak = Math.max(highestStreak, currentStreak); // Update the highest streak
    
    addGameStreakResult();
  
}

function handleSixLetterCorrectGuess() {
  currentSixLetterStreak++; // Increase the streak
  highestSixLetterStreak = Math.max(highestSixLetterStreak, currentSixLetterStreak); // Update the highest streak
  
  addGameSixLetterStreakResult();

}
 

  // Function to handle incorrect guesses
  function handleIncorrectGuess() {
    
    currentStreak = 0; // Reset streak on incorrect guess
    addGameStreakResult();
    addGlobalScores(true);
    //console.log("Incorrect Guess! Streak reset.");
  }

  function handleSixLetterIncorrectGuess(letterMode) {
    
    currentSixLetterStreak = 0; // Reset streak on incorrect guess
    addGameSixLetterStreakResult();
    addSixLetterGlobalScores(true);
    //console.log("Incorrect Guess! Streak reset.");
  }


  // Function to safely attach a single event listener
function addChangeHandlerSafely(radio, handler) {
    if (!radio.dataset.listenerAttached) {
        radio.addEventListener('change', handler);
        radio.dataset.listenerAttached = 'true'; // Mark the handler as attached
    }
}

// Event handler function
function handleRadioChange(event) {

    //set Game Mode value
    gameLetterMode = event.target.value;
    console.log("Game Mode is" + gameLetterMode);
    if(wordleGameInProgress){
      setGameLetterRadioButton(gameLetterMode);
    }
    else {
      changeGameMode();
    }
}

function changeGameMode() {

  initializeGame(true).then(() => {
    logToScreen("Changing game mode...Successfull");
    //console.log("Game reset successfully.");
  })
  .catch((error) => {
    console.error("Error changing game mode:", error);
    logToScreen(`Changing game mode failed: ${error.message}`);
  });
}

function setGameLetterRadioButton(gameLetterMode) {
  // if(gameLetterMode === "5"){
  //   gameLetterMode = gameLetterMode;
  //   //change radio button to 6
  //   document.querySelector('input[name="gameLetterMode"][value="5"]').checked = true;
  // }else {
  //   gameLetterMode = gameLetterMode;
  //   d
  //ocument.querySelector('input[name="gameLetterMode"][value="5"]').checked = true;
  // }
}

