'use strict';

let myForm = document.querySelector('#my-form');

let userName = '';
let startTime = 0;
let timerId = null;

function handleFormSubmit(event) {
  event.preventDefault();
  let firstName = event.target.elements.firstName.value;
  let lastName = event.target.elements.lastName.value;
  if (firstName && lastName) {
    let capitalizedFirstName = `${firstName.charAt(0).toUpperCase()}${firstName.slice(1).toLowerCase()}`;
    let capitalizedLastName = `${lastName.charAt(0).toUpperCase()}${lastName.slice(1).toLowerCase()}`;
    userName = `${capitalizedFirstName} ${capitalizedLastName}`;
    console.log(userName);

    let form = document.getElementById('my-form');
    let nameFields = form.querySelector('fieldset');
    nameFields.style.display = 'none';

    let quizDiv = document.getElementById('quiz');
    quizDiv.style.display = 'block';

    let quiz = new Quiz(userName, allQuestions, numQuestions);
    quiz.displayQuestion();
  }
};

myForm.addEventListener('submit', handleFormSubmit);

function Question(question, correctAnswer, wrongAnswers, resources) {
  this.question = question;
  this.correctAnswer = correctAnswer;
  this.wrongAnswers = wrongAnswers;
  this.resources = resources;
  this.userAnswer = "";
};

function Quiz(userName, allQuestions, numQuestions) {
  this.userName = userName;
  
  // Shuffle the allQuestions array
  for (let i = allQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
  }
  
  this.allQuestions = allQuestions.slice(0, numQuestions);
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

  question.userAnswer = answer; // Update the user's answer for the current question
  
  if (answer === 'skip') {
    this.allQuestions.push(question);
    this.currentQuestionIndex++;
    this.displayQuestion();
    console.log(`Skipped: ${question}`);
  } else {
    if (answer === question.correctAnswer) {
      console.log("Correct!");
      this.score++;
    } else {
      console.log("Incorrect!");
      console.log("Resources:");
      console.log(question.resources);
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
  // clearInterval(timerId);
  let reviewDiv = document.createElement('div');
  reviewDiv.id = 'review';

  let tQuestions = this.submittedQuestions.length;
  let numCorrect = this.score;
  let scoreText = document.createElement('h3');
  scoreText.textContent = `${userName.split(" ")[0]} got ${numCorrect} out of ${tQuestions} correct.`;
  reviewDiv.appendChild(scoreText);
  for (let i = 0; i < tQuestions; i++) {
    let question = this.allQuestions[i];
    let userAnswer = this.allQuestions[i].userAnswer;
    console.log(this.allQuestions[i].userAnswer);
    
    let questionDiv = document.createElement('div');
    questionDiv.classList.add('question');
    questionDiv.innerHTML = `<h3>${i+1}. ${question.question}</h3>
                             <p><strong>Correct Answer:</strong> ${question.correctAnswer}</p>
                             <br>
                             <p><strong>Your Answer:</strong> ${question.userAnswer}</p>
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
  userScores.push({userName, numCorrect, tQuestions});
  localStorage.setItem('userScores', JSON.stringify(userScores));
  console.log(userScores);
};


function startQuiz() {
  let numQuestions = 20; // set the maximum number of questions to ask
  let quiz = new Quiz(userName, allQuestions, numQuestions);
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
  "Why did the programmer quit their job?",
  "They didn't get arrays.",
  [
  "Because they were tired of coding",
  "Because they didn't like their boss",
  "Because they hated gituations"
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
    "Why did the programmer go broke?",
    "They used up all their cache.",
    [
      "Because they spent too much money",
      "Because they invested poorly",
      "Because they didn't have a good business plan"
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
    "Because they wanted to look 'classy'.",
    [
      "Because they had a job interview",
      "Because it was Casual Friday",
      "Because they had a hot date"
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
  new Question(
  "What is the difference between 'var', 'let', and 'const' for declaring variables in JavaScript?",
  "Var is function scoped, let and const are block scoped. Const variables can't be reassigned.",
  [
    "Let is function scoped, var and const are block scoped. Const variables can be reassigned.",
    "Const is function scoped, let and var are block scoped. Let variables can't be reassigned.",
    "Var and const are function scoped, let is block scoped. Var variables can't be reassigned.",
  ],
  [
    "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var",
    "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let",
    "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const",
  ]
  ), 
  new Question(
  "What is a function in JavaScript?",
  "A block of code that performs a specific task and can be called multiple times throughout the program.",
  [
    "A type of variable that stores a collection of data.",
    "A way of selecting and manipulating elements in the HTML DOM.",
    "A set of conditional statements that executes different code based on a specific condition.",
  ],
  [
    "https://developer.mozilla.org/en-US/docs/Glossary/Function",
  ]
  ),
  new Question(
  "How do you declare a function in JavaScript?",
  "By using the 'function' keyword followed by the function name, parameters (if any), and the function body.",
  [
    "By using the 'var' keyword followed by the function name, parameters (if any), and the function body.",
    "By using the 'let' keyword followed by the function name, parameters (if any), and the function body.",
    "By using the 'const' keyword followed by the function name, parameters (if any), and the function body.",
  ],
  [
    "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions",
  ]
  ),

  new Question(
  "What is an array in JavaScript?",
  "An ordered list of values that can be of any data type.",
  [
    "A way of selecting and manipulating elements in the HTML DOM.",
    "A type of variable that stores a single value.",
    "A set of conditional statements that executes different code based on a specific condition.",
  ],
  [
    "https://developer.mozilla.org/en-US/docs/Glossary/array",
  ]
  ),
  new Question(
  "How do you access an element in an array in JavaScript?",
  "By using the square bracket notation with the index of the element you want to access.",
  [
    "By using the curly brace notation with the index of the element you want to access.",
    "By using the parentheses notation with the index of the element you want to access.",
    "By using the angle bracket notation with the index of the element you want to access.",
  ],
  [
    "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",
  ]
  ),
  new Question(
    "What is Git and why is it useful for developers?",
    "Git is a version control system that allows developers to keep track of changes made to code over time. It is useful for collaboration, maintaining a history of changes, and for rolling back to previous versions if necessary.",
    ["Git is a code editor for web development", "Git is a web server for hosting websites", "Git is a database for storing user information"],
    ["https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control"]
  ),
  new Question(
    "What is the command to initialize a new Git repository?",
    "The command to initialize a new Git repository is 'git init'.",
    ["git add", "git clone", "git commit"],
    ["https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository"]
  ),
  new Question(
    "What is the command to add files to the staging area?",
    "The command to add files to the staging area is 'git add [file]'.",
    ["git commit", "git status", "git push"],
    ["https://git-scm.com/docs/git-add"]
  ),
  new Question(
    "What is the command to commit changes to the local repository?",
    "The command to commit changes to the local repository is 'git commit -m '[commit message]''.",
    ["git push", "git clone", "git pull"],
    ["https://git-scm.com/docs/git-commit"]
  ),
  new Question(
    "What is the command to view the commit history?",
    "The command to view the commit history is 'git log'.",
    ["git status", "git branch", "git clone"],
    ["https://git-scm.com/docs/git-log"]
  ),
  new Question(
    "What is a 'branch' in Git?",
    "A branch is a version of the code that is separate from the main branch, allowing for experimentation and development without affecting the main codebase.",
    ["A way to store code on a remote server", "A version of the code that is no longer used", "A way to merge code from different developers"],
    ["https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell"]
  ),
  new Question(
    "What is the command to create a new branch?",
    "The command to create a new branch is 'git branch [new branch name]'.",
    ["git add", "git push", "git merge"],
    ["https://git-scm.com/docs/git-branch"]
  ),
  new Question(
    "What is the command to switch to a different branch?",
    "The command to switch to a different branch is 'git checkout [branch name]'.",
    ["git merge", "git push", "git status"],
    ["https://git-scm.com/docs/git-checkout"]
  ),
  new Question(
    "What is a 'merge conflict' in Git?",
    "A merge conflict occurs when Git is unable to automatically merge two branches due to conflicting changes made to the same lines of code.",
    ["A conflict between two different Git repositories", "A conflict between the local and remote repository", "A conflict between two different Git commands"],
    ["https://git-scm.com/docs/git-merge#_how_conflicts_are_presented"]
  ),
  new Question(
    "What does HTML stand for?",
    "Hyper Text Markup Language",
    ["Hyperlinks and Text Markup Language", "Home Tool Markup Language", "Hyper Text Modeling Language"],
    ["https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Getting_started"]
  ),
  new Question(
    "What is the basic structure of an HTML document?",
    "<!DOCTYPE html><html><head><title></title></head><body></body></html>",
    ["<html><head><title></title></head><body></body></html>", "<!DOCTYPE><html><head><title></title></head><body></body></html>", "<!DOCTYPE html><title></title><body></body>"],
    ["https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Getting_started"]
  ),
  new Question(
    "What is the purpose of the <head> section in an HTML document?",
    "To contain metadata about the document, such as the page title and links to stylesheets.",
    ["To display the main content of the page", "To contain the footer of the page", "To define the layout of the page"],
    ["https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/The_head_metadata_in_HTML"]
  ),
  new Question(
    "What is an HTML tag?",
    "A keyword surrounded by angle brackets (< >) used to define elements in an HTML document.",
    ["A type of hyperlink", "A section of content within an HTML document", "A method for styling elements in an HTML document"],
    ["https://developer.mozilla.org/en-US/docs/Glossary/Tag"]
  ),
  new Question(
    "What is the difference between a block-level element and an inline element in HTML?",
    "Block-level elements start on a new line and take up the full width of the page, while inline elements are displayed inline with the surrounding content.",
    ["Block-level elements are used for images, while inline elements are used for text", "Inline elements are styled using CSS, while block-level elements are not", "Block-level elements can only be nested inside other block-level elements, while inline elements can be nested inside block-level elements"],
    ["https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements", "https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements"]
  ),
  new Question(
    "What is the purpose of the alt attribute in an image tag?",
    "To provide alternative text for users who are unable to view the image.",
    ["To define the size of the image", "To specify the file type of the image", "To add a caption to the image"],
    ["https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Images_in_HTML"]
  ),
  new Question(
    "What is the difference between the <ul> and <ol> elements in HTML?",
    "<ul> represents an unordered list of items, while <ol> represents an ordered list of items.",
    ["<ul> is used for images, while <ol> is used for text", "<ol> is used for images, while <ul> is used for text", "There is no difference between the two elements"],
    ["https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul", "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol"]
  ),
  new Question(
    "What is an object in JavaScript?",
    "An object is a collection of properties that can contain values or other objects.",
    [    "An object is a type of function in JavaScript.",    "An object is a data type in JavaScript that can store only numbers.",    "An object is a string literal in JavaScript."  ],
    ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects"]
  ),
  new Question(
  "What does HTML stand for?",
  "Hyper Text Markup Language",
  ["Hyperlinks and Text Markup Language", "Home Tool Markup Language", "Hyper Text Modeling Language"],
  ["https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Getting_started"]
  ),
  new Question(
    "What is the basic structure of an HTML document?",
    "<!DOCTYPE html><html><head><title></title></head><body></body></html>",
    ["<html><head><title></title></head><body></body></html>", "<!DOCTYPE><html><head><title></title></head><body></body></html>", "<!DOCTYPE html><title></title><body></body>"],
    ["https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Getting_started"]
  ),
  new Question(
    "What is the purpose of the <head> section in an HTML document?",
    "To contain metadata about the document, such as the page title and links to stylesheets.",
    ["To display the main content of the page", "To contain the footer of the page", "To define the layout of the page"],
    ["https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/The_head_metadata_in_HTML"]
  ),
  new Question(
    "What is an HTML tag?",
    "A keyword surrounded by angle brackets (< >) used to define elements in an HTML document.",
    ["A type of hyperlink", "A section of content within an HTML document", "A method for styling elements in an HTML document"],
    ["https://developer.mozilla.org/en-US/docs/Glossary/Tag"]
  ),
  new Question(
    "What is the difference between a block-level element and an inline element in HTML?",
    "Block-level elements start on a new line and take up the full width of the page, while inline elements are displayed inline with the surrounding content.",
    ["Block-level elements are used for images, while inline elements are used for text", "Inline elements are styled using CSS, while block-level elements are not", "Block-level elements can only be nested inside other block-level elements, while inline elements can be nested inside block-level elements"],
    ["https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements", "https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements"]
  ),
  new Question(
    "What is the purpose of the alt attribute in an image tag?",
    "To provide alternative text for users who are unable to view the image.",
    ["To define the size of the image", "To specify the file type of the image", "To add a caption to the image"],
    ["https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Images_in_HTML"]
  ),
  new Question(
    "How do you create a new object in JavaScript?",
    "You can create a new object using the object literal notation, or by using the Object() constructor function.",
    [    "You can create a new object using the array literal notation.",    "You can create a new object using the function constructor.",    "You can create a new object using the string literal notation."  ],
    ["https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Basics"]
  ),
  new Question(
    "What is a property of an object in JavaScript?",
    "A property is a key-value pair that defines a characteristic of the object.",
    [    "A property is a method of an object.",    "A property is a data type of an object.",    "A property is a string value of an object."  ],
    ["https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Basics"]
  ),
  new Question(
    "How do you access a property of an object in JavaScript?",
    "You can access a property of an object using the dot notation or the bracket notation.",
    [    "You can access a property of an object using the comma notation.",    "You can access a property of an object using the semicolon notation.",    "You can access a property of an object using the colon notation."  ],
    ["https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Basics"]
  ),
  new Question(
    "What is a method of an object in JavaScript?",
    "A method is a function that is a property of an object.",
    [    "A method is a data type of an object.",    "A method is a string value of an object.",    "A method is a number value of an object."  ],
    ["https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_methods"]
  ),
  new Question(
    "How do you add a new property to an object in JavaScript?",
    "You can add a new property to an object by assigning a value to a new key.",
    [    "You can add a new property to an object by removing an existing property.",    "You can add a new property to an object by creating a new object.",    "You can add a new property to an object by defining a new method."  ],
    ["https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Basics"]
  ),
  new Question(
    "What is Git?",
    "Git is a version control system that allows you to track changes to files over time.",
    [    "A software development methodology",    "A cloud-based storage system",    "A programming language"  ],
    [    "https://git-scm.com/",    "https://www.atlassian.com/git/tutorials/what-is-git"  ]
  ),
  
  new Question(
    "What is GitHub?",
    "GitHub is a web-based platform for version control and collaboration that utilizes Git.",
    [    "A programming language",    "A software development methodology",    "A cloud-based storage system"  ],
    [    "https://github.com/about",    "https://docs.github.com/en/github/getting-started-with-github/what-is-github"  ]
  ),
  
  new Question(
    "What is a repository on GitHub?",
    "A repository on GitHub is a place where code is stored, organized, and managed.",
    [    "A branch of development",    "A programming language",    "A physical server"  ],
    [    "https://docs.github.com/en/get-started/quickstart/create-a-repo",    "https://docs.github.com/en/get-started/quickstart/create-a-repo#about-repositories"  ]
  ),
  
  new Question(
    "What is a pull request?",
    "A pull request is a method of submitting contributions to a repository on GitHub.",
    [    "A request for help with code",    "A request to delete a repository",    "A request to clone a repository"  ],
    [    "https://docs.github.com/en/github/collaborating-with-pull-requests/about-pull-requests",    "https://www.atlassian.com/git/tutorials/making-a-pull-request"  ]
  ),
  
  new Question(
    "What is a merge conflict?",
    "A merge conflict occurs when two different changes are made to the same line or section of code, making it difficult to reconcile the changes.",
    [    "A conflict between team members",    "A problem with a repository",    "A dispute over code ownership"  ],
    [    "https://docs.github.com/en/github/collaborating-with-pull-requests/addressing-merge-conflicts/about-merge-conflicts",    "https://www.atlassian.com/git/tutorials/using-branches/merge-conflicts"  ]
  ),
  
  new Question(
    "What is a fork on GitHub?",
    "A fork on GitHub is a copy of a repository that allows you to experiment with changes without affecting the original codebase.",
    [    "A way to contribute to a repository",    "A way to delete a repository",    "A way to clone a repository"  ],
    [    "https://docs.github.com/en/github/getting-started-with-github/fork-a-repo",    "https://guides.github.com/activities/forking/"  ]
  ),
  
  new Question(
    "What is a branch on GitHub?",
    "A branch on GitHub is a parallel version of the codebase that allows you to make changes without affecting the main codebase.",
    [    "A copy of a repository",    "A server for hosting code",    "A version of the codebase"  ],
    [    "https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/about-branches",    "https://www.atlassian.com/git/tutorials/using-branches"  ]
  ),
  new Question(
    "What is Flexbox?",
    "A layout mode in CSS that arranges items in a one-dimensional line and provides alignment capabilities for its child elements.",
    ["A layout mode in CSS that arranges items in a two-dimensional grid", "A way to manipulate images in HTML", "A database language"],
    ["https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox"],
  ),
  
  new Question(
    "What is the difference between justify-content and align-items in Flexbox?",
    "justify-content aligns items along the main axis (horizontally by default), and align-items aligns items along the cross axis (vertically by default).",
    ["justify-content aligns items along the cross axis, and align-items aligns items along the main axis", "justify-content and align-items have the same functionality", "justify-content only works with block elements and align-items only works with inline elements"],
    ["https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox"],
  ),
  
  new Question(
    "What is Canvas?",
    "A drawing surface that allows for dynamic, scriptable rendering of 2D shapes and bitmap images.",
    ["A programming language", "A layout mode in CSS", "A database management system"],
    ["https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial"],
  ),
  
  new Question(
    "What is the purpose of the 'context' in Canvas?",
    "The context is the object that provides access to the methods and properties for drawing on the canvas.",
    ["The context is the area of the canvas that the drawing will be confined to", "The context is the background color of the canvas", "The context is the way that images are loaded onto the canvas"],
    ["https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D"],
  ),
  
  new Question(
    "What is Grid?",
    "A layout mode in CSS that provides a two-dimensional grid-based layout system, with rows and columns.",
    ["A layout mode in CSS that provides a one-dimensional line-based layout system", "A way to manipulate text in HTML", "A server-side scripting language"],
    ["https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout"],
  ),
  
  new Question(
    "What is the difference between grid-template-columns and grid-template-rows in Grid?",
    "grid-template-columns defines the number and size of columns in the grid, and grid-template-rows defines the number and size of rows in the grid.",
    ["grid-template-columns and grid-template-rows have the same functionality", "grid-template-columns defines the number and size of rows in the grid, and grid-template-rows defines the number and size of columns in the grid", "grid-template-columns and grid-template-rows define the same thing, but with different syntax"],
    ["https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns"],
  ),
  
  new Question(
    "What is the purpose of grid-gap in Grid?",
    "grid-gap sets the size of the gap (or gutter) between the rows and columns of the grid.",
    ["grid-gap sets the size of the columns and rows in the grid", "grid-gap sets the background color of the grid", "grid-gap sets the number of columns and rows in the grid"],
    ["https://developer.mozilla.org/en-US/docs/Web/CSS/gap"],
  ),

];

startQuiz();