from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import get_db_connection


@jwt_required()
def init_conversation():
    data = request.get_json()

    current_user_id = get_jwt_identity()
    target_user_id = data.get('target_user_id')

    if not current_user_id or not target_user_id:
        return jsonify({"error": "Missing user IDs"}), 400

    # 1. Enforce your SQL Schema Rule (Smaller ID goes first)
    user1_id = min(current_user_id, target_user_id)
    user2_id = max(current_user_id, target_user_id)

    # Replace with your actual database connection logic
    conn = get_db_connection() 
    cursor = conn.cursor()

    try:
        # 2. Check if the room already exists
        check_query = """
            SELECT id FROM conversations 
            WHERE user1_id = %s AND user2_id = %s;
        """
        cursor.execute(check_query, (user1_id, user2_id))
        existing_room = cursor.fetchone()

        if existing_room:
            # Room exists, return the ID
            return jsonify({"conversation_id": existing_room[0], "is_new": False}), 200

        # 3. If it doesn't exist, create it and return the new ID
        insert_query = """
            INSERT INTO conversations (user1_id, user2_id) 
            VALUES (%s, %s) RETURNING id;
        """
        cursor.execute(insert_query, (user1_id, user2_id))
        new_room_id = cursor.fetchone()[0]
        conn.commit()

        return jsonify({"conversation_id": new_room_id, "is_new": True}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
