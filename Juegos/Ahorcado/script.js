// Variables globales
// const words = ['JAVASCRIPT', 'HTML', 'CSS', 'PROGRAMACION', 'COMPUTADORA', 'DESARROLLO'];
const words = [
    'JAVASCRIPT', 'HTML', 'CSS', 'PROGRAMACION', 'COMPUTADORA', 'DESARROLLO',
    'ALGORITMO', 'VARIABLE', 'FUNCION', 'OBJETO', 'CLASE', 'HERENCIA', 'POLIMORFISMO',
    'ENCAPSULAMIENTO', 'ABSTRACCION', 'RECURSIVIDAD', 'API', 'BASEDEDATOS', 'SQL',
    'PYTHON', 'JAVA', 'CPLUSPLUS', 'RUBY', 'PHP', 'SWIFT', 'KOTLIN', 'GO', 'RUST',
    'FRONTEND', 'BACKEND', 'FULLSTACK', 'DEPLOY', 'GIT', 'GITHUB', 'DOCKER', 'LINUX',
    'WINDOWS', 'MACOS', 'ANDROID', 'IOS', 'UX', 'UI', 'DISEÑO', 'INTERFAZ', 'SEGURIDAD',
    'CRIPTOGRAFIA', 'RED', 'SERVIDOR', 'CLIENTE', 'PROTOTIPO', 'DEBUGGING', 'TESTING',
    'OPTIMIZACION', 'PERFORMANCE', 'MEMORIA', 'DISCO', 'PROCESADOR', 'GPU', 'RAM',
    'ARQUITECTURA', 'MACHINELEARNING', 'INTELIGENCIARTIFICIAL', 'BIGDATA', 'BLOCKCHAIN',
    'CLOUD', 'VIRTUALIZACION', 'CONTAINER', 'MICROSERVICIOS', 'AGILE', 'SCRUM', 'KANBAN',
    'METODOLOGIAS', 'DOCUMENTACION', 'COLABORACION', 'INNOVACION', 'TECNOLOGIA', 'FUTURO'
  ];
let selectedWord = '';
let guessedLetters = [];
let incorrectGuesses = 0;
const maxAttempts = 10;

// Función para iniciar el juego
function startGame() {
    selectedWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    incorrectGuesses = 0;

    updateWordDisplay();
    resetHangman(); // Reinicia el dibujo del ahorcado
    document.getElementById('used-letters').textContent = '';
    document.getElementById('message').textContent = 'Adivina la palabra antes de que se complete el ahorcado.';
    document.getElementById('letter-input').value = '';
    document.getElementById('letter-input').disabled = false;
    document.getElementById('guess-button').disabled = false;
}

// Función para actualizar la visualización de la palabra
function updateWordDisplay() {
    const wordDisplay = document.getElementById('word-display');
    let display = '';
    for (const letter of selectedWord) {
        if (guessedLetters.includes(letter)) {
            display += letter + ' ';
        } else {
            display += '_ ';
        }
    }
    wordDisplay.textContent = display.trim();
}

// Función para reiniciar el dibujo del ahorcado
function resetHangman() {
    const hangmanParts = document.querySelectorAll('#hangman .hangman-part');
    hangmanParts.forEach(part => part.style.visibility = 'hidden');
}

// Función para actualizar el dibujo del ahorcado
function updateHangman() {
    const hangmanParts = document.querySelectorAll('#hangman .hangman-part');
    for (let i = 0; i < incorrectGuesses; i++) {
        hangmanParts[i].style.visibility = 'visible';
    }
}

// Función para manejar el intento de adivinar una letra
function guessLetter() {
    const input = document.getElementById('letter-input').value.toUpperCase();
    if (input.length !== 1 || !/[A-Z]/.test(input)) {
        alert('Por favor, ingresa una única letra válida.');
        return;
    }

    if (guessedLetters.includes(input)) {
        alert('Ya has usado esta letra.');
        return;
    }

    guessedLetters.push(input);
    if (!selectedWord.includes(input)) {
        incorrectGuesses++;
        updateHangman();
    }

    updateWordDisplay();
    document.getElementById('used-letters').textContent = guessedLetters.join(', ');

    checkGameStatus();
    document.getElementById('letter-input').value = '';
}

// Función para verificar el estado del juego
function checkGameStatus() {
    if (incorrectGuesses >= maxAttempts) {
        endGame(false);
    } else if (!document.getElementById('word-display').textContent.includes('_')) {
        endGame(true);
    }
}

// Función para finalizar el juego
function endGame(won) {
    document.getElementById('letter-input').disabled = true;
    document.getElementById('guess-button').disabled = true;

    if (won) {
        document.getElementById('message').textContent = `¡Felicidades! Adivinaste la palabra: ${selectedWord}`;
    } else {
        document.getElementById('message').textContent = `Perdiste. La palabra era: ${selectedWord}`;
    }
}

// Función para reiniciar el juego
function restartGame() {
    startGame();
}

// Inicializar el juego
startGame();

// Agregar eventos
document.getElementById('guess-button').addEventListener('click', guessLetter);
document.getElementById('restart-button').addEventListener('click', restartGame);