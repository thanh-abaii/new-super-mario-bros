// Mario Player Class
class Mario {
    constructor(x, y, game) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        
        // Physics
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 5;
        this.jumpPower = 15;
        this.gravity = 0.8;
        this.friction = 0.8;
        this.maxSpeed = 8;
        
        // State
        this.isGrounded = false;
        this.isJumping = false;
        this.direction = 1; // 1 for right, -1 for left
        this.isRunning = false;
        this.isDamaged = false;
        this.damageTimer = 0;
        
        // Animation
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animationSpeed = 8;
        
        // Power-up state
        this.isBig = false;
        this.hasFirePower = false;
    }
    
    update() {
        this.handleInput();
        this.applyPhysics();
        this.updateAnimation();
        this.updateDamageState();
        this.constrainToWorld();
    }
    
    handleInput() {
        const keys = this.game.keys;
        
        // Reset horizontal velocity
        this.velocityX = 0;
        this.isRunning = false;
        
        // Left movement
        if (keys['KeyA'] || keys['ArrowLeft']) {
            this.velocityX = -this.speed;
            this.direction = -1;
            
            // Running (faster movement)
            if (keys['ShiftLeft'] || keys['ShiftRight']) {
                this.velocityX *= 1.5;
                this.isRunning = true;
            }
        }
        
        // Right movement
        if (keys['KeyD'] || keys['ArrowRight']) {
            this.velocityX = this.speed;
            this.direction = 1;
            
            // Running (faster movement)
            if (keys['ShiftLeft'] || keys['ShiftRight']) {
                this.velocityX *= 1.5;
                this.isRunning = true;
            }
        }
        
        // Jump
        if ((keys['Space'] || keys['KeyW'] || keys['ArrowUp']) && this.isGrounded && !this.isJumping) {
            this.jump();
        }
    }
    
    jump() {
        this.velocityY = -this.jumpPower;
        this.isGrounded = false;
        this.isJumping = true;
        
        // Play jump sound
        if (this.game.soundManager) {
            this.game.soundManager.play('jump');
        }
    }
    
    bounce() {
        // Small bounce when jumping on enemy
        this.velocityY = -8;
    }
    
    applyPhysics() {
        // Apply horizontal movement
        this.x += this.velocityX;
        
        // Apply gravity
        this.velocityY += this.gravity;
        
        // Apply vertical movement
        this.y += this.velocityY;
        
        // Terminal velocity
        if (this.velocityY > 20) {
            this.velocityY = 20;
        }
        
        // Reset jumping state when falling
        if (this.velocityY > 0) {
            this.isJumping = false;
        }
    }
    
    handlePlatformCollision(platform) {
        // Top collision (landing on platform)
        if (this.velocityY > 0 && 
            this.y < platform.y && 
            this.y + this.height > platform.y &&
            this.x + this.width > platform.x &&
            this.x < platform.x + platform.width) {
            
            this.y = platform.y - this.height;
            this.velocityY = 0;
            this.isGrounded = true;
            this.isJumping = false;
            return;
        }
        
        // Bottom collision (hitting platform from below)
        if (this.velocityY < 0 && 
            this.y > platform.y + platform.height &&
            this.y < platform.y + platform.height + Math.abs(this.velocityY) &&
            this.x + this.width > platform.x &&
            this.x < platform.x + platform.width) {
            
            this.y = platform.y + platform.height;
            this.velocityY = 0;
            return;
        }
        
        // Left collision
        if (this.velocityX > 0 &&
            this.x < platform.x &&
            this.x + this.width > platform.x &&
            this.y + this.height > platform.y &&
            this.y < platform.y + platform.height) {
            
            this.x = platform.x - this.width;
            this.velocityX = 0;
            return;
        }
        
        // Right collision
        if (this.velocityX < 0 &&
            this.x > platform.x + platform.width &&
            this.x < platform.x + platform.width + Math.abs(this.velocityX) &&
            this.y + this.height > platform.y &&
            this.y < platform.y + platform.height) {
            
            this.x = platform.x + platform.width;
            this.velocityX = 0;
            return;
        }
    }
    
    checkCollision(obj) {
        return this.x < obj.x + obj.width &&
               this.x + this.width > obj.x &&
               this.y < obj.y + obj.height &&
               this.y + this.height > obj.y;
    }
    
    takeDamage() {
        if (this.isDamaged) return; // Invincibility frames
        
        this.isDamaged = true;
        this.damageTimer = 120; // 2 seconds at 60 FPS
        
        if (this.isBig) {
            // Shrink Mario
            this.isBig = false;
            this.hasFirePower = false;
            this.height = 32;
        } else {
            // Lose a life
            this.game.lives--;
        }
        
        // Knockback
        this.velocityX = -this.direction * 8;
        this.velocityY = -10;
    }
    
    updateDamageState() {
        if (this.isDamaged) {
            this.damageTimer--;
            if (this.damageTimer <= 0) {
                this.isDamaged = false;
            }
        }
    }
    
    updateAnimation() {
        this.animationTimer++;
        
        if (this.animationTimer >= this.animationSpeed) {
            this.animationFrame = (this.animationFrame + 1) % 3;
            this.animationTimer = 0;
        }
        
        // Faster animation when running
        if (this.isRunning) {
            this.animationSpeed = 4;
        } else {
            this.animationSpeed = 8;
        }
    }
    
    constrainToWorld() {
        // Don't let Mario go off the left edge
        if (this.x < 0) {
            this.x = 0;
            this.velocityX = 0;
        }
        
        // Reset grounded state if not touching anything
        if (this.velocityY !== 0) {
            this.isGrounded = false;
        }
    }
    
    render(ctx) {
        // Flashing effect when damaged
        if (this.isDamaged && Math.floor(this.damageTimer / 8) % 2) {
            return; // Skip rendering for flashing effect
        }
        
        ctx.save();
        
        // Flip sprite based on direction
        if (this.direction === -1) {
            ctx.scale(-1, 1);
            ctx.translate(-this.x - this.width, 0);
        }
        
        // Choose color based on power-up state
        let marioColor = '#FF0000'; // Red (normal Mario)
        if (this.hasFirePower) {
            marioColor = '#FF6600'; // Orange (Fire Mario)
        } else if (this.isBig) {
            marioColor = '#FF4444'; // Lighter red (Big Mario)
        }
        
        // Draw Mario's body
        ctx.fillStyle = marioColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw Mario's hat
        ctx.fillStyle = '#AA0000';
        ctx.fillRect(this.x + 4, this.y, this.width - 8, 8);
        
        // Draw Mario's face
        ctx.fillStyle = '#FFDBAC';
        ctx.fillRect(this.x + 8, this.y + 8, this.width - 16, 16);
        
        // Draw Mario's overalls
        ctx.fillStyle = '#0066FF';
        ctx.fillRect(this.x + 4, this.y + 16, this.width - 8, 12);
        
        // Draw Mario's shoes
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x + 2, this.y + 28, this.width - 4, 4);
        
        // Animation effects
        if (this.velocityX !== 0 && this.isGrounded) {
            // Walking animation - simple bobbing effect
            const bob = Math.sin(this.animationFrame * 2) * 2;
            ctx.translate(0, bob);
        }
        
        // Draw eyes
        ctx.fillStyle = '#000000';
        ctx.fillRect(this.x + 10, this.y + 12, 2, 2);
        ctx.fillRect(this.x + 20, this.y + 12, 2, 2);
        
        // Draw mustache
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x + 12, this.y + 18, 8, 2);
        
        ctx.restore();
        
        // Draw debug info (remove in production)
        if (false) { // Set to true for debugging
            ctx.strokeStyle = '#FF00FF';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '12px Arial';
            ctx.fillText(`Grounded: ${this.isGrounded}`, this.x, this.y - 20);
            ctx.fillText(`VelY: ${this.velocityY.toFixed(1)}`, this.x, this.y - 5);
        }
    }
    
    // Power-up methods
    growBig() {
        if (!this.isBig) {
            this.isBig = true;
            this.height = 48;
            this.game.addScore(1000);
        }
    }
    
    getFirePower() {
        this.growBig(); // First grow big if small
        this.hasFirePower = true;
        this.game.addScore(1000);
    }
    
    // Reset to small Mario
    shrink() {
        this.isBig = false;
        this.hasFirePower = false;
        this.height = 32;
    }
}