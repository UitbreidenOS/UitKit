---
name: migration-planning
description: Plans a safe, phased migration from legacy system to new architecture. Documents cutover strategy, rollback plan, data migration approach, validation, and risk mitigation. Outputs migration playbook with timelines and success criteria.
allowed-tools: Read, Write
effort: high
---

# Migration Planning

## When to activate

When a system redesign is complete and you need to move from old to new (legacy system replacement, platform upgrade, database migration, cloud migration). Triggered by: design approval, customer commitment to migration timeline, or post-launch planning. Always run before cutover date is announced to customer.

## When NOT to use

Not for small patches or deployments (use standard CI/CD). Not for feature flags or canary releases (use deployment strategy instead). Not if the new system is not ready (test first). Not if you have <2 weeks to plan (too risky). Not without customer sign-off on downtime tolerance.

## Migration Planning Checklist

1. **Current State Audit**
   - [ ] How much data needs to move? (size, record count, complexity)
   - [ ] How many users/systems depend on old system?
   - [ ] What integrations exist? (other systems, APIs, webhooks)
   - [ ] Backup and recovery procedure for old system documented?
   - [ ] Performance characteristics (peak load, growth rate)?

2. **Target State Readiness**
   - [ ] New system load-tested at expected peak?
   - [ ] All data mapping rules defined and tested?
   - [ ] Rollback procedure documented and tested?
   - [ ] Monitoring and alerting in place?
   - [ ] Support team trained?

3. **Cutover Strategy**
   - [ ] Big bang (one-time switch) or phased (gradual migration)?
   - [ ] If phased: which users/data first? (de-risk approach)
   - [ ] Parallel run plan (old and new running together)?
   - [ ] Validation plan (how do we know migration succeeded)?
   - [ ] Rollback criteria (when do we abort and go back)?
   - [ ] Downtime window (if any)? Communication to users?

4. **Data Migration**
   - [ ] Source data extraction (query, dump, API)?
   - [ ] Transformation rules (schema mapping, business logic)?
   - [ ] Validation (record count, sample checks, integrity)?
   - [ ] Orphan data handling (what about unmatched records)?
   - [ ] Incremental sync (how do we handle changes during cutover)?
   - [ ] Historical data (archive old system, audit trail)?

5. **Integration Points**
   - [ ] Which systems call the old system? (list all)
   - [ ] Update integration endpoints? (when, by whom)?
   - [ ] Webhook/push notification updates?
   - [ ] Third-party API integrations (payment, auth, etc.)?
   - [ ] Database/ETL pipeline changes?

6. **Rollback & Recovery**
   - [ ] Full rollback procedure (step-by-step)?
   - [ ] Time to rollback (RTO)? (target: <30 min)
   - [ ] Data recovery if migration partially failed?
   - [ ] Communication to stakeholders on rollback?
   - [ ] Post-rollback analysis: what went wrong?

7. **Success Criteria & Validation**
   - [ ] Data integrity checks (record count, checksums, spot checks)
   - [ ] Functional validation (critical workflows work)
   - [ ] Performance validation (latency, throughput acceptable)
   - [ ] User acceptance testing (UAT) complete
   - [ ] Monitoring alerts not firing (no errors)
   - [ ] No increase in support tickets

## Output Format

### Migration Playbook

**Executive Summary**
- Old system: [name, version, tech]
- New system: [name, version, tech]
- Scope: [what's moving, what's staying]
- Cutover date: [YYYY-MM-DD HH:MM]
- Estimated downtime: [Xh or zero-downtime]
- Risk level: [LOW / MEDIUM / HIGH]
- Owner: [Name, role]

**Current State Assessment**

| Aspect | Details |
|---|---|
| Data Volume | [X GB, Y million records] |
| Users Impacted | [X internal, Y external] |
| Integrations | [List: system A, B, C] |
| Downtime Tolerance | [X minutes maximum] |
| Peak Load | [X req/sec, Y concurrent users] |

**Migration Strategy**

**Type:** [Big Bang / Phased / Blue-Green / Canary]

**Approach:**
- [Detailed description of how migration will happen]
- [Why this approach chosen over alternatives]
- [Risks specific to this approach and mitigations]

**Timeline** (Example for big-bang)

```
2026-06-20 00:00 — Migration window opens
2026-06-20 00:30 — Data extraction from legacy system (1h estimated)
2026-06-20 01:30 — Transform and load into new system (30min estimated)
2026-06-20 02:00 — Data validation and spot checks (30min)
2026-06-20 02:30 — Update integration endpoints
2026-06-20 03:00 — Enable new system for traffic
2026-06-20 04:00 — Monitor for errors (no user activity yet)
2026-06-20 06:00 — User communication: system ready
2026-06-20 06:30 — First users log in, validate workflows
2026-06-20 08:00 — All users migrated, legacy system in standby
2026-06-21 00:00 — Legacy system archived
```

**Data Migration Plan**

1. **Extraction**
   - Source: [old database/system]
   - Method: [direct query, dump, API, custom script]
   - Volume: [X GB estimated]
   - Time: [X hours estimated]

2. **Transformation**
   - Mapping: [old schema → new schema rules]
   - Business logic: [any complex transformations]
   - Validation rules: [what makes a record valid in new system]

3. **Load**
   - Destination: [new database]
   - Batch size: [X records per batch to avoid overload]
   - Order: [load order if dependencies matter]

4. **Validation**
   ```
   SELECT COUNT(*) FROM old_system.orders       -- expected: 1,234,567
   SELECT COUNT(*) FROM new_system.orders       -- expected: 1,234,567
   
   SELECT SUM(amount) FROM old_system.orders    -- expected: $5,432,100
   SELECT SUM(amount) FROM new_system.orders    -- expected: $5,432,100
   
   Sample check: SELECT * FROM new_system.orders WHERE id = [random sample IDs]
   ```

5. **Incremental Sync** (if new orders created during migration)
   - Detect changes in old system after initial load
   - Sync new records to new system
   - Resume during validation phase before cutover

**Integration Updates**

| System/Service | Current Endpoint | New Endpoint | Update By | Downtime |
|---|---|---|---|---|
| Payment processor | https://api.old.com/pay | https://api.new.com/v1/pay | [Owner] | [When] |
| [System] | [Endpoint] | [Endpoint] | [Owner] | [When] |

**Rollback Plan**

**Trigger:** Any of:
- Data loss detected (record count mismatch >1%)
- Performance unacceptable (latency >5s)
- Critical functionality broken (>10% of workflows failing)
- Widespread errors in new system (>1% error rate)

**Rollback Procedure:**

1. Notify stakeholders: [message template]
2. Stop traffic to new system
3. Restore legacy system from pre-migration backup (if needed)
4. Revert integration endpoints to old system URLs
5. Notify users: service restored, investigating issue
6. Root cause analysis (post-cutover)

**Rollback Time:** <30 minutes from decision to full restoration

**Success Criteria**

- [ ] All data migrated (record count match ±0.1%)
- [ ] No data corruption (checksums pass, integrity checks pass)
- [ ] All integrations operational (test each integration)
- [ ] Performance acceptable (latency p99 <2s, throughput >100 req/sec)
- [ ] Zero critical errors (error rate <0.1%)
- [ ] User acceptance (UAT sign-off)
- [ ] Support team handles all incoming issues within SLA

**Risk Register**

| Risk | Severity | Probability | Impact | Mitigation |
|---|---|---|---|---|
| Data loss during extraction | CRITICAL | LOW | Complete restart needed | Backup before starting, validate extract |
| Performance degradation in new system | HIGH | MEDIUM | Users blame new system | Load test at 2x expected peak |
| Integration failures | HIGH | MEDIUM | Downstream outages | Test all integrations pre-cutover |
| Longer-than-expected migration window | MEDIUM | MEDIUM | Users without system longer | Practice full migration 3x before live |

**Communication Plan**

- **T-4 weeks:** Announce migration date to all users
- **T-1 week:** Send detailed cutover schedule and expected downtime
- **T-24h:** Remind users (if there's downtime)
- **T-30min:** Begin maintenance window notification
- **T+0:** Begin migration, monitor actively
- **T+2h:** Notify users system is live and ready
- **T+6h:** First status update (all good or investigating)
- **T+24h:** Post-migration report to stakeholders

**Post-Migration (First 48 Hours)**

- [ ] Monitor error rates, latency, queue depth closely
- [ ] Keep legacy system running in standby for 48h
- [ ] Support team on high alert (escalation path clear)
- [ ] Log all issues for post-mortem
- [ ] Daily checkpoints with customer/stakeholders

**Post-Mortems & Lessons Learned**

After cutover:
- What went well?
- What would we do differently?
- What issues came up? Why weren't they caught?
- Update runbook with new learnings

---
