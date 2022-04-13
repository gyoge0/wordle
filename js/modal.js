import {game} from "./util.js"
import {correctGuesses} from "./guesses.js";

const shareGuesses = () => {
    let shareText = `Wordle ${Math.round((new Date() - new Date("04/10/2022")) / 8.64e7)}: ${game.row}/6\n`
    game.colorBox.forEach(row => {
        shareText += "\n"
        row.forEach(color => {
            switch (color) {
                case -1:
                    shareText += " "
                    break;
                case 0:
                    shareText += "⬛"
                    break;
                case 1:
                    shareText += "🟨"
                    break;
                case 2:
                    shareText += "🟩"
                    break;
            }
        })
    })

    copyText(shareText)
}

const copyText = (text) => {
    if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return window.clipboardData.setData("Text", text);

    } else { // noinspection JSDeprecatedSymbols
        if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            const textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                // noinspection JSDeprecatedSymbols
                return document.execCommand("copy");  // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return prompt("Copy to clipboard: Ctrl+C, Enter", text);
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }
}

const showModal = () => {

    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.id = "modal"

    modal.innerHTML = `
    <div class="modal-inner">
        <div class="modal-close" onclick="document.getElementById('modal').remove()">X</div>
        <div class="modal-header">Statistics</div>
        <div class="modal-correct">Correct answer: ${correctGuesses[Math.round((new Date() - new Date("04/10/2022")) / 8.64e7)].toUpperCase()}</div>
        <div class="modal-values-container">
            <div class="modal-values" style="outline-color:green">Greens: <b>${game.greens}</b></div>
            <div class="modal-values" style="outline-color:gold">Yellows: <b>${game.yellows}</b></div>
            <div class="modal-values" style="outline-color:gray">Grays: <b>${game.grays}</b></div>
        </div>
        <div class="modal-share">Share</div>
    </div>
    `

    modal.children[modal.children.length - 1].onclick = () => shareGuesses();
    document.body.appendChild(modal);

}

export {showModal}