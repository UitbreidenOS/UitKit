---
name: runbook-generator
description: "Generate runbooks for incidents, deployments, and operational tasks — step-by-step procedures with decision trees, rollback steps, and escalation paths"
updated: 2026-06-13
---

# Runbook Generator Skill

## When to activate
- Creating a runbook for a recurring operational task
- Documenting incident response procedures before an incident happens
- Writing a deployment runbook for a complex release
- Building an on-call handbook for new engineers
- Converting informal tribal knowledge into documented procedures

## When NOT to use
- One-time tasks — only worth documenting if it'll happen again
- Exploratory debugging — runbooks are for known failure modes
- Platform-specific runbooks (AWS Console steps) — verify against current UI

## Instructions

### Incident response runbook

```
Generate an incident response runbook for [failure mode].

Failure mode: [what breaks — e.g. "database connection pool exhausted", "payment service timeout", "disk full"]
Service affected: [which service/system]
Symptoms (what the on-call sees): [alerts fired / user reports / dashboards]
Severity: [P1 critical / P2 major / P3 minor]

Runbook structure:
1. Summary: what this runbook covers in 1-2 sentences
2. Symptoms: exact alert names + what users experience
3. Initial triage (< 5 minutes):
   - Is this actually happening? (verify)
   - What's the blast radius? (how many users affected)
   - Is this a new deployment? (consider rollback)
4. Investigation steps (ordered, with expected outputs):
   - Step 1: [command/check → what you expect to see]
   - Step 2: [command/check → decision point]
5. Mitigation options (fastest to slowest):
   - Option A: [quick fix, temporary]
   - Option B: [medium fix]
   - Option C: [proper fix, requires deploy]
6. Rollback procedure (if caused by deploy):
   - [exact steps]
7. Post-incident: [what to check before closing]
8. Escalation: [when to call who]
```

### Deployment runbook

```
Generate a deployment runbook for [service/feature].

Service: [name]
Deployment type: [rolling / blue-green / canary / all-at-once]
Risk level: [low / medium / high]
Dependencies: [services that must be updated before/after]
Database migrations: [yes/no — describe if yes]

Runbook structure:
1. Pre-deployment checklist (30-60 min before):
   □ All tests passing in CI?
   □ Migration tested on staging?
   □ Rollback plan documented?
   □ Team notified (if high-risk)?
   □ Monitoring dashboards open?

2. Deployment steps (exact commands or UI steps):
   Step 1: [action] → Expected output: [X]
   Step 2: [action] → Verify: [check Y]
   
3. Validation (immediately after deploy):
   □ Health endpoint returning 200?
   □ Error rate within normal range?
   □ Key user flows working? (smoke test)
   □ Database migration completed cleanly?

4. Rollback procedure (if something goes wrong):
   Step 1: [exact rollback command]
   Step 2: [database rollback if needed]
   Decision point: when to rollback vs. hotfix?

5. Post-deployment (1 hour after):
   □ Error rates stable?
   □ Performance metrics normal?
   □ Close the deployment issue/ticket
```

### Operational task runbook

```
Generate a runbook for this recurring operational task.

Task: [describe — e.g. "monthly database backup verification", "SSL certificate renewal", "quarterly access review"]
Frequency: [daily / weekly / monthly / quarterly / ad-hoc]
Who runs it: [role — any engineer / senior engineer / DBA / devops]
Approximate time: [X minutes]

Sections:
1. Purpose: why this task exists, what breaks if it's skipped
2. Prerequisites: access/permissions needed, tools required
3. Steps: numbered, with exact commands and expected outputs
4. Verification: how to confirm the task completed successfully
5. Failure handling: what to do if a step fails
6. Documentation: where to log completion (ticket / spreadsheet / runbook tool)

Make it executable by someone unfamiliar with the system.
```

### On-call handbook section

```
Write an on-call handbook section for [team/service].

Audience: engineer going on-call for the first time
Service context: [describe what the service does and who uses it]

Cover:
1. What you're responsible for (and what you're NOT)
2. How to triage an alert in the first 5 minutes
3. Communication expectations (when to update the incident channel, who to loop in)
4. Escalation matrix: [role] → [contact] → [when to escalate]
5. The 3 most common alerts and what to do for each
6. Tools you'll need: [list with links]
7. What to do after an incident closes (post-mortem trigger, ticket cleanup)
8. Survival tips (from the team who wrote this)
```

## Example

**User:** Generate a runbook for "high memory usage" alert on our Node.js API.

**Claude generates:**

---
**RUNBOOK: High Memory Usage — Node.js API**
*Severity: P2 (P1 if OOMKilled)*

**Symptoms:**
- Alert: `api_memory_usage_percent > 85` for > 10 minutes
- User impact: potential slowdowns or restarts if memory hits limit

**Triage (first 5 minutes):**
1. `kubectl top pods -n production | grep api` → Is this one pod or all pods?
2. `kubectl logs [affected-pod] --tail=200 | grep -i "memory\|heap\|gc"` → Any GC logs?
3. Check deployment history: `kubectl rollout history deployment/api` → Did this start after a deploy?

**If single pod:**
```bash
kubectl delete pod [affected-pod]  # pod restarts with fresh memory
```
Monitor: does memory climb again within 30 min? → likely memory leak, escalate.

**If all pods (systemic):**
- Check for recent traffic spike: look at RPS on dashboard
- If traffic spike: scale up `kubectl scale deployment api --replicas=X`
- If no traffic spike: this is a memory leak, page senior engineer

**Rollback trigger:** If memory issue started after today's deploy:
```bash
kubectl rollout undo deployment/api
```

**Escalation:** If memory stays > 90% after restart AND no deploy → page on-call senior engineer.

---
