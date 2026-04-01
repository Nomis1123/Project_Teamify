-- 1. Ensure the game exists in the database first
-- (This ignores the insert if League of Legends already exists)
INSERT INTO games (title, genre, developer) 
VALUES ('League of Legends', 'MOBA', 'Riot Games')
ON CONFLICT (title) DO NOTHING;

-- 2. Insert the Roles
WITH target_game AS (
    SELECT id FROM games WHERE title = 'League of Legends'
)
INSERT INTO game_roles (game_id, name)
VALUES 
    ((SELECT id FROM target_game), 'Support'),
    ((SELECT id FROM target_game), 'DPS'),
    ((SELECT id FROM target_game), 'Tank');

-- 3. Insert the Ranks
WITH target_game AS (
    SELECT id FROM games WHERE title = 'League of Legends'
)
INSERT INTO game_ranks (game_id, name, tier_level)
VALUES 
    -- Bronze Tier
    ((SELECT id FROM target_game), 'Bronze 5', 1),
    ((SELECT id FROM target_game), 'Bronze 4', 2),
    ((SELECT id FROM target_game), 'Bronze 3', 3),
    ((SELECT id FROM target_game), 'Bronze 2', 4),
    ((SELECT id FROM target_game), 'Bronze 1', 5),

    -- Silver Tier
    ((SELECT id FROM target_game), 'Silver 5', 6),
    ((SELECT id FROM target_game), 'Silver 4', 7),
    ((SELECT id FROM target_game), 'Silver 3', 8),
    ((SELECT id FROM target_game), 'Silver 2', 9),
    ((SELECT id FROM target_game), 'Silver 1', 10),

    -- Gold Tier
    ((SELECT id FROM target_game), 'Gold 5', 11),
    ((SELECT id FROM target_game), 'Gold 4', 12),
    ((SELECT id FROM target_game), 'Gold 3', 13),
    ((SELECT id FROM target_game), 'Gold 2', 14),
    ((SELECT id FROM target_game), 'Gold 1', 15),

    -- Platinum Tier
    ((SELECT id FROM target_game), 'Platinum 5', 16),
    ((SELECT id FROM target_game), 'Platinum 4', 17),
    ((SELECT id FROM target_game), 'Platinum 3', 18),
    ((SELECT id FROM target_game), 'Platinum 2', 19),
    ((SELECT id FROM target_game), 'Platinum 1', 20),

    -- Diamond Tier
    ((SELECT id FROM target_game), 'Diamond 5', 21),
    ((SELECT id FROM target_game), 'Diamond 4', 22),
    ((SELECT id FROM target_game), 'Diamond 3', 23),
    ((SELECT id FROM target_game), 'Diamond 2', 24),
    ((SELECT id FROM target_game), 'Diamond 1', 25),

    -- Master Tier
    ((SELECT id FROM target_game), 'Master', 26);

-- Insert Game
INSERT INTO games (title, genre, developer) VALUES ('Apex Legends', 'Battle Royale', 'Respawn Entertainment') ON CONFLICT (title) DO NOTHING;

-- Roles (Classes)
WITH target_game AS (SELECT id FROM games WHERE title = 'Apex Legends')
INSERT INTO game_roles (game_id, name) VALUES 
    ((SELECT id FROM target_game), 'Assault'),
    ((SELECT id FROM target_game), 'Skirmisher'),
    ((SELECT id FROM target_game), 'Recon'),
    ((SELECT id FROM target_game), 'Controller'),
    ((SELECT id FROM target_game), 'Support');

-- Ranks
WITH target_game AS (SELECT id FROM games WHERE title = 'Apex Legends')
INSERT INTO game_ranks (game_id, name, tier_level) VALUES 
    ((SELECT id FROM target_game), 'Rookie 4', 1), ((SELECT id FROM target_game), 'Rookie 3', 2), ((SELECT id FROM target_game), 'Rookie 2', 3), ((SELECT id FROM target_game), 'Rookie 1', 4),
    ((SELECT id FROM target_game), 'Bronze 4', 5), ((SELECT id FROM target_game), 'Bronze 3', 6), ((SELECT id FROM target_game), 'Bronze 2', 7), ((SELECT id FROM target_game), 'Bronze 1', 8),
    ((SELECT id FROM target_game), 'Silver 4', 9), ((SELECT id FROM target_game), 'Silver 3', 10), ((SELECT id FROM target_game), 'Silver 2', 11), ((SELECT id FROM target_game), 'Silver 1', 12),
    ((SELECT id FROM target_game), 'Gold 4', 13), ((SELECT id FROM target_game), 'Gold 3', 14), ((SELECT id FROM target_game), 'Gold 2', 15), ((SELECT id FROM target_game), 'Gold 1', 16),
    ((SELECT id FROM target_game), 'Platinum 4', 17), ((SELECT id FROM target_game), 'Platinum 3', 18), ((SELECT id FROM target_game), 'Platinum 2', 19), ((SELECT id FROM target_game), 'Platinum 1', 20),
    ((SELECT id FROM target_game), 'Diamond 4', 21), ((SELECT id FROM target_game), 'Diamond 3', 22), ((SELECT id FROM target_game), 'Diamond 2', 23), ((SELECT id FROM target_game), 'Diamond 1', 24),
    ((SELECT id FROM target_game), 'Master', 25),
    ((SELECT id FROM target_game), 'Apex Predator', 26);

-- Insert Game
INSERT INTO games (title, genre, developer) VALUES ('Valorant', 'Tactical FPS', 'Riot Games') ON CONFLICT (title) DO NOTHING;

-- Roles
WITH target_game AS (SELECT id FROM games WHERE title = 'Valorant')
INSERT INTO game_roles (game_id, name) VALUES 
    ((SELECT id FROM target_game), 'Duelist'),
    ((SELECT id FROM target_game), 'Initiator'),
    ((SELECT id FROM target_game), 'Controller'),
    ((SELECT id FROM target_game), 'Sentinel');

-- Ranks
WITH target_game AS (SELECT id FROM games WHERE title = 'Valorant')
INSERT INTO game_ranks (game_id, name, tier_level) VALUES 
    ((SELECT id FROM target_game), 'Iron 1', 1), ((SELECT id FROM target_game), 'Iron 2', 2), ((SELECT id FROM target_game), 'Iron 3', 3),
    ((SELECT id FROM target_game), 'Bronze 1', 4), ((SELECT id FROM target_game), 'Bronze 2', 5), ((SELECT id FROM target_game), 'Bronze 3', 6),
    ((SELECT id FROM target_game), 'Silver 1', 7), ((SELECT id FROM target_game), 'Silver 2', 8), ((SELECT id FROM target_game), 'Silver 3', 9),
    ((SELECT id FROM target_game), 'Gold 1', 10), ((SELECT id FROM target_game), 'Gold 2', 11), ((SELECT id FROM target_game), 'Gold 3', 12),
    ((SELECT id FROM target_game), 'Platinum 1', 13), ((SELECT id FROM target_game), 'Platinum 2', 14), ((SELECT id FROM target_game), 'Platinum 3', 15),
    ((SELECT id FROM target_game), 'Diamond 1', 16), ((SELECT id FROM target_game), 'Diamond 2', 17), ((SELECT id FROM target_game), 'Diamond 3', 18),
    ((SELECT id FROM target_game), 'Ascendant 1', 19), ((SELECT id FROM target_game), 'Ascendant 2', 20), ((SELECT id FROM target_game), 'Ascendant 3', 21),
    ((SELECT id FROM target_game), 'Immortal 1', 22), ((SELECT id FROM target_game), 'Immortal 2', 23), ((SELECT id FROM target_game), 'Immortal 3', 24),
    ((SELECT id FROM target_game), 'Radiant', 25);
-- Insert Game
INSERT INTO games (title, genre, developer) VALUES ('PUBG', 'Battle Royale', 'Krafton') ON CONFLICT (title) DO NOTHING;

-- Roles (Community Squad Roles)
WITH target_game AS (SELECT id FROM games WHERE title = 'PUBG')
INSERT INTO game_roles (game_id, name) VALUES 
    ((SELECT id FROM target_game), 'IGL (In-Game Leader)'),
    ((SELECT id FROM target_game), 'Fragger'),
    ((SELECT id FROM target_game), 'Support'),
    ((SELECT id FROM target_game), 'Sniper');

-- Ranks
WITH target_game AS (SELECT id FROM games WHERE title = 'PUBG')
INSERT INTO game_ranks (game_id, name, tier_level) VALUES 
    ((SELECT id FROM target_game), 'Bronze 5', 1), ((SELECT id FROM target_game), 'Bronze 4', 2), ((SELECT id FROM target_game), 'Bronze 3', 3), ((SELECT id FROM target_game), 'Bronze 2', 4), ((SELECT id FROM target_game), 'Bronze 1', 5),
    ((SELECT id FROM target_game), 'Silver 5', 6), ((SELECT id FROM target_game), 'Silver 4', 7), ((SELECT id FROM target_game), 'Silver 3', 8), ((SELECT id FROM target_game), 'Silver 2', 9), ((SELECT id FROM target_game), 'Silver 1', 10),
    ((SELECT id FROM target_game), 'Gold 5', 11), ((SELECT id FROM target_game), 'Gold 4', 12), ((SELECT id FROM target_game), 'Gold 3', 13), ((SELECT id FROM target_game), 'Gold 2', 14), ((SELECT id FROM target_game), 'Gold 1', 15),
    ((SELECT id FROM target_game), 'Platinum 5', 16), ((SELECT id FROM target_game), 'Platinum 4', 17), ((SELECT id FROM target_game), 'Platinum 3', 18), ((SELECT id FROM target_game), 'Platinum 2', 19), ((SELECT id FROM target_game), 'Platinum 1', 20),
    ((SELECT id FROM target_game), 'Diamond 5', 21), ((SELECT id FROM target_game), 'Diamond 4', 22), ((SELECT id FROM target_game), 'Diamond 3', 23), ((SELECT id FROM target_game), 'Diamond 2', 24), ((SELECT id FROM target_game), 'Diamond 1', 25),
    ((SELECT id FROM target_game), 'Master', 26);

-- Insert Game
INSERT INTO games (title, genre, developer) VALUES ('Minecraft', 'Sandbox', 'Mojang') ON CONFLICT (title) DO NOTHING;

-- Roles (Playstyles)
WITH target_game AS (SELECT id FROM games WHERE title = 'Minecraft')
INSERT INTO game_roles (game_id, name) VALUES 
    ((SELECT id FROM target_game), 'Builder'),
    ((SELECT id FROM target_game), 'Miner/Gatherer'),
    ((SELECT id FROM target_game), 'Redstoner'),
    ((SELECT id FROM target_game), 'PvPer'),
    ((SELECT id FROM target_game), 'Explorer');

-- Ranks (Experience/Commitment Levels)
WITH target_game AS (SELECT id FROM games WHERE title = 'Minecraft')
INSERT INTO game_ranks (game_id, name, tier_level) VALUES 
    ((SELECT id FROM target_game), 'Casual/Beginner', 1),
    ((SELECT id FROM target_game), 'Regular Player', 2),
    ((SELECT id FROM target_game), 'Veteran', 3),
    ((SELECT id FROM target_game), 'Hardcore/Expert', 4);

-- Insert Game
INSERT INTO games (title, genre, developer) VALUES ('Team Fortress 2', 'Hero Shooter', 'Valve') ON CONFLICT (title) DO NOTHING;

-- Roles (The 9 Classes)
WITH target_game AS (SELECT id FROM games WHERE title = 'Team Fortress 2')
INSERT INTO game_roles (game_id, name) VALUES 
    ((SELECT id FROM target_game), 'Scout'),
    ((SELECT id FROM target_game), 'Soldier'),
    ((SELECT id FROM target_game), 'Pyro'),
    ((SELECT id FROM target_game), 'Demoman'),
    ((SELECT id FROM target_game), 'Heavy'),
    ((SELECT id FROM target_game), 'Engineer'),
    ((SELECT id FROM target_game), 'Medic'),
    ((SELECT id FROM target_game), 'Sniper'),
    ((SELECT id FROM target_game), 'Spy');

-- Ranks (Official TF2 Matchmaking Tiers)
WITH target_game AS (SELECT id FROM games WHERE title = 'Team Fortress 2')
INSERT INTO game_ranks (game_id, name, tier_level) VALUES 
    ((SELECT id FROM target_game), 'Fresh Meat', 1),
    ((SELECT id FROM target_game), 'Trouble Maker', 2),
    ((SELECT id FROM target_game), 'Rulebreaker', 3),
    ((SELECT id FROM target_game), 'Local Enforcer', 4),
    ((SELECT id FROM target_game), 'Hustler', 5),
    ((SELECT id FROM target_game), 'Mercenary', 6),
    ((SELECT id FROM target_game), 'Contract Killer', 7),
    ((SELECT id FROM target_game), 'Assassin', 8),
    ((SELECT id FROM target_game), 'Elite Mercenary', 9),
    ((SELECT id FROM target_game), 'Local Hero', 10),
    ((SELECT id FROM target_game), 'Specialist', 11),
    ((SELECT id FROM target_game), 'Expert Assassin', 12),
    ((SELECT id FROM target_game), 'High Roller', 13),
    ((SELECT id FROM target_game), 'Executioner', 14),
    ((SELECT id FROM target_game), 'Vanguard', 15),
    ((SELECT id FROM target_game), 'Elite Vanguard', 16),
    ((SELECT id FROM target_game), 'Brawler', 17),
    ((SELECT id FROM target_game), 'Death Merchant', 18);
