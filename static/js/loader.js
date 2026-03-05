import { Plugin } from "./plugin.js";
import { Mode } from "./mode.js";
import { corePlugin } from "./stdlib/core.js";

export class PluginLoader {
    constructor() {
        this.plugins = [corePlugin];
        this.availablePlugins = [];
    }

    /* ------------------------------------------------------- */

    getPlugin(pluginSlug) {
        return this.plugins.find(plugin => plugin.slug == pluginSlug);
    }

    getModes() {
        return this.plugins.flatMap(plugin => plugin.modes);
    }

    /* ------------------------------------------------------- */

    getRegisteredPlugins() {
        let fromLocalStorage;

        try {
            fromLocalStorage = JSON.parse(localStorage.getItem("gruvcalc_plugins") || "[]");
        } catch (e) {
            alert(`Error parsing registered plugins from localStorage: ${e.message}`);
            fromLocalStorage = [];
        }

        return fromLocalStorage;
    }

    registerPlugin(pluginSlug) {
        if (!this.availablePlugins.includes(pluginSlug)) {
            alert(`Cannot add plugin ${pluginSlug}: does not exist.`);
            return;
        }

        let currentPlugins = this.getRegisteredPlugins();

        if (!currentPlugins.includes(pluginSlug)) {
            currentPlugins.push(pluginSlug);
            localStorage.setItem("gruvcalc_plugins", JSON.stringify(currentPlugins));
        } else {
            alert(`Cannot add plugin ${pluginSlug}: already added.`);
        }
    }

    unregisterPlugin(pluginSlug) {
        let currentPlugins = this.getRegisteredPlugins();

        if (currentPlugins.includes(pluginSlug)) {
            currentPlugins = currentPlugins.filter(slug => slug !== pluginSlug);
            localStorage.setItem("gruvcalc_plugins", JSON.stringify(currentPlugins));
        } else {
            alert(`Cannot remove plugin ${pluginSlug}: not found.`);
        }
    }

    /* ------------------------------------------------------- */

    #network() {
        try {
            fetch("/api/plugins/")
                .then(response => response.json())
                .then(plugins => {
                    this.availablePlugins = plugins;
                });
        } catch (e) {
            alert("Failed to fetch available plugins: " + e.message);
        }

        this.getRegisteredPlugins().forEach(async pluginSlug => {
            try {
                if (pluginSlug && pluginSlug != "core") {
                    try {
                        const pluginContent = await fetch(`/api/plugins/${pluginSlug}.js/`)
                                .then(response => {
                                    if (!response.ok) {
                                        return response.json().then(data => {
                                            alert(`Failed to fetch plugin ${pluginSlug}: ${data.message}`);
                                            return "err";
                                        });
                                    }

                                    return response.text();
                                });
                        
                        if (pluginContent == "err") {
                            return;
                        }
                        
                        const plugin = eval(pluginContent);
                        this.plugins.push(plugin);
                    } catch (e) {
                        alert(`Failed to load plugin ${pluginSlug}: ${e.message}`);
                    }
                }
            } catch (e) {
                alert(`Error fetching plugin ${pluginSlug}: ${e.message}`);
            }
        });
    }

    /* ------------------------------------------------------- */

    load() {
        this.#network();

        for (const plugin of this.plugins) {
            plugin.preload();
        }

        for (const plugin of this.plugins) {
            plugin.load({
                getPlugin: (slug) => this.getPlugin(slug),
            });
        }
    }
}