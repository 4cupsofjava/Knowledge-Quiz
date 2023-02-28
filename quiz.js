'use strict';

let myForm = document.querySelector('#my-form');

function handleFormSubmit(event) {
  event.preventDefault();
  let firstName = event.target.elements.firstName.value;
  let lastName = event.target.elements.lastName.value; 
  console.log(`First Name: ${firstName}`);
  console.log(`Last Name: ${lastName}`);
  let form = document.getElementById('my-form');
  // form.addEventListener('submit', function(event) {
  // event.preventDefault(); // prevent form submission
  let nameFields = form.querySelector('fieldset');
  nameFields.style.display = 'none';
  // }
};

myForm.addEventListener('submit', handleFormSubmit); 

let amount = 0

function Question(question, correctAnswer, wrongAnswers, resources) {
  this.question = question;
  this.correctAnswer = correctAnswer;
  this.wrongAnswers = wrongAnswers;
  this.resources = resources;
  this.skipped = false;
  this.answerSubmitted = false;
};

function Quiz(allQuestions) {
  this.allQuestions = allQuestions;
  this.currentQuestionIndex = 0;
  this.score = 0;
  this.submittedQuestions = [];
  this.skippedQuestions = [];
  this.skippedQuestionIndex = 0;
  this.userWrongAnswersArray = [];
};

let amount = 0

//Method to display question
Quiz.prototype.displayQuestion = function() {
  let question = this.allQuestions[this.currentQuestionIndex];
  //Check if the question is skipped or last question in array

  let questionText = document.querySelector('#question');
  questionText.textContent = question.question;

  let choices = document.querySelectorAll('.choice');
  //Slice wrong answers and splice correct answer into the array at random index
  let answers = question.wrongAnswers.slice();
  answers.splice(Math.floor(Math.random() * (answers.length + 1)), 0, question.correctAnswer);
  for (let i = 0; i < choices.length; i++) {
    choices[i].textContent = answers[i];
  };
};

Quiz.prototype.checkAnswer = function(answer) {
  let question = this.allQuestions[this.currentQuestionIndex];
  
  if (answer === 'skip') {
    this.allQuestions.push(question);
    this.currentQuestionIndex++;
    this.displayQuestion();
    console.log(`Skipped: ${question}`);
  } else {
    if (answer === question.correctAnswer) {
      console.log("Correct!");
      this.score++;
      amount++;
    } else {
      console.log("Incorrect!");
      console.log("Resources:");
      console.log(question.resources);
      amount++;
    }
    this.currentQuestionIndex++;
    this.submittedQuestions.push(question);
    //Checks whether the length of questions has been asked
    if (this.currentQuestionIndex < this.allQuestions.length) {
      //If the length of allQuestions hasn't been asked, assign next question
      this.displayQuestion();
    } else {
      this.displayScore();
    }
  }
}


Quiz.prototype.displayScore = function() {
  let quizDiv = document.getElementById('quiz');
  quizDiv.style.display = 'none';

  let reviewDiv = document.createElement('div');
  reviewDiv.id = 'review';

  let numQuestions = amount;
  let numCorrect = this.score
  let scoreText = document.createElement('p');
  scoreText.textContent = `You got ${numCorrect} out of ${numQuestions} correct.`;
  reviewDiv.appendChild(scoreText);
  for (let i = 0; i < allQuestions.length; i++) {
    let question = allQuestions[i];
    let userAnswer = this.submittedQuestions[i];
    let questionDiv = document.createElement('div');
    questionDiv.classList.add('question');
    questionDiv.innerHTML = `<h3>${question.question}</h3>
                             <p>Correct Answer: ${question.correctAnswer}</p>
                             <p>Your Answer: ${userAnswer}</p>
                             <ul class="resources"></ul>`;
    // Display the resources for each question
    let resourcesList = questionDiv.querySelector('.resources');
    for (let j = 0; j < question.resources.length; j++) {
      let resource = document.createElement('li');
      let link = document.createElement('a');
      link.href = question.resources[j];
      link.target = '_blank';
      link.textContent = question.resources[j];
      resource.appendChild(link);
      resourcesList.appendChild(resource);
    };
    reviewDiv.appendChild(questionDiv);
  };
  // Add the review div to the page
  let body = document.querySelector('body');
  body.appendChild(reviewDiv);

  // Add a button to restart the quiz
  let restartButton = document.createElement('button');
  restartButton.id = 'restart';
  restartButton.textContent = 'Restart Quiz';
  restartButton.addEventListener('click', function() {
    // Reload the page to restart the quiz
    location.reload();
  });
  reviewDiv.appendChild(restartButton);
};

function startQuiz() {
  let quiz = new Quiz(allQuestions);
  quiz.displayQuestion();

  let skipButton = document.getElementById('skip');
  skipButton.addEventListener('click', function() {
    quiz.checkAnswer('skip');
  });

  let choices = document.querySelectorAll('.choice');
  for (let i = 0; i < choices.length; i++) {
    choices[i].addEventListener('click', function(event) {
      quiz.checkAnswer(event.target.textContent);
    });
  };
};

let allQuestions = [  new Question(    "What is 'event bubbling' in JavaScript?",    "The process by which an event is handled by its target element, and then by its parent elements",    [      "The process by which an event is handled only by its target element",      "The process by which an event is handled by all elements on the page",      "The process by which an event is handled by its parent element, and then by its child elements"    ],
    [      "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture",      "https://www.w3schools.com/js/js_htmldom_eventlistener.asp",      "https://javascript.info/bubbling-and-capturing"    ]
  ),
  new Question(
    "What is a 'Promise' in JavaScript?",
    "An object that represents the eventual completion (or failure) of an asynchronous operation",
    [      "A function that returns a value immediately",      "A variable that cannot be changed once it is set",      "A function that takes a callback as an argument"    ],
    [      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise",      "https://www.w3schools.com/js/js_promise.asp",      "https://javascript.info/promise-basics"    ]
  ),
  new Question(
    "What is the result of the following expression: typeof null?",
    "object",
    [
      "null",
      "undefined",
      "number",
      "string"
    ],
    [
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof",
      "https://2ality.com/2013/10/typeof-null.html",
      "https://www.freecodecamp.org/news/javascript-typeof-operator-explained-with-examples/"
    ]
  ),
  new Question(
    "What is the output of the following code: console.log(1 + '2' + '2')?",
    "122",
    [
      "32",
      "5",
      "NaN",
      "1222"
    ],
    [
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Addition",
      "https://www.w3schools.com/js/js_type_conversion.asp",
      "https://stackoverflow.com/allQuestions/56165271/why-does-1-22-2-equal-122-in-javascript"
    ]
  ),
  new Question(
    "What is the difference between '==' and '===' in JavaScript?",
    "'==' performs type coercion, '===' does not",
    [
      "'===' performs type coercion, '==' does not",
      "Both operators perform type coercion",
      "Both operators do not perform type coercion",
      "None of the above"
    ],
    [
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality",
      "https://www.w3schools.com/js/js_type_conversion.asp",
      "https://dorey.github.io/JavaScript-Equality-Table/"
    ]
  ),
  new Question(
    "What is 'this' keyword in JavaScript?",
    "A reference to the current object",
    [
      "A reserved word for function arguments",
      "A keyword used to declare a variable",
      "A keyword used to declare an object",
      "All of the above"
    ],
    [
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this",
      "https://www.w3schools.com/js/js_this.asp", "https://javascript.info/object-methods"]
  ),
  new Question(
    "What is 'NaN' in JavaScript?",
    "A value representing Not-A-Number",
    ["A function that returns a random number", "A keyword used to declare a variable", "A function that returns the maximum value of an array"],
    ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN", "https://www.w3schools.com/jsref/jsref_nan.asp", "https://javascript.info/number#nan"]
  ),
  new Question(
    "Which of the following is a correct way to declare a function in JavaScript?",
    "function myFunction() {}",
    ["myFunction() {}", "let myFunction = function() {}", "All of the above"],
    ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function"]
  ),
  
  new Question(
    "What is an immediately invoked function in JavaScript?",
    "A function that is executed as soon as it is defined",
    ["A function that is executed only when it is called", "A function that is executed only in strict mode", "A function that is executed only in non-strict mode"],
    ["https://developer.mozilla.org/en-US/docs/Glossary/IIFE", "https://www.w3schools.com/js/js_function_definition.asp"]
  ),
  
  new Question(
    "What is the 'new' keyword used for in JavaScript?",
    "To create a new instance of an object",
    ["To delete an object", "To modify an existing object", "To assign a value to a variable"],
    ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new", "https://www.w3schools.com/js/js_objects.asp"]
  ),
  
  new Question(
    "What is 'event delegation' in JavaScript?",
    "The process of using event propagation to handle events at a higher level in the DOM",
    ["The process of handling events on the target element only", "The process of using event capturing to handle events at a higher level in the DOM", "The process of handling events on all elements in the DOM"],
    ["https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_delegation", "https://www.w3schools.com/jsref/met_element_addeventlistener.asp", "https://javascript.info/event-delegation"]
  ),
  
  new Question(
    "What is the difference between 'null' and 'undefined' in JavaScript?",
    "'null' is an assigned value, while 'undefined' means a variable has been declared but not defined",
    ["'undefined' is an assigned value, while 'null' means a variable has been declared but not defined", "'null' is a primitive data type, while 'undefined' is an object", "'undefined' is a primitive data type, while 'null' is an object"],
    ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined", "https://stackoverflow.com/allQuestions/5076944/what-is-the-difference-between-null-and-undefined-in-javascript"]
  ),
  
  new Question(
    "What is the output of the following code: console.log(2 + '2' + 2)?",
    "'222'",
    ["'6'", "'422'", "'undefined'"],
    ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Addition", "https://www.w3schools.com/js/js_type_conversion.asp"]
  ),
];

startQuiz();
