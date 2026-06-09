# Observabiliteitsregels

## Van toepassing op
Alle backend-services, workers en infrastructuur — elk systeem dat in productie draait.

## Regels

1. **Logboeken, metreken en traces zijn afzonderlijke signalen — instrumenteer alle drie** — logboeken leggen uit wat er gebeurd is, metreken tonen trends en triggeren waarschuwingen, traces tonen waar tijd is besteed aan serviceoverschrijdingen. Een zonder de ander laat blindekken.

2. **Alleen gestructureerde logboeken — nooit onbewerkte tekenreeksen** — `{"level":"error","service":"payments","user_id":"u123","error":"card declined"}` is opvraagbaar. `ERROR: card declined for user u123` niet. Gebruik JSON of een gestructureerde loggingbibliotheek.

3. **Loggen op grenzen, niet in logica** — loggen op invoer en uitgang van HTTP-handlers, queue-consumers en externe oproepen. Niet in pure functies of strakke lussen loggen.

4. **Voeg tracecontext toe aan elke logregel** — `trace_id`, `span_id` en `request_id` koppelen logboeken aan gedistribueerde traces. Zonder deze zijn gerelateerde logs van een specifieke aanvraag over services heen giswerk.

5. **Gebruik de vier gouden signalen als uw basislijnmetriekenset** — latentie (p50, p95, p99), verkeer (aanvragen/sec), foutpercentage (5xx%), en verzadiging (wachtrij diepte, CPU, geheugen). Geef waarschuwing voor deze voor het toevoegen van aangepaste statistieken.

6. **Histogrammen boven gemiddelden voor latentie** — gemiddelden verbergen bimodale distributies en lange staarten. Volg p95 en p99. Een p99 latentiespike met een plat gemiddelde betekent dat uw traagste gebruikers in stilte lijden.

7. **Metreken consistent benoemen** — `http_request_duration_seconds`, niet `request_time` of `latency_ms`. Volg Prometheus-naamgevingsconventies: `<namespace>_<subsystem>_<name>_<unit>`. Eenheden in de naam, basiseenheden (seconden, bytes, niet milliseconden).

8. **Instrumenteer elke externe oproep** — databasequery's, cache hits/misses, HTTP-oproepen naar derden, berichtenwachtrij publiceren/verbruiken. Dit is waar latentie accumuleert en fouten ontstaan.

9. **Stel SLO's in voordat u waarschuwingen configureert** — definieer eerst aanvaardbare foutbudget. Waarschuwen op SLO-verbrandingssnelheid, niet op onbewerkte metriekdrempels. Drempelwaarschuwingen genereren ruis; verbrandingssnelheidswaarschuwingen signaleren echte gebruikerseffecten.

10. **Vermijd hoge-cardinaliteitslabelwaarden op metreken** — `user_id` als Prometheus-label maakt één tijdreeks per gebruiker aan en crasht uw metrics-backend. Labels moeten een begrensde kardinaliteit hebben (statuscode, eindpunt, regio — niet gebruikers-ID's of UUID's).

11. **Voorbeeldtraces, niet alle traces** — 100% trace-sampling is duur. Gebruik head-based of tail-based sampling (altijd fouten samplen, een fractie van successen samplen). OpenTelemetry ondersteunt beide.

12. **Retentiebeleid is onderdeel van het ontwerp** — besluit vooraf: logboeken 30 dagen, traces 7 dagen, onbewerkte metreken 15 dagen, geaggregeerde metreken 13 maanden. Ongeplande retentie verhoogt opslagkosten en vertraagt query's.

13. **Gezondheidsendpoints zijn geen observabiliteit** — `/healthz` geeft de orchestrator aan of het proces actief is. Het vertelt u niet waarom aanvragen traag zijn. Vervang niet echte instrumentatie door gezondheidscontroles.

14. **Gebruik OpenTelemetry voor instrumentatie — vermijd leverancierspecifieke SDK's** — OTLP is het standaard exportformaat. Wissel backends (Jaeger, Honeycomb, Datadog) door de exporter te wijzigen, niet de instrumentatie.

15. **Waarschuwen op symptomen, niet op oorzaken** — waarschuwen voor "foutpercentage > 1% gedurende 5 minuten", niet "CPU > 80%". Hoge CPU is een mogelijke oorzaak; verhoogde foutpercentage is een bevestigd symptoom. Verminder waarschuwingsmoeheid door te waarschuwen voor wat gebruikers ervaren.


---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met developer-gemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
