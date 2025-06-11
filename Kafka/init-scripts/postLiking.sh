/opt/kafka/bin/kafka-topics.sh --bootstrap-server broker-1:19092,broker-2:19092,broker-3:19092 --create --topic socialNetwork_postLiking;
# /opt/kafka/bin/kafka-console-producer.sh --bootstrap-server broker-1:19092,broker-2:19092,broker-3:19092 --topic socialNetwork_postLiking  --property parse.key=true --property key.separator=:
# user3:{"postAuthor":"user2", "postTime":"2019-01-01 00:00:00"}
/opt/kafka/bin/kafka-topics.sh --bootstrap-server broker-1:19092,broker-2:19092,broker-3:19092 --create --topic socialNetwork_postUnLiking;
# /opt/kafka/bin/kafka-console-producer.sh --bootstrap-server broker-1:19092,broker-2:19092,broker-3:19092 --topic socialNetwork_postUnLiking  --property parse.key=true --property key.separator=:
# user3:{"postAuthor":"user2", "postTime":"2025-06-11 02:31:05"}