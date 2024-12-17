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
const rooms: Map<Number,Socket> = new Map<Number,Socket>();
var nextId:number = 0;

ioServer.on("connection", (socket) => {

    socket.on("disconnect", () => {
        const clientsIndex = clients.indexOf(socket);
        if (clientsIndex > -1) { // only splice array when item is found
            clients.splice(clientsIndex, 1); // 2nd parameter means remove one item only
        }

        for(let room of rooms){
            if(room[1] == socket){
                clients.forEach((client) => {client.emit("Rooms", [...rooms.keys()]);})
                rooms.delete(room[0]);
                return;
            }
        }
    })

    console.log("A user connected");

    clients.push(socket);

    socket.on("newRoom", (arg) => {
        rooms.set(nextId, socket);
        socket.emit("JoinedRoom", nextId);
        clients.forEach((client) => {
            if(client != socket){
                client.emit("Rooms", [...rooms.keys()]);
            }
        })
        nextId+=1;
    })

    socket.on("JoinRoom", (arg) => {
        let opponent = rooms.get(arg);
        if(!opponent) {socket.emit("JoinRoom Rejected", "Missing Room"); return;}

        let GameManagerSocket = io("http://anonymous-game-manager:3001");
        GameManagerSocket.on("GameCreated", (gameId) => {
            if(!opponent) return;
            opponent.emit("GameFound", gameId);
            socket.emit("GameFound", gameId);
            GameManagerSocket.close();
        });
        console.log("creating game...");
        GameManagerSocket.emit("CreateGame", null);
        rooms.delete(arg);
        clients.forEach((client) => {client.emit("Rooms", [...rooms.keys()]);});
        return;
    })
    
    //Send all the room numbers
    let toSend = [...rooms.keys()];
    socket.emit("Rooms", toSend);
    
});


console.log("setup finished");