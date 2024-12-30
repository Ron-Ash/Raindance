import os
import requests
import datetime
from confluent_kafka import Producer

def delivery_report(err, msg):
    if err is not None:
        print(f"Message delivery failed: {err}")
    else:
        print(f"Message delivered to {msg.topic()} [{msg.partition()}]")

def main():
    if (url := os.environ.get("CURL_URL", None)) is None:
        raise Exception('environment variable "CURL_URL" is not set')
    if (name := os.environ.get("NAME", None)) is None:
        raise Exception('environment variable "NAME" is not set')
    print(f'{name} executing at {datetime.datetime.now()}', flush=True)

    result = requests.get(url)
    if (data := result.json().get("current", None)) is None:
        raise Exception(f'{name}: data cannot be retrieved ({datetime.datetime.now()})')
    

    producer = Producer({'bootstrap.servers': 'localhost:29092,localhost:39092,localhost:49092'})
    producer.produce('test-topic', str(data), callback=delivery_report)
    producer.flush()
    # with open("/var/log/cron_job.log", "a") as f:
    #     f.write(f"{data} produced to {name} [{datetime.datetime.now()}]\n")

if __name__ == "__main__":
    main()
