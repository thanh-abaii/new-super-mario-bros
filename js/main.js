// Main game initialization and control
let game;

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('New Super Mario Bros Loading...');
    
    // Check if all required elements exist
    const canvas = document.getElementById('gameCanvas');
    const startBtn = document.getElementById('startBtn');
    
    if (!canvas) {
        console.error('Game canvas not found!');
        return;
    }
    
    if (!startBtn) {
        console.error('Start button not found!');
        return;
    }
    
    try {
        // Create new game instance
        game = new Game();
        console.log('Game created successfully!');
        
        // Initial render
        game.render();
        
        // Add keyboard event listeners for better responsiveness
        setupKeyboardControls();
        
        // Add mobile touch controls
        setupTouchControls();
        
        // Add window resize handler
        setupResizeHandler();
        
        console.log('New Super Mario Bros Ready! Press Start to play.');
        
    } catch (error) {
        console.error('Error initializing game:', error);
        showErrorMessage('Failed to initialize game. Please refresh the page.');
    }
});

// Enhanced keyboard controls
function setupKeyboardControls() {
    // Prevent arrow keys from scrolling the page
    window.addEventListener('keydown', function(e) {
        if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);
    
    // Add help text for controls
    const controlsHelp = document.querySelector('.control-instructions');
    if (controlsHelp) {
        const additionalControls = document.createElement('div');
        additionalControls.innerHTML = `
            <p><strong>R:</strong> Reset Game</p>
            <p><strong>P:</strong> Pause/Resume</p>
            <p><strong>M:</strong> Mute/Unmute</p>
            <p><strong>ESC:</strong> Pause</p>
        `;
        controlsHelp.appendChild(additionalControls);
    }
    
    // Global key handlers for quick actions
    document.addEventListener('keydown', function(e) {
        if (!game) return;
        
        switch(e.code) {
            case 'KeyR':
                if (game.isRunning) game.reset();
                break;
            case 'KeyP':
                if (game.isRunning) game.togglePause();
                break;
            case 'KeyM':
                if (game.soundManager) {
                    const isMuted = game.soundManager.toggleMute();
                    document.getElementById('muteBtn').textContent = isMuted ? '🔇 Sound OFF' : '🔊 Sound ON';
                }
                break;
            case 'Escape':
                if (game.isRunning) game.togglePause();
                break;
        }
    });
}

// Touch controls for mobile devices
function setupTouchControls() {
    if (!('ontouchstart' in window)) return; // No touch support
    
    const canvas = document.getElementById('gameCanvas');
    const gameArea = document.querySelector('.game-area');
    
    // Create virtual controls for mobile
    const mobileControls = document.createElement('div');
    mobileControls.className = 'mobile-controls';
    mobileControls.innerHTML = `
        <div class="mobile-dpad">
            <button class="mobile-btn" data-key="ArrowLeft">←</button>
            <button class="mobile-btn" data-key="ArrowRight">→</button>
        </div>
        <div class="mobile-actions">
            <button class="mobile-btn jump-btn" data-key="Space">Jump</button>
            <button class="mobile-btn run-btn" data-key="ShiftLeft">Run</button>
        </div>
    `;
    
    // Add mobile controls CSS
    const mobileCSS = `
        .mobile-controls {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 50px;
            z-index: 1000;
        }
        
        .mobile-dpad, .mobile-actions {
            display: flex;
            gap: 10px;
        }
        
        .mobile-btn {
            width: 60px;
            height: 60px;
            border: 3px solid #FFD700;
            background: rgba(255, 215, 0, 0.8);
            color: #000;
            font-family: 'Press Start 2P', monospace;
            font-size: 12px;
            border-radius: 10px;
            cursor: pointer;
            user-select: none;
            touch-action: manipulation;
        }
        
        .mobile-btn:active {
            background: rgba(255, 255, 0, 0.9);
            transform: scale(0.95);
        }
        
        .jump-btn {
            background: rgba(255, 0, 0, 0.8);
            color: white;
        }
        
        .jump-btn:active {
            background: rgba(255, 100, 100, 0.9);
        }
        
        .run-btn {
            background: rgba(0, 255, 0, 0.8);
            color: white;
        }
        
        .run-btn:active {
            background: rgba(100, 255, 100, 0.9);
        }
        
        @media (min-width: 769px) {
            .mobile-controls {
                display: none;
            }
        }
    `;
    
    // Add CSS
    const style = document.createElement('style');
    style.textContent = mobileCSS;
    document.head.appendChild(style);
    
    // Add mobile controls to DOM
    document.body.appendChild(mobileControls);
    
    // Handle touch events
    mobileControls.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const button = e.target.closest('.mobile-btn');
        if (button && game) {
            const keyCode = button.getAttribute('data-key');
            game.keys[keyCode] = true;
        }
    });
    
    mobileControls.addEventListener('touchend', function(e) {
        e.preventDefault();
        const button = e.target.closest('.mobile-btn');
        if (button && game) {
            const keyCode = button.getAttribute('data-key');
            game.keys[keyCode] = false;
        }
    });
}

// Handle window resize
function setupResizeHandler() {
    window.addEventListener('resize', function() {
        if (game && game.canvas) {
            // Maintain aspect ratio on resize
            const container = document.querySelector('.game-area');
            const canvas = game.canvas;
            
            if (window.innerWidth < 768) {
                // Mobile adjustments
                canvas.style.width = '100%';
                canvas.style.height = 'auto';
                canvas.style.maxHeight = '60vh';
            } else {
                // Desktop adjustments
                canvas.style.width = '1200px';
                canvas.style.height = '600px';
                canvas.style.maxHeight = 'none';
            }
        }
    });
}

// Error handling
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <h3>⚠️ Game Error</h3>
        <p>${message}</p>
        <button onclick="location.reload()">Reload Page</button>
    `;
    
    const gameArea = document.querySelector('.game-area');
    if (gameArea) {
        gameArea.appendChild(errorDiv);
    }
    
    // Add error CSS
    const errorCSS = `
        .error-message {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 30px;
            border-radius: 10px;
            border: 3px solid #FFD700;
            text-align: center;
            font-family: 'Press Start 2P', monospace;
            z-index: 1001;
        }
        
        .error-message h3 {
            margin-bottom: 15px;
            font-size: 16px;
        }
        
        .error-message p {
            margin-bottom: 20px;
            font-size: 10px;
            line-height: 1.4;
        }
        
        .error-message button {
            background: #FFD700;
            color: #000;
            border: 2px solid #000;
            padding: 10px 20px;
            font-family: 'Press Start 2P', monospace;
            font-size: 8px;
            cursor: pointer;
            border-radius: 5px;
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = errorCSS;
    document.head.appendChild(style);
}

// Utility functions for game management
function pauseGame() {
    if (game && game.isRunning) {
        game.togglePause();
    }
}

function resetGame() {
    if (game) {
        game.reset();
    }
}

function startGame() {
    if (game && !game.isRunning) {
        game.start();
    }
}

// Performance monitoring
function monitorPerformance() {
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 0;
    
    function updateFPS() {
        const currentTime = performance.now();
        frameCount++;
        
        if (currentTime - lastTime >= 1000) {
            fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            frameCount = 0;
            lastTime = currentTime;
            
            // Display FPS (only in development)
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log(`FPS: ${fps}`);
                
                // Show FPS counter
                let fpsCounter = document.getElementById('fpsCounter');
                if (!fpsCounter) {
                    fpsCounter = document.createElement('div');
                    fpsCounter.id = 'fpsCounter';
                    fpsCounter.style.cssText = `
                        position: fixed;
                        top: 10px;
                        right: 10px;
                        background: rgba(0,0,0,0.7);
                        color: #FFD700;
                        padding: 5px 10px;
                        font-family: 'Press Start 2P', monospace;
                        font-size: 8px;
                        border-radius: 5px;
                        z-index: 1000;
                    `;
                    document.body.appendChild(fpsCounter);
                }
                fpsCounter.textContent = `FPS: ${fps}`;
            }
        }
        
        requestAnimationFrame(updateFPS);
    }
    
    // Start monitoring only in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        updateFPS();
    }
}

// Start performance monitoring
monitorPerformance();

// Global keyboard shortcuts info
console.log(`
🎮 NEW SUPER MARIO BROS CONTROLS:
   Movement: A/D or Arrow Keys
   Jump: Space or W
   Run: Hold Shift while moving
   
🔧 DEBUG CONTROLS:
   R: Reset Game
   P: Pause/Resume
   M: Mute/Unmute Audio
   Escape: Pause
   
📱 Mobile: Touch controls will appear on mobile devices
`);

// Expose game to global scope for debugging
window.game = game;