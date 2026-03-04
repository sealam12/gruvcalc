const modalContainer = $("#modal-container");
const modalTitleText = $("#modal-title-text");
const modalCloseButton = $("#modal-close-button");
const modalContent = $("#modal-content");

export class Modal {
    constructor(title, content) {
        this.title = title;
        this.content = content;
    }
}

export class ModalManager {
    showModal(modal) {
        modalContent.html(modal.content);
        modalTitleText.text(modal.title);

        modalContainer.css("display", "flex");

        setTimeout(() => {
            modalContainer.css("opacity", "100%");
        }, 1);
    }
    
    hideModal() {
        modalContainer.css("opacity", "0%");

        setTimeout(() => {
            modalContainer.css("display", "none");
        }, 250);
    }
    
    init() {
        modalCloseButton.on("click", () => {
            this.hideModal();
        });
    }

    isOpen() {
        return modalContainer.css("display") === "flex";
    }
}