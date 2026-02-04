from flask import Flask
from backend.controller.AuthenticationController import signup, login, verify
from flask_bcrypt import Bcrypt

# Create the App Instance
# start the Flask engine and configure tools that the whole project needs
app = Flask(__name__)
bcrypt = Bcrypt(app)

# --- Routes ---
"""
This is the Entry Point and Router
"""

# Go run the login() function inside the AuthenticationController
# 1. Sign Up
app.add_url_rule('/api/auth/signup', view_func=signup, methods=['POST'])

# 2. Log In
app.add_url_rule('/api/auth/login', view_func=login, methods=['POST'])

# 3. Verify Email
app.add_url_rule('/api/auth/verify/<token>', view_func=verify, methods=['GET'])

if __name__ == '__main__':
    # Setting debug=True helps you see errors in the terminal while testing
    # start a local web server on 
    app.run(debug=True, port=5000)