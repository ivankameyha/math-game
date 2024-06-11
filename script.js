let score = 0;  // Puntaje inicial
let currentLevel = 'basic';  // Nivel de juego inicial
const basicOperations = ['+', '-'];  // Operaciones básicas
const advancedOperations = ['*', '/'];  // Operaciones avanzadas
let timeLeft = 30;  // Tiempo inicial en segundos
let timer;  // Variable para el cronómetro

// Preguntas de ecuaciones
const equationQuestions = [
    { equation: 'x + 2 = 5', answer: 3 },
    { equation: '2x = 10', answer: 5 },
    { equation: 'x - 3 = 2', answer: 5 },
    { equation: '3x + 1 = 10', answer: 3 },
    { equation: '6x - 3 = 9', answer: 2 },
    { equation: 'x - 12 = 87', answer: 99 },
    { equation: '53 + x = 58', answer: 5 },
    { equation: '3x - 8 = 16', answer: 8 },
    { equation: '4x + 7 = 31', answer: 6 },
    { equation: '5x - 9 = 36', answer: 9 },
    { equation: '4 + 12x = 52', answer: 4 },
    { equation: '7x - 3 = 50', answer: 8 },
    { equation: '13 - x = 10', answer: 3 },
    { equation: '7 + (12/2 - x) = 10', answer: 3 },
    { equation: '1 + (6/6 + x) = 68', answer: 66 },
    { equation: '3 + (x - 15/3) = 12', answer: 14 },
];

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
    let num1, num2, operation, correctAnswer, equation;

    // Selección de números y operación según el nivel
    if (currentLevel === 'basic') {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operation = basicOperations[Math.floor(Math.random() * basicOperations.length)];
        correctAnswer = eval(`${num1} ${operation} ${num2}`);
    } else if (currentLevel === 'advanced') {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operation = advancedOperations[Math.floor(Math.random() * advancedOperations.length)];
        if (operation === '/') {
            num1 = num1 * num2; // Asegura que la división sea exacta
        }
        correctAnswer = eval(`${num1} ${operation} ${num2}`);
    } else if (currentLevel === 'equation') {
        const randomIndex = Math.floor(Math.random() * equationQuestions.length);
        const question = equationQuestions[randomIndex];
        equation = question.equation;
        correctAnswer = question.answer;
    }

    // Genera opciones y muestra la pregunta
    const options = generateOptions(correctAnswer);
    if (currentLevel === 'equation') {
        displayEquation(equation, options, correctAnswer);
    } else {
        displayQuestion(num1, num2, operation, options, correctAnswer);
    }
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

// Muestra la ecuación y las opciones
function displayEquation(equation, options, correctAnswer) {
    document.getElementById('question').innerText = `${equation}`;
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

    // Depuración: Mostrar los valores de selectedAnswer y correctAnswer
    console.log('Selected Answer:', selectedAnswer);
    console.log('Correct Answer:', correctAnswer);

    // Verificar si la respuesta seleccionada es correcta
    if (selectedAnswer.toString() === correctAnswer.toString()) {
        // Depuración: Mostrar mensaje si la respuesta es correcta
        console.log('Respuesta Correcta');
        score += 10; // Suma 10 puntos si la respuesta es correcta
    } else {
        // Depuración: Mostrar mensaje si la respuesta es incorrecta
        console.log('Respuesta Incorrecta');
        score -= 5; // Resta 5 puntos si la respuesta es incorrecta
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
    clearInterval(timer);
}

// Reinicia el juego
function restartGame() {
    document.getElementById('level-selection').classList.remove('hidden');
    document.getElementById('game-over').classList.add('hidden');
}
