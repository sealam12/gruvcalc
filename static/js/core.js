import { CommandSetup, EvaluateCommand, GetCommand } from "/static/js/CommandCore.js";
import { ModalSetup, CloseModal, OpenModal } from  "/static/js/ModalCore.js";
import { PluginSetup } from "/static/js/PluginCore.js"
import "/static/js/stdlib.js";

const input = document.getElementById("input");
const output = document.getElementById("output");
const history = document.getElementById("history");

let history_list = []
let InputMode = "eval";

function SetOutput(text, inp, status) {
    output.innerHTML = text;
    output.className = `item ${status}`
    
    return;
}

function SaveInput() {
    let Result;
    let NewElem;
    try {
        NewElem = output.cloneNode();
        Result = (0, eval)(input.value);
        NewElem.className = "item success"
        NewElem.innerHTML = `${Result} | ${input.value}`;
    } catch (e) {
        NewElem = output.cloneNode();
        Result = e.toString();
        NewElem.className = "item error"
        NewElem.innerHTML = Result;
    }

    history.appendChild(NewElem);
    history_list.push({Result: Result, Input: input.value});

    input.value = "";
}

function EvaluateInput() {
    if (InputMode != "eval") {
        const CommandInput = input.value.split(" > ")[1];
        const CommandName = CommandInput.split(" ")[0]
        const Command = GetCommand(CommandInput.split(" ")[0]);
        
        if (Command) {
            SetOutput(`CMD [${Command.Name}] - ${Command.Description}`, Command.Name, "success");
        } else if (CommandName.length > 0) {
            SetOutput(`Invalid command ${CommandName}`, input.value, "error");
        } else {
            SetOutput("Enter a command to execute", input.value, "none");
        }
        return;
    }

    const AssignmentRegex = new RegExp("(?<![=!<>])=\s*(?![=])");
    const Tokens = AssignmentRegex.exec(input.value);
    
    if (Tokens) {
        SetOutput("Assignment will execute once entered", input.value, "none");
        return;
    }

    if (input.value.length == 0) {
        SetOutput("Enter expression to be evaluated", input.value, "none");
        return;
    }

    try {
        const Result = eval(input.value);
        SetOutput(`${Result}`, input.value, "success");
    } catch (e) {
        SetOutput(e.toString(), input.value, "error");
    }

    return;
}


function HandleInput(Event) {
    const Key = Event.key;

    if ((Key == ">" && input.value.length == 0) || Key == "\\") {
        Event.preventDefault();
        InputMode = "command";
        input.value = " > "
    }

    if (InputMode == "command") {
        if (Key.length > 1 && Key != "ArrowRight" && input.selectionStart <= 3) {
            Event.preventDefault();
        }

        if ((input.value == " > " && Key == "Backspace") || Key == "Escape" ) { 
            InputMode = "eval";
            input.value = ""; 
        }
    }

    if (Key == "Escape") input.value = "";
    if (Key == "Enter" && InputMode == "eval") setTimeout(SaveInput(),1);
    if (Key == "Enter" && InputMode == "command") EvaluateCommand(input.value.split(" > ")[1]);

    setTimeout(EvaluateInput, 1);

    return;
}

function HandleGlobalInput(Event) {
    switch (InputMode) {
        case "command":
            input.style.border = "2px solid #8ec07c"
            break;
        case "eval":
            input.style.border = "2px solid #d79921"
            break;
        case "hotkey":
            input.style.border = "2px solid #458588"
            break;
        default:
            input.style.border = "2px solid #d79921"
            break;
    }

    const Key = Event.key;
    if (Key == "Escape") {
        input.focus();
        CloseModal();
    }

    return;
}

export function Setup() {
    CommandSetup();
    ModalSetup();
    PluginSetup();

    input.focus();
    input.onkeydown = HandleInput;
    document.onkeydown = HandleGlobalInput;
    SetOutput("Enter expression to be evaluated", input.value, "none");
    return;
}

Setup();