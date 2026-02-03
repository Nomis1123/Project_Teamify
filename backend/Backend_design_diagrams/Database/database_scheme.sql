
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    my_games_list TEXT 
);

CREATE TABLE parties (
    id SERIAL PRIMARY KEY,
    leader_id INT REFERENCES users(id),
    game_mode VARCHAR(50), 
    rank_requirement VARCHAR(50),
    region VARCHAR(50),
    current_players INT DEFAULT 1,
    max_players INT,
    is_full BOOLEAN DEFAULT FALSE 
);