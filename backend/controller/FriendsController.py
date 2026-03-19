from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from extensions import get_db_connection

# This whole file might be deleted and may be moved to another file
# as its just a placeholder for this function


def search_users():
    # Still needs testing and 6.2a Backend Friends List API (Fetch & Remove)
    # Will need some rework after the above is complete and merged
    user_id = get_jwt_identity()

    search = request.args.get("search", "").strip()
    limit = request.args.get("limit", 10, type=int)   # how many to load, for now try out 10
    offset = request.args.get("offset", 0, type=int)  # how far we've scrolled

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        if search:
            # ILIKE is case-insensitive
            query = """
                SELECT id, username
                FROM users
                WHERE username ILIKE %s
                ORDER BY id
                LIMIT %s OFFSET %s
            """
            params = (f"%{search}%", limit, offset)
        else:
            query = """
                SELECT id, username
                FROM users
                ORDER BY id
                LIMIT %s OFFSET %s
            """
            params = (limit, offset)

        cursor.execute(query, params)
        rows = cursor.fetchall()
        users = [
            {"id": row[0], "username": row[1]}
            for row in rows
        ]

        return jsonify(users), 200

    except Exception as e:
        if conn: conn.rollback()
        return jsonify({"status": f"Database error: {str(e)}"}), 500

    finally:
        cursor.close()
        if conn: conn.close()


