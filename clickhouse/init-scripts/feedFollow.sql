CREATE OR REPLACE TABLE socialNetwork_followers(
    `user` LowCardinality(String),
    `follows` LowCardinality(String),
    `eventTime` DateTime DEFAULT now(),
    `sign` Int8 DEFAULT 1
)ENGINE = CollapsingMergeTree(sign)
ORDER BY (`user`, `follows`);

CREATE OR REPLACE TABLE socialNetwork_followSystem_kafka(
    `follows` LowCardinality(String)
)ENGINE = Kafka(
   'broker-1:19092,broker-2:19092,broker-3:19092',
   'socialNetwork_follow',
   'clickhouse-socialNetwork_followSystem_kafka-consumer-group',
   'JSONEachRow'
);

CREATE MATERIALIZED VIEW socialNetwork_followSystem_materializedView TO socialNetwork_followers
AS SELECT _key AS `user`, `follows`, now() AS `eventTime`, 1 AS `sign` FROM socialNetwork_followSystem_kafka;

CREATE OR REPLACE TABLE socialNetwork_unfollowSystem_kafka(
    `follows` LowCardinality(String)
)ENGINE = Kafka(
   'broker-1:19092,broker-2:19092,broker-3:19092',
   'socialNetwork_unfollow',
   'clickhouse-socialNetwork_unfollowSystem_kafka-consumer-group',
   'JSONEachRow'
);

CREATE MATERIALIZED VIEW socialNetwork_unfollowSystem_materializedView TO socialNetwork_followers
AS SELECT _key AS `user`, `follows`, now() AS `eventTime`, -1 AS `sign` FROM socialNetwork_unfollowSystem_kafka;

CREATE OR REPLACE TABLE socialNetwork_posts(
    `author` LowCardinality(String),
    `message` String,
    `attachmentPath` String,
    `eventTime` DateTime DEFAULT now(),
    `messageEmbedding` Array(Float32),
	`attachmentEmbedding` Array(Float32),
)ENGINE = MergeTree()
ORDER BY (`author`, `eventTime`);