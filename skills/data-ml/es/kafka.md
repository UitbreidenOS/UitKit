# Kafka y Event Streaming

## Cuándo activar
Diseño o implementación de arquitecturas impulsadas por eventos, construcción de tuberías de datos en tiempo real con Kafka, configuración de productores y consumidores en Python o Java, configuración de Schema Registry con esquemas Avro, construcción de procesamiento de streams con estado con Kafka Streams o Faust, implementación de patrones de dead letter topic, o monitoreo de consumer lag.

## Cuándo NO usar
Colas de tareas simples donde orden y replay no son requeridos (usar Redis Streams o Celery). Trabajos de ETL batch sin requisito en tiempo real (usar `dbt-data-pipelines.md` o Airflow). Pub/sub sin necesidad de persistencia o semántica de consumer group (usar Redis Pub/Sub o broker de mensajes como RabbitMQ para fanout efímero).

## Instrucciones

### Diseño de Tema

El conteo de partición determina paralelismo máximo — una partición puede ser consumida por como máximo un consumidor en un grupo consumidor a la vez.

Producción replication factor es siempre 3: un líder, dos in-sync replicas (ISRs). Nunca establecer `min.insync.replicas` por debajo de 2 en producción — con `acks=all`, esto asegura al menos una réplica confirma la escritura más allá del líder.

```bash
kafka-topics.sh --bootstrap-server broker:9092 \
  --create \
  --topic order-events \
  --partitions 12 \
  --replication-factor 3 \
  --config retention.ms=604800000 \  # 7 days
  --config min.insync.replicas=2
```

Selección de partition key es crítica para garantías de orden. Mensajes con la misma key siempre aterrizan en la misma partición y se consumen en orden. Usar `order_id` para eventos de orden, `user_id` para streams de actividad de usuario.

### Configuración de Productor

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
        log.error(f"Delivery failed: {err}")

producer.produce(
    topic="order-events",
    key=order_id.encode(),
    value=serialize_avro(event),
    on_delivery=delivery_callback,
)
producer.flush()
```

`enable.idempotence=True` requiere `acks=all` y `retries > 0`. Juntos garantizan sin mensajes duplicados de reintentos de productor.

### Grupos de Consumidor y Estrategia de Offset

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

Una partición máximo por consumidor dentro de un grupo — consumidores adicionales más allá del conteo de partición se sientan ociosos. Escalar grupos consumidores horizontalmente hasta el conteo de partición, luego aumentar particiones.

### Schema Registry con Avro

Reglas de evolución de esquema — siempre registrar esquemas antes de desplegar productores.

```python
from confluent_kafka.schema_registry import SchemaRegistryClient
from confluent_kafka.schema_registry.avro import AvroSerializer, AvroDeserializer

schema_registry = SchemaRegistryClient({"url": "http://schema-registry:8081"})

ORDER_SCHEMA = """
{
  "type": "record",
  "name": "OrderEvent",
  "fields": [
    {"name": "order_id",   "type": "string"},
    {"name": "user_id",    "type": "string"},
    {"name": "total_usd",  "type": "double"},
    {"name": "status",     "type": {"type": "enum", "name": "Status",
                            "symbols": ["CREATED", "PAID", "SHIPPED", "CANCELLED"]}}
  ]
}
"""

serializer = AvroSerializer(schema_registry, ORDER_SCHEMA)
```

### Monitoreo de Consumer Lag

Consumer lag = latest offset - committed offset por partición. Alerta cuando lag excede umbral relativo a throughput.

```bash
kafka-consumer-groups.sh --bootstrap-server broker:9092 \
  --describe --group order-processor-v2
```

## Ejemplo

Diseño de tubería Kafka para eventos de orden de e-commerce:

1. **Tema**: `order-events` — 12 particiones, replication factor 3, `min.insync.replicas=2`, retención 7 días.
2. **Esquema Avro**: `OrderEvent` con campos de orden, usuario, total, estado.
3. **Productor**: `acks=all`, `enable.idempotence=True`, `linger.ms=5`, `compression.type=lz4`.
4. **Grupo consumidor** `order-processor-v2`: commit síncrono manual.
5. **Monitoreo**: Alerta Prometheus cuando consumer lag excede 10,000 mensajes.

---
