from flask import request, jsonify;
from controller.extensions import bcrypt, get_db_connection
from flask_jwt_extended import create_access_token, create_refresh_token, set_access_cookies

import controller.extensions

#from flask_jwt_extended import JWTManager

import psycopg2
import secrets
import os 
import re
#from model.User import User
from model.user import User
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended import unset_jwt_cookies

"""
The AuthenticationController class. It hashes the password, creates the token
and decides what message to send back to the user

"""

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
    # check if valid username
    username_regex = r"^[A-Za-z0-9]{3,20}$"
    if not re.match(username_regex, username):
        return jsonify({"status": "Invalid username"}), 400
    email = data.get('email').lower()
    # check if valid email
    email_regex = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"
    if not re.match(email_regex, email):
        return jsonify({"status": "Invalid email"}), 400
    password = data.get('password')
    # check if valid password
    password_regex = r"^(?=.*[A-Za-z])(?=.*\d).{8,}$"
    if not re.match(password_regex, password):
        return jsonify({"status": "Invalid password"}), 400
    # check if empty email or password
    if not email or not password:
        return jsonify({"status": "Missing email or password"}), 400


    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    #token = secrets.token_urlsafe(32)
    user = User.find_by_email(email)

    # Check if the user already exist
    if user:
        return jsonify({"status": "This email is in use."}), 409

    try:
        new_user = User.create(username, email, hashed_password)

        # this method tell the library to include the user_id to the token

        access_token = create_access_token(identity=str(new_user.id))
        refresh_token = create_refresh_token(identity=str(new_user.id))

        response = jsonify({
            "user": new_user.to_dict(),
            "access_token": access_token,
            "refresh_token": refresh_token
            })

        set_access_cookies(response, access_token)
        return response, 201
    except Exception as e:
        return jsonify({"status": str(e)}), 500
    

def login():

    data = request.json

    email = data.get('email')
    password = data.get('password')

    # validate that the email/password is not an empty string, None, or white space
    if not email or not email.strip() or not password or not password.strip():
        return jsonify({"status": "Missing email or password"}), 400

    # set to lower if it exists
    email = email.lower()

    # get just the hashed password from the database
    conn = get_db_connection()

    try:
        with conn.cursor() as cur:
            cur.execute("SELECT password_hash FROM users WHERE email = %s", (email,))
            result = cur.fetchone()
            cur.close()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

    # check if the hashed password and entered password are the same
    if result and bcrypt.check_password_hash(result[0], password):

        # true login
        # get the user by email
        user = User.find_by_email(email)

        # if nothing is returned, 404
        if not user:
            return jsonify({"status": "Invalid Credentials."}), 404

        # create tokens
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        return jsonify({
            "user": user.to_dict(),
            "access_token": access_token,
            "refresh_token": refresh_token
            }), 200

    return jsonify({"status": "Invalid Credentials."}), 404

#def auth_verify(token):
#    result = User.verify1(token)
#    if result:
#        return "<h1>Email Verified!</h1>", 200
#    return "<h1>Invalid Token</h1>", 400
#
#def get_user_info(email):
#    user = User.find_by_email(email)
#    if not user:
#        return jsonify({"status": "User not found"}), 404
#    # Don't send the password to the frontend
#    user.pop('password_hash', None)
#    return jsonify({"status": "The information of the current user", "user": user}), 200
#
@jwt_required()
def get_me():
    # Ask the token to get the id (The identity we set in login)
    user_id = get_jwt_identity() 

    user = User.find_by_id(user_id) 

    if not user:
        return jsonify({"status": "User not found."}), 404

    return jsonify({"user": user.to_dict()}), 200
#
#
#
#
#@jwt_required()
#def update_me():
#    user_id = get_jwt_identity() # Get the user id from the token
#    data = request.json
#    
#    new_username = data.get('username')
#    new_description = data.get('description')
#
#    try:
#        User.update_profile_by_id(user_id, **data)
#        
#        updated_user = User.find_by_id(user_id)
#        return jsonify({"user": updated_user}), 200
#    except Exception as e:
#        return jsonify({"status": f"Update failed: {str(e)}"}), 500
#
#@jwt_required()
#def logout():
#    # login successfully
#    response = jsonify({"msg": "logout successful"})
#    # If the frontend use the cookie, this line actually delete the token from the cookie
#    unset_jwt_cookies(response)
#    return response, 200
#
#
#"""
#This method handles both get and update users' availabilities
#"""
#@jwt_required()
#def getOrUpdate_availability():
#    user_id = get_jwt_identity()
#
#    if request.method=="PUT":
#        data = request.json.get("availability")
#        if not data:
#            return jsonify({"status": "No availability data provided"}), 400
#        
#        try:
#            User.update_profile_by_id(user_id, availability=data)
#            return jsonify({"status": "Availability updated", "availability": data}), 200
#        
#        except Exception as e:
#            return jsonify({"status": f"Update failed: {str(e)}"}), 500
#        
#    
#    availability = User.get_availability(user_id)
#    if availability is None:
#        return jsonify({"status": "Availability not found"}), 404
#    
#    return jsonify({"availability": availability}), 200
