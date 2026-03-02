import { corePlugin } from "/static/js/stdlib/core.js";

class Loader {
    constructor() {
        this.plugins = [corePlugin];
    }

    get modes() {
        return this.plugins.flatMap(plugin => plugin.modes);
    }
}

export let Plugins = new Loader();