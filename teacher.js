'use strict';

// Define studentInfo constructor function before using it
function studentInfo(firstName, lastName, correctAnswer, numQuestions) {
  this.name = firstName + " " + lastName;
  this.correctAnswer = correctAnswer;
  this.numQuestions = numQuestions;
}

// Retrieve scores from localStorage and parse them from JSON
let scores = JSON.parse(localStorage.getItem('userScores'));
// Create an array of student objects
let teachersPet = [
  new studentInfo("Monica", "Lewinsky", 5, 20),
  new studentInfo("DB", "Cooper", 8, 20),
  new studentInfo("Amelia", "Earhart", 10, 20),
  new studentInfo("Tupac", "Shakur", 15, 20),
  new studentInfo("Steve", "Irwin", 2, 20),
  new studentInfo("Anne", "Frank", 12, 20),
  new studentInfo("Al", "Capone", 6, 20),
  new studentInfo("Edgar Allan", "Poe", 7, 20),
  new studentInfo("Mark", "Twain", 18, 20)
];

// Loop through the scores array and update the corresponding student object
for (let i = 0; i < scores.length; i++) {
  let firstName = scores[i].userName.split(' ')[0];
  let lastName = scores[i].userName.split(' ')[1];
  let correctAnswer = scores[i].numCorrect;
  let numQuestions = scores[i].numQuestions;
  teachersPet.push(new studentInfo(firstName, lastName, correctAnswer, numQuestions));
}

// Sort the teachersPet array by most correct answers
teachersPet.sort(function(a, b) {
  return b.correctAnswer - a.correctAnswer;
});

let studentResults = document.getElementById("student-results");

studentInfo.prototype.render = function() {
  let table = document.createElement('table');
  studentResults.appendChild(table);

  let row1 = document.createElement('tr');
  table.appendChild(row1);

  let th1Elem = document.createElement('th');
  th1Elem.textContent = 'Name';
  row1.appendChild(th1Elem);

  let th2Elem = document.createElement('th');
  th2Elem.textContent = 'Correct Answers';
  row1.appendChild(th2Elem);

  let th3Elem = document.createElement('th');
  th3Elem.textContent = 'Total Questions';
  row1.appendChild(th3Elem);

  // Loop through the array of teachersPet and create a table row for each one
  for (let i = 0; i < teachersPet.length; i++) {
    let row = document.createElement('tr');
    table.appendChild(row);

    let td1Elem = document.createElement('td');
    td1Elem.textContent = teachersPet[i].name;
    row.appendChild(td1Elem);

    let td2Elem = document.createElement('td');
    td2Elem.textContent = teachersPet[i].correctAnswer;
    row.appendChild(td2Elem);

    let td3Elem = document.createElement('td');
    td3Elem.textContent = teachersPet[i].numQuestions;
    row.appendChild(td3Elem);
  }
};

function renderAll() {
  studentInfo.prototype.render();
}

renderAll();
