/**
 * Extracts words of a specific length from a JSON file and provides a downloadable JSON file.
 * @param {string} filePath - The path to the JSON file (relative or absolute).
 * @param {number} numLetters - The desired word length (e.g., 5, 6, 7).
 * @param {string} outputFileName - The name of the output JSON file.
 */
function extractWordsByLengthWithXHR(filePath, numLetters, outputFileName) {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', filePath, true);

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const jsonData = JSON.parse(xhr.responseText);
                const result = {};
                let counter = 0;

                // Extract words of the specified length
                for (const [word, value] of Object.entries(jsonData)) {
                    if (word.length === numLetters) {
                        result[word] = counter++;
                    }
                }

                // Create a downloadable JSON file
                const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = outputFileName;
                a.click();
                URL.revokeObjectURL(url);

                console.log(`Result written to ${outputFileName}`);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        } else {
            console.error(`Failed to load file: ${xhr.status} ${xhr.statusText}`);
        }
    };

    xhr.onerror = function () {
        console.error('Network error occurred while fetching the file.');
    };

    xhr.send();
}