CREATE TABLE games(
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) UNIQUE NOT NULL,
    thumbnail_url TEXT -- a string of thext that stores a link to an image file
);
