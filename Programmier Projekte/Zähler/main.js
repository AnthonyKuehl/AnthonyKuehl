"use strict";
let zahl = 0;
let zahlanzeige = document.getElementById('zahl');
let limit = 50;
let limit2 = 100;
console.log(zahl);
zahlanzeige.innerHTML = zahl;

function nextLevel() {
    zahlanzeige.innerHTML = 'Du hast alle Level geschafft. Weitere Level folgen in kürze.';
    zahlanzeige.style.fontSize = '75px';
    document.getElementById('up').style.display = 'none';
    document.getElementById('down').style.display = 'none';
}

function firstLevel() {
    zahlanzeige.innerHTML = 'Du hast Level 1 geschafft. Weiter geht´s bis 100.';
    zahlanzeige.style.fontSize = '75px';
    document.getElementById('up').style.display = 'none';
    document.getElementById('down').style.display = 'none';
    document.getElementById('reset').innerHTML = 'Weiter';
    limit = 150;

}

function up() {
    zahl++;
    zahlanzeige.innerHTML = zahl;
    if (zahl == limit2) {
        nextLevel();
    } else if (zahl == limit) {
        firstLevel();
    }
}

function down() {
    zahl--;
    zahlanzeige.innerHTML = zahl;
}

function reset() {
    zahl = 0;
    zahlanzeige.style.fontSize = '125px';
    zahlanzeige.innerHTML = zahl;
    document.getElementById('up').style.display = 'inline-block';
    document.getElementById('down').style.display = 'inline-block';
    document.getElementById('reset').innerHTML = 'Reset';
}
