import { PluginSetup } from "/static/js/PluginCore.js";
import { CommandSetup, EvaluateCommandPreview, EvaluateCommand } from "/static/js/CommandCore.js";
import { ModalSetup } from "/static/js/ModalCore.js";
import { FatalError } from "/static/js/ErrorCore.js";

const Input = $("#input");
let LocalConfig = {
    Mode: "eval",
};
let PreviousResult;

export function IsBlank() {
    if (LocalConfig.Mode == "command") return Input.val() == " > ";
    if (LocalConfig.Mode == "hotkey") return Input.val() == " @ ";
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
    $("#cmd-suggestion").html("");
    if (LocalConfig.Mode == "eval") {
        try {
            const Val = Input.val();
            const Regex = new RegExp('[a-z][a-zA-Z1-9]+\\(.*\\)');

            if (Regex.exec(Val) && Regex.exec(Val).length > 0) {
                $("#preview").html("Operation will be executed on enter");
                $("#preview").attr("class", `item none`);
                return
            }

            const Result = (0,eval)(Input.val());
            $("#preview").html(Result);
            $("#preview").attr("class", `item success`);
        } catch (e) {
            $("#preview").html(e.toString());
            $("#preview").attr("class", `item error`);
        }
    } else if (LocalConfig.Mode == "command") {
        const Command = SplitCommand(Input.val());
        const Result = EvaluateCommandPreview(Command);
        $("#preview").html(Result.Result);
        $("#preview").attr("class", `item ${Result.Status}`);
    } else if (LocalConfig.Mode == "hotkey") {
        try {
            const Result = (0,eval)(Input.val().slice(3));
            $("#preview").html(Result);
            $("#preview").attr("class", `item success`);
        } catch (e) {
            $("#preview").html(e.toString());
            $("#preview").attr("class", `item error`);
        }
    }
}

export function TextEvaluation() {
    if (LocalConfig.Mode == "eval") {
        let Status = "success";
        let Result;
        try {
            Result = (0,eval)(Input.val());
            Status = "success";
        } catch (e) {
            Result = e.toString();
            Status = "error";
        }
        const NewItem = $("<div></div>");

        NewItem.html(`${Input.val()} = ${Result}`);
        NewItem.attr("class", `item ${Status}`);

        PreviousResult = Result;
        $("#history").prepend(NewItem);
    } else if (LocalConfig.Mode == "command") {
        const Command = SplitCommand(Input.val());
        const Result = EvaluateCommand(Command);
        const NewItem = $("<div></div>");

        let ResultText;
        if (Result.Result == null) {
            ResultText = "Command did not return an output.";
        } else {
            ResultText = Result.Result;
        }

        NewItem.html(`${Input.val()} | ${ResultText}`);
        NewItem.attr("class", `item ${Result.Status}`)

        if (Result.Status != "error") {
            PreviousResult = Result;
        }
        $("#history").prepend(NewItem);
    } else if (LocalConfig.Mode == "hotkey") {
        const NewItem = $("<div></div>");
        try {
            const Result = (0,eval)(Input.val().slice(3));
            NewItem.html(Result);
            NewItem.attr("class", `item success`);
            PreviousResult = Result;
        } catch (e) {
            NewItem.html(e.toString());
            NewItem.attr("class", `item error`);
        }
        $("#history").prepend(NewItem);
    }

    if (LocalConfig.Mode != "hotkey") {
        Reset();
    } else {
        Reset();
        SetMode("hotkey");
        Input.val(" @ ");
    }
}


export function InputKeypress(Event) {
    function ReplaceChar(Char) {
        Event.preventDefault();
        const SplitIndex = Input.get(0).selectionStart;
        const FirstSplit = Input.val().slice(0,SplitIndex);
        const SecondSplit = Input.val().slice(SplitIndex);
        const Result = `${FirstSplit}${Char}${SecondSplit}`;
    
        Input.val(Result);
    }

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

    if (Key == "Enter") {
        TextEvaluation();
    }

    if (LocalConfig.Mode == "eval") {
        if (Key == ">" && IsBlank()) {
            Event.preventDefault();
            Reset();
            SetMode("command");
            Input.val(" > ");
        }
        if (Key == "@" && IsBlank()) {
            Event.preventDefault();
            Reset();
            SetMode("hotkey");
            Input.val(" @ ");
        }
    } else if (LocalConfig.Mode == "command") {
        if (Key == "Backspace" && IsBlank()) {
            Reset();
        } else if (Key == "Tab") {
            if (window.FirstAutocomplete) {
                Event.preventDefault();
                Input.val(` > ${window.FirstAutocomplete.Name} `);
                TextPreviewEvaluation();
            }
        }
    } else if (LocalConfig.Mode == "hotkey") {
        if (Key == "Backspace" && IsBlank()) {
            Reset();
        }

        switch (Key) {
            case "p":
                ReplaceChar("+");
                break;
            case "o":
                ReplaceChar("-");
                break;
            case "i":
                ReplaceChar("*");
                break;
            case "u":
                ReplaceChar("/");
                break;
            case "`":
                ReplaceChar(PreviousResult);
                break;
            default:
                break;
        }
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

try {
    Setup();
} catch(E) {
    throw new FatalError(E.toString(), E.stack);
}