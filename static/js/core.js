import { PluginSetup } from "/static/js/PluginCore.js";
import { CommandSetup, EvaluateCommandPreview, EvaluateCommand } from "/static/js/CommandCore.js";
import { ModalSetup } from "/static/js/ModalCore.js";

const Input = $("#input");
let LocalConfig = {
    Mode: "eval",
};

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
    if (LocalConfig.Mode == "eval") {
        try {
            const Val = Input.val();
            const Regex = new RegExp('[a-z].+\\(.*\\)');

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

        NewItem.html(Result);
        NewItem.attr("class", `item ${Status}`);

        $("#history").prepend(NewItem);
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
        }
    } else if (LocalConfig.Mode == "hotkey") {
        if (Key == "Backspace" && IsBlank()) {
            Reset();
        }

        function ReplaceChar(Char) {
            Event.preventDefault();
            const SplitIndex = Input.get(0).selectionStart;
            const FirstSplit = Input.val().slice(0,SplitIndex);
            const SecondSplit = Input.val().slice(SplitIndex);
            const Result = `${FirstSplit}${Char}${SecondSplit}`;

            Input.val(Result);
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

Setup()