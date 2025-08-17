// Sound Manager for New Super Mario Bros
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.isMuted = false;
        this.masterVolume = 0.5;
        this.musicVolume = 0.3;
        this.sfxVolume = 0.7;
        
        // Initialize audio context
        this.initAudioContext();
        
        // Create sound effects
        this.createSounds();
        
        // Background music
        this.backgroundMusic = null;
        this.currentMusicTrack = null;
    }
    
    initAudioContext() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            
            // Master volume control
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = this.masterVolume;
            this.masterGain.connect(this.audioContext.destination);
            
            console.log('Audio Context initialized successfully');
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
    }
    
    // Create procedural sound effects using Web Audio API
    createSounds() {
        if (!this.audioContext) return;
        
        // Jump sound
        this.sounds.jump = () => this.createJumpSound();
        
        // Coin collect sound
        this.sounds.coin = () => this.createCoinSound();
        
        // Enemy defeat sound
        this.sounds.enemyDefeat = () => this.createEnemyDefeatSound();
        
        // Power-up sound
        this.sounds.powerup = () => this.createPowerUpSound();
        
        // Game over sound
        this.sounds.gameOver = () => this.createGameOverSound();
        
        // Brick break sound
        this.sounds.brickBreak = () => this.createBrickBreakSound();
        
        // Damage/hurt sound
        this.sounds.damage = () => this.createDamageSound();
        
        // Level complete sound
        this.sounds.levelComplete = () => this.createLevelCompleteSound();
    }
    
    createJumpSound() {
        if (!this.audioContext || this.isMuted) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(330, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(523, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(this.sfxVolume * 0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }
    
    createCoinSound() {
        if (!this.audioContext || this.isMuted) return;
        
        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator1.type = 'square';
        oscillator2.type = 'square';
        
        // Harmony notes
        oscillator1.frequency.setValueAtTime(988, this.audioContext.currentTime);
        oscillator2.frequency.setValueAtTime(1319, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(this.sfxVolume * 0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
        
        oscillator1.start(this.audioContext.currentTime);
        oscillator2.start(this.audioContext.currentTime);
        oscillator1.stop(this.audioContext.currentTime + 0.3);
        oscillator2.stop(this.audioContext.currentTime + 0.3);
    }
    
    createEnemyDefeatSound() {
        if (!this.audioContext || this.isMuted) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(this.sfxVolume * 0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }
    
    createPowerUpSound() {
        if (!this.audioContext || this.isMuted) return;
        
        const frequencies = [262, 330, 392, 523, 659, 784, 1047];
        let time = this.audioContext.currentTime;
        
        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            oscillator.type = 'square';
            oscillator.frequency.value = freq;
            
            gainNode.gain.setValueAtTime(this.sfxVolume * 0.2, time);
            gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
            
            oscillator.start(time);
            oscillator.stop(time + 0.1);
            
            time += 0.08;
        });
    }
    
    createGameOverSound() {
        if (!this.audioContext || this.isMuted) return;
        
        const frequencies = [523, 494, 466, 440, 392, 349, 330, 294];
        let time = this.audioContext.currentTime;
        
        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            oscillator.type = 'triangle';
            oscillator.frequency.value = freq;
            
            gainNode.gain.setValueAtTime(this.sfxVolume * 0.4, time);
            gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
            
            oscillator.start(time);
            oscillator.stop(time + 0.4);
            
            time += 0.3;
        });
    }
    
    createBrickBreakSound() {
        if (!this.audioContext || this.isMuted) return;
        
        // Create noise for brick breaking effect
        const bufferSize = this.audioContext.sampleRate * 0.3;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
        }
        
        const noise = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        noise.buffer = buffer;
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        filter.type = 'highpass';
        filter.frequency.value = 1000;
        
        gainNode.gain.setValueAtTime(this.sfxVolume * 0.5, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
        
        noise.start(this.audioContext.currentTime);
    }
    
    createDamageSound() {
        if (!this.audioContext || this.isMuted) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(80, this.audioContext.currentTime + 0.8);
        
        gainNode.gain.setValueAtTime(this.sfxVolume * 0.4, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.8);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.8);
    }
    
    createLevelCompleteSound() {
        if (!this.audioContext || this.isMuted) return;
        
        const melody = [523, 587, 659, 698, 784, 880, 988, 1047];
        let time = this.audioContext.currentTime;
        
        melody.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            oscillator.type = 'square';
            oscillator.frequency.value = freq;
            
            const duration = index === melody.length - 1 ? 0.8 : 0.2;
            
            gainNode.gain.setValueAtTime(this.sfxVolume * 0.3, time);
            gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);
            
            oscillator.start(time);
            oscillator.stop(time + duration);
            
            time += 0.15;
        });
    }
    
    // Background music creation
    createBackgroundMusic() {
        if (!this.audioContext || this.isMuted) return;
        
        // Simple Mario-style melody
        const melody = [
            659, 659, 0, 659, 0, 523, 659, 0, 784, 0, 0, 0, 392, 0, 0, 0,
            523, 0, 0, 392, 0, 0, 330, 0, 0, 440, 0, 494, 0, 466, 440, 0,
            392, 659, 784, 880, 0, 698, 784, 0, 659, 0, 523, 587, 494, 0, 0
        ];
        
        this.playMelody(melody, 0.2, true);
    }
    
    playMelody(melody, noteDuration, loop = false) {
        if (!this.audioContext || this.isMuted) return;
        
        let time = this.audioContext.currentTime;
        
        melody.forEach((freq, index) => {
            if (freq > 0) {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.masterGain);
                
                oscillator.type = 'square';
                oscillator.frequency.value = freq;
                
                gainNode.gain.setValueAtTime(this.musicVolume * 0.1, time);
                gainNode.gain.exponentialRampToValueAtTime(0.001, time + noteDuration * 0.9);
                
                oscillator.start(time);
                oscillator.stop(time + noteDuration);
            }
            
            time += noteDuration;
        });
        
        if (loop) {
            setTimeout(() => {
                if (!this.isMuted) {
                    this.playMelody(melody, noteDuration, loop);
                }
            }, melody.length * noteDuration * 1000);
        }
    }
    
    // Public methods
    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }
    
    startBackgroundMusic() {
        if (this.currentMusicTrack) return;
        this.currentMusicTrack = setInterval(() => {
            this.createBackgroundMusic();
        }, 8000); // Loop every 8 seconds
    }
    
    stopBackgroundMusic() {
        if (this.currentMusicTrack) {
            clearInterval(this.currentMusicTrack);
            this.currentMusicTrack = null;
        }
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain) {
            this.masterGain.gain.value = this.isMuted ? 0 : this.masterVolume;
        }
        
        if (this.isMuted) {
            this.stopBackgroundMusic();
        } else {
            this.startBackgroundMusic();
        }
        
        return this.isMuted;
    }
    
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.masterGain && !this.isMuted) {
            this.masterGain.gain.value = this.masterVolume;
        }
    }
    
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
    }
    
    // Resume audio context (required for some browsers)
    resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
}