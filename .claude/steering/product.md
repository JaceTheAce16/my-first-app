# Product Overview

## Primary Product: Pixel Soccer Game

A web-based 8-bit style soccer game built for multiplayer entertainment with retro aesthetics and real-time gameplay.

### Target Audience
- Casual gamers who enjoy retro/pixel art aesthetics
- Friends looking for quick multiplayer games
- Developers interested in real-time web game architecture
- Browser game enthusiasts

### Core Features
- **Single Player Mode**: Play against AI with adjustable difficulty levels (Easy, Medium, Hard)
- **Local Multiplayer**: Two players sharing the same keyboard
- **Online Multiplayer**: Real-time multiplayer using WebSocket technology with room-based system
- **8-bit Retro Aesthetics**: Classic pixel art style with retro fonts and visual design
- **Responsive Controls**: Dual control schemes (WASD + Space / Arrow keys + Enter)
- **Configurable Settings**: Volume controls, game length options (3/5/7 minutes), AI difficulty

### Game Mechanics
- 2D top-down soccer field with realistic ball physics
- Simple player movement and ball control system
- Goal detection and scoring mechanics
- Real-time timer and scoreboard
- Physics system with momentum, friction, and collision detection

### Multiplayer System
- Room-based multiplayer with 8-character room codes
- Real-time synchronization using Socket.IO
- Automatic room cleanup when players disconnect
- Support for up to 2 players per room

## Secondary Product: Claude Code Spec Development Framework

A specialized development methodology and toolset for transforming feature ideas into comprehensive specifications.

### Target Audience
- Software developers using Claude Code
- Development teams requiring structured feature planning
- Projects needing systematic requirements engineering
- Teams implementing complex features requiring detailed specifications

### Core Features
- **Three-Phase Workflow**: Requirements → Design → Tasks progression
- **EARS Format Requirements**: Event-driven Acceptance Requirements Specification
- **Test-Driven Planning**: Implementation plans focused on incremental development
- **Requirement Traceability**: Every task references specific requirements
- **Single Task Execution**: Prevents complexity by focusing on one task at a time

### Available Commands
- `/add-feature`: Initialize new feature specifications
- `/start-task`: Execute specific implementation tasks
- `/list-feature-names`: View all created specifications
- `/create-steering-docs`: Generate project context documents

## Product Positioning

This is a **multi-project repository** containing:
1. A **complete game project** (pixel-soccer) demonstrating full-stack web development
2. A **development methodology framework** (ccspecdev) for structured software planning

Both products serve as learning resources and practical tools for developers, showcasing different aspects of software development from game creation to systematic feature planning.