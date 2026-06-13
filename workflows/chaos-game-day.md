# Chaos Engineering Game Day

Structured failure injection exercise that moves chaos engineering from ad-hoc experiments to a repeatable, team-wide practice with defined phases, blast radius controls, and a blameless retrospective.

---

## When to use

- Before a major launch to stress-test unknown failure modes
- After an incident reveals an untested dependency path
- On a quarterly cadence to keep failure recovery skills sharp
- When reliability requirements increase (new SLO, new customer tier)

Do not run on production without a tested rollback path. Do not run during peak traffic unless the hypothesis specifically requires it.

---

## Phases / Steps

### Phase Overview

```
Pre-Game → Inject → Observe → Rollback → Retrospective
```

Each phase has a defined entry gate and exit artifact. Do not skip phases even when the experiment looks "safe."

---

### Phase 1: Pre-Game

**Gate:** game day does not start until all of these are true.

- [ ] Change freeze active — no deployments during the exercise window
- [ ] All participants briefed on the hypothesis and their observation role
- [ ] Rollback procedure tested and documented (automated trigger defined)
- [ ] Metrics baseline captured (error rate, latency p50/p99, throughput) for the 30 minutes before injection
- [ ] Runbook location shared in team channel

**Briefing template:**

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

### Hypothesis Template

Every game day runs against exactly one hypothesis. No multi-hypothesis sessions — they contaminate observations.

```
Steady state:  [what normal looks like — metric + value]
Failure type:  [what you're injecting — network latency / pod kill / CPU stress / etc.]
Expected impact: [what you predict will happen — "p99 latency increases to ~800ms, no errors"]
Success criteria: [what a passing result looks like — "system recovers within 60s of rollback with no data loss"]
```

**Example:**
```
Steady state:  API p99 < 200ms, error rate < 0.1%
Failure type:  Add 500ms of network latency between API and database (Toxiproxy)
Expected impact: p99 rises to ~700ms; error rate stays < 0.5% due to connection pool buffering
Success criteria: Removing the proxy restores p99 < 200ms within 30 seconds
```

If the expected impact matches observed behavior: the system is resilient as designed.
If behavior diverges: you've found either a hidden dependency or incorrect mental model — both are valuable findings.

---

### Phase 2: Inject

Start at the smallest blast radius. Escalate only if the system handles the current radius without breaching rollback triggers.

**Blast radius stages:**

| Stage | Scope | Wait before escalating |
|-------|-------|------------------------|
| 1 | 1 instance (1-5% of fleet) | 5 minutes |
| 2 | 5% of traffic (traffic shifting or feature flag) | 10 minutes |
| 3 | 25% of traffic | 15 minutes |
| 4 | Full traffic / all instances | Facilitator decision |

Never skip from stage 1 to stage 4. The intermediate stages reveal whether failure is localised or systemic.

**Tool commands:**

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

**Do not intervene during observation.** The point is to see how the system actually behaves, not how it behaves when an engineer is actively babysitting it. Engineers should watch metrics and logs only.

Observer assignments:
- One person watches error rate and latency dashboards
- One person watches logs for unexpected error types
- One person watches dependent services (downstream impact)
- Facilitator tracks time and documents observations in real time

**Observation log format (append to runbook):**
```
[14:32:15] Blast radius: stage 1 (1 instance)
[14:32:15] Metrics: error_rate=0.08%, p99=210ms — within baseline
[14:37:00] Escalate to stage 2 (5% traffic)
[14:37:30] Metrics: error_rate=0.12%, p99=650ms — above baseline, below rollback trigger
[14:42:00] Escalate to stage 3 (25% traffic)
[14:42:15] Metrics: error_rate=1.8% — approaching rollback trigger (2%)
[14:43:30] error_rate=2.3% — rollback trigger hit
```

**The "don't intervene too fast" rule:** the rollback trigger is defined in advance. Do not manually roll back before the trigger fires unless there is an emergency outside the scope of the hypothesis. Intervening early invalidates the observation.

---

### Phase 4: Rollback

**Automated trigger:**

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

When alert fires, automated rollback script runs:
```bash
#!/bin/bash
# .claude/game-day-rollback.sh
toxiproxy-cli toxic remove db_connection --toxicName latency || true
aws fis stop-experiment --id "$FIS_EXPERIMENT_ID" || true
tc qdisc del dev eth0 root 2>/dev/null || true
echo "Rollback complete at $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> .claude/game-day-log.txt
```

**Manual rollback:** facilitator calls rollback if automated trigger doesn't fire but situation is clearly unsafe (cascading failures reaching unscoped services, customer impact outside blast radius, etc.).

After rollback: verify system returns to steady state before ending the exercise. Do not declare success until baseline metrics are restored.

---

### Phase 5: Retrospective

Retrospective happens within 24 hours while observations are fresh. Format: blameless, focused on system behavior, not individual actions.

**IMTD — Intent, Mistake, Trigger, Discovery:**
- **Intent:** what the hypothesis predicted
- **Mistake:** where the system or mental model was wrong
- **Trigger:** what condition caused the deviation
- **Discovery:** what we now know that we didn't know before

Do not run a blame-oriented retrospective. "The engineer didn't notice the error rate climbing" is not an IMTD finding. "The error rate alert has a 5-minute window — too slow to catch this failure mode" is.

**Retrospective output artifacts:**
- Updated runbook with actual observations logged
- List of findings (each as a ticket)
- List of follow-on experiments if hypothesis was validated and system held
- Decision: will this become a recurring experiment? What cadence?

---

### Claude Code Game Day Assistant

Claude Code acts as a real-time assistant during the game day: reads the runbook, tracks the hypothesis, logs timestamped observations, and generates the retrospective report.

**Setup:**

1. Place the runbook at `.claude/game-day-runbook.md`
2. Start Claude Code session with:
```
Read .claude/game-day-runbook.md. You are the game day assistant for this session.
Track observations I give you with timestamps. When I say "retro", generate the IMTD retrospective report based on all observations.
```

**During the game day:**
- Feed observations as you log them: `"[14:42:15] error_rate hit 2.3%, rollback trigger fired"`
- Claude maintains the running log and flags if blast radius dwell time hasn't been met
- At end: `"retro"` generates the full retrospective with all logged observations formatted into the IMTD template

---

## Example

**Service:** checkout API  
**Hypothesis:** killing the Redis session cache forces fallback to the database without user-visible errors

```
Steady state:  checkout success rate 99.8%, p99 < 300ms
Failure type:  Kill all Redis instances (docker stop redis)
Expected impact: p99 increases to ~800ms (DB fallback), success rate holds
Success criteria: No checkout failures; p99 recovers within 60s of Redis restart
```

**Game day log:**

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

**Finding:** the application has no fallback logic — it throws 500 errors rather than falling back to the database. The mental model was wrong. Ticket opened to implement fallback. Hypothesis scheduled to re-run after fix.

---
