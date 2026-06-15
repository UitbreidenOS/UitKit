# Streaming Data

## Wanneer activeren

Het ontwerpen van event streams, Kafka topics, Pub/Sub subscriptions, of real-time ingestie.

## Wanneer NIET te gebruiken

Niet voor batch-only systemen; focus op low-latency architecturen.

## Instructies

1. Definieer event schema (Avro, Protobuf)
2. Plan partitionering en retentie
3. Dimensioneer consumer groups
4. Beheer backpressure en ordering

## Voorbeeld

Ontwerp een Kafka-topic voor gebruikersactiviteitsgegevens: definieer Avro-schema met event_type, user_id, timestamp; partitioneer op user_id; stel retentie in op 7 dagen; dimensioneer consumer groups voor real-time dashboards (1 partition = 1 consumer in de groep) en offline analyse (parallelisering mogelijk).
