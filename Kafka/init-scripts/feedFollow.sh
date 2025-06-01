/opt/kafka/bin/kafka-topics.sh --bootstrap-server broker-1:19092,broker-2:19092,broker-3:19092 --create --topic socialNetwork_followers --config cleanup.policy=compact --config min.cleanable.dirty.ratio=0.1 --config delete.retention.ms=86400000;
/opt/kafka/bin/kafka-topics.sh --bootstrap-server broker-1:19092,broker-2:19092,broker-3:19092 --create --topic socialNetwork_follow;
# /opt/kafka/bin/kafka-console-producer.sh --bootstrap-server broker-1:19092,broker-2:19092,broker-3:19092 --topic socialNetwork_follow --property parse.key=true --property key.separator=:
# user1:{"follows":"user3"}
# user2:{"follows":"user3"}
/opt/kafka/bin/kafka-topics.sh --bootstrap-server broker-1:19092,broker-2:19092,broker-3:19092 --create --topic socialNetwork_unfollow;
# /opt/kafka/bin/kafka-console-producer.sh --bootstrap-server broker-1:19092,broker-2:19092,broker-3:19092 --topic socialNetwork_unfollow --property parse.key=true --property key.separator=:
# user2:{"follows":"user3"}
/opt/kafka/bin/kafka-topics.sh --bootstrap-server broker-1:19092,broker-2:19092,broker-3:19092 --create --topic socialNetwork_feedStream --partitions 100 --replication-factor 2;
/opt/kafka/bin/kafka-topics.sh --bootstrap-server broker-1:19092,broker-2:19092,broker-3:19092 --create --topic socialNetwork_postStream --partitions 100 --replication-factor 2;
# /opt/kafka/bin/kafka-console-producer.sh --bootstrap-server broker-1:19092,broker-2:19092,broker-3:19092 --topic socialNetwork_postStream  --property parse.key=true --property key.separator=:
# user3:{"message":"hello world", "attachmentPath":"/opt/kafka/bin/test/test.png"}