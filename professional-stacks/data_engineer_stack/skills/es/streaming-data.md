# Datos en Tiempo Real

## Cuándo activar

Diseñar flujos de eventos, temas de Kafka, suscripciones de Pub/Sub o ingestión en tiempo real.

## Cuándo NO usar

No para sistemas solo por lotes; enfocarse en arquitecturas de baja latencia.

## Instrucciones

1. Definir esquema de eventos (Avro, Protobuf)
2. Planificar particionamiento y retención
3. Dimensionar grupos de consumidores
4. Manejar contrapresión y ordenamiento

## Ejemplo

Se diseña una arquitectura de eventos para un servicio de comercio electrónico que transmite eventos de compra en tiempo real a Kafka:
- Esquema de eventos en Avro con campos: `order_id`, `user_id`, `amount`, `timestamp`
- Tópico particionado por `user_id` (50 particiones, retención 24h)
- Consumidores: fraud-detection (low-latency), analytics-aggregator (eventual consistency)
- Gestión de contrapresión: límite de 100K msg/sec con escalado automático de réplicas de consumidor
