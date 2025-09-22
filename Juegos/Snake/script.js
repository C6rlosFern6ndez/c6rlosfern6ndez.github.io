// Variables globales
const boardSize = 20; // Tamaño del tablero (20x20)
const cellSize = 20; // Tamaño de cada celda (20px x 20px)
let snake = [{ x: 5, y: 10 }]; // Posición inicial de la serpiente
let food = { x: 5, y: 5 }; // Posición inicial de la comida
let direction = { x: 1, y: 0 }; // DIRECCIÓN INICIAL (hacia la derecha)
let score = 0; // Puntuación inicial
let gameInterval; // Intervalo del juego
let gameOver = false;

// Función para iniciar el juego
function startGame() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = ''; // Limpiar el tablero
    snake = [{ x: 5, y: 10 }]; // Reiniciar la serpiente
    food = getRandomFoodPosition(); // Generar nueva comida
    direction = { x: 1, y: 0 }; // DIRECCIÓN INICIAL (hacia la derecha)
    score = 0; // Reiniciar puntuación
    gameOver = false; // Reiniciar estado del juego
    updateScore();

    // Crear el tablero
    for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        gameBoard.appendChild(cell);
    }

    // Iniciar el intervalo del juego
    gameInterval = setInterval(updateGame, 100); // Actualizar cada 100ms
}

// Función para actualizar el juego
function updateGame() {
    if (gameOver) return;

    // Mover la serpiente
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head); // Agregar nueva cabeza

    // Verificar colisiones
    if (
        head.x < 0 || // Choca con el borde izquierdo
        head.x >= boardSize || // Choca con el borde derecho
        head.y < 0 || // Choca con el borde superior
        head.y >= boardSize || // Choca con el borde inferior
        checkCollisionWithSelf(head) // Choca consigo misma
    ) {
        endGame();
        return;
    }

    // Verificar si la serpiente come comida
    if (head.x === food.x && head.y === food.y) {
        score += 10; // Incrementar puntuación
        updateScore();
        food = getRandomFoodPosition(); // Generar nueva comida
    } else {
        snake.pop(); // Eliminar última parte de la serpiente
    }

    // Actualizar el tablero
    updateBoard();
}

// Función para verificar colisiones con el cuerpo de la serpiente
function checkCollisionWithSelf(head) {
    return snake.some((part, index) => index !== 0 && part.x === head.x && part.y === head.y);
}

// Función para generar una posición aleatoria para la comida
function getRandomFoodPosition() {
    let newFood = { x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize) };

    // Asegurarse de que la comida no esté en la serpiente
    while (snake.some(part => part.x === newFood.x && part.y === newFood.y)) {
        newFood = { x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize) };
    }

    return newFood;
}

// Función para actualizar el tablero
function updateBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('snake', 'food'));

    // Dibujar la serpiente
    snake.forEach(part => {
        const cellIndex = part.y * boardSize + part.x;
        if (cells[cellIndex]) {
            cells[cellIndex].classList.add('snake');
        }
    });

    // Dibujar la comida
    const foodIndex = food.y * boardSize + food.x;
    if (cells[foodIndex]) {
        cells[foodIndex].classList.add('food');
    }
}

// Función para finalizar el juego
function endGame() {
    clearInterval(gameInterval); // Detener el intervalo
    alert('¡Juego terminado! Tu puntuación fue: ' + score);
    gameOver = true;
}

// Función para actualizar la puntuación
function updateScore() {
    document.getElementById('score').textContent = 'Puntuación: ' + score;
}

// Eventos de teclado para controlar la serpiente
document.addEventListener('keydown', event => {
    const oppositeDirection = { x: -direction.x, y: -direction.y }; // Dirección opuesta

    switch (event.key) {
        case 'ArrowUp':
            if (direction.y !== 0) break; // No permitir cambiar a la dirección opuesta
            direction = { x: 0, y: -1 }; // Mover hacia arriba
            break;
        case 'ArrowDown':
            if (direction.y !== 0) break; // No permitir cambiar a la dirección opuesta
            direction = { x: 0, y: 1 }; // Mover hacia abajo
            break;
        case 'ArrowLeft':
            if (direction.x !== 0) break; // No permitir cambiar a la dirección opuesta
            direction = { x: -1, y: 0 }; // Mover hacia la izquierda
            break;
        case 'ArrowRight':
            if (direction.x !== 0) break; // No permitir cambiar a la dirección opuesta
            direction = { x: 1, y: 0 }; // Mover hacia la derecha
            break;
    }
});

// Botón para reiniciar el juego
document.getElementById('restart-button').addEventListener('click', startGame);

// Iniciar el juego al cargar la página
startGame();