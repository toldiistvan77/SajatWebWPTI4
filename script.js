// ===== TIC-TAC-TOE: te vagy az X, a gép az O =====

var cellak = document.querySelectorAll("#tabla button");
var uzenet = document.getElementById("uzenet");
var ujJatek = document.getElementById("ujjatek");

var tabla = ["", "", "", "", "", "", "", "", ""];   // a 9 mező tartalma
var vege = false;                                   // véget ért a játék?

// Ezek a nyerő sorok (a mezők sorszáma 0-tól 8-ig)
var nyeroSorok = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],   // vízszintesen
  [0, 3, 6], [1, 4, 7], [2, 5, 8],   // függőlegesen
  [0, 4, 8], [2, 4, 6]               // átlósan
];

// Megnézi, nyert-e valaki. Visszaadja az "X" vagy "O" betűt, "dontetlen"-t, vagy "" ha még megy a játék.
function eredmeny() {
  for (var i = 0; i < nyeroSorok.length; i++) {
    var a = nyeroSorok[i][0];
    var b = nyeroSorok[i][1];
    var c = nyeroSorok[i][2];
    if (tabla[a] !== "" && tabla[a] === tabla[b] && tabla[a] === tabla[c]) {
      return tabla[a];
    }
  }
  if (tabla.indexOf("") === -1) {
    return "dontetlen";
  }
  return "";
}

function frissit() {
  for (var i = 0; i < 9; i++) {
    cellak[i].textContent = tabla[i];
  }
}

function veletlenMezo() {
  // A gép véletlenszerűen választ az üres mezők közül
  var uresek = [];
  for (var i = 0; i < 9; i++) {
    if (tabla[i] === "") {
      uresek.push(i);
    }
  }
  var veletlen = Math.floor(Math.random() * uresek.length);
  return uresek[veletlen];
}

function vegeEllenorzes() {
  var e = eredmeny();
  if (e === "X") {
    uzenet.textContent = "Nyertél! Gratulálok!";
  } else if (e === "O") {
    uzenet.textContent = "A gép nyert. Próbáld újra!";
  } else if (e === "dontetlen") {
    uzenet.textContent = "Döntetlen.";
  } else {
    return false;
  }
  vege = true;
  return true;
}

function kattintas(szam) {
  if (vege || tabla[szam] !== "") {
    return;   // foglalt mezőre vagy játék végén nem történik semmi
  }

  // 1. Te lépsz
  tabla[szam] = "X";
  frissit();
  if (vegeEllenorzes()) {
    return;
  }

  // 2. A gép lép egy kis várakozás után
  uzenet.textContent = "A gép gondolkodik...";
  setTimeout(function () {
    tabla[veletlenMezo()] = "O";
    frissit();
    if (!vegeEllenorzes()) {
      uzenet.textContent = "Te jössz (X).";
    }
  }, 500);
}

function ujra() {
  tabla = ["", "", "", "", "", "", "", "", ""];
  vege = false;
  frissit();
  uzenet.textContent = "Te kezdesz (X).";
}

// Mezők és gomb összekötése
for (var i = 0; i < 9; i++) {
  (function (szam) {
    cellak[szam].addEventListener("click", function () {
      kattintas(szam);
    });
  })(i);
}
ujJatek.addEventListener("click", ujra);
