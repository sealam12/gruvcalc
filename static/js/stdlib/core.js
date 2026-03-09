import { Plugin } from "../plugin.js";
import { Mode } from "../mode.js";
import { Modal } from "../modal.js";

function launchHelpModal() {
    window.gruvcalc.modal.showModal(new Modal(
        "Gruvcalc Core - Help",
        `
            <h2 class="title">GruvCalc Help</h2>
            <p class="subtitle">Welcome to GruvCalc!</p>
            <p>You can also use the following commands:</p>
            <ul>
                ${Object.keys(commands).map(cmd => `<li><strong>${cmd}</strong>: ${commands[cmd].description}</li>`).join("\n")}
            </ul>
        `
    ));
}

function launchPluginModal() {
    let plugins = window.gruvcalc.plugins.loadedPlugins;
    let plugin_list = [];

    for (const plugin of plugins) {
        const initialized = plugin.isInitialized;
        const isRemoved = !window.gruvcalc.plugins.isRegistered(plugin.slug);

        plugin_list.push({
            slug: plugin.slug,
            name: plugin.name,
            description: plugin.description,
        
            color: isRemoved ? "var(--color-error)" : (initialized ? "var(--color-success)" : "var(--color-warning)"),
        });
    }
    
    window.gruvcalc.modal.showModal(new Modal(
        "Gruvcalc Core - Plugins",
        `
            <h2 class="title">GruvCalc Plugins</h2>
            <p>Here you can manage your plugins.</p>
            <div class="block">
                ${plugin_list.map(plugin => {
                    return `
                        <div class="item" style="--ITEM-accent: ${ plugin.color };">
                            <strong>${plugin.name}:</strong>
                            ${plugin.description} 
                            <button class="button" onclick="window.gruvcalc.plugins.unregisterPlugin('${plugin.slug}')">Remove</button>
                        </div>
                    `;
                }).join("\n")}
            </div>
        `
    ));
}

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
        evaluate: launchHelpModal,
        description: "Shows this help message"
    },

    "addplugin": {
        evaluate: (slug) => {
            window.gruvcalc.plugins.installPlugin(slug);
        },
        description: "Adds a plugin by slug. Usage: addplugin <slug>"
    },

    "removeplugin": {
        evaluate: (slug) => {
            window.gruvcalc.plugins.unregisterPlugin(slug);
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
                    return {active: false, color: "var(--color-success)", content: commands[args[0]].description};
                } else {
                    return {active: false, color: "var(--color-error)", content: "Couldn't find that command!"};
                }
            },
            (currentVal) => {
                const args = currentVal.split(" ");
                if (commands[args[0]]) {
                    window.gruvcalc.reset();
                    return commands[args[0]].evaluate(...args.slice(1));
                } else {
                    return {active: false, input: currentVal, color: "var(--color-error)", content: "Couldn't find that command!"};
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
        window.gruvcalc.visual.createNavbarButton("Help", launchHelpModal);
        window.gruvcalc.visual.createNavbarButton("Plugins", launchPluginModal);
    }
)
