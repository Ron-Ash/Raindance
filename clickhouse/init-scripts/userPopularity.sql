CREATE OR REPLACE TABLE socialNetwork_userPopularity(
    user LowCardinality(String),
    rank Decimal32(9),
)ENGINE = ReplacingMergeTree
ORDER BY (user);