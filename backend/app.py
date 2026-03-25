from controller.extensions import jwt

from dotenv import load_dotenv

from flask import Flask
from controller.AuthenticationControllerOOP import register, login, steam_login, steam_verify, sync_games, get_me, update_me, logout, getOrUpdate_availability1, retrieve_image
from controller.MatchmakingController import get_matches
from controller.Friend_controller import get_user_friends, accept_friend

from controller.ChatController import init_conversation, get_messages, register_chat_socket_events
from flask_socketio import SocketIO

#, login, auth_verify, logout, getOrUpdate_availability
#from controller.AuthenticationController import logout

import os
#from controller.AuthenticationController import bcrypt
#from controller.MatchmakingController import  get_matches

# Load the .env first
load_dotenv()
app = Flask(__name__)

# set the secret key

jwt.init_app(app)

# inititialize socket for chatting
socketio = SocketIO(app, cors_allowed_origins="*")

# register the chat socket events
register_chat_socket_events(socketio)

#
#"The configuration for cookie"
#app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
#app.config["JWT_COOKIE_SECURE"]= False  # Set to True in production (HTTPS)
#app.config["JWT_ACCESS_COOKIE_PATH"]  = "/"
#app.config["JWT_REFRESH_COOKIE_PATH"]= "/"
#app.config["JWT_COOKIE_CSRF_PROTECT"] = False # Set to True for better security later

from datetime import timedelta
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

# Configure the seed for the token
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")

# Needed for sessions in steam_login
app.secret_key = os.getenv("JWT_SECRET_KEY")

#bcrypt.init_app(app)

#jwt =  JWTManager(app)

# For Image Uploading
UPLOAD_FOLDER = "uploads"
# Valid image extensions which may change later
# IMAGE_EXTENSIONS = {"png", "jpg", "jpeg"}
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024  # 5MB

os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)


# --- Routes ---

# 1. Auth Operations
app.add_url_rule('/api/auth/register', view_func=register,  methods=['POST'])
app.add_url_rule('/api/auth/login',view_func=login, methods=['POST'])
#app.add_url_rule('/api/auth/verify/<token>', view_func=auth_verify, methods=['GET'])
app.add_url_rule('/api/auth/steamlogin', view_func=steam_login, methods=['GET'])
app.add_url_rule('/api/auth/steamverify', view_func=steam_verify, methods=['GET'])

## 2. Logout (Added to match Reference Sheet)
app.add_url_rule('/api/auth/logout',  view_func=logout, methods=['POST'])

## 3. User Info & Profile Update
app.add_url_rule('/api/user/me',  view_func=get_me, methods=['GET'])
app.add_url_rule('/api/user/me/sync', view_func=sync_games, methods=['POST'])

## 4. Update User Profile (Added to match Reference Sheet)
app.add_url_rule('/api/user/me', view_func=update_me,  methods=['PATCH'])

## 5. Availability
app.add_url_rule('/api/user/availability', view_func=getOrUpdate_availability1, methods=['GET','PUT'])
app.add_url_rule('/api/user/filters', view_func=get_matches, methods=["POST"])

## 6. Uploads
app.add_url_rule('/uploads/<filename>', view_func=retrieve_image, methods=['GET'])


# Chat

# start conversation
app.add_url_rule('/api/conversations',
                 view_func=init_conversation,
                 methods=['POST'])

# get messages
app.add_url_rule('/api/conversations/<int:conversation_id>/messages',
                 view_func=get_messages,
                 methods=['GET'])

# Get friends and requests
app.add_url_rule('/api/friends', view_func=get_user_friends, methods=['GET'])

# Accept or Decline a request
app.add_url_rule('/api/friends/accept', view_func=accept_friend, methods=['POST'])


if __name__ == '__main__':
    # Start a local web server on Port 8000
    #app.run(debug=True, port=8000)

    # replace app.run with socketio.run for chatting
    socketio.run(app, debug=True, port=8000)
