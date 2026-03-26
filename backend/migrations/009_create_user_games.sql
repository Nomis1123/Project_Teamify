CREATE TABLE user_games(
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    game_id INT REFERENCES games(id) ON DELETE CASCADE,
    ingame_name VARCHAR(100), -- Users' IGN for that specific game
    current_rank VARCHAR(50),
    is_main_game BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, game_id)
);
