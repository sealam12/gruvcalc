class Gruvcalc {
    constructor() {
        this.inputElement = $("#input");
        this.prefixElement = $("#prefix");
        this.previewElement = $("#preview");
    }

    resetStyling() {
        this.prefixElement.attr("className", "eval");
        this.inputElement.attr("className", "input eval");
    }
}

window.gruvcalc = new Gruvcalc();
window.gruvcalc.init();