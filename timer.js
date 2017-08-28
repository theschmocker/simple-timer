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

const displays = [hoursDisplay, minutesDisplay, secondsDisplay];


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

displays.forEach(display => {
    display.addEventListener('keydown', function(e) {
        if ((display.textContent.length >= 2 || e.keyCode > 58) && e.keyCode !== 8) {
            e.preventDefault();
        }
        if (e.keyCode === 13) {
            e.preventDefault();
            this.blur();
        }

    });
    display.addEventListener('focus', function() {
        if(Boolean(this.attributes.contenteditable)) {
            let selection = window.getSelection();
            let range = document.createRange();
            range.selectNodeContents(this);
            selection.removeAllRanges();
            selection.addRange(range);
            selection.deleteFromDocument();
        }
    });
    display.addEventListener('blur', function() {
        let time = (display.textContent === '')? 0 : Number(display.textContent);

        switch (display) {
            case hoursDisplay:
                hours = time;
                break;
            case minutesDisplay:
                if (time > 59) {
                    hours += Math.floor(time / 60);
                    time -= 60;
                }
                minutes = time;
                break;
            case secondsDisplay:
                if (time > 59) {
                    minutes += Math.floor(time / 60);
                    time -= 60;
                }
                seconds = time;
                break;
            default:
                break;
        }

        updateDisplay(hoursDisplay, hours);
        updateDisplay(minutesDisplay, minutes);
        updateDisplay(secondsDisplay, seconds);
    });
});

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

// will be used to allow setting timer with direct input
function setDisplayEditMode(bool) {
    displays.forEach(display => {
        display.setAttribute('contenteditable', String(bool));
    });
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
    // set state
    timerIsPaused = true;
    timerIsOn = false;
    setDisplayEditMode(true);

    // update startStopButton
    startStopButton.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';

    // pause the timer
    clearInterval(timer);
}

function resetTimer() {
    // if timer is off, set state to 0
    if (!timerIsOn) {
        hours = 0;
        minutes = 0;
        seconds = 0;
        timerIsPaused = false;
    }

    // reset display
    updateDisplay(secondsDisplay, seconds);
    updateDisplay(minutesDisplay, minutes);
    updateDisplay(hoursDisplay, hours);
}

function alarm() {
    // set state
    alarmIsOn = true;
    timerIsPaused = false;
    timerIsOn = false;
    setDisplayEditMode(true);

    // changed the timer's background color during alarm
    timerBackground.classList.add('alarm');

    // start audio at 1.5s (too quiet before that)
    alarmAudio.currentTime = 1.5;

    // play full alarm once through
    alarmAudio.play();

    // listens for the end of the alarm
    alarmAudio.addEventListener('ended', function () {
        // then plays from the given time
        alarmAudio.currentTime = 5.95;
        alarmAudio.play();
    }); // repeat

    // change startStopButton's symbol to stop
    startStopButton.innerHTML = '<i class="fa fa-stop" aria-hidden="true"></i>';

    // stop timer
    clearInterval(timer);
}

function stopAlarm() {
    // set state
    alarmIsOn = false;

    // stop audio
    alarmAudio.pause();

    // reset background to default
    timerBackground.classList.remove('alarm');

    // reset startStopButton to play
    startStopButton.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
}

// set contenteditable on displays on page load
setDisplayEditMode(true);
