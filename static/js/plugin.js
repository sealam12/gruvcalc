export class Plugin {
    constructor(name, description, modes, preload, load) {
        this.name = name;
        this.description = description;
        this.modes = modes;

        this.preloadFunc = preload;
        this.loadFunc = load;
    }

    preload() {
        if (this.preloadFunc) this.preloadFunc();
    }

    load() {
        if (this.loadFunc) this.loadFunc();
    }
}