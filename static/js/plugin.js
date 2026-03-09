export class Plugin {
    constructor(slug, name, description, modes, preinit, init) {
        this.slug = slug;
        this.name = name;
        this.description = description;
        this.modes = modes;

        this.preinitFunc = preinit;
        this.initFunc = init;

        this.isInitialized = false;
    }

    ///////////////////////////////////////////////////////

    preinit(api) {
        if (this.preinitFunc) this.preinitFunc(api);
    }

    init(api) {
        if (this.initFunc) this.initFunc(api);
        this.isInitialized = true;
    }

    ///////////////////////////////////////////////////////

    getMode(name) {
        return this.modes.find(mode => mode.name === name);
    }
}