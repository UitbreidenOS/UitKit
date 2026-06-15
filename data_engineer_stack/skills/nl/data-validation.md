# Data Validation

## Wanneer activeren

Het bouwen van kwaliteitscontroles, anomaliedetectie of null/kardinaliteitassertingen.

## Wanneer NIET te gebruiken

Niet voor verkennende data-analyse; focus op operationele beveiligingen.

## Instructies

1. Definieer assertietypes (schema, kardinaliteit, bereik, uniciteit)
2. Stel waarschuwingsdrempels in
3. Bouw herbruikbare validatieregels
4. Integreer in pipeline

## Voorbeeld

Implementeer kardinaliteitscontroles op een dagelijkse batch: stel vast dat geen kolom meer dan 5% NULL-waarden bevat; als dit gebeurt, stuur een waarschuwing naar het monitoring-dashboard en voer geen downstream-transformaties uit totdat het probleem is opgelost.
