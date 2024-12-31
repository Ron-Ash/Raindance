import os
import requests
import datetime
from confluent_kafka import Producer
# https://developer.confluent.io/get-started/python/#build-producer

def delivery_report(err, msg):
    if err is not None:
        print(f"Message delivery failed: {err}")
    else:
        print(f"Message delivered to {msg.topic()} [{msg.partition()}]")

def main():
    now = datetime.datetime.now()
    if (url := os.getenv("CURL_URL")) is None:
        raise Exception('environment variable "CURL_URL" is not set')
    if (name := os.getenv("NAME")) is None:
        raise Exception('environment variable "NAME" is not set')
    print(f'{name} executing at {now}', flush=True)

    result = requests.get(url)
    if (data := result.json().get("current", None)) is None:
        raise Exception(f'{name}: data cannot be retrieved ({now})')
    print(f'{name} recieved [{now}]: {result.json()}', flush=True)

    producer = Producer({'bootstrap.servers': 'broker-1:19092,broker-2:19092,broker-3:19092'})
    producer.produce(f'{name}', str(data), callback=delivery_report)
    producer.flush()
    print(f'{name} recieved [{now}]: FINISHED', flush=True)

if __name__ == "__main__":
    main()
