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