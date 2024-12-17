import { io, Socket } from "socket.io-client";
import { AuthScreen } from "./Screens/AuthScreen";
import { ModeScreen } from "./Screens/ModeScreen";
import { ChoiceScreen } from "./Screens/ChoiceScreen";
import { AnonymousMatchmakerScreen } from "./Screens/AnonymousMatchmakerScreen";
import { AnonymousRoomsScreen } from "./Screens/AnonymousRoomsScreen";
import { RoomScreen } from "./Screens/RoomScreen";
import { GameScreen } from "./Screens/GameScreen";
import { SocketType } from "./ServerLibs/SocketType";

enum ClientMode {
    Authenticated = "Authenticated",
    Anonymous = "Anonymous"
}

const ip = "localhost"
var auth = {"username":"", "token":""}
var mode:ClientMode = ClientMode.Anonymous;
var gameId: Number;
var whichPlayer = '';

console.log("launched");

const socketAddresses: Map<SocketType, string> = new Map<SocketType,string>([
    [SocketType.Authenticator,"http://" + ip + ":3001"],
    [SocketType.AnonymousMatchmaker, "http://" + ip + ":3002"],
    [SocketType.AnonymousRoomManager, "http://" + ip + ":3003"],
    [SocketType.AnonymousGameManager, "http://" + ip + ":3004"],
    [SocketType.Matchmaker, "http://" + ip + ":3005"],
    [SocketType.RoomManager, "http://" + ip + ":3006"],
    [SocketType.GameManager, "http://" + ip + ":3007"]
]);

const openedSockets:Map<SocketType, Socket> = new Map<SocketType, Socket>();

function getSocket(socketType:SocketType):Socket | undefined{
    // return opened socket if it exists
    if(openedSockets.get(socketType)){
        return openedSockets.get(socketType);
    }

    //else create it
    let socket = makeSocket(socketType);
    if(socket){
        openedSockets.set(socketType, socket);
        return socket;
    }
    
    //else crash and burn I guess
    return undefined;
}

function makeSocket(socketType:SocketType): Socket | undefined{
    switch(socketType){
        case SocketType.Authenticator:
            return makeAuthenticatorSocket();
        case SocketType.AnonymousGameManager:
            return makeAnonymousGameManagerSocket();
        case SocketType.AnonymousMatchmaker:
            return makeAnonymousMatchmakerSocket();
        case SocketType.AnonymousRoomManager:
            return makeAnonymousRoomManagerSocket();
        case SocketType.GameManager:
            return makeGameManagerSocket();
        case SocketType.Matchmaker:
            return makeMatchmakerSocket();
        case SocketType.RoomManager:
            return makeRoomManagerSocket();
    }
    return undefined
}

function makeAnonymousMatchmakerSocket():Socket | undefined{
    let socketAddress = socketAddresses.get(SocketType.AnonymousMatchmaker);
    if(!socketAddress) return undefined;
    let anonymousMatchmakerSocket = io(socketAddress);
    if(anonymousMatchmakerSocket){
        let anonymousMatchmakerScreen = AnonymousMatchmakerScreen.makeScreen(document);
        anonymousMatchmakerSocket.on("GameFound", (newGameId) => {
            anonymousMatchmakerScreen.message.innerHTML = "Game Found with id " + newGameId;
            gameId = newGameId;
            makeSocket(SocketType.AnonymousGameManager);
            anonymousMatchmakerSocket.close();
        });
    }
    return anonymousMatchmakerSocket;
}

function makeAnonymousRoomManagerSocket():Socket | undefined{
    let socketAddress = socketAddresses.get(SocketType.AnonymousRoomManager);
    if(!socketAddress) return undefined;
    let anonymousRoomManagerSocket = io(socketAddress);
    if(anonymousRoomManagerSocket){
        let anonymousRoomsScreen = AnonymousRoomsScreen.makeScreen(document);

        anonymousRoomsScreen.newRoom.addEventListener("click", (event) => {
            anonymousRoomManagerSocket.emit("newRoom");
        })

        anonymousRoomManagerSocket.on("JoinedRoom", (arg) => {
            let roomScreen = RoomScreen.makeScreen(document);
            roomScreen.message.innerHTML = 'In Room ' + arg;
        })

        anonymousRoomManagerSocket.on("GameFound", (newGameId) => {
            console.log("Game Found with id " + newGameId);
            gameId = newGameId;
            makeSocket(SocketType.AnonymousGameManager);
            anonymousRoomManagerSocket.close();
        });

        anonymousRoomManagerSocket.on("Rooms", (list) => {
            anonymousRoomsScreen.rooms.innerHTML = '';
            for(let roomId of list){
                let button = document.createElement("button");
                button.innerHTML = "Room " + roomId;
                button.addEventListener("click", ()=>{
                    anonymousRoomManagerSocket.emit("JoinRoom", roomId);
                });
                anonymousRoomsScreen.rooms.appendChild(button);
                anonymousRoomsScreen.rooms.appendChild(document.createElement("br"));
            }
        })
    }
    return anonymousRoomManagerSocket;
}

function makeAnonymousGameManagerSocket():Socket | undefined{
    let socketAddress = socketAddresses.get(SocketType.AnonymousGameManager);
    if(!socketAddress) return undefined;
    let anonymousGameManagerSocket = io(socketAddress);
    if(anonymousGameManagerSocket){
        let gameScreen = GameScreen.makeScreen(document);
        anonymousGameManagerSocket.on("JoinedGame", (arg) => {
            whichPlayer = arg;
            if(whichPlayer == 'X'){
                gameScreen.message.innerHTML = "Your turn";
            }else{
                gameScreen.message.innerHTML = "Waiting for opponent";
            }
        })

        anonymousGameManagerSocket.on("UpdateBoard", (arg) => {
            console.log("Received UpdatedBoard");
            let newBoard = arg.board;
            let nextPlayer = arg.player;
            gameScreen.board.innerHTML = '';
            for (let row = 0; row < 6; row++) {
                for (let col = 0; col < 7; col++) {
                    const cell = document.createElement('div');
                    cell.className = 'cell';
            
                    if (newBoard[row][col] === 'X') {
                        cell.style.backgroundColor = 'red';
                    } else if (newBoard[row][col] === 'O') {
                        cell.style.backgroundColor = 'yellow';
                    }
            
                    cell.dataset.row = row.toString();
                    cell.dataset.col = col.toString();
                    cell.addEventListener('click', () => {
                        anonymousGameManagerSocket.emit("Play", col);
                    });
                    gameScreen.board.appendChild(cell);
                }
            }

            if(nextPlayer == whichPlayer){
                gameScreen.message.innerHTML = "Your turn";
            }else{
                gameScreen.message.innerHTML = "Waiting for opponent";
            }
        })

        anonymousGameManagerSocket.emit("JoinGame", gameId);
    }
    return anonymousGameManagerSocket;
}

function makeAuthenticatorSocket(): Socket | undefined{
    let socketAddress = socketAddresses.get(SocketType.Authenticator);
    if(!socketAddress) return undefined;
    let authSocket = io(socketAddress);
    if(authSocket){
        authSocket.on("AskAuth", (arg) => {
            let authscreen = AuthScreen.makeScreen(document);
            authscreen.form.addEventListener("submit", (event) => {
                if(event.cancelable){
                    event.preventDefault();
                }
                auth.username = authscreen.usernameInput.value;
                authSocket.emit("Auth", {"Username" : authscreen.usernameInput.value, "Password" : authscreen.passwordInput.value});
            })
        });
    
        authSocket.on("NewToken", (newToken) =>{
            auth.token = newToken;
            console.log(auth.token);
            authSocket.close();
            let choiceScreen = ChoiceScreen.makeScreen(document);
            choiceScreen.matchmaking.addEventListener("click", (event) => {
                makeSocket(SocketType.Matchmaker);
            });
            choiceScreen.rooms.addEventListener("click", (event) => {
                makeSocket(SocketType.RoomManager);
            });
        });
    }
    return authSocket;
}

function makeMatchmakerSocket():Socket | undefined{
    let socketAddress = socketAddresses.get(SocketType.AnonymousMatchmaker);
    if(!socketAddress) return undefined;
    let matchmakerSocket = io(socketAddress);
    matchmakerSocket.emit("JoinMatchmaking", {"auth": auth});
    if(matchmakerSocket){
        let matchmakerScreen = AnonymousMatchmakerScreen.makeScreen(document);
        matchmakerSocket.on("GameFound", (newGameId) => {
            matchmakerScreen.message.innerHTML = "Game Found with id " + newGameId;
            gameId = newGameId;
            makeSocket(SocketType.AnonymousGameManager);
            matchmakerSocket.close();
        });
    }
    matchmakerSocket.on("InvalidToken", () => {
        console.log("Token is invalid, could not join matchmaking");
        matchmakerSocket.close();
    })
    return matchmakerSocket;
}

function makeRoomManagerSocket():Socket | undefined{
    let socketAddress = socketAddresses.get(SocketType.RoomManager);
    if(!socketAddress) return undefined;
    let roomManagerSocket = io(socketAddress);
    if(roomManagerSocket){
        let roomsScreen = AnonymousRoomsScreen.makeScreen(document);

        roomsScreen.newRoom.addEventListener("click", (event) => {
            roomManagerSocket.emit("newRoom", {"auth":auth});
        })

        roomManagerSocket.on("JoinedRoom", (arg) => {
            let roomScreen = RoomScreen.makeScreen(document);
            roomScreen.message.innerHTML = 'In Room ' + arg;
        })

        roomManagerSocket.on("GameFound", (newGameId) => {
            console.log("Game Found with id " + newGameId);
            gameId = newGameId;
            makeSocket(SocketType.GameManager);
            roomManagerSocket.close();
        });

        roomManagerSocket.on("Rooms", (list) => {
            roomsScreen.rooms.innerHTML = '';
            for(let roomId of list){
                let button = document.createElement("button");
                button.innerHTML = "Room " + roomId;
                button.addEventListener("click", ()=>{
                    roomManagerSocket.emit("JoinRoom", {"roomId":roomId, "auth":auth});
                });
                roomsScreen.rooms.appendChild(button);
                roomsScreen.rooms.appendChild(document.createElement("br"));
            }
        })
    }
    return roomManagerSocket;
}

function makeGameManagerSocket():Socket | undefined{
    let socketAddress = socketAddresses.get(SocketType.GameManager);
    if(!socketAddress) return undefined;
    let gameManagerSocket = io(socketAddress);
    if(gameManagerSocket){
        let gameScreen = GameScreen.makeScreen(document);
        gameManagerSocket.on("JoinedGame", (arg) => {
            whichPlayer = arg;
            if(whichPlayer == 'X'){
                gameScreen.message.innerHTML = "Your turn";
            }else{
                gameScreen.message.innerHTML = "Waiting for opponent";
            }
        })

        gameManagerSocket.on("UpdateBoard", (arg) => {
            console.log("Received UpdatedBoard");
            let newBoard = arg.board;
            let nextPlayer = arg.player;
            gameScreen.board.innerHTML = '';
            for (let row = 0; row < 6; row++) {
                for (let col = 0; col < 7; col++) {
                    const cell = document.createElement('div');
                    cell.className = 'cell';
            
                    if (newBoard[row][col] === 'X') {
                        cell.style.backgroundColor = 'red';
                    } else if (newBoard[row][col] === 'O') {
                        cell.style.backgroundColor = 'yellow';
                    }
            
                    cell.dataset.row = row.toString();
                    cell.dataset.col = col.toString();
                    cell.addEventListener('click', () => {
                        gameManagerSocket.emit("Play", {"col":col, "auth":auth});
                    });
                    gameScreen.board.appendChild(cell);
                }
            }

            if(nextPlayer == whichPlayer){
                gameScreen.message.innerHTML = "Your turn";
            }else{
                gameScreen.message.innerHTML = "Waiting for opponent";
            }
        })

        gameManagerSocket.emit("JoinGame", {"gameId":gameId, "auth":auth});
    }
    return gameManagerSocket;
}

window.addEventListener('load', () => {

    let modeScreen = ModeScreen.makeScreen(document);

    modeScreen.authenticatedModeButton.addEventListener("click", (event) => {
        mode = ClientMode.Authenticated;
        makeSocket(SocketType.Authenticator);
    })

    modeScreen.anonymousModeButton.addEventListener("click", (event) => {
        mode = ClientMode.Anonymous;
        let choiceScreen = ChoiceScreen.makeScreen(document);
        choiceScreen.matchmaking.addEventListener("click", (event) => {
            makeSocket(SocketType.AnonymousMatchmaker);
        });
        choiceScreen.rooms.addEventListener("click", (event) => {
            makeSocket(SocketType.AnonymousRoomManager);
        });
    })

    
})
