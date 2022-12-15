/*
Author: Ryan Riddiford
Hangman game
*/



const requestOptions = {
  method: "GET",
  //mode: "no-cors",
  //headers: { "Content-Type": "application/json" },
  //body: JSON.stringify(this.tutorial)
} 


//Temporary dictionary for development
let dictionary = [];
dictionary.push("SPIRIT");
dictionary.push("FEED");
dictionary.push("RIM");
dictionary.push("QUEEN");
dictionary.push("HAZARD");
dictionary.push("LEOPARD");

// async function GetRandomWord() {
//     try {
//         const contents = await fsPromises.readFile(dictionaryFilename, 'utf-8');
//         const arr = contents.split(/\r?\n/);
//         console.log(arr); // 👉️ ['One', 'Two', 'Three', 'Four'] 
//         return arr;
//       } catch (err) {
//         console.log(err);
//       }
// }






//Number of failed guesses allotted per game
const numTries = 7;
//Counts failed guesses this game
let failCount = 0;
//Counts letters found this game
let correctCount = 0;

let gameProgress = [];

const letterTray = document.getElementById("available-letters");

let attemptEl = document.getElementById("attempt");



let word;


let placedLetters = document.getElementById("placed-letters");


LoadTiles();



//Get random word from dictionary
function StartGame() {

    while(placedLetters.hasChildNodes()) {
      placedLetters.removeChild(placedLetters.firstChild);
  }


  word = GetRandomWord();
  // let wordPos = Math.floor(Math.random() * dictionary.length);
  // word = dictionary[wordPos];
  // console.log(word);

  SetupPlacedLetters();
  SetupGameProgress();

}


function GetRandomWord() {
    fetch('localhost:5000/randomWord')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    console.log("response: " + response);
    response.text.then(function (text) {
      console.log(text);
      word = text;
    });
  })
  .catch((error) => {
    console.error('There has been a problem with your fetch operation:', error);
  });
}






//Prepare for next game
function ResetGame() {

  failCount = 0;
  correctCount = 0;
  gameProgress = [];

  attemptEl.innerHTML = failCount;


  for(tile of letterTray.children) {
if (tile.disabled == true) {
tile.disabled = false;
tile.classList.remove("selected-letters");
}
  }

}





//Assess the user's attempt
function AssessAttempt(letter) {


  DisableLetter(letter);


 // console.clear();
console.log("assessing attempt");
console.log(letter);

let isCorrect = false;


for (let count = 0; count < gameProgress.length; count++) {
  console.log("1");
if (letter == gameProgress[count].letter) {
  gameProgress[count].isFound = true;
console.log("2");
  placedLetters.children.item(count).innerHTML = letter;
console.log("correct guess");
  correctCount++;
  isCorrect = true;
}
}

if (isCorrect == false) {
console.log("incorrect guess");
failCount++;
attemptEl.innerHTML = failCount;
}

if (correctCount == word.length) {
console.log("game won");
ResetGame();
//TODO game won UI stuff
}

else if (failCount == numTries) {
console.log("game lost");
ResetGame();
//TODO game lost UI stuff
}




}

//Disable the selected letter tile
function DisableLetter(letter) {
  let btn = document.getElementById(letter+"-tile");
  //btn.setAttribute("disabled", "");
  btn.classList.add("selected-letters");
  btn.disabled = true;
}




//Load the tiles to use
function LoadTiles() {

  const alphabetArray = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  for(let letter of alphabetArray) {
let tile = document.createElement("button");
tile.classList.add("tile");
tile.innerHTML = letter;
tile.id = letter + "-tile";
tile.type = "button";
tile.addEventListener("click", () => {
  AssessAttempt(letter)
});
letterTray.appendChild(tile);

}

console.log("tiles loaded");
}

//Set up the word's game progress tracker
function SetupGameProgress() {
  for (letter of word) {

    // let item = {

    // }

   gameProgress.push({
letter: letter,
isFound: false,
  });   
  }

}

//Create spots for the words letters to go in the UI
function SetupPlacedLetters () {



  for (let count = 0; count < word.length; count++) {

    let placement = document.createElement("div");

    placement.classList.add("letter-placement");

    //placement.setAttribute("position", count);

    placedLetters.appendChild(placement);
    

  }

}






