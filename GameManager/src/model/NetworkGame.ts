import { Socket } from "socket.io";
import { SimpleGame } from "./SimpleGame";

class NetworkGame extends SimpleGame{
    player1: Socket | undefined;
    player2: Socket | undefined;

    isReady():boolean{
        if(!this.player1) return false;
        if(!this.player2) return false;
        return true;
    }

    addPlayer(newPlayer:Socket):boolean{
        if(!this.player1){
            this.player1 = newPlayer;
            return true;
        }
        if(!this.player2){
            this.player2 = newPlayer;
            return true;
        }
        return false;
    }

    getWhichPlayer(player:Socket){
        if(this.player1 == player){
            return 'X';
        }
        if(this.player2 == player){
            return 'O';
        }
        return ' ';
    }
}

export { NetworkGame }