// Variables
let M = 10;
let squareWidth;
let cubes = [];
let COLOR_BLACK;
let COLOR_RED;
let COLOR_GREEN;
let human;
let K = 4;
let selectedCubes = 0;
let ai;
let button;
let humanCubes = [];
let aiCubes = [];
let availableCubes = M;
let availableMoves = [1, 2, K];
let humanPlaying = true;
let gameEnd = true;
let newGame = true;
// Big Screen
let gameWidth = 700;
// Medium Screen
if (window.innerWidth < 850) {
    gameWidth = 600;
}
// Small Screen 
if (window.innerWidth < 400) {
    gameWidth = 350;
}

// Get Catch Button 
let catchButton = document.getElementById('catchButton');
// Catch Button Click Function 
catchButton.addEventListener('click', () => {
    let tempCubes = cubes.splice(0, selectedCubes);
    availableCubes = cubes.length;
    createAvailableCubes(cubes.length);
    createHumanCubes(tempCubes.length + humanCubes.length)
    selectedCubes = 0;
    catchButton.disabled = true;
    changeTurn();
})

// Remove Elements From the Home Page
document.getElementById('gameStatus').style.display = 'none';
document.getElementById('catchButton').style.display = 'none';
document.getElementById('playerPlaying').style.display = 'none';
// Grid lines for debugging
function lines() {
    let rect = width / 10;
    let y = 0;
    for (let i = 0; i < 10; i++) {
        line(0, y, width, y);
        y += rect;
    }
    rect = width / 10;
    y = 0;
    for (let i = 0; i < 10; i++) {
        line(y, 0, y, height);
        y += rect;
    }
}
// Get the value for the cubes and the K 
let submit = document.getElementById('submit');
// Function to start Game
submit.addEventListener('click', () => {
    // Move to Game or to Home Page
    if (newGame) {
        let playingFirst = document.getElementById('selectPlayer').value;
        let cubeValue = document.getElementById('cubeValue').value;
        let kValue = document.getElementById('kValue').value;
        // Set the Global values for new Game
        if (cubeValue == '') {
            M = 10;
        } else {
            M = cubeValue;
        }
        if (kValue == '') {
            K = 4;
            availableMoves = [1, 2, K];
        } else {
            K = parseInt(kValue);
            availableMoves = [1, 2, K];
        }
        newGame = false;
        gameEnd = false;
        selectedCubes = 0;
        humanCubes = [];
        aiCubes = [];
        cubes = [];
        // Layout settings
        document.getElementById('selectPlayer').style.display = 'none';
        document.getElementById('cubesLabel').style.display = 'none';
        document.getElementById('kLabel').style.display = 'none';
        document.getElementById('gameStatus').style.display = 'none';
        document.getElementById('catchButton').style.display = 'inline';
        document.getElementById('playerPlaying').style.display = 'block';
        document.getElementById('submit').innerHTML = 'New Game';
        // Start the Game
        humanPlaying = true;
        loop();
        setup();
        if (playingFirst == 1) {
            changeTurn();
        }
        draw();
    } else {
        if (button != null) {
            button.style('display', 'none');
        }
        gameEnd = true;
        newGame = true;
        noLoop();
        // Layout settings
        document.getElementById('selectPlayer').style.display = 'block';
        document.getElementById('cubesLabel').style.display = 'block';
        document.getElementById('kLabel').style.display = 'block';
        document.getElementById('catchButton').style.display = 'none';
        document.getElementById('gameStatus').style.display = 'none';
        document.getElementById('submit').innerHTML = 'Start Game';
    }
})
// Setup Function for p5.js
function setup() {
    // Variables
    COLOR_BLACK = color(0, 0, 0);
    COLOR_RED = color(255, 0, 0);
    COLOR_GREEN = color(0, 255, 0);
    // Create Canvas
    let canvas = createCanvas(gameWidth, gameWidth);
    // Square width
    squareWidth = width / 10;
    // Connect canvas with html
    canvas.parent('canvasContainer')
    background(200);
    // Draw Available Cubes
    createAvailableCubes(M);
}
// Callback function p5.js
function draw() {
    if (gameEnd) {
        background(255);
        noLoop();
    } else {
        // Layout
        background(200);
        textSize(32)
        fill(0);
        text("Table: ", 0, height / 10 - (squareWidth / 3));
        text("Player 1: ", 0, height / 10 * 5 - (squareWidth / 3));
        text("Computer: ", 0, height / 10 * 8 - (squareWidth / 3));
        line(0, (height / 10) * 4, width, (height / 10) * 4);
        line(0, (height / 10) * 7, width, (height / 10) * 7);
        // lines()  // For Debug
        // Ai Plays
        if (!humanPlaying) {
            aiPlay2();
        }
        // Draw Cubes
        for (let i = 0; i < cubes.length; i++) {
            cubes[i].draw();
        }
        for (let i = 0; i < humanCubes.length; i++) {
            humanCubes[i].draw();
        }
        for (let i = 0; i < aiCubes.length; i++) {
            aiCubes[i].draw();
        }
    }
}
// Easy Level AI
function aiPlay() {
    let cubesCatch
    if (cubes.length > K) {
        cubesCatch = random(availableMoves);
    } else if (cubes.length == 2) {
        cubesCatch = random(Math.floor(random(1, 3)));
    } else {
        cubesCatch = 1;
    }
    let tempCubes = cubes.splice(0, cubesCatch);
    availableCubes = cubes.length;
    createAvailableCubes(cubes.length);
    createAICubes(tempCubes.length + aiCubes.length)
    changeTurn();
    humanPlaying = true;
}
// Check Winner in Game
function checkWinner() {
    if (cubes.length == 0) {
        gameEnd = true;
        if (humanPlaying) {
            document.getElementById('gameStatus').innerHTML = "PLAYER WINS";
            document.getElementById('gameStatus').style.display = 'block';
            document.getElementById('playerPlaying').style.display = 'none';
            return 'human';
        } else {
            document.getElementById('gameStatus').innerHTML = "COMPUTER WINS";
            document.getElementById('gameStatus').style.display = 'block';
            document.getElementById('playerPlaying').style.display = 'none';
            return 'ai';
        }
    } else {
        return null;
    }
}
// Click cubes
function mousePressed() {
    for (let i = 0; i < cubes.length; i++) {
        cubes[i].clicked();
    }
}
// Change Turn and check for winner
function changeTurn() {
    if (checkWinner() == null) {
        humanPlaying = !humanPlaying;
    } else {
        gameEnd = true;
    }
}
// Cube Class Object
class Cube {
    constructor(id, x, y, width, color) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.clickable = true;
        this.selected = false;
        this.color = color;
    }

    draw() {
        fill(this.color);
        rect(this.x, this.y, this.width, this.width);
    }

    clicked() {
        if (rectDistance(this.x, this.y, mouseX, mouseY)) {
            if (this.selected == false && selectedCubes < K) {
                this.color = COLOR_RED;
                this.selected = true;
                selectedCubes++;
                draw();
            } else if (this.selected == true) {
                this.color = COLOR_GREEN;
                this.selected = false;
                selectedCubes--;
                draw();
            }
            if (availableToCatchCubes(selectedCubes, K)) {
                catchButton.disabled = false;
            } else {
                catchButton.disabled = true;
            }
        }
    }
}
// To enable or disable Catch Button
function availableToCatchCubes(selectedCubes, k) {
    if (selectedCubes == 1) {
        return true
    }
    if (selectedCubes == 2) {
        return true
    }
    if (selectedCubes == k) {
        return true
    }
    return false
}
// Check for the correct cube
function rectDistance(x, y, mouseX, mouseY) {
    return (mouseX > x && mouseX < x + squareWidth) && (mouseY > y && mouseY < y + squareWidth);
}
// Create Cubes on the Table
function createAvailableCubes(size) {
    let startDraw = 0;
    let heightDraw = 1;
    cubes = [];
    for (let i = 0; i < size; i++) {
        cubes.push(new Cube(i, startDraw, (height / 10) * heightDraw, squareWidth, COLOR_GREEN));
        startDraw += squareWidth;
        if (i == 9) {
            heightDraw = 2;
            startDraw = 0;
        }
        if (i == 19) {
            heightDraw = 3;
            startDraw = 0;
        }
    }
}
// Create Cubes on Human Board
function createHumanCubes(size) {
    let startDraw = 0;
    let heightDraw = 5;
    humanCubes = [];
    for (let i = 0; i < size; i++) {
        humanCubes.push(new Cube(i, startDraw, (height / 10) * heightDraw, squareWidth, COLOR_GREEN));
        startDraw += squareWidth;
        if (i == 9) {
            heightDraw = 6;
            startDraw = 0;
        }
    }
}
// Create Cubes on Computer Board
function createAICubes(size) {
    let startDraw = 0;
    let heightDraw = 8;
    aiCubes = [];
    for (let i = 0; i < size; i++) {
        aiCubes.push(new Cube(i, startDraw, (height / 10) * heightDraw, squareWidth, COLOR_GREEN));
        startDraw += squareWidth;
        if (i == 9) {
            heightDraw = 9;
            startDraw = 0;
        }
    }
}
// Ai Hard Mode
function aiPlay2() {
    let cubesCatch;
    let availableCubes = cubes.length;
    let bestScore = -Infinity;
    if (cubes.length >= K) {
        for (let i = 0; i < availableMoves.length; i++) {
            availableCubes -= availableMoves[i];
            let score = minimax(availableCubes, 0, false);
            availableCubes += availableMoves[i];
            if (score > bestScore) {
                bestScore = score;
                cubesCatch = availableMoves[i];
            }
        }
    } else if (cubes.length >= 2 && cubes.length < K) {
        for (let i = 0; i < 2; i++) {
            availableCubes -= availableMoves[i];
            let score = minimax(availableCubes, 0, false);
            availableCubes += availableMoves[i];
            if (score > bestScore) {
                bestScore = score;
                cubesCatch = availableMoves[i];
            }
        }
    } else {
        cubesCatch = 1;
    }
    let tempCubes = cubes.splice(0, cubesCatch);
    availableCubes = cubes.length;
    createAvailableCubes(cubes.length);
    createAICubes(tempCubes.length + aiCubes.length)
    checkWinner();
    humanPlaying = true;
}
// Score values for the minimax 
let scores = {
    'ai': 1,
    'ai2': 0,
    'human': -1,
}
// Minimax
function minimax(availableCubes, death, isMaximazing) {
    let result = minimaxCheckWinner(availableCubes, death);
    if (result != null) {
        // Not needed
        if (result == 'ai2') {
            return 1 - death * 0.01;
        }
        let score = scores[result];
        return score;
    }
    if (isMaximazing) {
        let bestScore = -Infinity;
        for (let i = 0; i < availableMoves.length; i++) {
            availableCubes -= availableMoves[i];
            if (availableCubes >= 0) {
                let score = minimax(availableCubes, death + 1, false);
                bestScore = max(score, bestScore);
            }
            availableCubes += availableMoves[i];
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < availableMoves.length; i++) {
            availableCubes -= availableMoves[i];
            if (availableCubes >= 0) {
                let score = minimax(availableCubes, death + 1, true);
                bestScore = min(score, bestScore);
            }
            availableCubes += availableMoves[i];
        }
        return bestScore;
    }
}
// Minimax check winner
function minimaxCheckWinner(availableMoves, death) {
    if (availableMoves == 0) {
        if (death % 2 == 0) {
            if (death == 0) {
                return 'ai';
            } else {
                return 'ai2';
            }
        } else {
            return 'human';
        }
    } else if (availableMoves > 0) {
        return null;
    } else {
        return 'no';
    }
}