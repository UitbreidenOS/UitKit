# Pipeline Design

## Wanneer activeren

Het ontwerpen van nieuwe gegevenswerkstromen of het herstructureren van bestaande DAGs.

## Wanneer NIET te gebruiken

Geen vervanging voor runtime-debugging; alleen gebruiken in de architectuurfase.

## Instructies

1. Wijs gegevensbronnen en afhankelijkheden toe
2. Definieer transformatiefasen
3. Kies orchestrator (Airflow, dbt, Spark)
4. Documenteer herkomst en SLA's

## Voorbeeld

Ontwerp een gegevens-innamepijplijn: extractie van API (dagelijks om 02:00 UTC), transformatie in dbt (schoonmaking en denormalisatie), en belading in Snowflake (partitionering op datum). Definieer SLA: maximaal 30 minuten latentie van extractie tot belading. Documenteer lineage in YAML.
