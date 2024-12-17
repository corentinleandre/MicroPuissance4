class ChoiceScreen {

    matchmaking: HTMLButtonElement;
    rooms: HTMLButtonElement;
    
    constructor(
        matchmaking: HTMLButtonElement,
        rooms: HTMLButtonElement
    ){
        this.matchmaking = matchmaking;
        this.rooms = rooms;
    }

    static makeScreen(doc:Document) : ChoiceScreen
{
        doc.body.replaceChildren(); //Empty the document

        let matchmakingButton = doc.createElement("button");
        matchmakingButton.innerHTML = "Matchmaking";

        let roomsButton = doc.createElement("button");
        roomsButton.innerHTML = "Rooms";

        doc.body.appendChild(matchmakingButton);
        doc.body.appendChild(doc.createElement("br"));
        doc.body.appendChild(roomsButton);

        return new ChoiceScreen(matchmakingButton, roomsButton);
    }
}

export { ChoiceScreen }