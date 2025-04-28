let Commands = [];
const Autocomplete = $("#cmd-suggestion");

export function AddCommand(Command) {
    Commands.push(Command);
}

export function GetCommand(Name) {
    for (const Command of Commands) { 
        if (Command.Name == Name) {
            return Command;
        }
    }

    return undefined;
}

export function AutocompleteSuggestion(CommandName) {
    const Lower = CommandName.toLowerCase();
        
    // Filter the commands that start with the input string
    const Suggestions = Commands.filter(Command => 
        Command.Name.toLowerCase().startsWith(Lower) && !Command.ExcludeAutocomplete
    );

    Autocomplete.html("");
    
    for (const Suggestion of Suggestions) {
        const NewElement = $("<div></div>");
        NewElement.html(Suggestion.Name);
        NewElement.css("margin-right", "5px")
        NewElement.addClass("button");
        Autocomplete.append(NewElement);
    }

    window.FirstAutocomplete = Suggestions[0];
} 

export function EvaluateCommandPreview(Text) {
    const CommandName = Text.split(" ")[0];

    AutocompleteSuggestion(CommandName);

    const Command = GetCommand(CommandName);
    if (!Command) {
        return {
            Status: "error",
            Result: "Could not find command or commandlet with specified name."
        };
    }
    const Args = Text.split(" ").slice(1)
    return {
        Status: "success",
        Result: Command.Preview(Args)
    };
}

export function EvaluateCommand(Text) {
    const CommandName = Text.split(" ")[0];
    const Command = GetCommand(CommandName);
    if (!Command) {
        return {
            Status: "error",
            Result: "Could not find command or commandlet with specified name."
        };
    }
    const Args = Text.split(" ").slice(1)
    try {
        const Result = Command.Evaluate(Args)
        return {
            Status: "success",
            Result: Result
        };
    } catch(e) {
        return {
            Status: "error",
            Result: e.toString()
        };
    }
}

export function CommandSetup() {
    window.AddCommand = AddCommand;
    window.GetCommand = GetCommand;
    window.AutocompleteSuggestion = AutocompleteSuggestion;
    window.EvaluateCommandPreview = EvaluateCommandPreview;
    window.EvaluateCommand = EvaluateCommand;
}