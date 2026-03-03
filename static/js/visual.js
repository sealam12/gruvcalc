const navbarContainer = $("#navbar-container");

const inputContainer = $("#input-container");
const inputPrefix = $("#input-prefix");
const input = $("#input-box");

const outputPreview = $("#output-preview");
const outputContainer = $("#output-container");

export class VisualManager {
    constructor() {}
    
    setPrefix(newPrefix) {
        inputPrefix.text(newPrefix);
    }

    switchMode(newMode) {
        this.setPrefix(newMode.prefix);
        inputContainer.css("--INPUT-accent", newMode.color);
        input.focus();
        input.val("");
    }

    updatePreview(previewResult) {
        outputPreview.text(previewResult.content);
        outputPreview.css("--PREVIEW-accent", previewResult.color);
    }

    createOutput(evaluateResult) {
        let newElement = $(`
            <div class="output-item">
            </div>
        `);

        if (evaluateResult.input) {
            newElement.append($(`<div class="output-input">${evaluateResult.input}</div>`));
        }

        if (evaluateResult.content) {
            newElement.append($(`<div class="output-answer">${evaluateResult.content}</div>`));
        }

        newElement.css("--OUTPUT-ITEM-accent", evaluateResult.color);

        outputContainer.prepend(newElement);
    }

    createNavbarButton(text, onClick) {
        const button = $(`<button class="navbar-button">${text}</button>`);
        button.on("click", onClick);

        navbarContainer.append(button);
    }
}