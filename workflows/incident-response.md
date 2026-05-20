# Incident Response Workflow

End-to-end workflow for managing a production incident from detection to post-mortem.

## When to use

Use this workflow when:
- An alert fires indicating user-facing impact
- A customer reports something is broken
- Deployment caused unexpected behaviour
- Error rates or latency exceed SLO thresholds

## Phase 1: Detect and Declare (0-5 minutes)

**Step 1 — Verify the incident:**
```
Is this actually affecting users? Check:
- Error rate dashboard (above 1%?)
- Latency dashboard (p99 above SLO?)
- Direct user reports via support
- Synthetic monitor results
```

**Step 2 — Classify severity:**
- **SEV1**: Complete service outage or data loss. All hands.
- **SEV2**: Significant degradation (>25% of users affected). IC assigned.
- **SEV3**: Minor impact, workaround available. Handle in business hours.

**Step 3 — Declare and communicate:**
```
Post to #incidents:
[SEV{N}] {Service name} — {one-line description}
Impact: {who and what is affected}
IC: {your name}
War room: {link}
Next update: {time, max 30 min for SEV1}
```

## Phase 2: Investigate (5-30 minutes)

**Ask these questions in order:**

1. Did anything change recently? (deploy, config, traffic spike)
   ```bash
   git log --oneline -10  # recent commits
   # Check: deployment logs, feature flag changes, config changes
   ```

2. What is the blast radius?
   - Which users are affected?
   - Which features/endpoints are failing?
   - Which dependencies are involved?

3. What do the logs show?
   ```bash
   # Find the first error
   # Check: error messages, stack traces, timing
   ```

4. What does the data look like?
   ```bash
   # Check: DB connection count, queue depth, cache hit rate
   ```

**Hypotheses ranked by probability:**
1. Recent deploy (if deployed in last 2h)
2. Upstream dependency (check status pages)
3. Traffic spike or capacity issue
4. Data corruption or unexpected state
5. Infrastructure failure

## Phase 3: Mitigate (shortest path to user impact reduction)

**Options in order of speed:**

1. **Rollback** (fastest if caused by deploy):
   ```bash
   # Git-based rollback or feature flag kill switch
   ```

2. **Disable the feature** (feature flag):
   ```
   Set feature.broken_thing = false
   ```

3. **Scale up** (if capacity issue):
   ```bash
   kubectl scale deployment api --replicas=10
   ```

4. **Apply a hotfix** (if rollback not possible):
   - Branch from the tag that was in production
   - Minimal fix, expedited review
   - Deploy with extra monitoring

**Mitigation does not mean resolution.** Mitigation reduces user impact; resolution fixes the root cause.

## Phase 4: Communicate (ongoing throughout)

**Customer update (for SEV1/SEV2):**
```
We are experiencing {brief description}. Our team is actively investigating.
Time detected: {time}
Impact: {user-facing description}
Next update: {15-30 min from now}
Status page: {link}
```

**Resolution update:**
```
[RESOLVED] {Service name} — {time resolved}
Duration: {X hours Y minutes}
Impact: {what was affected}
Root cause: {brief — full post-mortem within 48 hours}
Status: All systems operating normally.
```

## Phase 5: Resolve and Verify

**Before closing the incident:**
- [ ] Error rates back to normal baseline
- [ ] Latency back to normal
- [ ] No anomalous logs
- [ ] Affected users can complete the impacted workflow
- [ ] On-call team is confident the issue is resolved

## Phase 6: Post-Mortem (within 48 hours for SEV1/SEV2)

**Post-mortem document:**
1. **Summary**: What happened, how long, what was the impact
2. **Timeline**: Minute-by-minute from detection to resolution
3. **Root cause**: The actual underlying cause (not the symptom)
4. **Contributing factors**: What made this worse or harder to detect/fix
5. **What went well**: Detection speed, communication, tooling that helped
6. **What went wrong**: Gaps in monitoring, slow detection, communication failures
7. **Action items**: Specific, owner-assigned, time-bound improvements

**Blameless culture:**
- Post-mortems identify system failures, not individual failures
- The goal is to prevent recurrence, not assign blame
- Publish post-mortems broadly — the whole company learns

## Related skills

- `/runbook-generator` — create runbooks for specific failure modes
- `/slo-architect` — design SLOs and burn rate alerts
- `/observability-designer` — instrument your system to detect faster
- `/agents/roles/incident-commander` — AI assistant for war room coordination

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
