import { MongooseConnection } from './database/connect';
import { Server } from "socket.io";
import dotenv from 'dotenv'
import fs from 'fs'
import { isEqual } from 'lodash';
import { DAOToken } from './DAOs/DAOToken';
import { Token } from './model/Token';

let dbname = process.env.MP4_DATABASE;
//                       wtf is this ?
const uri = "mongodb://db:27017/" + dbname ;
// for server 
var connection = new MongooseConnection(uri, { "authSource": "admin", "auth": {"username": process.env.MONGO_ROOT_U, "password": process.env.MONGO_ROOT_PWD}});
//console.log(connection.client);
var daotokenprom = DAOToken.create(connection);

const ip = "localhost"

let test_token : Token = new Token("IlCorentino");
daotokenprom.then((daotoken) =>{
    /*daotoken.saveToken(test_token).then(() => {
        console.log("save success");
    });*/

    const io = new Server(3001, {
        cors: {
            origin: "http://" + ip + ":3000",
            methods: ["GET", "POST"]
        }
    });
    
    io.on("connection", (socket) => {
        socket.on("CreateToken", async (username) => {
            let token = new Token(username);
            daotoken.saveToken(token).then((token) => {
                socket.emit("CreatedToken", token.dbid);
            })
        })

        socket.on("CheckToken", (auth) => {
            daotoken.getTokenByDBID(auth.token).then((token) => {
                if(!token){ socket.emit("InvalidToken", auth.username); return;}
                if(token.user != auth.username){ socket.emit("InvalidToken", auth.username); return;}
                daotoken.saveToken(token);
                socket.emit("ValidToken", token.user);
            });
        })
    });
})





console.log("finished");