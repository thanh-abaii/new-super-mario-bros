// Level Definition System - Multiple Levels with Increasing Difficulty

class LevelManager {
    constructor(game) {
        this.game = game;
        this.levels = [];
        this.currentLevelData = null;
        
        // Initialize all levels
        this.initializeLevels();
    }
    
    initializeLevels() {
        // Level 1: Basic introduction
        this.levels.push({
            id: 1,
            name: "Green Hill",
            timeLimit: 400,
            backgroundColor: { sky: '#5C94FC', ground: '#00AA00' },
            platforms: [
                // Ground
                ...Array.from({length: 35}, (_, i) => ({
                    x: i * 60, y: 560, width: 60, height: 40, color: '#8B4513'
                })),
                // Floating platforms
                { x: 300, y: 450, width: 120, height: 20, color: '#228B22' },
                { x: 500, y: 400, width: 120, height: 20, color: '#228B22' },
                { x: 750, y: 350, width: 120, height: 20, color: '#228B22' }
            ],
            enemies: [
                { type: 'Goomba', x: 400, y: 480 },
                { type: 'Goomba', x: 650, y: 480 },
                { type: 'Goomba', x: 900, y: 480 }
            ],
            collectibles: [
                { type: 'coin', x: 350, y: 420 },
                { type: 'coin', x: 380, y: 420 },
                { type: 'coin', x: 550, y: 370 },
                { type: 'coin', x: 800, y: 320 }
            ],
            blocks: {
                question: [
                    { x: 320, y: 418, contents: 'coin' },
                    { x: 520, y: 368, contents: 'mushroom' }
                ],
                brick: [
                    { x: 352, y: 418 },
                    { x: 384, y: 418 }
                ]
            },
            completion: {
                flagpole: { x: 1650, y: 260 },
                exitDoor: { x: 1750, y: 496, type: 'door' }
            }
        });
        
        // Level 2: More challenging
        this.levels.push({
            id: 2,
            name: "Underground Caves",
            timeLimit: 350,
            backgroundColor: { sky: '#2F2F2F', ground: '#8B4513' },
            platforms: [
                // Ground with gaps
                ...Array.from({length: 15}, (_, i) => ({
                    x: i * 60, y: 560, width: 60, height: 40, color: '#654321'
                })),
                ...Array.from({length: 10}, (_, i) => ({
                    x: (i + 20) * 60, y: 560, width: 60, height: 40, color: '#654321'
                })),
                // More complex platforms
                { x: 250, y: 480, width: 80, height: 20, color: '#8B4513' },
                { x: 400, y: 420, width: 80, height: 20, color: '#8B4513' },
                { x: 550, y: 360, width: 80, height: 20, color: '#8B4513' },
                { x: 700, y: 300, width: 120, height: 20, color: '#8B4513' },
                { x: 900, y: 400, width: 100, height: 20, color: '#8B4513' }
            ],
            enemies: [
                { type: 'Goomba', x: 300, y: 480 },
                { type: 'Koopa', x: 500, y: 470, color: 'green' },
                { type: 'Goomba', x: 800, y: 480 },
                { type: 'Koopa', x: 1000, y: 470, color: 'red' },
                { type: 'PiranhaPlant', x: 1100, y: 480 }
            ],
            collectibles: [
                { type: 'coin', x: 280, y: 450 },
                { type: 'coin', x: 430, y: 390 },
                { type: 'coin', x: 580, y: 330 },
                { type: 'coin', x: 730, y: 270 },
                { type: 'coin', x: 760, y: 270 },
                { type: 'coin', x: 930, y: 370 }
            ],
            blocks: {
                question: [
                    { x: 280, y: 448, contents: 'coin' },
                    { x: 430, y: 388, contents: 'fire' },
                    { x: 730, y: 268, contents: 'coin' }
                ],
                brick: [
                    { x: 312, y: 448 },
                    { x: 344, y: 448 },
                    { x: 462, y: 388 },
                    { x: 494, y: 388 },
                    { x: 762, y: 268 }
                ]
            },
            completion: {
                flagpole: { x: 1850, y: 260 },
                exitDoor: { x: 1950, y: 496, type: 'pipe' }
            }
        });
        
        // Level 3: Advanced challenge
        this.levels.push({
            id: 3,
            name: "Sky Castle",
            timeLimit: 300,
            backgroundColor: { sky: '#87CEEB', ground: '#FFD700' },
            platforms: [
                // Floating castle-like platforms
                ...Array.from({length: 12}, (_, i) => ({
                    x: i * 60, y: 560, width: 60, height: 40, color: '#C0C0C0'
                })),
                // Sky platforms
                { x: 200, y: 500, width: 60, height: 20, color: '#FFFFFF' },
                { x: 350, y: 440, width: 80, height: 20, color: '#FFFFFF' },
                { x: 500, y: 380, width: 100, height: 20, color: '#FFFFFF' },
                { x: 650, y: 320, width: 80, height: 20, color: '#FFFFFF' },
                { x: 800, y: 280, width: 120, height: 20, color: '#FFFFFF' },
                { x: 1000, y: 360, width: 100, height: 20, color: '#FFFFFF' },
                { x: 1200, y: 400, width: 140, height: 20, color: '#FFFFFF' },
                { x: 1400, y: 340, width: 100, height: 20, color: '#FFFFFF' }
            ],
            enemies: [
                { type: 'Koopa', x: 380, y: 350, color: 'red' },
                { type: 'Goomba', x: 530, y: 330 },
                { type: 'Koopa', x: 680, y: 270, color: 'green' },
                { type: 'Goomba', x: 830, y: 250 },
                { type: 'Goomba', x: 860, y: 250 },
                { type: 'Koopa', x: 1030, y: 310, color: 'red' },
                { type: 'PiranhaPlant', x: 1250, y: 320 }
            ],
            collectibles: [
                { type: 'coin', x: 220, y: 470 },
                { type: 'coin', x: 380, y: 410 },
                { type: 'coin', x: 530, y: 350 },
                { type: 'coin', x: 680, y: 290 },
                { type: 'coin', x: 830, y: 250 },
                { type: 'coin', x: 860, y: 250 },
                { type: 'coin', x: 890, y: 250 },
                { type: 'coin', x: 1030, y: 330 },
                { type: 'coin', x: 1230, y: 370 },
                { type: 'coin', x: 1260, y: 370 }
            ],
            blocks: {
                question: [
                    { x: 380, y: 408, contents: 'mushroom' },
                    { x: 680, y: 288, contents: 'fire' },
                    { x: 1030, y: 328, contents: 'coin' }
                ],
                brick: [
                    { x: 412, y: 408 },
                    { x: 444, y: 408 },
                    { x: 712, y: 288 },
                    { x: 744, y: 288 },
                    { x: 1062, y: 328 },
                    { x: 1094, y: 328 }
                ]
            },
            completion: {
                flagpole: { x: 1750, y: 260 },
                exitDoor: { x: 1850, y: 496, type: 'portal' }
            }
        });
    }
    
    getLevelData(levelNumber) {
        return this.levels.find(level => level.id === levelNumber) || this.levels[0];
    }
    
    loadLevel(levelNumber) {
        this.currentLevelData = this.getLevelData(levelNumber);
        this.buildLevel();
        return this.currentLevelData;
    }
    
    buildLevel() {
        const level = this.currentLevelData;
        const game = this.game;
        
        // Clear existing objects
        game.platforms = [];
        game.enemies = [];
        game.collectibles = [];
        game.questionBlocks = [];
        game.brickBlocks = [];
        
        // Set time limit
        game.timeRemaining = level.timeLimit;
        
        // Build platforms
        level.platforms.forEach(platform => {
            game.platforms.push(new Platform(
                platform.x, platform.y, platform.width, platform.height, platform.color
            ));
        });
        
        // Build enemies
        level.enemies.forEach(enemy => {
            switch(enemy.type) {
                case 'Goomba':
                    game.enemies.push(new Goomba(enemy.x, enemy.y, game));
                    break;
                case 'Koopa':
                    game.enemies.push(new Koopa(enemy.x, enemy.y, game, enemy.color));
                    break;
                case 'PiranhaPlant':
                    game.enemies.push(new PiranhaPlant(enemy.x, enemy.y, game));
                    break;
            }
        });
        
        // Build collectibles
        level.collectibles.forEach(collectible => {
            if (collectible.type === 'coin') {
                game.collectibles.push(new Coin(collectible.x, collectible.y));
            }
        });
        
        // Build question blocks
        if (level.blocks.question) {
            level.blocks.question.forEach(block => {
                game.questionBlocks.push(new QuestionBlock(block.x, block.y, block.contents));
            });
        }
        
        // Build brick blocks
        if (level.blocks.brick) {
            level.blocks.brick.forEach(block => {
                game.brickBlocks.push(new BrickBlock(block.x, block.y));
            });
        }
        
        // Build completion elements
        const completion = level.completion;
        game.flagpole = new Flagpole(completion.flagpole.x, completion.flagpole.y, 300);
        game.exitDoor = new ExitDoor(
            completion.exitDoor.x, 
            completion.exitDoor.y, 
            completion.exitDoor.type,
            level.id + 1
        );
        
        console.log(`Level ${level.id} - ${level.name} loaded successfully!`);
    }
    
    getCurrentLevelName() {
        return this.currentLevelData ? this.currentLevelData.name : "Unknown";
    }
    
    getTotalLevels() {
        return this.levels.length;
    }
    
    isLastLevel(levelNumber) {
        return levelNumber >= this.levels.length;
    }
}