from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from friends import Friend # Import the new model we discussed

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
    current_user_id = get_jwt_identity() 
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
def send_friend_request():
    """
    POST /api/friends/request
    Body: {"target_id": 25}
    """
    current_user_id = get_jwt_identity()
    data = request.json
    target_id = data.get("target_id")

    if not target_id or int(current_user_id) == int(target_id):
        return jsonify({"status": "error", "message": "Invalid target user"}), 400

    success = Friend.send_request(int(current_user_id), int(target_id))

    if success:
        return jsonify({"status": "success", "message": "Request sent"}), 201
    return jsonify({"status": "error", "message": "Failed to send request"}), 500

@jwt_required()
def reject_friend_request(sender_id):
    """
    DELETE /api/friends/requests/<sender_id>
    Handles declining a pending invite.
    """
    current_user_id = get_jwt_identity()
    
    success = Friend.delete_relationship(int(current_user_id), int(sender_id))

    if success:
        return jsonify({"status": "success", "message": "Request declined"}), 200
    return jsonify({"status": "error", "message": "Database deletion failed"}), 500

@jwt_required()
def remove_friend(friend_id):
    """
    DELETE /api/friends/<friend_id>
    Handles unfriending an existing connection.
    """
    current_user_id = get_jwt_identity()
    
    success = Friend.delete_relationship(int(current_user_id), int(friend_id))

    if success:
        return jsonify({"status": "success", "message": "Friend removed"}), 200
    return jsonify({"status": "error", "message": "Database deletion failed"}), 500