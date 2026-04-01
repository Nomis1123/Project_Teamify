CREATE TABLE friends (
    id SERIAL PRIMARY KEY,
    user_id_1 INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_id_2 INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'blocked'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure a user can't be friends with themselves
    CONSTRAINT check_not_self CHECK (user_id_1 != user_id_2),
    -- Ensure we don't have duplicate rows for the same pair (1-2 and 2-1)
    CONSTRAINT unique_friendship UNIQUE (user_id_1, user_id_2)
);

-- Index for faster lookups when checking a specific user's friend list
CREATE INDEX idx_friends_user_1 ON friends(user_id_1);
CREATE INDEX idx_friends_user_2 ON friends(user_id_2);
