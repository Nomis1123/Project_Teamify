from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from friends import Friend # Import the new model we discussed
from model.user import User

@jwt_required()
def get_user_friends():
    """
    GET /api/friends
    Returns the user's friend list and pending requests.
    """
    current_user_id = get_jwt_identity()
    try:
        data = Friend.get_all_for_user(int(current_user_id))
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"status": f"Error fetching friends: {str(e)}"}), 500

@jwt_required()
def accept_friend():
    """
    POST /api/friends/accept
    Body: {"friend_id": 10}
    """
    current_user_id = get_jwt_identity() # Taken from the Secure Token
    data = request.json
    friend_id = data.get("friend_id")

    if not friend_id:
        return jsonify({"status": "error", "message": "Missing friend_id"}), 400

    # Call the model
    success = Friend.accept_request(int(current_user_id), int(friend_id))

    if success:
        return jsonify({"status": "success", "message": "Friendship established"}), 200
    else:
        return jsonify({"status": "error", "message": "Database update failed"}), 500


@jwt_required()
def search_user():
    """
    GET /api/friends/search?search=<search>
    Returns a list of users that matches the substring <search>
    """
    user_id = get_jwt_identity()

    search = request.args.get("search", "", type=str)
    if not search:
        return jsonify([]), 200
    
    limit = request.args.get("limit", 10, type=int)   # how many to load, for now try out 10
    offset = request.args.get("offset", 0, type=int)  # how far we've scrolled

    try:
        users = User.search_username(user_id, search, limit, offset)
        # User to_public_dict(), we dont need emails or steam_id
        return jsonify([u.to_public_dict() for u in users]), 200

    except Exception as e:
        return jsonify({"status": f"Database error: {str(e)}"}), 500
