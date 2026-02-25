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
        apply_availability_filter = filters.get('availability') is not None

        params = []
        sql = """
            SELECT 
                u.id, 
                u.username, 
                u.profile_picture_url, 
                u.description
        """

        with get_db_connection() as conn:
            with conn.cursor() as cur:
                if apply_availability_filter:
                    # Fetch current user availability
                    cur.execute("SELECT availability FROM users WHERE id = %s", (current_user_id,))
                    res = cur.fetchone()
                    curr_avail = json.dumps(res[0]) if res and res[0] else json.dumps({})
                    
                    sql += """, (SELECT count(*) 
                                    FROM (SELECT jsonb_object_keys(COALESCE(u.availability, '{}'::jsonb)) as day) d
                                    CROSS JOIN (VALUES ('Morning'), ('Noon'), ('Evening')) AS s(slot)
                                    WHERE COALESCE((u.availability -> d.day ->> s.slot)::boolean, FALSE) = TRUE
                                    AND COALESCE((%s::jsonb -> d.day ->> s.slot)::boolean, FALSE) = TRUE
                                ) as harmony_score """
                    params.append(curr_avail) 
                else:
                    sql += ", 0 as harmony_score "

                sql += """
                        , COALESCE(
                            jsonb_agg(
                                jsonb_build_object('title', g.title, 'rank', ug.current_rank)
                            ) FILTER (WHERE g.id IS NOT NULL), '[]'
                        ) as user_games_list
                        FROM users u
                        LEFT JOIN user_games ug ON u.id = ug.user_id 
                        LEFT JOIN games g ON ug.game_id = g.id 
                        WHERE u.id != %s AND u.is_verified = TRUE
                """
                params.append(current_user_id)

                if game_title:
                    sql += " AND g.title ILIKE %s "
                    params.append(f"%{game_title}%")
                
                if rank:
                    sql += " AND ug.current_rank ILIKE %s " 
                    params.append(f"%{rank}%")
                
                sql += " GROUP BY u.id, u.username, u.profile_picture_url, u.description "

                if apply_availability_filter:
                    sql += " ORDER BY harmony_score DESC "
                else:
                    sql += " ORDER BY u.id ASC "

                try:
                    clean_offset = int(offset)
                except (ValueError, TypeError):
                    clean_offset = 0

                sql += " LIMIT 10 OFFSET %s;"
                params.append(clean_offset)

                cur.execute(sql, tuple(params))
                rows = cur.fetchall()

                results = []
                for r in rows:
                    harmony_score = r[4] 
                    games_list = r[5] or []
                    
                    display_game = "N/A"
                    display_rank = "N/A" # Default rank
                    
                    if games_list:
                        # Find the game object (contains both title and rank)
                        search_term = game_title.lower() if game_title else ""
                        matched_obj = next(
                            (g for g in games_list if search_term in g['title'].lower()), 
                            games_list[0]
                        )
                        display_game = matched_obj['title']
                        display_rank = matched_obj['rank'] # Extract rank

                    results.append({
                        "id": r[0],
                        "username": r[1],
                        "avatar": r[2] or f"https://api.dicebear.com/7.x/avataaars/svg?seed={r[1]}",
                        "description": r[3],
                        "match_percentage": f"{round((harmony_score / 21) * 100)}%" if apply_availability_filter else "0%",
                        "game": display_game, 
                        "rank": display_rank, # Added rank here
                        "region": "NA"
                    })
                return results