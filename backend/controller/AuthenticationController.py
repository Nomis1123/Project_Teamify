from flask import Flask, request, jsonify;
from flask_bcrypt import Bcrypt
from flask_bcrypt import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, set_access_cookies
from flask_jwt_extended import JWTManager
import psycopg2
import secrets
import os 
from model.User import User
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended import unset_jwt_cookies

bcrypt = Bcrypt() # Initialize it 


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


def register():
    data = request.json
    # get the information from the request
    username = data.get('username')
    email = data.get('email').lower()
    password = data.get('password')
    if not email or not password:
        return jsonify({"status": "Missing email or password"}), 400
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    token = secrets.token_urlsafe(32)
    user = User.find_by_email(email)

    

    # Check if the user already exist
    if user:
        return jsonify({"status": "This email is in use."}), 409
    
    try:
        user_id = User.create1(username, email, hashed_password, token)
        # this method tell the library to include the user_id to the token
        access_token = create_access_token(identity=str(user_id))
        refresh_token = create_refresh_token(identity=str(user_id))
        response = jsonify({
                "user": {
                    "id": user_id,
                    "username": username,
                    "email": email,
                    "description": None, 
                    "profile_picture": None,
                    "availability": None
                },
                "access_token": access_token, 
                "refresh_token": refresh_token
            })
        set_access_cookies(response, access_token)
        return response, 200
    except Exception as e:
        return jsonify({"status": str(e)}), 500
    

def login():
    data = request.json
    email = data.get('email').lower()
    password = data.get('password')
    

    if not email or not password:
        return jsonify({"status": "Missing email or password"}), 400
    
    user = User.find_by_email(email)
    if not user:
        return jsonify({"status": "User not found"}), 404
    
    if check_password_hash(user['password_hash'], password):
        # For testing purpose
        # remove by user.get('is_verified') after the email verification
        # part is done
        is_verified = True
        if is_verified:
            # After the user login, set the curr_user to user
            # Create token using the user's ID as the identity
            # usually, do not store those 2 token in the table
            # The fontend should store them in Local storage or cookies
            # When logout: Since we don't store them in the DB, "logging out" usually means telling the frontend to delete the token
            # create those 2 tokens based on JWT_SECRET_KEY
            access_token = create_access_token(identity=str(user['id']))
            refresh_token = create_refresh_token(identity=str(user['id']))
            response = jsonify({
            "user": {
                "id": user['id'],
                "username": user['username'],
                "email": user['email'],
                "description": user['description'], 
                "profile_picture": user['profile_picture_url'],
                "availability": user['availability']
            },
            "access_token": access_token, 
            "refresh_token": refresh_token
        })
            set_access_cookies(response, access_token)
            return response, 200
        return jsonify({"status": "Please verify email"}), 401
    return jsonify({"status": "Invalid password"}), 401
    

def auth_verify(token):
    result = User.verify1(token)
    if result:
        return "<h1>Email Verified!</h1>", 200
    return "<h1>Invalid Token</h1>", 400

def get_user_info(email):
    user = User.find_by_email(email)
    if not user:
        return jsonify({"status": "User not found"}), 404
    # Don't send the password to the frontend
    user.pop('password_hash', None)
    return jsonify({"status": "The information of the current user", "user": user}), 200

@jwt_required()
def get_me():
    # Ask the token to get the id (The identity we set in login)
    user_id = get_jwt_identity() 
    
    user = User.find_by_id(user_id) 
    
    if not user:
        return jsonify({"status": "User not found"}), 404
        
    return jsonify({"user": user}), 200




@jwt_required()
def update_me():
    user_id = get_jwt_identity() # Get the user id from the token
    data = request.json
    
    new_username = data.get('username')
    new_description = data.get('description')

    try:
        User.update_profile_by_id(user_id, **data)
        
        updated_user = User.find_by_id(user_id)
        return jsonify({"user": updated_user}), 200
    except Exception as e:
        return jsonify({"status": f"Update failed: {str(e)}"}), 500

@jwt_required()
def logout():
    # login successfully
    response = jsonify({"msg": "logout successful"})
    # If the frontend use the cookie, this line actually delete the token from the cookie
    unset_jwt_cookies(response)
    return response, 200