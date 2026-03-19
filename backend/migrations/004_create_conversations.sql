CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    user1_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user2_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Crucial: Forces the smaller ID to always be user1_id. 
    -- This prevents duplicate rooms (e.g., Room A: 7 & 42, Room B: 42 & 7)
    CHECK (user1_id < user2_id),
    
    -- Crucial: Ensures these two specific users can only ever have ONE active chat history together
    UNIQUE (user1_id, user2_id)
);

-- Index to make finding a room between two users lightning fast
CREATE INDEX idx_conversations_users ON conversations(user1_id, user2_id);
