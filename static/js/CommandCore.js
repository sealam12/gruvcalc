let Commands = [];

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

export function EvaluateCommandPreview(Text) {
    const CommandName = Text.split(" ")[0];
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
    window.EvaluateCommandPreview = EvaluateCommandPreview;
    window.EvaluateCommand = EvaluateCommand;
}