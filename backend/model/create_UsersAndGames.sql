
TRUNCATE users, games, user_games RESTART IDENTITY CASCADE;



CREATE OR REPLACE FUNCTION default_availability()
RETURNS JSONB AS $$
BEGIN
    RETURN '{
      "Monday": {"Morning": false, "Noon": false, "Evening": false},
      "Tuesday": {"Morning": false, "Noon": false, "Evening": false},
      "Wednesday": {"Morning": false, "Noon": false, "Evening": false},
      "Thursday": {"Morning": false, "Noon": false, "Evening": false},
      "Friday": {"Morning": false, "Noon": false, "Evening": false},
      "Saturday": {"Morning": false, "Noon": false, "Evening": false},
      "Sunday": {"Morning": false, "Noon": false, "Evening": false}
    }'::jsonb;
END;
$$ LANGUAGE plpgsql IMMUTABLE;



INSERT INTO games (title, genre, developer) VALUES 
('Valorant', 'FPS', 'Riot Games'),
('PUBG', 'Battle Royale', 'Krafton'),
('League', 'MOBA', 'Riot Games'),
('Minecraft', 'Sandbox', 'Mojang'),
('Apex Legends', 'Battle Royale', 'Respawn');


INSERT INTO users (
    username, email, password_hash, steam_id,
    description, is_verified, roles
) VALUES 
('LunaVibes', 'luna@test.com', '$2b$12$hash', '76561197960435101', 'Late night sessions only.', true, 'Sniper'),
('ShadowStep', 'shadow@test.com', '$2b$12$hash', '76561197960435102', 'I thrive in the dark.', true, 'Lurker'),
('WeekendKing', 'king@test.com', '$2b$12$hash', '76561197960435103', 'Work hard, play hard Saturday/Sunday.', true, 'Tank'),
('OfficeWorker95', 'office@test.com', '$2b$12$hash', '76561197960435104', 'Free on weekends!', true, 'Support'),
('EarlyBird99', 'bird@test.com', '$2b$12$hash', '76561197960435105', 'Gaming before work is the best.', true, 'IGL'),
('FullTimeGamer', 'pro@test.com', '$2b$12$hash', '76561197960435106', 'I have no life, I am always on.', true, 'Duelist'),
('UniStudent', 'student@test.com', '$2b$12$hash', '76561197960435107', 'Gaming after lectures.', true, 'Flex'),
('LazyGamer', 'lazy@test.com', '$2b$12$hash', '76561197960435108', 'I havent set my schedule yet.', true, 'Any'),
('User8', 'u8@test.com', '$2b$12$hash', '76561197960435109', 'Test user 8', true, 'Support'),
('User9', 'u9@test.com', '$2b$12$hash', '76561197960435110', 'Test user 9', true, 'Tank'),
('User10', 'u10@test.com', '$2b$12$hash', '76561197960435111', 'Test user 10', true, 'Duelist'),
('User11', 'u11@test.com', '$2b$12$hash', '76561197960435112', 'Test user 11', true, 'Sniper'),
('User12', 'u12@test.com', '$2b$12$hash', '76561197960435113', 'Test user 12', true, 'Controller'),
('User13', 'u13@test.com', '$2b$12$hash', '76561197960435114', 'Test user 13', true, 'Support'),
('User14', 'u14@test.com', '$2b$12$hash', '76561197960435115', 'Test user 14', true, 'IGL'),
('User15', 'u15@test.com', '$2b$12$hash', '76561197960435116', 'Test user 15', true, 'Entry'),
('User16', 'u16@test.com', '$2b$12$hash', '76561197960435117', 'Test user 16', true, 'Lurker'),
('User17', 'u17@test.com', '$2b$12$hash', '76561197960435118', 'Test user 17', true, 'Any'),
('User18', 'u18@test.com', '$2b$12$hash', '76561197960435119', 'Test user 18', true, 'Duelist'),
('User19', 'u19@test.com', '$2b$12$hash', '76561197960435120', 'Test user 19', true, 'Healer'),
('User20', 'u20@test.com', '$2b$12$hash', '76561197960435121', 'Test user 20', true, 'Tank'),
('User21', 'u21@test.com', '$2b$12$hash', '76561197960435122', 'Test user 21', true, 'Support'),
('User22', 'u22@test.com', '$2b$12$hash', '76561197960435123', 'Test user 22', true, 'IGL');


-- LunaVibes and ShadowStep (all evenings true)
UPDATE users
SET availability = '{
  "Monday": {"Morning": false, "Noon": false, "Evening": true},
  "Tuesday": {"Morning": false, "Noon": false, "Evening": true},
  "Wednesday": {"Morning": false, "Noon": false, "Evening": true},
  "Thursday": {"Morning": false, "Noon": false, "Evening": true},
  "Friday": {"Morning": false, "Noon": false, "Evening": true},
  "Saturday": {"Morning": false, "Noon": false, "Evening": true},
  "Sunday": {"Morning": false, "Noon": false, "Evening": true}
}'::jsonb
WHERE username IN ('LunaVibes', 'ShadowStep');

-- WeekendKing and OfficeWorker95 (weekend full)
UPDATE users
SET availability = '{
  "Monday": {"Morning": false, "Noon": false, "Evening": false},
  "Tuesday": {"Morning": false, "Noon": false, "Evening": false},
  "Wednesday": {"Morning": false, "Noon": false, "Evening": false},
  "Thursday": {"Morning": false, "Noon": false, "Evening": false},
  "Friday": {"Morning": false, "Noon": false, "Evening": false},
  "Saturday": {"Morning": true, "Noon": true, "Evening": true},
  "Sunday": {"Morning": true, "Noon": true, "Evening": true}
}'::jsonb
WHERE username IN ('WeekendKing', 'OfficeWorker95');

-- EarlyBird99 (weekdays mornings)
UPDATE users
SET availability = '{
  "Monday": {"Morning": true, "Noon": false, "Evening": false},
  "Tuesday": {"Morning": true, "Noon": false, "Evening": false},
  "Wednesday": {"Morning": true, "Noon": false, "Evening": false},
  "Thursday": {"Morning": true, "Noon": false, "Evening": false},
  "Friday": {"Morning": true, "Noon": false, "Evening": false},
  "Saturday": {"Morning": false, "Noon": false, "Evening": false},
  "Sunday": {"Morning": false, "Noon": false, "Evening": false}
}'::jsonb
WHERE username = 'EarlyBird99';

-- UniStudent (after lectures)
UPDATE users
SET availability = '{
  "Monday": {"Morning": false, "Noon": true, "Evening": true},
  "Tuesday": {"Morning": false, "Noon": false, "Evening": false},
  "Wednesday": {"Morning": false, "Noon": true, "Evening": true},
  "Thursday": {"Morning": false, "Noon": false, "Evening": false},
  "Friday": {"Morning": false, "Noon": true, "Evening": false},
  "Saturday": {"Morning": false, "Noon": false, "Evening": false},
  "Sunday": {"Morning": false, "Noon": false, "Evening": false}
}'::jsonb
WHERE username = 'UniStudent';

-- FullTimeGamer (always available)
UPDATE users
SET availability = '{
  "Monday": {"Morning": true, "Noon": true, "Evening": true},
  "Tuesday": {"Morning": true, "Noon": true, "Evening": true},
  "Wednesday": {"Morning": true, "Noon": true, "Evening": true},
  "Thursday": {"Morning": true, "Noon": true, "Evening": true},
  "Friday": {"Morning": true, "Noon": true, "Evening": true},
  "Saturday": {"Morning": true, "Noon": true, "Evening": true},
  "Sunday": {"Morning": true, "Noon": true, "Evening": true}
}'::jsonb
WHERE username = 'FullTimeGamer';


-- First 5 users: Diverse games with new standardized ranks
INSERT INTO user_games (user_id, game_id, current_rank) VALUES 
(1, (SELECT id FROM games WHERE title = 'PUBG'), 'Bronze 2'),
(2, (SELECT id FROM games WHERE title = 'PUBG'), 'Silver 4'),
(3, (SELECT id FROM games WHERE title = 'League'), 'Gold 1'),
(4, (SELECT id FROM games WHERE title = 'Minecraft'), 'Gold 5'),
(5, (SELECT id FROM games WHERE title = 'Apex Legends'), 'Platinum 3');

-- Users 6-8: Valorant - Diamond
INSERT INTO user_games (user_id, game_id, current_rank)
SELECT id, (SELECT id FROM games WHERE title = 'Valorant'), 'Diamond 2'
FROM users
WHERE id BETWEEN 6 AND 8;

-- Users 9-10: Valorant - Master
INSERT INTO user_games (user_id, game_id, current_rank)
SELECT id, (SELECT id FROM games WHERE title = 'Valorant'), 'Master'
FROM users
WHERE id BETWEEN 9 AND 10;

-- Users 11-12: Valorant - Silver
INSERT INTO user_games (user_id, game_id, current_rank)
SELECT id, (SELECT id FROM games WHERE title = 'Valorant'), 'Silver 3'
FROM users
WHERE id BETWEEN 11 AND 12;

-- Users 13-15: Valorant - Gold
INSERT INTO user_games (user_id, game_id, current_rank)
SELECT id, (SELECT id FROM games WHERE title = 'Valorant'), 'Gold 4'
FROM users
WHERE id BETWEEN 13 AND 15;

-- Users 16-22: Valorant - Platinum
INSERT INTO user_games (user_id, game_id, current_rank)
SELECT id, (SELECT id FROM games WHERE title = 'Valorant'), 'Platinum 1'
FROM users
WHERE id >= 16;