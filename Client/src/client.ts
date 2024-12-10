import { io } from "socket.io-client";
import { AuthScreen } from "./Screens/AuthScreen";

const ip = "localhost"

console.log("launched");
const socket = io("http://" + ip + ":3001");

window.addEventListener('load', () => {
    socket.on("AskAuth", (arg) => {
        let authscreen = AuthScreen.makeScreen(document);
        authscreen.form.addEventListener("submit", (event) => {
            if(event.cancelable){
                event.preventDefault();
            }
            socket.emit("Auth", {"Username" : authscreen.usernameInput.value, "Password" : authscreen.passwordInput.value});
        })
    });

    socket.on("Authenticated", () =>{
        
    })
})
