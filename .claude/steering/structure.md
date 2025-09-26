# Project Structure & Architecture

## Repository Organization

This is a **multi-project repository** containing distinct but related software development projects:

### Root Directory Structure
```
Strat490/
├── .claude/                    # Claude Code configuration and methodology
├── pixel-soccer/              # Complete web-based soccer game
├── ccspecdev/                  # Spec development framework documentation
└── pixelSoccer/               # Empty directory (legacy)
```

## Claude Code Framework Structure

### Configuration Directory: `.claude/`
```
.claude/
├── CLAUDE.md                   # Primary agent configuration and workflow
├── commands/                   # Slash command definitions
│   ├── add-feature.md
│   ├── create-steering-docs.md
│   ├── list-feature-names.md
│   └── start-task.md
├── specs/                      # Feature specifications (created by commands)
│   └── {feature-name}/         # Individual feature directories
│       ├── requirements.md     # EARS format requirements
│       ├── design.md          # System design and architecture
│       └── tasks.md           # Implementation task checklist
└── steering/                   # Project context documents
    ├── product.md
    ├── tech.md
    └── structure.md
```

### Spec Development Workflow Architecture
- **Phase-based progression**: Sequential Requirements → Design → Tasks
- **File-based persistence**: All specifications stored as markdown files
- **Command-driven interface**: Slash commands for workflow management
- **Approval gate pattern**: Explicit user approval required between phases

## Pixel Soccer Game Structure

### Application Architecture
```
pixel-soccer/
├── app.py                      # Flask application entry point
├── requirements.txt            # Python dependencies
├── README.md                   # Complete documentation
├── templates/                  # Jinja2 HTML templates
│   ├── base.html              # Base template with common elements
│   ├── index.html             # Main menu interface
│   ├── game.html              # Game canvas and UI
│   └── settings.html          # Configuration interface
└── static/                     # Client-side assets
    ├── css/
    │   └── style.css          # 8-bit retro styling
    ├── js/
    │   └── game.js            # Game engine and client logic
    ├── audio/                 # Sound effects (placeholder)
    └── sprites/               # Game sprites (placeholder)
```

### Backend Architecture Patterns

#### GameRoom Class Structure
- **State Management**: Centralized game state including ball physics, score, timer
- **Player Management**: Add/remove players, position tracking
- **Team Assignment**: Automatic home/away team assignment
- **Capacity Control**: Maximum 2 players per room

#### Flask Route Organization
- **Template Routes**: `/`, `/game`, `/settings` for page rendering
- **WebSocket Events**: Real-time communication handlers
- **Room Lifecycle**: Create, join, leave room management

#### WebSocket Event Architecture
```
Events:
├── create_room          # Initialize new game session
├── join_room           # Player joins existing session
├── player_move         # Real-time position updates
├── ball_update         # Ball physics synchronization
├── goal_scored         # Score tracking and reset
└── disconnect          # Cleanup on player leave
```

### Frontend Architecture Patterns

#### Game Engine Structure (game.js)
- **Canvas Rendering**: 60 FPS game loop with requestAnimationFrame
- **Physics System**: Velocity, friction, collision detection
- **Input Handling**: Keyboard event listeners for dual control schemes
- **State Synchronization**: WebSocket communication with server

#### Component Classes
- **Player Class**: Position, velocity, team assignment, controls
- **Ball Class**: Physics simulation, collision detection
- **AIPlayer Class**: State-based decision making for single-player mode
- **GameManager Class**: Overall game coordination and rule enforcement

#### UI Layer Organization
- **Menu System**: Navigation between game modes and settings
- **HUD Elements**: Score display, timer, status indicators
- **Settings Panel**: Volume controls, game configuration
- **Responsive Design**: Adapts to different screen sizes

## Architecture Patterns Used

### Design Patterns
- **MVC (Model-View-Controller)**: Clear separation of concerns
- **Observer Pattern**: Event-driven communication via WebSockets
- **Factory Pattern**: Dynamic creation of game rooms and players
- **Component Pattern**: Modular game entity design

### Data Flow Architecture
```
Client Input → JavaScript Game Engine → WebSocket → Flask Server → Game Room State → Broadcast to Clients
```

### State Management Strategy
- **Server Authority**: Game state managed on server side
- **Client Prediction**: Smooth local rendering with server reconciliation
- **Event Sourcing**: State changes driven by discrete events
- **Automatic Cleanup**: Resource management for disconnected players

## Extension Points

### Adding New Game Features
1. **Server Side**: Extend GameRoom class with new state properties
2. **Client Side**: Add corresponding JavaScript classes/functions
3. **Communication**: Define new WebSocket events for synchronization
4. **UI**: Update templates and CSS for new interface elements

### Scaling Considerations
- **Database Integration**: Replace in-memory storage with persistent database
- **Load Balancing**: Implement Redis for session sharing across instances
- **CDN Integration**: Serve static assets from content delivery network
- **Monitoring**: Add logging and metrics collection

### Development Workflow Integration
- **Feature Specifications**: Use `/add-feature` for new game features
- **Task Execution**: Use `/start-task` for systematic implementation
- **Documentation**: Update steering docs as architecture evolves
- **Testing Strategy**: Implement unit tests for each component class

This structure supports both rapid prototyping and systematic feature development through the integrated spec development methodology.