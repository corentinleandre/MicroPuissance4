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
    console.log("A user connected");

    clients.push(socket);

    if(pending.length > 0){
        let opponent = pending.shift();
        if(!opponent){
            pending.push(socket);
            return;
        }

        let GameManagerSocket = io("http://game-manager:3001");
        GameManagerSocket.on("GameCreated", (gameId) => {
            opponent.emit("GameFound", gameId);
            socket.emit("GameFound", gameId);
            GameManagerSocket.close();
        });
        GameManagerSocket.emit("CreateGame");
        return;
    }
    pending.push(socket);
    return;
    
});


console.log("setup finished");