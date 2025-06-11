/opt/kafka/bin/kafka-topics.sh --bootstrap-server broker-1:19092,broker-2:19092,broker-3:19092 --create --topic socialNetwork_feedRefresh;
# /opt/kafka/bin/kafka-console-producer.sh --bootstrap-server broker-1:19092,broker-2:19092,broker-3:19092 --topic socialNetwork_feedRefresh  --property parse.key=true --property key.separator=:
# user3:{"feedType":"popular","numberOfPosts":"10000"}