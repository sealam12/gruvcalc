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

    init() {
        
    }
}

window.onerror = function (message, url, lineNo, columnNo, error) {
    document.body.innerHTML = `${message} at line ${lineNo}:${columnNo}`;
    return true;
};

window.gruvcalc = new Gruvcalc();
window.gruvcalc.init();