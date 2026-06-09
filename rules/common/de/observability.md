# Observability-Regeln

## Anwendbar auf
Alle Backend-Dienste, Worker und Infrastruktur — jedes System, das in der Produktion läuft.

## Regeln

1. **Logs, Metriken und Traces sind unterschiedliche Signale — instrumentiere alle drei** — Logs erklären, was passiert ist, Metriken zeigen Trends und lösen Warnungen aus, Traces zeigen, wo Zeit über Service-Grenzen hinweg verbracht wurde. Ohne die anderen entsteht eine Überwachungslücke.

2. **Nur strukturierte Logs — nie rohe Zeichenketten** — `{"level":"error","service":"payments","user_id":"u123","error":"card declined"}` ist abfragbar. `ERROR: card declined for user u123` ist nicht abfragbar. Verwende JSON oder eine strukturierte Logging-Bibliothek.

3. **Logs an Grenzen, nicht innerhalb der Logik** — protokolliere den Ein- und Austritt von HTTP-Handlern, Queue-Consumern und externen Aufrufen. Protokolliere nicht innerhalb reiner Funktionen oder enger Schleifen.

4. **Trace-Kontext in jeder Log-Zeile einfügen** — `trace_id`, `span_id` und `request_id` verknüpfen Logs mit verteilten Traces. Ohne sie ist die Korrelation einer Log-Zeile mit einer bestimmten Anfrage über Services hinweg Raterei.

5. **Verwende die vier goldenen Signale als dein Basis-Metrik-Set** — Latenz (p50, p95, p99), Traffic (Anfragen/Sekunde), Fehlerrate (5xx%) und Sättigung (Queue-Tiefe, CPU, Speicher). Warne bei diesen, bevor du benutzerdefinierte Metriken hinzufügst.

6. **Histogramme statt Durchschnittswerte für Latenz** — Durchschnittswerte verbergen bimodale Verteilungen und lange Schwänze. Verfolgung p95 und p99. Ein p99-Latenz-Spitzenwert mit flachem Durchschnitt bedeutet, dass deine langsamsten Benutzer in aller Stille leiden.

7. **Konsistent benannte Metriken** — `http_request_duration_seconds`, nicht `request_time` oder `latency_ms`. Folge Prometheus-Benennungskonventionen: `<namespace>_<subsystem>_<name>_<unit>`. Einheiten im Namen, Basiseinheiten (Sekunden, Bytes, nicht Millisekunden).

8. **Instrumentiere jeden externen Aufruf** — Datenbankabfragen, Cache-Hits/Misses, HTTP-Aufrufe zu Drittanbietern, Publish/Consume in Message Queues. Hier sammelt sich Latenz an und hier entstehen Fehler.

9. **Definiere SLOs bevor du Warnungen konfigurierst** — definiere zunächst das akzeptable Fehlerbudget. Warne bei SLO-Brennrate, nicht bei rohen Metrik-Schwellwerten. Schwellwert-Warnungen erzeugen Rauschen; Brennraten-Warnungen signalisieren echte Benutzerauswirkung.

10. **Vermeide hochkardinale Label-Werte bei Metriken** — `user_id` als Prometheus-Label erzeugt eine Zeitreihe pro Benutzer und zerstört deinen Metriken-Backend. Labels sollten begrenzte Kardinalität haben (Statuscode, Endpoint, Region — nicht Benutzer-IDs oder UUIDs).

11. **Samplingtraces, nicht alle Traces** — 100%-Trace-Sampling ist teuer. Verwende Head-Based oder Tail-Based Sampling (sample Fehler immer, sample einen Bruchteil der Erfolge). OpenTelemetry unterstützt beides.

12. **Aufbewahrungsrichtlinie ist Teil des Designs** — entscheide im Voraus: Logs 30 Tage, Traces 7 Tage, Rohe Metriken 15 Tage, aggregierte Metriken 13 Monate. Ungeplante Aufbewahrung bläht Speicherkosten auf und verlangsamt Abfragen.

13. **Health-Endpoints sind nicht Observability** — `/healthz` zeigt dem Orchestrator, ob der Prozess aktiv ist. Es sagt dir nicht, warum Anfragen langsam sind. Verwende Health-Checks nicht als Ersatz für echte Instrumentierung.

14. **Verwende OpenTelemetry für Instrumentierung — vermeide herstellerspezifische SDKs** — OTLP ist das Standard-Exportformat. Wechsle Backends (Jaeger, Honeycomb, Datadog), indem du den Exporter änderst, nicht die Instrumentierung.

15. **Warne bei Symptomen, nicht bei Ursachen** — warne bei "Fehlerrate > 1% für 5 Minuten", nicht bei "CPU > 80%". Hohe CPU ist eine mögliche Ursache; erhöhte Fehlerrate ist ein bestätigtes Symptom. Reduziere Warnermüdung durch Warnungen bei dem, was Benutzer erleben.


---

> **Arbeite mit uns:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir bauen KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
