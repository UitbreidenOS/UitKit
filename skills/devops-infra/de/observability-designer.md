---
name: observability-designer
description: "Observability-Strategie: drei Säulen (Logs, Metriken, Traces), Services instrumentieren, Tooling wählen, Alerting-Philosophie definieren, vom reaktiven zum proaktiven Monitoring"
---

# Fähigkeit Observability Designer

## Wann aktivieren
- Observability-Strategie von Grund auf entwerfen
- Von Logs-only zu vollständiger Drei-Säulen-Observability
- Zwischen Observability-Tools entscheiden (Datadog, Grafana, Honeycomb, New Relic)
- Service mit OpenTelemetry instrumentieren
- Strukturiertes Logging im großen Maßstab einrichten
- Definieren, worauf Alerting erfolgen soll (und was nicht)

## Wann NICHT verwenden
- SLO-Design — zuerst slo-architect-Fähigkeit verwenden
- Runbook-Schreiben — runbook-generator-Fähigkeit verwenden
- Sicherheits-Monitoring (SIEM) — unterschiedliche Tools und Threat Model
- Business Analytics / Produktmetriken — analytics-tracking-Fähigkeit verwenden

## Anweisungen

### Drei-Säulen-Observability-Design

Die drei Säulen:
1. LOGS — Was passiert ist (Ereignisse)
2. METRICS — Wie viel / wie schnell (Aggregationen)
3. TRACES — Warum es passiert ist (Kausalität)

**Strukturiertes Logging:** Jede Log-Zeile = gültiges JSON mit timestamp, level, service, trace_id, message, Kontextfelder.

**Schlüsselmetriken:** Counters, Gauges, Histograms. USE-Methode: Utilisation, Saturation, Errors. RED-Methode: Rate, Errors, Duration.

**Traces-Instrumentierung:** Inbound HTTP, Outbound-Aufrufe, Datenbank-Abfragen, Message Queues, externe APIs.

Drei-Säulen-Strategie für mein System mit spezifischen Tool-Empfehlungen entwerfen.

### Tooling-Auswahl

```
Observability-Tooling für [Team/Budget] wählen.

Managed: Datadog (All-in-One), Honeycomb (Traces), New Relic (großzügiger Free Tier), Grafana Cloud (günstig)

Self-Hosted: Prometheus + Grafana + Loki + Tempo (Infrastruktur-Kosten ~$50-200/Monat, beste für Budget > $5K/Monat)

Empfehlung: immer mit OpenTelemetry instrumentieren — ermöglicht Backend-Wechsel ohne Code-Änderungen.

Empfehlung für meine Einschränkungen: [Tool-Stack + Begründung + geschätzte monatliche Kosten]
```

### Implementierung strukturiertes Logging

```
Strukturiertes Logging für [Service] implementieren.

Sprache/Framework: [Node.js/Express / Python/FastAPI / Go / Java/Spring]
Ziel: [CloudWatch / Datadog / Elasticsearch / stdout (für k8s)]

Standards:
- Gültiges JSON in der Ausgabe
- ISO 8601 Timestamp
- Level: DEBUG/INFO/WARN/ERROR
- Kontext: user_id, request_id, duration_ms, error_code
- Korrelation: trace_id zum Verbinden von Logs, Metriken und Traces

Strukturiertes Logging mit Best Practices für meine Sprache/Framework implementieren.
```

### Alerting-Philosophie

```
Alerting-Philosophie für [System] definieren.

Was alerten:
- Echte Ausfälle beeinflussen Benutzer
- Messbare Performance-Degradation (p99 latency, error rate)
- Ressourcen-Erschöpfung (Disk, Memory, DB-Verbindungen)

Nicht alerten:
- Log-Warnungen (wenig nützlich im großen Maßstab)
- Metriken ohne Aktion (Zuschauer-Alerts)
- Theoretische Schwellen ohne echte Benutzer-Auswirkung

Regeln für gute Alerts:
- Handhabbar: Alert sagt genau, was zu tun ist
- Symptom-basiert, nicht ursachenbasiert (auf Latenz, nicht CPU alerten)
- Wenige Fehlalarme: müde On-Call = Alerts werden ignoriert

Alerting-Set für mein System entwerfen.
```

---
