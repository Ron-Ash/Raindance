#!/bin/bash

{
    echo "CURL_URL=${CURL_URL}"
    echo "NAME=${NAME}"
    echo "0 * * * * /usr/local/bin/python /usr/src/app/script.py >> /var/log/cron.log 2>&1"
    echo "15 * * * * /usr/local/bin/python /usr/src/app/script.py >> /var/log/cron.log 2>&1"
    echo "30 * * * * /usr/local/bin/python /usr/src/app/script.py >> /var/log/cron.log 2>&1"
    echo "45 * * * * /usr/local/bin/python /usr/src/app/script.py >> /var/log/cron.log 2>&1"
} > /etc/cron.d/my-cron-job

chmod 0644 /etc/cron.d/my-cron-job
crontab /etc/cron.d/my-cron-job

cron && tail -f /var/log/cron.log