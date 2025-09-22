// Variables globales
const cards = [
    '🌟', '🌟',
    '🎈', '🎈',
    '🎁', '🎁',
    '🎂', '🎂',
    '🎉', '🎉',
    '🎊', '🎊',
    '🔥', '🔥',
    '✨', '✨'
];

let flippedCards = [];
let matchedPairs = 0;
let gameActive = true;

// Función para mezclar las cartas
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Función para crear el tablero
function createBoard() {
    const board = document.getElementById('board');
    const shuffledCards = shuffle([...cards]);

    shuffledCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card'); // Inicialmente no tiene la clase "flipped"
        cardElement.dataset.index = index;

        // Crear lados de la carta
        const front = document.createElement('div');
        front.classList.add('front');
        const back = document.createElement('div');
        back.classList.add('back');
        back.textContent = card;

        cardElement.appendChild(front);
        cardElement.appendChild(back);

        // Agregar evento de clic
        cardElement.addEventListener('click', () => flipCard(cardElement));

        board.appendChild(cardElement);
    });
}

// Función para voltear una carta
function flipCard(card) {
    if (!gameActive || card.classList.contains('flipped') || card.classList.contains('match')) return;

    card.classList.add('flipped'); // Agregar la clase "flipped" para mostrar la cara posterior
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        gameActive = false;
        checkMatch(flippedCards[0], flippedCards[1]);
    }
}

// Función para verificar si hay un par
function checkMatch(card1, card2) {
    if (card1.children[1].textContent === card2.children[1].textContent) {
        card1.classList.add('match');
        card2.classList.add('match');
        matchedPairs++;

        if (matchedPairs === cards.length / 2) {
            setTimeout(() => {
                document.getElementById('message').textContent = '¡Felicidades! Has encontrado todos los pares.';
            }, 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped'); // Ocultar las cartas que no coinciden
            card2.classList.remove('flipped');
        }, 1000);
    }

    flippedCards = [];
    setTimeout(() => {
        gameActive = true;
    }, 1000);
}

// Función para reiniciar el juego
function restartGame() {
    document.getElementById('message').textContent = 'Encuentra todos los pares';
    gameActive = true;
    matchedPairs = 0;
    flippedCards = [];

    const board = document.getElementById('board');
    board.innerHTML = ''; // Limpiar el tablero
    createBoard();
}

// Inicializar el juego
createBoard();

// Agregar evento al botón de reinicio
document.getElementById('restart-button').addEventListener('click', restartGame);