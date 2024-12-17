import { io, Socket } from "socket.io-client";
import { AuthScreen } from "./Screens/AuthScreen";
import { ModeScreen } from "./Screens/ModeScreen";
import { AnonymousChoiceScreen } from "./Screens/AnonymousChoiceScreen";
import { SocketType } from "./ServerLibs/SocketType";

enum ClientMode {
    Authenticated = "Authenticated",
    Anonymous = "Anonymous"
}

const ip = "localhost"
var token = "";
var mode:ClientMode = ClientMode.Anonymous;
var gameId: Number;

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
        case SocketType.GameManager:
        case SocketType.Matchmaker:
        case SocketType.RoomManager:
    }
    return undefined
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
                authSocket.emit("Auth", {"Username" : authscreen.usernameInput.value, "Password" : authscreen.passwordInput.value});
            })
        });
    
        authSocket.on("NewToken", (newToken) =>{
            token = newToken;
            console.log(token);
            authSocket.close();
        });
    }
    return authSocket;
}

function makeAnonymousMatchmakerSocket():Socket | undefined{
    let socketAddress = socketAddresses.get(SocketType.AnonymousMatchmaker);
    if(!socketAddress) return undefined;
    let anonymousMatchmakerSocket = io(socketAddress);
    if(anonymousMatchmakerSocket){
        anonymousMatchmakerSocket.on("GameFound", (gameId) => {
            this.gameId = gameId;
            makeSocket(SocketType.AnonymousGameManager);
            anonymousMatchmakerSocket.close();
        });
    }
    return anonymousMatchmakerSocket;
}

function makeAnonymousGameManagerSocket():Socket | undefined{
    let socketAddress = socketAddresses.get(SocketType.AnonymousGameManager);
    if(!socketAddress) return undefined;
    let anonymousGameManagerSocket = io(socketAddress);
    if(anonymousGameManagerSocket){
        
    }
    return anonymousGameManagerSocket;
}

window.addEventListener('load', () => {

    let modeScreen = ModeScreen.makeScreen(document);

    modeScreen.authenticatedModeButton.addEventListener("click", (event) => {
        makeSocket(SocketType.Authenticator);
    })

    modeScreen.authenticatedModeButton.addEventListener("click", (event) => {
        let anonymousChoiceScreen = AnonymousChoiceScreen.makeScreen(document);
        anonymousChoiceScreen.matchmaking.addEventListener("click", (event) => {
            makeSocket(SocketType.AnonymousMatchmaker);
        });
        anonymousChoiceScreen.rooms.addEventListener("click", (event) => {
            makeSocket(SocketType.AnonymousRoomManager);
        });
    })

    
})
