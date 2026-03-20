from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from controller.extensions import get_db_connection

'''
Create or find a conversations between two users.
Input:
    JWT
    target_user_id 

Returns:
    conversation_id belonging to conversation between two users.
'''
@jwt_required()
def init_conversation():
    data = request.get_json()

    current_user_id = get_jwt_identity()
    target_user_id = data.get('target_user_id')

    if not current_user_id or not target_user_id:
        return jsonify({"status": "Missing user IDs"}), 400

    try:
        current_user_id = int(current_user_id)
        target_user_id = int(target_user_id)

    except ValueError:
        return jsonify({"status": "User IDs must be two numbers"}), 400


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

        return jsonify({"conversation_id": new_room_id, "is_new": True}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"status": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

'''
Get the last 50 messages of a conversation.

Input:
    conversation_id int

Returns:
    list of 50 messages of the form:
    {
        id,             id of the message
        sender_id,      id of the user that sent this message
        content,        content of the message
        created_at      timestamp isoformat when message was created
    }
'''
def get_messages(conversation_id):

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # 1. Fetch the 50 most recent messages
        query = """
            SELECT id, sender_id, content, created_at 
            FROM messages 
            WHERE conversation_id = %s 
            ORDER BY created_at DESC 
            LIMIT 50;
        """
        cursor.execute(query, (conversation_id,))
        raw_messages = cursor.fetchall()

        # 2. Reverse the list so the UI renders chronologically top-to-bottom
        raw_messages.reverse()

        # 3. Format into a clean JSON array
        formatted_messages = []
        for msg in raw_messages:
            formatted_messages.append({
                "id": msg[0],
                "sender_id": msg[1],
                "content": msg[2],
                "created_at": msg[3].isoformat() # Convert timestamp to string
            })

        return jsonify(formatted_messages), 200

    except Exception as e:
        return jsonify({"status": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
