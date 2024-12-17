import { Server, Socket } from "socket.io";
import { NetworkGame } from "./model/NetworkGame";
import { io } from "socket.io-client";
import dotenv from 'dotenv'
import fs from 'fs'
import { isEqual } from 'lodash';
import { Collection } from 'mongoose';

const ip = "localhost"
const games: Map<Number, NetworkGame> = new Map<Number,NetworkGame>();
const connections: Map<Socket, NetworkGame> = new Map<Socket, NetworkGame>();
var nextId = 0;

const ioServer = new Server(3001, {
    cors: {
        origin: "http://" + ip + ":3000",
        methods: ["GET", "POST"]
    }
});

ioServer.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("CreateGame", (arg) => {
        games.set(nextId, new NetworkGame());
        socket.emit("GameCreated", nextId);
        nextId++;
    });

    socket.on("Join", (gameId) => {
        let game = games.get(gameId);
        if(!game){
            socket.emit("Rejected Join", "Invalid GameId");
            return;
        }
        let result = game.addPlayer(socket);
        if(!result){
            socket.emit("Rejected Join", "Game Full");
        }

        socket.emit("Joined", game.getWhichPlayer(socket));
        connections.set(socket, game);
    });

    socket.on("Play", (arg) => {
        let game = connections.get(socket);
        if(!game){
            socket.emit("Rejected Play", "Game finished or missing");
            return;
        }
        if(arg.player == game.getWhichPlayer(socket)){
            game.handlePlay(arg.col);
            if(game.isReady()){
                game.player1?.emit("UpdateBoard", {"board":game.board, "player":game.currentPlayer});
                game.player2?.emit("UpdateBoard", {"board":game.board, "player":game.currentPlayer});
            }else{
                game.player1?.emit("GameCrashed", {"board":game.board, "player":game.currentPlayer});
                game.player2?.emit("GameCrashed", {"board":game.board, "player":game.currentPlayer});
            }
        }
    })
});


console.log("setup finished");