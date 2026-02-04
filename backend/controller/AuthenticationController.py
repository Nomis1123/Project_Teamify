from flask import Flask, request, jsonify;
from flask_bcrypt import Bcrypt
import psycopg2
import secrets
import os 
from backend.model.User import User
app = Flask(__name__)
bcrypt = Bcrypt(app)



"""
The AuthenticationController class. It hashes the password, creates the token
and decides what message to send back to the user

"""

# Database connection funcntion
# def get_db_connection():
#     return psycopg2.connect(
#         host = "localhost",
#         database="teamify_db",
#         user = "name1",
#         password="your_password"
#     )

"""
Token: the users don't have to type it
Instead of typing the token, the user receive a unique url in their email

When the user clicks that link, their browser sends a request to the backend

Logic: The code looks at the URL, grabs the token part and checks the database for a match

"""
def signup():
    data = request.json
    # get the information from the request
    username = data.get('username')
    email = data.get('email').lower()
    password = data.get('password')
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    token = secrets.token_urlsafe(32)
    
    try:
        user_id = User.create1(username, email, hashed_password, token)
        return jsonify({"message": "Registration successful", "user_id": user_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

def login():
    data = request.json
    email = data.get('email').lower()
    password = data.get('password')
    
    user = User.find_by_email(email)
    if user:
        user_id, username, stored_hash, is_varified = user 
        if bcrypt.check_password_hash(stored_hash, password):
            if is_varified:
                return jsonify({"message": "Login success", "user": {"id": user_id, "username": username}}), 200
            return jsonify({"error": "Please verify email"}), 401
        return jsonify({"error": "Invalid password"}), 401
    return jsonify({"error": "User not found"}), 404

def verify(token):
    result = User.verify1(token)
    if result:
        return "<h1>Email Verified!</h1>", 200
    return "<h1>Invalid Token</h1>", 400

            