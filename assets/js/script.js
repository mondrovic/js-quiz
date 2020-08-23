//timer variables
var timerEl = document.getElementById("timer");
var timeRem = 75;
var timerInterval;

//create variables for HTML elements
var qTitle = document.getElementById("Question");
var choice1El = document.getElementById("btn1");
var choice2El = document.getElementById("btn2");
var choice3El = document.getElementById("btn3");
var choice4El = document.getElementById("btn4");
var takeQEl = document.getElementById("quizBody");

//scoring elements
var finScoreEl = document.getElementById("finalScore");
var startQuizEl = document.getElementById("startQuiz");
var resultEl = document.getElementById("result");
var quizComp = document.getElementById("quizComplete");
var scoreEl = document.getElementById("scoreValue");

// keeps track of scores and questions
var questionId = 0;
var answerCheck = false;
var totalQuestions = 0;
var correctAnswer = 0;
var finalScore = 0;
var finalQCheck = false;

var buttonChecker = function(event){
    var element = event.target;
    console.log(element)

    if (element.matches("button")) {  
      resultEl.textContent = element.getAttribute("data-answered");
      resultEl.style.color = "red";

      if (element.getAttribute("data-answered") === "Correct") {
        answerCheck = true;
        resultEl.style.color = "green";
        correctAnswer++;
      } else {
        // penalize for wrong answer
        timeRem -= 10;
        checkTimeRemaining();  
      }

      // load next qeustion
      questionId++;
      loadQuestion();
    }
}


// function to load questions
var loadQuestion = function(){
    var indexer = -10;
    if (questions[questionId] === undefined) {

        // end of array
        finalQCheck = true;

        // disable quiz for end of file
        disableQuiz();
        return;
    }

    //checks for correct answer and adds to correct answer total
    var correctAnswer = questions[questionId].answer;
    totalQuestions++;

    qTitle.textContent = questions[questionId].title;

    for (i = 0; i < questions[questionId].choices.length; i++) {
        if (questions[questionId].choices[i] === correctAnswer) {
            indexer = i;
        }
    }

    // presents choices
    choice1El.textContent = questions[questionId].choices[0];
    choice2El.textContent = questions[questionId].choices[1];
    choice3El.textContent = questions[questionId].choices[2];
    choice4El.textContent = questions[questionId].choices[3];

    // 3 choices for incorrect answer so use set attribute
    choice1El.setAttribute("data-answered", "Incorrect");
    choice2El.setAttribute("data-answered", "Incorrect");
    choice3El.setAttribute("data-answered", "Incorrect");
    choice4El.setAttribute("data-answered", "Incorrect");

    // only one option is correct so switch can work here
    switch (indexer) {
    case 0:
        choice1El.setAttribute("data-answered", "Correct");
        break;
    case 1:
        choice2El.setAttribute("data-answered", "Correct");
        break;
    case 2:
        choice3El.setAttribute("data-answered", "Correct");
        break;
    case 3:
        choice4El.setAttribute("data-answered", "Correct");
        break;
    }
}

// function to set timer and update timer on HTML
var setTime = function(){
    timerInterval = setInterval(function (){
    timeRem--;

    if (!timeRem > 0) {
        timeRem = 0;
    }

    timerEl.textContent = "Time: " + timeRem.toString();

    checkTimeRemaining();
    }, 1000);
}

// function to check remaining time to call end game if timer reaches 0
var checkTimeRemaining = function(){

    if (timeRem <= 0 || finalQCheck) {
        disableQuiz();
        clearInterval(timerInterval);

        showFinalScore();
    }
}

// final scoring function 
var showFinalScore = function(){

    // hide the main section and the quiz section
    takeQEl.classList.add("d-none")

    // startQuizEl.classList.add("d-none");
    finScoreEl.classList.remove("d-none");
    document.getElementById("quizComplete").textContent = "All done!";

    if (!timeRem > 0) {
        timeRem = 0;
    }

    finalScore = 0;

    if (correctAnswer > 0) {
        finalScore = Math.round(100 * (correctAnswer / totalQuestions) + timeRem);
    }

    document.getElementById("scoreValue").textContent = "Your score is " + finalScore;
}


var quizBody = function(){

    questionId = 0;
    loadQuestion();

    // hides intro page to start quiz
    startQuizEl.classList.add("d-none");
    // shows quiz body after intro is hidden
    takeQEl.classList.remove("d-none");

    //  start timer 
    setTime();  
}

//removes items from quiz
var disableQuiz = function(){
  choice1El.disabled = true;
  choice1El.classList.remove("btn-primary");
  choice1El.classList.add("btn-secondary");
  choice2El.disabled = true;
  choice2El.classList.remove("btn-primary");
  choice2El.classList.add("btn-secondary");
  choice3El.disabled = true;
  choice3El.classList.remove("btn-primary");
  choice3El.classList.add("btn-secondary");
  choice4El.disabled = true;
  choice4El.classList.remove("btn-primary");
  choice4El.classList.add("btn-secondary");
}

//starts the game
document.querySelector("#btnStartQuiz").onclick = function (event){
    quizBody();
}

//local storage to save high scores to HTML page
document.querySelector("#submitBtn").onclick = function (event) {

    //Don't allow user to click submit if they haven't entered initials by seeing if there's any length
    if (document.getElementById("userInitials").value === ""){
        alert("Field cannot be empty.");
        return;    
    }

    savedScores = JSON.parse(localStorage.getItem('highscores'));

    //   runs as long as scores has a value; 
    if (savedScores !== null) {
        
        // pushes high score with initials to array
        savedScores.push({
            'initials': document.getElementById("userInitials").value,
            'highscore': finalScore
        });
    } else { //creates empty list since no scores existed
        savedScores = [];
        savedScores.push({
            'initials': document.getElementById("userInitials").value,
            'highscore': finalScore
        });
    }

    // saves to local storage
    localStorage.setItem('highscores', JSON.stringify(savedScores));

    // removes and disables submit button
    document.getElementById("submitBtn").disabled = true;
    document.getElementById("submitBtn").remove("btn-primary");

    // use class list instead of class name since multiple bootstrap classes
    finScoreEl.classList.add("d-none");
    document.location.href= "index.html";

}

takeQEl.addEventListener("click", buttonChecker);

