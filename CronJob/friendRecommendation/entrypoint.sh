#!/bin/bash

{
    echo "CLICKHOUSE_HOST=${CLICKHOUSE_HOST}"
    echo "CLICKHOUSE_USER=${CLICKHOUSE_USER}"
    echo "CLICKHOUSE_PASSWORD=${CLICKHOUSE_PASSWORD}"
    echo "0 0 * * 1 /usr/local/bin/python /usr/src/app/script.py >> /var/log/cron.log 2>&1"
    # echo "* * * * * /usr/local/bin/python /usr/src/app/script.py >> /var/log/cron.log 2>&1"
} > /etc/cron.d/my-cron-job

chmod 0644 /etc/cron.d/my-cron-job
crontab /etc/cron.d/my-cron-job

cron && tail -f /var/log/cron.log