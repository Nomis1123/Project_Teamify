-- 1. Ensure the game exists first
INSERT INTO games (title) 
VALUES ('Valorant') 
ON CONFLICT DO NOTHING;

-- 2. Update the user's availability
UPDATE users 
SET availability = '{"Monday": {"Evening": true}, "Saturday": {"Noon": true}}'::jsonb,
    is_verified = TRUE
WHERE username = '100TestUser';

-- 3. Link the user to the game (This won't fail now!)
INSERT INTO user_games (user_id, game_id, current_rank, is_main_game)
VALUES (
    (SELECT id FROM users WHERE username = '100TestUser'),
    (SELECT id FROM games WHERE title = 'Valorant'),
    'Gold III',
    true
) ON CONFLICT (user_id, game_id) DO UPDATE SET current_rank = 'Gold III';