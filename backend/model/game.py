class Game:
    def __init__(self, id: int, title: str, genre: str, thumbnail_url: str, developer: str) -> None:
        self.id = id
        self.title = title
        self.genre = genre
        self.thumbnail_url = thumbnail_url
        self.developer = developer

    def to_dict(self):
        return {
                "id": self.id,
                "title": self.title,
                "genre": self.genre,
                "thumbnail_url": self.thumbnail_url,
                "developer": self.developer
                }
