import os

from controller.extensions import get_db_connection
from flask import jsonify, send_from_directory, current_app
from model.game import Game


# Return list of all games
def get_games():
    conn = get_db_connection()

    try:
        games = Game.get_all(conn)

        return jsonify({
            "games": [{"id": g.id,
                       "title": g.title,}
                       # "thumbnail_url": g.thumbnail_url, # from profile page
                       # "banner_url": g.banner_url, # from matchmaking page
                       # "icon_url": g.icon_url} # temp doesnt exist yet
                       for g in games]
        }), 200

    except Exception as e:
        return jsonify({"status": f"Error: {str(e)}"}), 500

    finally:
        conn.close()

# Used to view photo from browser
def retrieve_game_image(filename):
    return send_from_directory(os.path.join(current_app.config["UPLOAD_FOLDER"], "games"), filename)
