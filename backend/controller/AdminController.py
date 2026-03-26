import os
import uuid

from flask import jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

from controller.AuthenticationControllerOOP import check_extension
from controller.extensions import get_db_connection
from model.user import User
from model.game import Game

MAX_IMAGE_SIZE = 5 * 1024 * 1024

@jwt_required()
def update_game():
    conn = get_db_connection()

    try:
        # Verify admin
        user_id = get_jwt_identity()
        user = User.find_by_id(int(user_id))

        if not user:
            return jsonify({"status": "User not found"}), 404

        if not user.is_admin:
            return jsonify({"status": "Unauthorized"}), 403

        # Check if text fields or photo upload
        is_multipart = request.content_type and request.content_type.startswith('multipart/form-data')

        if is_multipart:
            data = request.form
            image = request.files.get("image")
        else:
            data = request.get_json()
            image = None

        if not data:
            return jsonify({"status": "No data provided"}), 400

        # Extract gameID
        try:
            game_id = int(data.get("gameId"))
        except (TypeError, ValueError):
            return jsonify({"status": "gameId must be an integer"}), 400

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

        if image:
            try:
                # # Delete old image (optional but good)
                # game = Game.find_by_id(conn, game_id)
                # if game and game.thumbnail_url:
                #     upload_folder = os.path.join(current_app.config["UPLOAD_FOLDER"], "games")
                #     old_filename = game.thumbnail_url.split("/")[-1]
                #     old_path = os.path.join(upload_folder, old_filename)
                #     if os.path.exists(old_path):
                #         os.remove(old_path)

                image_url = save_image(image)
                update_fields["thumbnail_url"] = image_url

            except ValueError as e:
                return jsonify({"status": str(e)}), 400

        if not update_fields:
            return jsonify({"status": "No valid fields provided"}), 400

        # Update DB
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
        return jsonify({"status": str(e)}), 500

    finally:
        conn.close()


# Helper for saving image
def save_image(image_file):
    # Save all game images under uploads/games
    upload_folder = os.path.join(current_app.config["UPLOAD_FOLDER"], "games")
    os.makedirs(upload_folder, exist_ok=True)

    if not image_file:
        raise ValueError("No image provided")

    if image_file.filename == "":
        raise ValueError("No file selected")

    if image_file.content_length and image_file.content_length > MAX_IMAGE_SIZE:
        raise ValueError("File size too large (+5MB)")

    if image_file.content_type not in ["image/png", "image/jpg", "image/jpeg"]:
        raise ValueError("Invalid content type")

    if not check_extension(image_file.filename):
        raise ValueError("Invalid file extension")

    ext = image_file.filename.rsplit(".", 1)[1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"

    filepath = os.path.join(upload_folder, filename)
    image_file.save(filepath)

    public_url = f"http://138.197.132.126:8000/uploads/games/{filename}"

    return public_url
