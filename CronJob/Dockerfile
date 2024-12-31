FROM python:3.11-slim

RUN apt-get update && apt-get install -y cron && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY script.py .
COPY entrypoint.sh .
RUN chmod +x ./entrypoint.sh
RUN touch /var/log/cron.log

ENTRYPOINT [ "./entrypoint.sh" ]