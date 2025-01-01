# Apache Flink

<table><tr><td>

**_Apache Flink_** is a **stream** and **batch** processor widely used for demanding real-time applications (most commonly in conjunction with **_apache kafka_**).

![alt text](image.png)

</td><td>

![alt text](image-2.png)

</td></tr></table>

A **_stream_** is a sequence of **_events_** that can be manipulated, processed, and reacted to in real-time; in which case the sequence of events forms an **unbounded** _stream_ that extends indefinitely into the future (can also be stored for later retrieval, etc.). Reprocessing a batch of historical data is then a special case of **bounded** _streaming_.
![alt text](image-1.png)

A running _Flink_ application, **_Job_**, can have multiple data-processing pipelines, each called a **_Job Graph_** (event data is treamed through them) (topology). Each **_node_** inside a job graph represents a processing steps in the pipeline, each executed by an **_operator_**. _Operators_ transform event _streams_ and are connected to one another by **_connections_**, represented as the graph (directed) edges. _Job graphs_ are always **directed acyclic**; where the event data is always flowing from the **_sources_** to the **_sink_** (processed along the way by the _operators_).

![alt text](image-3.png)

_Stream_ processing is done in parallel by partitioning event _streams_ into parallel _sub-streams_, each of which can be independently processed (crucial for scalability). These independent parallel _operators_ **share nothing**, and can run at full speed (typical for input to a _Flink Job_ can be consumed in parallel, and often pre-partitioned upstream of _Flink_).

## Flink Runtime

## Stateful Stream Processing

## Event Time and Watermarks

## Checkpoint and Recovery
