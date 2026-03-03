import { corePlugin } from "./stdlib/core.js";

export class PluginApi {
    constructor() {
        this.plugins = {};
    }

    preload(pluginSlug) {
        this.plugins[pluginSlug] = {};

        return {
            expose: (name, val) => {
                this.plugins[pluginSlug][name] = val;
            }
        }
    }

    load(pluginSlug) {
        return {
            self: this.plugins[pluginSlug],
            getPlugin: (slug) => {
                const plugin = this.plugins[slug];
                if (!plugin) {
                    throw new Error(`Plugin with slug ${slug} not found!`);
                }
                return plugin;
            }
        }
    }
}

export class PluginLoader {
    constructor() {
        this.plugins = [corePlugin];
        this.pluginApi = new PluginApi();
    }

    load() {
        for (const plugin of this.plugins) {
            plugin.preload(
                this.pluginApi.preload(plugin.slug)
            );
        }

        for (const plugin of this.plugins) {
            plugin.load(
                this.pluginApi.load(plugin.slug)
            );
        }
    }

    getPlugin(pluginSlug) {
        return this.plugins.find(plugin => plugin.slug == pluginSlug);
    }

    getModes() {
        return this.plugins.flatMap(plugin => plugin.modes);
    }
}