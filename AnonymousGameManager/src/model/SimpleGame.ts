class SimpleGame {
    board: string[][];
    currentPlayer: string;

    constructor() {
        this.board = Array(6).fill(null).map(() => Array(7).fill(' '));
        this.currentPlayer = 'X'; // Le joueur 'X' sera rouge
    }


    handlePlay(col: number) {
        if (this.dropToken(col)) {
            if (this.checkWinner()) {
                //win message
            } else {
                this.switchPlayer();
                //Keep going message
            }
        }
    }


    checkWinner(): boolean {

        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 4; col++) {
                if (this.board[row][col] === this.currentPlayer &&
                    this.board[row][col] === this.board[row][col + 1] &&
                    this.board[row][col] === this.board[row][col + 2] &&
                    this.board[row][col] === this.board[row][col + 3]) {
                        return true;
                }
            }
        }


        for (let col = 0; col < 7; col++) {
            for (let row = 0; row < 3; row++) {
                if (this.board[row][col] === this.currentPlayer &&
                    this.board[row][col] === this.board[row + 1][col] &&
                    this.board[row][col] === this.board[row + 2][col] &&
                    this.board[row][col] === this.board[row + 3][col]) {
                        return true;
                }
            }
        }


        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 4; col++) {
                if (this.board[row][col] === this.currentPlayer &&
                    this.board[row][col] === this.board[row + 1][col + 1] &&
                    this.board[row][col] === this.board[row + 2][col + 2] &&
                    this.board[row][col] === this.board[row + 3][col + 3]) {
                        return true;
                }
            }
        }


        for (let row = 5; row >= 3; row--) {
            for (let col = 0; col < 4; col++) {
                if (this.board[row][col] === this.currentPlayer &&
                    this.board[row][col] === this.board[row - 1][col + 1] &&
                    this.board[row][col] === this.board[row - 2][col + 2] &&
                    this.board[row][col] === this.board[row - 3][col + 3]) {
                        return true;
                }
            }
        }

        return false;
    }


    dropToken(col: number): boolean {
        for (let row = 5; row >= 0; row--) {
            if (this.board[row][col] === ' ') {
                this.board[row][col] = this.currentPlayer;
                    return true;
            }
        }
        return false;
    }


    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }
}

export { SimpleGame }