// global time variables
let seconds = 0;
let minutes = 0;
let hours = 0;


// timer interval
let timer;

// time function state
let timerIsOn = false;
let timerIsPaused = false;

// alarm sound
let alarmAudio = document.querySelector('audio');

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
    if (seconds < 59  && !timerIsOn){
        incrementSeconds(1);
    }
    updateSecondsDisplay()
});
secondsDown.addEventListener('click', function(){
    if (seconds > 0  && !timerIsOn){
        incrementSeconds(-1);
    }
    updateSecondsDisplay()
});

minutesUp.addEventListener('click', function(){
    if (minutes < 59  && !timerIsOn){
        incrementMinutes(1);
    }
    updateMinutesDisplay()
});
minutesDown.addEventListener('click', function(){
    if (minutes > 0  && !timerIsOn){
        incrementMinutes(-1);
    }
    updateMinutesDisplay()
});

hoursUp.addEventListener('click', function(){
    if (hours < 99 && !timerIsOn){
        incrementHours(1);
    }
    updateHoursDisplay();
});
hoursDown.addEventListener('click', function(){
    if (hours > 0 && !timerIsOn){
        incrementHours(-1);
    }
    updateHoursDisplay();
});

// control button event listeners
startStopButton.addEventListener('click', function() {
    if (timerIsOn) {
        pauseTimer();
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

// functions to update the displays spans according to time variables
// want to DRY this out more
function updateHoursDisplay() {
    if (String(hours).length < 2) {
        //maintain two-digit format on clock
        hoursDisplay.textContent = '0' + hours;
    } else {
        hoursDisplay.textContent = hours;
    }
}
function updateMinutesDisplay(time) {
    if (String(minutes).length < 2) {
        minutesDisplay.textContent = '0' + minutes;
    } else {
        minutesDisplay.textContent = minutes;
    }
}
function updateSecondsDisplay() {
    if (String(seconds).length < 2) {
        secondsDisplay.textContent = '0' + seconds;
    } else {
        secondsDisplay.textContent = seconds;
    }
}

//timer functionality

function startTimer() {
    timerIsPaused = false;
    timerIsOn = true;
    startStopButton.textContent = 'Pause';

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

        updateSecondsDisplay();
        updateMinutesDisplay();
        updateHoursDisplay();

    }, 1000); // runs every second, because it's a clock
}

function pauseTimer() {
    startStopButton.textContent = 'Start';
    timerIsPaused = true;
    timerIsOn = false;
    clearInterval(timer);
}

function resetTimer() {
    if (!timerIsOn) {
        hours = 0;
        minutes = 0;
        seconds = 0;
        timerIsPaused = false;
    }
    updateSecondsDisplay();
    updateMinutesDisplay();
    updateHoursDisplay();
}

function alarm() {
    //this will actually play sound at some point
    alarmAudio.play();

    timerIsPaused = false;
    timerIsOn = false;
    startStopButton.textContent = 'Start';

    clearInterval(timer);
}
