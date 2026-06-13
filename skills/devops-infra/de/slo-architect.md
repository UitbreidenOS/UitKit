---
name: slo-architect
description: "SLO-Entwurf: SLIs definieren, Zuverlässigkeitsziele festlegen, Error Budgets berechnen, Alerting-Richtlinien entwerfen, Runbooks erstellen — Google SRE-Methodologie"
---

> 🇩🇪 Deutsche Version. [Englische Version](../slo-architect.md).

# SLO-Architect-Fähigkeit

## Wann aktivieren
- Definition von Service Level Objectives (SLOs) für einen Service
- Berechnung von Error Budgets und Einstellung von Burn Rate Alerts
- Übergang von reaktivem "Läuft es?" Monitoring zu proaktivem SLO-basiertem Alerting
- Schreiben von SLAs für Kunden basierend auf internen SLOs
- Aufbau einer Zuverlässigkeitskultur von Grund auf

## Wann NICHT verwenden
- Spezifische Monitoring-Tool-Konfiguration (verwenden Sie Tool-Dokumentation für Prometheus/Datadog-Syntax)
- Incident-Response-Verfahren — verwenden Sie die Runbook-Fähigkeit
- Reines Uptime-Monitoring — Uptime Robot ist einfacher für grundlegende Überprüfungen

## Anweisungen

### Definieren Sie SLIs (Service Level Indicators)

```
Definieren Sie SLIs für diesen Service.

Service: [beschreiben — API / Web-App / Data Pipeline / Payment Processor]
Benutzer: [wer hängt von diesem Service ab?]
Was "funktioniert" für Benutzer bedeutet: [ihre Erfahrung bei guter Leistung]

Häufige SLI-Typen:
1. Verfügbarkeit: % der Zeit, die der Service erreichbar ist
   Messung: erfolgreiche Anfragen / Gesamtanfragen
   
2. Latenz: wie schnell Antworten kommen
   Messung: % Anfragen, die unter Schwellwert abgeschlossen sind (z.B. p99 < 200ms)
   
3. Error Rate: % der fehlgeschlagenen Anfragen
   Messung: Error-Antworten / Gesamtantworten
   
4. Durchsatz: Kapazität, Last zu verarbeiten
   Messung: Anfragen pro Sekunde verarbeitet
   
5. Dateneaktualität: wie veraltet sind die Daten?
   Messung: % Abfragen, die Daten < X Minuten alt zurückgeben
   
6. Korrektheit: sind Ergebnisse korrekt?
   Messung: % Ausgaben, die dem Erwarteten entsprechen (erfordert synthetisches Probing)

Für meinen Service: 2-4 SLIs mit exakten Messbarkeitformeln definieren.
```

### Legen Sie SLO-Ziele fest

```
Helfen Sie mir, angemessene SLO-Ziele festzulegen.

Service-Kritikalität: [kritisch / wichtig / nur-intern]
Aktuelle Zuverlässigkeits-Baseline: [Uptime / Error-Rate der letzten 90 Tage]
Geschäftsauswirkung von Ausfallzeiten: [beschreiben — Umsatzverlust / Kundenauswirkung]
Team-Reife: [keine SRE / kleines SRE-Team / erfahrenes SRE]

SLO-Ziel-Orientierung:
- 99% (2 Neunen): ~7,3 Stunden Ausfallzeit/Monat — OK für interne Tools
- 99,5%: ~3,6 Stunden Ausfallzeit/Monat — typisch B2B SaaS
- 99,9% (3 Neunen): ~43 Minuten Ausfallzeit/Monat — Standard für kundenfazig
- 99,95%: ~21 Minuten — hohe Zuverlässigkeitserwartung
- 99,99% (4 Neunen): ~4,3 Minuten — Zahlungen, Gesundheitswesen, kritische Infrastruktur

Regel: SLO sollte erreichbar aber aussagekräftig sein. Niemals 100% setzen — es ist unerreichbar und schafft falsche Anreize.

Für meinen Service: was ist ein angemessenes SLO-Ziel und warum?
```

### Error Budget Berechnung

```
Berechnen Sie Error Budget für diese SLOs.

SLO 1: [Metrik] = [X]% über [28 Tage / Kalendermonat / Rolling]
SLO 2: [Metrik] = [X]%

Error Budget = 1 - SLO-Ziel
Für 28-Tage-Fenster:
- 99,9% SLO → 0,1% Error Budget = 40,3 Minuten Ausfallzeit erlaubt
- 99,5% SLO → 0,5% Error Budget = 3,36 Stunden erlaubt

Aktuelle Error Budget Verbrauch:
- Wie viel Budget haben wir bisher in dieser Periode genutzt? [%]
- Wie viele Tage bleiben in der Periode?
- Sind wir auf Kurs, um im Budget zu bleiben?

Falls über Budget: Was sollten wir stoppen (neue Feature-Launches), bis Budget sich erholt?
Falls unter Budget: Welches Risiko können wir eingehen (geplante Wartung, Experimente)?
```

### Alerting-Entwurf (Burn Rate Alerts)

```
Entwerfen Sie Burn Rate Alerts für dieses SLO.

SLO: [X]% Verfügbarkeit über 28 Tage
Error Budget: [berechnet oben]

Alerting-Strategie (Google SRE Handbook):
1. Fast Burn (kritisch): Budget 14x schneller verbrauchend als normal
   → Feuert in: 1 Stunde anhaltenden Burn
   → Alert: sofort pagen, wird Budget in ~2 Tagen erschöpfen
   
2. Slow Burn (Warnung): Budget 6x schneller verbrauchend als normal  
   → Feuert in: 6 Stunden anhaltenden Burn
   → Alert: Ticket, Review beim nächsten Standup, nicht wecken
   
3. Budget bei X%: absoluter Schwellwert-Alert
   → Wenn 50% des Budgets in den ersten 14 Tagen verbraucht sind
   → Alert: "auf Kurs, Budget zu erschöpfen, überprüfen Sie Geschwindigkeit"

Für mein SLO, generieren:
- Alert-Schwellenwerte (tatsächliche Zahlen, nicht X)
- Alert-Namen und Severity-Stufen
- On-Call-Eskalationsrichtlinie
- Runbook-Referenz für jeden Alert-Typ
```

### SLO-Dashboard-Entwurf

```
Entwerfen Sie ein SLO-Dashboard für [Service].

Wichtigste Stakeholder die dies sehen:
- Engineering: müssen Error Budget und Burn Rate sehen
- Product: müssen Zuverlässigkeitstrends, Auswirkung auf Benutzer sehen
- Leadership: müssen Gesamtgesundheit, nichts zu technisch sehen

Dashboard-Abschnitte:
1. Aktueller SLO-Status: grün/gelb/rot für jeden SLO
2. Verbleibend Error Budget: Gauge-Diagramm, % verbleibend diesen Monat
3. Burn Rate: 1-Stunden- und 6-Stunden-Burn Rate vs. Ziel
4. Historischer Trend: 90-Tages-SLO-Performance
5. Incident Korrelation: jüngste Incidents und ihr Budget-Auswirkung

Werkzeuge: [Grafana / Datadog / Google Cloud Monitoring / New Relic / Honeycomb]
```

## Beispiel

**Benutzer:** Ich habe eine REST-API, die zahlende Kunden nutzen. Keine SLOs aktuell, nur "läuft es" Alerting. Wo fange ich an?

**Claude's SLO-Starter-Pack:**

**Schritt 1 — 3 SLIs definieren:**
- Verfügbarkeit: `erfolgreiche_anfragen / gesamt_anfragen` (ausschließen 400s, 500s + Timeouts als Fehler zählen)
- Latenz: `p99_response_time < 500ms` als Anteil aller Anfragen
- Error Rate: `5xx_responses / total_responses`

**Schritt 2 — initiale SLO-Ziele setzen (konservativ):**
- Verfügbarkeit: 99,5% (3,6 Stunden Budget/Monat)
- p99 Latenz: 99% der Anfragen unter 500ms
- Error Rate: < 0,5%

**Schritt 3 — Ein Alert zum Starten:**
Burn Rate Alert: wenn Verfügbarkeit unter 99,5% für 1 Stunde fällt → On-Call-Ingenieur pagen.

**Schritt 4 — nach 90 Tagen überprüfen:**
Schauen Sie auf tatsächliche Performance vs. SLO. Wenn Sie nie Error Budget genutzt haben, könnte das Ziel zu locker sein. Wenn Sie ständig über sind, muss das Ziel angepasst oder investiert werden.

---
