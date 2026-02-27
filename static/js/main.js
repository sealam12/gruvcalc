const modes = {
    "normal": {
        prefix: "=",
        hotkey: "Escape",
        color: "var(--color-primary)",

        preview: null
    },

    "command": {
        prefix: ">",
        hotkey: "\\",
        color: "var(--color-secondary)",

        preview: () => ({color: "var(--color-secondary)", content: "Command mode active"})
    },

    "hotkey": {
        prefix: "@",
        hotkey: null,
        color: "var(--color-success)",

        preview: null
    }
}

let mode = modes.normal;

const inputContainer = $("#input-container");
const inputPrefix = $("#input-prefix");
const input = $("#input-box");

const outputPreview = $("#output-preview");

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

function preview() {
    if (mode.preview != null) {
        outputPreview.text(mode.preview().content);
        outputPreview.css("--PREVIEW-accent", mode.preview().color);
        return;
    }

    let evaluated;
    let color = "var(--color-primary)";
    const currentVal = input.val();
    
    try {
        evaluated = eval(currentVal);
        color = evaluated != undefined ? "var(--color-success)" : "var(--color-primary)";
        evaluated = evaluated != undefined ? evaluated.toString() : "Type an expression to view it's output";
    } catch (error) {
        evaluated = error.message;
        color = "var(--color-error)";
    }

    if (evaluated != undefined) {
        outputPreview.text(evaluated);
        outputPreview.css("--PREVIEW-accent", color);
    }
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

    await new Promise(resolve => setTimeout(resolve, 0));

    preview();
}

$(window).on("keydown", function(event) {
    onKeydown(event);
})

window.onerror = function (message, url, lineNo, columnNo, error) {
    document.body.innerHTML = `${message} at line ${lineNo}:${columnNo}`;
    return true;
};