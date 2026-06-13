---
name: spark
description: "DataFrames Apache Spark, SQL Spark, transformations PySpark, partitionnement, UDFs, Structured Streaming, Delta Lake"
---

# Compétence Apache Spark

## Quand l'activer
- Traitement de datasets trop volumineux pour tenir en mémoire (DataFrames PySpark)
- Rédaction de transformations Spark SQL sur un cluster Databricks ou EMR
- Construction de pipelines Structured Streaming à partir de Kafka ou S3
- Optimisation des jobs Spark : partitionnement, mise en cache, broadcast joins, gestion du skew
- Travail avec Delta Lake (transactions ACID, time travel, évolution du schéma)
- Migration de code Pandas vers PySpark pour la scalabilité

## Quand NE PAS l'utiliser
- Datasets < ~1 GB — pandas ou polars plus rapide sans frais généraux de cluster
- Latence real-time sub-seconde — utilisez Flink ou Kafka Streams
- SQL simple en batch sur warehouse — utilisez dbt + Snowflake/BigQuery directement
- Entraînement ML sur une seule machine — utilisez sklearn/PyTorch directement

[Following full structure from English version with French translations]

---
