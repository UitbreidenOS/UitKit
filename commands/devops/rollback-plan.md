---
description: Generate a step-by-step rollback plan for the current deployment or recent change
argument-hint: "[service name, version, or PR/commit to roll back]"
---
Generate a rollback plan for: $ARGUMENTS

Inspect the project to determine the deployment mechanism (Kubernetes, ECS, Heroku, bare VM, Lambda, etc.), the CI/CD pipeline, and any stateful components (databases, queues, caches, feature flags).

Produce a runbook with these sections:

**1. Pre-rollback checklist**
- Confirm the target previous version/revision to roll back to (image tag, Git SHA, Helm revision)
- Identify who must approve before executing (on-call lead, incident commander)
- Check that the previous artifact still exists in the registry/store — if not, flag immediately
- List any schema migrations applied since the previous version (irreversible ones block a clean rollback)

**2. Impact assessment**
- Estimated downtime or degraded window during rollback
- Which users/tenants/regions are affected
- Any data written since the bad deploy that may be incompatible with the previous schema

**3. Rollback steps** (numbered, copy-paste ready commands)

For Kubernetes:
```
kubectl rollout undo deployment/<name> -n <namespace>
kubectl rollout status deployment/<name> -n <namespace>
kubectl get pods -n <namespace> -w
```

For Helm:
```
helm history <release> -n <namespace>
helm rollback <release> <revision> -n <namespace>
```

For database migrations: provide the exact down-migration command or note that a manual schema reversal is required and specify what SQL must be run.

For feature flags: list which flags must be toggled off before or after the binary rollback.

**4. Verification steps**
- Smoke test commands or URLs to confirm the service is healthy on the previous version
- Key metrics to watch for 10 minutes post-rollback (error rate, latency p99, queue depth)

**5. Abort criteria**
- Conditions under which the rollback itself should be stopped and escalated
- Fallback if rollback fails (e.g., traffic shifting to a known-good region)

**6. Post-rollback actions**
- Open a tracking issue for root cause analysis
- Preserve logs and traces from the incident window before they expire
- Timeline to attempt re-deploy with the fix

Flag any step that cannot be automated and requires human judgment or elevated access.
