CREATE TABLE test (
    `time`  STRING,
    `interval`  INT,
    `temperature_2m` FLOAT,
    `relative_humidity_2m`  INT
) WITH (
    'connector'='kafka',
    'topic'='test-topic',
    'value.format'='json',
    'scan.startup.mode'='latest-offset',
    'properties.bootstrap.servers'='broker-1:19092,broker-2:19092,broker-3:19092'
);