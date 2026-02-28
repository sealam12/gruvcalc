const inputContainer = $("#input-container");
const inputPrefix = $("#input-prefix");
const input = $("#input-box");
const outputPreview = $("#output-preview");
const outputContainer = $("#output-container");

const commands = {
    "clear": {
        evaluate: (...args) => { outputContainer.html(""); },
        descriptor: "Clears the output"
    }
}

const modes = {
    "normal": {
        prefix: "=",
        hotkey: "Escape",
        color: "var(--color-primary)",

        preview: null,
        evaluate: null,
    },    

    "command": {
        prefix: ">",
        hotkey: "\\",
        color: "var(--color-secondary)",

        preview: (currentVal) => {
            if (commands[currentVal]) {
                return {color: "var(--color-success)", content: commands[currentVal].descriptor};
            } else {
                return {color: "var(--color-error)", content: "Couldn't find that command!"};
            }
        },
        evaluate: (currentVal) => {
            if (commands[currentVal]) {
                commands[currentVal].evaluate();
            } else {
                return {input: currentVal, color: "var(--color-error)", content: "Couldn't find that command!"};
            }
        }
    },    

    "hotkey": {
        prefix: "@",
        hotkey: null,
        color: "var(--color-success)",

        preview: null,
        evaluate: null,
    }    
}    

let mode = modes.normal;

function setPrefix(newPrefix) {
    inputPrefix.text(newPrefix);
}

function switchMode(newMode) {
    setPrefix(newMode.prefix);
    inputContainer.css("--INPUT-accent", newMode.color);
    input.focus();
    input.val("");

    mode = newMode;
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
    const previewResult = mode.preview ? mode.preview(currentVal) : evaluateDefault(currentVal);

    outputPreview.text(previewResult.content);
    outputPreview.css("--PREVIEW-accent", previewResult.color);
}

function evaluate() {
    const currentVal = input.val();
    const evaluateResult = mode.evaluate ? mode.evaluate(currentVal) : evaluateDefault(currentVal);

    if (!evaluateResult) {
        return;
    }

    let newElement = $(`
        <div class="output-item">
            <div class="output-input">${evaluateResult.input}</div>
            <div class="output-answer">${evaluateResult.content}</div>
        </div>
    `);

    newElement.css("--OUTPUT-ITEM-accent", evaluateResult.color);

    outputContainer.prepend(newElement);
    input.val("");
}

async function onKeydown(event) {
    if (!input.is(":focus") && event.key == "f") {
        event.preventDefault();
        input.focus();
        return;
    }

    const previousValue = input.val();

    for (const [modeName, mode] of Object.entries(modes)) {
        if (event.key === mode.hotkey) {
            event.preventDefault();
            switchMode(mode);
        }

        if (previousValue.trim() == "" && event.key === mode.prefix) {
            event.preventDefault();
            switchMode(mode);
        }
    }

    await new Promise(resolve => setTimeout(resolve, 1));

    if (event.key == "Enter" && input.is(":focus")) {
        evaluate();
    }

    preview();
}

$(window).on("keydown", function(event) {
    onKeydown(event);
})

window.onerror = function (message, url, lineNo, columnNo, error) {
    document.body.innerHTML = `${message} at line ${lineNo}:${columnNo}`;
    return true;
};