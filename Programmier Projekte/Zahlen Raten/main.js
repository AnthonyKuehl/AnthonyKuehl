let zahl = 0;
let versuche = 0;
let random = Math.floor( Math.random() * 10 + 1 );
let zahlanzeige = document.getElementById('zahl');
zahlanzeige.innerHTML = zahl;

function up() {
    zahlanzeige.innerHTML = zahl;
    zahlanzeige.style.fontSize = '125px';
    zahlanzeige.style.color = 'black';
    if(zahl > 10) {
        zahlanzeige.innerHTML= 'Denke daran die Zahl ist zwischen 1 und 10!';
        zahlanzeige.style.fontSize = '50px';
    } else {
        zahl++;
    }
}

function down() {
    zahl--;
    zahlanzeige.innerHTML = zahl;
    zahlanzeige.style.fontSize = '125px';
    zahlanzeige.style.color = 'black';
}

function restart() {
    location.reload();
}

function bestätigen() {
    if(zahl === random) {
        versuche++;
        zahlanzeige.innerHTML = 'Du hast Die Zahl herausgefunden! Mache es nochmal du Profi!(Drücke auf neu laden) Du hast ' + versuche + ' versuche gebraucht.';
        zahlanzeige.style.fontSize = '50px';
        zahlanzeige.style.color = 'blue';
        document.getElementById('up').style.display = 'none';
        document.getElementById('down').style.display = 'none';
        document.getElementById('bestätigen').style.display = 'none';
        let btn = document.getElementById('restart');
        btn.className = 'btn_restart';
        btn.removeClass('btn_restart_before'); 
    } else {
        zahlanzeige.innerHTML = 'Leider Falsch versuche es weiter';
        zahlanzeige.style.color = 'red';
        zahlanzeige.style.fontSize = '50px';
        versuche++;
    }
}