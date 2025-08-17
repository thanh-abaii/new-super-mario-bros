# 🎮 New Super Mario Bros

Một game New Super Mario Bros hoàn chỉnh được xây dựng bằng HTML5 Canvas, CSS3 và JavaScript thuần túy. Game bao gồm đầy đủ các tính năng kinh điển của Super Mario như nhảy, thu thập xu, tiêu diệt kẻ thù, vượt qua các chướng ngại vật và hoàn thành multiple levels.

![New Super Mario Bros Test](https://thanh-abaii.github.io/new-super-mario-bros/test.html)

## 🌟 Tính năng chính

### ✅ Đã hoàn thành
- **🕹️ Điều khiển Mario**: Di chuyển, nhảy, chạy với physics engine realistic  
- **🎯 Collision Detection**: Hệ thống va chạm chính xác cho platforms, enemies và collectibles
- **👾 Enemies đa dạng**: Goomba, Koopa Troopa, Piranha Plant với AI behavior
- **🏗️ Level Design**: Platforms, bricks, question blocks, pipes
- **💰 Collectibles**: Coins, power-ups (Super Mushroom, Fire Flower)
- **💫 Visual Effects**: Particles, animations, camera following
- **📱 Responsive Design**: Hỗ trợ cả desktop và mobile với touch controls
- **🎨 Retro Graphics**: Pixel art style với animations mượt mà
- **🔊 Complete Sound System**: Jump, coin, enemy defeat, power-up, damage sounds
- **🎵 Background Music**: Classic Mario-style chiptune melody
- **🎚️ Audio Controls**: Mute/unmute, volume sliders for master, SFX, and music
- **🏁 Level Completion System**: Flagpoles, exit doors/pipes, level progression
- **🗺️ Multiple Levels**: 3 levels với increasing difficulty và unique themes
- **⏱️ Time Limit System**: Countdown timer với bonus scoring
- **🎯 Level Complete Screen**: Animated results với score breakdown
- **🔄 Level Progression**: Automatic progression through multiple levels

### 🚧 Chưa hoàn thành
- **🏆 Advanced Power-ups**: Star power, Fire Mario with fireball shooting
- **💾 Save System**: High scores và progress saving (localStorage)
- **🎮 Advanced Enemies**: Flying enemies, boss fights
- **⭐ Special Items**: 1-Up mushrooms, invincibility stars
- **🌍 World Map**: Visual level selection screen
- **🎪 Bonus Stages**: Secret levels và mini-games

## 🎮 Cách chơi

### Điều khiển (Desktop)
- **A/D or ←/→**: Move Left/Right
- **Space or W**: Jump
- **Shift**: Run Fast (hold while moving)
- **R**: Reset game
- **P or Escape**: Pause/Resume
- **M**: Mute/Unmute Audio

### Điều khiển (Mobile)  
- **Touch Controls**: Virtual buttons appear automatically
- **←/→**: Move Left/Right
- **Jump**: Jump  
- **Run**: Run Fast

### Gameplay
1. **Mục tiêu**: Thu thập coins, tiêu diệt enemies và đến cờ đích để hoàn thành level
2. **Lives**: Bắt đầu với 3 mạng, mất mạng khi chạm enemies hoặc rơi xuống hố
3. **Points**: Kiếm điểm bằng cách thu thập coins (200pts), tiêu diệt enemies (100pts), và hoàn thành level
4. **Power-ups**: Thu thập mushrooms để Mario lớn lên và mạnh hơn
5. **Time Limit**: Mỗi level có giới hạn thời gian, bonus points cho thời gian còn lại
6. **Level Progression**: Hoàn thành 3 levels với độ khó tăng dần
7. **Level Completion**: Chạm vào flagpole và vào cửa exit để hoàn thành level

## 🛠️ Cấu trúc dự án

```
new-super-mario-bros/
├── index.html              # Main HTML file
├── test.html              # Test page với embedded game
├── sound-demo.html        # Sound system demonstration  
├── level-demo.html        # Level completion showcase
├── css/
│   └── style.css          # Game styling và responsive design
├── js/
│   ├── main.js           # Game initialization và controls
│   ├── game.js           # Core game engine
│   ├── player.js         # Mario player class
│   ├── level.js          # Platforms và collectibles
│   ├── enemies.js        # Enemy classes (Goomba, Koopa, Piranha)
│   ├── sound.js          # Complete sound system với Web Audio API
│   ├── level-completion.js # Flagpole, exit doors, level complete screen
│   └── levels.js         # Multiple level definitions và management
└── README.md             # Documentation
```

## 🎯 Game Objects

### Mario Player
- **Physics**: Realistic gravity, jumping, running
- **States**: Small/Big Mario, Fire Power, Damage invincibility  
- **Animations**: Walking, jumping, idle states

### Enemies
- **Goomba**: Basic walking enemy, can be jumped on
- **Koopa Troopa**: Shell-based enemy with two-hit system
- **Piranha Plant**: Pipe-dwelling enemy with emerge/retreat cycle

### Level Elements  
- **Platforms**: Ground và floating platforms với textures
- **Question Blocks**: Chứa coins hoặc power-ups
- **Brick Blocks**: Có thể phá hủy khi Mario lớn
- **Coins**: Collectible items cho points
- **Power-ups**: Super Mushroom và Fire Flower
- **Flagpole**: Classic Mario level ending với flag animation
- **Exit Doors**: Door, pipe, hoặc portal để vào level tiếp theo
- **Time Limit**: Countdown timer với visual warning

### Available Levels
1. **Level 1 - Green Hill**: Basic introduction với easy platforms và few enemies
2. **Level 2 - Underground Caves**: Challenging underground theme với gaps và more enemies  
3. **Level 3 - Sky Castle**: Advanced sky level với floating platforms và tough enemies

## 🔧 Technical Features

### Game Engine
- **60 FPS**: Smooth gameplay với requestAnimationFrame
- **Object-Oriented**: Clean class-based architecture
- **Collision Detection**: AABB collision system
- **Camera System**: Smooth following camera
- **Particle System**: Visual effects cho impacts

### Performance
- **Optimized Rendering**: Efficient canvas drawing
- **Mobile Optimization**: Touch-friendly controls
- **Memory Management**: Proper cleanup của dead objects
- **FPS Monitoring**: Development performance tracking

### Audio System
- **Web Audio API**: Procedural sound generation với real-time synthesis
- **Sound Effects**: Jump, coin collect, enemy defeat, power-up, damage, brick break sounds
- **Background Music**: Looping Mario-style chiptune melody
- **Audio Controls**: Master volume, SFX volume, music volume sliders
- **Cross-browser**: Compatible với Chrome, Firefox, Safari, Edge

## 🚀 Hướng dẫn chạy

1. **Clone hoặc download** project files
2. **Mở `index.html`** trong web browser hiện đại
3. **Click "Start"** để start New Super Mario Bros
4. **Complete all 3 levels** để win the game!
5. **Enjoy!** 🎮

### Yêu cầu hệ thống
- **Modern Web Browser**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **JavaScript**: Phải được enable
- **Canvas Support**: HTML5 Canvas API support

## 🏗️ Development Roadmap

### Phase 1: Core Game ✅ (Completed)
- [x] Basic Mario movement và physics
- [x] Platform collision detection  
- [x] Simple enemy AI (Goomba)
- [x] Coin collection system
- [x] Basic UI và controls

### Phase 2: Enhanced Features ✅ (Completed)  
- [x] Multiple enemy types
- [x] Power-up system
- [x] Advanced level elements
- [x] Visual effects và particles
- [x] Mobile responsive design

### Phase 3: Polish & Content (Next Steps)
- [ ] Sound effects và background music
- [ ] Multiple levels với increasing difficulty
- [ ] Boss fights
- [ ] Advanced power-ups và special abilities
- [ ] Improved graphics và sprite animations

### Phase 4: Advanced Features (Future)
- [ ] Level editor
- [ ] Multiplayer support  
- [ ] Achievements system
- [ ] Leaderboards
- [ ] Custom character skins

## 🎵 Assets & Credits

### Graphics
- **Custom Pixel Art**: Tất cả graphics được vẽ bằng code (Canvas API)
- **Color Palette**: Classic Mario color scheme
- **Animations**: Frame-based sprite animations

### Fonts
- **Press Start 2P**: Retro gaming font từ Google Fonts

### Inspiration
- **Original Super Mario Bros**: Nintendo (1985)
- **Modern Web Standards**: HTML5 Canvas API

## 🤝 Contributing

Contributions are welcome! Areas needing improvement:

1. **Sound System**: Implement Web Audio API
2. **Level Design**: Create more challenging levels  
3. **Performance**: Optimize for older devices
4. **Accessibility**: Add keyboard navigation, screen reader support
5. **Testing**: Cross-browser compatibility testing

## 📄 License

Dự án này được tạo ra cho mục đích học tập và giải trí. Inspired by original Super Mario Bros © Nintendo.

## 🔗 Demo

**Live Demo**: https://thanh-abaii.github.io/new-super-mario-bros

**GitHub Repository**: https://github.com/thanh-abaii/new-super-mario-bros

**Screenshot Features**:
- Responsive gameplay trên mọi devices
- Smooth 60 FPS performance  
- Classic Mario gameplay experience
- Modern web technologies

---

**Tạo bởi**: AI Assistant  
**Ngôn ngữ**: HTML5, CSS3, JavaScript ES6+  
**Platform**: Web Browser  
**Version**: 1.0.0

Enjoy playing New Super Mario Bros! 🍄👑