CREATE OR REPLACE TABLE socialNetwork_friendRecommendation(
    user LowCardinality(String),
    recommendations Array(LowCardinality(String)) DEFAULT []
)ENGINE = ReplacingMergeTree
ORDER BY (user);