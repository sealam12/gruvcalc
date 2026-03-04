import { Plugin } from "../plugin.js";
import { Mode } from "../mode.js";

window.commands = {
    "clear": {
        evaluate: (...args) => { $("#output-container").html(""); },
        description: "Clears the output"
    },

    "echo": {
        evaluate: (...args) => { return {input: args.join(" "), content: null}; },
        description: "Echoes the input"
    },

    "help": {
        evaluate: (...args) => {
            window.gruvcalc.modal.showModal({
                title: "Help",
                content: `
                    <h2 class="title">GruvCalc Help</h2>
                    <p class="subtitle">Welcome to GruvCalc!</p>
                    <p>You can also use the following commands:</p>
                    <ul>
                        ${Object.keys(commands).map(cmd => `<li><strong>${cmd}</strong>: ${commands[cmd].description}</li>`).join("\n")}
                    </ul>
                `
            });
        },
        description: "Shows this help message"
    },

    "addplugin": {
        evaluate: (slug) => {
            const plugins = JSON.parse(localStorage.getItem("gruvcalc_plugins") || "[]");
            if (!plugins.includes(slug)) {
                plugins.push(slug);
                localStorage.setItem("gruvcalc_plugins", JSON.stringify(plugins));
                alert(`Plugin ${slug} added! It will be loaded on the next page load.`);
            } else {
                alert(`Plugin ${slug} is already added.`);
            }
        },
        description: "Adds a plugin by slug. Usage: addplugin <slug>"
    },

    "removeplugin": {
        evaluate: (slug) => {
            let plugins = JSON.parse(localStorage.getItem("gruvcalc_plugins") || "[]");
            if (plugins.includes(slug)) {
                plugins = plugins.filter(s => s !== slug);
                localStorage.setItem("gruvcalc_plugins", JSON.stringify(plugins));
                alert(`Plugin ${slug} removed! It will be unloaded on the next page load.`);
            } else {
                alert(`Plugin ${slug} is not in the list.`);
            }
        },
        description: "Removes a plugin by slug. Usage: removeplugin <slug>"
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
                    return {color: "var(--color-success)", content: commands[args[0]].description};
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

        // exports

        corePlugin.testValue = 123;
    },

    () => {
        window.gruvcalc.visual.createNavbarButton("Help", () => {
            alert("This is GruvCalc, a calculator for the modern age! \n\n" +
                "To get started, just type in any mathematical expression and hit Enter! \n" +
                "You can also use the following commands: \n\n" +
                Object.keys(commands).map(cmd => `${cmd}: ${commands[cmd].description}`).join("\n")
            );
        });

        window.gruvcalc.visual.createNavbarButton("Plugins", () => {
            const pluginList = window.gruvcalc.plugins.plugins.map(plugin => `- ${plugin.name}: ${plugin.description}`).join("\n");
            alert(`Loaded plugins:\n\n${pluginList}`);
        });
    }
)