import { Plugin } from "/static/js/plugin.js";
import { Mode } from "/static/js/mode.js";

const commands = {
    "clear": {
        evaluate: (...args) => { $("#output-container").html(""); },
        descriptor: "Clears the output"
    },

    "echo": {
        evaluate: (...args) => { return {input: args.join(" "), content: null}; },
        descriptor: "Echoes the input"
    }
}

export const corePlugin = new Plugin(
    "GruvCalc Core",
    "The core plugin of GruvCalc. Contains the default modes, commands, and functions.",
    [
        new Mode("normal", "=", "Escape", "var(--color-primary)"),
        new Mode("command", ">", "\\", "var(--color-secondary)",
            undefined,
            (currentVal) => {
                const args = currentVal.split(" ");
                if (commands[args[0]]) {
                    return {color: "var(--color-success)", content: commands[args[0]].descriptor};
                } else {
                    return {color: "var(--color-error)", content: "Couldn't find that command!"};
                }
            },
            (currentVal) => {
                const args = currentVal.split(" ");
                if (commands[args[0]]) {
                    return commands[args[0]].evaluate(...args.slice(1));
                } else {
                    return {input: currentVal, color: "var(--color-error)", content: "Couldn't find that command!"};
                }
            }
        ),
    
        new Mode("insert", "@", undefined, "var(--color-success)")
    ]
)