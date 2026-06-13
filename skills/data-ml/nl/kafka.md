# Kafka and Event Streaming

## Wanneer activeren
Ontwerpen of implementeren van event-driven architectures, bouwen van real-time data pipelines met Kafka, configureren van producers en consumers in Python of Java, instellen van Schema Registry met Avro schemas, bouwen van stateful stream processing met Kafka Streams of Faust, implementeren van dead letter topic patronen, of monitoren van consumer lag.

## Wanneer NIET gebruiken
Eenvoudige task queues waar ordering en replay niet vereist zijn (gebruik Redis Streams of Celery). Batch ETL jobs zonder real-time vereiste (gebruik dbt-data-pipelines of Airflow). Pub/sub zonder persistence of consumer group semantics (gebruik Redis Pub/Sub).

## Instructies

### Topic Design

Partition count bepaalt maximum parallelism — één partition kan door maximaal één consumer in consumer group verbruikt:

```
partition_count = ceil(target_throughput_msg_per_sec / single_partition_throughput)
```

Single partition throughput is roughly 10–50 MB/s afhankelijk van message size en broker hardware. Err aan zijde van meer partitions — partitions toevoegen later is veilig.

Production replication factor is altijd 3: één leader, twee in-sync replicas (ISRs). Nooit zet `min.insync.replicas` onder 2 in production.

```bash
kafka-topics.sh --bootstrap-server broker:9092 \
  --create \
  --topic order-events \
  --partitions 12 \
  --replication-factor 3 \
  --config retention.ms=604800000 \
  --config min.insync.replicas=2
```

Partition key selection is kritiek voor ordering guarantees. Messages met dezelfde key landen altijd in dezelfde partition.

### Producer Configuration

```python
from confluent_kafka import Producer

producer = Producer({
    "bootstrap.servers": "broker1:9092,broker2:9092,broker3:9092",
    "acks": "all",
    "enable.idempotence": True,
    "linger.ms": 5,
    "batch.size": 65536,
    "compression.type": "lz4",
    "retries": 10,
    "retry.backoff.ms": 300,
    "delivery.timeout.ms": 120000,
})

def delivery_callback(err, msg):
    if err:
        log.error(f"Delivery failed: {err}, topic={msg.topic()}")

producer.produce(
    topic="order-events",
    key=order_id.encode(),
    value=serialize_avro(event),
    on_delivery=delivery_callback,
)
producer.flush()
```

### Consumer Groups and Offset Strategy

```python
from confluent_kafka import Consumer, KafkaError

consumer = Consumer({
    "bootstrap.servers": "broker1:9092",
    "group.id": "order-processor-v2",
    "auto.offset.reset": "earliest",
    "enable.auto.commit": False,
    "max.poll.interval.ms": 300000,
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
            consumer.commit(asynchronous=False)
        except ProcessingError as e:
            send_to_dlt(msg, error=e)
            consumer.commit(asynchronous=False)
finally:
    consumer.close()
```

### Consumer Lag Monitoring

Consumer lag = latest offset - committed offset per partition. Alert wanneer lag threshold exceed (bijv. >30 seconden van messages unprocessed):

```bash
# CLI check
kafka-consumer-groups.sh --bootstrap-server broker:9092 \
  --describe --group order-processor-v2
```

---
