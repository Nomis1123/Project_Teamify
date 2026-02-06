from flask import Flask
from controller.AuthenticationController import register, login, auth_verify, get_me
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
import os 
from dotenv import load_dotenv


"""
This is the Entry Point and Router
"""


# Load the .env first
load_dotenv()
# Create the App Instance
# start the Flask engine and configure tools that the whole project needs

app = Flask(__name__)

# configure the seed for the token
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

bcrypt = Bcrypt(app)
jwt = JWTManager(app)
# --- Routes ---


# Go run the login() function inside the AuthenticationController
# 1. Register new user account
app.add_url_rule('/api/auth/register', view_func=register, methods=['POST'])
# 2. Log In
app.add_url_rule('/api/auth/login', view_func=login, methods=['POST'])

# 3. Verify Email
app.add_url_rule('/api/auth/verify/<token>', view_func=auth_verify, methods=['GET'])

# 4. Return the info of the current login user
app.add_url_rule('/api/user/me', view_func=get_me, methods=['GET'])

if __name__ == '__main__':
    # Setting debug=True helps you see errors in the terminal while testing
    # start a local web server on 
    app.run(debug=True, port=8000)