
-- ====================================================================
-- 👤 1. USERS TABLE (Authentication & Core Identity)
-- ====================================================================
CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    plan TEXT DEFAULT 'basic',
    message_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- ====================================================================
-- 🎨 2. PROFILES TABLE (User-Facing Metadata)
-- ====================================================================
CREATE TABLE IF NOT EXISTS profiles (
    user_id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
-- ====================================================================
-- 📁 3. CHAT ROOMS TABLE (Threads with Soft-Delete & Custom Prompts)
-- ====================================================================
CREATE TABLE IF NOT EXISTS chat_rooms (
    chat_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT DEFAULT 'New Chat',
    system_prompt TEXT DEFAULT NULL, -- Custom Gemini context overrides
    is_deleted INTEGER DEFAULT 0,    -- 0 = Active, 1 = Soft Deleted
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
-- ====================================================================
-- 💬 4. MESSAGES TABLE (Granular Conversation Logs)
-- ====================================================================
CREATE TABLE IF NOT EXISTS messages (
    message_id TEXT PRIMARY KEY,
    chat_id TEXT NOT NULL,
    role TEXT CHECK(role IN ('user', 'assistant')) NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chat_rooms(chat_id) ON DELETE CASCADE
);
-- ====================================================================
-- 👍 5. FEEDBACK TABLE (UX Tracking Associated With User)
-- ====================================================================
CREATE TABLE IF NOT EXISTS feedback (
    feedback_id TEXT PRIMARY KEY,
    message_id TEXT UNIQUE NOT NULL,
    user_id TEXT NOT NULL,
    rating TEXT CHECK(rating IN ('thumbs_up', 'thumbs_down')) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(message_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
-- ====================================================================
-- ⚡ 6. PERFORMANCE INDEXES
-- ====================================================================
-- Speeds up sidebar queries sorting active rooms by recent activity
CREATE INDEX IF NOT EXISTS idx_rooms_user_updated 
ON chat_rooms(user_id, is_deleted, updated_at DESC);
-- Speeds up conversation rendering by grouping chat logs chronologically
CREATE INDEX IF NOT EXISTS idx_messages_chat 
ON messages(chat_id, timestamp ASC);
-- ====================================================================
-- 🤖 7. AUTOMATIC TRIGGERS
-- ====================================================================
-- Automatically bumps 'updated_at' timestamp when a new message drops


CREATE TRIGGER IF NOT EXISTS auto_update_chat_room_time
AFTER INSERT ON messages
BEGIN
    UPDATE chat_rooms 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE chat_id = NEW.chat_id;
END;