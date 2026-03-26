from controller.extensions import get_db_connection

class Friend:
    @staticmethod
    def get_all_for_user(user_id):
        """
        Returns a detailed list of friends and pending requests without roles.
        """
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                # 1. Get Accepted Friends with detailed info (excluding roles)
                cur.execute("""
                    SELECT u.id, u.username, u.email, u.steam_id, u.description, u.profile_picture_url
                    FROM users u
                    JOIN friends f ON (f.user_id_1 = u.id OR f.user_id_2 = u.id)
                    WHERE (f.user_id_1 = %s OR f.user_id_2 = %s)
                    AND f.status = 'accepted'
                    AND u.id != %s
                """, (user_id, user_id, user_id))
                
                columns = ['id', 'username', 'email', 'steam_id', 'description', 'avatar']
                friends = [dict(zip(columns, row)) for row in cur.fetchall()]

                # 2. Get Pending Requests (Users who sent a request TO the current user)
                cur.execute("""
                SELECT u.id, u.username, u.email, u.steam_id, u.description, u.profile_picture_url
                FROM users u
                JOIN friends f ON (f.user_id_1 = u.id OR f.user_id_2 = u.id)
                WHERE (f.user_id_1 = %s OR f.user_id_2 = %s) 
                AND f.status = 'pending'
                AND f.action_user_id != %s  -- <--- THIS IS THE KEY FIX
                AND u.id != %s
            """, (user_id, user_id, user_id, user_id))
                
                requests = [dict(zip(columns, row)) for row in cur.fetchall()]

                return {
                    "friends": friends,
                    "pending_requests": requests
                }
        finally:
            conn.close()

    @staticmethod
    def accept_request(current_user_id, sender_id):
        """
        Ensures a friendship row exists and is set to 'accepted'.
        """
        conn = get_db_connection()
        # Canonical order: u1 is always the smaller ID
        u1, u2 = (current_user_id, sender_id) if current_user_id < sender_id else (sender_id, current_user_id)
        
        try:
            with conn.cursor() as cur:
                # We use UPSERT (INSERT ... ON CONFLICT) logic.
                # If the request already exists (as pending), it becomes 'accepted'.
                # If it doesn't exist at all, it creates it as 'accepted'.
                cur.execute("""
                    INSERT INTO friends (user_id_1, user_id_2, status, action_user_id)
                    VALUES (%s, %s, 'accepted', NULL)
                    ON CONFLICT (user_id_1, user_id_2) 
                    DO UPDATE SET status = 'accepted', action_user_id = NULL;
                """, (u1, u2))
            conn.commit()
            return True
        except Exception as e:
            conn.rollback()
            return False # Return False so the controller knows it failed
        finally:
            conn.close()

    @staticmethod
    def search_username(user_id, search="", limit=10, offset=0):
        # limit = how many users to display
        # offset = how far we've scrolled down the list for pagination
        conn = get_db_connection()
        search = search.strip()
        if not search:
            return []
        
        try:
            with conn.cursor() as cur:
                base_query = """
                    SELECT u.id, u.username, u.email, u.steam_id, u.description, u.profile_picture_url
                    FROM users u
                    JOIN friends f
                        ON (
                            (f.user_id_1 = %s AND f.user_id_2 = u.id) OR
                            (f.user_id_2 = %s AND f.user_id_1 = u.id)
                        )
                        AND f.status = 'accepted'
                    WHERE u.id != %s
                        AND u.username ILIKE %s
                    ORDER BY u.username
                    LIMIT %s OFFSET %s
                """
                # Default ordering sorts by username
                # " ORDER BY username"
                # Pagination
                # " LIMIT %s OFFSET %s"
                params = [user_id, user_id, user_id, f"%{search}%", limit, offset]
                cur.execute(base_query, params)
                columns = ['id', 'username', 'email', 'steam_id', 'description', 'avatar', 'friend']
                rows = cur.fetchall()
                users = [dict(zip(columns, row)) for row in rows]
                return users

        except Exception as e:
            if conn:
                conn.rollback()
            raise e 

        finally:
            if conn:
                conn.close()

    def get_relationship_status(user_id, target_id):
        """
        [Helper] Checks the current database status of a relationship.
        Returns: 'accepted', 'pending', or None
        """
        conn = get_db_connection()
        u1, u2 = (user_id, target_id) if user_id < target_id else (target_id, user_id)
        
        try:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT status FROM friends 
                    WHERE user_id_1 = %s AND user_id_2 = %s
                """, (u1, u2))
                result = cur.fetchone()
                return result[0] if result else None
        finally:
            conn.close()
            
    
    @staticmethod
    def send_request(sender_id, receiver_id):
        """
        [Story 7.1] Inserts a new pending relationship.
        """
        conn = get_db_connection()
        u1, u2 = (sender_id, receiver_id) if sender_id < receiver_id else (receiver_id, sender_id)
        
        try:
            with conn.cursor() as cur:
                cur.execute("""
                INSERT INTO friends (user_id_1, user_id_2, status, action_user_id)
                VALUES (%s, %s, 'pending', %s)
                ON CONFLICT (user_id_1, user_id_2) DO NOTHING;
            """, (u1, u2, sender_id))
            conn.commit()
            return True
        except Exception:
            conn.rollback()
            return False
        finally:
            conn.close()

    @staticmethod
    def delete_relationship(user_id, target_id):
        conn = get_db_connection()
        u1, u2 = (user_id, target_id) if user_id < target_id else (target_id, user_id)
        
        try:
            with conn.cursor() as cur:
                cur.execute("""
                    DELETE FROM friends 
                    WHERE user_id_1 = %s AND user_id_2 = %s
                """, (u1, u2))
            conn.commit()
            return True
        except Exception:
            conn.rollback()
            return False
        finally:
            conn.close()
