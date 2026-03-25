from flask import jsonify, redirect, request, url_for, session, current_app, send_from_directory
from controller.extensions import bcrypt, get_db_connection
from flask_jwt_extended import create_access_token, create_refresh_token, set_access_cookies

import controller.extensions

#from flask_jwt_extended import JWTManager

import psycopg2
import secrets
import os 
import re
import requests
import json
import uuid
#from model.User import User
from model.user import User
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended import unset_jwt_cookies
# from werkzeug.utils import secure_filename

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

STEAM_OPENID_URL = "https://steamcommunity.com/openid/login"
MAX_IMAGE_SIZE = 5 * 1024 * 1024

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


# Redirects user to log in to Steam
@jwt_required()
def steam_login():
    # Get userID
    user_id = get_jwt_identity()

    # Store info to link SteamID to UserID later
    session["Account_Link_Steam"] = user_id

    # Construct url for redirect
    return_url = url_for("steam_verify", _external=True)
    realm = request.host_url
    params = {"openid.ns": "http://specs.openid.net/auth/2.0",
              "openid.mode": "checkid_setup",
              "openid.return_to": return_url,
              "openid.realm": realm,
              "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
              "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select"}
    query = "&".join([f"{k}={v}" for k, v in params.items()])

    # Return url to frontend
    return jsonify({"redirect_url": f"{STEAM_OPENID_URL}?{query}"})


# Steam redirects users here after logging in to Steam
def steam_verify():
    # Get UserID stored before linking
    user_id = session.get("Account_Link_Steam")
    if not user_id:
        return jsonify({"status": "Steam link session expired"}), 400

    # Get user object by UserID
    user = User.find_by_id(int(user_id))
    if not user:
        return jsonify({"status:" "User not found."}), 404

    # Verify response with Steam
    params = dict(request.args)
    params["openid.mode"] = "check_authentication"
    response = requests.post(STEAM_OPENID_URL,
                             data=params,
                             headers={"Content-Type": "application/x-www-form-urlencoded"})
    if response.status_code != 200 or "is_valid:true" not in response.text:
        session.pop("Account_Link_Steam", None)
        return jsonify({"status": "Steam verification failed"}), 400

    # Receive response from Steam
    steam_id = request.args.get("openid.claimed_id")
    if not steam_id:
        session.pop("Account_Link_Steam", None)
        return jsonify({"status": "Steam login cancelled"}), 400

    # Extract SteamID from response
    match = re.search(r"/(\d+)$", steam_id)
    if not match:
        session.pop("Account_Link_Steam", None)
        return jsonify({"status": "SteamID not found"}), 400
    steam_id = match.group(1)

    # Link UserID to SteamID in database
    try:
        user.update({"steam_id": steam_id})
    except Exception as e:
        pass # temp placeholder
    session.pop("Account_Link_Steam", None)

    # Redirect back to profile page
    return redirect("http://localhost:5173/profile")

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
    image = request.files.get("image")
    is_image = request.content_type.startswith('multipart/form-data')

    # Handle Upload Profile Image if we receive an image in formData format.
    if image:
        return upload_image(image)

    conn = get_db_connection()

    user_id = get_jwt_identity()
    user = User.find_by_id(int(user_id))

    # We check if content type is formData which is only for image uploads,
    # If we dont, then we may get 415 as data only accepts json not an image.
    if is_image:
        # We could just have this part do nothing instead.
        return jsonify({"status": "No new image provided"}), 400

    if not user:
        # Somebody else check this, : is instead string.
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

        # remove old_email, new_email, old_password, new_password
        # then if the dictionary is not empty, call the user.update
        data.pop("old_email", None)
        data.pop("new_email", None)
        data.pop("old_password", None)
        data.pop("new_password", None)

        # if theres anything left to update
        if data:
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
        return jsonify({"status": "Field already in use."}), 409

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
@jwt_required()
def logout():
    # login successfully
    response = jsonify({"msg": "logout successful"})
    # If the frontend use the cookie, this line actually delete the token from the cookie
    unset_jwt_cookies(response)
    return response, 200



"""
This method handles both get and update users' availabilities
"""
@jwt_required()
def getOrUpdate_availability1():
   user_id = get_jwt_identity()
   conn = get_db_connection()
   try:
        if request.method=="PUT":
            data = request.json.get("availability")
            if not data:
                return jsonify({"status": "No availability data provided"}), 400

            json_data = json.dumps(data)
            User.update_profile_by_id(user_id, availability=json_data, conn=conn)
            conn.commit()
            return jsonify({"status": "Availability updated", "availability": data}), 200


        availability = User.get_availability(user_id, conn=conn)
        if availability is None:
            return jsonify({"status": "Availability not found"}), 404

        return jsonify({"availability": availability}), 200
   except Exception as e:
       if conn: conn.rollback()
       return jsonify({"status": f"Database error: {str(e)}"}), 500

   finally:
       if conn: conn.close()



def upload_image(image_file):
    # This is a helper function for handling upload in update_me() which already requires jwt
    user_id = get_jwt_identity()
    user = User.find_by_id(int(user_id))
    upload_folder = current_app.config["UPLOAD_FOLDER"]
    conn = get_db_connection()

    if not user:
        return jsonify({"status": "User not found."}), 404

    try:
        if not image_file:
            return jsonify({"status": "No image provided"}), 400

        if image_file.filename == "":
            return jsonify({"status": "No file selected"}), 400

        if image_file.content_length >  MAX_IMAGE_SIZE:
            return jsonify({"status": "File size too large (+5MB)"}), 413

        # Suspicious upload, this implies sender renamed the extension
        if image_file.content_type not in ["image/png", "image/jpg", "image/jpeg"]:
            return jsonify({"status": "Invalid content"}), 400
        
        # Lastly check if header uses valid extension (this can be different from content_type)
        if check_extension(image_file.filename):
            # Uncomment if we dont care about unique images or testing so you can read file names, 
            # also needs to uncomment werkzeug.utils import.
            # filename = secure_filename(image_file.filename)

            # print("before upload", user.pfp_url)

            # Remove old image if the user already has an image by concating the
            # old filename with upload folder's path because the user.pfp_url element
            # is just for frontend and may not fully represent the upload path.
            old_filename = user.pfp_url.split("/")[-1]
            old_url = os.path.join(upload_folder, old_filename)
            # Path may not exist if we already deleted it
            if os.path.exists(old_url):
                os.remove(old_url)

            ext = image_file.filename.rsplit(".", 1)[1].lower()
            # Generate unique names for uploaded images:
            filename = f"{uuid.uuid4().hex}.{ext}"

            filepath = os.path.join(upload_folder, filename)
            image_file.save(filepath)
            # we may want separate directories in the future for different users for scalability
            public_url = f"http://138.197.132.126:8000/uploads/{filename}"
            # use this for local dev testing:
            # public_url = f"http://localhost:8000/uploads/{filename}"
            user.update({"profile_picture_url": public_url}, conn=conn)
            conn.commit()
            
            user = User.find_by_id(user.id)
            # print("after upload", user.pfp_url)
            return jsonify({
                "status": "Upload successful",
                "public_url": public_url
            }), 200
        else:
            return jsonify({"status": "Invalid image, must be of extension .jpg/.png/.jpeg"}), 400
    except Exception as e:
        # Might need to change this later
        if conn: conn.rollback()
        return jsonify({"status": f"Database error: {str(e)}"}), 500
    finally:
        if conn: conn.close()



# @app.route("/uploads/game_banners/<filename>")
def retrieve_image(filename):
    return send_from_directory(current_app.config["UPLOAD_FOLDER"], filename)


def check_extension(filename):
    # Valid image extensions for now are "png", "jpg", and "jpeg" which may change later
    # File name must also contain a period . otherwise they aren't telling us the extension
    IMAGE_EXTENSIONS = {"png", "jpg", "jpeg"}
    return "." in filename and filename.rsplit(".", 1)[1].lower() in IMAGE_EXTENSIONS

