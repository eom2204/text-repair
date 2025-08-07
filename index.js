const fs = require('fs');
function restoreText(s, dictLines) {
    const dict = [];
    for (let line of dictLines) {
        const word = line.trim();
        if (word) {
            dict.push(word);
        }
    }

    const dictByLength = {};
    const anagramMapByLength = {};

    for (let word of dict) {
        const len = word.length;
        if (!dictByLength[len]) {
            dictByLength[len] = [];
        }
        dictByLength[len].push(word);

        if (!anagramMapByLength[len]) {
            anagramMapByLength[len] = {};
        }
        const sortedKey = word.split('').sort().join('');
        if (!anagramMapByLength[len][sortedKey]) {
            anagramMapByLength[len][sortedKey] = [];
        }
        anagramMapByLength[len][sortedKey].push(word);
    }

    const n = s.length;
    const dp = new Array(n + 1).fill(null);
    dp[0] = [];

    const maxWordLength = 30;

    for (let i = 1; i <= n; i++) {
        let start = Math.max(0, i - maxWordLength);
        for (let j = start; j < i; j++) {
            if (dp[j] === null) continue;
            const seg = s.substring(j, i);
            const L = seg.length;
            let matches = [];

            if (seg.includes('*')) {
                const candidateWords = dictByLength[L] || [];
                for (let word of candidateWords) {
                    let match = true;
                    for (let k = 0; k < L; k++) {
                        if (seg[k] !== '*') {
                            if (seg[k].toLowerCase() !== word[k]) {
                                match = false;
                                break;
                            }
                        }
                    }
                    if (match) {
                        let restoredWord = '';
                        for (let k = 0; k < L; k++) {
                            if (seg[k] === '*') {
                                restoredWord += word[k];
                            } else {
                                restoredWord += seg[k];
                            }
                        }
                        matches.push(restoredWord);
                    }
                }
            } else {
                const key = seg.toLowerCase().split('').sort().join('');
                const candidateWords = anagramMapByLength[L]?.[key] || [];
                for (let word of candidateWords) {
                    matches.push(word);
                }
            }

            if (matches.length > 0) {
                dp[i] = dp[j].concat([matches[0]]);
                break;
            }
        }
    }

    if (dp[n] === null) {
        return "FAILED TO RESTORE";
    } else {
        return dp[n].join(' ');
    }
}

function readDictionary(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return data.split('\n').map(word => word.trim().toLowerCase()).filter(word => word.length > 0);
    } catch (err) {
        console.error('Error reading dictionary file:', err);
        return [];
    }
}

const dictionary = readDictionary('dictionary.txt');

const inputString = "Al*cew*sbegninnigtoegtver*triedofsitt*ngbyh*rsitsreonhtebnakandofh*vingnothi*gtodoonc*ortw*cesh*hdapee*edintoth*boo*h*rsiste*wasr*adnigbuti*hadnopictu*esorc*nve*sati*nsinitandwhatisth*useofab**kth*ughtAlic*withou*pic*u*esorco*versa*ions";
const restoredText = restoreText(inputString, dictionary);
console.log(restoredText);
