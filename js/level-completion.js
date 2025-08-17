// Level Completion System - Flagpoles, Exit Doors, and Level Progression

// Flagpole Class - Mario classic level ending
class Flagpole {
    constructor(x, y, height = 300) {
        this.x = x;
        this.y = y;
        this.width = 8;
        this.height = height;
        this.flagHeight = 32;
        this.flagWidth = 40;
        this.type = 'flagpole';
        
        // Flag state
        this.flag = {
            x: x + 8,
            y: y,
            isDescending: false,
            targetY: y + height - 50,
            speed: 3
        };
        
        // Animation state
        this.isActivated = false;
        this.completionTimer = 0;
        this.maxCompletionTime = 180; // 3 seconds at 60 FPS
        
        // Castle
        this.castle = {
            x: x + 100,
            y: y + height - 80,
            width: 120,
            height: 80
        };
    }
    
    update() {
        if (this.flag.isDescending) {
            // Flag descends down the pole
            if (this.flag.y < this.flag.targetY) {
                this.flag.y += this.flag.speed;
            }
            
            this.completionTimer++;
        }
    }
    
    activate(game) {
        if (this.isActivated) return;
        
        this.isActivated = true;
        this.flag.isDescending = true;
        
        // Play level complete sound
        if (game.soundManager) {
            game.soundManager.play('levelComplete');
            game.soundManager.stopBackgroundMusic();
        }
        
        // Award points based on flag height Mario touches
        const flagPositionScore = Math.max(100, 5000 - (this.flag.y - this.y) * 10);
        game.addScore(flagPositionScore);
        
        // Create fireworks effect
        game.createFireworks(this.x + 50, this.y + 100);
        
        return true;
    }
    
    isComplete() {
        return this.isActivated && this.completionTimer >= this.maxCompletionTime;
    }
    
    render(ctx) {
        // Draw flagpole
        ctx.fillStyle = '#228B22';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Pole details
        ctx.fillStyle = '#006400';
        for (let i = 0; i < this.height; i += 20) {
            ctx.fillRect(this.x - 2, this.y + i, this.width + 4, 4);
        }
        
        // Draw flag
        ctx.save();
        
        // Flag waving animation
        const waveOffset = Math.sin(Date.now() * 0.01) * 3;
        
        // Flag fabric
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.moveTo(this.flag.x, this.flag.y);
        ctx.lineTo(this.flag.x + this.flagWidth + waveOffset, this.flag.y);
        ctx.lineTo(this.flag.x + this.flagWidth + waveOffset, this.flag.y + this.flagHeight);
        ctx.lineTo(this.flag.x, this.flag.y + this.flagHeight);
        ctx.fill();
        
        // Flag details
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(this.flag.x + 5, this.flag.y + 5, 10, 10);
        ctx.fillRect(this.flag.x + 20, this.flag.y + 15, 10, 10);
        
        ctx.restore();
        
        // Draw castle
        this.drawCastle(ctx);
    }
    
    drawCastle(ctx) {
        const castle = this.castle;
        
        // Main castle body
        ctx.fillStyle = '#808080';
        ctx.fillRect(castle.x, castle.y, castle.width, castle.height);
        
        // Castle towers
        ctx.fillStyle = '#A0A0A0';
        ctx.fillRect(castle.x - 15, castle.y + 20, 20, 60);
        ctx.fillRect(castle.x + castle.width - 5, castle.y + 20, 20, 60);
        ctx.fillRect(castle.x + castle.width/2 - 10, castle.y - 20, 20, 40);
        
        // Castle details
        ctx.fillStyle = '#000000';
        // Door
        ctx.fillRect(castle.x + 50, castle.y + 40, 20, 40);
        
        // Windows
        ctx.fillRect(castle.x + 20, castle.y + 25, 8, 8);
        ctx.fillRect(castle.x + castle.width - 28, castle.y + 25, 8, 8);
        ctx.fillRect(castle.x + castle.width/2 - 4, castle.y - 10, 8, 8);
        
        // Flag on main tower
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(castle.x + castle.width/2 + 10, castle.y - 25, 15, 10);
    }
}

// Exit Door/Pipe Class
class ExitDoor {
    constructor(x, y, type = 'door', nextLevel = null) {
        this.x = x;
        this.y = y;
        this.width = 48;
        this.height = 64;
        this.type = type; // 'door', 'pipe', 'portal'
        this.nextLevel = nextLevel;
        
        // Animation
        this.glowIntensity = 0;
        this.glowDirection = 1;
        this.isActivated = false;
        
        // Entrance effect
        this.entranceTimer = 0;
        this.maxEntranceTime = 120; // 2 seconds
    }
    
    update() {
        // Glow animation
        this.glowIntensity += this.glowDirection * 0.02;
        if (this.glowIntensity >= 1 || this.glowIntensity <= 0) {
            this.glowDirection *= -1;
        }
        
        if (this.isActivated) {
            this.entranceTimer++;
        }
    }
    
    activate(game) {
        if (this.isActivated) return;
        
        this.isActivated = true;
        
        // Play entrance sound
        if (game.soundManager) {
            game.soundManager.play('levelComplete');
        }
        
        // Award completion bonus
        game.addScore(2000);
        
        return true;
    }
    
    isComplete() {
        return this.isActivated && this.entranceTimer >= this.maxEntranceTime;
    }
    
    render(ctx) {
        ctx.save();
        
        // Glow effect
        if (this.glowIntensity > 0.3) {
            ctx.shadowColor = '#00FF00';
            ctx.shadowBlur = 20 * this.glowIntensity;
        }
        
        if (this.type === 'door') {
            this.renderDoor(ctx);
        } else if (this.type === 'pipe') {
            this.renderPipe(ctx);
        } else {
            this.renderPortal(ctx);
        }
        
        ctx.restore();
        
        // Entry particles
        if (this.isActivated) {
            this.renderEntryEffect(ctx);
        }
    }
    
    renderDoor(ctx) {
        // Door frame
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x - 4, this.y - 4, this.width + 8, this.height + 8);
        
        // Door body
        ctx.fillStyle = '#654321';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Door panels
        ctx.strokeStyle = '#4A2C1F';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x + 6, this.y + 8, this.width - 12, this.height/2 - 12);
        ctx.strokeRect(this.x + 6, this.y + this.height/2 + 4, this.width - 12, this.height/2 - 12);
        
        // Door handle
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(this.x + this.width - 12, this.y + this.height/2, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Exit sign
        ctx.fillStyle = '#00FF00';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('EXIT', this.x + this.width/2, this.y - 10);
    }
    
    renderPipe(ctx) {
        // Pipe body
        ctx.fillStyle = '#00AA00';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Pipe rim
        ctx.fillStyle = '#00CC00';
        ctx.fillRect(this.x - 4, this.y - 4, this.width + 8, 12);
        
        // Pipe highlight
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(this.x + 4, this.y + 4, 8, this.height - 8);
        
        // Pipe shadow
        ctx.fillStyle = '#006600';
        ctx.fillRect(this.x + this.width - 12, this.y + 4, 8, this.height - 8);
        
        // Entry indicator
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.ellipse(this.x + this.width/2, this.y + 8, this.width/2 - 4, 6, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    renderPortal(ctx) {
        // Portal ring
        ctx.strokeStyle = '#9370DB';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
        ctx.stroke();
        
        // Portal energy
        const time = Date.now() * 0.01;
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI * 2 / 8) + time;
            const radius = 15 + Math.sin(time + i) * 5;
            const x = this.x + this.width/2 + Math.cos(angle) * radius;
            const y = this.y + this.height/2 + Math.sin(angle) * radius;
            
            ctx.fillStyle = `hsl(${270 + i * 30}, 100%, 70%)`;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Portal center
        ctx.fillStyle = 'rgba(147, 112, 219, 0.7)';
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, 20, 0, Math.PI * 2);
        ctx.fill();
    }
    
    renderEntryEffect(ctx) {
        const progress = this.entranceTimer / this.maxEntranceTime;
        const centerX = this.x + this.width/2;
        const centerY = this.y + this.height/2;
        
        // Spiraling particles
        for (let i = 0; i < 12; i++) {
            const angle = (Date.now() * 0.01 + i * 0.5) % (Math.PI * 2);
            const radius = 30 * (1 - progress) + Math.sin(Date.now() * 0.02 + i) * 10;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            ctx.fillStyle = `rgba(0, 255, 0, ${1 - progress})`;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// Level Complete Screen
class LevelCompleteScreen {
    constructor(game) {
        this.game = game;
        this.isVisible = false;
        this.animationTimer = 0;
        this.maxAnimationTime = 300; // 5 seconds
        
        // Results
        this.levelScore = 0;
        this.timeBonus = 0;
        this.livesBonus = 0;
        this.totalBonus = 0;
        this.currentLevel = 1;
        this.nextLevel = 2;
        
        // Animation states
        this.showingResults = false;
        this.showingScores = false;
        this.readyToContinue = false;
    }
    
    show(levelScore, timeRemaining, lives, currentLevel) {
        this.isVisible = true;
        this.animationTimer = 0;
        this.levelScore = levelScore;
        this.currentLevel = currentLevel;
        this.nextLevel = currentLevel + 1;
        
        // Calculate bonuses
        this.timeBonus = timeRemaining * 50;
        this.livesBonus = lives * 1000;
        this.totalBonus = this.timeBonus + this.livesBonus;
        
        // Animation sequence
        setTimeout(() => this.showingResults = true, 1000);
        setTimeout(() => this.showingScores = true, 2000);
        setTimeout(() => this.readyToContinue = true, 4000);
    }
    
    hide() {
        this.isVisible = false;
        this.showingResults = false;
        this.showingScores = false;
        this.readyToContinue = false;
    }
    
    update() {
        if (this.isVisible) {
            this.animationTimer++;
        }
    }
    
    render(ctx) {
        if (!this.isVisible) return;
        
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;
        
        // Overlay background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Title
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Level ${this.currentLevel} Complete!`, centerX, centerY - 150);
        
        if (this.showingResults) {
            // Level results
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '20px Arial';
            
            let yOffset = centerY - 80;
            
            ctx.fillText(`Level Score: ${this.levelScore}`, centerX, yOffset);
            yOffset += 40;
            
            if (this.showingScores) {
                ctx.fillText(`Time Bonus: ${this.timeBonus}`, centerX, yOffset);
                yOffset += 30;
                
                ctx.fillText(`Lives Bonus: ${this.livesBonus}`, centerX, yOffset);
                yOffset += 30;
                
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(centerX - 100, yOffset);
                ctx.lineTo(centerX + 100, yOffset);
                ctx.stroke();
                yOffset += 30;
                
                ctx.fillStyle = '#FFD700';
                ctx.font = 'bold 24px Arial';
                ctx.fillText(`Total: ${this.levelScore + this.totalBonus}`, centerX, yOffset);
            }
        }
        
        if (this.readyToContinue) {
            // Continue prompt
            ctx.fillStyle = '#00FF00';
            ctx.font = '16px Arial';
            const blinkOpacity = Math.sin(Date.now() * 0.01) * 0.5 + 0.5;
            ctx.globalAlpha = blinkOpacity;
            ctx.fillText('Press SPACE to continue to next level', centerX, centerY + 100);
            ctx.globalAlpha = 1;
            
            // Next level preview
            ctx.fillStyle = '#CCCCCC';
            ctx.font = '14px Arial';
            ctx.fillText(`Next: Level ${this.nextLevel}`, centerX, centerY + 130);
        }
    }
    
    handleInput(keyCode) {
        if (this.readyToContinue && keyCode === 'Space') {
            return true; // Signal to continue to next level
        }
        return false;
    }
}