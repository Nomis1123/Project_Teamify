-- 1. Table for Ranks
DROP TABLE IF EXISTS game_ranks CASCADE;
CREATE TABLE game_ranks (
    id SERIAL PRIMARY KEY,
    game_id INT REFERENCES games(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    tier_level INT NOT NULL, -- e.g., Bronze = 1, Silver = 2. Crucial for matchmaking!
    icon_url TEXT
);

-- 2. Table for Roles
DROP TABLE IF EXISTS game_roles CASCADE;
CREATE TABLE game_roles (
    id SERIAL PRIMARY KEY,
    game_id INT REFERENCES games(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    icon_url TEXT
);

ALTER TABLE user_games 
ADD COLUMN rank_id INT REFERENCES game_ranks(id) ON DELETE SET NULL,
ADD COLUMN role_id INT REFERENCES game_roles(id) ON DELETE SET NULL;
