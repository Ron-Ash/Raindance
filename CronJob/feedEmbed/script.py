from confluent_kafka import Consumer, KafkaError, KafkaException
import clickhouse_connect
import pandas as pd
import sys
import re
import os

def feed_Embedding_pipeline_update(consumer: Consumer, client):
    try:
        consumer.subscribe(['socialNetwork_postStream_.*'])
        while True:
            msg = consumer.poll(timeout=1.0)
            if msg is None: continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    sys.stderr.write(f'{msg.topic()} {msg.partition()} reached end at offset [{msg.offset()}]')
                raise KafkaException(msg.error())
            print("= START =========================")

            print(msg.value().decode(), msg.topic())
            if not (match := re.match(r'^\{"time":"(\S+)","author":"(\S+)","message":"(\S+)","attachmentPath":"(\S+)"\}$', msg.value().decode())):
                KafkaException("message format not correct")
            time, author, message, attachmentPath = match.groups()
            client.query(f"INSERT INTO socialNetwork_postStorage (`time`, `author`, `message`, `attachmentPath`) VALUES ('{time}','{author}','{message}','{attachmentPath}')")
            print("= END ===========================")
    finally:
        consumer.close()

if __name__ == "__main__":
    client = clickhouse_connect.get_client(host=os.getenv("CLICKHOUSE_HOST", 'localhost'), port=8123, username=os.getenv("CLICKHOUSE_USER", 'user'), password=os.getenv("CLICKHOUSE_PASSWORD",'password'))
    consumer = Consumer({'bootstrap.servers': 'localhost:29092,localhost:39092,localhost:49092','group.id': 'feedCuration'})
    feed_Embedding_pipeline_update(consumer, client)