import { MongooseConnection } from './database/connect';
import { Server } from "socket.io";
import dotenv from 'dotenv'
import fs from 'fs'
import { isEqual } from 'lodash';
import { DAOUser } from './DAOs/DAOUser';
import { User } from './model/User';

let dbname = process.env.MP4_DATABASE;
//                       wtf is this ?
const uri = "mongodb://db:27017/" + dbname ;
// for server 
var connection = new MongooseConnection(uri, { "authSource": "admin", "auth": {"username": process.env.MONGO_ROOT_U, "password": process.env.MONGO_ROOT_PWD}});
//console.log(connection.client);
var daouserprom = DAOUser.create(connection);

let test_user : User = new User("IlCorentino","StrikesBack");
daouserprom.then((daouser) => {
    daouser.saveUser(test_user).then(()=>{
        console.log("save success");
    }).catch((err) => {
        console.log(err);
    })
}).catch((err) => {
    console.log(err);
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

    socket.emit("AskAuth", null);

    socket.on("Auth", (arg) => {
        console.log(arg);
    });

    
});

console.log("finished");