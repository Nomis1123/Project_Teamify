-- First 5 users: Diverse games with new standardized ranks
INSERT INTO user_games (user_id, game_id, current_rank) VALUES 
(1, (SELECT id FROM games WHERE title = 'PUBG'), 'Bronze 2'),
(2, (SELECT id FROM games WHERE title = 'PUBG'), 'Silver 4'),
(3, (SELECT id FROM games WHERE title = 'League of Legends'), 'Gold 1'),
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
