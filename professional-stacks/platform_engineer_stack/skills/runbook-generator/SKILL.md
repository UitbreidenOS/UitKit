# Runbook Generator

## When to activate

When writing incident response procedures, creating troubleshooting guides, documenting disaster recovery steps, or establishing operational playbooks. Use before going to production — every critical service needs a runbook.

## When NOT to use

For architecture design (use infrastructure-design skill). For creating monitoring rules (use observability-stack-designer). This is strictly for operational procedures.

## Instructions

### 1. Identify Critical Paths

What could break your service?

**Common Failure Modes:**

1. **Resource exhaustion**
   - CPU spikes to 100%, service slows to crawl
   - Memory leak causes OOMKilled pods
   - Disk fills up (logs, databases, caches)
   - Network bandwidth saturated

2. **Dependency failures**
   - Database becomes unavailable or slow
   - Cache (Redis) connection pool exhausted
   - Message queue down, events backing up
   - External API (payment processor, analytics) timeout/fails

3. **Data corruption**
   - Buggy migration corrupts database
   - Bug in cache invalidation logic
   - Stale or expired credentials in secrets
   - Timezone/timestamp bugs

4. **Traffic anomalies**
   - DDoS attack or bot traffic spike
   - Internal runaway loop generates requests
   - Customer with buggy client making millions of requests
   - Malicious user exploiting endpoint

5. **Deployment problems**
   - New version has crashing bug
   - Configuration change breaks service
   - Incompatible database schema change
   - Secrets not rotated, old credentials expired

6. **Infrastructure issues**
   - Node fails, pods can't reschedule
   - Load balancer misconfigured
   - Network partition between zones
   - Storage volume fills up

### 2. Runbook Structure

Every runbook follows this structure:

```markdown
# Runbook: [Incident Type]

## Symptoms

What does this look like in monitoring?

- Alert: [Alert name that fires]
- Metric: [Specific metric value or pattern]
- Log pattern: [What to look for in logs]
- User impact: [What users experience]

Example:
- Alert: HighErrorRate (> 5% errors for > 5 minutes)
- Metric: http_requests_total{status="500"} > 100/sec
- Log pattern: "database connection pool exhausted" appearing frequently
- User impact: Create account fails with "Service temporarily unavailable"

## Severity & Escalation

- **Severity:** [Critical/Warning/Info]
- **Impact:** [Number of users affected]
- **Time to resolve:** [Typical MTTR based on history]
- **Escalate to:** [Team/manager if unresolved after N minutes]

Example:
- **Severity:** Critical (blocks user signups)
- **Impact:** All new users affected
- **Typical MTTR:** 5-15 minutes
- **Escalate to:** On-call database engineer if unresolved after 10 minutes

## Diagnosis Steps

1. [First diagnostic step]
2. [Second diagnostic step]
3. [Decision point based on findings]

Be specific with commands/queries:

Example:
1. Check error rate:
   ```
   kubectl logs -n production -l app=api-service --tail=1000 | grep -c "ERROR"
   ```

2. Check database connection pool:
   ```sql
   SELECT count(*) FROM pg_stat_activity WHERE datname = 'production';
   SELECT max_conn FROM pg_database WHERE datname = 'production';
   ```
   If > 90% of max_conn, connections are exhausted.

3. Check recent deployments:
   ```
   kubectl rollout history deployment/api-service -n production
   kubectl describe deployment api-service -n production | grep -A5 "Image:"
   ```

## Immediate Mitigation

What to do RIGHT NOW to stop the bleeding:

- [Action 1]
- [Action 2]
- [Command to execute]

Example:
1. Scale up replicas to handle load:
   ```
   kubectl scale deployment api-service -n production --replicas=10
   ```

2. If that doesn't work, roll back to previous version:
   ```
   kubectl rollout undo deployment/api-service -n production
   kubectl rollout status deployment/api-service -n production --timeout=5m
   ```

3. Verify error rate dropped:
   ```
   kubectl logs -n production -l app=api-service --tail=1000 --since=2m | grep -c "ERROR"
   ```

## Root Cause Analysis

Once stabilized, diagnose the root cause:

- [Possible cause 1 and how to verify]
- [Possible cause 2 and how to verify]
- [Possible cause 3 and how to verify]

Example:
**Possible: Database query timeout**
- Verify: Check slow query log
  ```sql
  SELECT query, calls, mean_time FROM pg_stat_statements 
  WHERE mean_time > 1000 
  ORDER BY mean_time DESC LIMIT 5;
  ```
- If found: Add index or optimize query
- If not found: Root cause is elsewhere

**Possible: Memory leak in service**
- Verify: Check memory over time
  ```
  kubectl top pod -n production | grep api-service
  # Memory growing over minutes? Could be leak
  ```
- If found: Restart pod and investigate code
- If not found: Root cause is elsewhere

## Permanent Fix

How to prevent this from happening again:

- [Root cause fix]
- [Code change/configuration change]
- [Deploy procedure]

Example:
- **Root cause:** Database connection pool size too small
- **Fix:** Increase pool size from 10 to 30
  ```python
  # config.py
  DB_POOL_SIZE = 30  # Was 10, causing exhaustion at 1000 req/sec
  ```
- **Deploy:** Merge to main, deploy via standard CI/CD

## Post-Incident

After the incident is resolved:

- [ ] Update monitoring to catch this earlier (add alert? adjust threshold?)
- [ ] Update dashboard to show relevant metrics
- [ ] Update this runbook with what you learned
- [ ] Schedule code review of permanent fix
- [ ] Communicate root cause to team
- [ ] Add test case to prevent regression

Example:
- [ ] Alert: Add `DatabaseConnectionPoolAlmostFull` (trigger at 80% utilization)
- [ ] Dashboard: Add panel showing connection pool utilization over time
- [ ] Runbook: Add step to check `pg_stat_activity` count
- [ ] Code review: Changes to `DB_POOL_SIZE`, test that it handles peak load
- [ ] Communication: Share root cause in #incidents Slack channel

## Prevention

What can we do to prevent this class of incident?

- [Prevention 1]
- [Prevention 2]
- [Prevention 3]

Example:
- **Load testing:** Monthly simulations of 2x expected peak load
- **Chaos engineering:** Test what happens when database is slow (inject 1sec latency)
- **Configuration drift detection:** Monthly audit of production config vs. expected
- **Capacity planning:** Quarterly review of resource utilization trends
```

### 3. Common Runbook Examples

**Runbook: High Error Rate (5xx Errors)**

```markdown
# Runbook: High Error Rate (5xx Errors)

## Symptoms
- Alert: HttpErrorRateCritical (> 5% of requests returning 5xx)
- Metric: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
- Log pattern: "Internal Server Error" or "unhandled exception"
- User impact: All API calls fail with "503 Service Unavailable"

## Severity & Escalation
- **Severity:** Critical (all users affected)
- **Impact:** 100% of API traffic
- **Typical MTTR:** 5 minutes
- **Escalate to:** On-call engineer if unresolved after 2 minutes

## Diagnosis Steps

1. Check if recent deployment caused this:
   ```bash
   kubectl rollout history deployment/api-service -n production
   # Look for very recent rollout
   ```

2. Check pod logs for exceptions:
   ```bash
   kubectl logs -n production -l app=api-service --tail=100 | grep -i exception
   # Look for what's causing the error
   ```

3. Check if dependency is down:
   ```bash
   curl -I https://database-service.internal:5432/health
   curl -I https://cache-service.internal:6379/health
   curl -I https://external-api.example.com/health
   # If any return non-2xx, that's the root cause
   ```

4. Check error breakdown by status code:
   ```
   kubectl logs -n production -l app=api-service --tail=1000 | \
   grep "HTTP" | awk '{print $NF}' | sort | uniq -c
   # Count by status code to understand what's failing
   ```

## Immediate Mitigation

1. **If recent deployment:** Roll back immediately
   ```bash
   kubectl rollout undo deployment/api-service -n production
   # Wait for pods to restart
   kubectl rollout status deployment/api-service -n production
   ```

2. **If not recent deployment:** Check if dependency is down
   - Check database connection: `psql -h db.internal -U app -c 'SELECT 1'`
   - Check cache: `redis-cli -h cache.internal ping`
   - Page database/cache team if down

3. **If dependency is up:** Restart pods to clear any stale state
   ```bash
   kubectl delete pod -n production -l app=api-service
   # Pods will be recreated; should restore service
   ```

4. **Monitor error rate and confirm recovery:**
   ```bash
   while true; do
     ERRORS=$(kubectl logs -n production -l app=api-service --since=1m | grep -c "500")
     echo "Errors in last minute: $ERRORS"
     sleep 10
   done
   ```

## Root Cause Analysis

1. **If rollback fixed it:** Bug in new code
   - Inspect the diff: `git diff v1.2.2 v1.2.3`
   - Look for obvious bugs: uninitialized variables, missing null checks, wrong SQL
   - Check error logs for specific failure pattern

2. **If dependency was down:** Dependency issue
   - Check database logs for crashes or OOM
   - Check if disk is full on cache
   - Check external API status page

3. **If restart fixed it:** Memory/resource exhaustion
   - Check memory usage: `kubectl top pod -n production`
   - Check CPU usage: `kubectl top pod -n production`
   - Look for memory leaks in recent code changes

## Permanent Fix

**If code bug:**
- Fix the bug
- Add unit test to catch it
- Deploy via standard CI/CD

**If resource exhaustion:**
- Increase replica count or resource limits
- Add auto-scaling rule if not present
- Monitor resource usage going forward

**If dependency issue:**
- Increase timeout or retry logic
- Add circuit breaker to fail fast
- Improve health checks

## Post-Incident

- [ ] Update Prometheus alert for earlier detection (maybe 2-3% instead of 5%?)
- [ ] Add dashboard metric: error rate by type (5xx, 4xx, timeout)
- [ ] Run game day: simulate this failure, practice recovery steps
- [ ] Code review of permanent fix
- [ ] Update post-mortem with timeline and learnings
```

### 4. Runbook Best Practices

1. **Be specific, not vague** — "Check the logs" → "Run `kubectl logs -n production -l app=api-service --tail=1000`"
2. **Include actual commands** — Copy-paste ready, tested
3. **Decision trees** — "If X, do Y. If not X, do Z."
4. **Time estimates** — "This usually takes 5 minutes"
5. **Escalation path** — Know when to call for help
6. **Test runbooks** — Quarterly, practice recovering from real incidents
7. **Keep runbooks near alerts** — Link from each alert to its runbook
8. **Update after incidents** — Every real incident improves your runbook
9. **Assign owner** — Someone accountable for keeping it accurate
10. **Archive outdated runbooks** — Don't let stale docs cause confusion

### 5. Runbook Index

Create a master index of all runbooks:

```markdown
# Runbook Index

## Critical (Page on-call immediately)

- [High Error Rate](high-error-rate.md) — > 5% errors for > 5 min
- [Service Unreachable](service-unreachable.md) — Can't reach any pod
- [Database Down](database-down.md) — Can't connect to primary
- [Disk Full](disk-full.md) — Disk utilization > 95%

## Important (Alert goes to Slack)

- [High Latency](high-latency.md) — p99 > 1 second for > 5 min
- [Memory Leak](memory-leak.md) — Memory growing despite restarts
- [CPU Throttling](cpu-throttling.md) — Pod hitting CPU limits

## Operational (Informational)

- [Deployment Procedure](deployment.md) — How to deploy code
- [Database Backup Recovery](backup-recovery.md) — How to restore from backup
- [Capacity Scaling](capacity-scaling.md) — When and how to add resources

## Playbooks (Multi-service incidents)

- [Infrastructure Outage](playbooks/infrastructure-outage.md) — Region/zone goes down
- [Security Incident](playbooks/security-incident.md) — Suspected compromise
- [Data Corruption](playbooks/data-corruption.md) — Data integrity issue detected
```

---
