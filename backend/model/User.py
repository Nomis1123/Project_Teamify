import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

def get_db_connection():
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"), 
        database=os.getenv("DB_NAME", "teamify_db"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD")
    )
    # This ensures the code looks in the 'public' schema where your tables likely are
    with conn.cursor() as cur:
        cur.execute("SET search_path TO public;")
    return conn


class User:
    @staticmethod
    def create1(username, email, password_hash, token):
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                
                cur.execute(
                    "INSERT INTO users (username, email, password_hash, verification_token) VALUES (%s, %s, %s, %s) RETURNING id;",
                    (username, email, password_hash, token)
                )
                user_id = cur.fetchone()[0]
                conn.commit() # Save changes
                return user_id 

    @staticmethod
    def verify1(token):
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    UPDATE users 
                    SET is_verified = TRUE, verification_token = NULL 
                    WHERE verification_token = %s RETURNING id;
                """, (token,))
                updated_user = cur.fetchone()
                
                conn.commit()
                return updated_user
    


    @staticmethod
    def find_by_email(email):
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT id, username, email, password_hash,
                        description, profile_picture_url, availability,
                        sub_class, is_verified
                    FROM users WHERE email = %s
                """, (email,))
                
                # This MUST be inside the 'with cur' block
                row = cur.fetchone()
                
                if row:
                    return {
                        "id": row[0],
                        "username": row[1],
                        "email": row[2],
                        "password_hash": row[3],
                        "description": row[4],
                        "profile_picture_url": row[5],
                        "availability": row[6],
                        "sub_class": row[7],
                        "is_verified": row[8]
                    }
                return None

    @staticmethod
    def find_by_id(user_id):
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                # Fetch Basic User Info
                cur.execute("SELECT id, username, email, profile_picture_url, description, sub_class, is_verified, availability FROM users WHERE id = %s", (user_id,))
                user_data = cur.fetchone()

                if not user_data:
                    return None
                
                # Fetch Linked Games for this User
                # Join with the games table to get the Title and Thumbnail
                cur.execute("""
                    SELECT g.title, ug.ingame_name, ug.current_rank, ug.is_main_game, g.thumbnail_url
                    FROM user_games ug
                    JOIN games g ON ug.game_id = g.id
                    WHERE ug.user_id = %s
                """, (user_id,))

                games_data = cur.fetchall()
        
        return {
            "id": user_data[0],
            "username": user_data[1],
            "email": user_data[2],
            "profile_picture": user_data[3],
            "description": user_data[4],
            "sub_class": user_data[5],
            "is_verified": user_data[6],
            "availability": user_data[7],
            "games": [
                {
                    "title": g[0],
                    "ign": g[1],
                    "rank": g[2],
                    "is_main": g[3],
                    "thumbnail": g[4]
                } for g in games_data
            ]
        }

    @staticmethod
    def update_profile_by_id(user_id, username=None, description=None, profile_picture_url=None, availability=None):
        updates = []
        params = []
        if username:
            updates.append("username = %s")
            params.append(username)
        if description:
            updates.append("description = %s")
            params.append(description)
        if profile_picture_url:
            updates.append("profile_picture_url = %s")
            params.append(profile_picture_url)
        if availability:
            updates.append("availability = %s")
            params.append(availability)
        
        if not updates:
            return 
        params.append(user_id)
        sql = f"UPDATE users SET {', '.join(updates)} WHERE id = %s"

        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(sql, tuple(params))
                conn.commit()


