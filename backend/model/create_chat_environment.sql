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

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,

    -- Highly Recommended Addition: Tracks if the recipient has seen it
    is_read BOOLEAN DEFAULT FALSE,
    is_edited BOOLEAN DEFAULT FALSE

);

-- Index to quickly fetch the history of a specific chat room
CREATE INDEX idx_messages_conversation ON messages(conversation_id);

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

INSERT INTO friends (user_id_1, user_id_2, status) VALUES 
(1, 2, 'accepted'),
(1, 3, 'accepted');
