CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    content TEXT,
    likes INT DEFAULT 0;
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO messages (username, content)
VALUES
('Olek', 'Hello world!'),
('Lyk', 'This is a seeded message.'),
('Yourname','Your message.');
