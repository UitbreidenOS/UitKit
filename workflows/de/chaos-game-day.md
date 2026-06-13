# Chaos-Engineering Game Day

Strukturierte Fehlerinjektions-Übung, die Chaos Engineering von Ad-hoc-Experimenten zu einer wiederholbaren, teamweiten Praxis mit definierten Phasen, Blast-Radius-Kontrollen und einer schuldlosen Retrospektive bewegt.

---

## Wann zu verwenden

- Vor einem großen Launch zur Belastungsprüfung unbekannter Fehlermodi
- Nach einem Vorfall, der einen ungetesteten Abhängigkeitspfad offenbart
- Quartalsweise, um Fähigkeiten zur Fehlerwiederherstellung scharf zu halten
- Wenn Zuverlässigkeitsanforderungen steigen (neues SLO, neue Kundenebene)

Nicht auf Produktion ausführen ohne getesteten Rollback-Pfad. Nicht während Spitzenverkehr ausführen, es sei denn, die Hypothese erfordert es speziell.

---

## Phasen / Schritte

### Phasenübersicht

```
Pre-Game → Inject → Observe → Rollback → Retrospective
```

Jede Phase hat ein definiertes Eingangstor und Ausgabeartefakt. Phasen nicht überspringen, auch wenn das Experiment "sicher" aussieht.

---

### Phase 1: Pre-Game

**Tor:** Das Game Day startet nicht, bis alle folgenden Bedingungen erfüllt sind.

- [ ] Change Freeze aktiv — keine Deployments während des Übungsfensters
- [ ] Alle Teilnehmer über die Hypothese und ihre Beobachtungsrolle briefed
- [ ] Rollback-Verfahren getestet und dokumentiert (automatischer Auslöser definiert)
- [ ] Metriken-Baseline erfasst (Fehlerrate, Latenz p50/p99, Durchsatz) für die 30 Minuten vor Injektion
- [ ] Runbook-Speicherort in Team-Kanal freigegeben

**Briefing-Vorlage:**

```
Game Day: [experiment name]
Date/time: [ISO timestamp]
Facilitator: [name]
Observers: [names + what they're watching]

Hypothesis: [see template below]
Blast radius start: [1 instance / 1% traffic / etc.]
Rollback trigger: error rate > X% for Y minutes OR manual call
Duration limit: [max minutes before mandatory rollback]
```

---

### Hypothesen-Vorlage

Jedes Game Day wird gegen genau eine Hypothese ausgeführt. Keine Multi-Hypothesen-Sessions — sie kontaminieren Beobachtungen.

```
Steady state:  [what normal looks like — metric + value]
Failure type:  [what you're injecting — network latency / pod kill / CPU stress / etc.]
Expected impact: [what you predict will happen — "p99 latency increases to ~800ms, no errors"]
Success criteria: [what a passing result looks like — "system recovers within 60s of rollback with no data loss"]
```

**Beispiel:**
```
Steady state:  API p99 < 200ms, error rate < 0.1%
Failure type:  Add 500ms of network latency between API and database (Toxiproxy)
Expected impact: p99 rises to ~700ms; error rate stays < 0.5% due to connection pool buffering
Success criteria: Removing the proxy restores p99 < 200ms within 30 seconds
```

Wenn die erwartete Auswirkung dem beobachteten Verhalten entspricht: Das System ist resilient wie entworfen.
Wenn Verhalten abweicht: Sie haben entweder eine versteckte Abhängigkeit oder falsches mentales Modell gefunden — beide sind wertvolle Erkenntnisse.

---

### Phase 2: Inject

Mit dem kleinsten Blast-Radius beginnen. Nur eskalieren, wenn das System den aktuellen Radius ohne Verstoß gegen Rollback-Auslöser bewältigt.

**Blast-Radius-Stufen:**

| Stufe | Umfang | Warten vor Eskalation |
|-------|--------|------------------------|
| 1 | 1 Instanz (1-5% der Flotte) | 5 Minuten |
| 2 | 5% des Verkehrs (Traffic-Shifting oder Feature-Flag) | 10 Minuten |
| 3 | 25% des Verkehrs | 15 Minuten |
| 4 | Gesamter Verkehr / alle Instanzen | Entscheidung des Facilitators |

Nie von Stufe 1 zu Stufe 4 überspringen. Die Zwischenstufen zeigen, ob Fehler lokal oder systemisch sind.

**Tool-Befehle:**

```bash
# AWS FIS — start experiment
aws fis start-experiment --experiment-template-id EXTabc123

# Toxiproxy — add latency between app and DB
toxiproxy-cli toxic add -t latency -a latency=500 -a jitter=50 db_connection

# tc netem — packet loss on a network interface (requires root)
tc qdisc add dev eth0 root netem loss 5%

# Remove tc netem
tc qdisc del dev eth0 root
```

---

### Phase 3: Observe

**Während der Beobachtung nicht eingreifen.** Der Punkt ist zu sehen, wie das System tatsächlich verhält, nicht wie es verhält, wenn ein Ingenieur aktiv darin sitzt. Ingenieure sollten nur Metriken und Logs beobachten.

Beobachter-Zuweisungen:
- Eine Person beobachtet Fehlerrate und Latenz-Dashboards
- Eine Person beobachtet Logs auf unerwartete Fehlertypen
- Eine Person beobachtet abhängige Dienste (nachgelagerter Impact)
- Facilitator verfolgt Zeit und dokumentiert Beobachtungen in Echtzeit

**Beobachtungslog-Format (an Runbook anhängen):**
```
[14:32:15] Blast radius: stage 1 (1 instance)
[14:32:15] Metrics: error_rate=0.08%, p99=210ms — within baseline
[14:37:00] Escalate to stage 2 (5% traffic)
[14:37:30] Metrics: error_rate=0.12%, p99=650ms — above baseline, below rollback trigger
[14:42:00] Escalate to stage 3 (25% traffic)
[14:42:15] Metrics: error_rate=1.8% — approaching rollback trigger (2%)
[14:43:30] error_rate=2.3% — rollback trigger hit
```

**Die "Nicht zu schnell eingreifen"-Regel:** Der Rollback-Auslöser ist im Voraus definiert. Nicht vor dem Auslöser manuell zurückrollback, es sei denn, es gibt einen Notfall außerhalb des Umfangs der Hypothese. Zu früh eingreifen macht die Beobachtung ungültig.

---

### Phase 4: Rollback

**Automatisierter Auslöser:**

```yaml
# Prometheus alerting rule that fires rollback
- alert: GameDayRollbackTrigger
  expr: |
    sum(rate(http_requests_total{status=~"5.."}[2m]))
    / sum(rate(http_requests_total[2m])) > 0.02
  for: 2m
  labels:
    severity: game_day_rollback
  annotations:
    summary: "Game day rollback trigger — error rate {{ $value }}"
```

Wenn Alert auslöst, läuft automatisiertes Rollback-Script:
```bash
#!/bin/bash
# .claude/game-day-rollback.sh
toxiproxy-cli toxic remove db_connection --toxicName latency || true
aws fis stop-experiment --id "$FIS_EXPERIMENT_ID" || true
tc qdisc del dev eth0 root 2>/dev/null || true
echo "Rollback complete at $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> .claude/game-day-log.txt
```

**Manueller Rollback:** Facilitator fordert Rollback auf, wenn automatisierter Auslöser nicht auslöst, aber Situation ist klar unsicher (Kaskadenausfälle erreichen nicht-scopierte Dienste, Kundeneinfluss außerhalb des Blast-Radius usw.).

Nach Rollback: Überprüfen Sie, dass das System zum stabilen Zustand zurückkehrt, bevor Sie die Übung beenden. Nicht den Erfolg erklären, bis Baseline-Metriken wiederhergestellt sind.

---

### Phase 5: Retrospective

Retrospektive findet innerhalb von 24 Stunden statt, während Beobachtungen frisch sind. Format: schuldlos, fokussiert auf Systemverhalten, nicht einzelne Aktionen.

**IMTD — Intent, Mistake, Trigger, Discovery:**
- **Intent:** Was die Hypothese vorhersagte
- **Mistake:** Wo das System oder mentale Modell falsch war
- **Trigger:** Welche Bedingung die Abweichung verursachte
- **Discovery:** Was wir jetzt wissen, das wir vorher nicht wussten

Keine schuldzuweisungs-orientierte Retrospektive führen. "Der Ingenieur hat nicht bemerkt, dass die Fehlerrate stieg" ist kein IMTD-Befund. "Der Fehlerrate-Alert hat ein 5-Minuten-Fenster — zu langsam, um diesen Fehlermodus zu fangen" ist.

**Retrospektiv-Ausgabeartefakte:**
- Aktualisiertes Runbook mit tatsächlichen dokumentierten Beobachtungen
- Liste der Befunde (jeder als Ticket)
- Liste der Follow-on-Experimente, wenn Hypothese validiert und System hielt
- Entscheidung: Wird dies ein wiederkehrendes Experiment? Welche Häufigkeit?

---

### Claude Code Game Day Assistant

Claude Code fungiert als Echtzeit-Assistent während des Game Day: liest das Runbook, verfolgt die Hypothese, protokolliert zeitgestempelte Beobachtungen und generiert den Retrospektiv-Bericht.

**Setup:**

1. Runbook unter `.claude/game-day-runbook.md` platzieren
2. Claude Code Sitzung starten mit:
```
Read .claude/game-day-runbook.md. You are the game day assistant for this session.
Track observations I give you with timestamps. When I say "retro", generate the IMTD retrospective report based on all observations.
```

**Während des Game Day:**
- Beobachtungen wie protokolliert geben: `"[14:42:15] error_rate hit 2.3%, rollback trigger fired"`
- Claude hält das laufende Log und flaggt, wenn Blast-Radius-Verweildauer nicht erfüllt wurde
- Am Ende: `"retro"` generiert den vollständigen Retrospektiv mit allen protokollierten Beobachtungen in IMTD-Vorlage formatiert

---

## Beispiel

**Dienst:** Checkout-API  
**Hypothese:** Das Töten des Redis-Session-Caches erzwingt einen Fallback zur Datenbank ohne sichtbare Benutzerausfälle

```
Steady state:  checkout success rate 99.8%, p99 < 300ms
Failure type:  Kill all Redis instances (docker stop redis)
Expected impact: p99 increases to ~800ms (DB fallback), success rate holds
Success criteria: No checkout failures; p99 recovers within 60s of Redis restart
```

**Game Day Log:**

```
[Pre-Game] Baseline captured: success=99.81%, p99=287ms
[10:05:00] Stage 1: killed 1 of 3 Redis instances
[10:10:00] Metrics: success=99.80%, p99=310ms — holding
[10:15:00] Stage 2: killed all 3 Redis instances
[10:15:30] Metrics: success=97.2%, p99=4200ms — UNEXPECTED
[10:17:00] Rollback trigger hit (error_rate > 2%)
[10:17:00] Automated rollback: Redis restarted
[10:18:45] Metrics returned to baseline
```

**Befund:** Die Anwendung hat keine Fallback-Logik — sie wirft 500-Fehler, anstatt zur Datenbank zu fallback. Das mentale Modell war falsch. Ticket eröffnet zum Implementieren von Fallback. Hypothese geplant, nach Fixes erneut auszuführen.

---
