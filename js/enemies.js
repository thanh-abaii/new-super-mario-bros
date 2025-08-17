// Base Enemy Class
class Enemy {
    constructor(x, y, game) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 24;
        
        // Physics
        this.velocityX = -1;
        this.velocityY = 0;
        this.gravity = 0.8;
        this.isGrounded = false;
        
        // State
        this.isDead = false;
        this.direction = -1;
        
        // Animation
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animationSpeed = 15;
    }
    
    update() {
        if (this.isDead) return;
        
        // Apply physics
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.velocityY += this.gravity;
        
        // Platform collision
        this.checkPlatformCollisions();
        
        // Update animation
        this.updateAnimation();
        
        // Check if enemy fell off the world
        if (this.y > this.game.height + 100) {
            this.isDead = true;
        }
    }
    
    checkPlatformCollisions() {
        this.isGrounded = false;
        
        this.game.platforms.forEach(platform => {
            if (this.checkCollision(platform)) {
                // Top collision (landing on platform)
                if (this.velocityY > 0 && 
                    this.y < platform.y && 
                    this.y + this.height > platform.y) {
                    
                    this.y = platform.y - this.height;
                    this.velocityY = 0;
                    this.isGrounded = true;
                }
                
                // Side collisions (turn around)
                if ((this.velocityX > 0 && this.x < platform.x) ||
                    (this.velocityX < 0 && this.x > platform.x + platform.width)) {
                    this.velocityX = -this.velocityX;
                    this.direction = -this.direction;
                }
            }
        });
    }
    
    checkCollision(obj) {
        return this.x < obj.x + obj.width &&
               this.x + this.width > obj.x &&
               this.y < obj.y + obj.height &&
               this.y + this.height > obj.y;
    }
    
    updateAnimation() {
        this.animationTimer++;
        if (this.animationTimer >= this.animationSpeed) {
            this.animationFrame = (this.animationFrame + 1) % 2;
            this.animationTimer = 0;
        }
    }
    
    takeDamage() {
        this.isDead = true;
    }
}

// Goomba Enemy
class Goomba extends Enemy {
    constructor(x, y, game) {
        super(x, y, game);
        this.width = 24;
        this.height = 24;
        this.velocityX = -1;
        this.type = 'goomba';
    }
    
    update() {
        super.update();
        
        // Goomba-specific behavior
        // Turn around at edges or walls
        if (this.x <= 0 || this.x >= this.game.width - this.width) {
            this.velocityX = -this.velocityX;
            this.direction = -this.direction;
        }
        
        // Check if there's no platform ahead (turn around at ledges)
        const checkX = this.velocityX > 0 ? this.x + this.width + 5 : this.x - 5;
        const checkY = this.y + this.height + 10;
        
        let hasGroundAhead = false;
        this.game.platforms.forEach(platform => {
            if (checkX >= platform.x && checkX <= platform.x + platform.width &&
                checkY >= platform.y && checkY <= platform.y + platform.height) {
                hasGroundAhead = true;
            }
        });
        
        if (!hasGroundAhead && this.isGrounded) {
            this.velocityX = -this.velocityX;
            this.direction = -this.direction;
        }
    }
    
    takeDamage() {
        super.takeDamage();
        // Goomba gets squished
        this.height = 12;
        this.velocityX = 0;
        
        // Remove after a short delay
        setTimeout(() => {
            const index = this.game.enemies.indexOf(this);
            if (index > -1) {
                this.game.enemies.splice(index, 1);
            }
        }, 500);
    }
    
    render(ctx) {
        if (this.isDead && this.height === 12) {
            // Draw squished goomba
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(this.x, this.y + 12, this.width, this.height);
            return;
        }
        
        if (this.isDead) return;
        
        // Draw Goomba body
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x, this.y + 8, this.width, this.height - 8);
        
        // Draw Goomba head
        ctx.fillStyle = '#CD853F';
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + 8, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(this.x + 7, this.y + 6, 3, 0, Math.PI * 2);
        ctx.arc(this.x + 17, this.y + 6, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw pupils
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(this.x + 7, this.y + 6, 1, 0, Math.PI * 2);
        ctx.arc(this.x + 17, this.y + 6, 1, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw angry eyebrows
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + 4, this.y + 2);
        ctx.lineTo(this.x + 10, this.y + 4);
        ctx.moveTo(this.x + 14, this.y + 4);
        ctx.lineTo(this.x + 20, this.y + 2);
        ctx.stroke();
        
        // Draw feet (animation)
        ctx.fillStyle = '#654321';
        const footOffset = this.animationFrame * 2;
        ctx.fillRect(this.x + 2 - footOffset, this.y + this.height - 4, 6, 4);
        ctx.fillRect(this.x + this.width - 8 + footOffset, this.y + this.height - 4, 6, 4);
    }
}

// Koopa Troopa Enemy
class Koopa extends Enemy {
    constructor(x, y, game, color = 'green') {
        super(x, y, game);
        this.width = 24;
        this.height = 32;
        this.velocityX = -1.5;
        this.type = 'koopa';
        this.color = color; // 'green', 'red'
        this.isInShell = false;
        this.shellTimer = 0;
    }
    
    update() {
        super.update();
        
        if (this.isInShell) {
            this.height = 16;
            this.shellTimer--;
            
            if (this.shellTimer <= 0 && this.velocityX === 0) {
                // Koopa emerges from shell
                this.isInShell = false;
                this.height = 32;
                this.velocityX = this.direction * -1.5;
            }
        }
        
        // Koopa-specific behavior
        if (this.x <= 0 || this.x >= this.game.width - this.width) {
            this.velocityX = -this.velocityX;
            this.direction = -this.direction;
        }
    }
    
    takeDamage() {
        if (!this.isInShell) {
            // First hit: go into shell
            this.isInShell = true;
            this.shellTimer = 300; // 5 seconds at 60 FPS
            this.velocityX = 0;
            this.height = 16;
        } else {
            // Second hit: kick shell
            this.velocityX = this.direction * 8;
        }
    }
    
    render(ctx) {
        if (this.isDead) return;
        
        if (this.isInShell) {
            // Draw shell
            const shellColor = this.color === 'green' ? '#00AA00' : '#AA0000';
            
            ctx.fillStyle = shellColor;
            ctx.fillRect(this.x, this.y + 16, this.width, this.height);
            
            // Shell pattern
            ctx.fillStyle = this.color === 'green' ? '#00CC00' : '#CC0000';
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + 20, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Shell lines
            ctx.strokeStyle = '#006600';
            ctx.lineWidth = 2;
            for (let i = 0; i < 3; i++) {
                const lineY = this.y + 18 + i * 4;
                ctx.beginPath();
                ctx.moveTo(this.x + 2, lineY);
                ctx.lineTo(this.x + this.width - 2, lineY);
                ctx.stroke();
            }
        } else {
            // Draw full Koopa
            // Body
            ctx.fillStyle = '#FFFF00';
            ctx.fillRect(this.x + 4, this.y + 16, this.width - 8, 12);
            
            // Shell
            const shellColor = this.color === 'green' ? '#00AA00' : '#AA0000';
            ctx.fillStyle = shellColor;
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + 12, 10, 0, Math.PI);
            ctx.fill();
            
            // Head
            ctx.fillStyle = '#FFFF00';
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + 20, 6, 0, Math.PI * 2);
            ctx.fill();
            
            // Eyes
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(this.x + 9, this.y + 18, 2, 0, Math.PI * 2);
            ctx.arc(this.x + 15, this.y + 18, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Pupils
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(this.x + 9, this.y + 18, 1, 0, Math.PI * 2);
            ctx.arc(this.x + 15, this.y + 18, 1, 0, Math.PI * 2);
            ctx.fill();
            
            // Beak
            ctx.fillStyle = '#FFA500';
            ctx.beginPath();
            ctx.moveTo(this.x + this.width/2, this.y + 22);
            ctx.lineTo(this.x + this.width/2 - 3, this.y + 25);
            ctx.lineTo(this.x + this.width/2 + 3, this.y + 25);
            ctx.fill();
            
            // Feet
            ctx.fillStyle = '#FFA500';
            const footOffset = this.animationFrame * 2;
            ctx.fillRect(this.x + 2 - footOffset, this.y + 28, 4, 4);
            ctx.fillRect(this.x + this.width - 6 + footOffset, this.y + 28, 4, 4);
        }
    }
}

// Piranha Plant Enemy
class PiranhaPlant extends Enemy {
    constructor(x, y, game) {
        super(x, y, game);
        this.width = 24;
        this.height = 32;
        this.velocityX = 0; // Doesn't move horizontally
        this.velocityY = 0;
        this.gravity = 0; // Not affected by gravity
        this.type = 'piranha';
        
        // Piranha-specific properties
        this.isEmerging = true;
        this.emergeTimer = 0;
        this.maxEmergeTime = 120; // 2 seconds
        this.pipeY = y + 16; // Bottom of the pipe
        this.maxHeight = y - 16; // Top emergence position
        
        // Animation
        this.mouthOpen = false;
        this.mouthTimer = 0;
    }
    
    update() {
        // Don't call super.update() as we have custom behavior
        
        this.emergeTimer++;
        
        if (this.isEmerging) {
            // Emerge from pipe
            const progress = this.emergeTimer / 60; // 1 second to emerge
            this.y = this.pipeY - (progress * 48);
            
            if (this.emergeTimer >= 60) {
                this.isEmerging = false;
                this.emergeTimer = 0;
            }
        } else {
            // Stay emerged for a while, then go back down
            if (this.emergeTimer >= this.maxEmergeTime) {
                const retreatProgress = (this.emergeTimer - this.maxEmergeTime) / 60;
                this.y = this.maxHeight + (retreatProgress * 48);
                
                if (this.emergeTimer >= this.maxEmergeTime + 60) {
                    // Reset cycle
                    this.isEmerging = true;
                    this.emergeTimer = 0;
                }
            }
        }
        
        // Mouth animation
        this.mouthTimer++;
        if (this.mouthTimer >= 20) {
            this.mouthOpen = !this.mouthOpen;
            this.mouthTimer = 0;
        }
        
        // Check if player is nearby (don't emerge if player is too close)
        const playerDistance = Math.abs(this.game.player.x - this.x);
        if (playerDistance < 50 && this.isEmerging && this.emergeTimer < 30) {
            this.emergeTimer = 0; // Reset emergence
        }
    }
    
    takeDamage() {
        // Piranha plants are usually invincible to jumping
        // Only fire Mario can defeat them
        if (this.game.player.hasFirePower) {
            super.takeDamage();
        }
    }
    
    render(ctx) {
        if (this.isDead) return;
        
        // Don't render if fully in pipe
        if (this.y >= this.pipeY) return;
        
        // Draw pipe first
        ctx.fillStyle = '#00AA00';
        ctx.fillRect(this.x - 4, this.pipeY, this.width + 8, 32);
        
        // Pipe rim
        ctx.fillStyle = '#00CC00';
        ctx.fillRect(this.x - 6, this.pipeY - 4, this.width + 12, 8);
        
        // Draw stem
        ctx.fillStyle = '#228B22';
        ctx.fillRect(this.x + 8, this.y + 16, 8, Math.max(0, this.pipeY - this.y - 16));
        
        // Draw piranha plant head
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + 8, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw mouth
        if (this.mouthOpen) {
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.ellipse(this.x + this.width/2, this.y + 8, 8, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw teeth
            ctx.fillStyle = '#FFFFFF';
            for (let i = 0; i < 6; i++) {
                const toothX = this.x + 6 + i * 2;
                const toothY = this.y + 6;
                ctx.beginPath();
                ctx.moveTo(toothX, toothY);
                ctx.lineTo(toothX + 1, toothY + 4);
                ctx.lineTo(toothX - 1, toothY + 4);
                ctx.fill();
            }
        } else {
            // Closed mouth
            ctx.strokeStyle = '#AA0000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x + 4, this.y + 8);
            ctx.lineTo(this.x + this.width - 4, this.y + 8);
            ctx.stroke();
        }
        
        // Draw leaves around the head
        ctx.fillStyle = '#00AA00';
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2) / 6;
            const leafX = this.x + this.width/2 + Math.cos(angle) * 15;
            const leafY = this.y + 8 + Math.sin(angle) * 15;
            
            ctx.save();
            ctx.translate(leafX, leafY);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.ellipse(0, 0, 8, 3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        
        // Draw spots on head
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(this.x + 8, this.y + 4, 2, 0, Math.PI * 2);
        ctx.arc(this.x + 16, this.y + 4, 2, 0, Math.PI * 2);
        ctx.arc(this.x + 12, this.y + 12, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}