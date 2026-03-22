CREATE TABLE game_ranks (
    id SERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    rank_order INTEGER
);
