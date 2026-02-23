from controller.extensions import get_db_connection



class User:
    def __init__(self, id, username, email, description=None, pfp_url=None):

        self.id = id
        self.username = username
        self.email = email
        self.description = description
        self.pfp_url = pfp_url


    def get_password_hash(self) -> str:

        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT password_hash FROM users WHERE id = %s", (self.id,))
                row = cur.fetchone()
                if not row:
                    raise ValueError("User not found")

                return row[0]
        finally:
            conn.close()

    @staticmethod
    def create(username, email, hashed_password):
        """
        Create a new user in the database.

        Args:
            username: username of the new user.
            email: email of the new user.
            hashed_password: the hashed pass of the user.

        Returns:
            A User object of the new user.
        """

        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO users (username, email, password_hash)
                    VALUES (%s, %s, %s)
                    RETURNING id, username, email
                    """,
                    (username, email, hashed_password)
                )
                row = cur.fetchone()
            conn.commit()
            return User(*row)
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

    @staticmethod
    def find_by_id(user_id):
        '''
        Find and return a User object based on an user id.

        Args:
            id: int.
        Returns:
            User object pertaining to user id.
        '''
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT id, username, email, description, profile_picture_url FROM users WHERE id = %s",
                    (user_id,)
                )
                row = cur.fetchone()
                if row:
                    return User(*row)
                return None
        finally:
            conn.close()

    @staticmethod
    def find_by_email(email):
        '''
        Find and return a User object based on an email.

        Args:
            email: string.
        Returns:
            User object pertaining to registered email.
        '''
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT id, username, email, description, profile_picture_url FROM users WHERE email = %s",
                    (email,)
                )
                row = cur.fetchone()
                if row:
                    return User(*row)
                return None
        finally:
            conn.close()


    def update(self, fields:dict, conn=None):

        # check that fields is not empty
        if not fields:
            raise ValueError("No valid fields provided.")

        # these are the fields which will use this update() function
        allowed = {"username", "description", "pfp_url", "steam_id"}
        manage_conn = conn is None

        # apply filter onto allowed fields
        filtered = {k: v for k,v in fields.items() if k in allowed}

        if not filtered:
            raise ValueError("No valid fields to update.")

        set_clause = ", ".join(f"{k} = %s" for k in filtered)
        values = list(filtered.values()) + [self.id]

        if manage_conn:
            conn = get_db_connection()

        try:
            with conn.cursor() as cur:
                cur.execute(
                    f"UPDATE users SET {set_clause} WHERE id = %s",
                    values
                )
            if manage_conn:
                conn.commit()
        except Exception as e:
            if manage_conn:
                conn.rollback()
            raise e
        finally:
            if manage_conn:
                conn.close() 

    def compare_and_update(self, database_field: str, old_value, new_value, conn=None):

        manage_conn = conn is None

        if manage_conn:
            conn = get_db_connection()

        try:
            with conn.cursor() as cur:
                cur.execute(
                        f"SELECT {database_field} FROM users WHERE id = %s",
                        (self.id,)
                        )
                row = cur.fetchone()

                if not row:
                    raise ValueError("User not found.")

                if row[0] != old_value:
                    raise ValueError(f"Old {database_field} is incorrect.")

                cur.execute(f"UPDATE users SET {database_field} = %s WHERE id = %s", (new_value, self.id))

                if manage_conn:
                    conn.commit()

        except Exception as e:
            if manage_conn:
                conn.rollback()
            raise e

        finally:
            if manage_conn:
                conn.close()

    def to_dict(self):
        """
        Return a dictionary representation of the User object.

        Returns:
            Dictionary representation of user object.

        """

        return {
                "id": self.id,
                "username": self.username,
                "email": self.email,
                "description": self.description,
                "pfp_url": self.pfp_url
                }

'''
username
old email new email
old password new password
description
'''
