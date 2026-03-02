export class Mode {
    constructor(name, prefix, hotkey, color, keydown, preview, evaluate) { 
        this.name = name
        this.prefix = prefix
        this.hotkey = hotkey
        this.color = color

        this.keydown = keydown
        this.preview = preview
        this.evaluate = evaluate
    }
}