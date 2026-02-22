-- 1. Clean up
TRUNCATE users, games, user_games, parties RESTART IDENTITY CASCADE;

-- 2. Insert Test Games
INSERT INTO games (title, genre, developer) VALUES 
('Valorant', 'FPS', 'Riot Games'),
('Apex Legends', 'Battle Royale', 'Respawn'),
('League of Legends', 'MOBA', 'Riot Games'),
('Overwatch 2', 'Hero Shooter', 'Blizzard');

-- 3. Insert Users with VALID BCRYPT HASH and STEAM_ID
-- Note: steam_id is added as the 4th column here
INSERT INTO users (username, email, password_hash, steam_id, description, is_verified, availability) VALUES 
('Luna_Vibes', 'luna@test.com', '$2b$12$K17vL.9N3S6N0P.vGfFvAueWvKovlBvY2.G0.B6vH6vH6vH6vH6vH', '76561197960435101', 'Late night sessions only.', true, '{"Monday": {"Evening": true}, "Tuesday": {"Evening": true}, "Wednesday": {"Evening": true}, "Thursday": {"Evening": true}, "Friday": {"Evening": true}, "Saturday": {"Evening": true}, "Sunday": {"Evening": true}}'::jsonb),
('ShadowStep', 'shadow@test.com', '$2b$12$K17vL.9N3S6N0P.vGfFvAueWvKovlBvY2.G0.B6vH6vH6vH6vH6vH', '76561197960435102', 'I thrive in the dark.', true, '{"Monday": {"Evening": true}, "Tuesday": {"Evening": true}, "Wednesday": {"Evening": true}, "Thursday": {"Evening": true}, "Friday": {"Evening": true}, "Saturday": {"Evening": true}, "Sunday": {"Evening": true}}'::jsonb),
('Weekend_King', 'king@test.com', '$2b$12$K17vL.9N3S6N0P.vGfFvAueWvKovlBvY2.G0.B6vH6vH6vH6vH6vH', '76561197960435103', 'Work hard, play hard Saturday/Sunday.', true, '{"Saturday": {"Morning": true, "Noon": true, "Evening": true}, "Sunday": {"Morning": true, "Noon": true, "Evening": true}}'::jsonb),
('OfficeWorker_95', 'office@test.com', '$2b$12$K17vL.9N3S6N0P.vGfFvAueWvKovlBvY2.G0.B6vH6vH6vH6vH6vH', '76561197960435104', 'Free on weekends!', true, '{"Saturday": {"Morning": true, "Noon": true, "Evening": true}, "Sunday": {"Morning": true, "Noon": true, "Evening": true}}'::jsonb),
('EarlyBird_99', 'bird@test.com', '$2b$12$K17vL.9N3S6N0P.vGfFvAueWvKovlBvY2.G0.B6vH6vH6vH6vH6vH', '76561197960435105', 'Gaming before work is the best.', true, '{"Monday": {"Morning": true}, "Tuesday": {"Morning": true}, "Wednesday": {"Morning": true}, "Thursday": {"Morning": true}, "Friday": {"Morning": true}}'::jsonb),
('FullTimeGamer', 'pro@test.com', '$2b$12$K17vL.9N3S6N0P.vGfFvAueWvKovlBvY2.G0.B6vH6vH6vH6vH6vH', '76561197960435106', 'I have no life, I am always on.', true, '{"Monday": {"Morning": true, "Noon": true, "Evening": true}, "Tuesday": {"Morning": true, "Noon": true, "Evening": true}, "Wednesday": {"Morning": true, "Noon": true, "Evening": true}, "Thursday": {"Morning": true, "Noon": true, "Evening": true}, "Friday": {"Morning": true, "Noon": true, "Evening": true}, "Saturday": {"Morning": true, "Noon": true, "Evening": true}, "Sunday": {"Morning": true, "Noon": true, "Evening": true}}'::jsonb),
('UniStudent', 'student@test.com', '$2b$12$K17vL.9N3S6N0P.vGfFvAueWvKovlBvY2.G0.B6vH6vH6vH6vH6vH', '76561197960435107', 'Gaming after lectures.', true, '{"Monday": {"Noon": true, "Evening": true}, "Wednesday": {"Noon": true, "Evening": true}, "Friday": {"Noon": true, "Evening": true}}'::jsonb),
('Lazy_Gamer', 'lazy@test.com', '$2b$12$K17vL.9N3S6N0P.vGfFvAueWvKovlBvY2.G0.B6vH6vH6vH6vH6vH', '76561197960435108', 'I havent set my schedule yet.', true, DEFAULT),
('User_8', 'u8@test.com', '$2b$12$K17vL.9N3S6N0P.vGfFvAueWvKovlBvY2.G0.B6vH6vH6vH6vH6vH', '76561197960435109', 'Test user 8', true, DEFAULT),
('User_9', 'u9@test.com', '$2b$12$K17vL.9N3S6N0P.vGfFvAueWvKovlBvY2.G0.B6vH6vH6vH6vH6vH', '76561197960435110', 'Test user 9', true, DEFAULT),
('User_10', 'u10@test.com', '$2b$12$K17vL.9N3S6N0P.vGfFvAueWvKovlBvY2.G0.B6vH6vH6vH6vH6vH', '76561197960435111', 'Test user 10', true, DEFAULT),
('User_11', 'u11@test.com', '$2b$12$K17vL.9N3S6N0P.vGfFvAueWvKovlBvY2.G0.B6vH6vH6vH6vH6vH', '76561197960435112', 'Test user 11', true, DEFAULT),
('User_12', 'u12@test.com', '$2b$12$K17vL.9N3S6N0P.vGfFvAueWvKovlBvY2.G0.B6vH6vH6vH6vH6vH', '76561197960435113', 'Test user 12', true, DEFAULT);

-- 4. Assign Games
INSERT INTO user_games (user_id, game_id, current_rank, is_main_game) 
SELECT u.id, (SELECT id FROM games WHERE title = 'Valorant'), 'Gold III', true 
FROM users u;

INSERT INTO user_games (user_id, game_id, current_rank, is_main_game) 
SELECT u.id, (SELECT id FROM games WHERE title = 'Apex Legends'), 'Platinum II', false 
FROM users u LIMIT 5;