import { corePlugin } from "./stdlib/core.js";

export class PluginLoader {
    constructor() {
        this.plugins = [corePlugin];
    }

    load() {
        for (const plugin of this.plugins) plugin.preload();
        for (const plugin of this.plugins) plugin.load();
    }

    getModes() {
        return this.plugins.flatMap(plugin => plugin.modes);
    }
}