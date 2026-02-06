import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

def get_db_connection():
    return psycopg2.connect(host=os.getenv("DB_HOST", "localhost"), 
                            database=os.getenv("DB_NAME", "teamify_db"),
                            user=os.getenv("DB_USER", "postgres"),
                            password=os.getenv("DB_PASSWORD")
                            )


class User:
    @staticmethod
    def create1(username, email, password_hash, token):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO users (username,email, password_hash, verification_token) VALUES (%s, %s, %s, %s) RETURNING id;",
            (username, email, password_hash, token)
        )

        user_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return user_id 
    


    @staticmethod
    def find_by_email(email):
        conn = get_db_connection()
        cur = conn.cursor()
        try:
            cur.execute("SELECT id, username, email, password_hash, my_games_list, profile_picture_url, description, sub_class, is_verified, verification_token, availability FROM users WHERE email = %s;", (email,))
            return cur.fetchone()
        finally:
            cur.close()
            conn.close()
    

    @staticmethod
    def verify1(token):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("UPDATE users SET is_verified = TRUE, verification_token=NULL WHERE verification_token = %s RETURNING id;", (token,))
        updated_user = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        return updated_user
    

    @staticmethod
    def update_profile(email, username=None, description=None):
        conn = get_db_connection()
        cur = conn.cursor()
        
        updates = []
        params = []

        if username:
            updates.append("username = %s")
            params.append(username)
        if description:
            updates.append("description = %s")
            params.append(description)
        if not updates:
            return 
        params.append(email)
        
        sql = f"UPDATE users SET {', '.join(updates)} WHERE email = %s"
        
        cur.execute(sql, tuple(params))
        conn.commit()
        
        cur.close()
        conn.close()


