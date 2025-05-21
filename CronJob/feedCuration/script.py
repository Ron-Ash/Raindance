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

def generate_link(user: str, postStreams: list[str], flinkSqlGateway: FlinkSQLGateway):
    feedSink = {"statement": f"""
                CREATE TABLE feedSink (
                    `time`  STRING,
                    `author` STRING,
                    `message` STRING,
                    `attachmentPath` STRING
                ) WITH (
                    'connector' = 'kafka',
                    'topic' = '{';'.join(list(postStreams))}',
                    'value.format' = 'json',
                    'scan.startup.mode' = 'latest-offset',
                    'properties.bootstrap.servers' = 'broker-1:19092,broker-2:19092,broker-3:19092'
                )"""}
    print(feedSink)
    feedStream = {"statement": f"""
                CREATE TABLE feedStream (
                    `time`  STRING,
                    `author` STRING,
                    `message` STRING,
                    `attachmentPath` STRING
                ) WITH (
                    'connector' = 'kafka',
                    'topic' = 'socialNetwork_feedStream_{user}',
                    'value.format' = 'json',
                    'scan.startup.mode' = 'latest-offset',
                    'properties.bootstrap.servers' = 'broker-1:19092,broker-2:19092,broker-3:19092'
                )"""}
    feedLink = {"statement": "INSERT INTO feedStream SELECT * FROM feedSink"}
    flinkSqlGateway.send_operation({"statement": "DROP TABLE IF EXISTS feedSink"}, 0)
    flinkSqlGateway.send_operation({"statement": "DROP TABLE IF EXISTS feedStream"}, 0)
    flinkSqlGateway.send_operation(feedSink, 0)
    flinkSqlGateway.send_operation(feedStream, 0)
    op, newJobs = flinkSqlGateway.send_operation(feedLink, 1)
    if len(newJobs) <= 0 :
        while True:
            print(".", end="")
            flinkSqlGateway.rwlock.acquire_read()
            jobs = flinkSqlGateway.get_jobs()
            if len(set(jobs.keys()) - set(flinkSqlGateway.jobs.keys())) > 0:
                flinkSqlGateway.rwlock.release_read()
                newJobs = flinkSqlGateway.update_jobs()
                break
            flinkSqlGateway.rwlock.release_read()
    return newJobs

def initilise_pipes(flinkSqlGateway: FlinkSQLGateway, client):
    jobs = []
    print(flinkSqlGateway.get_jobs())
    for job, status in flinkSqlGateway.get_jobs().items():
        if status == "RUNNING":
            jobs.append(job)
    flinkSqlGateway.drop_jobs(jobs)
    if len(df := retrieve_df(client, f'SELECT DISTINCT `user` AS `user` FROM socialNetwork_followers FINAL;')) > 0:
        for user in df['user']:
            postStreams = list(set("socialNetwork_postStream_" + retrieve_df(client, f'SELECT user, follows FROM socialNetwork_followers FINAL WHERE user = \'{user}\';')['follows']))
            newJobs = generate_link(user, postStreams, flinkSqlGateway)
            client.query(f"INSERT INTO socialNetwork_feedJobs (`user`, `jobid`) VALUES ('{user}','{newJobs[0]}')")




def feed_pipeline_update(consumer: Consumer, client, flinkSqlGateway: FlinkSQLGateway):
    try:
        consumer.subscribe(['socialNetwork_follow', 'socialNetwork_unfollow'])
        while True:
            msg = consumer.poll(timeout=1.0)
            if msg is None: continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    sys.stderr.write(f'{msg.topic()} {msg.partition()} reached end at offset [{msg.offset()}]')
                raise KafkaException(msg.error())
            print("= START =========================")

            print(msg.value().decode(), msg.topic())
            if not (match := re.match(r'^\{"user":"(\S+)","follows":"(\S+)"\}$', msg.value().decode())):
                KafkaException("message format not correct")
            user, follow = match.groups()
            if (df := retrieve_df(client, f'SELECT `user`, `follows` FROM socialNetwork_followers FINAL WHERE user = \'{user}\';')) is None:
                postStreams = set()
            else:
                postStreams = set("socialNetwork_postStream_" + df['follows'])
            print(postStreams)
            match msg.topic():
                case 'socialNetwork_follow':
                    postStreams.add(f"socialNetwork_postStream_{follow}")
                case 'socialNetwork_unfollow':
                    postStreams.discard(f"socialNetwork_postStream_{follow}")
                case _:
                    KafkaException("message from unfamiliar topic")
            newJobs = generate_link(user, postStreams, flinkSqlGateway)
            print(newJobs)
            if (df := retrieve_df(client, f'SELECT * FROM socialNetwork_feedJobs FINAL WHERE user = \'{user}\';')) is not None:
                flinkSqlGateway.drop_jobs(list(df['jobid']))
            client.query(f"INSERT INTO socialNetwork_feedJobs (`user`, `jobid`) VALUES ('{user}','{newJobs[0]}')")
            print("= END ===========================")
    finally:
        consumer.close()

if __name__ == "__main__":
    flinkSqlGateway = FlinkSQLGateway("localhost:8083","localhost:8081")
    client = clickhouse_connect.get_client(host=os.getenv("CLICKHOUSE_HOST", 'localhost'), port=8123, username=os.getenv("CLICKHOUSE_USER", 'user'), password=os.getenv("CLICKHOUSE_PASSWORD",'password'))
    consumer = Consumer({'bootstrap.servers': 'localhost:29092,localhost:39092,localhost:49092','group.id': 'feedCuration'})
    initilise_pipes(flinkSqlGateway, client)
    feed_pipeline_update(consumer, client, flinkSqlGateway)


# {"time":"A", "author":"user1", "message":"hello world", "attachmentPath":""}
# {"time":"B", "author":"user2", "message":"how are yo?", "attachmentPath":""}