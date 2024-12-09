/* wikipedia stuff */


// function XHRWiki(){
//   // const searchValue = document.querySelector("input[name=Wikipedia]").value;
//   const url = `http://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(targetWord)}&format=json`;

//   const xhr = new XMLHttpRequest();
//   xhr.open('GET', url, true);
//   xhr.responseType = 'json'; // Automatically parse JSON
//   xhr.onload = function() {
//       if (xhr.status >= 200 && xhr.status < 300) {
//           processResult(xhr.response);
//       } else {
//           console.error('Request failed with status:', xhr.status);
//       }
//   };
//   xhr.onerror = function() {
//       console.error('Network error occurred.');
//   };
//   xhr.send();
// }

function XHRWiki() {

    // const searchValue = document.querySelector("input[name=Wikipedia]").value;
    //const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(targetWord)}&format=json`;
  
    const url = `https://en.wiktionary.org/w/api.php?action=query&titles=${encodeURIComponent(targetWord)}&prop=extracts&format=json`;
  
    getWikipediaDataJSONP(url)
      .then(apiResult => {
        if (apiResult && apiResult.query) {
          processResult(apiResult);
        } else {
          console.error('No results found.');
        }
      })
      .catch(error => console.error('Error:', error));
  
  }
  
  
  function getWikipediaDataJSONP(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const callbackName = `jsonpCallback_${Date.now()}`;
  
      // Attach the callback to the global scope
      window[callbackName] = function(data) {
        resolve(data);
        delete window[callbackName]; // Clean up
        script.remove(); // Remove the script tag after execution
      };
  
      script.onerror = function() {
        reject(new Error('JSONP request failed'));
        delete window[callbackName]; // Clean up
        script.remove();
      };
  
      // Append the callback parameter to the URL
      script.src = `${url}&callback=${callbackName}`;
      document.body.appendChild(script); // Inject the script into the document
    });
  }
  
  
  function processResult(apiResult) {
  
    const displayResult = document.getElementById('wordDescription');
    displayResult.innerHTML = ''; // Clear previous results
  
    const pages = apiResult.query?.pages || {};
    for (const pageId in pages) {
      const page = pages[pageId];
      if (page.extract) {
        const div = document.createElement('div');
        div.innerHTML = page.extract; // Extract includes formatted HTML
        displayResult.appendChild(div);
      } else {
        displayResult.textContent = `The word was ${targetWord.toUpperCase()}. Description Not Found`;
      }
    }
  
  }

