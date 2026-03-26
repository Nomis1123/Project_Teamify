INSERT INTO games (title, genre, developer) VALUES 
('Valorant', 'FPS', 'Riot Games'),
('PUBG', 'Battle Royale', 'Krafton'),
('League', 'MOBA', 'Riot Games'),
('Minecraft', 'Sandbox', 'Mojang'),
('Apex Legends', 'Battle Royale', 'Respawn');


INSERT INTO user_games (user_id, game_id, current_rank) VALUES 
(1, (SELECT id FROM games WHERE title = 'PUBG'), 'Bronze 2'),
(2, (SELECT id FROM games WHERE title = 'PUBG'), 'Silver 4');


