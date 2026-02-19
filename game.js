// Snake Game - Phaser.js

let snake;
let food;
let cursors;
let score = 0;
let scoreText;
let gameOver = false;
let gameOverText;
let restartText;
let lastMoveTime = 0;
let moveInterval = 150;
let direction = 'right';
let nextDirection = 'right';

function preload() {
    // Create simple textures programmatically
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    
    // Snake body texture (green square)
    graphics.fillStyle(0x00ff00);
    graphics.fillRect(0, 0, 20, 20);
    graphics.generateTexture('snake', 20, 20);
    
    // Food texture (red square)
    graphics.clear();
    graphics.fillStyle(0xff0000);
    graphics.fillRect(0, 0, 20, 20);
    graphics.generateTexture('food', 20, 20);
}

function create() {
    // Background
    this.cameras.main.setBackgroundColor('#1a1a2e');
    
    // Initialize snake as an array of sprites
    snake = [];
    const startX = 400;
    const startY = 300;
    
    // Create initial snake (3 segments)
    for (let i = 0; i < 3; i++) {
        const segment = this.physics.add.sprite(startX - i * 20, startY, 'snake');
        snake.push(segment);
    }
    
    // Create food
    food = this.physics.add.sprite(0, 0, 'food');
    this.placeFood();
    
    // Score text
    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '24px',
        fill: '#ffffff',
        fontFamily: 'Arial'
    });
    
    // Game over text (initially hidden)
    gameOverText = this.add.text(400, 250, 'GAME OVER', {
        fontSize: '48px',
        fill: '#ff0000',
        fontFamily: 'Arial'
    });
    gameOverText.setOrigin(0.5);
    gameOverText.setVisible(false);
    
    // Restart text (initially hidden)
    restartText = this.add.text(400, 300, 'Press SPACE to restart', {
        fontSize: '24px',
        fill: '#ffffff',
        fontFamily: 'Arial'
    });
    restartText.setOrigin(0.5);
    restartText.setVisible(false);
    
    // Controls
    cursors = this.input.keyboard.createCursorKeys();
    
    // Space key for restart
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}

function update(time) {
    if (gameOver) {
        if (this.spaceKey.isDown) {
            this.scene.restart();
            score = 0;
            gameOver = false;
            direction = 'right';
            nextDirection = 'right';
        }
        return;
    }
    
    // Handle input for next direction
    if (cursors.left.isDown && direction !== 'right') {
        nextDirection = 'left';
    } else if (cursors.right.isDown && direction !== 'left') {
        nextDirection = 'right';
    } else if (cursors.up.isDown && direction !== 'down') {
        nextDirection = 'up';
    } else if (cursors.down.isDown && direction !== 'up') {
        nextDirection = 'down';
    }
    
    // Move snake based on time interval
    if (time - lastMoveTime > moveInterval) {
        direction = nextDirection;
        this.moveSnake();
        lastMoveTime = time;
    }
}

// Helper function to place food at random location
function placeFood() {
    const x = Phaser.Math.Between(1, 39) * 20;
    const y = Phaser.Math.Between(3, 27) * 20;
    food.setPosition(x, y);
}

// Helper function to move snake
function moveSnake() {
    const head = snake[0];
    let newX = head.x;
    let newY = head.y;
    
    // Calculate new head position based on direction
    switch (direction) {
        case 'left':
            newX -= 20;
            break;
        case 'right':
            newX += 20;
            break;
        case 'up':
            newY -= 20;
            break;
        case 'down':
            newY += 20;
            break;
    }
    
    // Check wall collision
    if (newX < 0 || newX >= 800 || newY < 60 || newY >= 600) {
        this.endGame();
        return;
    }
    
    // Check self collision
    for (let i = 0; i < snake.length; i++) {
        if (newX === snake[i].x && newY === snake[i].y) {
            this.endGame();
            return;
        }
    }
    
    // Create new head
    const newHead = this.physics.add.sprite(newX, newY, 'snake');
    snake.unshift(newHead);
    
    // Check food collision
    if (newX === food.x && newY === food.y) {
        score += 10;
        scoreText.setText('Score: ' + score);
        this.placeFood();
        
        // Increase speed slightly
        if (moveInterval > 50) {
            moveInterval -= 2;
        }
    } else {
        // Remove tail if no food eaten
        const tail = snake.pop();
        tail.destroy();
    }
}

// Helper function for game over
function endGame() {
    gameOver = true;
    gameOverText.setVisible(true);
    restartText.setVisible(true);
}

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        placeFood: placeFood,
        moveSnake: moveSnake,
        endGame: endGame
    }
};

// Initialize game
const game = new Phaser.Game(config);