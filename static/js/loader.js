import { Plugin } from "./plugin.js";
import { corePlugin } from "./stdlib/core.js";

export class PluginLoader {
    constructor() {
        this.plugins = [corePlugin];
        this.available_plugins = [];
    }

    #network() {
        /*
        try {
            fetch("/api/plugins/")
                .then(response => response.json())
                .then(plugins => {
                    this.available_plugins = plugins;
                });
        } catch (e) {
            alert("Failed to fetch available plugins: " + e.message);
        }*/

        JSON.parse(/*localStorage.getItem("gruvcalc_plugins") || "[]")*/'["example-plugin"]').forEach(async pluginSlug => {
            try {
                if (pluginSlug && pluginSlug != "core") {
                    try {
                        const pluginModule = await import(`/api/plugins/${pluginSlug}.js/`);
                        this.plugins.push(pluginModule.default(Plugin));
                    } catch (e) {
                        alert(e.toString());
                    }
                }
            } catch (e) {
                alert(`Error fetching plugin ${pluginSlug}:`, e);
            }
        });
    }

    load() {
        this.#network();

        /* ------------------------------------------------------------------------------------ */

        for (const plugin of this.plugins) {
            plugin.preload();
        }

        for (const plugin of this.plugins) {
            plugin.load({
                getPlugin: (slug) => this.getPlugin(slug),
            });
        }
    }

    getPlugin(pluginSlug) {
        return this.plugins.find(plugin => plugin.slug == pluginSlug);
    }

    getModes() {
        return this.plugins.flatMap(plugin => plugin.modes);
    }
}