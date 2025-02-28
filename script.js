const bodyElement = document.querySelector('body');
class Game {
    constructor(rows, cols, cellSize) {
        this.rows = rows;
        this.cols = cols;
        this.cellSize = cellSize;
        this.grid = this.createEmptyGrid();
        this.isRunning = false;
    }

    createEmptyGrid() {
        return Array(this.rows).fill().map(() => Array(this.cols).fill(false));
    }

    randomize() {
        this.grid = this.grid.map(row => 
            row.map(() => Math.random() > 0.85)
        );
    }

    drawGliderGun() {
        // Write your function here
        const metrix = [
            [26, 1],
            [24, 2], [26, 2],
            [14, 3], [15, 3], [22, 3], [23, 3], [36, 3], [37, 3],
            [13, 4], [17, 4], [22, 4], [23, 4], [36, 4], [37, 4],
            [2, 5], [3, 5], [12, 5], [18, 5], [22, 5], [23, 5],
            [2, 6], [3, 6], [12, 6], [16, 6], [18, 6], [19, 6], [24, 6], [26, 6],
            [12, 7], [18, 7], [26, 7],
            [13, 8], [17, 8],
            [14, 9], [15, 9]
        ]

        metrix.forEach(([x, y]) => {
            this.grid[y][x] = true;
        });
    }

    drawPulsar() {
        
        const metrix = [
            [22, 10], [23, 10], [24, 10], [28, 10], [29, 10], [30, 10],
            [20, 12], [25, 12], [27, 12], [32, 12],
            [20, 13], [25, 13], [27, 13], [32, 13],
            [20, 14], [25, 14], [27, 14], [32, 14],
            [22, 15], [23, 15], [24, 15], [28, 15], [29, 15], [30, 15],
            [22, 17], [23, 17], [24, 17], [28, 17], [29, 17], [30, 17],
            [20, 18], [25, 18], [27, 18], [32, 18],
            [20, 19], [25, 19], [27, 19], [32, 19],
            [20, 20], [25, 20], [27, 20], [32, 20],
            [22, 22], [23, 22], [24, 22], [28, 22], [29, 22], [30, 22]
        ]

        metrix.forEach(([x, y]) => {
            this.grid[y][x] = true;
        });
    }

    drawPentaDecathlon() {
        const metrix = [ [24, 5], [25, 5], [26, 5], [27, 5], [28, 5], [29, 5], [30, 5], [31, 5], [32, 5], [33, 5],
[25, 4], [25, 6],
[32, 4], [32, 6]]
        metrix.forEach(([x, y]) => {
            this.grid[y][x] = true;
        });
    }

    countNeighbors(x, y) {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                const nx = (x + dx + this.cols) % this.cols;
                const ny = (y + dy + this.rows) % this.rows;
                if (this.grid[ny][nx]) count++;
            }
        }
        return count;
    }

    update() {
        const newGrid = this.createEmptyGrid();
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const neighbors = this.countNeighbors(x, y);
                const isAlive = this.grid[y][x];
                newGrid[y][x] = (isAlive && (neighbors === 2 || neighbors === 3)) ||
                              (!isAlive && neighbors === 3);
            }
        }
        this.grid = newGrid;
    }
}

class Renderer {
    constructor(canvas, game) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.game = game;
        canvas.width = game.cols * game.cellSize;
        canvas.height = game.rows * game.cellSize;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let y = 0; y < this.game.rows; y++) {
            for (let x = 0; x < this.game.cols; x++) {
                if (this.game.grid[y][x]) {
                    this.ctx.fillStyle = '#ffffff';
                    this.ctx.fillRect(
                        x * this.game.cellSize,
                        y * this.game.cellSize,
                        this.game.cellSize - 1,
                        this.game.cellSize - 1
                    );
                }
            }
        }
    }
}

// Initialize Game
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game(180, 360, 4);
    const canvas = document.getElementById('gridCanvas');
    const renderer = new Renderer(canvas, game);
    let intervalId = null;
    let speed = 50; // Default speed in milliseconds

    function startGame() {
        if (game.isRunning) {
            clearInterval(intervalId);
            intervalId = setInterval(() => {
                game.update();
                renderer.draw();
            }, speed);
        }
    }

    document.getElementById('startBtn').addEventListener('click', () => {
        game.isRunning = !game.isRunning;
        document.getElementById('startBtn').textContent = game.isRunning ? 'Stop' : 'Start';
        if (game.isRunning) {
            startGame();
        } else {
            clearInterval(intervalId);
        }
    });

    document.getElementById('clearBtn').addEventListener('click', () => {
        game.grid = game.createEmptyGrid();
        renderer.draw();
    });

    document.getElementById('randomBtn').addEventListener('click', () => {
        game.randomize();
        renderer.draw();
    });

    document.getElementById('gliderGunBtn').addEventListener('click', () => {
        game.drawGliderGun();
        renderer.draw();
    });

    document.getElementById('pulsarBtn').addEventListener('click', () => {
        game.drawPulsar();
        renderer.draw();
    });

    document.getElementById('pentaDecathlonBtn').addEventListener('click', () => {
        game.drawPentaDecathlon();
        renderer.draw();
    });

    document.getElementById('increaseSpeedBtn').addEventListener('click', () => {
        if (speed > 10) speed -= 10; // Increase speed
        startGame();
    });

    document.getElementById('decreaseSpeedBtn').addEventListener('click', () => {
        if (speed < 500) speed += 10; // Decrease speed
        startGame();
    });

    bodyElement.addEventListener('keydown', (event) => {
        if (event.key === 's') {
            game.isRunning = !game.isRunning;
            document.getElementById('startBtn').textContent = game.isRunning ? 'Stop' : 'Start';
            if (game.isRunning) {
                startGame();
            } else {
                clearInterval(intervalId);
            }
        }
        if (event.key === 'r') {
            game.randomize();
            renderer.draw();
        }
        if (event.key === 'c') {
            game.grid = game.createEmptyGrid();
            renderer.draw();
        }
        if (event.key === 'g') {
            game.drawGliderGun();
            renderer.draw();
        }
        if (event.key === 'p') {
            game.drawPulsar();
            renderer.draw();
        }
        if (event.key === 'd') {
            game.drawPentaDecathlon();
            renderer.draw();
        }
        if (event.key === '+') {
            if (speed > 10) speed -= 10;
            startGame();
        }
        if (event.key === '-') {
            if (speed < 500) speed += 10;
            startGame();
        }
    });

    renderer.draw();
});
