# DevOps Incident Workflow

A structured workflow for DevOps and SRE engineers using Claude Code — from the first alert through triage, war room coordination, resolution, and postmortem.

---

## Overview

**Time savings:** Structured incident response with Claude reduces cognitive load during high-stress events, cuts postmortem writing time by 60%, and ensures runbook gaps get captured before the next incident.

**What this workflow covers:**
- Alert fires → triage → severity assessment
- P1 war room coordination
- Parallel investigation tracks
- Stakeholder communication during the incident
- Resolution and verification
- Postmortem process

**Prerequisite:** `/incident-response` and `/oncall-runbook` installed. Recommended: PagerDuty or OpsGenie MCP connected, runbooks accessible from Claude.

---

## Phase 1: Alert fires (0-5 minutes)

### First 60 seconds — severity triage

Do not page anyone or start a war room before you've spent 60 seconds assessing.

```
/incident-response

Alert: [alert name from PagerDuty/Datadog]
Service: [which service]
Time: [alert fired at HH:MM]

Quick triage:
1. What is the alert actually telling me? (copy the alert text + threshold)
2. Is this alert new, or has it fired recently? (check: last 7 days of this alert)
3. Is there a recent deployment in the last 30-60 minutes? (check: deployment log)
4. Are related services also alerting? (check: other services in the dependency graph)
5. Is there a runbook for this alert? (check: runbook library)

Initial assessment: P1 / P2 / P3?

P1 criteria: customer-facing service down, data loss risk, payment processing failure, > 10% of users affected
P2 criteria: degraded performance, elevated error rate, < 10% of users affected
P3 criteria: background job delayed, non-customer-facing service, performance degraded but SLO still met
```

**Decision rule:**
- P1 → immediately go to Phase 2 (war room)
- P2 → investigate yourself for 10 minutes before paging others; if not resolving, escalate
- P3 → investigate and resolve during normal hours; page yourself a reminder, not others

---

## Phase 2: War room setup (P1 only — 5-10 minutes)

### Page and assemble

```
/incident-response

P1 confirmed: [brief description of what's happening]

Set up the war room:

1. Create incident channel: #inc-[YYYY-MM-DD]-[short-description]
2. Post initial message in the channel:

--- TEMPLATE ---
🔴 P1 INCIDENT — [SERVICE NAME] — [HH:MM]

Status: INVESTIGATING
Severity: P1
Services affected: [list]
Customer impact: [describe — e.g., "checkout is returning 500s for all users"]
Incident commander: [your name]
On-call: [on-call engineer]

All updates in this thread. Do not create side conversations.
War room: [Zoom/Meet link]
Runbook: [link]
Dashboard: [link]
--- END TEMPLATE ---

3. Who to page for this incident type:
- Engineering lead: [name] — if P1 persists > 15 minutes
- Database team: [contact] — if database-related
- Security: [contact] — if any indication of breach or data exposure
- Customer Success: [contact] — to manage customer communications
- CEO: [contact] — if customer revenue impact > $X or outage > 30 minutes

Page [list who to page] now.
```

### Incident commander role

For a P1, one person is incident commander. They do not investigate — they coordinate.

```
/incident-response

I am incident commander for this P1. Assign investigation tracks.

Incident: [describe]
Available engineers: [list who is in the war room]

Parallel investigation tracks:
Track A — Root cause investigation: [engineer name]
  - Investigating: [service logs, database, recent deploy]
  - Report back in: 5 minutes with findings or "still investigating"

Track B — Mitigation: [engineer name]
  - Trying: [rollback / restart / feature flag off / manual scaling]
  - ETA: [X minutes]

Track C — Customer impact assessment: [engineer name]
  - Measuring: [how many users affected, which geographies, error rate]
  - Output: quantified customer impact for stakeholder update

My job as IC: take status updates every 5 minutes, make decisions, communicate externally.

Generate a 5-minute update cadence template I'll post in the channel.
```

---

## Phase 3: Investigation (parallel tracks)

### Log investigation

```
/incident-response

Investigating: [incident description]

Logs available (paste or describe):
[paste relevant log lines — filter to the time window of the incident]

Help me identify:
1. First occurrence of the error — exact timestamp and log line
2. Pattern: is this one specific error type, or multiple?
3. Any stack trace or upstream error that indicates root cause
4. Any correlation: does this correlate with a specific user, endpoint, or request pattern?
5. Rate of errors over time — is it getting worse, stable, or recovering?

Based on the logs: what are the top 2-3 hypotheses for root cause?
```

### Metrics investigation

```
/incident-response

Metrics during incident window [HH:MM to HH:MM]:

[Paste or describe what you see in your dashboard]
- CPU: [trend during incident]
- Memory: [trend]
- Error rate: [trend]
- Latency: [trend]
- Throughput (RPS): [trend]
- Database connections: [trend]
- Any other relevant metrics]

Interpret:
1. What changed first — which metric moved before the others?
2. Is this a resource exhaustion (CPU/memory) or an application error?
3. Is there a "knee" in the metric — a point where things suddenly got worse?
4. What metric should I watch to know if mitigation is working?
```

### Mitigation decision

```
/incident-response

Mitigation options for: [describe root cause hypothesis or confirmed root cause]

Options available:
A. Rollback last deploy (deploy [X] at [HH:MM]) — estimated recovery: [X min] — risk: [Y]
B. Restart pods: `kubectl rollout restart deployment/[service] -n [namespace]` — recovery: 2-3 min — risk: in-flight requests dropped
C. Feature flag off: [flag name] — recovery: 1-2 min — risk: [functionality removed for all users]
D. Scale up: add N replicas — recovery: 3-5 min — risk: cost; doesn't fix root cause
E. [Other option]

Recommend: which mitigation is best for this situation?
Criteria: fastest time to recover customer impact, lowest risk of making things worse, reversible.

What do I watch in the 5 minutes after applying the mitigation to confirm it's working?
```

---

## Phase 4: Communication during incident

### Customer-facing status page update

```
/incident-response

Write a status page update.

Audience: customers / public
Tone: honest, calm, not alarming
Avoid: technical jargon, assigning blame, sharing internal investigation details

Status: [Investigating / Identified / Monitoring / Resolved]
Component affected: [which service / feature]
Customer impact: [what they experience — "some users may experience checkout failures"]
When did it start: [HH:MM timezone]
What we're doing: [brief — "our team has identified the issue and is deploying a fix"]

Do NOT say: "We apologize for any inconvenience." — overused and hollow.
DO say: specific impact, what you're doing, and when you'll update again.

Template:
[STATUS]: [Brief headline of what's happening]
We are [investigating / have identified / monitoring] an issue affecting [component].
[What customers experience — specific].
Our team is [what action is underway — e.g., deploying a fix / rolling back a change].
We will update this page at [next update time].
```

### Internal stakeholder update (every 15-30 minutes during P1)

```
/incident-response

Write an internal stakeholder update for P1 incident [NAME].

Time since incident started: [X minutes]
Last update posted: [HH:MM]

Current status:
- Root cause: [identified / still investigating]
- Mitigation status: [applied / in progress / not yet]
- Customer impact: [current — e.g., "50% of checkout requests failing, rest healthy"]
- ETA to resolution: [X minutes / unknown]

Audience: [Slack channel with exec team, CS, sales]
Length: 5-6 sentences max — no one is reading a wall of text during a crisis.

Format:
[TIME] P1 Update — [SERVICE]:
Status: [one word]
Impact: [current state of customer impact]
Root cause: [found/not found]
Action: [what's happening right now]
ETA: [estimate or "investigating further"]
Next update: [HH:MM]
```

---

## Phase 5: Resolution and verification

### Resolution verification checklist

```
/incident-response

Verify incident resolution for [SERVICE].

Mitigation applied: [what was done]
Time applied: [HH:MM]

Verify recovery across these dimensions:

1. Error rate: current error rate vs. baseline (should be back to SLO)
   Current: [X%] | Baseline: [X%] | SLO threshold: [X%]

2. Latency: p99 latency back to normal
   Current: [Xms] | Baseline: [Xms] | SLO threshold: [Xms]

3. Throughput: RPS recovering to pre-incident levels
   Current: [X] | Pre-incident: [X]

4. Customer-facing check: run synthetic test or check real user data
   Can a customer successfully complete [the affected flow]?

5. Downstream services: any cascading effects on dependent services?
   [Check each service that depends on this one]

If all checks pass: declare incident resolved.
If any check fails: do not declare resolved — continue investigation.

Draft the "all clear" message for the incident channel and status page.
```

### All clear message

```
/incident-response

Write the all-clear message for:

Incident: [name]
Duration: [X minutes total]
Root cause (brief): [what happened]
Fix applied: [what resolved it]
Any follow-up the team should know about: [monitoring changes, ticket created, etc.]

Channel: #inc-[name] (copy to #engineering and status page)

Format: 3-4 sentences. Specific. Include time of resolution.

Do not write: "We're pleased to announce the incident is resolved." Too corporate.
Do write: "As of [HH:MM], [service] is fully recovered. Root cause was [X]. We've [Y] and created a ticket to [prevent recurrence]."
```

---

## Phase 6: Postmortem

### Postmortem within 48 hours of incident

```
/incident-response

Write the postmortem for [INCIDENT NAME] — [DATE].

Input:
- Incident channel history: [paste or summarise]
- Timeline as you know it:
  [HH:MM] — [what happened]
  [HH:MM] — [what happened]
  [HH:MM] — [resolution]
- Root cause found: [describe]
- Contributing factors: [anything that made it worse or harder to detect/fix]
- Impact: [duration, affected services, customer impact, revenue impact if known]

Postmortem structure:

## Summary
[3-4 sentences: what happened, impact, resolution]

## Timeline
[Accurate timeline with times — first sign, first alert, triage, investigation steps, fix applied, verification]

## Root cause
[Specific technical root cause — not "the service went down" but what caused it to go down]

## Contributing factors
[Things that made this worse: slow detection, missing runbook, no rollback tested, flaky test that missed the bug]

## Impact
[Quantify: N minutes downtime, X% of users affected, Y support tickets created, $Z revenue impact]

## What went well
[Be specific — what worked in the response that we should preserve]

## Action items
Format: [WHAT] | Owner: [NAME] | Due: [DATE]
- [ ] [Action 1 — e.g., add alert for [X] that would have detected this 10 minutes earlier] | Owner: [name] | Due: [date]
- [ ] [Action 2] | Owner: [name] | Due: [date]
- [ ] [Action 3 — update the runbook with the resolution steps used today] | Owner: [name] | Due: [date]

Rule: maximum 5 action items. Each must be specific and assigned. Vague actions are not actions.

## What we won't fix
[Anything you deliberately deprioritised after evaluating cost vs. risk]
```

---

## On-call preparation (before your rotation)

### Pre-rotation checklist

Run this 2 days before your on-call shift starts:

```
/oncall-runbook

Pre-rotation prep for on-call shift starting [DATE]:

My services to cover: [list]

For each service, check:
1. Is the runbook current? (Updated in last 90 days?)
2. Do I have access to all tools needed? (Cloud console, Kubernetes, database, logs)
3. Are my PagerDuty notifications correctly configured? (Test by manually triggering a low-severity alert)
4. Do I know the escalation path? (Name, phone, Slack for each tier)

Gaps found: [list anything missing]
Actions before shift starts: [list]

Also:
- Read the last 3 postmortems — understand what broke recently
- Check if any deployments are planned during my shift — coordinate with the team
- Know the business context: any high-traffic periods, launches, or events during my week?
```

---

## Benchmarks

| Metric | Target | Warning sign |
|---|---|---|
| Alert to triage decision | < 5 minutes | > 10 min: alert quality or runbook gap |
| P1 war room assembled | < 10 minutes | > 20 min: communication or paging problem |
| Time to first mitigation attempt | < 20 minutes | > 30 min: investigation path unclear |
| MTTR (P1) | < 45 minutes | > 60 min: runbook or skill gap |
| MTTR (P2) | < 2 hours | > 4 hours: triage inaccurate or investigation ineffective |
| Postmortem published | Within 48 hours | > 72 hours: lessons being lost |
| Action items completed | 100% within 30 days | < 70%: action items not real commitments |
| Incidents per month (trend) | Decreasing | Flat or increasing: systemic issues not being fixed |

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
