/***********************************************/
/**                                            */
/**              MINI-PROJET JS 2018           */
/**                                            */
/***********************************************/

/** placez ici votre code javascript réponse aux questions du sujet de projet */

/** n'oubliez pas de faire précéder le code de vos fonctions 
    d'un commentaire documentant la fonction                   **/
var stars = document.getElementById("stars");
var ctx = stars.getContext("2d");
var score = 0;
var clicked = false;
var bouton = null;
var chance = 0.5 + (document.getElementById("score").innerHTML / 1000) * 0.05;
var collision;
var dessinTirs;
var dessinSoucoupes;
var dessinSoucoupes2;
var patchChance;
var soucoupesEchape = 0;
var best;
var bestName;
var shootEffect;
var explosionEffect;

document.getElementById("saveScore").value = "";
document.getElementById("password").value = "";
document.getElementById("mScore").innerHTML += localStorage.getItem("highscore") + " par " + localStorage.getItem("nomhighscore");

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.setAttribute("loop", "yes");
    this.sound.setAttribute("type", "audio/mp3");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}

var backgroundMusic = new sound("sons/Skyward.mp3");
backgroundMusic.play();

window.addEventListener("resize", function () {
    document.getElementById("GameOver").style.width = window.innerWidth + "px";
    document.getElementById("GameOver").style.height = window.innerHeight + "px";
})

function replay() {
    document.location.reload();
}

function pass(){
    if (document.getElementById("password").value == "javascript"){
        localStorage.setItem("highscore", "null");
        localStorage.setItem("nomhighscore", "null");
        document.location.reload();
    }
    else{
        document.getElementById("warning").innerHTML = "Mot de passe incorrect!"
    }
}

function save() {
    if (typeof (Storage) !== "undefined") {
        best = localStorage.getItem("highscore");
        bestName = document.getElementById("saveScore").value;
        if (best == "null" && score >= 0) {
            localStorage.setItem("highscore", score);
            localStorage.setItem("nomhighscore", bestName);
        }
        else {
            if (Number(localStorage.getItem("highscore")) <= score) {
                localStorage.setItem("highscore", score);
                localStorage.setItem("nomhighscore", bestName);
            }
        }
    } else {
        return 0;
    }
}

function gameover() {
    clearInterval(bouton);
    clearInterval(collision);
    clearInterval(dessinTirs);
    clearInterval(dessinSoucoupes);
    clearInterval(patchChance);
    document.getElementById("restants").innerHTML = soucoupes.length;
    document.removeEventListener("keydown", move);
    document.getElementById("nouvelleSoucoupe").removeEventListener("click", nSoucoupe);
    document.getElementById("flotteSoucoupes").removeEventListener("click", fSoucoupe);
    document.getElementById("GameOver").style.display = "block";
    document.getElementById("GameOver").style.width = window.innerWidth + "px";
    document.getElementById("GameOver").style.height = window.innerHeight + "px";
    document.addEventListener("keydown", function (e) {
        if (e.keyCode == 27) {
            document.getElementById("GameOver").style.display = "none";
        }
    });
}

document.getElementById("reset").addEventListener("click", function () {
    clearInterval(bouton);
    clearInterval(collision);
    clearInterval(dessinTirs);
    clearInterval(dessinSoucoupes);
    clearInterval(patchChance);
    document.removeEventListener("keydown", move);
    document.getElementById("nouvelleSoucoupe").removeEventListener("click", nSoucoupe);
    document.getElementById("flotteSoucoupes").removeEventListener("click", fSoucoupe);
    document.getElementById("Pass").style.display = "block";
    document.getElementById("Pass").style.width = window.innerWidth + "px";
    document.getElementById("Pass").style.height = window.innerHeight + "px";
    document.addEventListener("keydown", function (e) {
        if (e.keyCode == 27) {
            document.getElementById("Pass").style.display = "none";
        }
    });
})

document.getElementById("stop").addEventListener("click", function () {
    gameover();
});

var Vaisseau = function () {
    this.image = new Image;
    this.image.src = "images/vaisseau-ballon-petit.png";
    this.update = function (x, y) {
        this.x += x;
        this.y += y;
        ctx.drawImage(this.image, this.x, this.y);
    }
    this.x = 40;
    this.y = (stars.height / 2) - (this.image.height / 2);
}

var vaisseau1 = new Vaisseau();
window.onload = function(){
    vaisseau1.update(0, 0);
};


var tirs = [];

var Tir = function () {
    this.image = new Image;
    this.image.src = "images/tir.png";
    this.update = function (x, y) {
        ctx.clearRect(this.x, this.y, this.image.width, this.image.height);
        this.x += x;
        this.y += y;
        ctx.drawImage(this.image, this.x, this.y);
    }
    this.x = vaisseau1.x + vaisseau1.image.width;
    this.y = vaisseau1.y + vaisseau1.image.height / 2;
}

var soucoupes = [];

var Soucoupe = function () {
    this.image = new Image;
    this.image.src = "images/flyingSaucer-petit.png";
    this.update = function (x, y) {
        ctx.clearRect(this.x, this.y, this.image.width, this.image.height);
        this.x += x;
        this.y += y;
        ctx.drawImage(this.image, this.x, this.y);
    }
    this.x = stars.width - 60;
    this.y = (Math.random() * (stars.height - (this.image.height))) + (this.image.height / 5);
}

function nouvelleSoucoupe() {
    var enemy = new Soucoupe();
    enemy.update(0, 0);
    soucoupes.push(enemy);
}

function flotteSoucoupe() {
    var rng = Math.random();
    if (rng <= chance) {
        var enemy = new Soucoupe();
        enemy.update(0, 0);
        soucoupes.push(enemy);
    }
}

document.getElementById("nouvelleSoucoupe").addEventListener("click", nSoucoupe);

function nSoucoupe() {
    nouvelleSoucoupe();
    this.blur();
}

document.getElementById("flotteSoucoupes").addEventListener("click", fSoucoupe);

function fSoucoupe() {
    if (clicked == false) {
        bouton = setInterval(flotteSoucoupe, 750);
        clicked = true;
    }
    else {
        clearInterval(bouton);
        clicked = false;
    }
    this.blur();
}

document.addEventListener("keydown", move);

function move(e) {
    if (e.keyCode == 38 && (vaisseau1.y - (vaisseau1.image.height / 2)) >= 0) {
        ctx.clearRect(vaisseau1.x, vaisseau1.y, vaisseau1.image.width + 1, vaisseau1.image.height + 1);
        vaisseau1.update(0, -8);
    }
    else if (e.keyCode == 40 && (vaisseau1.y + (vaisseau1.image.height * 3 / 2)) <= stars.height) {
        ctx.clearRect(vaisseau1.x - 1, vaisseau1.y - 1, vaisseau1.image.width + 1, vaisseau1.image.height + 1);
        vaisseau1.update(0, 8);
    }
    else if (e.keyCode == 32) {
        var shoot = new Tir();
        shoot.update(0, 0);
        tirs.push(shoot);
        shootEffect = new sound("sons/Fire.mp3");
        shootEffect.play();
        shootEffect.sound.addEventListener("timeupdate", function () {
            if (shootEffect.sound.currentTime > 0.5) {
                shootEffect.stop();
            }
        })
    }
}

function removeTir(i) {
    if (i == 0) {
        ctx.clearRect(tirs[i].x, tirs[i].y, tirs[i].image.width, tirs[i].image.height);
        tirs.shift();
    }
    else {
        ctx.clearRect(tirs[i].x, tirs[i].y, tirs[i].image.width, tirs[i].image.height);
        tirs.splice(i, 1, );
    }
}

function removeSoucoupe(i) {
    if (i == 0) {
        ctx.clearRect(soucoupes[i].x, soucoupes[i].y, soucoupes[i].image.width, soucoupes[i].image.height);
        soucoupes.shift();
    }
    else {
        ctx.clearRect(soucoupes[i].x, soucoupes[i].y, soucoupes[i].image.width, soucoupes[i].image.height);
        soucoupes.splice(i, 1, );
    }
}

var soucoupes2 = [];

function soucoupeTouch(i) {
    if (i == 0) {
        ctx.clearRect(soucoupes[i].x, soucoupes[i].y, soucoupes[i].image.width, soucoupes[i].image.height);
        soucoupes2.push(soucoupes[i]);
        soucoupes.shift();
    }
    else {
        ctx.clearRect(soucoupes[i].x, soucoupes[i].y, soucoupes[i].image.width, soucoupes[i].image.height);
        soucoupes2.push(soucoupes[i]);
        soucoupes.splice(i, 1, );
    }
}

function removeSoucoupe2(i) {
    if (i == 0) {
        ctx.clearRect(soucoupes2[i].x, soucoupes2[i].y, soucoupes2[i].image.width, soucoupes2[i].image.height);
        soucoupes2.shift();
    }
    else {
        ctx.clearRect(soucoupes2[i].x, soucoupes2[i].y, soucoupes2[i].image.width, soucoupes2[i].image.height);
        soucoupes2.splice(i, 1, );
    }
}


function update2() {
    for (i = 0; i < tirs.length; i++) {
        tirs[i].update(8, 0);
        if (tirs[i].x > stars.width - tirs[i].image.width) {
            removeTir(i);
        }
    }
}

function update3() {
    for (i = 0; i < soucoupes.length; i++) {
        soucoupes[i].update(-3, 0);
        if (((soucoupes[i].x <= vaisseau1.image.width + 40) && (((vaisseau1.y - (soucoupes[i].y + soucoupes[i].image.height) >= -soucoupes[i].image.height) && (vaisseau1.y - soucoupes[i].y <= soucoupes[i].image.height)) || (((vaisseau1.y + vaisseau1.image.height) - soucoupes[i].y <= vaisseau1.image.height) && ((vaisseau1.y + vaisseau1.image.height) - (soucoupes[i].y + soucoupes[i].image.height) >= -vaisseau1.image.height)))) || (soucoupes[i].x <= 0)) {
            removeSoucoupe(i);
            soucoupesEchape++;
            score -= 1000;
            document.getElementById("score").innerHTML = score;
            if ((score < 0) || (soucoupesEchape >= 3)) {
                gameover();
            }
        }
    }
}

function update4() {
    for (i = 0; i < soucoupes2.length; i++) {
        soucoupes2[i].update(0, 3);
        if (soucoupes2[i].y + soucoupes2[i].image.height - soucoupes2[i].image.height / 7 > stars.height) {
            removeSoucoupe2(i);
        }
    }
}

function update5() {
    chance = 0.5 + (document.getElementById("score").innerHTML / 1000) * 0.05;
}

function collisionDetection() {
    for (i = 0; i < tirs.length; i++) {
        for (j = 0; j < soucoupes.length; j++) {
            if ((tirs[i].x + tirs[i].image.width >= soucoupes[j].x) && (((tirs[i].y - (soucoupes[j].y + soucoupes[j].image.height) >= -soucoupes[j].image.height) && (tirs[i].y - soucoupes[j].y <= soucoupes[j].image.height)) || (((tirs[i].y + tirs[i].image.height) - soucoupes[j].y <= tirs[i].image.height) && ((tirs[i].y + tirs[i].image.height) - (soucoupes[j].y + soucoupes[j].image.height) >= -tirs[i].image.height)))) {
                soucoupeTouch(j);
                removeTir(i);
                score += 200;
                document.getElementById("score").innerHTML = score;
                explosionEffect = new sound("sons/explosion.mp3");
                explosionEffect.play();
                explosionEffect.sound.addEventListener("timeupdate", function () {
                    if (explosionEffect.sound.currentTime > 0.5) {
                        explosionEffect.stop();
                    }
                });
                break;
            }
        }
    }
}

collision = setInterval(collisionDetection, 1);
dessinTirs = setInterval(update2, 50);
dessinSoucoupes = setInterval(update3, 50);
dessinSoucoupes2 = setInterval(update4, 50);
patchChance = setInterval(update5, 50);