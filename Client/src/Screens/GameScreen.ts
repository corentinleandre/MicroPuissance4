class GameScreen {

    h:HTMLHeadingElement;
    board:HTMLDivElement;
    message:HTMLDivElement;

    constructor(h:HTMLHeadingElement,
        board:HTMLDivElement,
        message:HTMLDivElement
    ){
        this.h = h;
        this.board = board;
        this.message = message;
    }

    static makeScreen(doc:Document): GameScreen{
        doc.body.replaceChildren(); //Empty the document

        let h = doc.createElement("h1");
        h.innerHTML = "Jeu puissance 4";

        let board = doc.createElement("div");
        board.setAttribute("id", "board");
        board.setAttribute("class", "board");

        let message = doc.createElement("div");
        message.setAttribute("id", "message");
        message.setAttribute("class", "message");
        message.innerHTML = "Joueur X, à vous de jouer!";

        doc.body.appendChild(h);
        doc.body.appendChild(board);
        doc.body.appendChild(message);

        return new GameScreen(h, board,message);
    }
}

export { GameScreen }