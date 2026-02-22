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
def is_valid_email(email: str) -> bool:

    if not email:
        return False

    email_regex = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"
    return bool(re.match(email_regex, email))

def is_valid_password(password: str) -> bool:

    if not password:
        return False

    password_regex = r"^(?=.*[A-Za-z])(?=.*\d).{8,}$"
    return bool(re.match(password_regex, password))

def is_valid_username(username: str) -> bool:

    if not username:
        return False

    username_regex = r"^[A-Za-z0-9]{3,20}$"
    return bool(re.match(username_regex, username))

def register():
    data = request.json
    # get the information from the request
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not is_valid_email(email):
        return jsonify({"status": "Invalid email."}), 400

    if not is_valid_username(username):
        return jsonify({"status": "Invalid username."}), 400

    # check if valid password
    if not is_valid_password(password):
        return jsonify({"status": "Invalid password."}), 400


    email = email.lower() # ok to lowercase after we check it exists

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

    user = User.find_by_email(email)

    if user:
        print (user.to_dict())

    # if user does not exist, return 404
    if not user:
        return jsonify({"status": "Invalid Credentials."}), 404

    # get the password for that user
    database_password = user.get_password_hash()

    # if the password dne, or passwords don't match, return 404
    if not database_password or not bcrypt.check_password_hash(database_password, password):
        return jsonify({"status": "Invalid Credentials."}), 404

    print (f"creating token for {user.id}")
    # create tokens
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    return jsonify({
        "user": user.to_dict(),
        "access_token": access_token,
        "refresh_token": refresh_token
        }), 200


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

    from flask_jwt_extended import get_jwt
    raw = get_jwt()

    print("SUB in token:", raw.get("sub"))
    print("Identity returned:", user_id)

    user = User.find_by_id(int(user_id)) 

    if user:
        print (user.id)

    if not user:
        return jsonify({"status": "User not found."}), 404

    return jsonify({"user": user.to_dict()}), 200

@jwt_required()
def update_me():

    conn = get_db_connection()

    user_id = get_jwt_identity()
    user = User.find_by_id(int(user_id))

    if not user:
        return jsonify({"status:" "User not found."}), 404

    data = request.get_json()

    if not data:
        return jsonify({"status": "No data provided."}), 400


    # these fields can not be null
    non_nullable = {"username", "new_password", "old_password", "new_email", "old_email"}

    # ensure that these fields are not null
    invalid_fields = [k for k in non_nullable if k in data and not data[k]]
    if invalid_fields:
        return jsonify({"status": f"Fields cannot be null or empty: {', '.join(invalid_fields)}"}), 400

    try:

        # if either old_password or new_password in data
        if "old_password" in data or "new_password" in data:

            # both must be required
            if not all(k in data for k in ("old_password", "new_password")):
                return jsonify({"status": "Both old and new passwords are required."}), 400

            # make sure the new password is valid format
            if not is_valid_password(data["new_password"]):
                return jsonify({"status": "New password is not of valid format."}), 400

            # get the user's password from database
            database_password = user.get_password_hash()

            # check that the old password matches the password in our database
            if not bcrypt.check_password_hash(database_password, data["old_password"]):
                return jsonify({"status": "Old password is incorrect."}), 400

            user.compare_and_update("password_hash", 
                                    database_password, 
                                    bcrypt.generate_password_hash(data["new_password"]).decode('utf-8'),
                                    conn=conn)

        # if either old_email and new_email fields are in data
        if "old_email" in data or "new_email" in data:

            # both must be required
            if not all(k in data for k in ("old_email", "new_email")):
                return jsonify({"status": "Both old and new emails are required."}), 400

            # check if the new email is valid format
            if not is_valid_email(data["new_email"]):
                return jsonify({"status": "New email is not of valid format."}), 400

            user.compare_and_update("email", 
                                    data["old_email"].lower(), 
                                    data["new_email"].lower(),
                                    conn=conn)

        # next, update all fields that dont need a compare and swap
        user.update(data, conn=conn)

        # finally commit to the db if we were able to make all updates.
        conn.commit()

    # raise exceptions for the following errors
    except ValueError as e:
        conn.rollback()
        return jsonify({"status": str(e)}), 400

    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        return jsonify({"status": "Email already in use."}), 409

    except Exception as e:
        conn.rollback()
        return jsonify({"status": f"Database error {str(e)}."}), 500
    finally:
        conn.close()

    # retrieve the updated user from db
    updated_user = User.find_by_id(user.id)

    if not updated_user:
        return jsonify({"status": "Updated user not found."}), 404

    return jsonify({
        "user": updated_user.to_dict()
        }), 200

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
