# Données en Continu

## Quand activer

Conception de flux d'événements, rubriques Kafka, abonnements Pub/Sub ou ingestion en temps réel.

## Quand NE PAS utiliser

Non pour les systèmes par lots uniquement ; concentrez-vous sur les architectures à faible latence.

## Instructions

1. Définir le schéma d'événement (Avro, Protobuf)
2. Planifier le partitionnement et la conservation
3. Dimensionner les groupes de consommateurs
4. Gérer la contre-pression et l'ordre

## Exemple

Topic Kafka « user-events » avec schéma Avro (event_id, timestamp, user_id). 10 partitions par user_id. Rétention : 7 jours. Groupe de consommateurs avec 5 consommateurs pour traitement parallèle. Topic de lettre morte pour les erreurs.
