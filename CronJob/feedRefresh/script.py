from confluent_kafka import Consumer, KafkaError, KafkaException
from flink.flinkSqlGateway import FlinkSQLGateway
import clickhouse_connect
import pandas as pd
import sys
import re
import os

def retrieve_df(client, sql: str):
    print(sql)
    dfs_stream = client.query_df_stream(sql)
    dfs = []
    with dfs_stream:
        for df in dfs_stream:
            dfs.append(df)
    if len(dfs) <= 0:
        return None
    return pd.concat(dfs, ignore_index=True)

def generate_feedRefresh(client, user: str, sql: str):
    initialise = f"""CREATE OR REPLACE TABLE socialNetwork_feedRefresh_{user}(
                    `time`  STRING,
                    `author` STRING,
                    `message` STRING,
                    `attachmentPath` STRING
                )ENGINE = Kafka(
                    'broker-1:19092,broker-2:19092,broker-3:19092',
                    'socialNetwork_feedStream_{user}',
                    'clickhouse-socialNetwork_followSystem_kafka-consumer-group',
                    'JSONEachRow'
                );"""
    insert = f"INSERT INTO TABLE socialNetwork_feedRefresh_{user} {sql};"
    drop = f"DROP TABLE socialNetwork_feedRefresh_{user};"
    client.command(initialise)
    client.command(insert)
    client.command(drop)
    return True


def feed_pipeline_update(consumer: Consumer, client, flinkSqlGateway: FlinkSQLGateway):
    try:
        consumer.subscribe(['socialNetwork_feedRefresh'])
        while True:
            msg = consumer.poll(timeout=1.0)
            if msg is None: continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    sys.stderr.write(f'{msg.topic()} {msg.partition()} reached end at offset [{msg.offset()}]')
                raise KafkaException(msg.error())
            print("= START =========================")

            print(msg.value().decode(), msg.topic())
            if not (match := re.match(r'^\{"user":"(\S+)","feedType":"(\S+)","numberOfPosts":"(\d+)"\}$', msg.value().decode())):
                KafkaException("message format not correct")
            user, feedType, numberOfPosts = match.groups()
            if (df := retrieve_df(client, f'SELECT DISTINCT `user`, `follows` FROM socialNetwork_followers FINAL WHERE user = \'{user}\';')) is None:
                follows = []
            else:
                follows = list(df['follows'])
            # implementation of feed generation
            match feedType:
                case 'Followers':
                    sql = f"SELECT * FROM socialNetwork_postStorage WHERE `author` IN ({','.join(follows)}) LIMIT {int(numberOfPosts)}"
                case 'Recommended':
                    sql = 'SELECT "2025-01-01 00:00:00", "user1", "hello world", ""'
                case _:
                    KafkaException("unfamiliar feed type requested")
            generate_feedRefresh(client, user, sql)
            print("= END ===========================")
    finally:
        consumer.close()

if __name__ == "__main__":
    flinkSqlGateway = FlinkSQLGateway("localhost:8083","localhost:8081")
    client = clickhouse_connect.get_client(host=os.getenv("CLICKHOUSE_HOST", 'localhost'), port=8123, username=os.getenv("CLICKHOUSE_USER", 'user'), password=os.getenv("CLICKHOUSE_PASSWORD",'password'))
    consumer = Consumer({'bootstrap.servers': 'localhost:29092,localhost:39092,localhost:49092','group.id': 'feedCuration'})
    feed_pipeline_update(consumer, client, flinkSqlGateway)

# {"time":"A", "author":"user1", "message":"hello world", "attachmentPath":""}
# {"time":"B", "author":"user2", "message":"how are yo?", "attachmentPath":""}