class AnonymousMatchmakerScreen {

    message: HTMLDivElement;
    
    constructor(
        message:HTMLDivElement
    ){
        this.message = message;
    }

    static makeScreen(doc:Document) : AnonymousMatchmakerScreen
{
        doc.body.replaceChildren(); //Empty the document

        let message = doc.createElement("div");
        message.innerHTML = "Matchmaking pending...";

        doc.body.appendChild(message);

        return new AnonymousMatchmakerScreen(message);
    }
}

export { AnonymousMatchmakerScreen }