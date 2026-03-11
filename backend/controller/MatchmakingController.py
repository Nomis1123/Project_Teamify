from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from model.UserGame import UserGame


@jwt_required()
def get_matches():
    current_user_id = get_jwt_identity()

    data = request.get_json() or {}
    print(data)
    filters = data.get('filters', {}) if data else {}
    try:
        users = UserGame.get_filtered_users(
            current_user_id,
            filters,
            
        )
        return jsonify(users), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500