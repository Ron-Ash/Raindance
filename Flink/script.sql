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