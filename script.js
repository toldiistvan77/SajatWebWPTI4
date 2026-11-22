// ===== TIC-TAC-TOE: gép ellen vagy 2 játékos =====

var cellak = document.querySelectorAll("#tabla button");
var tablaDoboz = document.getElementById("tabla");
var uzenet = document.getElementById("uzenet");
var ujJatek = document.getElementById("ujjatek");
var modGep = document.getElementById("modgep");
var modKetto = document.getElementById("modketto");

var mod = "gep";          // "gep" = gép ellen, "ketto" = 2 játékos
var tabla = [];           // a 9 mező tartalma ("X", "O" vagy "")
var aktualis = "X";       // ki jön éppen
var vege = false;         // véget ért a játék?
var gepLep = false;       // igaz, amíg a gép "gondolkodik" (ilyenkor nem lehet kattintani)
var idozito = null;       // a gép lépésének időzítője
var nyertSor = null;      // a nyerő három mező sorszáma

// Ezek a nyerő sorok (a mezők sorszáma 0-tól 8-ig)
var nyeroSorok = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],   // vízszintesen
  [0, 3, 6], [1, 4, 7], [2, 5, 8],   // függőlegesen
  [0, 4, 8], [2, 4, 6]               // átlósan
];

// Megkeresi a nyerő sort. Ha nincs, null-t ad vissza.
function nyeroSorKeres() {
  for (var i = 0; i < nyeroSorok.length; i++) {
    var s = nyeroSorok[i];
    if (tabla[s[0]] !== "" && tabla[s[0]] === tabla[s[1]] && tabla[s[0]] === tabla[s[2]]) {
      return s;
    }
  }
  return null;
}

// Kirajzolja a táblát. Letiltja a mezőket, ha nem szabad rájuk kattintani.
function frissit() {
  for (var i = 0; i < 9; i++) {
    var osztaly = tabla[i] === "X" ? "x" : tabla[i] === "O" ? "o" : "";
    if (nyertSor && nyertSor.indexOf(i) !== -1) {
      osztaly += " nyero";
    }
    cellak[i].textContent = tabla[i];
    cellak[i].className = osztaly;
    cellak[i].disabled = vege || gepLep || tabla[i] !== "";
  }
  tablaDoboz.className = gepLep ? "var" : "";
}

function veletlenMezo() {
  // A gép véletlenszerűen választ az üres mezők közül
  var uresek = [];
  for (var i = 0; i < 9; i++) {
    if (tabla[i] === "") {
      uresek.push(i);
    }
  }
  return uresek[Math.floor(Math.random() * uresek.length)];
}

// Megnézi, vége van-e a játéknak, és kiírja az eredményt.
function kiertekel() {
  nyertSor = nyeroSorKeres();
  if (nyertSor) {
    vege = true;
    var jel = tabla[nyertSor[0]];
    if (mod === "gep") {
      uzenet.textContent = jel === "X" ? "Nyertél! Gratulálok!" : "A gép nyert. Próbáld újra!";
    } else {
      uzenet.textContent = jel + " nyert! Gratulálok!";
    }
  } else if (tabla.indexOf("") === -1) {
    vege = true;
    uzenet.textContent = "Döntetlen.";
  }
}

function gepLepese() {
  idozito = null;
  gepLep = false;                     // most már megint lehet kattintani
  tabla[veletlenMezo()] = "O";
  kiertekel();
  if (!vege) {
    aktualis = "X";
    uzenet.textContent = "Te jössz (X).";
  }
  frissit();
}

function kattintas(szam) {
  if (vege || gepLep || tabla[szam] !== "") {
    return;   // foglalt mezőre, a játék végén vagy a gép lépése közben nem történik semmi
  }

  tabla[szam] = aktualis;
  kiertekel();

  if (!vege) {
    if (mod === "gep") {
      aktualis = "O";
      gepLep = true;                  // a gép jön: a tábla zárolva van
      uzenet.textContent = "A gép gondolkodik...";
      idozito = setTimeout(gepLepese, 600);
    } else {
      aktualis = aktualis === "X" ? "O" : "X";
      uzenet.textContent = aktualis + " jön.";
    }
  }
  frissit();
}

function ujra() {
  clearTimeout(idozito);              // ha a gép épp lépni készült, ezt töröljük
  idozito = null;
  tabla = ["", "", "", "", "", "", "", "", ""];
  aktualis = "X";
  vege = false;
  gepLep = false;
  nyertSor = null;
  uzenet.textContent = mod === "gep" ? "Te kezdesz (X)." : "X kezd.";
  frissit();
}

function modValasztas(ujMod) {
  mod = ujMod;
  modGep.setAttribute("aria-pressed", ujMod === "gep");
  modKetto.setAttribute("aria-pressed", ujMod === "ketto");
  ujra();
}

// Mezők és gombok összekötése
for (var i = 0; i < 9; i++) {
  (function (szam) {
    cellak[szam].addEventListener("click", function () {
      kattintas(szam);
    });
  })(i);
}
ujJatek.addEventListener("click", ujra);
modGep.addEventListener("click", function () { modValasztas("gep"); });
modKetto.addEventListener("click", function () { modValasztas("ketto"); });

ujra();   // induló állapot
