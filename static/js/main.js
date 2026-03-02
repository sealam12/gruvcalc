import { PluginLoader } from "/static/js/loader.js";
import { VisualManager } from "/static/js/visual.js";

const input = $("#input-box");

class Gruvcalc {
    constructor() {
        this.plugins = new PluginLoader();
        this.visual = new VisualManager();

        this.currentMode = undefined;
    }

    load() {
        this.plugins.load();

        this.switchMode(this.plugins.getModes()[0]);
        
        $(window).on("keydown", function(event) {
            onKeydown(event);
        });

        input.focus();
    }

    switchMode(newMode) {
        this.visual.switchMode(newMode);
        this.currentMode = newMode;
    }

    evaluateDefault(currentVal) {
        let evaluated;
        let color = "var(--color-primary)";
        
        try {
            evaluated = eval(currentVal);
            color = evaluated != undefined ? "var(--color-success)" : "var(--color-primary)";
            evaluated = evaluated != undefined ? evaluated.toString() : "Type an expression to view it's output";
        } catch (error) {
            evaluated = error.message;
            color = "var(--color-error)";
        }

        return { input: currentVal, content: evaluated, color: color};
    }

    preview() {
        const currentVal = input.val();
        const previewResult = currentMode.preview ? currentMode.preview(currentVal) : evaluateDefault(currentVal);

        visual.updatePreview(previewResult);
    }

    evaluate() {
        const currentVal = input.val();
        const evaluateResult = currentMode.evaluate ? currentMode.evaluate(currentVal) : evaluateDefault(currentVal);
        
        input.val("");

        if (!evaluateResult) {
            return;
        }

        visual.createOutput(evaluateResult);
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