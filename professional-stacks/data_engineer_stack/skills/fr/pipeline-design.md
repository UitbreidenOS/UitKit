# Conception de Pipeline

## Quand l'activer

Concevoir de nouveaux flux de données ou refactoriser les DAGs existants.

## Quand NE PAS l'utiliser

N'est pas un remplacement du débogage à l'exécution ; utiliser pour la phase architecture uniquement.

## Instructions

1. Mapper les sources de données et les dépendances
2. Définir les étapes de transformation
3. Choisir l'orchestrateur (Airflow, dbt, Spark)
4. Documenter la traçabilité et les SLA

## Exemple

**Scénario :** Conception d'un pipeline multi-étapes pour un data mart de ventes.

```yaml
# DAG Airflow simplifié
DAG : sales_data_mart_daily

Tâches :
  1. extract_raw_orders
     └─ Source : API REST transactionnelle
     └─ SLA : 5 min après extraction
  
  2. extract_raw_customers
     └─ Source : Base clients PostgreSQL
     └─ Dépendance : Parallèle avec (1)
  
  3. transform_and_validate
     └─ dbt run (schéma, normalisation, validation)
     └─ Dépendance : Après (1) et (2)
  
  4. load_to_warehouse
     └─ Insérer dans Snowflake
     └─ Dépendance : Après (3)
  
  5. alert_on_failure
     └─ Slack notification
     └─ Dépendance : Échoue si (1-4) échoue
```

**SLA :** Execution complète < 30 min; alertes si délai > 45 min.
