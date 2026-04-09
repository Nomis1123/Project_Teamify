from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from model.UserGame import UserGame

from model.user import User

@jwt_required()
def get_matches():
    # 1. Get the ID of the user making the request
    current_user_id = get_jwt_identity()
    
    # 2. Extract the JSON body sent by React
    data = request.get_json() or {}
    
    # 3. Pull out the specific pieces
    filters = data.get("filters", {})
    offset = data.get("offset", 0)
    
    try:
        # 4. Feed them into your updated function
        results = UserGame.get_filtered_users(
            current_user_id=int(current_user_id), 
            filters=filters, 
            offset=int(offset)
        )
        
        return jsonify(results), 200
        
    except Exception as e:
        print(f"Error fetching matches: {e}")
        return jsonify({"status": "Failed to fetch matches"}), 500

@jwt_required()
def get_matches2():
    # 1. Get the ID of the user making the request
    current_user_id = get_jwt_identity()
    
    # 2. Extract the JSON body sent by React
    data = request.get_json() or {}
    
    # 3. Pull out the specific pieces
    filters = data.get("filters", {})
    offset = data.get("offset", 0)
    
    try:
        # 4. Feed them into your updated function
        results = UserGame.get_filtered_users2(
            current_user_id=int(current_user_id), 
            filters=filters, 
            offset=int(offset)
        )
        
        return jsonify(results), 200
        
    except Exception as e:
        print(f"Error fetching matches: {e}")
        return jsonify({"status": "Failed to fetch matches"}), 500

@jwt_required()
def sort_matches():

    current_user_id = get_jwt_identity()

    # validate identity is an int
    try:
        current_user_id = int(current_user_id)
    except ValueError:
        return jsonify({"status": "Error: jwt identity can not be converted to int"}), 400
    
    current_user = User.find_by_id(current_user_id)

    data = request.json

    # validate payload exists
    if 'sort' not in data or 'users' not in data:
        return jsonify({"status": "Error: invalid or missing JSON"}), 400

    # validate that the payload is actually a list
    if not isinstance(data['users'], list):
        return jsonify({"status": "Error: expected a list of dictionaries"}), 400

    # add a score field in the dictionaries given if sort method is availability

    for user in data['users']:
        if not isinstance(user, dict):
            continue

        target_user_id = user.get('id')
        target_user = User.find_by_id(target_user_id)

        score = _calculate_availability_matchmaking_score(current_user, target_user)
        user['matchmaking_score'] = score

    # sort the list of dictionaries
    # sort by the numerical 'matchmaking_score' field

    sorted_data = []

    if data['sort'] == 'name':
        print ('sorting by name')
        sorted_data = sorted(data['users'], key=lambda x: x['username'].lower())
    elif data['sort'] == 'availability':
        sorted_data = sorted(data['users'], key=lambda x: x['matchmaking_score'], reverse=True)
    else:
        return jsonify({"status": "Error: unexpected sort method in request"})

    return jsonify(sorted_data), 200

def _calculate_availability_matchmaking_score(u1: User, u2: User) -> int:
    """
    Calculates the number of overlapping availability slots between two users.
    """
    # Logical AND the bits to find overlapping free time
    overlap_bits = u1.availability & u2.availability

    # Sum the '1's in the binary output
    return overlap_bits.bit_count()
