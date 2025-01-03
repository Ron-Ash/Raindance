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

## Flink SQL

**_Flink SQL_** is one of the APIs available for _Apache Flink_, facilitating a standards-compliant SQL engine for processing both batch and streaming data with the scalability, performance, and consistency of _Apache Flink_.

<table><tr><td>

![alt text](image-4.png)

</td><td>

API code layered in _Flink_:

![alt text](image-5.png)

</td></tr></table>

**_Process Functions_** is a primitive building block capable of implementign almost any operation by directly manipulating _Flink's_ state backends and timer services (writing code that reacts to each event as it arrives; one at a time). **_Datasteam API_** encompasses _process functions_ at a slightly higher level of abstraction (streams, windows, etc.). **_Table API_** abstracts these further with capabilities similar to _flink sql_ though code must be written in Java or python rather then sql. Note that all these are interoperable.

![alt text](image-6.png)

_Flink SQL_ engine can feel very much like using a database; but it is not really a database. It is only using standard sql syntax to describe the processing desired of _Flink_. None of the data is stored in _Flink_; when a table is created in _Flink_, it only describes data stored elsewhere.

<table><tr><td>

```sql
CREATE TABLE Shipments (
    item    STRING,
    count   INT,
) WITH (
    connector='kafka',
    topic='shipments',
    value.format='json',
    properties.group.id='myGroup',
    scan.startup.mode='latest-offset',
    properties.bootstrap.servers='XXX',
    Properties.security.protocol='SASL_SSL',
    Properties.sasl.mechanism='PLAIN',
    Properties.sasl.jaas.config='XXX'
)
```

_Flink SQL_ tables do not store data, instead are backed by a provider/producer with _Flink_ only maintaining metadata to describe the schema and connector properties required to ingest the data correctly.

</td><td>

![alt text](image-7.png)
![alt text](image-8.png)
In _Flink SQL_ there exists a stream/table duality; "tables" are _dynamic tables_ which change over time and every table is equivalent to a stream of events describing the changes being made to that table (**_changelog stream_**).

</td></tr></table>

![alt text](image-9.png)

## Flink Runtime

## Stateful Stream Processing

## Event Time and Watermarks

## Checkpoint and Recovery
