INSERT INTO users (
    username, email, password_hash, steam_id,
    description, is_verified, roles
) VALUES 
('LunaVibes', 'luna@test.com', '$2b$12$iyxGdsCmz0TqdyS9bkpGGuFN.GGDJ/Y8E2eDe8Y2t8/Zp4jqXLqEK', '76561197960435101', 'Late night sessions only.', true, 'DPS'),
('ShadowStep', 'shadow@test.com', '$2b$12$iyxGdsCmz0TqdyS9bkpGGuFN.GGDJ/Y8E2eDe8Y2t8/Zp4jqXLqEK', '76561197960435102', 'I thrive in the dark.', true, 'DPS'),
('AdminUser', 'king@test.com', '$2b$12$iyxGdsCmz0TqdyS9bkpGGuFN.GGDJ/Y8E2eDe8Y2t8/Zp4jqXLqEK', '76561197960435103', 'Work hard, play hard Saturday/Sunday.', true, 'Tank'),

-- create an Admin user
UPDATE users SET is_admin = true WHERE username = 'AdminUser';
