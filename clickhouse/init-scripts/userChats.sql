CREATE OR REPLACE TABLE socialNetwork_userChats(
    `users` Array(String),
    `topic` String DEFAULT generateUUIDv4()
)ENGINE = MergeTree
ORDER BY (`users`);