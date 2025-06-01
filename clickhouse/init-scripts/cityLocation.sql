CREATE OR REPLACE TABLE worldMap_cityLocation(
    `city` LowCardinality(String),
    `country` LowCardinality(String),
    `latitude` Decimal32(6),
    `longitude` Decimal32(6),
    `bio` String,
    `imgPath` LowCardinality(String),
)ENGINE = ReplacingMergeTree
ORDER BY (`country`, `city`);