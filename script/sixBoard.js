function create6Board() {

    const board = document.getElementById("sixboard");
    for (let i = 0; i < maxAttempts * 6; i++) {
      const tile = document.createElement("div");
      tile.classList.add("tile6");
      board.appendChild(tile);
    }
}


function update6Board() {
    const tiles6 = document.querySelectorAll(" .tile6");
    const startIndex6 = attempts6 * 6;
  
    for (let i = 0; i < 6; i++) {
      const tile6 = tiles6[startIndex6 + i];
      tile6.textContent = current6Guess[i] || "";
    }
}


function handle6Enter() {
    if(attempts6 <= (maxAttempts - 1)) {

    if (current6Guess.length === 6) {
      
      if (current6Guess === target6Word.toUpperCase()) {

        const submitButton = document.getElementById("submit");
        if(!submitButton.disabled) {   
        // Mark all tiles green for the correct guess
          const tiles6 = document.querySelectorAll(".tile6");
          const startIndex6 = attempts6 * 6;

          for (let i = 0; i < 6; i++) {
            tiles6[startIndex6 + i].style.backgroundColor = "green";
          }

          gameSixLetterCorrect = true;

          let dictionaryAPIUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/" + target6Word.toLowerCase();
          console.log("six letter url 1: " + dictionaryAPIUrl)
          getDictionaryXHR(dictionaryAPIUrl).then((data) => { 
          if(data) {
            //console.log('Dictionary Data is: ' + data);
            displayWordInfo(data);

          } else {
            const wordInfoDiv2 = document.getElementById('wordDescription');
            wordInfoDiv2.innerHTML = '';
            XHR6LetterWiki(); 
          }
          }).catch((error) => { 
            console.error("Failed to fetch dictionary data:", error.message);
            alert("Failed to fetch dictionary data. Please try again later.");
          
          });

          setMarked6LetterWord();


          addSixLetterGameResult("W");
          alert("Congratulations! You guessed the word!");
  //displayStats();
          handleSixLetterCorrectGuess();
          setSubmitButtonDisabled(true);
          setResetButtonDisabled(false);
          runConfetti();
          endGame(gameLetterMode);
          }
        
        return; // Stop further execution since the game is over
      }

      check6Guess(); // Validate the current guess
      current6Guess = ""; // Reset the current guess for the next attempt
      attempts6++;


      if (attempts6 >= maxAttempts) {

        gameSixLetterCorrect = false;
        setMarked6LetterWord();
        
        // const answer = document.getElementById("answer");
        // addGameResult("F");
        // answer.textContent = `Game over! The word was ${targetWord.toUpperCase()}.`;

        let dictionaryAPIUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/" + target6Word.toLowerCase();
        console.log("six letter url 2: " + dictionaryAPIUrl)
        getDictionaryXHR(dictionaryAPIUrl).then((data) => { 
        if(data) {
          //console.log('Dictionary Data is: ' + data);
          displayWordInfo(data);

        } else {
          const wordInfoDiv2 = document.getElementById('wordDescription');
          wordInfoDiv2.innerHTML = '';

          XHR6LetterWiki(); 
        }
        }).catch((error) => { 
          console.error("Failed to fetch dictionary data:", error.message);
          alert("Failed to fetch dictionary data. Please try again later.");
          
        });
        handleSixLetterIncorrectGuess();
        setSubmitButtonDisabled(true);
        setResetButtonDisabled(false);
        //showStats();
        //displayStats();
        endGame(gameLetterMode);
      }
    } 
    else {
      alert("Please enter a 6-letter word.");
    }
    updateProgress(gameLetterMode);
  }
}



async function getUnusedSixLetterWords() {
  const db = await initIndexedDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([sixLetterWordsStore, usedSixLetterWordsStore], "readonly");
    const wordsStoreRequest = transaction.objectStore(sixLetterWordsStore).get(wordSixLetterStoreKey);
    const usedWordsStoreRequest = transaction.objectStore(usedSixLetterWordsStore).getAll();

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

async function getRandomSixLetterWord() {

  try {
    const unusedWords = await getUnusedSixLetterWords();
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

function setMarked6LetterWord(){
  markSixLetterWordAsUsed(target6Word).then(() => {
    logToScreen("Setting Target Word");
    //console.log("Target Word set successfully.");
  })
  .catch((error) => {
    console.error("Error setting target word:", error);
    logToScreen(`setting target word failed: ${error.message}`);
  });
}

function markSixLetterWordAsUsed(word) {
  return initIndexedDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(usedSixLetterWordsStore, "readwrite");
      const store = transaction.objectStore(usedSixLetterWordsStore);

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


