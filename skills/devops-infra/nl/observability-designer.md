---
name: observability-designer
description: "Observabiliteits-strategie: ontwerp de drie pijlers (logs, metrics, traces), instrumenteer services, kies tooling, definieer alerteringsfilosofie, ga van reactief naar proactief monitoring"
---

# Vaardigheid Observabiliteits Designer

## Wanneer activeren
- Observabiliteits-strategie helemaal opnieuw ontwerpen
- Van logs-only naar volledige drie-pijlers observabiliteit
- Kiezen tussen observabiliteits-tools (Datadog, Grafana, Honeycomb, New Relic)
- Service instrumenteren met OpenTelemetry
- Gestructureerd logging op grote schaal instellen
- Bepalen waarop u moet waarschuwen (en wat niet)

## Wanneer NIET gebruiken
- SLO-ontwerp — use slo-architect skill first
- Runbook schrijven — use runbook-generator skill
- Beveiligings-monitoring (SIEM) — ander tooling en threat model
- Business Analytics / product metrics — use analytics-tracking skill

## Instructies

### Drie-pijlers observabiliteits-ontwerp

De drie pijlers:
1. LOGS — Wat is er gebeurd (events)
2. METRICS — Hoeveel / hoe snel (aggregaties)
3. TRACES — Waarom het gebeurde (causaliteit)

**Gestructureerde logging:** Elke log-regel = geldige JSON met timestamp, level, service, trace_id, message, context-velden.

**Sleutelmetrics:** Counters, Gauges, Histograms. USE-methode: Utilisation, Saturation, Errors. RED-methode: Rate, Errors, Duration.

**Traces-instrumentering:** Inbound HTTP, outbound calls, database queries, message queues, externe APIs.

Drie-pijlers-strategie voor mijn systeem ontwerpen met specifieke tool-aanbevelingen.

### Tooling-selectie

```
Observabiliteits-tooling voor [team/budget] kiezen.

Beheerd: Datadog (all-in-one), Honeycomb (traces), New Relic (grote gratis tier), Grafana Cloud (goedkoop)

Self-Hosted: Prometheus + Grafana + Loki + Tempo (infrastructuurkosten ~$50-200/maand, beste voor budget > $5K/maand)

Aanbeveling: altijd instrumenteren met OpenTelemetry — maakt backend-wisseling zonder codewijzigingen mogelijk.

Aanbeveling voor mijn beperkingen: [tool-stack + motivering + geschatte maandelijkse kosten]
```

### Implementatie gestructureerde logging

```
Gestructureerde logging voor [service] implementeren.

Taal/framework: [Node.js/Express / Python/FastAPI / Go / Java/Spring]
Bestemming: [CloudWatch / Datadog / Elasticsearch / stdout (voor k8s)]

Normen:
- Geldige JSON in uitvoer
- ISO 8601 timestamp
- Niveaus: DEBUG/INFO/WARN/ERROR
- Context: user_id, request_id, duration_ms, error_code
- Correlatie: trace_id om logs, metrics en traces te koppelen

Gestructureerde logging implementeren met best practices voor mijn taal/framework.
```

### Waarschuwngs-filosofie

```
Waarschuwngs-filosofie voor [systeem] definiëren.

Waarop te waarschuwen:
- Echte storingen beïnvloeden gebruikers
- Meetbare prestatie-degradatie (p99 latency, error rate)
- Uitputting van bronnen (disk, memory, DB-verbindingen)

Niet waarschuwen op:
- Log-waarschuwingen (weinig nuttig op schaal)
- Metrics zonder actie (speler-waarschuwingen)
- Theoretische drempels zonder echte gebruikersimpact

Regels voor goede waarschuwingen:
- Hanteerbaar: waarschuwing zegt exact wat te doen
- Op symptomen gebaseerd, niet oorzaken (op latency waarschuwen, niet CPU)
- Weinig onwaar-positieven: uitgeputte on-call = waarschuwingen genegeerd

Waarschuwngsset voor mijn systeem ontwerpen.
```

---
