# Kafka und Event Streaming

## Wann aktivieren
Design oder Implementierung von Event-Driven Architekturen, Aufbau von Real-Time Data Pipelines mit Kafka, Konfigurierung von Producers und Consumers in Python oder Java, Setup von Schema Registry mit Avro Schemas, Aufbau von Stateful Stream Processing mit Kafka Streams oder Faust, Implementierung von Dead Letter Topic Patterns oder Monitoring von Consumer Lag.

## Wann NICHT verwenden
Einfache Task Queues, wo Ordering und Replay nicht erforderlich sind (verwenden Sie Redis Streams oder Celery stattdessen). Batch ETL Jobs ohne Real-Time Anforderung (verwenden Sie `dbt-data-pipelines.md` oder Airflow). Pub/Sub ohne Bedarf für Persistenz oder Consumer Group Semantics (verwenden Sie Redis Pub/Sub oder einen Message Broker wie RabbitMQ für ephemere Fanout).

## Anweisungen

### Topic Design

Partition Count bestimmt maximale Parallelism — eine Partition kann von höchstens einem Consumer in einer Consumer Group gleichzeitig konsumiert werden:

```
partition_count = ceil(target_throughput_msg_per_sec / single_partition_throughput)
```

Single Partition Throughput liegt grob bei 10–50 MB/s, abhängig von Message Size und Broker Hardware. Erliegen Sie den Seiten von mehr Partitions — das Hinzufügen von Partitions später ist sicher; das Entfernen erfordert Topic Neuerstellung und Datenmigration.

Production Replication Factor ist immer 3: ein Leader, zwei In-Sync Replicas (ISRs). Setzen Sie `min.insync.replicas` niemals unter 2 in Production — mit `acks=all` stellt dies sicher, dass mindestens eine Replica das Schreiben über den Leader hinaus bestätigt.

```bash
kafka-topics.sh --bootstrap-server broker:9092 \
  --create \
  --topic order-events \
  --partitions 12 \
  --replication-factor 3 \
  --config retention.ms=604800000 \  # 7 days
  --config min.insync.replicas=2
```

Partition Key Selection ist kritisch für Ordering Garantien. Messages mit dem gleichen Key landen immer in der gleichen Partition und werden in Ordnung konsumiert. Verwenden Sie `order_id` für Order Events, `user_id` für User Activity Streams. Null Key = Round-Robin (keine Ordering Garantie).

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

`enable.idempotence=True` erfordert `acks=all` und `retries > 0`. Zusammen garantieren sie keine Duplikat Messages von Producer Retries (verwendet Sequenznummern pro Partition).

### Consumer Groups und Offset Strategy

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

Eine Partition pro Consumer Maximum in einer Gruppe — zusätzliche Consumers über der Partition Count hinaus sitzen untätig. Skalieren Sie Consumer Groups horizontal bis zur Partition Count, erhöhen Sie dann Partitions.

### Schema Registry mit Avro

Schema Evolution Rules — registrieren Sie Schemas immer vor dem Deployment von Producers:

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

Setzen Sie `BACKWARD` Compatibility auf das `order-events` Subject, damit Consumers neuere Messages mit hinzugefügten Feldern lesen können:

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

Faust (Python) Äquivalent für Stateful Processing:

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

Messages, die nach N Retries fehlschlagen, gehen zu einem Dead Letter Topic (DLT) zur späteren Inspection und Replay, statt den Consumer zu blockieren:

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

Consumer Lag = Latest Offset - Committed Offset pro Partition. Alert, wenn Lag einen Threshold relative zum Throughput überschreitet (z.B. >30 Sekunden unverarbeiteter Messages):

```bash
# CLI check
kafka-consumer-groups.sh --bootstrap-server broker:9092 \
  --describe --group order-processor-v2

# Prometheus metric: kafka_consumer_group_lag
# Alert: sum(kafka_consumer_group_lag{group="order-processor-v2"}) > 10000
```

## Beispiel

Design einer Kafka Pipeline für E-Commerce Order Events:

1. **Topic**: `order-events` — 12 Partitions, Replication Factor 3, `min.insync.replicas=2`, 7-Tage Retention. Partition Key = `order_id`.
2. **Avro Schema**: `OrderEvent` mit `order_id`, `user_id`, `total_usd`, `status` Enum, `created_at` Timestamp. Mit `BACKWARD` Compatibility auf Schema Registry registrieren.
3. **Producer**: `acks=all`, `enable.idempotence=True`, `linger.ms=5`, `compression.type=lz4`. Delivery Callback protokolliert Fehler.
4. **Consumer Group** `order-processor-v2`: `enable.auto.commit=False`, manueller synchroner Commit nach jeder Message. Fehlgeschlagene Messages nach 3 Retries gehen zu `order-events.DLT` mit Original Topic und Error Headers.
5. **Monitoring**: Prometheus Alert löst aus, wenn Consumer Group Lag 10.000 Messages überschreitet — triggert PagerDuty.

---
