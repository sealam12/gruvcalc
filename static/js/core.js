import { PluginSetup } from "/static/js/PluginCore.js";
import { CommandSetup, EvaluateCommandPreview, EvaluateCommand } from "/static/js/CommandCore.js";
import { ModalSetup } from "/static/js/ModalCore.js";

const Input = $("#input");
let LocalConfig = {
    Mode: "eval",
};

export function IsBlank() {
    if (LocalConfig.Mode == "command") return Input.val() == " > ";
    return Input.val().length == 0;
}

export function SetFocus() { Input.focus(); }
export function SplitCommand(Text) {
    return Text.split(" > ")[1];
}
export function SetMode(Mode) {
    LocalConfig.Mode = Mode;
    
    Input.removeClass("eval");
    Input.removeClass("command");
    Input.removeClass("hotkey");
    
    Input.addClass(Mode);
}
export function Reset() {
    Input.val("");
    SetMode("eval");
    $("#preview").attr("class", "item none");
    $("#preview").html("Type an expression to view it's output");
}

export function TextPreviewEvaluation() {
    if (LocalConfig.Mode == "eval") {

    } else if (LocalConfig.Mode == "command") {
        const Command = SplitCommand(Input.val());
        const Result = EvaluateCommandPreview(Command);
        $("#preview").html(Result.Result);
        $("#preview").attr("class", `item ${Result.Status}`);
    } else if (LocalConfig.Mode == "hotkey") {

    }
}

export function TextEvaluation() {
    if (LocalConfig.Mode == "eval") {

    } else if (LocalConfig.Mode == "command") {
        const Command = SplitCommand(Input.val());
        const Result = EvaluateCommand(Command);
        const NewItem = $("<div></div>");

        NewItem.html(Result.Result);
        NewItem.attr("class", `item ${Result.Status}`)

        $("#history").prepend(NewItem);
    } else if (LocalConfig.Mode == "hotkey") {

    }

    Reset();
}

export function InputKeypress(Event) {
    const Key = Event.key;

    if (Key == "Escape") {
        Event.preventDefault();
        Reset();
    }

    if (Key == "\\") {
        Event.preventDefault();
        Reset();
        SetMode("command");
        Input.val(" > ");
    }

    if (LocalConfig.Mode == "eval") {
        if (Key == ">" && IsBlank()) {
            Event.preventDefault();
            Reset();
            SetMode("command");
            Input.val(" > ");
        }
    } else if (LocalConfig.Mode == "command") {
        if (Key == "Backspace" && IsBlank()) {
            Reset();
        }
        if (Key == "Enter") {
            TextEvaluation();
        }
    } else if (LocalConfig.Mode == "hotkey") {

    }

    setTimeout(TextPreviewEvaluation, 1);
}

export function WindowKeypress(Event) {
    const Key = Event.key;

    if (Key == "Escape") {
        Event.preventDefault();
        window.CloseModal();
        SetFocus();
    }
}

export function Setup() {
    CommandSetup();
    ModalSetup();
    PluginSetup();
    SetFocus();

    $(document).keydown(WindowKeypress);
    Input.keydown(InputKeypress);
}

Setup()