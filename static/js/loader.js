import { Plugin } from "./plugin.js";
import { Mode } from "./mode.js";
import { Alert } from "./alert.js";
import { Modal } from "./modal.js";

import { corePlugin } from "./stdlib/core.js";

export class PluginLoader {
    constructor() {
        this.loadedPlugins = [corePlugin];
        this.pluginRepository = [];
    }

    async loadPlugin(pluginSlug) {
        try {
            const response = await fetch(`/api/plugins/${pluginSlug}.js/`);
            if (response.status != 200) {
                throw new Error((await response.json()).message || `Server returned ${response.status}`);
            }

            const text = await response.text();
            
            let plugin;
            try {
                plugin = eval(text);
            } catch(e) {
                plugin = undefined;
            }
    
            if (!(plugin == undefined || plugin == null || !plugin) && plugin instanceof Plugin) {
                this.loadedPlugins.push(plugin);
                return plugin;
            } else {
                Alert.error("Error loading plugin", `Plugin ${pluginSlug} did not return a valid plugin object!`);
                return undefined;
            }
        } catch (e) {
            Alert.error("Error loading plugin", `Failed to load ${pluginSlug}: ${e.message}`);
        }
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
        if (pluginSlug == "core") { throw new Error("Cannot remove core plugin"); }

        let registeredPlugins = this.getRegisteredPlugins();
        if (!registeredPlugins.includes(pluginSlug)) { return; }
        
        localStorage.setItem("registeredPlugins", JSON.stringify(registeredPlugins.filter(slug => slug !== pluginSlug)));
    }

    isRegistered(pluginSlug) {
        return this.getRegisteredPlugins().includes(pluginSlug);
    }

    installPlugin(pluginSlug) {
        if (this.isRegistered(pluginSlug)) return;

        Alert.info("Installing Plugin", `Installing plugin ${pluginSlug}...`);

        this.loadPlugin(pluginSlug).then(plugin => {
            if (plugin) {
                Alert.success("Plugin Installed", `Successfully installed ${pluginSlug}! Refresh the page to apply changes.`);
                this.registerPlugin(pluginSlug);
            }
        });
    }

    uninstallPlugin(pluginSlug) {
        if (!this.isRegistered(pluginSlug)) return;  

        Alert.info("Uninstalling Plugin", `Uninstalling plugin ${pluginSlug}...`);

        try {
            this.unregisterPlugin(pluginSlug);
            Alert.success("Plugin Uninstalled", `Successfully uninstalled plugin ${pluginSlug}! Refresh the page to apply changes.`);
        } catch (e) {
            Alert.error("Error Uninstalling Plugin", `Failed to uninstall ${pluginSlug}: ${e.message}`);
        }
    }

    async load() {
        Alert.info("Loading", "Loading plugins...");

        fetch("/api/plugins/")
            .then(response => response.json())
            .then(plugins => {
                this.pluginRepository = plugins;
            });

        for (const pluginSlug of this.getRegisteredPlugins()) {
            if (pluginSlug == "core") { continue; }
            await this.loadPlugin(pluginSlug);
        }

        Alert.success("Finished Loading", "Finished loading plugins.");
        
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