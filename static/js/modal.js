const modalContainer = $("#modal-container");
const modalTitleText = $("#modal-title-text");
const modalCloseButton = $("#modal-close-button");
const modalContent = $("#modal-content");

export class ModalManager {
    showModal(modal) {
        modalContent.html(modal.content);
        modalTitleText.text(modal.title);
        modalContainer.css("display", "flex");
    }
    
    hideModal() {
        modalContainer.css("display", "none");
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