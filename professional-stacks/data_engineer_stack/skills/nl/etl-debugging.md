# ETL Debugging

## Wanneer activeren

Pipeline mislukt, gegevensverlies treedt op, of records ontbreken onverwacht of worden gedupliceerd.

## Wanneer NIET te gebruiken

Niet voor designreview; alleen voor fouten na runtime.

## Instructies

1. Isoleer de faalstagium
2. Controleer logs en statistieken
3. Verifieer invoergegevens en schema
4. Traceer transformaties van begin tot einde

## Voorbeeld

Een pipeline faalt bij het verwerken van 1 miljoen klantrecords. Controleer eerst de logs van het extract-stap (gegevens correct opgehaald?), verifieer vervolgens de transformatielogica (legen unie-joins records uit?) en controleer tot slot of de doeltabel beschrijvingen heeft gewijzigd.
