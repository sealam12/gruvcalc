export class Alert {
    constructor(title, content, color="var(--color-bg2)", textColor="var(--color-fg)", timeout=5000) {
        this.title = title;
        this.content = content;
        this.color = color;
        this.textColor = textColor;
        this.timeout = timeout;

        this.alertContainer = $("#alert-container");
    }

    static info(title, content, timeout=5000) {
        (new Alert(title, content, "var(--color-bg1)", "var(--color-fg)", timeout)).show();
    }

    static error(title, content, timeout=5000) {
        (new Alert(title, content, "var(--color-error)", "var(--color-fg)", timeout)).show();
    }
    
    static success(title, content, timeout=5000) {
        (new Alert(title, content, "var(--color-success)", "var(--color-bg1)", timeout)).show();
    }

    static primary(title, content, timeout=5000) {
        (new Alert(title, content, "var(--color-primary)", "var(--color-bg1)", timeout)).show();
    }

    static secondary(title, content, timeout=5000) {
        (new Alert(title, content, "var(--color-secondary)", "var(--color-bg1)", timeout)).show();
    }

    show() {
        const alert = $(`<div></div>`);
        
        alert.attr("class", `alert`);
        alert.css("background-color", `${this.color}`);
        
        alert.html(`
            <div class="alert-title" style="color: ${this.textColor}">
                ${this.title}
            </div>
            
            <div class="alert-content" style="color: ${this.textColor}">
            ${this.content}
            </div>
        `);
        
        alert.css("color", `${this.textColor}`);
            
        this.alertContainer.prepend(alert);
        setTimeout(() => { alert.addClass("visible"); }, 1);

        if (this.timeout) {
            (async () => {
                await new Promise(resolve => setTimeout(resolve, this.timeout));
                alert.removeClass("visible");
                await new Promise(resolve => setTimeout(resolve, 500));
                alert.remove();
            })();
        }
    }
}