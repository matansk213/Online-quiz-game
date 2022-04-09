const questions_url = "https://opentdb.com/api.php?amount=100";
const question = document.getElementById('question');
const choice3 = document.getElementById('multiplyChoice3');
const choice4 = document.getElementById('multiplyChoice4');
const scoreText = document.getElementById('score');
const progressText = document.getElementById('progressText');
const progressBarFull = document.getElementById('progressBarFull');
const timerText = document.getElementById('timerText');
const timerBarFull = document.getElementById('timerBarFull');

let choices = Array.from(document.getElementsByClassName('choice-text'));

const MAX_QUESTIONS = 10;
const CORRECT_SCORE = 10;
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];


let questions = [];

fetch(questions_url).then(res => res.json())
    .then((loadedQuestions) => {
        
        questions = loadedQuestions.results.map((loadedQuestion) => {
            
            const formattedQuestion = {question: loadedQuestion.question,
                                     type:loadedQuestion.type,
                                     category:loadedQuestion.category,
                                     difficulty:loadedQuestion.difficulty};

            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            const answerChoices = [...loadedQuestion.incorrect_answers];
            answerChoices.splice(formattedQuestion.answer - 1,0,loadedQuestion.correct_answer);
            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
                //choice(1-4) = one of the choices
            });
            return formattedQuestion;
        });
        startGame();
    })
    .catch((err) => {
        console.error(err);
    });


let counter;
let defualt_timer = 15;
let counterBar;
let defualt_timer_bar = 0;

function startGame() {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
    getNewQuestion();
}

function getNewQuestion(){
    clearInterval(counter);
    startTimer(defualt_timer);
    clearInterval(counterBar);
    startTimerBar(defualt_timer_bar);
    
    //no more questions/reach max questions
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign('End.html');
    }

    questionCounter++;
    
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    
    currentQuestion = availableQuesions[questionIndex];
    if(currentQuestion.type==="boolean"){
        choices.length = 2;
        choice3.style.display = "none";
        choice4.style.display = "none";
    }
    else{
        choices= Array.from(document.getElementsByClassName('choice-text'));
        choice3.style.display = "flex";
        choice4.style.display = "flex";
    }
    question.innerText =textReplacer(currentQuestion.question);

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerText = textReplacer(currentQuestion['choice' + number]);
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
}

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];
        const classToApply = (selectedAnswer == currentQuestion.answer) ? 'correct' : 'incorrect';
        
        if (classToApply === 'correct') incrementScore(CORRECT_SCORE);
        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 150);
    });
});

function incrementScore(num){
    score += num;
    scoreText.innerText = score;
}

function textReplacer(clearString){
    return clearString
    .replace(/&amp;/g, '&')
    .replace(/&rsquo;/g, "`")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&eacute;/g, "é")
    .replace(/&oacute;/g, "ó")
    .replace(/&uuml;/g, "ü")
    .replace(/&ouml;/g, "ö")
    .replace(/&rdquo;/g, "”")
    .replace(/&ldquo/g, "“");
}

function startTimer(time){
    counter = setInterval(timer, 1000);
    function timer(){
        timerText.textContent = `Time Left ${time}`;
        time--;
        if(time<0){
            timerText.textContent = `Time Left 0`;
        }
        if(time<(-1)){
            getNewQuestion();
        }
    }
}

function startTimerBar(time){
    counterBar = setInterval(timer, 16.5);
    timerBarFull.style.background="#3E7C17"
    function timer(){
        time+=0.1;
        timerBarFull.style.width = time+"%";
        if(time>40){
            timerBarFull.style.background="#F3950D"
        }
        if(time>70){
            timerBarFull.style.background="#CD1818"
        }
        if(time>100){
            clearInterval(counterBar);
        }
    }
}

