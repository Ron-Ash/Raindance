`C`REATE OR REPLACE TABLE location(
    city   LowCardinality(String),
    country LowCardinality(String),
    latitude    Decimal32(6),
    longitude    Decimal32(6),
    bio String,
    imgPath LowCardinality(String),
)ENGINE = ReplacingMergeTree
ORDER BY (country, city)

CREATE OR REPLACE TABLE socialNetwork_chats(
    users   Array(String),
    topic   String DEFAULT generateUUIDv4()
)ENGINE = MergeTree
ORDER BY (users);

CREATE OR REPLACE TABLE socialNetwork_followers(
    user   LowCardinality(String),
    follows LowCardinality(String),
)ENGINE = MergeTree
ORDER BY (user);
-- INSERT INTO socialNetwork_followers VALUES ('D', 'A'), ('D', 'B'), ('B', 'C'), 
-- ('C', 'B'), ('E', 'B'), ('E', 'D'), ('E', 'F'), ('F', 'E'), ('F', 'B'), ('g', 'B'), ('h', 'B'), ('i', 'B'),
-- ('j', 'E'), ('k', 'E');

-- INSERT INTO socialNetwork_followers VALUES ('D', 'B'), ('B', 'C'), 
-- ('C', 'B'), ('E', 'B'), ('E', 'D'), ('E', 'F'), ('F', 'E'), ('F', 'B'), ('g', 'B'), ('h', 'B'), ('i', 'B'),
-- ('j', 'E'), ('k', 'E'), ('B', 'L'), ('i', 'L'), ('k', 'L'), ('L', 'C');
CREATE OR REPLACE TABLE socialNetwork_popularity(
    user   LowCardinality(String),
    rank Decimal32(9),
)ENGINE = ReplacingMergeTree
ORDER BY (user);