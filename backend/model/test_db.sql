SELECT current_database(), inet_server_port();
SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public';

-- clean up; Clean existing data fro a fresh test
TRUNCATE users, games, user_games, parties CASCADE;

-- Insert Users
INSERT INTO users (username, email, password_hash, is_verified) VALUES 
('TenZ', 'tenz@valorant.com', 'hashed_pw_1', TRUE),
('Faker', 'faker@t1.com', 'hashed_pw_2', TRUE),
('S1mple', 's1mple@cs2.com', 'hashed_pw_3', FALSE);
SELECT * FROM users;

-- Insert games list
INSERT INTO games (title, genre, developer, thumbnail_url) VALUES 
('Valorant', 'FPS', 'Riot Games', 'https://example.com/val_thumb.jpg'),
('League of Legends', 'MOBA', 'Riot Games', 'https://example.com/lol_thumb.jpg'),
('Counter-Strike 2', 'FPS', 'Valve', 'https://example.com/cs2_thumb.jpg');
SELECT * FROM games;

-- Link users to Games (User_game table)
-- The many-to-many relationship
INSERT INTO user_games (user_id, game_id, ingame_name, current_rank, is_main_game) VALUES 
((SELECT id FROM users WHERE username = 'TenZ'), 
 (SELECT id FROM games WHERE title = 'Valorant'), 
 'TenZ#NA1', 'Radiant', TRUE),
 
((SELECT id FROM users WHERE username = 'Faker'), 
 (SELECT id FROM games WHERE title = 'League of Legends'), 
 'Hide on bush', 'Challenger', TRUE);
SELECT * from user_games;

-- Create test parties
INSERT INTO parties (leader_id, game_id, game_mode, rank_requirement, region, max_players, current_players) VALUES 
((SELECT id FROM users WHERE username = 'TenZ'), 
 (SELECT id FROM games WHERE title = 'Valorant'), 
 'Competitive', 'Immortal+', 'NA-West', 5, 1);

-- Check if we can find parties for a specific game
SELECT p.id, g.title as game, u.username as leader, p.region
FROM parties p
JOIN games g ON p.game_id = g.id
JOIN users u ON p.leader_id = u.id;

-- Test the constraints (This should Fail)
-- Try to insert a perty where current_players is higher than max_players. If it throws an error
-- the CONSTRAINT player_limit is working
-- This will now fail specifically because 5 > 2 (player_limit constraint)
INSERT INTO parties (leader_id, game_id, game_mode, region, max_players, current_players)
VALUES (
    (SELECT id FROM users WHERE username = 'TenZ'), 
    (SELECT id FROM games WHERE title = 'Valorant'), 
    'Test', 'NA', 2, 5
);
