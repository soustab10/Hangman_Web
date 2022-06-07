//Firebase init processes here!
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCkG9F85xhNrs1meTFRprrdyOxc8ofHEMc",
    authDomain: "hangman-7f2b1.firebaseapp.com",
    projectId: "hangman-7f2b1",
    storageBucket: "hangman-7f2b1.appspot.com",
    messagingSenderId: "367412352725",
    appId: "1:367412352725:web:0a15286648a1f0069d345c",
    measurementId: "G-BVSPBL6TJ8"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import { getDatabase, ref, get, set, child, update, remove } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";

const db = getDatabase();


//Theme status
var themeStatus = sessionStorage.getItem('theme');
let userName = sessionStorage.getItem('name');
let level = sessionStorage.getItem('level');

const backdrop = document.querySelector('.game-bg');
//console.log(themeStatus);
var checkbox = document.querySelector('input[name=theme]');
if (themeStatus == 'dark') {
    checkbox.checked = true;
    document.documentElement.setAttribute('data-theme', 'dark');
}


if (checkbox.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
    sessionStorage.setItem('Theme', 'dark');
} else {
    document.documentElement.setAttribute('data-theme', 'light');
    sessionStorage.setItem('Theme', 'light')
}

checkbox.addEventListener('change', function() {
    if (this.checked) {
        trans();
        document.documentElement.setAttribute('data-theme', 'dark');
        sessionStorage.setItem('Theme', 'dark');
    } else {
        trans();
        document.documentElement.setAttribute('data-theme', 'light');
        sessionStorage.setItem('Theme', 'light');
    }
})

let trans = () => {
    document.documentElement.classList.add('transition');
    window.setTimeout(() => {
        document.documentElement.classList.remove('transition')
    }, 1000)
}


//modal open close functions
const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')
const LeaderboardButton = document.getElementById('leaderboard-btn')
LeaderboardButton.addEventListener('click', leader)
let tableContent = document.getElementById('dvTable');
var txt = document.getElementById('txt')
openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })
})

overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal.active')
    modals.forEach(modal => {
        closeModal(modal)
    })
})

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal')
        closeModal(modal)
    })
})

function openModal(modal) {
    if (modal == null) return
    modal.classList.add('active')
    overlay.classList.add('active')
}

function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
}


//letter defintions here
let selectedWord = null;
let selectedDef = null;



//WORD API STARTS here
let wordList;
const word = document.querySelector(".word-wrap");
const incorrect = document.querySelector(".not-present");
const incorrectLettersEl = document.querySelector('.not-present p');



async function getWord() {

    fetch(`https://random-words-api.vercel.app/word`)
        .then(response => response.json())
        .then(response => getWordbyLevel(response))
        .catch(err => console.log(err));
}




//Generate keyboard here
const keyboard = document.querySelector('.key-container');

function keyboardGenerate() {
    const keys = [
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'

        ]
        //generate a keyboard please :)
    keys.forEach(key => {
        const buttonElement = document.createElement('button');
        buttonElement.textContent = key;
        buttonElement.setAttribute('id', key);
        buttonElement.setAttribute('class', 'keyboard-button-keys');
        keyboard.append(buttonElement);
        buttonElement.addEventListener('click', () => check(key, 80));

    });









}

var interval;

window.onload = timedText;

function timedText() {

    //timer counter 
    let counter = 120 - 30 * level;
    var timer = setInterval(function() {
        if (counter === 0) {
            clearInterval(timer);
            gameLose();
        };
        txt.value = counter + " seconds";
        counter--;
        timeRemaining--;
    }, 1000);
}
//calling on-load functions

const startGamebutton = document.querySelector('.lvl-btn-tournament');



console.log(`Hello: ${userName} , you are playing level : ${level}`);
console.log(`Also if you think the answer,will magically appear here! Then you are very wrong!`);
keyboardGenerate();

function getWordbyLevel(response) {
    wordList = response;
    //console.log(wordList);
    selectedWord = wordList[0].word;
    selectedDef = wordList[0].definition;
    selectedWord = selectedWord.toLowerCase();

    //console.log(selectedWord);
    if (level == 0) {
        if (selectedWord.length >= 7) {
            getWord();
        } else {
            initializeWord();
        }
    }
    if (level == 1) {
        if (selectedWord.length < 8 && selectedWord.length >= 10) {
            getWord();
        } else {
            initializeWord();
        }
    }
    if (level == 2) {
        if (selectedWord.length <= 10) {
            getWord();
        } else {
            initializeWord();
        }
    }
}
getWord();

let hintShown = 0;

//app changes made from here

function initializeWord() {

    //wordList = response;
    //console.log(wordList);
    //selectedWord = wordList[0].word;
    //selectedDef = wordList[0].definition;
    //selectedWord = selectedWord.toLowerCase();

    //console.log(selectedWord);
    const noOfLetters = selectedWord.length;
    for (let i = 0; i < noOfLetters; i++) {
        const listItem = document.createElement('li');
        listItem.classList.add('letter');
        word.append(listItem);
    }
}




const playBtn = document.getElementById('play');
const indication = document.querySelector(".warning-letter");
const bodyParts = document.getElementsByClassName('body-part');

let incorrectLetters = [];
let correctLetters = [];





const finalMsg = document.querySelector('.display-msg');
const msgInfo = document.querySelector('.msg-info');

let incorrectCount = 0;
let totalScore = 0;

function displayIndication() {
    indication.classList.add('visible');
    indication.innerHTML = "Letter has already been entered!";
    setTimeout(() => {
        indication.classList.remove('visible');
    }, 2400);
}


let livesLeft = document.querySelector('.lives-left');

function decreaseLives() {
    livesLeft.innerHTML = "";
    for (let i = 0; i < 6 - incorrectCount; i++) {
        livesLeft.innerHTML += "&#10084;&#65039;"
    }
}

function updateFigure() {
    try {
        bodyParts[incorrectCount].style.display = 'block';
        incorrectCount++;
        decreaseLives();
    } catch (error) {}
}
let successfulGame = false;
let timeRemaining = 120 - 30 * level; //change to total time while adding levels

function gameWin() {
    setTimeout(() => {
        backdrop.classList.add('visible');
        successfulGame = true;
        totalScore = 450 * level + timeRemaining * 10 + 50 * (6 - incorrectCount) - (50 * hintShown);
        txt.style.display = 'none';
        finalMsg.innerHTML = `Congratulations! You won. Your Score: ${totalScore}`;
        finalMsg.innerHTML += "<br> Click on Show Leaderboard to check your position";
        finalMsg.classList.add('visible');
        setTimeout(() => {

            window.location.href = "../index.html";

        }, 3000);

        leader();
        //msgInfo.textContent = 'Congratulations! You won. Enter your name below:';
    }, 500);
}


function gameLose() {
    setTimeout(() => {
        backdrop.classList.add('visible');
        finalMsg.classList.add('visible');
        msgInfo.textContent = `Oops! You lost. The right word is "${selectedWord}"`;
    }, 500);
}


function refreshPage() {
    window.location.reload();
}

function passthroughFunction(ev) {
    let character = ev.key;
    let keyCode = ev.keyCode;
    check(character, keyCode);
}

function check(character, letterKey) {
    let letterElements = document.querySelectorAll('.word-wrap .letter');
    //console.log("haha");


    if (
        /*!backdrop.classList.contains('visible') &&
                !indication.classList.contains('visible') &&*/
        letterKey >= 65 &&
        letterKey <= 90
    ) {
        if (selectedWord.includes(character)) {
            if (correctLetters.includes(character)) {
                displayIndication();
            } else {
                correctLetters.push(character);
                const indexes = [];
                [...selectedWord].forEach((value, index) => {
                    if (value === character) {
                        indexes.push(index);
                    }
                });
                indexes.forEach((value) => {
                    letterElements[value].textContent = character;
                });
            }
        } else {
            if (incorrectLetters.includes(character)) {
                displayIndication();
            } else {
                incorrectLetters.push(character);
                if (!incorrect.classList.contains('visible')) {
                    incorrect.classList.add('visible');
                }
                incorrectLettersEl.textContent = `${incorrectLetters.join(', ')}`;
                updateFigure();
            }
        }
    }


    let formedWord = '';
    letterElements.forEach((value) => {
        formedWord += value.textContent;
    });


    if (formedWord === selectedWord) {
        gameWin();
    }


    if (incorrectCount >= 6 - level) {
        gameLose();
    }
}




window.addEventListener('keyup', passthroughFunction);
playBtn.addEventListener('click', refreshPage);



function leader() {

    updateData();

    function updateData() {
        //var customers = new Array();
        var nameDbMin;
        var scoreDbMin;
        var scoreMin = 550;
        var nameMin;
        let counter = 0;
        const dbRef = ref(db);
        get(child(dbRef, "Index/")).then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                counter++;
                nameDbMin = childSnapshot.val().NameOfPlayer;
                scoreDbMin = childSnapshot.val().Score;
                if (scoreDbMin < scoreMin) {
                    scoreMin = scoreDbMin;
                    nameMin = nameDbMin;
                }
            })
            if (counter > 25) {
                function deleteData() {
                    remove(ref(db, "Index/" + nameMin))
                        .then(() => {
                            //alert("Data removed!")
                        })
                        .catch((error) => {
                            alert("Error:" + error + ". Please try again in a moment");
                        })
                }
                deleteData();

            }

        })
    }



    //customers.push(["Name", "Score"]);
    //customers.push(["koala","10"]);

    function InsertData() {
        set(ref(db, "Index/" + userName), {
                Score: Math.max(totalScore, 10),
                NameOfPlayer: userName

            })
            .then(() => {
                //alert("data stored succesfully");
            })
            .catch((error) => {
                alert("Error:" + error + ". Please try again in a moment");
            })
    }
    if (successfulGame) {
        InsertData();
    }

    function SelectData() {

        var customers = new Array();
        const dbRef = ref(db);
        get(child(dbRef, "Index/")).then((snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    var nameDb = childSnapshot.val().NameOfPlayer;
                    var scoreDb = childSnapshot.val().Score;

                    var arrayDb = [nameDb, scoreDb];
                    customers.push(arrayDb);
                })

                // sorting array in descending order
                customers.sort(sortFunction);

                function sortFunction(a, b) {
                    if (a[1] === b[1]) {
                        return 0;
                    } else {
                        return (a[1] < b[1]) ? 1 : -1;
                    }
                }


                // ***** 
                var table = document.createElement("TABLE");
                table.border = "1";

                //Get the count of columns.
                var columnCount = customers[0].length;

                //Add the header row.
                var row = table.insertRow(-1);
                for (var i = 0; i < columnCount; i++) {
                    var headerCell = document.createElement("TH");
                    headerCell.innerHTML = customers[0][i];
                    row.appendChild(headerCell);
                }

                //Add the data rows.
                for (var i = 1; i < customers.length; i++) {
                    row = table.insertRow(-1);
                    for (var j = 0; j < columnCount; j++) {
                        var cell = row.insertCell(-1);
                        cell.innerHTML = customers[i][j];
                    }
                }
                tableContent.style.display = 'inline-block';
                var dvTable = document.getElementById("dvTable");

                dvTable.innerHTML = "";
                dvTable.appendChild(table);
            })
            .catch((error) => {
                alert("Error:" + error + ". Please try again in a moment");
            })
    }


    SelectData();


    // //Create a HTML Table element.
    // var table = document.createElement("TABLE");
    // table.border = "1";

    // //Get the count of columns.
    // var columnCount = customers[0].length;

    // //Add the header row.
    // var row = table.insertRow(-1);
    // for (var i = 0; i < columnCount; i++) {
    //     var headerCell = document.createElement("TH");
    //     headerCell.innerHTML = customers[0][i];
    //     row.appendChild(headerCell);
    // }

    // //Add the data rows.
    // for (var i = 1; i < customers.length; i++) {
    //     row = table.insertRow(-1);
    //     for (var j = 0; j < columnCount; j++) {
    //         var cell = row.insertCell(-1);
    //         cell.innerHTML = customers[i][j];
    //     }
    // }

    // var dvTable = document.getElementById("dvTable");
    // dvTable.innerHTML = "";
    // dvTable.appendChild(table);

}
var buttonHint = document.querySelector('.hint-btn');
buttonHint.onclick = function() {
    //do stuff
    console.log(hintShown);
    if (hintShown == 0) {
        hintShown++;
        console.log("Hint Shown:")
        indication.innerHTML = `Definition:` + selectedDef;
        indication.classList.add('visible');

        setTimeout(() => {
            indication.classList.remove('visible');
        }, 5000);
        return;

    }
    if (hintShown == 1 || hintShown == 2) {
        hintShown++;
        //console.log("Hint:")
        //letter reveal
        let letterElements = document.querySelectorAll('.word-wrap .letter');
        for (let i = 97; i <= 122; i++) {
            let charac = String.fromCharCode(i);
            //console.log(charac);

            if (selectedWord.includes(charac) && !(correctLetters.includes(charac))) {

                if (correctLetters.includes(charac)) {
                    continue;
                } else {
                    correctLetters.push(charac);
                    const indexes = [];
                    [...selectedWord].forEach((value, index) => {
                        if (value === charac) {
                            indexes.push(index);
                        }
                    });
                    indexes.forEach((value) => {
                        letterElements[value].textContent = charac;
                    });
                }
                break;
            }
        }



        indication.innerHTML = "Some Letters Revealed!!";
        indication.classList.add('visible');

        setTimeout(() => {
            indication.classList.remove('visible');
        }, 2500);
        let formedWord = '';
        letterElements.forEach((value) => {
            formedWord += value.textContent;
        });
        if (selectedWord == formedWord) {
            gameWin();
        }
        return;
    }
    if (hintShown >= 3) {
        indication.innerHTML = "All Hints Used! &#128577";
        indication.classList.add('visible');

        setTimeout(() => {
            indication.classList.remove('visible');
        }, 2500);
        return;
    }
}

//const hintButton = document.querySelector('.hint-btn');
//hintButton.addEventListener('click', showHints());