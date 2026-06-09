# Logging-regels

Toepassen bij het toevoegen, beoordelen of configureren van toepassingslogs.

## Structuur

- Emit gestructureerde JSON-logs — nooit vrije-vormteksten in productie
- Elke logregel moet bevatten: `timestamp` (ISO 8601 UTC), `level`, `service`, `message`
- Voeg `trace_id` en `span_id` toe aan elke logegel voor correlatie van gedistribueerde tracering
- Log de `request_id` op elke regel die wordt gegenereerd tijdens de HTTP-aanvraagcyclus
- Gebruik consistente veldnamen in alle services — kom eenmaal tot een schema en dwing het af

## Niveaus

| Niveau | Gebruiken voor |
|---|---|
| `ERROR` | Een bewerking is mislukt; menselijke aandacht kan nodig zijn |
| `WARN` | Onverwachte staat maar de bewerking ging door; waard om in de gaten te houden |
| `INFO` | Normale significante events: service gestart, taak voltooid, gebruiker geverifieerd |
| `DEBUG` | Ontwikkelingsdiagnostiek — standaard uitgeschakeld in productie |

- Gebruik nooit `ERROR` voor verwachte zakelijke fouten (ongeldige invoer, niet gevonden) — gebruik `WARN` of `INFO`
- Gebruik nooit `INFO` voor per-aanvraag-ruis op hoogtransitendpunten — gebruik `DEBUG`

## Inhoud

- Log wat er gebeurde, waarom het belangrijk is en welke identifiers nodig zijn om onderzoek te doen
- Neem het volledige foutbericht en stacktrace op op `ERROR`-regels
- Log nooit geheimen, tokens, wachtwoorden, creditcardnummers of ruwe PII
- Maskeer of omit `Authorization`-headers, cookiewaarden en queryparameters met referenties
- Log aanvraagbodies niet tenzij u fouten debugt en zelfs dan gevoelige velden verwijdert

## Volume en kosten

- Sample `DEBUG` en frequente `INFO`-logs in productie — log 1 op N, niet elke event
- Stel logretentie in per laag: errors 90 dagen, info 30 dagen, debug 7 dagen (aanpassen naar kosten- en nalevingsbehoefte)
- Voeg `slow_query` en `high_latency`-markeringen toe in plaats van elke aanvraag met volledige breedsprakigheid te loggen
- Centraliseer logs op één platform — gefragmenteerde logs over services zijn niet werkbaar tijdens incidenten

## Operationele vereisten

- Logs moeten binnen seconden na emissie opvraagbaar zijn — gebruik een gestructureerde logverzamelaar (Loki, CloudWatch Logs Insights, Datadog)
- Waarschuw bij `ERROR`-tariefspieken, niet alleen bij individuele fouten
- Scheid toepassingslogs van toegangslogs — toegangslogs hebben verschillende retentie- en PII-regels
- Schrijf logs nooit alleen naar lokale schijf in een geclusteriseerde omgeving — ze gaan verloren bij restart
