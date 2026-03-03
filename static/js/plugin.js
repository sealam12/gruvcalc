export class Plugin {
    constructor(slug, name, description, modes, preload, load) {
        this.slug = slug;
        this.name = name;
        this.description = description;
        this.modes = modes;

        this.preloadFunc = preload;
        this.loadFunc = load;
    }

    preload(api) {
        if (this.preloadFunc) this.preloadFunc(api);
    }

    load(api) {
        if (this.loadFunc) this.loadFunc(api);
    }

    ///////////////////////////////////////////////////////

    getMode(name) {
        return this.modes.find(mode => mode.name === name);
    }
}