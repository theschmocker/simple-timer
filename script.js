const body = document.querySelector('body');

function setHeight() {
    body.style.height = window.innerHeight + "px";
}

setHeight();

window.addEventListener('resize', setHeight);
