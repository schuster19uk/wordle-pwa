function initIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 5);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
  
        // if the words store doesn't exists create it
        if (!db.objectStoreNames.contains(wordsStore)) {
          db.createObjectStore(wordsStore, { keyPath: "key" });
        }

        // if the six letters store doesn't exists create it
        if (!db.objectStoreNames.contains(sixLetterWordsStore)) {
          db.createObjectStore(sixLetterWordsStore, { keyPath: "key" });
        }

  
        if (!db.objectStoreNames.contains(usedWordsStore)) {
          db.createObjectStore(usedWordsStore, { keyPath: "key" });
        }

        if (!db.objectStoreNames.contains(usedSixLetterWordsStore)) {
          db.createObjectStore(usedSixLetterWordsStore, { keyPath: "key" });
        }
  
        if (!db.objectStoreNames.contains(resultsStore)) {
        const gameResultsStore = db.createObjectStore(resultsStore, { keyPath: "id", autoIncrement: true });
        gameResultsStore.createIndex("date", "date", { unique: false });
        gameResultsStore.createIndex("result", "result", { unique: false });
        }

        if (!db.objectStoreNames.contains(resultsSixLetterStore)) {
          const gameResultsSixLetterStore = db.createObjectStore(resultsSixLetterStore, { keyPath: "id", autoIncrement: true });
          gameResultsSixLetterStore.createIndex("date", "date", { unique: false });
          gameResultsSixLetterStore.createIndex("result", "result", { unique: false });
        }
  
        if (!db.objectStoreNames.contains(scoreStore)) {
          const scoresStore = db.createObjectStore(scoreStore, { keyPath: "id", autoIncrement: true });
          scoresStore.createIndex("date", "date", { unique: false });
          scoresStore.createIndex("score", "score", { unique: false });
        }

        if (!db.objectStoreNames.contains(scoreSixLetterStore)) {
          const scoresSixLetterStore = db.createObjectStore(scoreSixLetterStore, { keyPath: "id", autoIncrement: true });
          scoresSixLetterStore.createIndex("date", "date", { unique: false });
          scoresSixLetterStore.createIndex("score", "score", { unique: false });
        }
  
        if (!db.objectStoreNames.contains(streakStore)) {
  
          const streaksStore = db.createObjectStore(streakStore, {  keyPath: "id", autoIncrement: true });
          streaksStore.createIndex("date", "date", { unique: false });
          streaksStore.createIndex("highestStreak", "highestStreak", { unique: false });
          streaksStore.createIndex("currentStreak", "currentStreak", { unique: false });
  
        }


        if (!db.objectStoreNames.contains(streakSixLetterStore)) {
  
          const streaksSixLetterStore = db.createObjectStore(streakSixLetterStore, {  keyPath: "id", autoIncrement: true });
          streaksSixLetterStore.createIndex("date", "date", { unique: false });
          streaksSixLetterStore.createIndex("highestStreak", "highestStreak", { unique: false });
          streaksSixLetterStore.createIndex("currentStreak", "currentStreak", { unique: false });
  
        }
  
        if(!db.objectStoreNames.contains(globalGameStore)) {
            // Create a store with a fixed keyPath
            const globalStore = db.createObjectStore(globalGameStore, { keyPath: "id" });
  
            // Add a single default record
            globalStore.add({ id: 1, highestStreak: 0, 
                              currentStreak: 0 , highestScore: 0 , 
                              currentScore: 0 , overallScore: 0 });
        }

        if(!db.objectStoreNames.contains(globalGameSixLetterStore)) {
          // Create a store with a fixed keyPath
          const globalGameSixLettersStore = db.createObjectStore(globalGameSixLetterStore, { keyPath: "id" });

          // Add a single default record
          globalGameSixLettersStore.add({ id: 1, highestStreak: 0, 
                            currentStreak: 0 , highestScore: 0 , 
                            currentScore: 0 , overallScore: 0 });
      }
  
      };
  
      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.error);
    });
  }


  // Load Words from IndexedDB
function loadWordsFromIndexedDB(db) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(wordsStore, "readonly");
      const store = transaction.objectStore(wordsStore);
      const request = store.get(wordStoreKey);
  
      request.onsuccess = () => resolve(request.result?.data || null);
      request.onerror = (event) => reject(event.target.error);
    });
}

function loadSixLetterWordsFromIndexedDB(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(sixLetterWordsStore, "readonly");
    const store = transaction.objectStore(sixLetterWordsStore);
    const request = store.get(wordSixLetterStoreKey);

    request.onsuccess = () => resolve(request.result?.data || null);
    request.onerror = (event) => reject(event.target.error);
  });
}
  
  // Load and Filter Words
  async function loadAndFilterWords() {
    logToScreen("initializing indexed database");
    const db = await initIndexedDB();
  
    //check if words exist
    logToScreen("loading words from database");
    const cachedWords = await loadWordsFromIndexedDB(db);
  
    if (cachedWords) {
      logToScreen("Loaded words from IndexedDB.");
      return;
    } else {
      logToScreen("No cached words, empty database.");
    }
  
    try {
      logToScreen("loading json file");
      //const response = await fetch("./dictionaries/updated-wordlist.json");
      //const response = await fetch("https://appassets.androidplatform.net/assets/words_dictionary.json");
      let response;
  
      let filePath;
  
      if (navigator.userAgent.match(/Android/i)) {
        // Mobile (WebView) environment
        filePath = './dictionaries/updated-wordlist.json'; // Android WebView local path
        //response = await getFileXHR(filePath);
  
        // getFileXHR(filePath).then(data => {
        //   if (data) {
        //       response = data;
        //       logToScreen("loaded words from file");
        //   } else {
        //     logToScreen("Failed to load the file.");
        //   }
        // });
        response = await getFileXHR(filePath);
  
      } else {
        // Desktop or non-Android WebView environment
        filePath = '/dictionaries/updated-wordlist.json'; // For local file access on desktop
        response = await getFileXHR(filePath);
      }
  
  
  
      const data = JSON.parse(response);
      logToScreen("filepath " + filePath);
      logToScreen("IN FILE " + response);
      
      logToScreen("json file loaded");
      
      // Filter only 5-letter words (not needed as file contains only 5 letter words but just in case)
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([word]) => word.length === 5)
      );
  
      await saveWordsToIndexedDB(db, filteredData);
      console.log("Filtered words saved to IndexedDB.");
    } catch (error) {
      logToScreen("error in load and filter words " + error.message);
      console.error("Error fetching or saving words:", error);
    }
  }

  async function loadAndFilterSixLetterWords() {
    logToScreen("initializing indexed database");
    const db = await initIndexedDB();
  
    //check if words exist
    logToScreen("loading words from database");
    const cachedWords = await loadSixLetterWordsFromIndexedDB(db);
  
    if (cachedWords) {
      logToScreen("Loaded words from IndexedDB.");
      return;
    } else {
      logToScreen("No cached words, empty database.");
    }
  
    try {
      logToScreen("loading json file");
      //const response = await fetch("./dictionaries/updated-wordlist.json");
      //const response = await fetch("https://appassets.androidplatform.net/assets/words_dictionary.json");
      let response;
  
      let filePath;
  
      if (navigator.userAgent.match(/Android/i)) {
        // Mobile (WebView) environment
        filePath = './dictionaries/sixletter_dictionary.json'; // Android WebView local path
        //response = await getFileXHR(filePath);
  
        // getFileXHR(filePath).then(data => {
        //   if (data) {
        //       response = data;
        //       logToScreen("loaded words from file");
        //   } else {
        //     logToScreen("Failed to load the file.");
        //   }
        // });
        response = await getFileXHR(filePath);
  
      } else {
        // Desktop or non-Android WebView environment
        filePath = '/dictionaries/sixletter_dictionary.json'; // For local file access on desktop
        response = await getFileXHR(filePath);
      }
  
  
  
      const data = JSON.parse(response);
      logToScreen("filepath " + filePath);
      logToScreen("IN FILE " + response);
      
      logToScreen("json file loaded");
  
      await saveSixLetterWordsToIndexedDB(db, data);
      console.log("Filtered words saved to IndexedDB.");
    } catch (error) {
      logToScreen("error in load and filter words " + error.message);
      console.error("Error fetching or saving words:", error);
    }
  }
  
  function getFileXHR(path) {
    return new Promise((resolve, reject) => {
        try {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.responseText);
                    } else {
                        resolve(null);
                    }
                }
            };
            xhr.open("GET", path);
            xhr.send();
        } catch (e) {
            reject(e);
        }
    });
  }
  

  // Save Words to IndexedDB
function saveWordsToIndexedDB(db, words) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(wordsStore, "readwrite");
      const store = transaction.objectStore(wordsStore);
      store.put({ key: wordStoreKey, data: words });
  
      transaction.oncomplete = resolve;
      transaction.onerror = (event) => reject(event.target.error);
    });
}

function saveSixLetterWordsToIndexedDB(db, words) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(sixLetterWordsStore, "readwrite");
    const store = transaction.objectStore(sixLetterWordsStore);
    store.put({ key: wordSixLetterStoreKey, data: words });

    transaction.oncomplete = resolve;
    transaction.onerror = (event) => reject(event.target.error);
  });
}