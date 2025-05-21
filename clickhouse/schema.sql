CREATE OR REPLACE TABLE location(
    `city` LowCardinality(String),
    `country` LowCardinality(String),
    `latitude` Decimal32(6),
    `longitude` Decimal32(6),
    `bio` String,
    `imgPath` LowCardinality(String),
)ENGINE = ReplacingMergeTree
ORDER BY (country, city)

CREATE OR REPLACE TABLE socialNetwork_chats(
    `users` Array(String),
    `topic` String DEFAULT generateUUIDv4()
)ENGINE = MergeTree
ORDER BY (users);


----------------------------------------------
----------------------------------------------

CREATE OR REPLACE TABLE socialNetwork_followers(
    `user` LowCardinality(String),
    `follows` LowCardinality(String),
    `event_time` DateTime DEFAULT now(),
    `sign` Int8 DEFAULT 1
)ENGINE = CollapsingMergeTree(sign)
ORDER BY (`user`, `follows`);

CREATE OR REPLACE TABLE socialNetwork_followSystem_kafka(
    `user` LowCardinality(String),
    `follows` LowCardinality(String)
)ENGINE = Kafka(
   'broker-1:19092,broker-2:19092,broker-3:19092',
   'socialNetwork_follow',
   'clickhouse-socialNetwork_followSystem_kafka-consumer-group',
   'JSONEachRow'
);

CREATE MATERIALIZED VIEW socialNetwork_followSystem_materializedView TO socialNetwork_followers
AS SELECT `user`, `follows`, now() AS `event_time`, 1 AS `sign` FROM socialNetwork_followSystem_kafka;

CREATE OR REPLACE TABLE socialNetwork_unfollowSystem_kafka(
    `user` LowCardinality(String),
    `follows` LowCardinality(String)
)ENGINE = Kafka(
   'broker-1:19092,broker-2:19092,broker-3:19092',
   'socialNetwork_unfollow',
   'clickhouse-socialNetwork_unfollowSystem_kafka-consumer-group',
   'JSONEachRow'
);

CREATE MATERIALIZED VIEW socialNetwork_unfollowSystem_materializedView TO socialNetwork_followers
AS SELECT `user`, `follows`, now() AS `event_time`, -1 AS `sign` FROM socialNetwork_unfollowSystem_kafka;

CREATE OR REPLACE TABLE socialNetwork_feedJobs(
    user LowCardinality(String),
    jobid String,
    event_time DateTime DEFAULT now()
)ENGINE = ReplacingMergeTree
ORDER BY (user);

-- INSERT INTO socialNetwork_followers (user, follows) VALUES ('D', 'A'), ('D', 'B'), ('B', 'C'), 
-- ('C', 'B'), ('E', 'B'), ('E', 'D'), ('E', 'F'), ('F', 'E'), ('F', 'B'), ('g', 'B'), ('h', 'B'), ('i', 'B'),
-- ('j', 'E'), ('k', 'E');

-- INSERT INTO socialNetwork_followers (user, follows) VALUES ('D', 'B'), ('B', 'C'), 
-- ('C', 'B'), ('E', 'B'), ('E', 'D'), ('E', 'F'), ('F', 'E'), ('F', 'B'), ('g', 'B'), ('h', 'B'), ('i', 'B'),
-- ('j', 'E'), ('k', 'E'), ('B', 'L'), ('i', 'L'), ('k', 'L'), ('L', 'C');
CREATE OR REPLACE TABLE socialNetwork_userPopularity(
    user LowCardinality(String),
    rank Decimal32(9),
)ENGINE = ReplacingMergeTree
ORDER BY (user);

CREATE OR REPLACE TABLE socialNetwork_friendRecommendation(
    user LowCardinality(String),
    recommendations Array(LowCardinality(String)) DEFAULT []
)ENGINE = ReplacingMergeTree
ORDER BY (user);