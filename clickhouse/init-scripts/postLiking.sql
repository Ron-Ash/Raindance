CREATE OR REPLACE TABLE socialNetwork_postLikes(
    `user` LowCardinality(String),
    `postAuthor` LowCardinality(String),
    `postTime` DateTime,
    `eventTime` DateTime,
    `sign` Int8 DEFAULT 1
)ENGINE = CollapsingMergeTree(sign)
ORDER BY (`postAuthor`, `postTime`, `user`);

CREATE OR REPLACE TABLE socialNetwork_postLikingSystem_kafka(
    `postAuthor` LowCardinality(String),
    `postTime` DateTime
)ENGINE = Kafka(
   'broker-1:19092,broker-2:19092,broker-3:19092',
   'socialNetwork_postLiking',
   'clickhouse-socialNetwork_postLiking_kafka-consumer-group',
   'JSONEachRow'
);

CREATE MATERIALIZED VIEW socialNetwork_postLiking_materializedView TO socialNetwork_postLikes
AS  SELECT _key AS `user`, `postAuthor`, `postTime`, now() AS `eventTime`, 1 AS `sign` FROM socialNetwork_postLikingSystem_kafka;

CREATE OR REPLACE TABLE socialNetwork_postUnLikingSystem_kafka(
    `postAuthor` LowCardinality(String),
    `postTime` DateTime
)ENGINE = Kafka(
   'broker-1:19092,broker-2:19092,broker-3:19092',
   'socialNetwork_postUnLiking',
   'clickhouse-socialNetwork_postLiking_kafka-consumer-group',
   'JSONEachRow'
);

CREATE MATERIALIZED VIEW socialNetwork_postUnLiking_materializedView TO socialNetwork_postLikes
AS SELECT _key AS `user`, `postAuthor`, `postTime`, now() AS `eventTime`, -1 AS `sign` FROM socialNetwork_postUnLikingSystem_kafka;