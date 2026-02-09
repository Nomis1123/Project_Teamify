import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

def get_db_connection():
    print(f"--- DEBUG DB ATTEMPT ---")
    print(f"DB_NAME from Env: {os.getenv('DB_NAME')}")
    return psycopg2.connect(host=os.getenv("DB_HOST", "localhost"), 
                            database=os.getenv("DB_NAME", "teamify_db"),
                            user=os.getenv("DB_USER", "postgres"),
                            password=os.getenv("DB_PASSWORD")
                            )


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
        conn = get_db_connection()
        cur = conn.cursor()
        try:
            cur.execute("SELECT id, username, email, password_hash, my_games_list, profile_picture_url, description, sub_class, is_verified, verification_token, availability FROM users WHERE email = %s;", (email,))
            return cur.fetchone()
        finally:
            cur.close()
            conn.close()
    

    

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


    @staticmethod
    def find_by_id(user_id):
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT id, username, email, password_hash, my_games_list, 
                           profile_picture_url, description, sub_class, 
                           is_verified, verification_token, availability 
                    FROM users WHERE id = %s;
                """, (user_id,))
                return cur.fetchone()

    @staticmethod
    def update_profile_by_id(user_id, username=None, description=None):
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
        params.append(user_id)
        sql = f"UPDATE users SET {', '.join(updates)} WHERE id = %s"

        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(sql, tuple(params))
                conn.commit()


