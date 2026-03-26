INSERT INTO users (
    username, email, password_hash, steam_id,
    description, is_verified, roles
) VALUES 
('LunaVibes', 'luna@test.com', '$2b$12$iyxGdsCmz0TqdyS9bkpGGuFN.GGDJ/Y8E2eDe8Y2t8/Zp4jqXLqEK', '76561197960435101', 'Late night sessions only.', true, 'DPS'),
('ShadowStep', 'shadow@test.com', '$2b$12$iyxGdsCmz0TqdyS9bkpGGuFN.GGDJ/Y8E2eDe8Y2t8/Zp4jqXLqEK', '76561197960435102', 'I thrive in the dark.', true, 'DPS'),
('AdminUser', 'king@test.com', '$2b$12$iyxGdsCmz0TqdyS9bkpGGuFN.GGDJ/Y8E2eDe8Y2t8/Zp4jqXLqEK', '76561197960435103', 'Work hard, play hard Saturday/Sunday.', true, 'Tank'),
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

-- create an Admin user
UPDATE users SET is_admin = true WHERE username = 'AdminUser';
