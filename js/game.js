import {correctGuesses, validGuesses} from "./guesses.js";
import {showModal} from "./modal.js";
import {listeners} from "./util.js";

class Game {
    constructor() {
        this.boxes = [];
        this.col = 0;
        this.row = 0;
        this.greens = 0;
        this.yellows = 0;
        this.grays = 0;
        this.finished = false;
        this.isWon = false

        this.colorBox = [];
    }

    start() {
        this.boxes.forEach(box => {
            if (box.innerText === "+") {
                box.style.color = "darkgray"
            }
        })
    }

    checkVals() {
        if (this.col < 0) {
            this.col = 0;
        } else if (this.col > 4) {
            this.col = 4;
        }

        if (this.row < 0) {
            this.row = 0;
        } else if (this.row > 5) {
            this.row = 5;
        }
    }

    getCurrentBox() {
        return this.boxes[this.row * 5 + this.col];
    }


    finish() {
        this.deselect()
        this.finished = true;

        document.querySelectorAll(".letter-key, .special-key").forEach(key => key.onclick = null);
        listeners.forEach(l => document.removeEventListener("keyup", l));

        const viewstats = document.createElement("div")
        viewstats.classList.add("view-stats-button");
        viewstats.innerText = "View Stats"
        viewstats.onclick = showModal

        document.getElementById("header-text").insertAdjacentElement("afterend", viewstats);
        document.getElementById("keyboard").childNodes.forEach(row => row.childNodes.forEach(key => key.classList.remove("active")));

        showModal()
    }

    select() {
        this.checkVals()
        if (!this.finished) {
            if (window.devicePixelRatio <= 1) this.getCurrentBox().style.outline = "2px solid black";
            else {
                this.getCurrentBox().style.backgroundColor = "black";
                this.getCurrentBox().style.color = this.getCurrentBox().innerText === "+" ? "black" : "white";
            }
        }
    }


    deselect() {
        this.checkVals()
        if (this.col < 5) {
            if (window.devicePixelRatio <= 1) this.getCurrentBox().style.outline = "none";
            else {
                this.getCurrentBox().style.backgroundColor = "darkgray"
                this.getCurrentBox().style.color = this.getCurrentBox().innerText === "+" ? "darkgray" : "black";
            }
        }
    }

    async letterPress(letter) {
        if (letter === "del") {
            this.deselect()
            if (this.getCurrentBox().innerText === "+") {
                this.col--;
            }
            this.checkVals()
            this.getCurrentBox().innerText = "+";
            this.getCurrentBox().style.color = "darkgray";
            this.select()
        } else if (letter === "ent") {
            console.log(this.row);
            const guess = this
                .boxes
                .slice(
                    this.row * 5,
                    this.row * 5 + 5
                )
                .map(box => box.innerText)
                .join("")
                .toLowerCase();

            if (guess.includes("+")) {
                // console.log("Not a full word");
                return
            }

            if (!validGuesses.has(guess) && !correctGuesses.includes(guess)) {
                // console.log("Not a valid word");
                return
            }

            const correct = correctGuesses[Math.round((new Date() - new Date("04/10/2022")) / 8.64e7)]

            if (correct === guess) {
                this.deselect()
                for (let i = 0; i < 5; i++) {
                    this.boxes[this.row * 5 + i].style.backgroundColor = "#00c735";
                }
                this.greens += 5;
                this.col = 0;
                this.colorBox.push([2, 2, 2, 2, 2])
                this.isWon = true;
                this.finish()
            } else {
                this.deselect()

                const colors = [-1, -1, -1, -1, -1]
                const isCorrect = [false, false, false, false, false]
                const letters = {}

                for (let i = 0; i < guess.length; i++) {
                    if (guess[i] === correct[i]) {
                        document.getElementById("key".concat(guess[i].toLowerCase())).style.backgroundColor = "#00c735";
                        this.boxes[this.row * 5 + i].style.backgroundColor = "#00c735";
                        colors[i] = 2;
                        isCorrect[i] = true;
                    }
                }

                for (let i = 0; i < correct.length; i++) {
                    if (!isCorrect[i]) {
                        letters.hasOwnProperty(correct[i]) ? letters[correct[i]]++ : letters[correct[i]] = 1
                    }
                }
                for (let i = 0; i < guess.length; i++) {
                    if (!isCorrect[i]) {
                        if (letters.hasOwnProperty(guess[i]) && letters[guess[i]] > 0) {
                            colors[i] = 1;
                            letters[guess[i]]--;
                            if (document.getElementById("key".concat(guess[i].toLowerCase())).style.backgroundColor !== "#00c735") {
                                document.getElementById("key".concat(guess[i].toLowerCase())).style.backgroundColor = "gold";
                            }
                        } else {
                            if (document.getElementById("key".concat(guess[i].toLowerCase())).style.backgroundColor !== "#00c735"
                                && document.getElementById("key".concat(guess[i].toLowerCase())).style.backgroundColor !== "gold"
                            ) {
                                document.getElementById("key".concat(guess[i].toLowerCase())).style.backgroundColor = "#636363";
                            }
                            colors[i] = 0;
                        }
                    }
                }

                for (let i = 0; i < 5; i++) {
                    switch (colors[i]) {
                        case 0:
                            this.boxes[this.row * 5 + i].style.backgroundColor = "#636363";
                            this.grays++;
                            break;
                        case 1:
                            this.boxes[this.row * 5 + i].style.backgroundColor = "gold";
                            this.yellow++;
                            break;
                        case 2:
                            this.boxes[this.row * 5 + i].style.backgroundColor = "#00c735";
                            this.greens++;
                            break;
                    }
                }

                this.colorBox.push(colors)

                this.row++;
                this.col = 0;
                if (this.row > 5) {
                    this.finish()
                } else {
                    this.select()
                }
            }

        } else if (this.col !== 5) {
            const box = this.getCurrentBox()
            const ogtext = box.innerText;
            box.innerText = letter.toUpperCase();
            box.style.color = "black";
            this.deselect()

            if (ogtext === "+") {
                this.col++;
            }

            if (this.col <= 4) {
                this.select()
            } else {
                this.col = 4;
                this.select()
                this.col++;
            }
        }
    }
}

export {Game};
