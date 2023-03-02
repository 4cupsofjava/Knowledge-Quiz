'use strict';

// Define studentInfo constructor function before using it
function studentInfo(firstName, lastName, correctAnswer, wrongAnswers) {
  this.name = firstName + " " + lastName;
  this.correctAnswer = correctAnswer;
  this.wrongAnswers = wrongAnswers;
}

// Retrieve scores from localStorage and parse them from JSON
let scores = JSON.parse(localStorage.getItem('userScores'));

// Create an array of student objects
let students = [
  new studentInfo("John", "Smith", 5, 4),
  new studentInfo("Jane", "Doe", 4, 5),
  new studentInfo("Alice", "Wonderland", 3, 6),
  new studentInfo("Bob", "Builder", 6, 3),
  new studentInfo("Peter", "Pan", 2, 7)
];

// Loop through the scores array and update the corresponding student object
for (let i = 0; i < scores.length; i++) {
  let firstName = scores[i].userName.split(' ')[0];
  let lastName = scores[i].userName.split(' ')[1];
  let correctAnswer = scores[i].numCorrect;
  let wrongAnswers = scores[i].numIncorrect;
  students[i].userName = firstName + ' ' + lastName;
  students[i].correctAnswer = correctAnswer;
  students[i].amount = wrongAnswers;
}

let studentResults = document.getElementById("student-results");

// Create an array of all students
let teachersPet = students.concat(scores);

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
  th3Elem.textContent = 'Wrong Answers';
  row1.appendChild(th3Elem);

  // Loop through the array of students and create a table row for each one
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
    td3Elem.textContent = teachersPet[i].wrongAnswers;
    row.appendChild(td3Elem);
  }
};

function renderAll() {
  studentInfo.prototype.render();
}

renderAll();