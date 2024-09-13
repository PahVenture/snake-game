const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake;
let velocity;
let letters = 'PahVenture';
let letterIndex;
let letterPosition;
let timer;
let timerInterval;
let gameRunning;
let score;

const timeLeftElement = document.getElementById('timeLeft');
const messageElement = document.getElementById('message');
const resetButton = document.getElementById('resetButton');
const scoreValueElement = document.getElementById('scoreValue');

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    velocity = { x: 0, y: 0 };
    letterIndex = 0;
    letterPosition = { x: 15, y: 15 };
    timer = 10;
    score = 0;
    scoreValueElement.textContent = score;
    gameRunning = true;
    messageElement.textContent = '';
    resetButton.style.display = 'none';
    placeLetter();
    resetTimer();
}

function resetTimer() {
    clearInterval(timerInterval);
    timer = 10;
    timeLeftElement.textContent = timer;
    timerInterval = setInterval(() => {
        timer--;
        timeLeftElement.textContent = timer;
        if (timer <= 0) {
            gameOver('Time ran out!');
        }
    }, 1000);
}

function gameOver(reason) {
    gameRunning = false;
    clearInterval(timerInterval);
    messageElement.textContent = 'Game Over! ' + reason;
    resetButton.style.display = 'block';
}

function gameLoop() {
    if (!gameRunning) return;

    setTimeout(gameLoop, 1000 / 15); // 15 frames per second

    ctx.fillStyle = '#f9f9fb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Only move the snake if there's a non-zero velocity
    if (velocity.x !== 0 || velocity.y !== 0) {
        // Move snake
        const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };
        snake.unshift(head);

        // Check for collisions with walls
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver('You hit the wall.');
            return;
        }

        // Check for collisions with self
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver('You hit yourself.');
                return;
            }
        }

        // Check for letter capture
        if (head.x === letterPosition.x && head.y === letterPosition.y) {
            resetTimer();
            score++;
            scoreValueElement.textContent = score;
            letterIndex = (letterIndex + 1) % letters.length;
            placeLetter();
        } else {
            snake.pop();
        }
    }

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = '#012335';
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 2, gridSize - 2);

        // Draw snake body letters
        ctx.fillStyle = '#e0b04e';
        ctx.font = '14px Arial';
        const letter = letters[i % letters.length];
        ctx.fillText(letter, snake[i].x * gridSize + 4, snake[i].y * gridSize + 16);
    }

    // Draw letter to capture
    ctx.fillStyle = '#e0b04e';
    ctx.font = '20px Arial';
    ctx.fillText(letters[letterIndex], letterPosition.x * gridSize + 4, letterPosition.y * gridSize + 18);
}

function placeLetter() {
    letterPosition = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };

    // Ensure the letter doesn't appear on the snake
    for (let segment of snake) {
        if (segment.x === letterPosition.x && segment.y === letterPosition.y) {
            placeLetter();
            break;
        }
    }
}

document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    switch (e.keyCode) {
        case 37: // Left
            if (velocity.x === 0) {
                velocity = { x: -1, y: 0 };
            }
            break;
        case 38: // Up
            if (velocity.y === 0) {
                velocity = { x: 0, y: -1 };
            }
            break;
        case 39: // Right
            if (velocity.x === 0) {
                velocity = { x: 1, y: 0 };
            }
            break;
        case 40: // Down
            if (velocity.y === 0) {
                velocity = { x: 0, y: 1 };
            }
            break;
    }
});

resetButton.addEventListener('click', () => {
    resetGame();
    gameLoop();
});

resetGame();
gameLoop();
