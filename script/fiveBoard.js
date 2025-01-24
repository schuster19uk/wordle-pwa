function create5Board() {

    const board = document.getElementById("board");
    for (let i = 0; i < maxAttempts * 5; i++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      board.appendChild(tile);
    }
  }


  function setMarked5LetterWord(){
    markWordAsUsed(targetWord).then(() => {
      logToScreen("Setting Target Word");
      //console.log("Target Word set successfully.");
    })
    .catch((error) => {
      console.error("Error setting target word:", error);
      logToScreen(`setting target word failed: ${error.message}`);
    });
  }



  

  // Mark a word as used
function markWordAsUsed(word) {
  return initIndexedDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(usedWordsStore, "readwrite");
      const store = transaction.objectStore(usedWordsStore);

      // Check if the word already exists
      const getRequest = store.get(word);

      getRequest.onsuccess = () => {
        if (getRequest.result) {
          console.log(`Word already marked as used: ${word}`);
          resolve(); // Word already exists, resolve without adding
        } else {
          // Add the word if it doesn't exist
          const addRequest = store.add({ key: word });
          addRequest.onsuccess = () => {
            //console.log(`Word marked as used: ${word}`);
            resolve();
          };
          addRequest.onerror = (event) => {
            console.error("Error marking word as used:", event.target.error);
            reject(event.target.error);
          };
        }
      };

      getRequest.onerror = (event) => {
        console.error("Error checking word existence:", event.target.error);
        reject(event.target.error);
      };
    });
  });
}



// Get all unused words from the database
async function getUnusedWords() {
  const db = await initIndexedDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([wordsStore, usedWordsStore], "readonly");
    const wordsStoreRequest = transaction.objectStore(wordsStore).get(wordStoreKey);
    const usedWordsStoreRequest = transaction.objectStore(usedWordsStore).getAll();

    wordsStoreRequest.onsuccess = () => {
      const result = wordsStoreRequest.result;
      const allWords = result?.data ? Object.keys(result.data) : []; // Extract words if `data` exists
      
      usedWordsStoreRequest.onsuccess = () => {
        const usedWords = usedWordsStoreRequest.result.map(entry => entry.word); // Adjust field to match stored structure
        const unusedWords = allWords.filter(word => !usedWords.includes(word));
        resolve(unusedWords);
      };

      usedWordsStoreRequest.onerror = (event) => reject(event.target.error);
    };

    wordsStoreRequest.onerror = (event) => reject(event.target.error);
    transaction.onerror = (event) => reject(event.target.error);
  });
}



async function getRandomWord() {

  try {
    const unusedWords = await getUnusedWords();
    if (unusedWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * unusedWords.length);
      console.log('word is' + unusedWords[randomIndex]);
      return unusedWords[randomIndex];
    } else {
      throw new Error("No unused words available.");
    }
  } catch (error) {
    console.error("Error fetching random word:", error);
    return "ERROR"; // Fallback word
  }
}

function handle5Enter() {
  
  if(attempts <= (maxAttempts - 1)) {

  if (currentGuess.length === 5) {
    
    if (currentGuess === targetWord.toUpperCase()) {

      const submitButton = document.getElementById("submit");
      if(!submitButton.disabled) {   
      // Mark all tiles green for the correct guess
        const tiles = document.querySelectorAll(".tile");
        const startIndex = attempts * 5;

        for (let i = 0; i < 5; i++) {
          tiles[startIndex + i].style.backgroundColor = "green";
        }

        gameCorrect = true;

        let dictionaryAPIUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/" + targetWord.toLowerCase();
        getDictionaryXHR(dictionaryAPIUrl).then((data) => { 
        if(data) {
          //console.log('Dictionary Data is: ' + data);
          displayWordInfo(data);

        } else {
          const wordInfoDiv2 = document.getElementById('wordDescription');
          wordInfoDiv2.innerHTML = '';
          XHRWiki(); 
        }
        }).catch((error) => { 
          console.error("Failed to fetch dictionary data:", error.message);
          alert("Failed to fetch dictionary data. Please try again later.");
        
        });

        setMarked5LetterWord();


        addGameResult("W");
        alert("Congratulations! You guessed the word!");
//displayStats();
        handleCorrectGuess();
        setSubmitButtonDisabled(true);
        setResetButtonDisabled(false);
        runConfetti();
        endGame(gameLetterMode);
        }
      
      return; // Stop further execution since the game is over
    }

    check5Guess(); // Validate the current guess
    currentGuess = ""; // Reset the current guess for the next attempt
    attempts++;


    if (attempts >= maxAttempts) {

      gameCorrect = false;
      setMarked5LetterWord();
      
      // const answer = document.getElementById("answer");
      // addGameResult("F");
      // answer.textContent = `Game over! The word was ${targetWord.toUpperCase()}.`;

      let dictionaryAPIUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/" + targetWord.toLowerCase();
      getDictionaryXHR(dictionaryAPIUrl).then((data) => { 
      if(data) {
        //console.log('Dictionary Data is: ' + data);
        displayWordInfo(data);

      } else {
        const wordInfoDiv2 = document.getElementById('wordDescription');
        wordInfoDiv2.innerHTML = '';

        XHRWiki(); 
      }
      }).catch((error) => { 
        console.error("Failed to fetch dictionary data:", error.message);
        alert("Failed to fetch dictionary data. Please try again later.");
        
      });
      handleIncorrectGuess();
      setSubmitButtonDisabled(true);
      setResetButtonDisabled(false);
      //showStats();
      //displayStats();
      endGame(gameLetterMode);
    }
  } 
  else {
    alert("Please enter a 5-letter word.");
  }
  updateProgress();
}
}

function update5Board() {
  const tiles = document.querySelectorAll(".tile");
  const startIndex = attempts * 5;

  for (let i = 0; i < 5; i++) {
    const tile = tiles[startIndex + i];
    tile.textContent = currentGuess[i] || "";
  }
}