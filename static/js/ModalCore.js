let Modals = [];

export function AddModal(Modal) {
    Modals.push(Modal);
    NavbarSetup();
}

export function GetModal(ModalName) {
    for (const Modal of Modals) {
        if (Modal.Name == ModalName) {
            return Modal;
        }
    }

    return undefined;
}

export function CloseModal() {
    $('#modalcontainer').hide();
}

export function OpenModal(ModalObject) {
    if (typeof(ModalObject) == "string") ModalObject = GetModal(ModalObject);
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
        <div style="width: 100%; overflow-y: auto;">
            ${ModalObject.Content}
        </div>
    </div>
    `
    
    $("#modal").html(ModalContent);
    
    $("#CloseModal").on('click', function() {
        CloseModal();
    })
    
    ModalObject.LoadScript();
    
    $('#modalcontainer').show();
}

export function NavbarSetup() {
    const Navbar = $("#navbar");
    for (const Modal of Modals) {
        if (Modal.NavbarIgnore) continue;
        const NavbarButton = $("<button></button>");
        NavbarButton.html(Modal.Title);
        NavbarButton.addClass("button");
        NavbarButton.css("width", "0px");
        NavbarButton.css("flex-grow", "1");

        NavbarButton.click( function() {
            OpenModal(Modal);
        } )

        Navbar.append(NavbarButton);
    }
}

export function ModalSetup() {
    window.AddModal = AddModal;
    window.GetModal = GetModal;
    window.CloseModal = CloseModal;
    window.OpenModal = OpenModal;
    window.NavbarSetup = NavbarSetup;
}