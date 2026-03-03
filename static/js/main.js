import { PluginLoader } from "./loader.js";
import { VisualManager } from "./visual.js";

import { evaluateDefault } from "./default.js";

const input = $("#input-box");

export class Gruvcalc {
    constructor() {
        this.plugins = new PluginLoader();
        this.visual = new VisualManager();

        this.currentMode = undefined;
    }

    load() {
        this.plugins.load();

        this.switchMode(this.plugins.getModes()[0]);
        
        $(window).on("keydown", (event) => {
            this.onKeydown(event);
        });

        input.focus();
    }

    reset() {
        input.val("");
        this.switchMode(this.plugins.getModes()[0]);
        this.preview();
    }

    switchMode(newMode) {
        this.visual.switchMode(newMode);
        this.currentMode = newMode;
    }

    preview() {
        const currentVal = input.val();
        const previewResult = this.currentMode.preview ? 
            this.currentMode.preview(currentVal) : 
            evaluateDefault(currentVal);

        this.visual.updatePreview(previewResult);
    }

    evaluate() {
        const currentVal = input.val();
        if (currentVal.trim() == "") { return; }

        const evaluateResult = this.currentMode.evaluate ? 
            this.currentMode.evaluate(currentVal) : 
            evaluateDefault(currentVal);
        
        input.val("");

        if (!evaluateResult) {
            return;
        }

        this.visual.createOutput(evaluateResult);
    }

    onKeydown(event) {
        if (!input.is(":focus") && event.key == "f") {
            event.preventDefault();
            input.focus();
            return;
        }

        const previousValue = input.val();

        for (const mode of this.plugins.getModes()) {
            if (event.key === mode.hotkey) {
                event.preventDefault();
                this.switchMode(mode);
            }

            if (previousValue.trim() == "" && event.key === mode.prefix) {
                event.preventDefault();
                this.switchMode(mode);
            }
        }

        setTimeout(() => {
            const currentValue = input.val();

            if (this.currentMode.keydown) this.currentMode.keydown(event, previousValue, currentValue);
            if (event.key == "Enter" && input.is(":focus")) this.evaluate();

            this.preview();
        }, 1);
    }
}