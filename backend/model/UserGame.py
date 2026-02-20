import psycopg2
from dotenv import load_dotenv
import os
import json 

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

class UserGame:
    @staticmethod
    def get_filtered_users(current_user_id, filters=None, offset=0):
        filters = filters or {}
        game_title = filters.get('game')
        rank = filters.get('rank')
        region = filters.get('region')
        apply_availability_filter = filters.get('availability') is not None

        
        # The code measured the availability scores
        params = []
        sql = """
            SELECT u.id, u.username, u.profile_picture_url, u.description
        """
        if apply_availability_filter:
            with get_db_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT availability FROM users WHERE id = %s", (current_user_id,))
                    res = cur.fetchone()
                    curr_avail = json.dumps(res[0]) if res and res[0] else json.dumps({})
                    

            sql += """, (SELECT count(*) 
                        FROM (SELECT jsonb_object_keys(%s::jsonb) as day) d
                        CROSS JOIN (VALUES ('Morning'), ('Noon'), ('Evening')) AS s(slot)
                        WHERE (u.availability -> d.day ->> s.slot)::boolean = TRUE
                        AND (%s::jsonb -> d.day ->> s.slot)::boolean = TRUE
                    ) as harmony_score """
            params.extend([curr_avail, curr_avail])
        
        else:
            sql += ", 0 as harmony_score " # Default score of 0 if not filtering

        sql += """
            , ug.current_rank, g.title 
            FROM users u
            LEFT JOIN user_games ug ON u.id = ug.user_id 
            LEFT JOIN games g ON ug.game_id = g.id 
            WHERE u.id != %s AND u.is_verified = TRUE
        """
        params.append(current_user_id)

        if game_title:
            sql += " AND g.title ILIKE %s " # ILIKE for case-insensitivity
            params.append(f"%{game_title}%")
        
        if rank:
            sql += " AND ug.current_rank ILIKE %s " 
            params.append(f"%{rank}%")
        
        if apply_availability_filter:
            sql += " ORDER BY harmony_score DESC "
        else:
            sql += " ORDER BY u.id ASC "

        sql += " LIMIT 10;"
        

        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(sql, tuple(params))
                rows = cur.fetchall()
                return [
                {
                    "id": r[0],
                    "username": r[1],
                    "rank": r[5] or "Unranked",
                    "region": "NA", # Static for now
                    "avatar": r[2] or f"https://api.dicebear.com/7.x/avataaars/svg?seed={r[1]}",
                    "description": r[3],
                    "game": r[6] or "No Game Selected",
                    "match_percentage": f"{round((r[4] / 21) * 100)}%" if r[4] > 0 else "0%"
                } for r in rows
            ]