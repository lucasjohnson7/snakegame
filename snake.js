const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
document.getElementById("highscore").textContent = highScore;

let direction = "RIGHT";
let directionChanged = false;
let snake = [{ x: 200, y: 200 }];
let food = getRandomFoodPosition();
let gameInterval;
let isPaused = false; // Variable to track the pause state

function updateScore() {
    document.getElementById("score").textContent = score;
    // Update high score in real-time
    if (score > highScore) {
        highScore = score;
        document.getElementById("highscore").textContent = highScore; // Update display
        localStorage.setItem("highScore", highScore); // Save high score
    }
}

function getRandomFoodPosition() {
    const foodTypes = ["🍕", "🌭", "🍔"];
    return {
        x: Math.floor(Math.random() * canvas.width / 20) * 20,
        y: Math.floor(Math.random() * canvas.height / 20) * 20,
        type: foodTypes[Math.floor(Math.random() * foodTypes.length)]
    };
}

function changeDirection(event) {
    if (directionChanged) return;
    const key = event.keyCode;
    if (key === 37 && direction !== "RIGHT") direction = "LEFT";
    else if (key === 38 && direction !== "DOWN") direction = "UP";
    else if (key === 39 && direction !== "LEFT") direction = "RIGHT";
    else if (key === 40 && direction !== "UP") direction = "DOWN";
    directionChanged = true;
}

document.addEventListener("keydown", changeDirection);

function gameLoop() {
    if (isPaused) return; // Stop the game loop if paused

    moveSnake();
    if (checkCollision()) {
        showGameOver();
        return;
    }
    clearCanvas();
    drawFood();
    drawSnake();
    updateScore();
    directionChanged = false;
}

function showGameOver() {
    document.getElementById("finalScore").textContent = score;
    document.getElementById("gameOver").style.display = "block";
    document.getElementById("gameCanvas").style.display = "none";
    document.getElementById("pauseBtn").style.display = "none"; // Hide Pause button when game is over
}

function resetGame() {
    score = 0;
    direction = "RIGHT";
    snake = [{ x: 200, y: 200 }];
    food = getRandomFoodPosition();
    isPaused = false; 
    updateScore(); 
    clearCanvas(); 
    document.getElementById("pauseBtn").textContent = "Pause"; 
    // Do NOT start the game here; just reset the state.
}

function restartGame() {
    clearInterval(gameInterval); // Clear the existing interval
    resetGame();
    document.getElementById("gameOver").style.display = "none";
    document.getElementById("gameCanvas").style.display = "block";
    document.getElementById("pauseBtn").style.display = "block"; // Show the pause button when restarting

    // Start the game loop immediately after resetting
    startGame(); // Start the game loop again
}

function startGame() {
    gameInterval = setInterval(gameLoop, 100);
}

document.getElementById("restartBtn").addEventListener("click", restartGame);

// Toggle pause function
function togglePause() {
    isPaused = !isPaused; // Toggle the pause state
    document.getElementById("pauseBtn").textContent = isPaused ? "Resume" : "Pause"; // Update button text
}

// Add event listener for the pause button
document.getElementById("pauseBtn").addEventListener("click", togglePause);

// Handle keydown events
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && document.getElementById("gameOver").style.display === "block") {
        restartGame();
    } else if (event.key === " ") { // Space bar for Pause/Resume
        togglePause();
    }
});

// Handle click events on the canvas or document
document.addEventListener("click", (event) => {
    if (event.target.id === "restartBtn") {
        restartGame(); // Only restart if the restart button is clicked
    } else {
        togglePause(); // Otherwise, toggle pause
    }
});

function moveSnake() {
    const head = { ...snake[0] };
    if (direction === "LEFT") head.x -= 20;
    if (direction === "UP") head.y -= 20;
    if (direction === "RIGHT") head.x += 20;
    if (direction === "DOWN") head.y += 20;
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score += 1;
        food = getRandomFoodPosition();
    } else {
        snake.pop();
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = "#00FF00";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, 20, 20);
    });
}

function drawFood() {
    ctx.font = "20px 'Press Start 2P', cursive";
    ctx.fillText(food.type, food.x, food.y + 18);
}

function checkCollision() {
    const [head, ...body] = snake;
    return (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvas.width ||
        head.y >= canvas.height ||
        body.some(segment => segment.x === head.x && segment.y === head.y)
    );
}

// Start the game for the first time
startGame();
