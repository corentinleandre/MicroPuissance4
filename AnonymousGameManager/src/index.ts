import { Server, Socket } from "socket.io";
import { Game } from "./model/Game";
import { io } from "socket.io-client";
import dotenv from 'dotenv'
import fs from 'fs'
import { isEqual } from 'lodash';
import { Collection } from 'mongoose';

const ip = "localhost"
const games: Map<Number, Game> = new Map<Number,Game>();
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
        games.set(nextId, new Game());
        socket.emit("GameCreated", nextId);
        nextId++;
    })
});


console.log("setup finished");