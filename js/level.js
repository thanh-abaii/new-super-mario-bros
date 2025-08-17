// Platform Class
class Platform {
    constructor(x, y, width, height, color = '#228B22') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.type = 'platform';
    }
    
    render(ctx) {
        // Main platform
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Platform border/shadow
        ctx.fillStyle = this.getDarkerColor(this.color);
        ctx.fillRect(this.x, this.y + this.height - 4, this.width, 4);
        
        // Platform highlight
        ctx.fillStyle = this.getLighterColor(this.color);
        ctx.fillRect(this.x, this.y, this.width, 4);
        
        // Add some texture
        if (this.color === '#8B4513') { // Ground platform
            this.drawGroundTexture(ctx);
        } else {
            this.drawGrassTexture(ctx);
        }
    }
    
    drawGroundTexture(ctx) {
        // Draw dirt texture
        ctx.fillStyle = '#A0522D';
        for (let i = 0; i < this.width; i += 20) {
            for (let j = 0; j < this.height; j += 20) {
                if (Math.random() > 0.7) {
                    ctx.fillRect(this.x + i + Math.random() * 10, 
                               this.y + j + Math.random() * 10, 
                               4, 4);
                }
            }
        }
    }
    
    drawGrassTexture(ctx) {
        // Draw grass blades on top
        ctx.strokeStyle = '#006400';
        ctx.lineWidth = 2;
        
        for (let i = 0; i < this.width; i += 8) {
            const grassHeight = 4 + Math.random() * 4;
            ctx.beginPath();
            ctx.moveTo(this.x + i, this.y);
            ctx.lineTo(this.x + i, this.y - grassHeight);
            ctx.stroke();
        }
    }
    
    getDarkerColor(color) {
        // Simple color darkening
        const colorMap = {
            '#228B22': '#1F5F1F',
            '#8B4513': '#654321',
            '#FF6B6B': '#CC5555',
            '#4ECDC4': '#3BA99C'
        };
        return colorMap[color] || '#333333';
    }
    
    getLighterColor(color) {
        // Simple color lightening
        const colorMap = {
            '#228B22': '#32CD32',
            '#8B4513': '#CD853F',
            '#FF6B6B': '#FF8E8E',
            '#4ECDC4': '#6DDDD4'
        };
        return colorMap[color] || '#CCCCCC';
    }
}

// Collectible Coin Class
class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.type = 'coin';
        
        // Animation
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.bobOffset = 0;
        this.bobSpeed = 0.1;
    }
    
    update() {
        // Bobbing animation
        this.bobOffset = Math.sin(Date.now() * this.bobSpeed) * 3;
        
        // Rotation animation
        this.animationTimer++;
        if (this.animationTimer >= 8) {
            this.animationFrame = (this.animationFrame + 1) % 4;
            this.animationTimer = 0;
        }
    }
    
    render(ctx) {
        this.update();
        
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2 + this.bobOffset);
        
        // Coin rotation effect
        const scaleX = Math.cos(this.animationFrame * Math.PI / 2);
        ctx.scale(Math.abs(scaleX), 1);
        
        // Draw coin body
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw coin inner circle
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw shine effect
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(-2, -2, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        // Draw sparkle particles around coin
        if (Math.random() > 0.9) {
            ctx.fillStyle = '#FFD700';
            const sparkleX = this.x + Math.random() * this.width;
            const sparkleY = this.y + Math.random() * this.height;
            ctx.fillRect(sparkleX, sparkleY, 2, 2);
        }
    }
}

// Power-up Mushroom Class
class Mushroom {
    constructor(x, y, type = 'super') {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 24;
        this.type = type; // 'super', 'fire', '1up'
        
        // Physics
        this.velocityX = 2;
        this.velocityY = 0;
        this.gravity = 0.5;
        this.isGrounded = false;
        
        // Animation
        this.bobOffset = 0;
        this.bobSpeed = 0.08;
    }
    
    update(platforms) {
        // Apply physics
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.velocityY += this.gravity;
        
        // Bobbing animation
        this.bobOffset = Math.sin(Date.now() * this.bobSpeed) * 2;
        
        // Platform collision (simple ground check)
        this.isGrounded = false;
        platforms.forEach(platform => {
            if (this.x < platform.x + platform.width &&
                this.x + this.width > platform.x &&
                this.y + this.height > platform.y &&
                this.y < platform.y + platform.height) {
                
                if (this.velocityY > 0) {
                    this.y = platform.y - this.height;
                    this.velocityY = 0;
                    this.isGrounded = true;
                }
            }
        });
        
        // Reverse direction when hitting walls
        if (this.x <= 0 || this.x >= 1200 - this.width) {
            this.velocityX = -this.velocityX;
        }
    }
    
    render(ctx) {
        ctx.save();
        ctx.translate(0, this.bobOffset);
        
        // Choose colors based on type
        let capColor, spotColor, stemColor;
        switch(this.type) {
            case 'super':
                capColor = '#FF0000';
                spotColor = '#FFFFFF';
                stemColor = '#FFDBAC';
                break;
            case 'fire':
                capColor = '#FF6600';
                spotColor = '#FFFF00';
                stemColor = '#FFDBAC';
                break;
            case '1up':
                capColor = '#00FF00';
                spotColor = '#FFFFFF';
                stemColor = '#FFDBAC';
                break;
            default:
                capColor = '#FF0000';
                spotColor = '#FFFFFF';
                stemColor = '#FFDBAC';
        }
        
        // Draw mushroom stem
        ctx.fillStyle = stemColor;
        ctx.fillRect(this.x + 8, this.y + 12, 8, 12);
        
        // Draw mushroom cap
        ctx.fillStyle = capColor;
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + 8, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw spots
        ctx.fillStyle = spotColor;
        ctx.beginPath();
        ctx.arc(this.x + 8, this.y + 6, 3, 0, Math.PI * 2);
        ctx.arc(this.x + 16, this.y + 6, 3, 0, Math.PI * 2);
        ctx.arc(this.x + 12, this.y + 10, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw eyes (cute detail)
        ctx.fillStyle = '#000000';
        ctx.fillRect(this.x + 6, this.y + 16, 2, 2);
        ctx.fillRect(this.x + 16, this.y + 16, 2, 2);
        
        ctx.restore();
    }
}

// Question Block Class
class QuestionBlock {
    constructor(x, y, contents = 'coin') {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.contents = contents; // 'coin', 'mushroom', 'fire'
        this.isUsed = false;
        this.type = 'questionblock';
        
        // Animation
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.bounceOffset = 0;
        this.bounceTimer = 0;
    }
    
    update() {
        if (!this.isUsed) {
            // Question mark animation
            this.animationTimer++;
            if (this.animationTimer >= 30) {
                this.animationFrame = (this.animationFrame + 1) % 4;
                this.animationTimer = 0;
            }
        }
        
        // Bounce animation when hit
        if (this.bounceTimer > 0) {
            this.bounceOffset = Math.sin(this.bounceTimer * 0.5) * 5;
            this.bounceTimer--;
        }
    }
    
    hit(game) {
        if (this.isUsed) return null;
        
        this.isUsed = true;
        this.bounceTimer = 10;
        
        // Create contents
        let item = null;
        switch(this.contents) {
            case 'coin':
                game.coins++;
                game.addScore(200);
                game.createParticles(this.x + this.width/2, this.y, '#FFD700');
                game.soundManager.play('coin');
                break;
            case 'mushroom':
                item = new Mushroom(this.x, this.y - 32, 'super');
                break;
            case 'fire':
                item = new Mushroom(this.x, this.y - 32, 'fire');
                break;
        }
        
        return item;
    }
    
    render(ctx) {
        this.update();
        
        ctx.save();
        ctx.translate(0, this.bounceOffset);
        
        if (this.isUsed) {
            // Used block (brown)
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Draw brick pattern
            ctx.strokeStyle = '#654321';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            ctx.strokeRect(this.x, this.y + this.height/2, this.width, 0);
        } else {
            // Active question block (yellow)
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Draw border
            ctx.strokeStyle = '#FFA500';
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            
            // Draw question mark
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Animate question mark
            const questionMarks = ['?', '?', '!', '?'];
            const currentMark = questionMarks[this.animationFrame];
            
            ctx.fillText(currentMark, this.x + this.width/2, this.y + this.height/2);
        }
        
        ctx.restore();
    }
}

// Brick Block Class
class BrickBlock {
    constructor(x, y, breakable = true) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.breakable = breakable;
        this.type = 'brickblock';
        this.isBroken = false;
        
        // Animation
        this.bounceOffset = 0;
        this.bounceTimer = 0;
    }
    
    hit(game) {
        if (this.isBroken) return false;
        
        this.bounceTimer = 10;
        
        if (this.breakable && (game.player.isBig || game.player.hasFirePower)) {
            // Break the block
            this.isBroken = true;
            game.addScore(50);
            game.createParticles(this.x + this.width/2, this.y + this.height/2, '#8B4513');
            return true; // Block was broken
        }
        
        return false; // Block wasn't broken
    }
    
    update() {
        // Bounce animation when hit
        if (this.bounceTimer > 0) {
            this.bounceOffset = Math.sin(this.bounceTimer * 0.5) * 3;
            this.bounceTimer--;
        }
    }
    
    render(ctx) {
        if (this.isBroken) return;
        
        this.update();
        
        ctx.save();
        ctx.translate(0, this.bounceOffset);
        
        // Draw brick block
        ctx.fillStyle = '#CD853F';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw brick pattern
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        
        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height/3);
        ctx.lineTo(this.x + this.width, this.y + this.height/3);
        ctx.moveTo(this.x, this.y + 2*this.height/3);
        ctx.lineTo(this.x + this.width, this.y + 2*this.height/3);
        ctx.stroke();
        
        // Vertical lines (offset for brick pattern)
        ctx.beginPath();
        ctx.moveTo(this.x + this.width/2, this.y);
        ctx.lineTo(this.x + this.width/2, this.y + this.height/3);
        ctx.moveTo(this.x + this.width/4, this.y + this.height/3);
        ctx.lineTo(this.x + this.width/4, this.y + 2*this.height/3);
        ctx.moveTo(this.x + 3*this.width/4, this.y + this.height/3);
        ctx.lineTo(this.x + 3*this.width/4, this.y + 2*this.height/3);
        ctx.moveTo(this.x + this.width/2, this.y + 2*this.height/3);
        ctx.lineTo(this.x + this.width/2, this.y + this.height);
        ctx.stroke();
        
        // Draw border
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        ctx.restore();
    }
}