
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
('LunaVibes', 'luna@test.com', '$2b$12$iyxGdsCmz0TqdyS9bkpGGuFN.GGDJ/Y8E2eDe8Y2t8/Zp4jqXLqEK', '76561197960435101', 'Late night sessions only.', true, 'DPS'),
('ShadowStep', 'shadow@test.com', '$2b$12$iyxGdsCmz0TqdyS9bkpGGuFN.GGDJ/Y8E2eDe8Y2t8/Zp4jqXLqEK', '76561197960435102', 'I thrive in the dark.', true, 'DPS'),
('WeekendKing', 'king@test.com', '$2b$12$hash', '76561197960435103', 'Work hard, play hard Saturday/Sunday.', true, 'Tank'),
('OfficeWorker95', 'office@test.com', '$2b$12$hash', '76561197960435104', 'Free on weekends!', true, 'Support'),
('EarlyBird99', 'bird@test.com', '$2b$12$hash', '76561197960435105', 'Gaming before work.', true, 'Support'),
('FullTimeGamer', 'pro@test.com', '$2b$12$hash', '76561197960435106', 'Always on.', true, 'DPS'),
('UniStudent', 'student@test.com', '$2b$12$hash', '76561197960435107', 'Gaming after lectures.', true, 'DPS'),
('LazyGamer', 'lazy@test.com', '$2b$12$hash', '76561197960435108', 'Casual vibes.', true, 'Tank'),
('User8', 'u8@test.com', '$2b$12$hash', '76561197960435109', 'Test user 8', true, 'Support'),
('User9', 'u9@test.com', '$2b$12$hash', '76561197960435110', 'Test user 9', true, 'Tank'),
('User10', 'u10@test.com', '$2b$12$hash', '76561197960435111', 'Test user 10', true, 'DPS'),
('User11', 'u11@test.com', '$2b$12$hash', '76561197960435112', 'Test user 11', true, 'DPS'),
('User12', 'u12@test.com', '$2b$12$hash', '76561197960435113', 'Test user 12', true, 'Support'),
('User13', 'u13@test.com', '$2b$12$hash', '76561197960435114', 'Test user 13', true, 'Support'),
('User14', 'u14@test.com', '$2b$12$hash', '76561197960435115', 'Test user 14', true, 'Tank'),
('User15', 'u15@test.com', '$2b$12$hash', '76561197960435116', 'Test user 15', true, 'DPS'),
('User16', 'u16@test.com', '$2b$12$hash', '76561197960435117', 'Test user 16', true, 'DPS'),
('User17', 'u17@test.com', '$2b$12$hash', '76561197960435118', 'Test user 17', true, 'Tank'),
('User18', 'u18@test.com', '$2b$12$hash', '76561197960435119', 'Test user 18', true, 'DPS'),
('User19', 'u19@test.com', '$2b$12$hash', '76561197960435120', 'Test user 19', true, 'Support'),
('User20', 'u20@test.com', '$2b$12$hash', '76561197960435121', 'Test user 20', true, 'Tank'),
('User21', 'u21@test.com', '$2b$12$hash', '76561197960435122', 'Test user 21', true, 'Support'),
('User22', 'u22@test.com', '$2b$12$hash', '76561197960435123', 'Test user 22', true, 'Tank');


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


-- Accepted Friendships (Existing)
INSERT INTO friends (user_id_1, user_id_2, status, action_user_id) VALUES 
(1, 2, 'accepted', NULL), 
(1, 6, 'accepted', NULL), 
(3, 4, 'accepted', NULL), 
(9, 10, 'accepted', NULL), 
(15, 16, 'accepted', NULL), 
(6, 7, 'accepted', NULL);

-- Pending Requests (Sent TO User 1 - LunaVibes)
-- Note: action_user_id is the person who CLICKED 'add', so f.action_user_id != 1
INSERT INTO friends (user_id_1, user_id_2, status, action_user_id) VALUES 
(1, 8, 'pending', 8),  -- LazyGamer (8) requested LunaVibes (1)
(1, 11, 'pending', 11); -- Zenith (11) requested LunaVibes (1)

-- Pending Request (Sent BY User 1 - LunaVibes)
-- Note: action_user_id is 1, so this will be hidden from LunaVibes' incoming list
INSERT INTO friends (user_id_1, user_id_2, status, action_user_id) VALUES 
(1, 22, 'pending', 1); -- LunaVibes (1) requested NovaStar (22)