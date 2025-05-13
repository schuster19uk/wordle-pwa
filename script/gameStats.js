
  function addGameResult(result) {
    return initIndexedDB().then((db) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(resultsStore, "readwrite");
        const store = transaction.objectStore(resultsStore);
  
        const gameResult = {
          date: new Date().toISOString().split("T")[0], // Save the date in YYYY-MM-DD format
          result: result, // 'W' for win, 'F' for fail
        };
  
        const request = store.add(gameResult);
  
        request.onsuccess = () => {
          //console.log("Game result added:", gameResult);
          resolve();
        };
        request.onerror = (event) => {
          console.error("Error adding game result:", event.target.error);
          reject(event.target.error);
        };
      });
    });
  }

  function addSixLetterGameResult(result) {
    return initIndexedDB().then((db) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(resultsSixLetterStore, "readwrite");
        const store = transaction.objectStore(resultsSixLetterStore);
  
        const gameResult = {
          date: new Date().toISOString().split("T")[0], // Save the date in YYYY-MM-DD format
          result: result, // 'W' for win, 'F' for fail
        };
  
        const request = store.add(gameResult);
  
        request.onsuccess = () => {
          //console.log("Game result added:", gameResult);
          resolve();
        };
        request.onerror = (event) => {
          console.error("Error adding game result:", event.target.error);
          reject(event.target.error);
        };
      });
    });
  }
  
  function addGameScoreResult() {
    return initIndexedDB().then((db) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(scoreStore, "readwrite");
        const store = transaction.objectStore(scoreStore);
  
        const gameScoreResult = {
          date: new Date().toISOString().split("T")[0], // Save the date in YYYY-MM-DD format
          score: score, // 'W' for win, 'F' for fail
        };
  
        const request = store.add(gameScoreResult);
  
        request.onsuccess = () => {
          //console.log("Game score result added:", gameScoreResult);
          resolve();
        };
        request.onerror = (event) => {
          console.error("Error adding game score result:", event.target.error);
          reject(event.target.error);
        };
      });
    });
  }

  function addSixLetterGameScoreResult() {
    return initIndexedDB().then((db) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(scoreSixLetterStore, "readwrite");
        const store = transaction.objectStore(scoreSixLetterStore);
        console.log("Game score result added" + scoreSixLetter);
        const gameScoreSixLetterResult = {
          date: new Date().toISOString().split("T")[0], // Save the date in YYYY-MM-DD format
          score: scoreSixLetter, // 'W' for win, 'F' for fail
        };
  
        const request = store.add(gameScoreSixLetterResult);
  
        request.onsuccess = () => {
          //console.log("Game score result added:", gameScoreResult);
          resolve();
        };
        request.onerror = (event) => {
          console.error("Error adding game score result:", event.target.error);
          reject(event.target.error);
        };
      });
    });
  }
  
  function addGlobalScores(addCurrentStreakOnly) {
    return initIndexedDB().then((db) => {
      return new Promise((resolve, reject) => {
  
        const db = event.target.result;
        const transaction = db.transaction(globalGameStore, "readwrite");
        const store = transaction.objectStore(globalGameStore);
  
          // Retrieve the existing record
          const getRequest = store.get(1);
  
  
          getRequest.onsuccess = () => {
              const data = getRequest.result;
  
              if (data) {
  
                  if (addCurrentStreakOnly) {
                    // Update current streak only
                    data.currentStreak = currentStreak;
                    store.put(data);
                    console.log("Current streak updated:", data);
                  }
  
                  else {
                  // Update values
                  data.highestStreak = Math.max(data.highestStreak, highestStreak);
                  data.currentStreak = currentStreak;
                  data.highestScore = Math.max(data.highestScore, score);
                  data.currentScore = score ? score : 0;
                  data.overallScore += score;
  
                  // Save updated data
                  store.put(data);
                  //console.log("global values updated:", data);
                  }
  
              } else {
                  console.error("No record found to update.");
              }
              resolve();
          };
  
          getRequest.onerror = (event) => {
              console.error("Error retrieving record:", getRequest.error);
              reject(event.target.error);
          };
  
      });
    });
  }


  function addSixLetterGlobalScores(addCurrentStreakOnly) {
    return initIndexedDB().then((db) => {
      return new Promise((resolve, reject) => {
  
        const db = event.target.result;
        const transaction = db.transaction(globalGameSixLetterStore, "readwrite");
        const store = transaction.objectStore(globalGameSixLetterStore);
  
          // Retrieve the existing record
          const getRequest = store.get(1);
  
  
          getRequest.onsuccess = () => {
              const data = getRequest.result;
  
              if (data) {
  
                  if (addCurrentStreakOnly) {
                    // Update current streak only
                    data.currentStreak = currentSixLetterStreak;
                    store.put(data);
                    console.log("Current streak updated:", data);
                  }
  
                  else {
                    console.log("highest scores six letters" + highestSixLetterStreak , currentSixLetterStreak , scoreSixLetter);
                  // Update values
                  data.highestStreak = Math.max(data.highestStreak, highestSixLetterStreak);
                  data.currentStreak = currentSixLetterStreak;
                  data.highestScore = Math.max(data.highestScore, scoreSixLetter); 
                  data.currentScore = scoreSixLetter ? scoreSixLetter : 0;
                  data.overallScore += scoreSixLetter;
  
                  // Save updated data
                  store.put(data);
                  //console.log("global values updated:", data);
                  }
  
              } else {
                  console.error("No record found to update.");
              }
              resolve();
          };
  
          getRequest.onerror = (event) => {
              console.error("Error retrieving record:", getRequest.error);
              reject(event.target.error);
          };
  
      });
    });
  }
  
  function addGameStreakResult() {
    return initIndexedDB().then((db) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(streakStore, "readwrite");
        const store = transaction.objectStore(streakStore);
    
        const gameScoreResult = {
          date: new Date().toISOString().split("T")[0], // Save the date in YYYY-MM-DD format
          highestStreak: highestStreak, // 'W' for win, 'F' for fail
          currentStreak: 0,
        };
  
        const request = store.get(1);
  
        request.onsuccess = () => {
          store.add(gameScoreResult);
          //console.log("Game streak result added:", gameScoreResult);
          resolve();
        };
        request.onerror = (event) => {
          console.error("Error adding game score result:", event.target.error);
          reject(event.target.error);
        }
  
  
      });
    });
  }

  function addGameSixLetterStreakResult() {
    return initIndexedDB().then((db) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(streakSixLetterStore, "readwrite");
        const store = transaction.objectStore(streakSixLetterStore);
    
        const gameScoreSixLetterResult = {
          date: new Date().toISOString().split("T")[0], // Save the date in YYYY-MM-DD format
          highestStreak: highestSixLetterStreak, // 'W' for win, 'F' for fail
          currentStreak: 0,
        };
  
        const request = store.get(1);
  
        request.onsuccess = () => {
          store.add(gameScoreSixLetterResult);
          //console.log("Game streak result added:", gameScoreResult);
          resolve();
        };
        request.onerror = (event) => {
          console.error("Error adding game score result:", event.target.error);
          reject(event.target.error);
        }
  
  
      });
    });
  }




  // Get today's date in YYYY-MM-DD format
  function getToday() {
    return new Date().toISOString().split("T")[0];
  }
  
  // Get the current month in YYYY-MM format
  function getCurrentMonth() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  }
  
  function fetchAllResults() {
    return initIndexedDB().then((db) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(resultsStore, "readonly");
        const store = transaction.objectStore(resultsStore);
  
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
      });
    });
  }

  //TODO add six letter functionality
  function calculateStats() {
    return fetchAllResults().then((results) => {
      // Initialize stats with default values
      const stats = {
        today: { total: 0, wins: 0, fails: 0, winRate: 0 },
        thisMonth: { total: 0, wins: 0, fails: 0, winRate: 0 },
        overall: { total: 0, wins: 0, fails: 0, winRate: 0 },
      };
  
      // If no results exist, return the default stats
      if (results.length === 0) {
        return stats;
      }
  
      const today = getToday();
      const currentMonth = getCurrentMonth();
  
      console.log(results.length, results);
  
      results.forEach((result) => {
        const resultDate = result.date;
        const resultMonth = result.date.slice(0, 7); // Extract YYYY-MM
        console.log('adding ' + result.result);
        // Update overall stats
        stats.overall.total++;
        if (result.result === "W") stats.overall.wins++;
        else stats.overall.fails++;
  
        // Update today's stats
        if (resultDate === today) {
          stats.today.total++;
          if (result.result === "W") stats.today.wins++;
          else stats.today.fails++;
        }
  
        // Update this month's stats
        if (resultMonth === currentMonth) {
          stats.thisMonth.total++;
          if (result.result === "W") stats.thisMonth.wins++;
          else stats.thisMonth.fails++;
        }
      });
  
      console.log(stats.overall.wins);
      // Calculate win rates
      stats.today.winRate = stats.today.total > 0 ? (stats.today.wins / stats.today.total) * 100 : 0;
      stats.thisMonth.winRate = stats.thisMonth.total > 0 ? (stats.thisMonth.wins / stats.thisMonth.total) * 100 : 0;
      stats.overall.winRate = stats.overall.total > 0 ? (stats.overall.wins / stats.overall.total) * 100 : 0;
  
      return stats;
    });
  }
  
  // Fetch and display stats from DB
  function showStats() {
    calculateStats().then((stats) => {
      showGraph(stats);
    }).catch((error) => {
      console.error("Error fetching stats:", error);
    });
  }
  
  // clears data store (For Dev use only)
  function clearStatsData() {
      // Open the database
      const request = indexedDB.open(dbName);
  
      request.onsuccess = function(event) {
          const db = event.target.result;
  
          // Open a transaction with readwrite access
          const transaction = db.transaction(resultsStore, 'readwrite');
          const store = transaction.objectStore(resultsStore);
  
          // Clear the object store
          const clearRequest = store.clear();
  
          clearRequest.onsuccess = function() {
              console.log(`All data cleared from the object store: "${resultsStore}".`);
          };
  
          clearRequest.onerror = function(event) {
              console.error(`Failed to clear data from the object store: "${resultsStore}".`, event.target.error);
          };
  
          // Close the database when the transaction completes
          transaction.oncomplete = function() {
              db.close();
          };
      };
  
      request.onerror = function(event) {
          console.error(`Failed to open database "${dbName}":`, event.target.error);
      };
  }
  

  function getGlobalValues(callback , glm) {
    //console.log("getting global values for letter mode" + glm);
    const request = indexedDB.open(dbName);
  
    request.onsuccess = function (event) {

        const storeName = gameLetterMode === 5 ? globalGameStore : globalGameSixLetterStore;

        const db = event.target.result;
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);
  
        const getRequest = store.get(1);
  
        getRequest.onsuccess = function () {
            if (getRequest.result) {
                //console.log("Retrieved streak values:", getRequest.result);
                callback(getRequest.result);
            } else {
                console.error("No streak values found.");
                callback(null);
            }
        };
  
        getRequest.onerror = function () {
            console.error("Error retrieving streak values:", getRequest.error);
            callback(null);
        };
    };
  
    request.onerror = function (event) {
        console.error("Error opening database:", event.target.error);
    };
  }