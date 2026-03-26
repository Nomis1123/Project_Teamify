from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from controller.extensions import get_db_connection
from model.user import User
from model.game import Game


@jwt_required()
def update_game():
    conn = get_db_connection()

    try:
        # Verify user is admin
        user_id = get_jwt_identity()
        user = User.find_by_id(int(user_id))

        if not user:
            return jsonify({"status": "User not found"}), 404

        if not user.is_admin:
            return jsonify({"status": "Unauthorized"}), 403

        # Parse the data
        data = request.get_json()

        if not data:
            return jsonify({"status": "No data provided"}), 400

        game_id = data.get("gameId")
        if not game_id:
            return jsonify({"status": "gameId is required"}), 400

        # Map the fields to be changed
        update_fields = {}

        if "genre" in data:
            if not isinstance(data["genre"], str):
                return jsonify({"status": "genre must be a string"}), 400
            update_fields["genre"] = data["genre"]

        if "developer" in data:
            if not isinstance(data["developer"], str):
                return jsonify({"status": "developer must be a string"}), 400
            update_fields["developer"] = data["developer"]

        if not update_fields:
            return jsonify({"status": "No valid fields provided"}), 400

        # Update game
        updated_game = Game.update(conn, game_id, **update_fields)
        conn.commit()

        return jsonify({
            "status": "Game updated",
            "game": updated_game.to_dict()
        }), 200

    except ValueError as e:
        conn.rollback()
        return jsonify({"status": str(e)}), 400

    except Exception as e:
        conn.rollback()
        return jsonify({"status": f"Database error: {str(e)}"}), 500

    finally:
        conn.close()
