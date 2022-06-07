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
let successfulGame = false;
let tableContent = document.getElementById('dvTable');
let userName;


var themeStatus = sessionStorage.getItem('theme');
console.log(2);
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
const todoForm = document.querySelector('.form-todo');
const todoInput = document.querySelector(".form-todo input[type='text']");


document.querySelector('.lvl-btn-tournament').addEventListener('click', () => {
    var levelSelection = document.querySelector('#lvlchk');
    let ind = levelSelection.selectedIndex;
    sessionStorage.setItem("level", ind);
    if (todoInput.value.length > 0) {
        userName = todoInput.value;
        sessionStorage.setItem("name", userName);

    } else {
        sessionStorage.setItem("name", "Player");
    }
    location.replace("Gamepage/index.html");
})
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    var levelSelection = document.getElementById("favouriteonly");
    let ind = levelSelection.selectedIndex;
    sessionStorage.setItem("level", ind);
    if (todoInput.value.length > 0) {
        userName = todoInput.value;
        sessionStorage.setItem("name", userName);

    } else {
        sessionStorage.setItem("name", "Player");
    }
    location.replace("Gamepage/index.html");
});

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
                Score: totalScore,
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
const LeaderboardButton = document.getElementById('leaderboard-btn')
LeaderboardButton.addEventListener('click', leader)



//gameBtn.addEventListener('click', nextpage());