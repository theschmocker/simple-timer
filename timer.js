// global time variables
let seconds = 0;
let minutes = 0;
let hours = 0;


// interval return values
let timer;
let alarmInterval;

// timer state variables
let timerIsOn = false;
let timerIsPaused = false;
let alarmIsOn = false;

// alarm sound
let alarmAudio = new Audio('alarms/horn.mp3');

// timer background
const timerBackground = document.querySelector('.container');

// get display span elements
const hoursDisplay = document.querySelectorAll('span')[0];
const minutesDisplay = document.querySelectorAll('span')[1];
const secondsDisplay = document.querySelectorAll('span')[2];


// get incremental buttons
const secondsUp = document.querySelector('#seconds-up');
const secondsDown = document.querySelector('#seconds-down');

const minutesUp = document.querySelector('#minutes-up');
const minutesDown = document.querySelector('#minutes-down');

const hoursUp = document.querySelector('#hours-up');
const hoursDown = document.querySelector('#hours-down');

// get control buttons
const startStopButton = document.querySelector('#startstop');
const resetButton = document.querySelector('#reset');

// event listeners for up and down buttons
// disallow values of range
secondsUp.addEventListener('click', function(){
    if (seconds < 59  && !timerIsOn && !alarmIsOn){
        incrementSeconds(1);
    }
    updateDisplay(secondsDisplay, seconds)
});
secondsDown.addEventListener('click', function(){
    if (seconds > 0  && !timerIsOn && !alarmIsOn){
        incrementSeconds(-1);
    }
    updateDisplay(secondsDisplay, seconds)
});

minutesUp.addEventListener('click', function(){
    if (minutes < 59  && !timerIsOn && !alarmIsOn){
        incrementMinutes(1);
    }
    updateDisplay(minutesDisplay, minutes)
});
minutesDown.addEventListener('click', function(){
    if (minutes > 0  && !timerIsOn && !alarmIsOn){
        incrementMinutes(-1);
    }
    updateDisplay(minutesDisplay, minutes)
});

hoursUp.addEventListener('click', function(){
    if (hours < 99 && !timerIsOn && !alarmIsOn){
        incrementHours(1);
    }
    updateDisplay(hoursDisplay, hours)
});
hoursDown.addEventListener('click', function(){
    if (hours > 0 && !timerIsOn && !alarmIsOn){
        incrementHours(-1);
    }
    updateDisplay(hoursDisplay, hours)
});

// control button event listeners
startStopButton.addEventListener('click', function() {
    if (timerIsOn) {
        pauseTimer();
    } else if (alarmIsOn) {
        stopAlarm();
    } else {
        startTimer();
    }

});

resetButton.addEventListener('click', resetTimer);

// functions for changing global time variables
// (probably unnecessary)
function incrementHours(num) {
    hours += num;
}
function incrementMinutes(num) {
    minutes += num;
}
function incrementSeconds(num) {
    seconds += num;
}

// update display span in two digit format
function updateDisplay(displayElement, time) {
    if (String(time).length < 2) {
        displayElement.textContent = '0' + time
    } else {
        displayElement.textContent = time;
    }
}

function setDisplayEditMode(bool) {
    secondsDisplay.setAttribute('contenteditable', String(bool));
    minutesDisplay.setAttribute('contenteditable', String(bool));
    hoursDisplay.setAttribute('contenteditable', String(bool));
}

//timer functionality

function startTimer() {
    timerIsPaused = false;
    timerIsOn = true;
    setDisplayEditMode(false);
    startStopButton.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';

    // actual clock function and logic
    // applied to global timer variable so clearInterval() can be called on it later
    timer = setInterval( function () {
        // determine whether or not there's time left on the clock
        if (!(seconds === 0 && minutes === 0 && hours === 0)) {
            incrementSeconds(-1);
        } else {    // if not, alarm()
            alarm();
            return;
        }

        // handle minute change as clock rolls over on seconds
        if (minutes >= 0 && seconds < 0) {
            incrementMinutes(-1);
            seconds = 59;
        }

        //handle hour change
        if (hours > 0 && minutes < 0) {
            incrementHours(-1);
            minutes = 59;
        }

        updateDisplay(secondsDisplay, seconds);
        updateDisplay(minutesDisplay, minutes);
        updateDisplay(hoursDisplay, hours);

    }, 1000); // runs every second, because it's a clock
}

function pauseTimer() {
    startStopButton.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
    timerIsPaused = true;
    timerIsOn = false;
    clearInterval(timer);
    setDisplayEditMode(true);
}

function resetTimer() {
    if (!timerIsOn) {
        hours = 0;
        minutes = 0;
        seconds = 0;
        timerIsPaused = false;
    }
    updateDisplay(secondsDisplay, seconds);
    updateDisplay(minutesDisplay, minutes);
    updateDisplay(hoursDisplay, hours);
}

function alarm() {
    alarmIsOn = true;

    timerBackground.classList.add('alarm');

    alarmAudio.currentTime = 1.5;
    alarmAudio.play();
    alarmAudio.addEventListener('ended', function () {
        alarmAudio.currentTime = 5.95;
        alarmAudio.play();
    });

    timerIsPaused = false;
    timerIsOn = false;
    startStopButton.innerHTML = '<i class="fa fa-stop" aria-hidden="true"></i>';

    clearInterval(timer);
    setDisplayEditMode(true);
}

function stopAlarm() {
    alarmIsOn = false;
    alarmAudio.pause();

    timerBackground.classList.remove('alarm');
    startStopButton.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
}

setDisplayEditMode(true);
