from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room
import uuid
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'pixel-soccer-secret-key'
socketio = SocketIO(app, cors_allowed_origins="*")

# Game rooms storage
game_rooms = {}

class GameRoom:
    def __init__(self, room_id):
        self.room_id = room_id
        self.players = {}
        self.game_state = {
            'ball': {'x': 400, 'y': 300, 'vx': 0, 'vy': 0},
            'score': {'home': 0, 'away': 0},
            'timer': 300,  # 5 minutes in seconds
            'game_active': False
        }
        self.max_players = 2

    def add_player(self, player_id, player_name):
        if len(self.players) < self.max_players:
            team = 'home' if len(self.players) == 0 else 'away'
            self.players[player_id] = {
                'name': player_name,
                'team': team,
                'x': 200 if team == 'home' else 600,
                'y': 300,
                'vx': 0,
                'vy': 0
            }
            return True
        return False

    def remove_player(self, player_id):
        if player_id in self.players:
            del self.players[player_id]

    def update_player_position(self, player_id, x, y, vx=0, vy=0):
        if player_id in self.players:
            self.players[player_id].update({'x': x, 'y': y, 'vx': vx, 'vy': vy})

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/game')
def game():
    return render_template('game.html')

@app.route('/settings')
def settings():
    return render_template('settings.html')

@socketio.on('create_room')
def handle_create_room(data):
    room_id = str(uuid.uuid4())[:8]
    game_rooms[room_id] = GameRoom(room_id)
    join_room(room_id)
    
    player_name = data.get('player_name', 'Player')
    game_rooms[room_id].add_player(request.sid, player_name)
    
    emit('room_created', {
        'room_id': room_id,
        'player_id': request.sid
    })

@socketio.on('join_room')
def handle_join_room(data):
    room_id = data.get('room_id')
    player_name = data.get('player_name', 'Player')
    
    if room_id in game_rooms:
        room = game_rooms[room_id]
        if room.add_player(request.sid, player_name):
            join_room(room_id)
            emit('joined_room', {
                'room_id': room_id,
                'player_id': request.sid,
                'players': room.players
            })
            emit('player_joined', {
                'player_id': request.sid,
                'player_name': player_name,
                'players': room.players
            }, room=room_id)
            
            # Start game if room is full
            if len(room.players) == room.max_players:
                room.game_state['game_active'] = True
                emit('game_start', room.game_state, room=room_id)
        else:
            emit('room_full')
    else:
        emit('room_not_found')

@socketio.on('player_move')
def handle_player_move(data):
    room_id = data.get('room_id')
    if room_id in game_rooms:
        room = game_rooms[room_id]
        room.update_player_position(
            request.sid,
            data.get('x'),
            data.get('y'),
            data.get('vx', 0),
            data.get('vy', 0)
        )
        emit('game_update', {
            'players': room.players,
            'ball': room.game_state['ball']
        }, room=room_id, include_self=False)

@socketio.on('ball_update')
def handle_ball_update(data):
    room_id = data.get('room_id')
    if room_id in game_rooms:
        room = game_rooms[room_id]
        room.game_state['ball'].update(data.get('ball', {}))
        emit('ball_sync', {
            'ball': room.game_state['ball']
        }, room=room_id, include_self=False)

@socketio.on('goal_scored')
def handle_goal_scored(data):
    room_id = data.get('room_id')
    team = data.get('team')
    
    if room_id in game_rooms and team in ['home', 'away']:
        room = game_rooms[room_id]
        room.game_state['score'][team] += 1
        
        # Reset ball position
        room.game_state['ball'] = {'x': 400, 'y': 300, 'vx': 0, 'vy': 0}
        
        emit('goal_scored', {
            'team': team,
            'score': room.game_state['score'],
            'ball': room.game_state['ball']
        }, room=room_id)

@socketio.on('disconnect')
def handle_disconnect():
    # Remove player from all rooms
    for room_id, room in game_rooms.items():
        if request.sid in room.players:
            room.remove_player(request.sid)
            emit('player_left', {
                'player_id': request.sid,
                'players': room.players
            }, room=room_id)
            
            # Remove empty rooms
            if len(room.players) == 0:
                del game_rooms[room_id]
            break

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)