DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    steam_id VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    profile_picture_url TEXT DEFAULT 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
    description VARCHAR(500),
    sub_class VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    roles VARCHAR(100) DEFAULT 'Any',
    availability JSONB DEFAULT '{
  "Monday": {"Morning": false, "Noon": false, "Evening": false},
  "Tuesday": {"Morning": false, "Noon": false, "Evening": false},
  "Wednesday": {"Morning": false, "Noon": false, "Evening": false},
  "Thursday": {"Morning": false, "Noon": false, "Evening": false},
  "Friday": {"Morning": false, "Noon": false, "Evening": false},
  "Saturday": {"Morning": false, "Noon": false, "Evening": false},
  "Sunday": {"Morning": false, "Noon": false, "Evening": false}
}'::JSONB
);
ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;


CREATE TABLE friends (
    id SERIAL PRIMARY KEY,
    user_id_1 INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_id_2 INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'blocked'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure a user can't be friends with themselves
    CONSTRAINT check_not_self CHECK (user_id_1 != user_id_2),
    -- Ensure we don't have duplicate rows for the same pair (1-2 and 2-1)
    CONSTRAINT unique_friendship UNIQUE (user_id_1, user_id_2)
);

-- Index for faster lookups when checking a specific user's friend list
CREATE INDEX idx_friends_user_1 ON friends(user_id_1);
CREATE INDEX idx_friends_user_2 ON friends(user_id_2);


-- Master list of available games
DROP TABLE IF EXISTS games CASCADE;
CREATE TABLE games(
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) UNIQUE NOT NULL,
    genre VARCHAR(50),
    thumbnail_url TEXT, -- a string of thext that stores a link to an image file
    developer VARCHAR (100)
);
ALTER TABLE games ADD COLUMN icon_url TEXT;

-- Join table: likes Users to Games (Many-to-Many)
DROP TABLE IF EXISTS user_games CASCADE;
CREATE TABLE user_games(
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    game_id INT REFERENCES games(id) ON DELETE CASCADE,
    ingame_name VARCHAR(100), -- Users' IGN for that specific game
    current_rank VARCHAR(50),
    is_main_game BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, game_id)
);


-- class for games
DROP TABLE IF EXISTS parties CASCADE;
CREATE TABLE parties (
    id SERIAL PRIMARY KEY,
    leader_id INT REFERENCES users(id) ON DELETE CASCADE,
    game_mode VARCHAR(50) NOT NULL, 
    rank_requirement VARCHAR(50) default 'Unrated',
    region VARCHAR(50) NOT NULL,
    current_players INT DEFAULT 1,
    max_players INT NOT NULL,
    game_id INT REFERENCES games(id) ON DELETE CASCADE,
    CONSTRAINT player_limit CHECK (current_players <= max_players),
    CONSTRAINT min_players CHECK (max_players > 0),
    CONSTRAINT positive_players CHECK (current_players >= 1)
);


CREATE OR REPLACE FUNCTION calculate_harmony_score(
    user_availability JSONB,
    target_availability JSONB
)
RETURNS FLOAT AS $$
DECLARE
    day TEXT;
    slot TEXT;
    score FLOAT := 0;
BEGIN
    FOR day IN SELECT jsonb_object_keys(target_availability)
    LOOP
        FOR slot IN SELECT jsonb_object_keys(target_availability->day)
        LOOP
            IF (user_availability->day->>slot)::boolean
               AND (target_availability->day->>slot)::boolean THEN
                score := score + 1;
            END IF;
        END LOOP;
    END LOOP;

    RETURN score;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
