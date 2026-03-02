import { Plugins } from "/static/js/loader.js";

const inputContainer = $("#input-container");
const inputPrefix = $("#input-prefix");
const input = $("#input-box");

const outputPreview = $("#output-preview");
const outputContainer = $("#output-container");

let currentMode;

function setPrefix(newPrefix) {
    inputPrefix.text(newPrefix);
}

function switchMode(newMode) {
    setPrefix(newMode.prefix);
    inputContainer.css("--INPUT-accent", newMode.color);
    input.focus();
    input.val("");

    currentMode = newMode;
}

function evaluateDefault(currentVal) {
    let evaluated;
    let color = "var(--color-primary)";
    
    try {
        evaluated = eval(currentVal);
        color = evaluated != undefined ? "var(--color-success)" : "var(--color-primary)";
        evaluated = evaluated != undefined ? evaluated.toString() : "Type an expression to view it's output";
    } catch (error) {
        evaluated = error.message;
        color = "var(--color-error)";
    }

    return { input: currentVal, content: evaluated, color: color};
}

function preview() {
    const currentVal = input.val();
    const previewResult = currentMode.preview ? currentMode.preview(currentVal) : evaluateDefault(currentVal);

    outputPreview.text(previewResult.content);
    outputPreview.css("--PREVIEW-accent", previewResult.color);
}

function evaluate() {
    const currentVal = input.val();
    const evaluateResult = currentMode.evaluate ? currentMode.evaluate(currentVal) : evaluateDefault(currentVal);
    
    input.val("");

    if (!evaluateResult) {
        return;
    }

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

function onKeydown(event) {
    if (!input.is(":focus") && event.key == "f") {
        event.preventDefault();
        input.focus();
        return;
    }

    const previousValue = input.val();

    for (const mode of Plugins.modes) {
        if (event.key === mode.hotkey) {
            event.preventDefault();
            switchMode(mode);
        }

        if (previousValue.trim() == "" && event.key === mode.prefix) {
            event.preventDefault();
            switchMode(mode);
        }
    }

    setTimeout(() => {
        const currentValue = input.val();

        if (currentMode.keydown) currentMode.keydown(event, previousValue, currentValue);
        if (event.key == "Enter" && input.is(":focus")) evaluate();

        preview();
    }, 1);
}

export function initialize() {
    switchMode(Plugins.modes[0]);
    $(window).on("keydown", function(event) {
        onKeydown(event);
    });

    input.focus();
}