-- is_verified is set to false by default when create a new user account
-- An email will be sent to the user; User should click the link in the email to verify
-- After the button in the email is clicked


DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    my_games_list JSONB DEFAULT '[]' ,
    profile_picture_url TEXT DEFAULT 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
    description VARCHAR(500),
    sub_class VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    availability JSONB DEFAULT '{}'
);



-- picture
-- bio descruption
-- sub-class
-- for profile page


-- class for games
DROP TABLE IF EXISTS parties CASCADE;
CREATE TABLE parties (
    id SERIAL PRIMARY KEY,
    leader_id INT REFERENCES users(id) ON DELETE CASCADE,
    game_mode VARCHAR(50) NOT NULL, 
    rank_requirement VARCHAR(50),
    region VARCHAR(50) NOT NULL,
    current_players INT DEFAULT 1,
    max_players INT NOT NULL,
    CONSTRAINT player_limit CHECK (current_players <= max_players),
    CONSTRAINT min_players CHECK (max_players > 0)
);

