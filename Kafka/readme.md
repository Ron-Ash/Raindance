# Apache Kafka

**_Apache Kafka_** is an event (a combination of **_notification_** and **_state_**) streaming platform used to collect, store and process real time datastreams (at scale); embracing the shift from **data-as-states** ( data represents items with certain attributes at a given time) to **data-as-events** (data represents change in an item's attribute at a given time).

## Architecture

A **_producer_** is a user generated program (written in **Java**, C/C++, Python, Go, .NET, Node.js, etc.) which **writes** events to the _Kafka cluster_ (returns ACK/NACK).

A **_kafka cluster_** consists of _n_ **_Broker_** nodes (single isolated **_Kafka instance_** with its own exclusive storage) and an **odd** number of **_Controller_** nodes (special _Kafka instance_ or **_ZooKeeper_** which allows for synchronization between the _broker_ nodes through cluster managment, failure detection & recovery, access control list & secrets, etc.).

A **_consumer_** is a user generated program (same language support as for _producers_) which **reads** events from the _Kafka cluster_; note that it does not destroy the records during reads. _producers_ and _consumers_ are decoupled (_consumer_ does not know anything about the _producer_ and vice versa) allowing for both of them to scale independently without affecting one another.

- A _consumer_ will ask _kafka cluster_ whether new messages for their subscribed _topic_ after a certain **_offset_** (each record has its own numeric offset) have arrived; either recieving a "no" or the rest of teh data. These **_offsets_ of each _consumer_ into each _partition_** that the _consumer_ is responsible for is stored inside a special _topic_ in the _cluster_.

A **_Topic_** is a developer defined category for facilitating a collection of related messages/events (can be thought of as a sequence/log of event). A single _topic_ consists of many **_partitions_** (allow for scaling of _kafka_) which can be allocated to different _brokers_ across the _cluster_.

While each _partition_ has **strict ordering** (when producing to a partition, a message can only be placed at the end); strict ordering is not guaranteed for all events in a _topic_. Each _partition_ is also replicated multiple times (**_replication factor_**) across the _cluster_ (default is 3); with one replica being the **_leader_** and the others **_followers_**. When a record is produced to a _partition_, it is produced to the _leader_ with the _follower_ _partitions_ reaching out to the _leader_ to recieve the new up-to-date data.

![alt text](image.png)

A _kafka_ **_record_** consists of (optional) **_headers_**, **_key_**:**_value_** pair (buisness relevant data), and a **_timestamp_** (creation/ingestion time)

_Producers_ use a partitioning strategy to assign each message to a partition (for load balancing and semantic partitioning). If no key is specified then a round-robin stategy is used; otherwise `hash(key) % #_of_partitions` (**messages with the same key will always be in order**) defines which partition the message would be sent to (custom partitioner is possible but not neccessary).
