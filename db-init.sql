-- Run this in your Neon PostgreSQL SQL editor

CREATE TABLE IF NOT EXISTS Users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Study_Topics (
    topic_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Study_Plan (
    plan_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id),
    date DATE NOT NULL,
    schedule_json JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Progress (
    progress_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id),
    topic_id INTEGER REFERENCES Study_Topics(topic_id),
    completed BOOLEAN DEFAULT FALSE,
    time_spent INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a default user for testing
INSERT INTO Users (name, email) VALUES ('Demo Student', 'student@example.com') ON CONFLICT (email) DO NOTHING;
