import { io } from "socket.io-client";


const ip = "localhost"

console.log("launched");
const socket = io("http://" + ip + ":3001");

socket.on("AskAuth", (arg) => {
    console.log("Authentication Asked");
})

window.addEventListener('load', () => {
    
})
