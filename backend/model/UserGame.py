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
                        calculate_harmony_score(u.availability, %s) AS harmony_score
                    """
                    params.append(curr_avail)
                else:
                    sql += ", 0 AS harmony_score"

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
                    # Repeat function and parameter here
                    sql += " ORDER BY calculate_harmony_score(u.availability, %s)::float / 21 DESC NULLS LAST"
                    params.append(curr_avail)
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
                cur.execute("SELECT availability FROM users WHERE id = %s", (current_user_id,))
                res = cur.fetchone()
                print("curr_avail:", res[0])

        
        results = []
        print(f"The length is {len(rows)}")
        for r in rows:
            print(f"r: {r}")
            user_id = r[0]
            username = r[1]
            avatar = r[2]
            description = r[3]
            harmony_score = float(r[4] or 0)

            print(f"The matched score is {harmony_score}")
            games_list = r[5] if len(r) > 5 else []

            # total slots for percentage
            total_slots = 7 * 3  # 7 days * 3 slots
            match_percentage = (
                f"{round((harmony_score / total_slots) * 100)}%"
                if apply_availability_filter else "0%"
            )

            display_game = "N/A"
            display_rank = "N/A"

            if games_list:
                matched_obj = games_list[0]
                display_game = matched_obj['title']
                display_rank = matched_obj['rank']

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