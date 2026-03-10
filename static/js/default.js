import { Plugin } from "./plugin.js";
import { Mode } from "./mode.js";
import { Alert } from "./alert.js";
import { Modal } from "./modal.js";

export function evaluateDefault(currentVal) {
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

    return { input: currentVal, content: evaluated, color: color, active: false };
}

export function launchHelpModal() {
    window.gruvcalc.modal.showModal(new Modal(
        "Gruvcalc Core - Help",
        `
            <h2 class="title">GruvCalc Help</h2>
            <p class="subtitle">Welcome to GruvCalc!</p>
        `
    ));
}