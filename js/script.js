import {addKeyPress, game, makeKey, makeLetterBox, startGame} from "./util.js";


// noinspection JSValidateTypes
window.onload = setTimeout((_h) => {
    const contentarea = document.getElementById("contentarea");

    for (let i = 0; i < 6; i++) {
        const row = document.createElement("div");
        row.classList.add("content-row")
        for (let j = 0; j < 5; j++) {
            const letterbox = makeLetterBox("+", j);
            row.appendChild(letterbox);
        }
        contentarea.appendChild(row);
    }


    const qwerty = [["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
        ["z", "x", "c", "v", "b", "n", "m"]];


    for (let i = 0; i < qwerty.length; i++) {
        qwerty[i].forEach(letter => document.getElementById(`keyrow${i + 1}`).appendChild(makeKey(letter)))
    }


    const delwrap = document.createElement("div");
    const del = document.createElement("l1");
    delwrap.classList.add("special-key");
    delwrap.classList.add("active")
    delwrap.id = "keydel";
    delwrap.onclick = () => game.letterPress("del")
    del.classList.add("special-key-text");
    del.innerText = "Delete";
    delwrap.appendChild(del);

    const entwrap = document.createElement("div");
    const ent = document.createElement("l1");
    entwrap.classList.add("special-key")
    entwrap.classList.add("active")
    entwrap.id = "keyent";
    entwrap.onclick = () => game.letterPress("ent")
    ent.classList.add("special-key-text");
    ent.innerText = "Enter";
    entwrap.appendChild(ent);

    document.getElementById("keyrow3").insertBefore(delwrap, document.getElementById("keyrow3").firstChild);
    document.getElementById("keyrow3").appendChild(entwrap);

    addKeyPress()

    startGame();

}, 100);