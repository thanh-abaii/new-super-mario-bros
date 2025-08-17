// Game Engine
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Sound system
        this.soundManager = new SoundManager();
        
        // Game state
        this.isRunning = false;
        this.isPaused = false;
        this.gameLoop = null;
        
        // Game stats
        this.score = 0;
        this.lives = 3;
        this.coins = 0;
        this.level = 1;
        
        // Camera
        this.camera = {
            x: 0,
            y: 0
        };
        
        // Input handling
        this.keys = {};
        this.setupInputHandlers();
        
        // Game objects
        this.player = null;
        this.platforms = [];
        this.enemies = [];
        this.collectibles = [];
        this.particles = [];
        this.flagpole = null;
        this.exitDoor = null;
        
        // Level completion
        this.levelCompleteScreen = new LevelCompleteScreen(this);
        this.isLevelComplete = false;
        this.levelStartTime = 0;
        this.timeRemaining = 400; // 400 seconds default time limit
        
        // Level management
        this.levelManager = new LevelManager(this);
        this.maxLevels = this.levelManager.getTotalLevels();
        
        // Initialize game
        this.init();
        
        // Timer for level time limit
        this.gameTimer = null;
    }
    
    init() {
        // Create player
        this.player = new Mario(100, this.height - 200, this);
        
        // Create level
        this.createLevel();
        
        // Setup UI event listeners
        this.setupUIHandlers();
        
        // Setup sound controls
        this.setupSoundControls();
    }
    
    setupInputHandlers() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // Handle level complete screen input
            if (this.levelCompleteScreen.isVisible) {
                if (this.levelCompleteScreen.handleInput(e.code)) {
                    this.nextLevel();
                }
            }
            
            e.preventDefault();
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            e.preventDefault();
        });
    }
    
    setupUIHandlers() {
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
    }
    
    setupSoundControls() {
        // Mute button
        document.getElementById('muteBtn').addEventListener('click', () => {
            const isMuted = this.soundManager.toggleMute();
            document.getElementById('muteBtn').textContent = isMuted ? '🔇 Sound OFF' : '🔊 Sound ON';
        });
        
        // Volume controls
        document.getElementById('masterVolume').addEventListener('input', (e) => {
            this.soundManager.setMasterVolume(e.target.value / 100);
        });
        
        document.getElementById('sfxVolume').addEventListener('input', (e) => {
            this.soundManager.setSFXVolume(e.target.value / 100);
        });
        
        document.getElementById('musicVolume').addEventListener('input', (e) => {
            this.soundManager.setMusicVolume(e.target.value / 100);
        });
        
        // Resume audio context on user interaction
        document.addEventListener('click', () => {
            this.soundManager.resumeAudioContext();
        }, { once: true });
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.gameLoop = setInterval(() => this.update(), 1000/60); // 60 FPS
            document.getElementById('startBtn').disabled = true;
            document.getElementById('pauseBtn').disabled = false;
            
            // Start timers
            this.levelStartTime = Date.now();
            this.startGameTimer();
            
            // Start background music
            this.soundManager.startBackgroundMusic();
        }
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        document.getElementById('pauseBtn').textContent = this.isPaused ? 'Resume' : 'Pause';
    }
    
    reset() {
        this.stop();
        this.score = 0;
        this.lives = 3;
        this.coins = 0;
        this.level = 1;
        this.camera.x = 0;
        this.camera.y = 0;
        
        // Reset player
        this.player = new Mario(100, this.height - 200, this);
        
        // Recreate level
        this.createLevel();
        
        // Update UI
        this.updateUI();
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.render();
    }
    
    restart() {
        document.getElementById('gameOverScreen').classList.add('hidden');
        this.reset();
    }
    
    stop() {
        this.isRunning = false;
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = 'Pause';
    }
    
    startGameTimer() {
        this.gameTimer = setInterval(() => {
            if (!this.isPaused && this.isRunning && !this.isLevelComplete) {
                this.timeRemaining--;
                if (this.timeRemaining <= 0) {
                    this.player.takeDamage();
                    this.lives--;
                    this.timeRemaining = 0;
                }
            }
        }, 1000);
    }
    
    completeLevel() {
        if (this.isLevelComplete) return;
        
        this.isLevelComplete = true;
        this.stop();
        
        // Calculate time taken
        const timeTaken = Math.floor((Date.now() - this.levelStartTime) / 1000);
        const timeBonus = Math.max(0, this.timeRemaining);
        
        // Show level complete screen
        this.levelCompleteScreen.show(this.score, timeBonus, this.lives, this.level);
        
        // Award time bonus
        this.addScore(timeBonus * 50);
    }
    
    nextLevel() {
        this.level++;
        
        // Check if we completed all levels
        if (this.levelManager.isLastLevel(this.level)) {
            this.gameComplete();
            return;
        }
        
        this.isLevelComplete = false;
        
        // Reset player position
        this.player = new Mario(100, this.height - 200, this);
        
        // Create new level (level manager will set timeRemaining)
        this.createLevel();
        
        // Hide level complete screen
        this.levelCompleteScreen.hide();
        
        // Update UI
        this.updateUI();
        
        // Restart game
        this.start();
    }
    
    gameComplete() {
        this.stop();
        this.soundManager.stopBackgroundMusic();
        this.soundManager.play('levelComplete');
        
        // Show game complete screen
        alert(`🎉 Congratulations! You completed all ${this.maxLevels} levels!\nFinal Score: ${this.score}\nThank you for playing New Super Mario Bros!`);
        
        // Reset to level 1
        this.level = 1;
        this.reset();
    }
    
    update() {
        if (!this.isRunning || this.isPaused) return;
        
        // Update player
        this.player.update();
        
        // Update enemies
        this.enemies.forEach(enemy => enemy.update());
        
        // Update collectibles (for animations)
        this.collectibles.forEach(collectible => {
            if (collectible.update) collectible.update(this.platforms);
        });
        
        // Update level completion elements
        if (this.flagpole) this.flagpole.update();
        if (this.exitDoor) this.exitDoor.update();
        
        // Update level complete screen
        this.levelCompleteScreen.update();
        
        // Update particles
        this.particles = this.particles.filter(particle => {
            particle.update();
            return particle.life > 0;
        });
        
        // Update camera
        this.updateCamera();
        
        // Check collisions
        this.checkCollisions();
        
        // Update UI
        this.updateUI();
        
        // Render everything
        this.render();
        
        // Check game over conditions
        this.checkGameOver();
    }
    
    updateCamera() {
        // Follow player with some offset
        const targetX = this.player.x - this.width / 3;
        this.camera.x = Math.max(0, targetX);
    }
    
    checkCollisions() {
        // Player with platforms
        this.platforms.forEach(platform => {
            if (this.player.checkCollision(platform)) {
                this.player.handlePlatformCollision(platform);
            }
        });
        
        // Player with blocks
        this.brickBlocks.forEach(block => {
            if (this.player.checkCollision(block) && !block.isBroken) {
                this.player.handlePlatformCollision(block);
                
                // Check if player hit from below
                if (this.player.velocityY < 0 && this.player.y > block.y + block.height/2) {
                    const broken = block.hit(this);
                    if (broken) {
                        this.soundManager.play('brickBreak');
                    }
                }
            }
        });
        
        this.questionBlocks.forEach(block => {
            if (this.player.checkCollision(block)) {
                this.player.handlePlatformCollision(block);
                
                // Check if player hit from below
                if (this.player.velocityY < 0 && this.player.y > block.y + block.height/2) {
                    const item = block.hit(this);
                    if (item && item.type !== 'coin') {
                        this.collectibles.push(item);
                    }
                    // Sound is played in block.hit() method for coins
                }
            }
        });
        
        // Player with enemies
        this.enemies.forEach((enemy, index) => {
            if (this.player.checkCollision(enemy) && !enemy.isDead) {
                if (this.player.velocityY > 0 && this.player.y < enemy.y) {
                    // Mario jumped on enemy
                    enemy.takeDamage();
                    this.player.bounce();
                    this.addScore(100);
                    this.createParticles(enemy.x, enemy.y, '#FFD700');
                    this.soundManager.play('enemyDefeat');
                } else if (!this.player.isDamaged) {
                    // Mario got hit
                    this.player.takeDamage();
                    this.lives--;
                    this.soundManager.play('damage');
                }
            }
        });
        
        // Player with collectibles
        this.collectibles.forEach((collectible, index) => {
            if (this.player.checkCollision(collectible)) {
                this.collectibles.splice(index, 1);
                if (collectible.type === 'coin') {
                    this.coins++;
                    this.addScore(200);
                    this.createParticles(collectible.x, collectible.y, '#FFD700');
                    this.soundManager.play('coin');
                } else if (collectible.type === 'mushroom') {
                    // Handle power-up
                    this.player.growBig();
                    this.addScore(1000);
                    this.createParticles(collectible.x, collectible.y, '#00FF00');
                    this.soundManager.play('powerup');
                }
            }
        });
        
        // Player with flagpole
        if (this.flagpole && this.player.checkCollision(this.flagpole) && !this.flagpole.isActivated) {
            this.flagpole.activate(this);
            // Mario climbs down animation could be added here
        }
        
        // Player with exit door (after flagpole)
        if (this.exitDoor && this.player.checkCollision(this.exitDoor) && 
            (!this.flagpole || this.flagpole.isComplete())) {
            
            if (!this.exitDoor.isActivated) {
                this.exitDoor.activate(this);
            }
            
            if (this.exitDoor.isComplete()) {
                this.completeLevel();
            }
        }
    }
    
    checkGameOver() {
        if (this.lives <= 0 || this.player.y > this.height + 100) {
            this.gameOver();
        }
    }
    
    gameOver() {
        this.stop();
        this.soundManager.stopBackgroundMusic();
        this.soundManager.play('gameOver');
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }
    
    addScore(points) {
        this.score += points;
    }
    
    createParticles(x, y, color) {
        for (let i = 0; i < 6; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }
    
    createFireworks(x, y) {
        // Create spectacular fireworks for level completion
        const colors = ['#FFD700', '#FF0000', '#00FF00', '#0000FF', '#FF00FF', '#00FFFF'];
        
        for (let i = 0; i < 20; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            this.particles.push(new FireworkParticle(x, y, color));
        }
    }
    
    updateUI() {
        document.getElementById('currentLevel').textContent = this.level;
        document.getElementById('levelName').textContent = this.levelManager.getCurrentLevelName();
        document.getElementById('timeRemaining').textContent = this.timeRemaining;
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('coins').textContent = this.coins;
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Save context for camera transform
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // Draw background
        this.drawBackground();
        
        // Draw platforms
        this.platforms.forEach(platform => platform.render(this.ctx));
        
        // Draw blocks
        this.brickBlocks.forEach(block => block.render(this.ctx));
        this.questionBlocks.forEach(block => block.render(this.ctx));
        
        // Draw collectibles
        this.collectibles.forEach(collectible => collectible.render(this.ctx));
        
        // Draw enemies
        this.enemies.forEach(enemy => enemy.render(this.ctx));
        
        // Draw player
        this.player.render(this.ctx);
        
        // Draw particles
        this.particles.forEach(particle => particle.render(this.ctx));
        
        // Draw level completion elements
        if (this.flagpole) this.flagpole.render(this.ctx);
        if (this.exitDoor) this.exitDoor.render(this.ctx);
        
        // Restore context
        this.ctx.restore();
        
        // Draw level complete screen (always on top)
        this.levelCompleteScreen.render(this.ctx);
    }
    
    drawBackground() {
        // Sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#5C94FC');
        gradient.addColorStop(0.7, '#5C94FC');
        gradient.addColorStop(0.7, '#00AA00');
        gradient.addColorStop(1, '#008800');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(this.camera.x, this.camera.y, this.width, this.height);
        
        // Draw clouds
        this.drawClouds();
    }
    
    drawClouds() {
        this.ctx.fillStyle = 'white';
        const cloudPositions = [
            {x: 200, y: 100},
            {x: 600, y: 80},
            {x: 1000, y: 120},
            {x: 1400, y: 90}
        ];
        
        cloudPositions.forEach(cloud => {
            // Simple cloud shape
            this.ctx.beginPath();
            this.ctx.arc(cloud.x, cloud.y, 30, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + 25, cloud.y, 35, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + 50, cloud.y, 30, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + 25, cloud.y - 25, 25, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    createLevel() {
        // Use level manager to build the current level
        this.levelManager.loadLevel(this.level);
        
        console.log(`Created Level ${this.level}: ${this.levelManager.getCurrentLevelName()}`);
    }
}

// Particle class for visual effects
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.velocityX = (Math.random() - 0.5) * 10;
        this.velocityY = Math.random() * -8 - 2;
        this.color = color;
        this.life = 30;
        this.maxLife = 30;
        this.size = Math.random() * 4 + 2;
    }
    
    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.velocityY += 0.3; // gravity
        this.life--;
    }
    
    render(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Firework particle for level completion
class FireworkParticle extends Particle {
    constructor(x, y, color) {
        super(x, y, color);
        this.velocityX = (Math.random() - 0.5) * 20;
        this.velocityY = (Math.random() - 0.5) * 20;
        this.life = 60;
        this.maxLife = 60;
        this.size = Math.random() * 6 + 3;
        this.trail = [];
    }
    
    update() {
        // Store trail
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > 8) {
            this.trail.shift();
        }
        
        super.update();
        this.velocityX *= 0.98; // Air resistance
        this.velocityY *= 0.98;
    }
    
    render(ctx) {
        const alpha = this.life / this.maxLife;
        
        // Draw trail
        ctx.save();
        for (let i = 0; i < this.trail.length; i++) {
            const trailAlpha = alpha * (i / this.trail.length) * 0.5;
            const trailSize = this.size * (i / this.trail.length);
            
            ctx.globalAlpha = trailAlpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.trail[i].x, this.trail[i].y, trailSize, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
        
        // Draw main particle
        super.render(ctx);
    }
}