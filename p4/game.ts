class ConnectFour {
  board: string[][];
  currentPlayer: string;
  messageElement: HTMLElement;
  boardElement: HTMLElement;

  constructor() {
    this.board = Array(6).fill(null).map(() => Array(7).fill(' '));
    this.currentPlayer = 'X'; // Le joueur 'X' sera rouge
    this.boardElement = document.getElementById('board')!;
    this.messageElement = document.getElementById('message')!;
    this.renderBoard();
  }


  renderBoard() {
    this.boardElement.innerHTML = '';
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        const cell = document.createElement('div');
        cell.className = 'cell';


        if (this.board[row][col] === 'X') {
          cell.style.backgroundColor = 'red';
        } else if (this.board[row][col] === 'O') {
          cell.style.backgroundColor = 'yellow';
        }

        cell.dataset.row = row.toString();
        cell.dataset.col = col.toString();
        cell.addEventListener('click', () => this.handleCellClick(col));
        this.boardElement.appendChild(cell);
      }
    }
  }


  handleCellClick(col: number) {
    if (this.dropToken(col)) {
      this.renderBoard();
      if (this.checkWinner()) {
        this.messageElement.textContent = `Le joueur ${this.currentPlayer} a gagné !`;
      } else {
        this.switchPlayer();
        this.messageElement.textContent = `Joueur ${this.currentPlayer}, à vous de jouer!`;
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


document.addEventListener('DOMContentLoaded', () => {
  const game = new ConnectFour();
});
