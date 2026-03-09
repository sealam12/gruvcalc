import { Plugin } from "./plugin.js";
import { Mode } from "./mode.js";
import { corePlugin } from "./stdlib/core.js";

export class PluginLoader {
    constructor() {
        this.loadedPlugins = [corePlugin];
        this.pluginRepository = [];
    }

    async loadPlugin(pluginSlug) {
        const response = await fetch(`/api/plugins/${pluginSlug}.js/`);
        const text = await response.text();
        
        const plugin = (() => {
            let plugin;
            try {
                plugin = eval(text);
            } catch(e) {
                plugin = undefined;
            }

            if (plugin instanceof Plugin) {
                return plugin;
            } else {
                alert(`Plugin ${pluginSlug} did not return a valid plugin object!`);
                return undefined;
            }
        })();
        
        if (plugin) {
            this.loadedPlugins.push(plugin);
        } else {
            alert(`Failed to load plugin ${pluginSlug}!`);
        }
        
        return plugin;
    }

    getRegisteredPlugins() {
        let fromLocalStorage = localStorage.getItem("registeredPlugins") ? JSON.parse(localStorage.getItem("registeredPlugins")) : ["core"];

        if (!fromLocalStorage.includes("core")) {
            fromLocalStorage.push("core");
            localStorage.setItem("registeredPlugins", JSON.stringify(fromLocalStorage));
        }

        return fromLocalStorage;
    }

    registerPlugin(pluginSlug) {
        if (pluginSlug == "core") { alert("Cannot remove core plugin"); return; }

        let registeredPlugins = this.getRegisteredPlugins();
        if (registeredPlugins.includes(pluginSlug)) { return; }
        
        localStorage.setItem("registeredPlugins", JSON.stringify([...registeredPlugins, pluginSlug]));
    }

    unregisterPlugin(pluginSlug) {
        if (pluginSlug == "core") { alert("Cannot remove core plugin"); return; }

        let registeredPlugins = this.getRegisteredPlugins();
        if (!registeredPlugins.includes(pluginSlug)) { return; }
        
        localStorage.setItem("registeredPlugins", JSON.stringify(registeredPlugins.filter(slug => slug !== pluginSlug)));
    }

    isRegistered(pluginSlug) {
        return this.getRegisteredPlugins().includes(pluginSlug);
    }

    installPlugin(pluginSlug) {
        if (!this.isRegistered(pluginSlug)) return;

        this.registerPlugin(pluginSlug);
        this.loadPlugin(pluginSlug);
    }

    unregisterPlugin(pluginSlug) {}

    async load() {
        await (fetch("/api/plugins/")
        .then(response => response.json())
        .then(plugins => {
            this.pluginRepository = plugins;
        }));
        
        for (const pluginSlug of this.getRegisteredPlugins()) {
            await this.loadPlugin(pluginSlug);
        }
        
        return;
    }

    init() {
        for (const plugin of this.loadedPlugins) {
            plugin.preinit();
        }

        for (const plugin of this.loadedPlugins) {
            plugin.init();
        }
    }

    getPlugin(pluginSlug) {
        return this.loadedPlugins.find(plugin => plugin.slug === pluginSlug);
    }

    getAllModes() {
        return this.loadedPlugins
            .filter(plugin => plugin.isInitialized)
            .flatMap(plugin => plugin.modes);
    }
}