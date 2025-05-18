CREATE TABLE bets_stats (
    `time`  STRING,
    `location` STRING,
    `version` INT,
    `for_percentage`  FLOAT
) WITH (
    'connector'='kafka',
    'topic'='bets_stats-topic',
    'value.format'='json',
    'scan.startup.mode'='latest-offset',
    'properties.bootstrap.servers'='broker-1:19092,broker-2:19092,broker-3:19092'
);

CREATE TABLE bets (
    `time`  STRING,
    `location` STRING,
    `version` INT,
    `for`  BOOLEAN,
    `count`  INT
) WITH (
    'connector'='kafka',
    'topic'='bets-topic',
    'value.format'='json',
    'scan.startup.mode'='latest-offset',
    'properties.bootstrap.servers'='broker-1:19092,broker-2:19092,broker-3:19092'
);

SELECT `location`,`version`,`for`,SUM(`count`) FROM bets GROUP BY `location`,`version`,`for`;

-- {"time":"a", "location":"A", "version":0, "for":true, "count":5}
-- {"time":"b", "location":"A", "version":0, "for":true, "count":5}
-- {"time":"a", "location":"A", "version":0, "for":false, "count":6}


CREATE OR REPLACE TABLE unfollow (
    `B`  STRING
) WITH (
    'connector'='kafka',
    'topic'='socialNetwork_unfollow',
    'value.format'='json',
    'scan.startup.mode'='latest-offset',
    'properties.bootstrap.servers'='broker-1:19092,broker-2:19092,broker-3:19092'
);

CREATE OR REPLACE TABLE follow (`A`  STRING
) WITH (
    'connector'='kafka',
    'topic'='socialNetwork_follow',
    'value.format'='json',
    'scan.startup.mode'='latest-offset',
    'properties.bootstrap.servers'='broker-1:19092,broker-2:19092,broker-3:19092'
);

curl --request POST http://localhost:8083/v1/sessions
curl --request POST http://localhost:8083/v1/sessions/3a22f77c-024e-482b-b7ed-8f5ce18b044d/statements/ -H "Content-Type: application/json" -d "{\"statement\":\"CREATE OR REPLACE TABLE follow (\`A\`  STRING) WITH ( 'connector'='kafka', 'topic'='socialNetwork_follow','value.format'='json','scan.startup.mode'='latest-offset','properties.bootstrap.servers'='broker-1:19092,broker-2:19092,broker-3:19092');\"}"
curl --request POST http://localhost:8083/v1/sessions/3a22f77c-024e-482b-b7ed-8f5ce18b044d/statements/ -H "Content-Type: application/json" -d "{\"statement\":\"CREATE OR REPLACE TABLE unfollow (\`B\`  STRING) WITH ( 'connector'='kafka', 'topic'='socialNetwork_unfollow','value.format'='json','scan.startup.mode'='latest-offset','properties.bootstrap.servers'='broker-1:19092,broker-2:19092,broker-3:19092');\"}"
curl --request POST http://localhost:8083/v1/sessions/3a22f77c-024e-482b-b7ed-8f5ce18b044d/statements/ -H "Content-Type: application/json" -d "{\"statement\":\"INSERT INTO follow SELECT * FROM unfollow;\"}"

CREATE OR REPLACE TABLE socialNetwork_feedSink_user1 (
    `time`  STRING,
    `author` STRING,
    `message` STRING,
    `attachmentPath` STRING
) WITH (
    'connector'='kafka',
    'topic'='socialNetwork_postStream_user1;socialNetwork_postStream_user2',
    'value.format'='json',
    'scan.startup.mode'='latest-offset',
    'properties.bootstrap.servers'='broker-1:19092,broker-2:19092,broker-3:19092'
);

CREATE OR REPLACE TABLE socialNetwork_feedStream_user1 (
    `time`  STRING,
    `author` STRING,
    `message` STRING,
    `attachmentPath` STRING
) WITH (
    'connector'='kafka',
    'topic'='socialNetwork_feedStream_user1',
    'value.format'='json',
    'scan.startup.mode'='latest-offset',
    'properties.bootstrap.servers'='broker-1:19092,broker-2:19092,broker-3:19092'
);

INSERT INTO socialNetwork_feedStream_user1 SELECT * FROM socialNetwork_feedSink_user1;
-- {"time":"2025-01-01 00:00:00", "author":"user1", "message":"hello world", "attachmentPath":""}