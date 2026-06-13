---
name: "Kafka and Event Streaming"
description: "Designing or implementing event-driven architectures, building real-time data pipelines with Kafka, configuring producers and consumers in Python or Java, setting up Schema Registry with Avro schemas,"
---

# Kafka and Event Streaming

## When to activate
Designing or implementing event-driven architectures, building real-time data pipelines with Kafka, configuring producers and consumers in Python or Java, setting up Schema Registry with Avro schemas, building stateful stream processing with Kafka Streams or Faust, implementing dead letter topic patterns, or monitoring consumer lag.

## When NOT to use
Simple task queues where ordering and replay are not required (use Redis Streams or Celery instead). Batch ETL jobs with no real-time requirement (use `dbt-data-pipelines.md` or Airflow). Pub/sub with no need for persistence or consumer group semantics (use Redis Pub/Sub or a message broker like RabbitMQ for ephemeral fanout).

## Instructions

### Topic Design

Partition count determines maximum parallelism — one partition can be consumed by at most one consumer in a consumer group at a time:

```
partition_count = ceil(target_throughput_msg_per_sec / single_partition_throughput)
```

Single partition throughput is roughly 10–50 MB/s depending on message size and broker hardware. Err on the side of more partitions — adding partitions later is safe; removing them requires recreating the topic and migrating data.

Production replication factor is always 3: one leader, two in-sync replicas (ISRs). Never set `min.insync.replicas` below 2 in production — with `acks=all`, this ensures at least one replica confirms the write beyond the leader.

```bash
kafka-topics.sh --bootstrap-server broker:9092 \
  --create \
  --topic order-events \
  --partitions 12 \
  --replication-factor 3 \
  --config retention.ms=604800000 \  # 7 days
  --config min.insync.replicas=2
```

Partition key selection is critical for ordering guarantees. Messages with the same key always land in the same partition and are consumed in order. Use `order_id` for order events, `user_id` for user activity streams. Null key = round-robin (no ordering guarantee).

### Producer Configuration

```python
from confluent_kafka import Producer

producer = Producer({
    "bootstrap.servers": "broker1:9092,broker2:9092,broker3:9092",
    "acks": "all",                   # wait for all ISR replicas
    "enable.idempotence": True,      # exactly-once delivery from producer
    "linger.ms": 5,                  # batch for 5ms before sending
    "batch.size": 65536,             # 64KB batch size
    "compression.type": "lz4",       # fast compression, good ratio
    "retries": 10,
    "retry.backoff.ms": 300,
    "delivery.timeout.ms": 120000,
})

def delivery_callback(err, msg):
    if err:
        # Log or send to DLT — do not silently swallow
        log.error(f"Delivery failed: {err}, topic={msg.topic()}, key={msg.key()}")

producer.produce(
    topic="order-events",
    key=order_id.encode(),
    value=serialize_avro(event),
    on_delivery=delivery_callback,
)
producer.flush()  # ensure delivery before function returns
```

`enable.idempotence=True` requires `acks=all` and `retries > 0`. Together they guarantee no duplicate messages from producer retries (uses sequence numbers per partition).

### Consumer Groups and Offset Strategy

```python
from confluent_kafka import Consumer, KafkaError

consumer = Consumer({
    "bootstrap.servers": "broker1:9092",
    "group.id": "order-processor-v2",
    "auto.offset.reset": "earliest",
    "enable.auto.commit": False,     # manual commit — commit only after processing
    "max.poll.interval.ms": 300000,  # 5 min max between polls before rebalance
    "session.timeout.ms": 30000,
})

consumer.subscribe(["order-events"])

try:
    while True:
        msg = consumer.poll(timeout=1.0)
        if msg is None:
            continue
        if msg.error():
            if msg.error().code() == KafkaError._PARTITION_EOF:
                continue
            raise KafkaException(msg.error())

        try:
            process_message(msg)
            consumer.commit(asynchronous=False)  # synchronous commit after processing
        except ProcessingError as e:
            send_to_dlt(msg, error=e)
            consumer.commit(asynchronous=False)  # commit even failed messages
finally:
    consumer.close()
```

One partition per consumer maximum within a group — extra consumers beyond the partition count sit idle. Scale consumer groups horizontally up to the partition count, then increase partitions.

### Schema Registry with Avro

Schema evolution rules — always register schemas before deploying producers:

| Compatibility Mode | What changes are safe |
|---|---|
| BACKWARD | Add optional fields (with defaults) |
| FORWARD | Remove fields with defaults |
| FULL | Only add/remove fields that have defaults |

```python
from confluent_kafka.schema_registry import SchemaRegistryClient
from confluent_kafka.schema_registry.avro import AvroSerializer, AvroDeserializer
from confluent_kafka.serialization import SerializationContext, MessageField

schema_registry = SchemaRegistryClient({"url": "http://schema-registry:8081"})

ORDER_SCHEMA = """
{
  "type": "record",
  "name": "OrderEvent",
  "namespace": "com.example.orders",
  "fields": [
    {"name": "order_id",   "type": "string"},
    {"name": "user_id",    "type": "string"},
    {"name": "total_usd",  "type": "double"},
    {"name": "status",     "type": {"type": "enum", "name": "Status",
                            "symbols": ["CREATED", "PAID", "SHIPPED", "CANCELLED"]}},
    {"name": "created_at", "type": "long",   "logicalType": "timestamp-millis"},
    {"name": "metadata",   "type": ["null", "string"], "default": null}
  ]
}
"""

serializer = AvroSerializer(schema_registry, ORDER_SCHEMA)
deserializer = AvroDeserializer(schema_registry)

# Serialize
value_bytes = serializer(
    order_dict,
    SerializationContext("order-events", MessageField.VALUE)
)
# Deserialize
order = deserializer(
    raw_bytes,
    SerializationContext("order-events", MessageField.VALUE)
)
```

Set `BACKWARD` compatibility on the `order-events` subject so consumers can read newer messages with added fields:

```bash
curl -X PUT http://schema-registry:8081/config/order-events-value \
  -H "Content-Type: application/vnd.schemaregistry.v1+json" \
  -d '{"compatibility": "BACKWARD"}'
```

### Kafka Streams: Stateful Processing

```java
// KStream — unbounded event stream
// KTable — changelog stream with latest value per key (materialized view)
StreamsBuilder builder = new StreamsBuilder();

KStream<String, OrderEvent> orders = builder.stream("order-events");

KTable<String, Long> orderCountByUser = orders
    .groupBy((key, value) -> value.getUserId())
    .count(Materialized.as("order-count-store"));

// Windowed aggregation — 1-hour tumbling window
KTable<Windowed<String>, Double> hourlyRevenue = orders
    .groupBy((key, value) -> value.getUserId())
    .windowedBy(TimeWindows.ofSizeWithNoGrace(Duration.ofHours(1)))
    .aggregate(
        () -> 0.0,
        (key, order, agg) -> agg + order.getTotalUsd(),
        Materialized.with(Serdes.String(), Serdes.Double())
    );

orderCountByUser.toStream().to("user-order-counts");
```

Faust (Python) equivalent for stateful processing:

```python
import faust

app = faust.App("order-processor", broker="kafka://broker:9092")
order_topic = app.topic("order-events", value_type=OrderEvent)
count_table = app.Table("order-counts", default=int)

@app.agent(order_topic)
async def process_orders(orders):
    async for order in orders.group_by(OrderEvent.user_id):
        count_table[order.user_id] += 1
```

### Dead Letter Topic Pattern

Messages that fail processing after N retries go to a dead letter topic (DLT) for later inspection and replay rather than blocking the consumer:

```python
DLT_TOPIC = "order-events.DLT"
MAX_RETRIES = 3

def process_with_dlq(consumer, producer, msg):
    retries = int(msg.headers().get("x-retries", b"0"))
    try:
        process_message(msg)
    except RetryableError:
        if retries < MAX_RETRIES:
            producer.produce(
                topic=msg.topic(),
                key=msg.key(),
                value=msg.value(),
                headers={**dict(msg.headers()), "x-retries": str(retries + 1).encode()},
            )
        else:
            producer.produce(
                topic=DLT_TOPIC,
                key=msg.key(),
                value=msg.value(),
                headers={
                    **dict(msg.headers()),
                    "x-original-topic": msg.topic().encode(),
                    "x-error": traceback.format_exc().encode()[:1024],
                },
            )
    except FatalError:
        # Non-retryable — send directly to DLT
        producer.produce(DLT_TOPIC, key=msg.key(), value=msg.value())
```

### Consumer Lag Monitoring

Consumer lag = latest offset - committed offset per partition. Alert when lag exceeds a threshold relative to throughput (e.g., >30 seconds of messages unprocessed):

```bash
# CLI check
kafka-consumer-groups.sh --bootstrap-server broker:9092 \
  --describe --group order-processor-v2

# Prometheus metric: kafka_consumer_group_lag
# Alert: sum(kafka_consumer_group_lag{group="order-processor-v2"}) > 10000
```

## Example

Design a Kafka pipeline for e-commerce order events:

1. **Topic**: `order-events` — 12 partitions, replication factor 3, `min.insync.replicas=2`, 7-day retention. Partition key = `order_id`.
2. **Avro schema**: `OrderEvent` with `order_id`, `user_id`, `total_usd`, `status` enum, `created_at` timestamp. Register with `BACKWARD` compatibility on Schema Registry.
3. **Producer**: `acks=all`, `enable.idempotence=True`, `linger.ms=5`, `compression.type=lz4`. Delivery callback logs failures.
4. **Consumer group** `order-processor-v2`: `enable.auto.commit=False`, manual synchronous commit after each message. Failed messages after 3 retries go to `order-events.DLT` with original topic and error headers.
5. **Monitoring**: Prometheus alert fires when consumer group lag exceeds 10,000 messages — triggers PagerDuty.

---
