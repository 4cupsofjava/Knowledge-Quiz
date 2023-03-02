'use strict';

let myForm = document.querySelector('#my-form');

let userName = ''
function handleFormSubmit(event) {
  event.preventDefault();
  let firstName = event.target.elements.firstName.value;
  let lastName = event.target.elements.lastName.value;
  userName = `${firstName} ${lastName}`;

  let form = document.getElementById('my-form');
  let nameFields = form.querySelector('fieldset');
  nameFields.style.display = 'none';

  let quizDiv = document.getElementById('quiz');
  quizDiv.style.display = 'block';

  let quiz = new Quiz(userName, allQuestions);
  quiz.displayQuestion();
};

myForm.addEventListener('submit', handleFormSubmit);

let amount = 0

function Question(question, correctAnswer, wrongAnswers, resources) {
  this.question = question;
  this.correctAnswer = correctAnswer;
  this.wrongAnswers = wrongAnswers;
  this.resources = resources;
};

function Quiz(userName, allQuestions) {
  this.userName = userName;
  this.allQuestions = allQuestions;
  this.currentQuestionIndex = 0;
  this.score = 0;
  this.submittedQuestions = [];

};

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

  let progressBar = document.querySelector('#progress-bar');
  let progressPercentage = (this.currentQuestionIndex / this.allQuestions.length) * 100;
  progressBar.style.width = `${progressPercentage}%`;
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
    this.submittedQuestions.push(answer);
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
  let numCorrect = this.score;
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

  // Store the user's score in the userScores array
  let userScores = [];
  if (localStorage.getItem('userScores')) {
    userScores = JSON.parse(localStorage.getItem('userScores'));
  }
  userScores.push({userName, numCorrect, amount});
  localStorage.setItem('userScores', JSON.stringify(userScores));
  console.log(userScores);
};


function startQuiz() {
  let quiz = new Quiz(userName, allQuestions);
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

let allQuestions = [  new Question(
  "Why did the programmer quit his job?",
  "He didn't get arrays.",
  [
  "Because he was tired of coding",
  "Because he didn't like his boss",
  "Because he wanted to start his own startup"
  ],
  [
  "https://www.reddit.com/r/ProgrammerHumor/comments/3hs6iw/why_did_the_programmer_quit_his_job/",
  "https://www.reddit.com/r/ProgrammerHumor/comments/5v5kl5/why_did_the_javascript_developer_quit_his_job/"
  ]
  ),new Question(    "What is 'event bubbling' in JavaScript?",    "The process by which an event is handled by its target element, and then by its parent elements",    [      "The process by which an event is handled only by its target element",      "The process by which an event is handled by all elements on the page",      "The process by which an event is handled by its parent element, and then by its child elements"    ],
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

  new Question(
    "Why do programmers prefer dark mode?",
    "Because light attracts bugs.",
    [
      "Because it's easier on the eyes",
      "Because it looks cooler",
      "Because they want to be edgy"
    ],
    [
      "https://www.reddit.com/r/ProgrammerHumor/comments/9npbvr/why_do_programmers_prefer_dark_mode/",
      "https://www.reddit.com/r/ProgrammerHumor/comments/62r5r5/why_do_programmers_prefer_dark_mode/"
    ]
  ),
  new Question(
    "Why do programmers prefer dark chocolate?",
    "Because it's bitter like their code.",
    [
      "Because it's healthier",
      "Because it's sweeter",
      "Because they like the taste"
    ],
    [
      "https://www.reddit.com/r/ProgrammerHumor/comments/2fdlj1/why_do_programmers_prefer_dark_chocolate/"
    ]
  ),
  new Question(
    "Why do programmers prefer dark alleys?",
    "Because they like to avoid exceptions.",
    [
      "Because it's quieter",
      "Because it's more mysterious",
      "Because they're ninjas"
    ],
    [
      "https://www.reddit.com/r/ProgrammerHumor/comments/3ll0d1/why_do_programmers_prefer_dark_alleys/"
    ]
  ),
  new Question(
    "Why don't programmers like nature?",
    "Because it has too many bugs.",
    [
      "Because they prefer the city",
      "Because they're allergic to pollen",
      "Because they're afraid of spiders"
    ],
    [
      "https://www.reddit.com/r/ProgrammerHumor/comments/22g95d/why_programmers_dont_like_nature/"
    ]
  ),
  new Question(
    "Why did the programmer quit his job?",
    "He didn't get arrays.",
    [
      "Because he was tired of coding",
      "Because he didn't like his boss",
      "Because he wanted to start his own startup"
    ],
    [
      "https://www.reddit.com/r/ProgrammerHumor/comments/3hs6iw/why_did_the_programmer_quit_his_job/",
      "https://www.reddit.com/r/ProgrammerHumor/comments/5v5kl5/why_did_the_javascript_developer_quit_his_job/"
    ]
  ),
  new Question(
    "Why did the programmer go broke?",
    "He used up all his cache.",
    [
      "Because he spent too much money",
      "Because he invested poorly",
      "Because he didn't have a good business plan"
    ],
    [
      "https://www.reddit.com/r/ProgrammerHumor/comments/33epii/why_did_the_programmer_go_broke/"
    ]
  ),
  new Question(
    "Why do programmers prefer dark bedrooms?",
    "Because light is a source of errors.",
    [
      "Because it helps them sleep better",
      "Because they like the privacy",
      "Because they're vampires"
    ],
    [
      "https://www.reddit.com/r/ProgrammerHumor/comments/4al4f4/why_do_programmers_prefer_dark_bedrooms/"
    ]
  ),
  new Question(
    "Why do JavaScript developers wear glasses?",
    "Because they can't C#.",
    [
      "Because it makes them look smarter",
      "Because they stare at the computer screen too much",
      "Because they like the way it looks"
    ],
    [
      "https://www.reddit.com/r/ProgrammerHumor/comments/4mw4x4/why_do_javascript_developers_wear_glasses/",
      "https://www.reddit.com/r/ProgrammerHumor/comments/5xelx2/why_do_javascript_developers_wear_glasses/"
    ]
  ),
  new Question(
    "Why do JavaScript developers prefer Macs?",
    "Because they don't like Windows 'NaN'.",
    [
      "Because they're more reliable",
      "Because they're more secure",
      "Because they look cooler"
    ],
    [
      "https://www.reddit.com/r/ProgrammerHumor/comments/5e5znt/why_do_javascript_developers_prefer_mac/",
      "https://www.reddit.com/r/ProgrammerHumor/comments/7l9xdi/why_do_javascript_developers_use_macs/"
    ]
  ),
  new Question(
    "Why did the JavaScript developer wear a tie?",
    "Because he wanted to look 'classy'.",
    [
      "Because he had a job interview",
      "Because it was Casual Friday",
      "Because he had a hot date"
    ],
    [
      "https://www.reddit.com/r/ProgrammerHumor/comments/3mbs9e/why_did_the_javascript_developer_wear_a_tie/"
    ]
  ),
  new Question(
    "Why do JavaScript developers prefer dark mode?",
    "Because light mode can't handle all the callbacks.",
    [
      "Because it's easier on the eyes",
      "Because it's more efficient",
      "Because it's edgier"
    ],
    [
      "https://www.reddit.com/r/ProgrammerHumor/comments/8vy7ux/why_do_javascript_developers_prefer_dark_mode/"
    ]
  ),
  new Question(
    "Why do JavaScript developers prefer async/await?",
    "Because callbacks give them 'Promises' they can't keep.",
    [
      "Because it's easier to read",
      "Because it's faster",
      "Because it's the future of JavaScript"
    ],
    [
      "https://www.reddit.com/r/ProgrammerHumor/comments/7of0t4/why_do_javascript_developers_prefer_asyncawait/"
    ]
  ),
  new Question(
    "Why do JavaScript developers prefer cats?",
    "Because they're experts at 'try-catch'.",
    [
      "Because they're cute",
      "Because they're low maintenance",
      "Because they're good for morale"
    ],
    [
      "https://www.reddit.com/r/ProgrammerHumor/comments/3h2k41/why_do_javascript_developers_prefer_cats/"
    ]
  ),
  new Question(
    "Why do JavaScript developers hate nature?",
    "Because it has too many 'bugs'.",
    [
      "Because they prefer the city",
      "Because they're allergic to pollen",
      "Because they're afraid of spiders"
    ],
    [
      "https://www.reddit.com/r/ProgrammerHumor/comments/5p5mgk/why_do_javascript_developers_hate_nature/"
    ]
  ),
  new Question(    "What is JavaScript?",    "A scripting language used to create and control dynamic website content.",    [      "A markup language used to create web pages",      "A programming language used to create operating systems",      "A database language used to store website content"    ],
    [      "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/What_is_JavaScript"    ]
  ),
  new Question(
    "What is a variable in JavaScript?",
    "A container for storing data values.",
    [      "A type of function",      "A special type of HTML element",      "A way of organizing code"    ],
    [      "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/Variables"    ]
  ),
  new Question(
    "What is a function in JavaScript?",
    "A block of code designed to perform a specific task.",
    [      "A type of variable",      "A way of styling web pages",      "A type of event"    ],
    [      "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Functions"    ]
  ),
  new Question(
    "What is an if statement in JavaScript?",
    "A conditional statement that executes a block of code if a specified condition is true.",
    [      "A loop that repeats a block of code",      "A way of defining a function",      "A way of storing data"    ],
    [      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else"    ]
  ),
  new Question(
    "What is a for loop in JavaScript?",
    "A loop that repeats a block of code a specified number of times.",
    [      "A way of defining a function",      "A way of styling web pages",      "A way of storing data"    ],
    [      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for"    ]
  ),
  new Question(
    "What is an array in JavaScript?",
    "A special variable that can hold more than one value at a time.",
    [      "A way of defining a function",      "A way of styling web pages",      "A type of loop"    ],
    [      "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/Arrays"    ]
  ),
  new Question(
    "What is an object in JavaScript?",
    "A collection of related data and/or functionality.",
    [      "A way of defining a function",      "A type of loop",      "A way of storing data"    ],
    [      "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Basics"    ]
  ),
  new Question(
    "What is a method in JavaScript?",
    "A function that is a property of an object.",
    [      "A way of defining a variable",      "A way of styling web pages",      "A way of storing data"    ],
    [      "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_methods"    ]
  ),
  new Question(
    "What is the DOM in JavaScript?",
    "The Document Object Model is a programming interface for HTML and XML documents.",
    [      "A way of defining a function",      "A way of styling web pages",      "A way of storing data"    ],
    [      "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction"    ]
  )
];

startQuiz();

