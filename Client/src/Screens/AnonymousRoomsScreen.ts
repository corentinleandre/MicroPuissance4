class AnonymousRoomsScreen {

    rooms: HTMLDivElement;
    message: HTMLDivElement;
    newRoom: HTMLButtonElement;
    
    constructor(
        rooms: HTMLDivElement,
        message:HTMLDivElement,
        newRoom: HTMLButtonElement
    ){
        this.rooms = rooms;
        this.message = message;
        this.newRoom = newRoom;
    }

    static makeScreen(doc:Document) : AnonymousRoomsScreen
{
        doc.body.replaceChildren(); //Empty the document

        let rooms = doc.createElement("div");
        rooms.setAttribute("id","rooms");

        let message = doc.createElement("div");
        message.setAttribute("id", "message");
        message.setAttribute("class", "message");
        message.innerHTML = "Choose a room or create your own";

        let newRoom = doc.createElement("button");
        newRoom.setAttribute("id", "newRoom");
        newRoom.innerHTML = "New Room";

        doc.body.appendChild(rooms);
        doc.body.appendChild(message);
        doc.body.appendChild(doc.createElement("br"));
        doc.body.appendChild(newRoom);

        return new AnonymousRoomsScreen(rooms,message,newRoom);
    }
}

export { AnonymousRoomsScreen }