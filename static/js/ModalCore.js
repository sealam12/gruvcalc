let Modals = [];

export function GetModal() {

}

export function CloseModal() {
    $('.modal').fadeOut(100, function() {
        // Optionally, set the display back to 'none' after the fade-out completes
        $(this).css('display', 'none');
    });
}

export function OpenModal(ModalObject) {
    
    const ModalContent = `
    <style>
    #ModalTop {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        }
    </style>
    <div class="modal-content">
        <div id="ModalTop">
            <p>Modal: ${ModalObject.Title}</p>
            <button class="button" id="CloseModal">Close</button>
        </div>
        ${ModalObject.Content}
    </div>
    `
    
    $("#modal").html(ModalContent);
    
    $("#CloseModal").on('click', function() {
        CloseModal();
    })
    
    ModalObject.LoadScript();
    
    $('.modal').hide().fadeIn(100);
    $("#modal").css("display", "flex");
}

export function ModalSetup() {
    window.GetModal = GetModal;
    window.CloseModal = CloseModal;
    window.OpenModal = OpenModal;

    OpenModal({
        Title: "CHEESE",
        Content: "<p>cheese</p>",
        LoadScript: function() {},
    });
    setTimeout(() => {
        CloseModal();
    }, 3000);
}