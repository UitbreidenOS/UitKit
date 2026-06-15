# Agentisches Produktions-Runbook

Operationales Playbook zur Überwachung, Benachrichtigung und Wiederherstellung von Multi-Agent-Workflows in der Produktion — definiert SLOs, Incident-Reaktion, Rollback-Verfahren und Eskalationspfade.

---

## Wann verwenden

- Ausführung von Multi-Agent-Workflows in Produktion mit Live-Benutzeranfragen oder kritischen Batch-Jobs
- Workflows mit SLO-Anforderungen (Antwortzeit, Verfügbarkeit, Kosten)
- Systeme, die Konsistenz unter partiellen Ausfällen aufrechterhalten müssen
- Bereitstellungen, die automatische Wiederherstellung oder manuelle Eskalationsverfahren erfordern

Nicht verwenden für experimentelle oder nur für Entwicklung bestimmte Workflows oder einmalige Batch-Jobs ohne Echtzeitbeschränkungen.

---

## SLOs und Fehler-Budgets

Definieren Sie Verfügbarkeits- und Performance-Ziele für den Multi-Agent-Workflow:

```json
{
  "workflow": "research_and_synthesize",
  "slo_version": "2026-06",
  "slos": [
    {
      "slo_id": "slo_availability",
      "metric": "workflow_success_rate",
      "target": "99.5%",
      "window": "30_days",
      "error_budget_pct": 0.5,
      "alert_threshold": "95%"
    },
    {
      "slo_id": "slo_latency_p99",
      "metric": "workflow_latency_ms",
      "target": 300000,
      "percentile": 99,
      "window": "7_days",
      "alert_threshold": 250000
    },
    {
      "slo_id": "slo_cost",
      "metric": "cost_per_workflow_cents",
      "target": 150,
      "window": "30_days",
      "alert_threshold": 130,
      "direction": "lower_is_better"
    }
  ],
  "error_budget_tracking": {
    "budget_available_pct": 0.42,
    "budget_consumed_pct": 0.08,
    "budget_remaining_days": 28,
    "burn_rate_pct_per_day": 0.0027
  }
}
```

**SLO-Regeln:**
- Verfügbarkeit: Prozentsatz der Workflows, die erfolgreich abgeschlossen werden
- Latenz: Antwortzeit von Anfrage zu Finalausgabe (p99 ist typisch)
- Kosten: durchschnittliche Token/API-Aufrufe pro Workflow
- Fehler-Budget: wie viel Ausfall ist akzeptabel vor On-Call-Paging

---

## Überwachung und Benachrichtigung

Echtzeitmetriken aus `.claude/workflow-metrics.jsonl`:

```json
{
  "metric_id": "metric_xyz789",
  "workflow": "research_and_synthesize",
  "timestamp": "2026-06-15T14:20:00Z",
  "execution_id": "exec_abc123",
  "metrics": {
    "workflow_status": "completed",
    "success": true,
    "latency_ms": 897000,
    "total_tokens": 24200,
    "cost_cents": 145,
    "agent_calls": 3,
    "retries": 0,
    "errors": 0,
    "timeout_count": 0
  },
  "agent_metrics": [
    {
      "agent": "researcher",
      "status": "completed",
      "latency_ms": 929000,
      "input_tokens": 2400,
      "output_tokens": 1850,
      "cost_cents": 78,
      "tool_calls": 5
    },
    {
      "agent": "analyst",
      "status": "completed",
      "latency_ms": 390000,
      "input_tokens": 3100,
      "output_tokens": 1200,
      "cost_cents": 48,
      "tool_calls": 1
    },
    {
      "agent": "writer",
      "status": "completed",
      "latency_ms": 78000,
      "input_tokens": 1800,
      "output_tokens": 890,
      "cost_cents": 19,
      "tool_calls": 0
    }
  ]
}
```

**Benachrichtigungsregeln (sofort auslösen):**

```json
{
  "alerts": [
    {
      "alert_id": "alert_workflow_failure",
      "condition": "success == false",
      "severity": "page",
      "throttle_seconds": 300,
      "action": "page_on_call"
    },
    {
      "alert_id": "alert_latency_spike",
      "condition": "latency_ms > 600000",
      "severity": "warning",
      "throttle_seconds": 600,
      "action": "log_to_slack"
    },
    {
      "alert_id": "alert_cost_spike",
      "condition": "cost_cents > 200",
      "severity": "warning",
      "throttle_seconds": 600,
      "action": "log_to_slack"
    },
    {
      "alert_id": "alert_agent_timeout",
      "condition": "any(agent_metrics.latency_ms > 300000)",
      "severity": "page",
      "action": "page_on_call"
    },
    {
      "alert_id": "alert_error_budget_exceeded",
      "condition": "burn_rate_pct_per_day > 0.01",
      "severity": "critical",
      "action": "page_engineering"
    }
  ]
}
```

---

## Incident-Reaktion

Wenn Benachrichtigung ausgelöst wird, folgen Sie diesem Playbook:

### SEV1: Workflow-Ausfall

Vollständiger Serviceausfall (success_rate < 90% oder Latenz > 10 min).

```
1. INCIDENT ERKLÄREN
   ├─ On-Call-Ingenieur pagen
   ├─ #incidents Thread erstellen
   └─ IC (Incident Commander) zuweisen

2. AUSWIRKUNGEN BEWERTEN (5 min)
   ├─ Wie viele Workflows sind fehlgeschlagen? (% des Verkehrs)
   ├─ Welche Agenten fallen aus? (alle oder spezifischer Agent?)
   ├─ Wie lange läuft dies schon?
   └─ Beeinträchtigt es Benutzer? (Umsatzauswirkung?)

3. UNTERSUCHUNG (5-15 min)
   ├─ Agent-Protokolle prüfen (letzte 30 Agent-Aufrufe)
   ├─ Blackboard-Status prüfen (ist Zustand kohärent?)
   ├─ Infrastruktur prüfen (Speicher, API-Ratenlimits)
   ├─ Agent-Modell prüfen (ist Modell verfügbar?)
   └─ Upstream-Abhängigkeiten prüfen (APIs, die wir aufrufen, sind diese aus?)

4. MITIGIEREN (kürzester Weg zur Benutzerauswirkungsreduzierung)
   ├─ Option A: Workflow deaktivieren (Feature Flag)
   ├─ Option B: Zu letzter bekannter-funktionierender Agent-Version zurücksetzen
   ├─ Option C: Ressourcen hochfahren (falls Kapazitätsproblem)
   └─ Option D: Notfallhotfix anwenden (falls einfache Behebung)

5. BEHEBEN (nach Mitigation)
   ├─ Root Cause beheben (Code, Config, Infrastruktur)
   ├─ Behebung bereitstellen
   ├─ Metriken zurück zur Normalität überprüfen
   └─ Post-Mortem planen

6. KOMMUNIZIEREN (kontinuierlich)
   ├─ Interne Updates alle 30 min
   └─ Kundenstatusseite-Updates
```

### SEV2: Agent-Timeout oder Degradation

Ein Agent durchgehend langsam (Latenz > 5 min) aber Gesamt-Erfolgsrate > 90%.

```
1. UNTERSUCHUNG (10 min)
   ├─ Welcher Agent ist langsam? (agent_metrics.latency_ms prüfen)
   ├─ Ist es durchgehend oder intermittierend langsam?
   ├─ Was hat sich geändert? (neues Modell? neuer Prompt? neue Tools?)
   └─ Blockiert es andere Agenten? (wartet Writer auf Analyst?)

2. MITIGIEREN
   ├─ Option A: Zu schnellerem Modell wechseln (Sonnet statt Opus)
   ├─ Option B: Eingabegröße reduzieren (z. B. weniger Quellen zu analysieren)
   ├─ Option C: Timeout hinzufügen und Fallback-Agent implementieren
   └─ Option D: Workflow temporär deaktivieren

3. BEHEBEN
   ├─ Root-Cause-Analyse
   ├─ Behebung bereitstellen
   └─ Vor Wiederaktivierung testen
```

### SEV3: Kostenspitze

Workflow-Kosten um > 50% erhöht (cost_cents > 150 für slo_cost=100).

```
1. UNTERSUCHUNG (5 min)
   ├─ Hat sich Token-Anzahl erhöht? (input_tokens, output_tokens)
   ├─ Hat Wiederholungsanzahl zugenommen? (retries Feld)
   ├─ Hat sich Modell geändert? (z. B. Haiku → Opus)
   └─ Hat sich Tool-Aufrufanzahl erhöht?

2. MITIGIEREN
   ├─ Option A: Input-Kontext reduzieren (weniger Quellen zu Analyst)
   ├─ Option B: Zu billierem Modell wechseln (falls Genauigkeit akzeptabel)
   ├─ Option C: Cache-Layer hinzufügen (Rechercheergebnisse nach Topic cachen)
   └─ Option D: Token-Budget implementieren (abbrechen wenn > max_tokens)

3. BEHEBEN
   ├─ System-Prompts optimieren (verbosen Preamble entfernen)
   ├─ Input-Formatierung optimieren (redundante Daten entfernen)
   └─ Explizites Token-Limit zu Agent-Aufrufen hinzufügen
```

---

## Rollback-Verfahren

### Agent-Versions-Rollback

Wenn neue Agent-Version Ausfälle verursacht:

```bash
# Current production agents
agents/roles/researcher.md@HEAD
agents/roles/analyst.md@HEAD
agents/roles/writer.md@HEAD

# Previous stable version (known to work)
agents/roles/researcher.md@v1.2.3
agents/roles/analyst.md@v1.2.3
agents/roles/writer.md@v1.2.3

# Rollback
git checkout v1.2.3 -- agents/roles/
# Verify in staging
# Deploy to production
```

### Workflow-Konfigurations-Rollback

Wenn Blackboard-Schema oder Koordinationsvertrag-Änderung Workflows bricht:

```bash
# Current config
workflows/agent-team-kickoff.md@HEAD

# Previous stable config
workflows/agent-team-kickoff.md@v1.1.0

# Rollback
git checkout v1.1.0 -- workflows/agent-team-kickoff.md
# Verify in staging
# Deploy to production
```

**Rollback-Checkliste:**
- [ ] Identifizieren, welche Komponente kaputt ist
- [ ] Frühere stabile Version identifizieren
- [ ] Behebung in Staging verifizieren (letzte 10 Ausführungen wiedergeben)
- [ ] Rollback durchführen
- [ ] Metriken 30 Minuten lang überwachen
- [ ] Wenn Metriken normal, Wiederherstellung erklären
- [ ] Wenn noch fehlschlagen, zu Engineering-Team eskalieren

---

## Eskalationspfade

```
Benutzer meldet Fehler
       ↓
Benachrichtigung ausgelöst (SEV3: Warnung)
       ↓
In #ops-alerts Slack protokollieren
       ↓
10 min auf automatische Wiederherstellung warten
       ↓
       ├─ Wiederhergestellt? → Ticket schließen, RCA planen
       │
       └─ Immer noch fehlschlag?
              ↓
         Benachrichtigung ausgelöst (SEV2: Page)
              ↓
         On-Call-Ingenieur pagen
              ↓
         Bestätigung in 5 min?
              ↓
         ├─ JA → Mitigation starten
         │
         └─ NEIN → Zu Backup On-Call eskalieren
                ↓
         Backup-Ingenieur pagen
                ↓
         Bestätigung in 5 min?
                ↓
         ├─ JA → Mitigation starten
         │
         └─ NEIN → Engineering-Manager pagen
                ↓
         SEV1 erklären
                ↓
         All-Hands Incident Response
```

---

## Post-Incident Review

Nach jedem SEV1 oder SEV2 Incident RCA planen (Post-Mortem):

```json
{
  "rca_id": "rca_2026_06_15_001",
  "incident_id": "inc_abc123",
  "workflow": "research_and_synthesize",
  "date": "2026-06-15",
  "severity": "SEV1",
  "duration_minutes": 18,
  "impact": {
    "workflows_failed": 847,
    "revenue_lost": 12340
  },
  "timeline": [
    {"time": "14:02", "event": "Alert fired: success_rate < 90%"},
    {"time": "14:05", "event": "On-call paged"},
    {"time": "14:08", "event": "Identified analyst timeout"},
    {"time": "14:15", "event": "Rolled back analyst to v1.2.3"},
    {"time": "14:20", "event": "Metrics recovered"}
  ],
  "root_cause": "Analyst agent system prompt was too verbose, causing token overflow and timeout",
  "contributing_factors": [
    "No token budget enforced at agent level",
    "Analyst timeout not caught by circuit breaker"
  ],
  "action_items": [
    {
      "action": "Add token budget to agent calls (max 5000 tokens)",
      "assigned_to": "alice@example.com",
      "due_date": "2026-06-20"
    },
    {
      "action": "Implement circuit breaker (fail fast after 3 timeouts)",
      "assigned_to": "bob@example.com",
      "due_date": "2026-06-25"
    },
    {
      "action": "Add agent latency SLI to monitoring dashboard",
      "assigned_to": "charlie@example.com",
      "due_date": "2026-06-18"
    }
  ]
}
```

---

## Beispiel: Incident-Reaktion

**Incident:** Workflow-Ausfall-Spitze am 2026-06-15 um 14:02 UTC.

```
14:02 → Alert fires: "research_and_synthesize success_rate = 85% (target 99.5%)"
14:02 → On-call paged
14:05 → IC (Alice) joins war room
14:05 → IC assess impact: ~800 workflows failed in last 3 minutes
14:07 → IC checks metrics: analyst agent latency spiked to 15 minutes (normal: 6 min)
14:09 → IC checks logs: analyst model API rate limited (hitting OpenAI quota? no, we use Anthropic)
14:10 → IC hypothesis: Analyst system prompt changed in last deploy
14:11 → IC checks git: Analyst prompt was updated 45 min ago
14:12 → IC reviews change: Added extensive reasoning preamble (200 tokens)
14:13 → IC rolls back: git revert HEAD~1 -- agents/roles/analyst.md
14:14 → IC deploys to production
14:15 → IC monitors: latency decreasing, success_rate recovering
14:20 → Metrics normal: latency = 6m, success_rate = 99.6%
14:22 → IC closes incident
14:30 → RCA scheduled for 2026-06-16

Action items:
- Add token budget enforcement (max 5000 input tokens per agent)
- Implement circuit breaker (fail after 3 consecutive timeouts)
- Add pre-deploy validation (max system prompt size 1000 tokens)
```

---
