import { Plugin } from "../plugin.js";
import { Mode } from "../mode.js";
import { Modal } from "../modal.js";

import { launchHelpModal } from "../default.js";

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

    for (const pluginSlug of window.gruvcalc.plugins.getRegisteredPlugins()) {
        if (!plugins.find(p => p.slug === pluginSlug)) {
            plugin_list.push({
                slug: pluginSlug,
                name: pluginSlug,
                description: "Failed to load plugin!",
                color: "var(--color-error)"
            });
        }
    }
    
    let pluginRepo = [];
    // only plugins that arent installed
    for (const pluginSlug of window.gruvcalc.plugins.pluginRepository) {
        if (window.gruvcalc.plugins.isRegistered(pluginSlug)) continue;

        pluginRepo.push(pluginSlug);
    }
    
    window.gruvcalc.modal.showModal(new Modal(
        "Gruvcalc Core - Plugins",
        `
            <h2 class="title">GruvCalc Plugins</h2>
            <p>Here you can manage your plugins.</p>

            <h4 style="margin-bottom: 5px;">Manage Plugins</h4>
            <div class="block" style="display: flex; flex-direction: column; gap: 10px; max-height: 50%; overflow: scroll;">
                ${plugin_list.map(plugin => {
                    return `
                        <div class="item" style="--ITEM-accent: ${ plugin.color };">
                            <strong>${plugin.name}:</strong>
                            ${plugin.description} 
                            <button class="button" onclick="window.gruvcalc.plugins.uninstallPlugin('${plugin.slug}')">Remove</button>
                        </div>
                    `;
                }).join("\n")}
            </div>

            <h4 style="margin-bottom: 5px;">Install Plugins</h4>
            <div class="block" style="display: flex; flex-direction: column; gap: 10px; max-height: 50%; overflow: scroll;">
                ${pluginRepo.map(pluginSlug => {
                    return `
                        <div class="item" style="--ITEM-accent: var(--color-bg2);">
                            <strong>${pluginSlug}:</strong>
                            <button class="button" onclick="window.gruvcalc.plugins.installPlugin('${pluginSlug}')">Install</button>
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

    "plugins": {
        evaluate: launchPluginModal,
        description: "Opens the plugin management modal"
    },

    "install": {
        evaluate: (slug) => {
            window.gruvcalc.plugins.installPlugin(slug);
        },
        description: "Installs a plugin by slug. Usage: install <slug>"
    },

    "remove": {
        evaluate: (slug) => {
            window.gruvcalc.plugins.uninstallPlugin(slug);
        },
        description: "Uninstalls a plugin by slug. Usage: uninstall <slug>"
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
        window.factorial = (n) => {
            let num = n;
            let current = n;
            while (current > 1) {
                num *= current - 1;
                current--;
            }
            return num;
        }

        window.termial = (n) => {
            let num = n;
            let current = n;
            while (current > 1) {
                num += current - 1;
                current--;
            }
            return num;
        }

        window.sum = (...args) => args.reduce((a, b) => a + b, 0);
        window.product = (...args) => args.reduce((a, b) => a * b, 1);

        window.sqrt = (x) => Math.sqrt(x);
        window.cbrt = (x) => Math.cbrt(x);
        
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
        window.gruvcalc.visual.createNavbarButton("Plugins", launchPluginModal);
    }
)
