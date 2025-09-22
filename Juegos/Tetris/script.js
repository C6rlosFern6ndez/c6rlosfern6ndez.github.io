// Variables globales
const boardRows = 20;
const boardCols = 10;
const board = Array.from({ length: boardRows }, () => Array(boardCols).fill(0));
let currentPiece = null;
let currentPos = { x: 0, y: 0 };
let score = 0;
let gameInterval;

// Definición de las piezas de Tetris
const pieces = [
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 1, 0], [0, 1, 1]], // Z
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 1, 1]], // I
    [[1, 1], [0, 1], [0, 1]], // L
    [[1, 1], [1, 0], [1, 0]] // J
];

// Función para iniciar el juego
function startGame() {
    clearInterval(gameInterval);
    board.forEach(row => row.fill(0));
    score = 0;
    updateScore();
    currentPiece = getRandomPiece();
    currentPos = { x: Math.floor(boardCols / 2) - 1, y: 0 };
    gameInterval = setInterval(moveDown, 500); // Caída automática cada 500ms
    renderBoard();
}

// Función para obtener una pieza aleatoria
function getRandomPiece() {
    return pieces[Math.floor(Math.random() * pieces.length)];
}

// Función para verificar colisiones
function checkCollision(piece, pos) {
    for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
            if (piece[y][x] && 
                (board[y + pos.y]?.[x + pos.x] || 
                 x + pos.x < 0 || 
                 x + pos.x >= boardCols || 
                 y + pos.y >= boardRows)) {
                return true;
            }
        }
    }
    return false;
}

// Función para mover la pieza hacia abajo
function moveDown() {
    if (!currentPiece) return;

    const newPos = { x: currentPos.x, y: currentPos.y + 1 };
    if (checkCollision(currentPiece, newPos)) {
        placePiece();
        clearLines();
        currentPiece = getRandomPiece();
        currentPos = { x: Math.floor(boardCols / 2) - 1, y: 0 };
        if (checkCollision(currentPiece, currentPos)) {
            endGame();
        }
    } else {
        currentPos = newPos;
    }
    renderBoard();
}

// Función para colocar la pieza en el tablero
function placePiece() {
    for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x]) {
                board[y + currentPos.y][x + currentPos.x] = 1;
            }
        }
    }
}

// Función para eliminar líneas completas
function clearLines() {
    let linesCleared = 0;
    board.forEach((row, rowIndex) => {
        if (row.every(cell => cell === 1)) {
            board.splice(rowIndex, 1);
            board.unshift(Array(boardCols).fill(0));
            linesCleared++;
        }
    });
    if (linesCleared > 0) {
        score += linesCleared * 100;
        updateScore();
    }
}

// Función para actualizar la puntuación
function updateScore() {
    document.getElementById('score').textContent = 'Puntuación: ' + score;
}

// Función para rotar la pieza
function rotatePiece() {
    const rotatedPiece = rotateArray(currentPiece);
    const testPos = { x: currentPos.x, y: currentPos.y };
    while (checkCollision(rotatedPiece, testPos)) {
        testPos.x++;
    }
    if (!checkCollision(rotatedPiece, testPos)) {
        currentPiece = rotatedPiece;
        currentPos = testPos;
    }
    renderBoard();
}

// Función para rotar una matriz
function rotateArray(array) {
    return array[0].map((_, i) => array.map(row => row[i]).reverse());
}

// Función para mover la pieza horizontalmente
function moveHorizontally(offset) {
    const newPos = { x: currentPos.x + offset, y: currentPos.y };
    if (!checkCollision(currentPiece, newPos)) {
        currentPos = newPos;
        renderBoard();
    }
}

// Función para renderizar el tablero
function renderBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = ''; // Limpiar el tablero

    // Dibujar el tablero (celdas ocupadas)
    board.forEach((row, y) => {
        row.forEach((cell, x) => {
            const div = document.createElement('div');
            div.classList.add('cell');
            if (cell === 1) {
                div.classList.add('piece'); // Celdas ocupadas por bloques fijos
            }
            gameBoard.appendChild(div);
        });
    });

    // Dibujar la pieza activa
    if (currentPiece) {
        currentPiece.forEach((row, dy) => {
            row.forEach((cell, dx) => {
                if (cell) {
                    const absX = currentPos.x + dx;
                    const absY = currentPos.y + dy;

                    // Evitar dibujar fuera del tablero
                    if (absX >= 0 && absX < boardCols && absY >= 0 && absY < boardRows) {
                        const index = absY * boardCols + absX;
                        const cellDiv = gameBoard.children[index];
                        if (cellDiv) {
                            cellDiv.classList.add('piece'); // Dibujar la pieza activa
                        }
                    }
                }
            });
        });
    }
}
// Función para finalizar el juego
function endGame() {
    clearInterval(gameInterval);
    alert('¡Juego terminado! Tu puntuación fue: ' + score);
}

// Eventos de teclado
document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowLeft':
            moveHorizontally(-1);
            break;
        case 'ArrowRight':
            moveHorizontally(1);
            break;
        case 'ArrowDown':
            moveDown();
            break;
        case 'ArrowUp':
            rotatePiece();
            break;
    }
});

// Botón para reiniciar el juego
document.getElementById('restart-button').addEventListener('click', startGame);

// Iniciar el juego al cargar la página
startGame();