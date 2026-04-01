CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    steam_id VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    profile_picture_url TEXT DEFAULT 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
    description VARCHAR(500),
    sub_class VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    roles VARCHAR(100) DEFAULT 'Any',
    availability INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
