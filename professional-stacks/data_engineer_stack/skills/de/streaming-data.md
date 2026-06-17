# Streaming-Daten

## Wann aktivieren

Beim Entwerfen von Event Streams, Kafka-Topics, Pub/Sub-Abos oder Echtzeit-Erfassung.

## Wann NICHT verwenden

Nicht für reine Batch-Systeme; konzentrieren Sie sich auf Low-Latency-Architekturen.

## Anweisungen

1. Event-Schema definieren (Avro, Protobuf)
2. Partitionierung und Aufbewahrung planen
3. Consumer Groups dimensionieren
4. Backpressure und Reihenfolge behandeln

## Beispiel

Kafka-Topic „user-events" mit Avro-Schema (event_id, timestamp, user_id). 10 Partitionen nach user_id. Aufbewahrung: 7 Tage. Consumer-Gruppe mit 5 Consumern für parallele Verarbeitung. Deadletter-Topic für Fehler.
