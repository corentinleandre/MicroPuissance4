import { MongooseConnection } from './database/connect';
import { Server } from "socket.io";
import dotenv from 'dotenv'
import fs from 'fs'
import { isEqual } from 'lodash';
import { DAOUser } from './DAOs/DAOUser';

dotenv.config({path: __dirname + "./../../.env"});

let dbname = process.env.GAME_DATABASE;
//                       wtf is this ?
const uri = "mongodb://localhost:27017/" + dbname ;
// for server 
var connection = new MongooseConnection(uri, { "authSource": "admin", "auth": {"username": process.env.MONGO_ROOT_U, "password": process.env.MONGO_ROOT_PWD}});
var daouserprom = DAOUser.create(connection);

const ip = "localhost"

const io = new Server(3001, {
    cors: {
        origin: "http://" + ip + ":3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("HW", (arg) => {
        console.log(arg);
    });

    socket.emit("Ack", "Ackh !");
});