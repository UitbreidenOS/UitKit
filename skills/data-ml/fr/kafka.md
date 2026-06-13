# Kafka et Event Streaming

## Quand activer
Conception ou implémentation d'architectures pilotées par les événements, construction de pipelines de données temps réel avec Kafka, configuration de producteurs et de consommateurs en Python ou Java, configuration de Schema Registry avec schémas Avro, construction du traitement de flux stateful avec Kafka Streams ou Faust, implémentation de modèles de sujets de lettre morte, ou surveillance du lag des consommateurs.

## Quand ne PAS utiliser
Files d'attente de tâches simples où l'ordre et la relecture ne sont pas requis (utiliser Redis Streams ou Celery). Jobs d'ETL batch sans exigence temps réel (utiliser `dbt-data-pipelines.md` ou Airflow). Pub/sub sans besoin de persistance ou de sémantique de groupe de consommateurs (utiliser Redis Pub/Sub ou RabbitMQ).

## Instructions

### Conception de sujet

Le nombre de partitions détermine le parallélisme maximum :

```
partition_count = ceil(target_throughput_msg_per_sec / single_partition_throughput)
```

Le débit de partition unique est environ 10–50 MB/s. Ajouter des partitions est sûr ; les enlever nécessite de recréer le sujet.

Production replication factor est toujours 3 : un leader, deux ISR. Ne jamais définir `min.insync.replicas` en-dessous de 2 en production.

```bash
kafka-topics.sh --bootstrap-server broker:9092 \
  --create \
  --topic order-events \
  --partitions 12 \
  --replication-factor 3 \
  --config min.insync.replicas=2
```

La sélection de clé de partition est critique pour les garanties d'ordre. Les messages avec la même clé se retrouvent toujours dans la même partition et sont consommés dans l'ordre. Utiliser `order_id` pour les événements de commande, `user_id` pour les flux d'activité utilisateur.

### Configuration du producteur

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
})

def delivery_callback(err, msg):
    if err:
        log.error(f"Delivery failed: {err}")

producer.produce(
    topic="order-events",
    key=order_id.encode(),
    value=serialize_avro(event),
    on_delivery=delivery_callback,
)
producer.flush()
```

`enable.idempotence=True` requiert `acks=all` et `retries > 0`. Ensemble, ils garantissent pas de messages en doublon.

### Groupes de consommateurs et stratégie de décalage

```python
from confluent_kafka import Consumer

consumer = Consumer({
    "bootstrap.servers": "broker1:9092",
    "group.id": "order-processor-v2",
    "auto.offset.reset": "earliest",
    "enable.auto.commit": False,
    "max.poll.interval.ms": 300000,
})

consumer.subscribe(["order-events"])

try:
    while True:
        msg = consumer.poll(timeout=1.0)
        if msg is None:
            continue
        if msg.error():
            continue

        try:
            process_message(msg)
            consumer.commit(asynchronous=False)
        except ProcessingError as e:
            send_to_dlt(msg, error=e)
            consumer.commit(asynchronous=False)
finally:
    consumer.close()
```

Une partition par consommateur maximum dans un groupe — les consommateurs supplémentaires s'assoient oisifs. Mettre à l'échelle les groupes de consommateurs horizontalement jusqu'au nombre de partitions, puis augmenter les partitions.

### Schema Registry avec Avro

Modes de compatibilité — toujours enregistrer les schémas avant de déployer les producteurs :

| Mode | Changements sûrs |
|---|---|
| BACKWARD | Ajouter des champs optionnels (avec défauts) |
| FORWARD | Supprimer les champs avec défauts |
| FULL | Ajouter/supprimer les champs avec défauts |

```python
from confluent_kafka.schema_registry import SchemaRegistryClient
from confluent_kafka.schema_registry.avro import AvroSerializer

schema_registry = SchemaRegistryClient({"url": "http://schema-registry:8081"})

ORDER_SCHEMA = """
{
  "type": "record",
  "name": "OrderEvent",
  "fields": [
    {"name": "order_id", "type": "string"},
    {"name": "user_id", "type": "string"},
    {"name": "total_usd", "type": "double"}
  ]
}
"""

serializer = AvroSerializer(schema_registry, ORDER_SCHEMA)
value_bytes = serializer(order_dict, None)
```

### Kafka Streams : traitement stateful

```java
StreamsBuilder builder = new StreamsBuilder();
KStream<String, OrderEvent> orders = builder.stream("order-events");

KTable<String, Long> orderCountByUser = orders
    .groupBy((key, value) -> value.getUserId())
    .count(Materialized.as("order-count-store"));

orderCountByUser.toStream().to("user-order-counts");
```

Équivalent Faust (Python) pour traitement stateful :

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

### Modèle de sujet de lettre morte

Messages qui échouent après N tentatives vont à un sujet de lettre morte (DLT) pour inspection ultérieure et relecture :

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
            )
```

### Surveillance du lag des consommateurs

Consumer lag = latest offset - committed offset par partition. Alerter quand le lag dépasse un seuil :

```bash
kafka-consumer-groups.sh --bootstrap-server broker:9092 \
  --describe --group order-processor-v2

# Prometheus metric: kafka_consumer_group_lag
# Alert: sum(kafka_consumer_group_lag{group="order-processor-v2"}) > 10000
```

## Exemple

Design d'un pipeline Kafka pour événements de commandes e-commerce :

1. **Sujet** : `order-events` — 12 partitions, replication factor 3, `min.insync.replicas=2`, rétention 7 jours. Clé de partition = `order_id`.
2. **Schéma Avro** : `OrderEvent` avec `order_id`, `user_id`, `total_usd`, `status` enum. Enregistrer avec compatibilité `BACKWARD`.
3. **Producteur** : `acks=all`, `enable.idempotence=True`, `linger.ms=5`, `compression.type=lz4`. Callback de livraison enregistre les échecs.
4. **Groupe de consommateurs** `order-processor-v2` : `enable.auto.commit=False`, commit synchrone manuel après chaque message. Messages échoués après 3 tentatives vont à `order-events.DLT`.
5. **Surveillance** : Alerte Prometheus quand le lag du groupe de consommateurs dépasse 10 000 messages.

---
