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
