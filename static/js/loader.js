import { corePlugin } from "/static/js/stdlib/core.js";

class Loader {
    constructor() {
        this.plugins = [corePlugin];
    }

    load() {
        for (const plugin of this.plugins) plugin.preload();
        for (const plugin of this.plugins) plugin.load();
    }

    get modes() {
        return this.plugins.flatMap(plugin => plugin.modes);
    }
}

export let Plugins = new Loader();