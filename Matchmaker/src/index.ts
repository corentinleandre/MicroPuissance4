import { Server, Socket } from "socket.io";
import { io } from "socket.io-client";
import dotenv from 'dotenv'
import fs from 'fs'
import { isEqual } from 'lodash';

const ip = "localhost"

const ioServer = new Server(3001, {
    cors: {
        origin: "http://" + ip + ":3000",
        methods: ["GET", "POST"]
    }
});

const clients: Socket[] = [];
const pending: Socket[] = [];

ioServer.on("connection", (socket) => {

    socket.on("disconnect", () => {
        const clientsIndex = clients.indexOf(socket);
        if (clientsIndex > -1) { // only splice array when item is found
            clients.splice(clientsIndex, 1); // 2nd parameter means remove one item only
        }

        const pendingIndex = clients.indexOf(socket);
        if (pendingIndex > -1) { // only splice array when item is found
            clients.splice(pendingIndex, 1); // 2nd parameter means remove one item only
        }
    });

    console.log("A user connected");

    clients.push(socket);

    socket.on("JoinMatchmaking", (arg) => {
        let auth = arg.auth;
        let tokenManagerSocket = io("http://token-manager:3001");

        tokenManagerSocket.on("ValidToken", ()=> {
            if(pending.length > 0){
                let opponent = pending.shift();
                if(!opponent){
                    pending.push(socket);
                    return;
                }
                
                let GameManagerSocket = io("http://game-manager:3001");
                GameManagerSocket.on("GameCreated", (gameId) => {
                    if(!opponent) return;
                    opponent.emit("GameFound", gameId);
                    socket.emit("GameFound", gameId);
                    GameManagerSocket.close();
                });
                console.log("creating game...");
                GameManagerSocket.emit("CreateGame", null);
                return;
            }
            pending.push(socket);
            return;
        });

        tokenManagerSocket.on("InvalidToken", (arg)=> {
            socket.emit("InvalidToken", arg);
            tokenManagerSocket.close();
        })

        tokenManagerSocket.emit("CheckToken", auth);
    });
});


console.log("setup finished");