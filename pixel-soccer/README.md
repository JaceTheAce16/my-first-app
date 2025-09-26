# Pixel Soccer

A simple, fun, web-based 8-bit soccer game built with Python Flask and Socket.IO for real-time multiplayer functionality.

## Features

- **Single Player Mode**: Play against AI with adjustable difficulty
- **Local Multiplayer**: Two players on the same keyboard
- **Online Multiplayer**: Real-time multiplayer using WebSockets
- **8-bit Retro Style**: Pixel art aesthetics with classic fonts
- **Responsive Controls**: WASD + Space / Arrow keys + Enter
- **Configurable Settings**: Sound, music, game length, and AI difficulty

## Installation & Setup

### Prerequisites
- Python 3.7+
- pip (Python package installer)

### Installation Steps

1. **Clone or download the project files**
   ```bash
   cd pixel-soccer
   ```

2. **Create a virtual environment (recommended)**
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install required dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Open your browser and navigate to**
   ```
   http://localhost:5000
   ```

## How to Play

### Controls

**Player 1 (Blue Team - Home):**
- W, A, S, D - Move
- Space - Kick ball

**Player 2 (Red Team - Away):**
- Arrow Keys - Move  
- Enter - Kick ball

### Game Modes

1. **Quick Match**: Single player vs AI
2. **Local Multiplayer**: Two players on same device
3. **Online Multiplayer**: 
   - Create a room and share the 8-character code
   - Or join an existing room with a room code

### Objective
- Score more goals than your opponent before time runs out
- Default game time is 5 minutes (configurable in settings)
- Ball physics include momentum and collision detection

## Game Features

### Core Gameplay
- 2D top-down soccer field with realistic ball physics
- Simple but engaging player movement and ball control
- Goal detection and scoring system
- Real-time timer and scoreboard

### AI System
- Three difficulty levels: Easy, Medium, Hard
- AI players use state-based decision making
- Balances between chasing ball and defending goal

### Multiplayer
- Room-based multiplayer system
- Real-time synchronization using Socket.IO
- Lag compensation and smooth gameplay
- Automatic room cleanup when players disconnect

### Settings
- Volume controls for sound effects and music
- Adjustable game length (3, 5, or 7 minutes)
- AI difficulty selection
- Settings persist in browser localStorage

## Technical Details

### Architecture
- **Backend**: Python Flask with Flask-SocketIO
- **Frontend**: HTML5 Canvas with JavaScript
- **Real-time Communication**: WebSockets via Socket.IO
- **Styling**: CSS3 with retro 8-bit aesthetics

### File Structure
```
pixel-soccer/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── templates/            # HTML templates
│   ├── base.html
│   ├── index.html       # Main menu
│   ├── game.html        # Game interface  
│   └── settings.html    # Settings page
└── static/              # Static assets
    ├── css/
    │   └── style.css    # 8-bit styling
    ├── js/
    │   └── game.js      # Game engine
    ├── audio/           # Sound effects (placeholder)
    └── sprites/         # Game sprites (placeholder)
```

### Game Engine Details
- Canvas-based rendering at 60 FPS
- Physics system with velocity, friction, and collision detection
- Input handling with keyboard event listeners
- Modular class structure (Player, Ball, AIPlayer, etc.)

## Development Notes

### Adding Sound Effects
To add audio, place sound files in `static/audio/` and update the game.js:
```javascript
// Example audio implementation
const kickSound = new Audio('/static/audio/kick.wav');
// Play in kickBall() method
```

### Adding Sprites
Replace the canvas-drawn players and ball with sprites:
1. Add image files to `static/sprites/`
2. Load images in the game engine
3. Use `drawImage()` instead of `arc()` in render methods

### Deploying Online
For production deployment:
1. Use a production WSGI server (e.g., Gunicorn)
2. Configure proper Socket.IO settings for your hosting platform
3. Use Redis for session storage in multi-instance deployments

## Troubleshooting

### Common Issues

**Game won't start:**
- Ensure all dependencies are installed: `pip install -r requirements.txt`
- Check that Flask and Socket.IO versions are compatible

**Multiplayer not working:**
- Verify firewall settings allow port 5000
- Check browser console for WebSocket connection errors
- Ensure both players are on the same network (for local testing)

**Performance issues:**
- Try reducing the canvas size in game.html
- Check browser developer tools for JavaScript errors
- Ensure hardware acceleration is enabled in browser

### Browser Compatibility
- Modern browsers with HTML5 Canvas support
- WebSocket support required for multiplayer
- Tested on Chrome, Firefox, Safari, and Edge

## Contributing

Feel free to fork this project and submit pull requests for improvements:
- Add more game modes (tournament, power-ups)
- Improve AI intelligence
- Add mobile touch controls
- Enhance visual effects and animations
- Add sound effects and music

## License

This project is open source and available under the MIT License.