'use strict';

function password(){
  let myAnswer = 'onlyus';
  let userGuess = prompt("what is your Password?");
  console.log(userGuess);
  console.log(myAnswer);
  

  while (userGuess.toLowerCase() != myAnswer){
    prompt("Please try again.")

  }
  
  let body = document.getElementById("body");
  document.body.style.display = "block"; 

}  
password();

// let body = document.getElementById("body");
// document.body.style.display = "block"; 


// COMPLETED TODO GET TEST SCORES FROM STUDENTS
// COMPLETED TODO CONSTRUCTOR FOR SCORES
// TODO GET THEM TP POPULATE AS A TABLE
let studentResults = document.getElementById("student-results");

let teachersPet = [];

// CONSTRUCTOR FUNCTION

function studentInfo(firstName, lastName, correctAnswer, wrongAnswers){
  this.name = firstName + " " + lastName;
  this.correctAnswer = correctAnswer;
  this.wrongAnswers = wrongAnswers;

};


studentInfo.prototype.render = function(){

  let table =     
  document.createElement('table');
  studentResults.appendChild(table);

  let row1 =  
  document.createElement('tr');
  table.appendChild(row1);

  let th1Elem =   
  document.createElement('th');
  th1Elem.textContent = 'Name';
  row1.appendChild(th1Elem);

  let th2Elem = 
  document.createElement('th');
  th2Elem.textContent = 'Correct Answers';
  row1.appendChild(th2Elem);

  let th3Elem = document.createElement('th');
  th3Elem.textContent = 'Wrong Answers';
  row1.appendChild(th3Elem);

  let row2 = document.createElement('tr');
  table.appendChild(row2);

  let td1Elem = document.createElement('td');
  td1Elem.textContent = this.name;
  row2.appendChild(td1Elem);

  let td2Elem = document.createElement('td');
  td2Elem.textContent = this.correctAnswer;
  row2.appendChild(td2Elem);

  let td3Elem = document.createElement('td');
  td3Elem.textContent = this.wrongAnswers;
  row2.appendChild(td3Elem);

  
};

               ??????????????????
// let firstName = new studentInfo('firstName', 'lastName', 'correctAnswer', 'wrongAnswers');

function renderAll(){
    teachersPet[i].studentInfo();
    teachersPet[i].render();
  
}

renderAll();
