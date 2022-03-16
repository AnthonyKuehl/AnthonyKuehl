window.onload = function () {
    // Die folgende Zeile versetzt JavaScript in den "Strict Mode". Dadurch zwingt es dich,
    // sauberen Code zu schreiben. Ohne diese Zeile versucht JavaScript bei Fehlern zu erraten,
    // was du gemeint hast. Das führt aber oft zu Fehlern. Daher solltest du immer den "Strict Mode"
    // einschalten, um Fehler schnell zu entdecken. Mehr zum "Strict Mode" kannst du unter
    // http://www.w3schools.com/js/js_strict.asp nachlesen.
    "use strict";

    // Globale Variablen anlegen. Das entspricht in etwa den Variablen,
    // die du aus Scratch kennst.
    var spielfeld = [],
        elemente = [],
        svg = new Snap("#svg"),
        spielerSpalteIndex,
        spielerZeileIndex,
        zielSpalteIndex,
        zielZeileIndex,
        spieler,
        ziel,
        sekundenProSchritt = 0.2,
        sekundenAnlauf = 0.3,
        sekundenStoss = 0.1,
        anzahlBewegungen = 0;

    function variablenFuerSpielfeldSetzen() {
        // Lösche alle vorhandenen Zeilen im Spielfeld
        // Mehr zur Funktion "splice" findest du unter 
        // http://www.w3schools.com/jsref/jsref_splice.asp
        spielfeld.splice(0, spielfeld.length);

        // Füge Zeilen des Labyrinth hinzu. "M" steht für "Mauer", 
        // ein zerstörbares Element. "B" steht für "Beton", 
        // ein unzerstörbares Element. "O" ist ein Platzhalter 
        // für ein leeres Feld.
        spielfeld.push("MMMMMMMMMMMMMMMO");
        spielfeld.push("OOMMOBMBOOMMMMMM");
        spielfeld.push("MOMOOOOOOMBMOOBM");
        spielfeld.push("MMMMMMMOMMOOOBMM");
        spielfeld.push("MOOOOOOOOBMMMBBM");
        spielfeld.push("MBMMBMMBBMMBBOOM");
        spielfeld.push("MMOOOOOBOMOOMMOB");
        spielfeld.push("MOOBMMMOOMMOOOBM");
        spielfeld.push("BMMMMBBOMBOOMMMM");
        spielfeld.push("MBBBBOMMMMBMMOOM");
        spielfeld.push("MOMMOOBMOOOMOOOM");
        spielfeld.push("MMMMMMMMMMMMBBBB");

        // Positionen für Spieler und Ziel festlegen
        spielerSpalteIndex = 1;
        spielerZeileIndex = 2;
        zielSpalteIndex = 1;
        zielZeileIndex = 10;
    }

    function erzeugeClone(aktuellesFeld, spalteIndex, zeileIndex) {
        var aussehen,
            element;
        if (aktuellesFeld === "M") {
            // Mauer -> dunkles Grau
            aussehen = { fill: '#373737' };
        } else {
            // Beton -> Rot
            aussehen = { fill: '#ff3838' };
        }

        // Labyrinthelement hinzufügen
        element = svg.rect(spalteIndex * 30, zeileIndex * 30, 30, 30)
            .attr(aussehen)
            .data({ spalteIndex: spalteIndex, zeileIndex: zeileIndex });

        // In Scratch musst du dich nicht um das Verwalten der Klone kümmern. Scratch
        // macht das für dich. In JavaScript müssen wir alle erstellten Klone selbst
        // speichern, damit wir später wieder auf sie zugreifen können.
        elemente.push(element);
    }

    // Labyrinth auf Basis des Inhalts der Variable "spielfeld" aufbauen
    function baueSpielfeld() {
        var zeileIndex,
            spalteIndex,
            aktuellesFeld;
        for (zeileIndex = 0; zeileIndex < 12; zeileIndex++) {
            for (spalteIndex = 0; spalteIndex < 16; spalteIndex++) {
                aktuellesFeld = spielfeld[zeileIndex][spalteIndex];
                if (aktuellesFeld === "M" || aktuellesFeld === "B") {
                    erzeugeClone(aktuellesFeld, spalteIndex, zeileIndex);
                }
            }
        }
    }

    function zerstoere(zerstoereZeileIndex, zerstoereSpalteIndex) {
        var index,
            neueLabyrinthZeile,
            aktuelleZeile,
            aktuelleSpalteIndex;

        // In Scratch kann man mit "Sende ... an alle" ganz einfach eine Nachricht an alle
        // Klone aller Figuren schicken. So etwas gibt es in JavaScript nicht. Wir müssen
        // selbst in einer Schleife alle Klone der Labyrinthelemente durchgehen. Genau das
        // macht die folgende Schleife.
        for (index = 0; index < elemente.length; index++) {
            if (elemente[index].data("spalteIndex") === zerstoereSpalteIndex && elemente[index].data("zeileIndex") === zerstoereZeileIndex) {
                // Die Variable wird hier bewusst auf einen leeren Inhalt gesetzt
                neueLabyrinthZeile = "";
                aktuelleZeile = spielfeld[zerstoereZeileIndex];
                
                // Wir kopieren die Labyrinthzeile, in der das zu zerstörende Element enthalten ist. 
                // Alle Elemente werden unverändert kopiert, nur das zu zerstörende Element nicht.
                for (aktuelleSpalteIndex = 0; aktuelleSpalteIndex < 16; aktuelleSpalteIndex++) {
                    if (aktuelleSpalteIndex === zerstoereSpalteIndex) {
                        neueLabyrinthZeile += "O";
                    } else {
                        neueLabyrinthZeile += aktuelleZeile[aktuelleSpalteIndex];
                    }
                }

                // JavaScript hat eine Funktion, die Scratch nicht hat: "substring". Sie gibt dir einen
                // Teil einer Texts zurück. Damit könnte man die gesamte, oben gezeigte Schleife, durch
                // eine einzige Zeile ersetzen. Mehr über substring findest du unter
                // http://www.w3schools.com/jsref/jsref_substring.asp
                ////neueLabyrinthZeile = aktuelleZeile.substring(0, zerstoereSpalteIndex) + "O" +
                ////    aktuelleZeile.substring(zerstoereSpalteIndex + 1);

                spielfeld.splice(zerstoereZeileIndex, 1, neueLabyrinthZeile);
                
                elemente[index].remove();
            }
        }
    }

    // Ermittle das Element im Spielfeld an der angegebenen Position
    function ermittleSpielfeldelement(zeile, spalte) {
        return spielfeld[zeile][spalte];
    }

    // Bewege den Spieler zur angegebenen Position in der angegebenen Zeit.
    function aktualisiereSpielerposition(zeile, spalte, sekunden, next) {
        var transformation = "t" + (spalte * 30 + 15).toString() + "," + (zeile * 30 + 15).toString();
        spieler.animate({ transform: transformation }, sekunden * 1000, next);
    }

    // Führe eine vertikale Bewegung (oben/unten) durch
    function bewegeVertikal(bewegung) {
        var aktuellesFeld;

        // Stelle sicher, dass sich der Spieler nicht aus den Grenzen des Labyrinths bewegt (wir haben 12 Zeilen)
        if (spielerZeileIndex + bewegung >= 0 && spielerZeileIndex + bewegung < 12) {
            aktuellesFeld = ermittleSpielfeldelement(spielerZeileIndex + bewegung, spielerSpalteIndex);
            if (aktuellesFeld === "O") {
                // Das Zielfeld ist leer, der Spieler kann sich hin bewegen
                anzahlBewegungen++;
                spielerZeileIndex += bewegung;
                aktualisiereSpielerposition(spielerZeileIndex, spielerSpalteIndex, sekundenProSchritt);
            } else {
                if (aktuellesFeld === "M") {
                    // Das Zielfeld enthält ein Element, das zerstörbar ist
                    aktuellesFeld = ermittleSpielfeldelement(spielerZeileIndex + bewegung * (-1), spielerSpalteIndex);
                    if (aktuellesFeld === "O") {
                        // Es ist Platz, dass der Spieler Anlauf nehmen kann
                        anzahlBewegungen++;
                        aktualisiereSpielerposition(spielerZeileIndex + bewegung * (-1), spielerSpalteIndex, sekundenAnlauf, function () {
                            aktualisiereSpielerposition(spielerZeileIndex, spielerSpalteIndex, sekundenStoss, function () {
                                zerstoere(spielerZeileIndex + bewegung, spielerSpalteIndex);
                            });
                        });
                    }
                }
            }
        }
    }

    // Führe eine horizonale Bewegung (links/rechts) durch
    function bewegeHorizontal(bewegung) {
        var aktuellesFeld;

        // Stelle sicher, dass sich der Spieler nicht aus den Grenzen des Labyrinths bewegt (wir haben 16 Spalten)
        if (spielerSpalteIndex + bewegung >= 0 && spielerSpalteIndex + bewegung < 16) {
            aktuellesFeld = ermittleSpielfeldelement(spielerZeileIndex, spielerSpalteIndex + bewegung);
            if (aktuellesFeld === "O") {
                // Das Zielfeld ist leer, der Spieler kann sich hin bewegen
                anzahlBewegungen++;
                spielerSpalteIndex += bewegung;
                aktualisiereSpielerposition(spielerZeileIndex, spielerSpalteIndex, sekundenProSchritt);
            } else {
                if (aktuellesFeld === "M") {
                    // Das Zielfeld enthält ein Element, das zerstörbar ist
                    aktuellesFeld = ermittleSpielfeldelement(spielerZeileIndex, spielerSpalteIndex + bewegung * (-1));
                    if (aktuellesFeld === "O") {
                        // Es ist Platz, dass der Spieler Anlauf nehmen kann
                        anzahlBewegungen++;
                        aktualisiereSpielerposition(spielerZeileIndex, spielerSpalteIndex + bewegung * (-1), sekundenAnlauf, function () {
                            aktualisiereSpielerposition(spielerZeileIndex, spielerSpalteIndex, sekundenStoss, function () {
                                zerstoere(spielerZeileIndex, spielerSpalteIndex + bewegung);
                            });
                        });
                    }
                }
            }
        }
    }

    function spielstart() {
        var transformation;

        // Positioniere Spieler
        spieler = svg.ellipse(0, 0, 15, 15).attr({ fill: '#5d9eff' });
        transformation = "t" + (30 + spielerSpalteIndex * 30 - 15).toString() + "," + (30 + spielerZeileIndex * 30 - 15).toString();
        spieler.transform(transformation);

        // Positioniere Ziel
        ziel = svg.g();
        ziel.add(svg.line(1, 1, 29, 29).attr({ stroke: "#373737", strokeWidth: 2, strokeLinecap: "round" }));
        ziel.add(svg.line(29, 1, 1, 29).attr({ stroke: "#373737", strokeWidth: 2, strokeLinecap: "round" }));
        transformation = "t" + (zielSpalteIndex * 30).toString() + "," + (zielZeileIndex * 30).toString();
        ziel.transform(transformation);

        document.onkeydown = function (evt) {
            // Reagiere auf Tastendruck
            evt = evt || window.event;
            if (evt.keyCode === 39) {
                // Nach rechts
                bewegeHorizontal(1);
            } else if (evt.keyCode === 37) {
                // Nach links
                bewegeHorizontal(-1);
            } else if (evt.keyCode === 40) {
                // Nach unten
                bewegeVertikal(1);
            } else if (evt.keyCode === 38) {
                // Nach oben
                bewegeVertikal(-1);
            }

            if (spielerSpalteIndex === zielSpalteIndex && spielerZeileIndex === zielZeileIndex) {
                svg.rect(0, 0, 480, 360).attr({ fill: 'white', opacity: 0.75 });
                svg.text(240, 180, "Geschafft! Du hast " + anzahlBewegungen.toString() + " Bewegungen gebraucht")
                    .attr({ fontFamily: 'sans-serif', fontSize: '20px', "text-anchor": "middle" });
            }
        };
    }

    variablenFuerSpielfeldSetzen();
    baueSpielfeld();
    spielstart();
};
