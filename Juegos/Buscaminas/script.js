// Variables globales
const boardSize = 10; // Tamaño del tablero (10x10)
const mineCount = 20; // Número de minas
let board = [];
let revealedCells = 0;
let flaggedCells = 0;
let gameOver = false;

// Función para iniciar el juego
function startGame() {
    board = [];
    revealedCells = 0;
    flaggedCells = 0;
    gameOver = false;
    document.getElementById('message').textContent = 'Revela todas las casillas seguras.';

    // Crear el tablero
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = ''; // Limpiar el tablero

    for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', revealCell);
        cell.addEventListener('contextmenu', flagCell); // Usar clic derecho para marcar minas
        gameBoard.appendChild(cell);

        board.push({ mine: false, revealed: false, flagged: false, neighbors: 0 });
    }

    // Colocar minas aleatorias
    placeMines();
    calculateNeighbors();
}

// Función para colocar minas en posiciones aleatorias
function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
        const index = Math.floor(Math.random() * board.length);
        if (!board[index].mine) {
            board[index].mine = true;
            minesPlaced++;
        }
    }
}

// Función para calcular el número de minas vecinas para cada casilla
function calculateNeighbors() {
    for (let i = 0; i < board.length; i++) {
        if (!board[i].mine) {
            const neighbors = getNeighborIndices(i);
            board[i].neighbors = neighbors.filter(index => board[index].mine).length;
        }
    }
}

// Función para obtener los índices de las casillas vecinas
function getNeighborIndices(index) {
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;
    const indices = [];

    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && !(r === row && c === col)) {
                indices.push(r * boardSize + c);
            }
        }
    }

    return indices;
}

// Función para revelar una casilla
function revealCell(event) {
    if (gameOver || event.target.classList.contains('revealed') || event.target.classList.contains('flagged')) return;

    const index = parseInt(event.target.dataset.index);
    const cell = board[index];
    const cellElement = event.target;

    if (cell.mine) {
        endGame(false);
        return;
    }

    revealCellRecursively(index);
    checkWinCondition();
}

// Función para revelar casillas recursivamente
function revealCellRecursively(index) {
    if (board[index].revealed || board[index].flagged) return;

    board[index].revealed = true;
    revealedCells++;

    const cellElement = document.querySelector(`.cell[data-index="${index}"]`);
    cellElement.classList.add('revealed');

    if (board[index].neighbors > 0) {
        cellElement.textContent = board[index].neighbors;
    } else {
        const neighbors = getNeighborIndices(index);
        neighbors.forEach(neighborIndex => revealCellRecursively(neighborIndex));
    }
}

// Función para marcar una casilla como mina (usando clic derecho)
function flagCell(event) {
    event.preventDefault(); // Evitar el menú contextual del navegador
    if (gameOver || event.target.classList.contains('revealed')) return;

    const index = parseInt(event.target.dataset.index);
    const cellElement = event.target;

    if (board[index].flagged) {
        board[index].flagged = false;
        flaggedCells--;
        cellElement.classList.remove('flagged');
        cellElement.textContent = '';
    } else {
        board[index].flagged = true;
        flaggedCells++;
        cellElement.classList.add('flagged');
        cellElement.textContent = '🚩';
    }
}

// Función para verificar la condición de victoria
function checkWinCondition() {
    if (revealedCells + mineCount === board.length) {
        endGame(true);
    }
}

// Función para finalizar el juego
function endGame(won) {
    gameOver = true;
    const message = won ? '¡Felicidades! Has ganado.' : '¡Boom! Has perdido.';
    document.getElementById('message').textContent = message;

    board.forEach((cell, index) => {
        const cellElement = document.querySelector(`.cell[data-index="${index}"]`);
        if (cell.mine) {
            cellElement.classList.add('mine');
            cellElement.textContent = '💣';
        }
    });
}

// Botón para reiniciar el juego
document.getElementById('restart-button').addEventListener('click', startGame);

// Iniciar el juego al cargar la página
startGame();