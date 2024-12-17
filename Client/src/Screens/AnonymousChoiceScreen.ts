class AnonymousChoiceScreen {

    matchmaking: HTMLButtonElement;
    rooms: HTMLButtonElement;
    
    constructor(
        matchmaking: HTMLButtonElement,
        rooms: HTMLButtonElement
    ){
        this.matchmaking = matchmaking;
        this.rooms = rooms;
    }

    static makeScreen(doc:Document) : AnonymousChoiceScreen
{
        doc.body.replaceChildren(); //Empty the document

        let matchmakingButton = doc.createElement("button");
        matchmakingButton.innerHTML = "Authenticated Mode";

        let roomsButton = doc.createElement("button");
        roomsButton.innerHTML = "Anonymous Mode";

        doc.body.appendChild(matchmakingButton);
        doc.body.appendChild(doc.createElement("br"));
        doc.body.appendChild(roomsButton);

        return new AnonymousChoiceScreen(matchmakingButton, roomsButton);
    }
}

export { AnonymousChoiceScreen }