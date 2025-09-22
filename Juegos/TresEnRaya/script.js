// Variables globales
let currentPlayer = 'X'; // Jugador actual ('X' o 'O')
const cells = document.querySelectorAll('.cell'); // Todas las celdas del tablero
const message = document.getElementById('message'); // Mensaje de estado
const restartButton = document.getElementById('restart-button'); // Botón de reinicio
let board = Array(9).fill(null); // Representación del tablero (null = vacío)
let gameActive = true; // Estado del juego

// Función para alternar entre jugadores
function changePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('current-player').textContent = currentPlayer;
}

// Función para manejar clics en las celdas
function handleCellClick(event) {
    const cell = event.target;
    const index = parseInt(cell.getAttribute('data-index'));

    if (board[index] || !gameActive) return; // Ignorar clics en celdas ocupadas o si el juego ha terminado

    // Actualizar el tablero y la interfaz
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer);

    // Verificar si hay un ganador o empate
    checkWinner();
    changePlayer();
}

// Función para verificar ganadores
function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
        [0, 4, 8], [2, 4, 6]             // Diagonales
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            message.textContent = `¡Gana ${currentPlayer}!`;
            highlightWinningCells(combination);
            break;
        }
    }

    // Verificar empate
    if (!board.includes(null) && gameActive) {
        gameActive = false;
        message.textContent = '¡Empate!';
    }
}

// Función para resaltar las celdas ganadoras
function highlightWinningCells(combination) {
    combination.forEach(index => {
        cells[index].style.backgroundColor = '#ffcc00'; // Amarillo para resaltar
    });
}

// Función para reiniciar el juego
function restartGame() {
    window.location.reload(); // Recargar la página
}

// Agregar eventos a las celdas y al botón de reinicio
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
if (restartButton) { // Asegurarse de que el botón exista antes de agregar el listener
    restartButton.addEventListener('click', restartGame);
}