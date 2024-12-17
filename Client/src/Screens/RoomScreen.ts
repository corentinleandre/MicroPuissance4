class RoomScreen {

    message: HTMLDivElement;
    
    constructor(
        message:HTMLDivElement
    ){
        this.message = message;
    }

    static makeScreen(doc:Document) : RoomScreen
{
        doc.body.replaceChildren(); //Empty the document

        let message = doc.createElement("div");
        message.innerHTML = "In Room...";

        doc.body.appendChild(message);

        return new RoomScreen(message);
    }
}

export { RoomScreen }