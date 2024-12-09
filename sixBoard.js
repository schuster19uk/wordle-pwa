function create6Board() {

    const board = document.getElementById("sixboard");
    for (let i = 0; i < maxAttempts * 6; i++) {
      const tile = document.createElement("div");
      tile.classList.add("tile6");
      board.appendChild(tile);
    }
}


function update6Board() {
    const tiles = document.querySelectorAll(" .tile6");
    const startIndex = attempts6 * 6;
  
    for (let i = 0; i < 6; i++) {
      const tile = tiles[startIndex + i];
      tile.textContent = current6Guess[i] || "";
    }
}


function handle6Enter() {
  
    if(attempts6 <= (maxAttempts - 1)) {

    if (current6Guess.length === 6) {
      
      if (current6Guess === target6Word.toUpperCase()) {

        const submitButton = document.getElementById("submit");
        if(!submitButton.disabled) {   
        // Mark all tiles green for the correct guess
          const tiles = document.querySelectorAll(".tile6");
          const startIndex = attempts6 * 6;

          for (let i = 0; i < 6; i++) {
            tiles[startIndex + i].style.backgroundColor = "green";
          }

          gameCorrect = true;

          let dictionaryAPIUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/" + target6Word.toLowerCase();
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

        gameCorrect = false;
        setMarked6LetterWord();
        
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


function setMarked6LetterWord(){
  // markWordAsUsed(targetWord).then(() => {
  //   logToScreen("Setting Target Word");
  //   //console.log("Target Word set successfully.");
  // })
  // .catch((error) => {
  //   console.error("Error setting target word:", error);
  //   logToScreen(`setting target word failed: ${error.message}`);
  // });
}