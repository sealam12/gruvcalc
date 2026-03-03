import { Plugin } from "../plugin.js";
import { Mode } from "../mode.js";

window.commands = {
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
    "core",
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
                    window.gruvcalc.reset();
                    return commands[args[0]].evaluate(...args.slice(1));
                } else {
                    return {input: currentVal, color: "var(--color-error)", content: "Couldn't find that command!"};
                }
            }
        ),
    
        new Mode("insert", "@", undefined, "var(--color-success)")
    ],
    () => {
        window.factorial = (n) => { return n <= 1 ? 1 : n * factorial(n - 1); }
        window.termial = (n) => { return n <= 1 ? 1 : n + termial(n - 1); }

        window.sum = (...args) => args.reduce((a, b) => a + b, 0);
        window.product = (...args) => args.reduce((a, b) => a * b, 1);
        
        // statistics functions

        window.average = (...args) => sum(...args) / args.length;
        window.avg = window.average;

        window.standardDeviation = (...args) => {
            const avg = average(...args);
            const squareDiffs = args.map(x => Math.pow(x - avg, 2));
            return Math.sqrt(average(...squareDiffs));
        }
        window.stdev = window.standardDeviation;

        window.meanAbsoluteDeviation = (...args) => {
            const avg = average(...args);
            const absDiffs = args.map(x => Math.abs(x - avg));
            return average(...absDiffs);
        }
        window.mad = window.meanAbsoluteDeviation;

        // constants

        window.e = Math.E;
        window.pi = Math.PI;
    },

    () => {
        window.gruvcalc.visual.createNavbarButton("Help", () => {
            alert("This is GruvCalc, a calculator for the modern age! \n\n" +
                "To get started, just type in any mathematical expression and hit Enter! \n" +
                "You can also use the following commands: \n\n" +
                Object.keys(commands).map(cmd => `${cmd}: ${commands[cmd].descriptor}`).join("\n")
            );
        });

        window.gruvcalc.visual.createNavbarButton("Plugins", () => {
            const pluginList = window.gruvcalc.plugins.plugins.map(plugin => `- ${plugin.name}: ${plugin.description}`).join("\n");
            alert(`Loaded plugins:\n\n${pluginList}`);
        });
    }
)