from controller.extensions import jwt

from dotenv import load_dotenv

from flask import Flask
from controller.AuthenticationControllerOOP import register, login, get_me, update_me, logout
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



# --- Routes ---

# 1. Auth Operations
app.add_url_rule('/api/auth/register', view_func=register,  methods=['POST'])
app.add_url_rule('/api/auth/login',view_func=login, methods=['POST'])
#app.add_url_rule('/api/auth/verify/<token>', view_func=auth_verify, methods=['GET'])
app.add_url_rule('/api/auth/steamlogin', view_func=steam_login, methods=['GET'])
app.add_url_rule('/api/auth/steamverify', view_func=steam_verify, methods=['GET'])
#
#
## 2. Logout (Added to match Reference Sheet)
app.add_url_rule('/api/auth/logout',  view_func=logout, methods=['POST'])
#
## 3. User Info & Profile Update
app.add_url_rule('/api/user/me',  view_func=get_me, methods=['GET'])
#
#
## 4. Update User Profile (Added to match Reference Sheet)
app.add_url_rule('/api/user/me', view_func=update_me,  methods=['PATCH'])
#
## 5. Availability
#app.add_url_rule('/api/user/availability', view_func=getOrUpdate_availability, methods=['GET','PUT'])
#
#app.add_url_rule('/api/user/filters', view_func=get_matches, methods=["POST"])

if __name__ == '__main__':
    # Start a local web server on Port 8000
    app.run(debug=True, port=8000)
