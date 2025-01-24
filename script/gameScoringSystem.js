function calculateScore() {
      // Calculate base points based on attempts
      let basePoints = calculateBasePoints(attempts + 1);
      console.log(basePoints + ' base points');
      
      // Calculate word length bonus
      let wordLengthBonus = calculateWordLengthBonus(targetWord.length);
      console.log(wordLengthBonus + ' word length bonus points');
      
      // Calculate points deduction based on hints used
      let hintsPenalty = calculateHintPenalty(hintsUsed);
      console.log(hintsPenalty + ' penalty points');
      
      // Calculate time bonus (shorter time = more points)
      let timeBonus = calculateTimeBonus(timeTaken);
      console.log(timeBonus + " time bonus points");
      
      // Calculate streak bonus
      let streakBonus = calculateStreakBonus(currentStreak);
      console.log(streakBonus + " streak bonus points");
      
      // Final score calculation
      score = basePoints + wordLengthBonus - hintsPenalty + timeBonus + streakBonus;
    
      console.log(`Score 5 letter: ${score}`);
      return score;
}
  
function calculateSixLetterScore() {
  // Calculate base points based on attempts
  let basePoints = calculateBasePoints(attempts6 + 1);
  console.log(basePoints + ' base points six letter');
  
  // Calculate word length bonus
  let wordLengthBonus = calculateWordLengthBonus(target6Word.length);
  console.log(wordLengthBonus + ' word length bonus points');
  
  // Calculate points deduction based on hints used
  let hintsPenalty = calculateHintPenalty(hintsUsed);
  console.log(hintsPenalty + ' penalty points');
  
  // Calculate time bonus (shorter time = more points)
  let timeBonus = calculateTimeBonus(timeTaken);
  console.log(timeBonus + " time bonus points");
  
  // Calculate streak bonus
  let streakBonus = calculateStreakBonus(currentStreak);
  console.log(streakBonus + " streak bonus points");
  
  // Final score calculation
  score = basePoints + wordLengthBonus - hintsPenalty + timeBonus + streakBonus;

  console.log(`Score Six letter: ${score}`);
  return score;
}

// Function to calculate base points based on attempts
function calculateBasePoints(attempts) {
    const pointsByAttempts = {
        1: 100,
        2: 80,
        3: 60,
        4: 40,
        5: 20,
        6: 10
    };
    return pointsByAttempts[attempts] || 0;
}

// Function to calculate word length bonus
function calculateWordLengthBonus(wordLength) {
    switch (wordLength) {
        case 4:
            return 0;
        case 5:
            return 10;
        case 6:
            return 20;
        default:
            return 0;
    }
}

// Function to calculate points deduction based on hints used
function calculateHintPenalty(hintsUsed) {
    return hintsUsed * 10;
}

function startGame() {
    startTime = new Date(); // Get the current date and time (in milliseconds)
   // console.log("Game Started at:", startTime);
  }
  
  // Function to end the game (this is where you set the end time)
  function endGame(gameLetterMode) {
    endTime = new Date(); // Get the current date and time when game ends
    timeTaken = Math.floor((endTime - startTime) / 1000); // Time taken in seconds
    console.log("Game Ended at:", endTime);
    console.log("Time Taken:", timeTaken, "seconds");
  
  
    let gameScore = 0;  
    
    
    if (gameLetterMode === 5) {
      gameScore = solveWord(attempts , hintsUsed , timeTaken , currentStreak);    
    }

    if (gameLetterMode === 6) {
      gameScore = solveSixLetterWord(attempts6 , hintsUsedSixLetter , timeTaken , currentSixLetterStreak); 
    }

    console.log(` Game Mode: ${gameLetterMode} Score: ${gameScore}`);
  
    if(gameCorrect) {
  
      const answerElement = document.getElementById('answer');
      answerElement.textContent = "Congratulations! You guessed the word! Your Score was:" + gameScore.toString() ;
     
      const currentScoreElementEnd = document.getElementById('currentScore');
      currentScoreElementEnd.textContent = 'Current Score:' + gameScore.toString();
    
      //adds score for this game
      if (gameLetterMode == 5)
      {
      
      addGameScoreResult();  
      //adds global scores
      addGlobalScores(false);
    
      }
      else if (gameLetterMode == 6)
      {
        addSixLetterGameScoreResult();    
        //adds global scores
        addSixLetterGlobalScores(false);
    
      }

    } else {
      const answer = document.getElementById("answer");
      if(gameLetterMode == 5)
      {
        addGameResult("F");  
        answer.textContent = `Game over! The word was ${targetWord.toUpperCase()}.`; 
      }
      else if(gameLetterMode == 6)
      {
        addSixLetterGameResult("F");
        answer.textContent = `Game over! The word was ${target6Word.toUpperCase()}.`; 
      
      }
    }
  
  }
  
  // Function to calculate time bonus (faster is better)
  function calculateTimeBonus(timeTaken) {
    if (timeTaken <= 60) return 50;  // Solved in <60 seconds
    if (timeTaken <= 120) return 30;  // Solved in <120 seconds
    if (timeTaken <= 180) return 10; // Solved in <3 minutes
    return 0; // Time penalty if more than 2 minutes
  }
  
  // Function to calculate streak bonus
  function calculateStreakBonus(streak) {
    console.log("Calculatingstreak " + streak.toString());
      if (streak === 1) {
        return 10; // Bonus for the first correct guess in a streak
    } else if (streak === 2) {
        return 20; // Bonus for the second correct guess
    } else if (streak === 3) {
        return 30; // Bonus for a 3rd correct guess
    } else if (streak >= 4) {
        return 50; // Bonus for 4th or higher correct guesses in a row
    }
    return 0; // No bonus for zero streak
  }
  
  // Example game logic
  function solveWord(attempts, hintsUsed, timeTaken, streak) {
    // Set the game data
    this.attempts = attempts;
    this.hintsUsed = hintsUsed;
    this.timeTaken = timeTaken;
    this.streak = streak;
    
    // Calculate and return the score
    return calculateScore();
  }


  function solveSixLetterWord(attempts6, hintsUsed, timeTaken, streak) {
    // Set the game data
    this.attempts = attempts6;
    this.hintsUsed = hintsUsed;
    this.timeTaken = timeTaken;
    this.streak = streak;
    
    // Calculate and return the score
    return calculateSixLetterScore();
  }
  