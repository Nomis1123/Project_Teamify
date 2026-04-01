TRUNCATE users, games, user_games RESTART IDENTITY CASCADE;


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
('AdminUser', 'king@test.com', '$2b$12$iyxGdsCmz0TqdyS9bkpGGuFN.GGDJ/Y8E2eDe8Y2t8/Zp4jqXLqEK', '76561197960435103', 'Work hard, play hard Saturday/Sunday.', true, 'Tank'),
('OfficeWorker95', 'office@test.com', '$2b$12$hash', '76561197960435104', 'Free on weekends!', true, 'Support');

-- create an Admin user
UPDATE users SET is_admin = true WHERE username = 'AdminUser';

-- LunaVibes and ShadowStep (all evenings true)
UPDATE users
SET availability = 299593
WHERE username IN ('LunaVibes', 'ShadowStep');

-- WeekendKing and OfficeWorker95 (weekend full)
UPDATE users
SET availability = 63
WHERE username IN ('OfficeWorker95');

---- EarlyBird99 (weekdays mornings)
--UPDATE users
--SET availability = 1198336
--WHERE username = 'EarlyBird99';
--
---- FullTimeGamer (always available)
--UPDATE users
--SET availability = 2097151
--WHERE username = 'FullTimeGamer';


-- First 5 users: Diverse games with new standardized ranks
INSERT INTO user_games (user_id, game_id, current_rank) VALUES 
(1, (SELECT id FROM games WHERE title = 'PUBG'), 'Bronze 2'),
(2, (SELECT id FROM games WHERE title = 'PUBG'), 'Silver 4'),
(3, (SELECT id FROM games WHERE title = 'League'), 'Gold 1'),
(4, (SELECT id FROM games WHERE title = 'Minecraft'), 'Gold 5');
--(5, (SELECT id FROM games WHERE title = 'Apex Legends'), 'Platinum 3');

-- Users 6-8: Valorant - Diamond
--INSERT INTO user_games (user_id, game_id, current_rank)
--SELECT id, (SELECT id FROM games WHERE title = 'Valorant'), 'Diamond 2'
--FROM users
--WHERE id BETWEEN 6 AND 8;
--
---- Users 9-10: Valorant - Master
--INSERT INTO user_games (user_id, game_id, current_rank)
--SELECT id, (SELECT id FROM games WHERE title = 'Valorant'), 'Master'
--FROM users
--WHERE id BETWEEN 9 AND 10;
--
---- Users 11-12: Valorant - Silver
--INSERT INTO user_games (user_id, game_id, current_rank)
--SELECT id, (SELECT id FROM games WHERE title = 'Valorant'), 'Silver 3'
--FROM users
--WHERE id BETWEEN 11 AND 12;
--
---- Users 13-15: Valorant - Gold
--INSERT INTO user_games (user_id, game_id, current_rank)
--SELECT id, (SELECT id FROM games WHERE title = 'Valorant'), 'Gold 4'
--FROM users
--WHERE id BETWEEN 13 AND 15;
--
---- Users 16-22: Valorant - Platinum
--INSERT INTO user_games (user_id, game_id, current_rank)
--SELECT id, (SELECT id FROM games WHERE title = 'Valorant'), 'Platinum 1'
--FROM users
--WHERE id >= 16;


-- Accepted Friendships (Existing)
INSERT INTO friends (user_id_1, user_id_2, status, action_user_id) VALUES 
(1, 2, 'accepted', NULL);
--(1, 6, 'accepted', NULL), 
--(3, 4, 'accepted', NULL), 
--(9, 10, 'accepted', NULL), 
--(15, 16, 'accepted', NULL), 
--(6, 7, 'accepted', NULL);

-- Pending Requests (Sent TO User 1 - LunaVibes)
-- Note: action_user_id is the person who CLICKED 'add', so f.action_user_id != 1
--INSERT INTO friends (user_id_1, user_id_2, status, action_user_id) VALUES 
--(1, 8, 'pending', 8),  -- LazyGamer (8) requested LunaVibes (1)
--(1, 11, 'pending', 11); -- Zenith (11) requested LunaVibes (1)
--
---- Pending Request (Sent BY User 1 - LunaVibes)
---- Note: action_user_id is 1, so this will be hidden from LunaVibes' incoming list
--INSERT INTO friends (user_id_1, user_id_2, status, action_user_id) VALUES 
--(1, 22, 'pending', 1); -- LunaVibes (1) requested NovaStar (22)
