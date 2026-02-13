SELECT current_database(), inet_server_port();
-- SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public';

-- -- clean up; Clean existing data fro a fresh test
-- TRUNCATE users, games, user_games, parties CASCADE;

-- -- Insert Users
-- INSERT INTO users (username, email, password_hash, is_verified) VALUES 
-- ('TenZ', 'tenz@valorant.com', 'hashed_pw_1', TRUE),
-- ('Faker', 'faker@t1.com', 'hashed_pw_2', TRUE),
-- ('S1mple', 's1mple@cs2.com', 'hashed_pw_3', FALSE);

-- -- Insert games list
-- INSERT INTO games (title, genre, developer, thumbnail_url) VALUES 
-- ('Valorant', 'FPS', 'Riot Games', 'https://example.com/val_thumb.jpg'),
-- ('League of Legends', 'MOBA', 'Riot Games', 'https://example.com/lol_thumb.jpg'),
-- ('Counter-Strike 2', 'FPS', 'Valve', 'https://example.com/cs2_thumb.jpg');

-- -- Link users to Games (User_game table)
-- -- The many-to-many relationship
-- INSERT INTO user_games (user_id, game_id, ingame_name, current_rank, is_main_game) VALUES 
-- (1, 1, 'TenZ#NA1', 'Radiant', TRUE),
-- (2, 2, 'Hide on bush', 'Challenger', TRUE),
-- (3, 3, 's1mple', 'Global Elite', TRUE),
-- (1, 3, 'TenZ_CS', 'Legendary Eagle', FALSE);

-- -- Create test parties
-- INSERT INTO parties (leader_id, game_id, game_mode, rank_requirement, region, max_players, current_players) VALUES 
-- (1, 1, 'Competitive', 'Immortal+', 'NA-West', 5, 1),
-- (2, 2, 'Ranked Queue', 'Diamond 1+', 'KR', 5, 1);


-- -- Check if we can find parties for a specific game
-- SELECT p.id, g.title as game, u.username as leader, p.region
-- FROM parties p
-- JOIN games g ON p.game_id = g.id
-- JOIN users u ON p.leader_id = u.id;

-- -- Test the constraints (This should Fail)
-- -- Try to insert a perty where current_players is higher than max_players. If it throws an error
-- -- the CONSTRAINT player_limit is working
-- INSERT INTO parties (leader_id, game_id, game_mode, region, max_players, current_players)
-- VALUES (1, 1, 'Test', 'NA', 2, 5); -- Should return: "new row for relation "parties" violates check constraint "player_limit""
