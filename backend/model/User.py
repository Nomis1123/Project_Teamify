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
        cur.execute("SELECT id, username, password_hash, is_verified FROM users WHERE email = %s;", (email,))
        user1 = cur.fetchone()
        cur.close()
        conn.close()
        return user1 
    

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


