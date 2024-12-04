document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    const board = document.getElementById('board');
    const startGameButton = document.getElementById('start-game');
    const player1ColorSelect = document.getElementById('player1-color');
    const player2ColorSelect = document.getElementById('player2-color');
    const items = ['⚡', '🛡️', '🚀', '🔄'];
    const startingPieceIndices = new Set([...Array(12).keys(), ...Array.from({ length: 12 }, (_, i) => 255 - i)]);
    let currentPlayer = 'player1';
    let selectedPiece = null;
    let validMoves = [];

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
                square.addEventListener('click', handleSquareClick);
                board.appendChild(square);
                console.log('Square created at row:', row, 'col:', col);
            }
        }
    }

    function placePieces(player1Color, player2Color) {
        const squares = document.getElementsByClassName('square');
        for (let i = 0; i < 12; i++) {
            const player1Piece = document.createElement('div');
            player1Piece.classList.add('piece', player1Color);
            player1Piece.dataset.player = 'player1';
            player1Piece.textContent = '1';
            squares[i].appendChild(player1Piece);
            console.log('Player 1 piece placed at index:', i);

            const player2Piece = document.createElement('div');
            player2Piece.classList.add('piece', player2Color);
            player2Piece.dataset.player = 'player2';
            player2Piece.textContent = '1';
            squares[255 - i].appendChild(player2Piece);
            console.log('Player 2 piece placed at index:', 255 - i);
        }
    }

    function movePiece(piece, targetSquare) {
        const currentSquare = piece.parentNode;
        if (targetSquare.querySelector('.item')) {
            targetSquare.querySelector('.item').remove();
        }
        currentSquare.removeChild(piece);
        targetSquare.appendChild(piece);
    }

    function handleSquareClick(event) {
        const targetSquare = event.target.closest('.square');
        if (!targetSquare) return;

        if (selectedPiece) {
            if (validMoves.includes(targetSquare)) {
                movePiece(selectedPiece, targetSquare);
                endTurn();
            } else {
                clearHighlights();
            }
            selectedPiece = null;
        } else if (targetSquare.querySelector('.piece')) {
            const piece = targetSquare.querySelector('.piece');
            if (piece.dataset.player === currentPlayer) {
                selectPiece(piece);
            }
        }
    }

    function selectPiece(piece) {
        clearHighlights();
        selectedPiece = piece;
        piece.classList.add('highlight');
        const currentSquare = piece.parentNode;
        validMoves = getValidMoves(currentSquare);
        validMoves.forEach(square => square.classList.add('highlight'));
        console.log('Piece selected. Valid moves:', validMoves);
    }

    function clearHighlights() {
        document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
    }

    function getValidMoves(square) {
        const squares = document.getElementsByClassName('square');
        const index = Array.from(squares).indexOf(square);
        const moves = [];

        // Diagonal moves
        if (index >= 16 && index % 16 !== 0) moves.push(squares[index - 17]); // up-left
        if (index >= 16 && index % 16 !== 15) moves.push(squares[index - 15]); // up-right
        if (index < 240 && index % 16 !== 0) moves.push(squares[index + 15]); // down-left
        if (index < 240 && index % 16 !== 15) moves.push(squares[index + 17]); // down-right

        // Orthogonal moves if one square away from item or enemy piece, but not if one square away from friendly piece
        const orthogonalMoves = [];
        if (index % 16 !== 0) orthogonalMoves.push(squares[index - 1]); // left
        if (index % 16 !== 15) orthogonalMoves.push(squares[index + 1]); // right
        if (index >= 16) orthogonalMoves.push(squares[index - 16]); // up
        if (index < 240) orthogonalMoves.push(squares[index + 16]); // down

        const isOneSquareAwayFromItemOrPiece = (orthogonalMove) => {
            const adjacentIndices = [
                index - 17, index - 15, index + 15, index + 17,
                index - 1, index + 1, index - 16, index + 16
            ];
            return adjacentIndices.some(adjIndex => {
                const adjSquare = squares[adjIndex];
                if (!adjSquare) return false;
                return adjSquare.querySelector('.item') || adjSquare.querySelector('.piece');
            });
        };

        const isOneSquareAwayFromFriendlyPiece = (orthogonalMove) => {
            const adjacentIndices = [
                index - 1, index + 1, index - 16, index + 16
            ];
            return adjacentIndices.some(adjIndex => {
                const adjSquare = squares[adjIndex];
                if (!adjSquare) return false;
                const piece = adjSquare.querySelector('.piece');
                return piece && piece.dataset.player === currentPlayer;
            });
        };

        orthogonalMoves.forEach(move => {
            if (isOneSquareAwayFromItemOrPiece(move) && !isOneSquareAwayFromFriendlyPiece(move)) {
                moves.push(move);
            }
        });

        return moves.filter(sq => !sq.querySelector('.piece'));
    }

    function endTurn() {
        currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
        clearHighlights();
    }

    function placeItems() {
        const squares = document.getElementsByClassName('square');
        for (let i = 0; i < items.length * 4; i++) {
            let randomSquare;
            do {
                randomSquare = Math.floor(Math.random() * squares.length);
            } while (startingPieceIndices.has(randomSquare) || squares[randomSquare].querySelector('.item'));
            const item = document.createElement('div');
            item.classList.add('item');
            item.textContent = items[Math.floor(i / 4)];
            squares[randomSquare].appendChild(item);
        }
    }

    startGameButton.addEventListener('click', () => {
        createBoard();
        const player1Color = player1ColorSelect.value;
        const player2Color = player2ColorSelect.value;
        placePieces(player1Color, player2Color);
        placeItems();
        startGameButton.style.display = 'none'; // Remove the start game button
    });
});
