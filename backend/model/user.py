from controller.extensions import get_db_connection



class User:
    def __init__(self, id, username, email, description=None, pfp_url=None):

        self.id = id
        self.username = username
        self.email = email
        self.description = description
        self.pfp_url = pfp_url

    @staticmethod
    def create(username, email, hashed_password):

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
