class ModeScreen {

    authenticatedModeButton: HTMLButtonElement;
    anonymousModeButton: HTMLButtonElement;
    
    constructor(
        authenticatedModeButton: HTMLButtonElement,
        anonymousModeButton: HTMLButtonElement
    ){
        this.authenticatedModeButton = authenticatedModeButton;
        this.anonymousModeButton = anonymousModeButton;
    }

    static makeScreen(doc:Document) : ModeScreen{
        doc.body.replaceChildren(); //Empty the document

        let authButton = doc.createElement("button");
        authButton.innerHTML = "Authenticated Mode";

        let anonButton = doc.createElement("button");
        anonButton.innerHTML = "Anonymous Mode";

        doc.body.appendChild(authButton);
        doc.body.appendChild(doc.createElement("br"));
        doc.body.appendChild(anonButton);

        return new ModeScreen(authButton, anonButton);
    }
}

export { ModeScreen }