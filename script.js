let score = 0;  // Puntaje inicial
let currentLevel = 'basic';  // Nivel de juego inicial
const basicOperations = ['+', '-'];  // Operaciones básicas
const advancedOperations = ['*', '/'];  // Operaciones avanzadas
let timeLeft = 30;  // Tiempo inicial en segundos
let timer;  // Variable para el cronómetro

// Inicia el juego con el nivel seleccionado
function startGame(level) {
    currentLevel = level;
    score = 0;
    timeLeft = 30;
    document.getElementById('score').innerText = score;
    document.getElementById('timer').innerText = `Tiempo: ${timeLeft}s`;
    document.getElementById('level-selection').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
    document.getElementById('game-over').classList.add('hidden');
    startTimer();
    generateQuestion();
}

// Inicia el cronómetro
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = `Tiempo: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

// Genera una nueva pregunta
function generateQuestion() {
    let num1, num2, operation, correctAnswer;
    
    // Selección de números y operación según el nivel
    if (currentLevel === 'basic') {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operation = basicOperations[Math.floor(Math.random() * basicOperations.length)];
    } else {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operation = advancedOperations[Math.floor(Math.random() * advancedOperations.length)];
        if (operation === '/') {
            num1 = num1 * num2; // Asegura que la división sea exacta
        }
    }

    // Calcula la respuesta correcta
    correctAnswer = eval(`${num1} ${operation} ${num2}`);

    // Genera opciones y muestra la pregunta
    const options = generateOptions(correctAnswer);
    displayQuestion(num1, num2, operation, options, correctAnswer);
}

// Genera opciones de respuesta
function generateOptions(correctAnswer) {
    const options = [];
    options.push(correctAnswer);
    while (options.length < 3) {
        const option = correctAnswer + Math.floor(Math.random() * 10) - 5;
        if (!options.includes(option) && option !== correctAnswer) {
            options.push(option);
        }
    }
    return shuffleArray(options);
}

// Mezcla las opciones
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Muestra la pregunta y las opciones
function displayQuestion(num1, num2, operation, options, correctAnswer) {
    document.getElementById('question').innerText = `${num1} ${operation} ${num2} = ?`;
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.onclick = () => checkAnswer(button, option, correctAnswer);
        optionsDiv.appendChild(button);
    });
}

// Verifica la respuesta seleccionada
function checkAnswer(button, selectedAnswer, correctAnswer) {
    const buttons = document.querySelectorAll('#options button');
    buttons.forEach(btn => {
        if (parseInt(btn.innerText) === correctAnswer) {
            btn.classList.add('correct');
        } else {
            btn.classList.add('incorrect');
        }
        btn.disabled = true;
    });

    // Actualiza el puntaje
    if (selectedAnswer === correctAnswer) {
        score += 10;
    } else {
        score -= 5;
    }
    document.getElementById('score').innerText = score;

    // Genera una nueva pregunta después de 1 segundo
    setTimeout(generateQuestion, 1000);
}

// Termina el juego y muestra el puntaje final
function endGame() {
    document.getElementById('game').classList.add('hidden');
    document.getElementById('game-over').classList.remove('hidden');
    document.getElementById('final-score').innerText = score;
}

// Reinicia el juego
function restartGame() {
    document.getElementById('level-selection').classList.remove('hidden');
    document.getElementById('game-over').classList.add('hidden');
}
