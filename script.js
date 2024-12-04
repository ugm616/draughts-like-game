document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const startGameButton = document.getElementById('start-game');

    function createBoard() {
        for (let row = 0; row < 16; row++) {
            for (let col = 0; col < 16; col++) {
                const square = document.createElement('div');
                square.classList.add('square');
                if ((row + col) % 2 === 0) {
                    square.classList.add('light');
                } else {
                    square.classList.add('dark');
                }
                board.appendChild(square);
            }
        }
    }

    function placePieces() {
        const squares = document.getElementsByClassName('square');
        // Place 12 pieces for each player
        for (let i = 0; i < 12; i++) {
            const redPiece = document.createElement('div');
            redPiece.classList.add('piece', 'red');
            redPiece.textContent = '1';
            squares[i].appendChild(redPiece);

            const bluePiece = document.createElement('div');
            bluePiece.classList.add('piece', 'blue');
            bluePiece.textContent = '1';
            squares[255 - i].appendChild(bluePiece);
        }
    }

    startGameButton.addEventListener('click', () => {
        createBoard();
        placePieces();
    });
});