CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Highly Recommended Addition: Tracks if the recipient has seen it
    is_read BOOLEAN DEFAULT FALSE 
);

-- Index to quickly fetch the history of a specific chat room
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
