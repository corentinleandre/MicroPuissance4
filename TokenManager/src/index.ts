import { MongooseConnection } from './database/connect';
import { Server } from "socket.io";
import dotenv from 'dotenv'
import fs from 'fs'
import { isEqual } from 'lodash';
import { DAOToken } from './DAOs/DAOToken';
import { Token } from './model/Token';

dotenv.config({path: __dirname + "./../../.env"});

let dbname = process.env.MP4_DATABASE;
console.log(process.env);
//                       wtf is this ?
const uri = "mongodb://db:27017/" + dbname ;
// for server 
var connection = new MongooseConnection(uri, { "authSource": "admin", "auth": {"username": process.env.MONGO_ROOT_U, "password": process.env.MONGO_ROOT_PWD}});
//console.log(connection.client);
var daotokenprom = DAOToken.create(connection);

let test_token : Token = new Token("IlCorentino");
daotokenprom.then((token) =>{
    token.getTokenByUser(test_token.user)
        .then((dbtoken) => {
            
        })
})

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

console.log("finished");