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
        apply_availability_filter = filters.get('availability') is True

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

                # Availability
                if apply_availability_filter:
                    cur.execute("SELECT availability FROM users WHERE id = %s", (current_user_id,))
                    res = cur.fetchone()
                    curr_avail = json.dumps(res[0]) if res and res[0] else json.dumps({})

                    sql += """,
                        (
                            SELECT COUNT(*)
                            FROM (
                                SELECT day, slot
                                FROM (
                                    SELECT jsonb_object_keys(COALESCE(u.availability, '{}'::jsonb)) AS day
                                ) AS days
                                CROSS JOIN (VALUES ('Morning'), ('Noon'), ('Evening')) AS slots(slot)
                            ) AS all_slots
                            WHERE COALESCE((u.availability -> all_slots.day ->> all_slots.slot)::boolean, FALSE) = TRUE
                            AND COALESCE((%s::jsonb -> all_slots.day ->> all_slots.slot)::boolean, FALSE) = TRUE
                        ) AS harmony_score,
                        (
                            SELECT COUNT(*)
                            FROM (
                                SELECT day, slot
                                FROM (
                                    SELECT jsonb_object_keys(COALESCE(u.availability, '{}'::jsonb)) AS day
                                ) AS days
                                CROSS JOIN (VALUES ('Morning'), ('Noon'), ('Evening')) AS slots(slot)
                            ) AS all_slots
                            WHERE COALESCE((%s::jsonb -> all_slots.day ->> all_slots.slot)::boolean, FALSE) = TRUE
                        ) AS max_score
                    """
                    params.extend([curr_avail, curr_avail])
                else:
                    sql += ", 0 AS harmony_score, 0 AS max_score"

                # game
                sql += """,
                    COALESCE(
                        jsonb_agg(
                            jsonb_build_object(
                                'title', g.title,
                                'rank', ug.current_rank
                            )
                        ) FILTER (WHERE g.id IS NOT NULL),
                        '[]'
                    ) AS user_games_list
                """

                # Base query
                sql += """
                    FROM users u
                    LEFT JOIN user_games ug ON u.id = ug.user_id
                    LEFT JOIN games g ON ug.game_id = g.id
                    WHERE u.id != %s
                      AND u.is_verified = TRUE
                """
                params.append(current_user_id)

                # game filter
                # Unified Game + Rank Filter
                if game_title and rank:
                    sql += """
                        AND EXISTS (
                            SELECT 1
                            FROM user_games ug2
                            JOIN games g2 ON ug2.game_id = g2.id
                            WHERE ug2.user_id = u.id
                            AND g2.title ILIKE %s
                            AND ug2.current_rank ILIKE %s
                        )
                    """
                    params.append(f"%{game_title}%")
                    params.append(f"%{rank}%")

                elif game_title:
                    sql += """
                        AND EXISTS (
                            SELECT 1
                            FROM user_games ug2
                            JOIN games g2 ON ug2.game_id = g2.id
                            WHERE ug2.user_id = u.id
                            AND g2.title ILIKE %s
                        )
                    """
                    params.append(f"%{game_title}%")

                elif rank:
                    sql += """
                        AND EXISTS (
                            SELECT 1
                            FROM user_games ug2
                            WHERE ug2.user_id = u.id
                            AND ug2.current_rank ILIKE %s
                        )
                    """
                    params.append(f"%{rank}%")

                sql += """
                    GROUP BY u.id, u.username, u.profile_picture_url, u.description
                """

                # Ordering
                if apply_availability_filter:
                    sql += " ORDER BY harmony_score::float / NULLIF(max_score,0) DESC NULLS LAST"
                else:
                    sql += " ORDER BY u.id ASC"

                # Offset
                try:
                    clean_offset = int(offset)
                except (ValueError, TypeError):
                    clean_offset = 0

                sql += " LIMIT 10 OFFSET %s"
                params.append(clean_offset)

                cur.execute(sql, tuple(params))
                rows = cur.fetchall()

        
        results = []

        for r in rows:
            user_id = r[0]
            username = r[1]
            avatar = r[2]
            description = r[3]
            harmony_score = r[4]
            max_score = r[5]
            games_list = r[6] or []

            display_game = "N/A"
            display_rank = "N/A"

            if games_list:
                matched_obj = games_list[0]
                display_game = matched_obj['title']
                display_rank = matched_obj['rank']

            match_percentage = (
                f"{round((harmony_score / max_score) * 100)}%"
                if apply_availability_filter and max_score > 0
                else "0%"
            )

            results.append({
                "id": user_id,
                "username": username,
                "avatar": avatar or f"https://api.dicebear.com/7.x/avataaars/svg?seed={username}",
                "description": description,
                "match_percentage": match_percentage,
                "game": display_game,
                "rank": display_rank,
                "region": "NA"
            })

        return results