class PixelSoccer {
    constructor(canvas, gameMode, roomId) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gameMode = gameMode;
        this.roomId = roomId;
        
        // Game dimensions
        this.width = canvas.width;
        this.height = canvas.height;
        
        // Game state
        this.isPaused = false;
        this.gameActive = false;
        this.gameTime = 300; // 5 minutes default
        
        // Score
        this.score = { home: 0, away: 0 };
        
        // Game objects
        this.ball = new Ball(this.width / 2, this.height / 2);
        this.players = [];
        
        // Initialize players based on game mode
        this.initializePlayers();
        
        // Input handling
        this.keys = {};
        this.setupInput();
        
        // Socket connection for multiplayer
        if (this.gameMode === 'multiplayer') {
            this.setupMultiplayer();
        }
        
        // Load settings
        this.loadSettings();
        
        // Start game loop
        this.lastTime = 0;
        this.gameLoop = this.gameLoop.bind(this);
        requestAnimationFrame(this.gameLoop);
    }
    
    initializePlayers() {
        if (this.gameMode === 'ai') {
            // Single player vs AI
            this.players.push(new Player(150, this.height / 2, 'home', 'human'));
            this.players.push(new AIPlayer(this.width - 150, this.height / 2, 'away', 'ai'));
        } else {
            // Local multiplayer or online multiplayer
            this.players.push(new Player(150, this.height / 2, 'home', 'human'));
            this.players.push(new Player(this.width - 150, this.height / 2, 'away', 'human'));
        }
    }
    
    setupInput() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            // Prevent default for game keys
            if (['w', 'a', 's', 'd', ' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'enter'].includes(e.key.toLowerCase())) {
                e.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }
    
    setupMultiplayer() {
        this.socket = io();
        
        this.socket.on('game_update', (data) => {
            // Update other players' positions
            this.updateRemotePlayers(data.players);
        });
        
        this.socket.on('ball_sync', (data) => {
            // Sync ball position from server
            this.ball.x = data.ball.x;
            this.ball.y = data.ball.y;
            this.ball.vx = data.ball.vx;
            this.ball.vy = data.ball.vy;
        });
        
        this.socket.on('goal_scored', (data) => {
            this.score[data.team]++;
            this.updateScore();
            this.resetPositions();
        });
    }
    
    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('pixelSoccerSettings') || '{}');
        this.gameTime = settings.gameLength || 300;
    }
    
    update(deltaTime) {
        if (this.isPaused || !this.gameActive) return;
        
        // Update timer
        this.gameTime -= deltaTime / 1000;
        if (this.gameTime <= 0) {
            this.gameTime = 0;
            this.endGame();
        }
        this.updateTimer();
        
        // Handle input for players
        this.handlePlayerInput();
        
        // Update players
        this.players.forEach(player => {
            player.update(deltaTime);
            this.keepPlayerInBounds(player);
        });
        
        // Update ball
        this.ball.update(deltaTime);
        this.handleBallCollisions();
        
        // Check for goals
        this.checkForGoals();
        
        // Send multiplayer updates
        if (this.gameMode === 'multiplayer' && this.socket) {
            this.sendMultiplayerUpdate();
        }
    }
    
    handlePlayerInput() {
        // Player 1 controls (WASD + Space)
        const player1 = this.players[0];
        if (player1 && player1.type === 'human') {
            let dx = 0, dy = 0;
            if (this.keys['a']) dx -= 1;
            if (this.keys['d']) dx += 1;
            if (this.keys['w']) dy -= 1;
            if (this.keys['s']) dy += 1;
            
            player1.setMovement(dx, dy);
            
            if (this.keys[' ']) {
                this.kickBall(player1);
            }
        }
        
        // Player 2 controls (Arrow keys + Enter)
        if (this.gameMode !== 'ai' && this.players[1] && this.players[1].type === 'human') {
            const player2 = this.players[1];
            let dx = 0, dy = 0;
            if (this.keys['arrowleft']) dx -= 1;
            if (this.keys['arrowright']) dx += 1;
            if (this.keys['arrowup']) dy -= 1;
            if (this.keys['arrowdown']) dy += 1;
            
            player2.setMovement(dx, dy);
            
            if (this.keys['enter']) {
                this.kickBall(player2);
            }
        }
    }
    
    kickBall(player) {
        const distance = this.getDistance(player, this.ball);
        if (distance < 30) {
            const angle = Math.atan2(this.ball.y - player.y, this.ball.x - player.x);
            this.ball.vx = Math.cos(angle) * 300;
            this.ball.vy = Math.sin(angle) * 300;
        }
    }
    
    handleBallCollisions() {
        // Ball-player collisions
        this.players.forEach(player => {
            if (this.checkCollision(this.ball, player)) {
                const angle = Math.atan2(this.ball.y - player.y, this.ball.x - player.x);
                const force = 150;
                this.ball.vx = Math.cos(angle) * force;
                this.ball.vy = Math.sin(angle) * force;
            }
        });
        
        // Ball-wall collisions
        if (this.ball.y <= 15 || this.ball.y >= this.height - 15) {
            this.ball.vy *= -0.8;
            this.ball.y = Math.max(15, Math.min(this.height - 15, this.ball.y));
        }
        
        // Ball-goal collisions (sides)
        if (this.ball.x <= 15) {
            if (this.ball.y >= this.height / 2 - 80 && this.ball.y <= this.height / 2 + 80) {
                // Goal scored by away team
                this.scoreGoal('away');
            } else {
                this.ball.vx *= -0.8;
                this.ball.x = 15;
            }
        }
        
        if (this.ball.x >= this.width - 15) {
            if (this.ball.y >= this.height / 2 - 80 && this.ball.y <= this.height / 2 + 80) {
                // Goal scored by home team
                this.scoreGoal('home');
            } else {
                this.ball.vx *= -0.8;
                this.ball.x = this.width - 15;
            }
        }
    }
    
    checkForGoals() {
        // This is handled in handleBallCollisions
    }
    
    scoreGoal(team) {
        this.score[team]++;
        this.updateScore();
        this.resetPositions();
        
        if (this.gameMode === 'multiplayer' && this.socket) {
            this.socket.emit('goal_scored', {
                room_id: this.roomId,
                team: team
            });
        }
    }
    
    resetPositions() {
        // Reset ball to center
        this.ball.x = this.width / 2;
        this.ball.y = this.height / 2;
        this.ball.vx = 0;
        this.ball.vy = 0;
        
        // Reset player positions
        this.players[0].x = 150;
        this.players[0].y = this.height / 2;
        if (this.players[1]) {
            this.players[1].x = this.width - 150;
            this.players[1].y = this.height / 2;
        }
    }
    
    keepPlayerInBounds(player) {
        player.x = Math.max(20, Math.min(this.width - 20, player.x));
        player.y = Math.max(20, Math.min(this.height - 20, player.y));
    }
    
    checkCollision(obj1, obj2) {
        const distance = this.getDistance(obj1, obj2);
        return distance < (obj1.radius + obj2.radius);
    }
    
    getDistance(obj1, obj2) {
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    sendMultiplayerUpdate() {
        if (this.socket) {
            this.socket.emit('player_move', {
                room_id: this.roomId,
                x: this.players[0].x,
                y: this.players[0].y,
                vx: this.players[0].vx,
                vy: this.players[0].vy
            });
            
            this.socket.emit('ball_update', {
                room_id: this.roomId,
                ball: {
                    x: this.ball.x,
                    y: this.ball.y,
                    vx: this.ball.vx,
                    vy: this.ball.vy
                }
            });
        }
    }
    
    updateRemotePlayers(remotePlayers) {
        // Update positions of remote players
        Object.keys(remotePlayers).forEach((playerId, index) => {
            if (index < this.players.length && index !== 0) {
                const player = this.players[index];
                const remotePlayer = remotePlayers[playerId];
                player.x = remotePlayer.x;
                player.y = remotePlayer.y;
            }
        });
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#0a5d0a';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw field
        this.drawField();
        
        // Draw players
        this.players.forEach(player => player.render(this.ctx));
        
        // Draw ball
        this.ball.render(this.ctx);
    }
    
    drawField() {
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        
        // Center line
        this.ctx.beginPath();
        this.ctx.moveTo(this.width / 2, 0);
        this.ctx.lineTo(this.width / 2, this.height);
        this.ctx.stroke();
        
        // Center circle
        this.ctx.beginPath();
        this.ctx.arc(this.width / 2, this.height / 2, 60, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Goals
        const goalHeight = 160;
        const goalY = this.height / 2 - goalHeight / 2;
        
        // Left goal
        this.ctx.beginPath();
        this.ctx.moveTo(0, goalY);
        this.ctx.lineTo(30, goalY);
        this.ctx.lineTo(30, goalY + goalHeight);
        this.ctx.lineTo(0, goalY + goalHeight);
        this.ctx.stroke();
        
        // Right goal
        this.ctx.beginPath();
        this.ctx.moveTo(this.width, goalY);
        this.ctx.lineTo(this.width - 30, goalY);
        this.ctx.lineTo(this.width - 30, goalY + goalHeight);
        this.ctx.lineTo(this.width, goalY + goalHeight);
        this.ctx.stroke();
    }
    
    updateScore() {
        document.getElementById('home-score').textContent = this.score.home;
        document.getElementById('away-score').textContent = this.score.away;
    }
    
    updateTimer() {
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = Math.floor(this.gameTime % 60);
        document.getElementById('timer-display').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    pause() {
        this.isPaused = true;
    }
    
    resume() {
        this.isPaused = false;
    }
    
    start() {
        this.gameActive = true;
        this.gameTime = JSON.parse(localStorage.getItem('pixelSoccerSettings') || '{}').gameLength || 300;
    }
    
    endGame() {
        this.gameActive = false;
        const winner = this.score.home > this.score.away ? 'HOME' : 
                      this.score.away > this.score.home ? 'AWAY' : 'TIE';
        
        document.getElementById('final-score').textContent = 
            `${this.score.home} - ${this.score.away}`;
        document.getElementById('winner-text').textContent = 
            winner === 'TIE' ? 'IT\'S A TIE!' : `${winner} WINS!`;
        document.getElementById('game-over').classList.remove('hidden');
    }
    
    gameLoop(currentTime) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        
        requestAnimationFrame(this.gameLoop);
    }
}

// Game entity classes
class GameObject {
    constructor(x, y, radius = 10) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.radius = radius;
    }
    
    update(deltaTime) {
        this.x += this.vx * deltaTime / 1000;
        this.y += this.vy * deltaTime / 1000;
        
        // Apply friction
        this.vx *= 0.98;
        this.vy *= 0.98;
    }
}

class Player extends GameObject {
    constructor(x, y, team, type = 'human') {
        super(x, y, 15);
        this.team = team;
        this.type = type;
        this.speed = 200;
        this.inputX = 0;
        this.inputY = 0;
    }
    
    setMovement(x, y) {
        this.inputX = x;
        this.inputY = y;
    }
    
    update(deltaTime) {
        // Apply input
        this.vx = this.inputX * this.speed;
        this.vy = this.inputY * this.speed;
        
        super.update(deltaTime);
    }
    
    render(ctx) {
        ctx.fillStyle = this.team === 'home' ? '#4444ff' : '#ff4444';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw direction indicator
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x + this.inputX * 5, this.y + this.inputY * 5, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

class AIPlayer extends Player {
    constructor(x, y, team, type) {
        super(x, y, team, type);
        this.state = 'defend';
        this.reactionTime = 0;
        this.maxReactionTime = 500; // ms
    }
    
    update(deltaTime) {
        this.reactionTime -= deltaTime;
        
        if (this.reactionTime <= 0) {
            this.makeDecision();
            this.reactionTime = this.maxReactionTime;
        }
        
        super.update(deltaTime);
    }
    
    makeDecision() {
        // Simple AI logic - chase ball or defend
        const ball = window.gameInstance.ball;
        const goalX = this.team === 'away' ? window.gameInstance.width - 50 : 50;
        const goalY = window.gameInstance.height / 2;
        
        const distanceToBall = Math.sqrt((ball.x - this.x) ** 2 + (ball.y - this.y) ** 2);
        
        if (distanceToBall < 100) {
            // Chase ball
            const dx = ball.x - this.x;
            const dy = ball.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            this.setMovement(dx / distance, dy / distance);
        } else {
            // Return to goal
            const dx = goalX - this.x;
            const dy = goalY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 20) {
                this.setMovement(dx / distance * 0.5, dy / distance * 0.5);
            } else {
                this.setMovement(0, 0);
            }
        }
    }
}

class Ball extends GameObject {
    constructor(x, y) {
        super(x, y, 8);
    }
    
    render(ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add simple shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(this.x + 2, this.y + 2, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize game function
function initGame(gameMode, roomId) {
    const canvas = document.getElementById('game-canvas');
    window.gameInstance = new PixelSoccer(canvas, gameMode, roomId);
    window.gameInstance.start();
}