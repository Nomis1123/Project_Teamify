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
    with conn.cursor() as cur:
        cur.execute("SET search_path TO public;")
    return conn

class UserGame:
    @staticmethod
    def get_filtered_users(current_user_id, filters=None, offset=0):
        filters = filters or {}
        game_title = filters.get('game')
        rank = filters.get('rank')
        role_filter = filters.get('role')

        params = []

        with get_db_connection() as conn:
            with conn.cursor() as cur:
                sql = """
                    SELECT 
                        u.id, 
                        u.username, 
                        u.profile_picture_url, 
                        u.description, 
                        u.roles,
                        COALESCE(
                            jsonb_agg(
                                jsonb_build_object('title', g.title, 'rank', ug.current_rank)
                            ) FILTER (WHERE g.id IS NOT NULL),
                            '[]'
                        ) AS user_games_list
                    FROM users u
                    LEFT JOIN user_games ug ON u.id = ug.user_id
                    LEFT JOIN games g ON ug.game_id = g.id
                    WHERE u.id != %s AND u.is_verified = TRUE
                """
                params.append(current_user_id)

                if role_filter:
                    sql += " AND u.roles ILIKE %s"
                    params.append(f"%{role_filter}%")

                if game_title and rank:
                    sql += """
                        AND EXISTS (
                            SELECT 1 FROM user_games ug2 JOIN games g2 ON ug2.game_id = g2.id
                            WHERE ug2.user_id = u.id AND g2.title ILIKE %s AND ug2.current_rank ILIKE %s
                        )
                    """
                    params.extend([f"%{game_title}%", f"%{rank}%"])
                elif game_title:
                    sql += """
                        AND EXISTS (
                            SELECT 1 FROM user_games ug2 JOIN games g2 ON ug2.game_id = g2.id
                            WHERE ug2.user_id = u.id AND g2.title ILIKE %s
                        )
                    """
                    params.append(f"%{game_title}%")
                elif rank:
                    sql += """
                        AND EXISTS (
                            SELECT 1 FROM user_games ug2 WHERE ug2.user_id = u.id AND ug2.current_rank ILIKE %s
                        )
                    """
                    params.append(f"%{rank}%")

                sql += " GROUP BY u.id, u.username, u.profile_picture_url, u.description, u.roles"
                sql += " ORDER BY u.id ASC"
                sql += " LIMIT 10 OFFSET %s"
                params.append(int(offset))

                cur.execute(sql, tuple(params))
                rows = cur.fetchall()

                results = []
                for r in rows:
                    user_id, username, avatar, description, user_roles, games_list = r

                    display_game, display_rank = "N/A", "N/A"
                    if games_list:
                        search_term = game_title.lower() if game_title else ""
                        matched_obj = next(
                            (g for g in games_list if search_term in g['title'].lower()), 
                            games_list[0]
                        )
                        display_game = matched_obj['title']
                        display_rank = matched_obj['rank']

                    results.append({
                        "id": user_id,
                        "username": username,
                        "avatar": avatar or f"https://api.dicebear.com/7.x/avataaars/svg?seed={username}",
                        "description": description,
                        "game": display_game,
                        "rank": display_rank,
                        "roles": user_roles 
                    })

                return results