# Technical Stack & Guidelines

## Pixel Soccer Game Technology Stack

### Backend Technologies
- **Python 3.7+**: Primary backend language
- **Flask 2.3.3**: Web framework for HTTP routes and template rendering
- **Flask-SocketIO 5.3.6**: WebSocket integration for real-time multiplayer
- **python-socketio 5.9.0**: Socket.IO server implementation
- **eventlet 0.33.3**: Asynchronous networking library for WebSocket support

### Frontend Technologies
- **HTML5 Canvas**: Primary rendering engine for game graphics
- **JavaScript ES6+**: Game engine and client-side logic
- **CSS3**: 8-bit retro styling and responsive design
- **Socket.IO Client**: Real-time communication with backend

### Architecture Patterns
- **MVC Pattern**: Clear separation between routes (controllers), templates (views), and game logic (models)
- **Event-Driven Architecture**: WebSocket events for real-time game state synchronization
- **Room-Based Multiplayer**: Isolated game sessions with state management
- **Component-Based Game Engine**: Modular classes (Player, Ball, AIPlayer, GameRoom)

### Development Guidelines

#### Code Style
- **Python**: Follow PEP 8 standards
- **JavaScript**: Use ES6+ features, consistent naming conventions
- **HTML/CSS**: Semantic HTML structure, BEM methodology for CSS classes

#### Performance Considerations
- **60 FPS Rendering**: Canvas-based game loop running at 60 frames per second
- **Efficient State Management**: Minimal state synchronization across clients
- **Memory Management**: Automatic cleanup of empty game rooms

#### Security Practices
- **CORS Configuration**: Properly configured for cross-origin requests
- **Input Validation**: Validate all client inputs on server side
- **Session Management**: Use Flask session handling for player identification

## Claude Code Spec Development Framework

### Core Technologies
- **Markdown**: Documentation format for all specification files
- **Mermaid**: Diagram generation for system architecture visualization
- **EARS Format**: Event-driven Acceptance Requirements Specification
- **File-based Storage**: Simple file system for specification persistence

### Methodology Principles
- **Sequential Workflow**: Strict Requirements → Design → Tasks progression
- **Approval Gates**: Explicit user approval required between phases
- **Test-Driven Planning**: Implementation plans focused on testing first
- **Single Responsibility**: One task execution at a time

### Best Practices

#### Requirements Engineering
- Use EARS format: "WHEN [event] THEN [system] SHALL [response]"
- Include both functional and non-functional requirements
- Maintain clear user story format: "As a [role], I want [feature], so that [benefit]"

#### Design Documentation
- Include system architecture diagrams using Mermaid
- Document all external dependencies and integrations
- Specify error handling strategies
- Plan comprehensive testing approaches

#### Task Management
- Break complex features into small, manageable tasks
- Ensure each task is independently testable
- Maintain requirement traceability for every task
- Use checkbox format for progress tracking

## Development Environment Setup

### Python Environment
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

### Running the Application
```bash
python app.py  # Starts Flask server on localhost:5000
```

### Testing Strategy
- **Unit Testing**: Test individual game components
- **Integration Testing**: Test WebSocket communication
- **Browser Testing**: Cross-browser compatibility verification
- **Performance Testing**: Frame rate and latency measurement

## Deployment Considerations

### Production Deployment
- Use production WSGI server (Gunicorn recommended)
- Configure Redis for session storage in multi-instance deployments
- Set up proper logging and monitoring
- Implement proper error handling and recovery

### Browser Compatibility
- Modern browsers with HTML5 Canvas support required
- WebSocket support mandatory for multiplayer functionality
- Hardware acceleration recommended for smooth performance

## Extension Guidelines

### Adding New Features
1. Follow the spec development framework workflow
2. Create comprehensive requirements documentation
3. Design with multiplayer synchronization in mind
4. Implement with test-driven development approach

### Code Organization
- Keep game logic separate from networking code
- Use modular component design for extensibility
- Maintain clear separation between client and server responsibilities
- Document all public APIs and event schemas