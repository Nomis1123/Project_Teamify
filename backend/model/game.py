import psycopg2.extras

GAME_OPTIONAL_FIELDS = {
    "thumbnail_url": None,
}

GAME_RELATION_DEFAULTS = {
    "ranks": [],
    "roles": [],
}

GAME_FIELDS = ", ".join(["id", "title"] + list(GAME_OPTIONAL_FIELDS.keys()))


class Game:

    def __init__(self, id: int, title: str, **kwargs):

        self.id = id
        self.title = title 

        for key, default in GAME_OPTIONAL_FIELDS.items():
            setattr(self, key, kwargs.get(key, default))

        for key, default in GAME_RELATION_DEFAULTS.items():
            setattr(self, key, kwargs.get(key, default))

    # Used for SteamAPI
    # Add game to DB if it is not in DB already
    @classmethod
    def get(cls, conn, title: str, ranks: list, roles: list, **kwargs):
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            # Check if game exists in DB (not case-sensitive)
            cur.execute(f"SELECT {GAME_FIELDS} FROM games WHERE LOWER(title) = LOWER(%s)", (title,))
            row = cur.fetchone()

            if row:
                return cls._build(cur, row)

            # Add game to DB if not exist
            return cls.create(conn, title, ranks, roles, **kwargs)

    @classmethod
    def create(cls, conn, title: str, ranks: list, roles: list, **kwargs):
        fields = ["title"] + list(kwargs.keys())
        values = [title] + list(kwargs.values())
        placeholders = ", ".join(["%s"] * len(values))
        columns = ", ".join(fields)

        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(
                f"INSERT INTO games ({columns}) VALUES ({placeholders}) RETURNING {GAME_FIELDS}",
                values
            )
            row = cur.fetchone()
            game_id = row["id"]

            for order, rank in enumerate(ranks):
                cur.execute(
                    "INSERT INTO game_ranks (game_id, name, rank_order) VALUES (%s, %s, %s)",
                    (game_id, rank, order)
                )

            for role in roles:
                cur.execute(
                    "INSERT INTO game_roles (game_id, name) VALUES (%s, %s)",
                    (game_id, role)
                )

        conn.commit()
        return cls._build(cur, row, ranks, roles)

    @classmethod
    def _build(cls, cur, row, ranks=None, roles=None):
        data = dict(row)

        if ranks is None:
            cur.execute(
                "SELECT name FROM game_ranks WHERE game_id = %s ORDER BY rank_order",
                (data["id"],)
            )
            ranks = [r["name"] for r in cur.fetchall()]

        if roles is None:
            cur.execute(
                "SELECT name FROM game_roles WHERE game_id = %s",
                (data["id"],)
            )
            roles = [r["name"] for r in cur.fetchall()]

        data["ranks"] = ranks
        data["roles"] = roles
        return cls(**data)

    def to_dict(self, exclude=None):
        '''
        Return a dictionary representation of the class, with fields excluded
        in exclude.

        Example:
        dict = my_game.to_dict(exclude={'id'})

        = {
        'title': 'Your Game Title',
        'thumbnail_url': 'your.thumbnail.url.com/'
        }

        '''

        if exclude is None:
            exclude = set()

        return {
                key: value
                for key, value in self.__dict__.items()
                if key not in exclude
                }

    # Used for Sync Games
    # Add game to user's list of owned games
    @staticmethod
    def add_game_to_user(conn, user_id: int, game_id: int):
        with conn.cursor() as cur:
            cur.execute("INSERT INTO user_games "
                        "VALUES (%s, %s, %s, %s, %s) "
                        "ON CONFLICT (user_id, game_id) DO NOTHING",
                        (user_id, game_id, None, None, False))
            conn.commit()
