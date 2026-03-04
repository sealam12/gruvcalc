import { PluginLoader } from "./loader.js";
import { VisualManager } from "./visual.js";

import { evaluateDefault } from "./default.js";

import { ModalManager } from "./modal.js";

const input = $("#input-box");

export class Gruvcalc {
    constructor() {
        this.plugins = new PluginLoader();
        this.visual = new VisualManager();
        this.modal = new ModalManager();

        this.defaultMode = undefined;
        this.currentMode = undefined;
    }

    load() {
        this.modal.init();
        this.plugins.load();

        this.defaultMode = this.plugins.getPlugin("core").getMode("normal");
        this.switchMode(this.defaultMode);
        
        $(window).on("keydown", (event) => {
            this.onKeydown(event);
        });
    }

    reset() {
        input.val("");
        this.switchMode(this.defaultMode);
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
        if (this.modal.isOpen()) {
            if (event.key == "Escape") {
                event.preventDefault();
                this.modal.hideModal();
            }

            return;
        }

        /* ---------------------------------------------------------- */

        if (!input.is(":focus") && event.key == "f") {
            event.preventDefault();
            input.focus();
            return;
        }

        /* ---------------------------------------------------------- */

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

        /* ---------------------------------------------------------- */

        setTimeout(() => {
            const currentValue = input.val();

            if (this.currentMode.keydown) this.currentMode.keydown(event, previousValue, currentValue);
            if (event.key == "Enter" && input.is(":focus")) this.evaluate();

            this.preview();
        }, 1);
    }
}