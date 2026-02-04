from flask import Flask
from controller.AuthenticationController import register, login, auth_verify, get_me, logout, update_me
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
import os 
from dotenv import load_dotenv

# Load the .env first
load_dotenv()

app = Flask(__name__)

# Configure the seed for the token
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# --- Routes ---

# 1. Auth Operations
app.add_url_rule('/api/auth/register', view_func=register, methods=['POST'])
app.add_url_rule('/api/auth/login', view_func=login, methods=['POST'])
app.add_url_rule('/api/auth/verify/<token>', view_func=auth_verify, methods=['GET'])

# 2. Logout (Added to match Reference Sheet)
app.add_url_rule('/api/auth/logout', view_func=logout, methods=['POST'])

# 3. User Info & Profile Update
app.add_url_rule('/api/user/me', view_func=get_me, methods=['GET'])

# 4. Update User Profile (Added to match Reference Sheet)
app.add_url_rule('/api/user/me', view_func=update_me, methods=['PUT'])

if __name__ == '__main__':
    # Start a local web server on Port 8000
    app.run(debug=True, port=8000)