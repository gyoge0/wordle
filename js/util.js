// noinspection JSIgnoredPromiseFromCall


import {Game} from "./game.js";

const game = new Game()
const listeners = []

const makeKey = (text) => {
    const keywrap = document.createElement("div");
    const key = document.createElement("l1");
    keywrap.classList.add("letter-key")
    keywrap.classList.add("active")
    keywrap.id = "key".concat(text.toLowerCase())
    keywrap.onclick = () => game.letterPress(text)
    key.classList.add("letter-key-text");
    key.innerText = text.toUpperCase();
    keywrap.appendChild(key);

    return keywrap
}

const addKeyPress = () => {
    const listener = (event) => {
        if (event.getModifierState("Shift") || event.getModifierState("Control") || event.getModifierState("Alt")) {
            // Really just block out the shift, control, and alt keys
        } else if ("abcdefghijklmnopqrstuvwxyz".includes(event.key.toLowerCase())) {
            game.letterPress(event.key)
            inflate(event.key)
        } else if (event.key === "Enter") {
            game.letterPress("ent")
            inflate("ent")
        } else if (event.key === "Backspace" || event.key === "Delete") {
            game.letterPress("del")
            inflate("del")
        } else if (event.key === "ArrowRight") {
            game.deselect()
            game.col++;
            game.select()
        } else if (event.key === "ArrowLeft") {
            game.deselect()
            game.col--;
            game.select()
        }
    }
    document.addEventListener("keyup", listener);
    listeners.push(listener)
}

const inflate = async (letter) => {
    const box = document.getElementById("key".concat(letter.toLowerCase()))
    box.style.transition = "0ms"
    box.style.transform = "scale(1.2)"
    await new Promise(r => setTimeout(r, 100));
    box.style.transition = "100ms"
    box.style.transform = "scale(1)"
}

const startGame = () => {
    const boxes = []
    document.getElementById("contentarea").childNodes.forEach(row => row.childNodes.forEach(box => boxes.push(box)))
    game.boxes = boxes
    game.start()
}

const makeLetterBox = (letter, col) => {
    const letterbox = document.createElement("div");
    letterbox.classList.add("letter-box");
    letterbox.innerText = letter;
    letterbox.onclick = () => {
        game.deselect()
        game.col = col
        game.select()
    }
    return letterbox;
}

export {game, listeners, addKeyPress, startGame, makeLetterBox, makeKey}