-- 1. Clean up
TRUNCATE users, games, user_games RESTART IDENTITY CASCADE;

-- 2. Re-insert Games
INSERT INTO games (title, genre, developer) VALUES 
('Valorant', 'FPS', 'Riot Games'),
('PUBG', 'Battle Royale', 'Krafton'),
('League', 'MOBA', 'Riot Games'),
('Minecraft', 'Sandbox', 'Mojang'),
('Apex Legends', 'Battle Royale', 'Respawn');

-- 3. Insert 22 Unique Users
INSERT INTO users (username, email, password_hash, steam_id, description, is_verified, availability) VALUES 
('Luna_Vibes', 'luna@test.com', '$2b$12$hash', '76561197960435101', 'Late night sessions only.', true, '{"Monday": {"Evening": true}, "Tuesday": {"Evening": true}, "Wednesday": {"Evening": true}, "Thursday": {"Evening": true}, "Friday": {"Evening": true}, "Saturday": {"Evening": true}, "Sunday": {"Evening": true}}'::jsonb),
('ShadowStep', 'shadow@test.com', '$2b$12$hash', '76561197960435102', 'I thrive in the dark.', true, '{"Monday": {"Evening": true}, "Tuesday": {"Evening": true}, "Wednesday": {"Evening": true}, "Thursday": {"Evening": true}, "Friday": {"Evening": true}, "Saturday": {"Evening": true}, "Sunday": {"Evening": true}}'::jsonb),
('Weekend_King', 'king@test.com', '$2b$12$hash', '76561197960435103', 'Work hard, play hard Saturday/Sunday.', true, '{"Saturday": {"Morning": true, "Noon": true, "Evening": true}, "Sunday": {"Morning": true, "Noon": true, "Evening": true}}'::jsonb),
('OfficeWorker_95', 'office@test.com', '$2b$12$hash', '76561197960435104', 'Free on weekends!', true, '{"Saturday": {"Morning": true, "Noon": true, "Evening": true}, "Sunday": {"Morning": true, "Noon": true, "Evening": true}}'::jsonb),
('EarlyBird_99', 'bird@test.com', '$2b$12$hash', '76561197960435105', 'Gaming before work is the best.', true, '{"Monday": {"Morning": true}, "Tuesday": {"Morning": true}, "Wednesday": {"Morning": true}, "Thursday": {"Morning": true}, "Friday": {"Morning": true}}'::jsonb),
('FullTimeGamer', 'pro@test.com', '$2b$12$hash', '76561197960435106', 'I have no life, I am always on.', true, '{"Monday": {"Morning": true, "Noon": true, "Evening": true}, "Tuesday": {"Morning": true, "Noon": true, "Evening": true}, "Wednesday": {"Morning": true, "Noon": true, "Evening": true}, "Thursday": {"Morning": true, "Noon": true, "Evening": true}, "Friday": {"Morning": true, "Noon": true, "Evening": true}, "Saturday": {"Morning": true, "Noon": true, "Evening": true}, "Sunday": {"Morning": true, "Noon": true, "Evening": true}}'::jsonb),
('UniStudent', 'student@test.com', '$2b$12$hash', '76561197960435107', 'Gaming after lectures.', true, '{"Monday": {"Noon": true, "Evening": true}, "Wednesday": {"Noon": true, "Evening": true}, "Friday": {"Noon": true, "Evening": true}}'::jsonb),
('Lazy_Gamer', 'lazy@test.com', '$2b$12$hash', '76561197960435108', 'I havent set my schedule yet.', true, '{}'::jsonb),
('User_8', 'u8@test.com', '$2b$12$hash', '76561197960435109', 'Test user 8', true, '{}'::jsonb),
('User_9', 'u9@test.com', '$2b$12$hash', '76561197960435110', 'Test user 9', true, '{}'::jsonb),
('User_10', 'u10@test.com', '$2b$12$hash', '76561197960435111', 'Test user 10', true, '{}'::jsonb),
('User_11', 'u11@test.com', '$2b$12$hash', '76561197960435112', 'Test user 11', true, '{}'::jsonb),
('User_12', 'u12@test.com', '$2b$12$hash', '76561197960435113', 'Test user 12', true, '{}'::jsonb),
('User_13', 'u13@test.com', '$2b$12$hash', '76561197960435114', 'Test user 13', true, '{}'::jsonb),
('User_14', 'u14@test.com', '$2b$12$hash', '76561197960435115', 'Test user 14', true, '{}'::jsonb),
('User_15', 'u15@test.com', '$2b$12$hash', '76561197960435116', 'Test user 15', true, '{}'::jsonb),
('User_16', 'u16@test.com', '$2b$12$hash', '76561197960435117', 'Test user 16', true, '{}'::jsonb),
('User_17', 'u17@test.com', '$2b$12$hash', '76561197960435118', 'Test user 17', true, '{}'::jsonb),
('User_18', 'u18@test.com', '$2b$12$hash', '76561197960435119', 'Test user 18', true, '{}'::jsonb),
('User_19', 'u19@test.com', '$2b$12$hash', '76561197960435120', 'Test user 19', true, '{}'::jsonb),
('User_20', 'u20@test.com', '$2b$12$hash', '76561197960435121', 'Test user 20', true, '{}'::jsonb),
('User_21', 'u21@test.com', '$2b$12$hash', '76561197960435122', 'Test user 21', true, '{}'::jsonb),
('User_22', 'u22@test.com', '$2b$12$hash', '76561197960435123', 'Test user 22', true, '{}'::jsonb);

-- 4. Map Games (First 5 unique, others Valorant)
INSERT INTO user_games (user_id, game_id, current_rank) VALUES 
(1, (SELECT id FROM games WHERE title = 'Valorant'), 'Gold'),
(2, (SELECT id FROM games WHERE title = 'PUBG'), 'Diamond'),
(3, (SELECT id FROM games WHERE title = 'League'), 'Silver'),
(4, (SELECT id FROM games WHERE title = 'Minecraft'), 'Survival'),
(5, (SELECT id FROM games WHERE title = 'Apex Legends'), 'Platinum');

INSERT INTO user_games (user_id, game_id, current_rank)
SELECT id, (SELECT id FROM games WHERE title = 'Valorant'), 'Gold'
FROM users WHERE id >= 6;