# Multi-Agent-Systeme: Produktionsbereitschafts-Checkliste

Umfassende Checkliste, um sicherzustellen, dass ein Multi-Agent-System produktionsbereit ist — Beobachtbarkeit, Zuverlässigkeit, Kostenkontrolle und Incident-Response abdeckend.

---

## Checkliste vor der Bereitstellung

### Architektur

- [ ] Agenten haben nicht überlappende Rollen (kein Domänen-Überlappung)
- [ ] Tool-Zugriff folgt dem Prinzip des geringsten Privilegs (jeder Agent hat nur benötigte Tools)
- [ ] Orchestrierungs-Topologie ist dokumentiert (DAG, Blackboard, Supervisor, etc.)
- [ ] Zirkuläre Abhängigkeiten werden erkannt und abgelehnt
- [ ] Timeout- und Wiederholungsrichtlinien für alle Agenten definiert
- [ ] Fehlerwiederherstellungsstrategie definiert (Wiederholen, Eskalieren, Kompensieren)

### Tests

- [ ] Unit-Tests für jeden Agent (gemockte Tools)
- [ ] Integrationstests für Agent-Handoffs (mit echter Inter-Agent-Kommunikation)
- [ ] End-to-End-Tests für vollständige Workflows (50+ Testfälle)
- [ ] Chaos-Tests: Agent-Fehler, Netzwerkverzögerungen, Timeouts injizieren
- [ ] Last-Tests: Leistung mit gleichzeitigen Anfragen überprüfen
- [ ] Kostensimulation: Token/Kosten für typische Workflows schätzen

### Zustandsverwaltung

- [ ] Blackboard-Schema ist definiert und validiert
- [ ] Zustandspersistierungs-Mechanismus (Datei, DB) getestet
- [ ] Versionsverfolgung und Konfliktlösung getestet
- [ ] Lock-Mechanismus verhindert gleichzeitige Schreibvorgänge
- [ ] Wiederherstellung aus Teilfehlern getestet

### Beobachtbarkeit

- [ ] Trace-Korrelations-ID über alle Agent-Aufrufe verteilt
- [ ] Protokollierung deckt alle kritischen Pfade ab (Erfolg, Wiederholung, Fehler, Eskalation)
- [ ] Metriken für Latenz, Tokens, Kosten erfasst
- [ ] Agent-Aufruf-Telemetrie exportiert (Datadog, Prometheus, etc.)
- [ ] Sampling-Strategie definiert (100% Trace oder Beispiel?)

### Zuverlässigkeit

- [ ] Timeouts für alle Agent-Aufrufe eingestellt (mit Monitoring-Alerts)
- [ ] Wiederholungslogik mit exponentiellem Backoff (max 3 Versuche)
- [ ] Dead-Letter-Queue für nicht wiederherstellbare Fehler
- [ ] SLO für Verfügbarkeit und Latenz definiert
- [ ] Fehlerbudget berechnet und überwacht
- [ ] Eskalationswege definiert (E-Mail, Slack, PagerDuty)

### Kostenkontrolle

- [ ] Token-Budget pro Agent und insgesamt definiert
- [ ] Kostenalerts eingestellt (warnen wenn > 80% des Budgets, Fehler wenn > 100%)
- [ ] Modellauswahl optimiert (Haiku wo möglich, Opus nur wenn nötig)
- [ ] Caching-Strategie definiert (Ergebnisse für gleiche Eingaben wiederverwenden)
- [ ] Input-Tokenisierungs-Audit (keinen unnötigen Kontext weitergeben)

### Dokumentation

- [ ] README erklärt Orchestrierungs-Fluss mit Diagramm
- [ ] Agent-Rollen dokumentiert (Zweck, Domäne, Tools, SLA)
- [ ] Troubleshooting-Anleitung für häufige Fehler
- [ ] Runbook für Incident-Response und Eskalation
- [ ] Entwickler-Anleitung zum Hinzufügen neuer Agenten oder Workflows

---

## Überwachung und Alerting

### Wichtige Metriken

**Verfügbarkeit:**
```
success_rate = (successful_runs / total_runs) × 100%
Ziel: 99.5% (Fehlerbudget 0.5%)
Alert-Schwellwert: < 95%
```

**Latenz:**
```
p50_latency_ms = 50tes Perzentil der Laufzeitdauer
p99_latency_ms = 99tes Perzentil der Laufzeitdauer
Ziel: p99 < 5 Minuten
Alert-Schwellwert: p99 > 4 Minuten
```

**Kosten:**
```
cost_per_run_cents = total_tokens × cost_per_token
Ziel: < $1.00 pro Ausführung
Alert-Schwellwert: > $0.80 pro Ausführung
```

**Agent-spezifisch:**
```
Für jeden Agent :
├─ call_count (Gesamtaufrufe gemacht)
├─ success_rate (% erfolgreich)
├─ avg_latency_ms
├─ p99_latency_ms
├─ avg_tokens
└─ cost_cents
```

### Alert-Regeln

```json
{
  "alerts": [
    {
      "name": "success_rate_low",
      "condition": "success_rate < 95%",
      "severity": "page",
      "window": "5 minutes"
    },
    {
      "name": "latency_spike",
      "condition": "p99_latency_ms > 4 minutes",
      "severity": "warning",
      "window": "5 minutes"
    },
    {
      "name": "cost_spike",
      "condition": "cost_per_run_cents > 80",
      "severity": "warning",
      "window": "1 hour"
    },
    {
      "name": "agent_timeout",
      "condition": "agent.latency_ms > timeout_ms × 0.9",
      "severity": "warning",
      "window": "5 minutes"
    },
    {
      "name": "error_budget_depleted",
      "condition": "error_budget_remaining < 0.1%",
      "severity": "critical",
      "window": "1 day"
    }
  ]
}
```

---

## Incident-Response

### Incident-Schweregrad-Definitionen

**SEV1 : Vollständiger Ausfall**
- Erfolgsquote < 90% ODER Latenz > 10 Minuten
- Auswirkung: Benutzer können Workflows nicht durchführen
- Reaktionszeit: < 5 Minuten
- Eskalation: Benachrichtige alle Ingenieure im Support

**SEV2 : Signifikante Beeinträchtigung**
- Erfolgsquote 90-95% ODER Latenz > 5 Minuten
- Auswirkung: Einige Benutzer betroffen, teilweise Funktionalität
- Reaktionszeit: < 15 Minuten
- Eskalation: Benachrichtige Support-Ingenieur

**SEV3 : Geringfügige Probleme**
- Erfolgsquote > 95% UND Latenz < 5 Minuten
- Kostenspitze (> 50% über Baseline)
- Auswirkung: Gering, Workaround verfügbar
- Reaktionszeit: < 1 Stunde
- Eskalation: Zu Slack melden, während Geschäftszeiten bearbeiten

### Runbook: SEV1-Antwort

```
1. INCIDENT ERKLÄREN (1 min)
   └─ Benachrichtige Support-Ingenieur
   └─ Erstelle #incidents-Thread
   └─ Weise Incident Commander (IC) zu

2. AUSWIRKUNG BEWERTEN (5 min)
   └─ Welche Workflows schlagen fehl? (% betroffen)
   └─ Welche Agenten schlagen fehl?
   └─ Wie lange passiert das bereits?
   └─ Umsatzauswirkung?

3. UNTERSUCHEN (5-15 min)
   ├─ Agent-Logs überprüfen (letzte Aufrufe)
   ├─ Blackboard-Status überprüfen (kohärent?)
   ├─ Infrastruktur überprüfen (Verfügbarkeit, Latenz)
   ├─ Abhängigkeiten überprüfen (APIs die wir aufrufen)
   └─ Modellverfügbarkeit überprüfen (ist Anthropic API verfügbar?)

4. LINDERN (5-30 min, wähle am schnellsten)
   ├─ Option A: Feature-Flag deaktivieren (instantan)
   ├─ Option B: Agent rollback (rollback von main)
   ├─ Option C: Ressourcen hochfahren (wenn Kapazitätsproblem)
   └─ Option D: Hotfix (wenn einfache Code-Änderung)

5. WIEDERHERSTELLUNG PRÜFEN (5 min)
   ├─ Metriken 30 Minuten überwachen
   ├─ Wenn success_rate > 99%, Wiederherstellung erklären
   └─ Falls immer noch fehlerhaft, zur UNTERSUCHUNG zurück

6. KOMMUNIZIEREN
   ├─ Interne Updates alle 30 Minuten
   └─ Status-Seiten-Update für Kunden
```

### Häufige Ursachen und Korrektionen

**Agent-Timeout (einzelner Agent langsam) :**
```
Grundursache: System-Prompt zu ausführlich, oder Modell langsam
Korrektur:
  1. Modell/Temperatur-Einstellungen überprüfen
  2. System-Prompt reduzieren (ausführliche Preamble entfernen)
  3. Input-Größe reduzieren (weniger Kontext-Tokens)
  4. Timeout-Schwellwert senken und schnell fehlschlagen
```

**Zustandsinkohärenz (Blackboard korrupt) :**
```
Grundursache: Gleichzeitiger Schreibkonflikt nicht erkannt
Korrektur:
  1. Lesen Sie den letzten konsistenten Blackboard-Snapshot
  2. Zu bekannter guter Version zurückrollen
  3. Ausstehende Tasks vom Snapshot abspielen
  4. Untersuchen Sie Konflikt-Erkennungslogik
```

**Kostenspitze (Tokens Budget überschritten) :**
```
Grundursache: Längere Inputs, Wiederholungsstürme, oder Modellwechsel
Korrektur:
  1. Input-Größe-Limit hinzufügen (Context kürzen)
  2. Token-Budget-Durchsetzung hinzufügen (schnell fehlschlagen wenn > 80%)
  3. Zu billigerem Modell wechseln (Haiku statt Opus)
  4. Caching implementieren (Ergebnisse für gleiche Inputs wiederverwenden)
```

**Orchestrierungs-Blockade (Agenten warten unbegrenzt) :**
```
Grundursache: Zirkuläre Abhängigkeit oder Agent schreitet nicht voran
Korrektur:
  1. Orchestrierungs-DAG auf Zyklen überprüfen
  2. Agent-Logs überprüfen (ist es blockiert oder nur langsam?)
  3. Timeout erzwingen und eskalieren
  4. Abhängigkeitsgraph überprüfen und Zyklen entfernen
```

---

## Bereitstellungsstrategie

### Canary-Bereitstellung

```
Phase 1: In Canary bereitstellen (5% Traffic)
├─ Erfolgsquote, Latenz, Kosten überwachen
├─ Ziel: 1 Stunde
└─ Falls Metriken stabil → zur Phase 2

Phase 2: Bei 25% Traffic bereitstellen
├─ 1 Stunde überwachen
└─ Falls Metriken stabil → zur Phase 3

Phase 3: Bei 100% Traffic bereitstellen
├─ 4 Stunden überwachen
└─ Falls Metriken stabil → als GA markieren
```

### Rollback-Plan

```
Falls Metriken während Canary degradieren:
├─ Zu vorheriger Agent-Version zurückrollen
├─ Zu vorheriger Orchestrierungs-Konfiguration zurückrollen
└─ Falls Rollback erfolgreich, sicher erklären

Behalten Sie letzte 5 Agent-Versionen in Production (rollback-ready).
```

---

## Kostenoptimierung

### Modellauswahl pro Agent

| Agent-Typ | Zweck | Empfohlenes Modell | Grund |
|-----------|---------|-------------------|--------|
| Klassifizierer | Input kennzeichnen oder kategorisieren | Haiku | Schnell, billig, gering Reasoning |
| Zusammenfasser | Text kondensieren | Sonnet | Ausgeglichene Geschwindigkeit/Qualität |
| Raisonneur | Komplexe Analyse | Opus | Reasoning, Synthese |
| Abrufer | Suche/Lookup | Haiku | Gering Reasoning |

### Token-Reduktions-Strategien

1. **Context kürzen:** Nur letzte N Tokens weitergeben (nicht vollständige Geschichte)
2. **Geschichte zusammenfassen:** Statt vollständiger Context, Zusammenfassung + letzte 3 Umdrehungen
3. **Cache-Ergebnisse:** Agent-Ausgaben für identische Inputs wiederverwenden
4. **Batch-Verarbeitung:** Mehrere Anfragen zusammen verarbeiten (Overhead amortisieren)

### Beispiel: Kostenoptimierung

```
Vor:
├─ Durchschnittliche Tokens pro Ausführung: 12,000
├─ Kosten pro Ausführung: $1.20
├─ Kosten für 10,000 Ausführungen/Monat: $12,000

Optimierungen:
├─ Wechsel Forscher Opus zu Sonnet: -30% Tokens
├─ Cache implementieren (80% Cache-Hit-Rate): -80% Aufrufe
├─ Context auf max 500 Tokens kürzen: -50% Tokens

Nach:
├─ Durchschnittliche Tokens pro Ausführung: 2,400 (80% gespart auf 80% der Aufrufe)
├─ Kosten pro Ausführung: $0.24
├─ Kosten für 10,000 Ausführungen/Monat: $2,400
└─ Einsparungen: $9,600/Monat (80% Kostenreduktion)
```

---

## Compliance und Governance

### Audit-Protokollierung

Alle Agent-Entscheidungen und Zustandsmutationen müssen protokolliert werden:

```json
{
  "timestamp": "2026-06-15T14:20:00Z",
  "request_id": "req_abc123",
  "agent": "decision_agent",
  "action": "approve_order",
  "input": {"order_id": "o_789", "amount": 299.99},
  "output": {"approved": true, "reason": "..."},
  "model": "claude-opus-4-20250514",
  "tokens_used": 450,
  "cost_cents": 12
}
```

Standort: `.claude/audit-log.jsonl` (nur Anhänge, Manipulation-evidentes Hashing).

### Datenschutz

- [ ] Agent-Prompts enthalten PII nicht ohne Maskierung
- [ ] Agent-Ausgaben geben Benutzerdaten nicht preis
- [ ] Gesprächs-Verlauf ist bei Rast verschlüsselt
- [ ] Zugriffslogs für wer was wann abgefragt hat
- [ ] Aufbewahrungsrichtlinie (alte Traces nach 90 Tagen löschen)

### Sicherheits-Einschränkungen

- [ ] Agent-Ausgabe gegen Sicherheits-Guardrails validiert
- [ ] Gefährliche Aktionen (löschen, ändern) erfordern explizite Genehmigung
- [ ] Jailbreak-Versuche erkannt und protokolliert
- [ ] Rate-Limiting verhindert Missbrauch (max N Anfragen pro Benutzer pro Stunde)

---

## Langfristige Operationen

### Kontinuierliche Verbesserung

1. **Wöchentliche Überprüfungen:**
   - Fehlerquote, Latenz- und Kosten-Trends überprüfen
   - Top 10 Fehler und Ausfälle überprüfen
   - Optimierungen für nächste Woche planen

2. **Monatliche Überprüfungen:**
   - Fehlerbudget-Burnrate analysieren
   - Agent-Leistung überprüfen (welcher Agent trägt am meisten zu Latenz/Kosten bei?)
   - Architektur-Verbesserungen planen

3. **Vierteljährliche Überprüfungen:**
   - Metriken mit SLO-Zielen vergleichen
   - Modell-Upgrades planen (neue Claude-Versionen)
   - Neue Agenten oder Workflows bewerten

### Runbook-Updates

Nach jedem SEV1- oder SEV2-Incident:
1. Grundursache im RCA dokumentieren
2. Runbook mit Präventions-/Wiederherstellungsschritten aktualisieren
3. Team auf neue Verfahren schulen
4. Regressions-Testfall hinzufügen

---
