CREATE OR REPLACE TABLE socialNetwork_followers (
    `user` STRING,
    `follows` STRING,
    `eventTime` TIMESTAMP(3),
    `sign` INT,
    PRIMARY KEY (`user`, `follows`) NOT ENFORCED,
    WATERMARK FOR `eventTime` AS `eventTime`
) WITH (
    'connector'='upsert-kafka',
    'topic'='socialNetwork_followers',
    'key.format'='json',
    'value.format'='json',
    'value.fields-include'='EXCEPT_KEY',
    'properties.bootstrap.servers'='broker-1:19092,broker-2:19092,broker-3:19092'
);

CREATE OR REPLACE TABLE socialNetwork_follow (
    `user` STRING,
    `follows` STRING
) WITH (
    'connector'='kafka',
    'topic'='socialNetwork_follow',
    'key.format'='raw',
    'key.fields'='user',
    'value.format'='json',
    'value.fields-include'='EXCEPT_KEY',
    'scan.startup.mode'='latest-offset',
    'properties.bootstrap.servers'='broker-1:19092,broker-2:19092,broker-3:19092'
);

INSERT INTO socialNetwork_followers SELECT follow.`user` AS `user`, follow.`follows` AS `follows`, NOW() AS `eventTime`, 1 AS `sign` FROM socialNetwork_follow AS follow;

CREATE OR REPLACE TABLE socialNetwork_unfollow (
    `user` STRING,
    `follows` STRING
) WITH (
    'connector'='kafka',
    'topic'='socialNetwork_unfollow',
    'key.format'='raw',
    'key.fields'='user',
    'value.format'='json',
    'value.fields-include' = 'EXCEPT_KEY',
    'scan.startup.mode'='latest-offset',
    'properties.bootstrap.servers'='broker-1:19092,broker-2:19092,broker-3:19092'
);

INSERT INTO socialNetwork_followers SELECT unfollow.`user` `user`, unfollow.`follows` `follows`, NOW() AS `eventTime`, -1 AS `sign` FROM socialNetwork_unfollow AS unfollow;

CREATE OR REPLACE TABLE socialNetwork_postStream (
    `author` STRING,
    `message` STRING,
    `attachmentPath` STRING
) WITH (
    'connector'='kafka',
    'topic'='socialNetwork_postStream',
    'key.format'='raw',
    'key.fields'='author',
    'value.format'='json',
    'value.fields-include' = 'EXCEPT_KEY',
    'scan.startup.mode'='latest-offset',
    'properties.bootstrap.servers'='broker-1:19092,broker-2:19092,broker-3:19092'
);

CREATE OR REPLACE TABLE socialNetwork_feedStream (
    `recipient` STRING,
    `author` STRING,
    `eventTime`  TIMESTAMP(3),
    `message` STRING,
    `attachmentPath` STRING,
    PRIMARY KEY (`recipient`, `author`, `eventTime`) NOT ENFORCED,
    WATERMARK FOR `eventTime` AS `eventTime`
) WITH (
    'connector'='upsert-kafka',
    'topic'='socialNetwork_feedStream',
    'key.format'='json',
    'value.format'='json',
    'value.fields-include' = 'EXCEPT_KEY',
    'properties.bootstrap.servers'='broker-1:19092,broker-2:19092,broker-3:19092'
);

INSERT INTO socialNetwork_feedStream (
    SELECT followers.`user` AS `recipient`, posts.`author` AS `author`, NOW() AS `time`, posts.`message` AS `message`, posts.`attachmentPath` AS `attachmentPath` FROM socialNetwork_postStream AS posts
    INNER JOIN socialNetwork_followers AS followers ON posts.`author` = followers.`follows`
    WHERE followers.`sign`= 1
);