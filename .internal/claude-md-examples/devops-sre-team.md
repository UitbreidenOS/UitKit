# CLAUDE.md — Platform/SRE Team (Annotated Example)
> SRE team managing production infrastructure — shows how to wire in change management discipline, blast-radius awareness, and production safety checks that Claude must treat as hard gates.

<!-- ANNOTATION: The first line is a safety contract. Production changes are irreversible or hard to reverse. Claude must understand that in this context, caution and confirmation are features, not friction. -->
This is a Platform/SRE team repository. Production changes have real consequences — outages, data loss, financial impact. Default to caution. Confirm before any action that affects production systems. When in doubt, do less.

## What This Repo Contains

```
terraform/
  modules/          # Reusable Terraform modules
  environments/
    dev/
    staging/
    prod/           # PRODUCTION — requires explicit approval before applying
k8s/
  base/             # Kustomize base manifests
  overlays/
    dev/
    staging/
    prod/           # PRODUCTION — same rule
runbooks/           # Incident response and operational runbooks
scripts/            # One-off operational scripts (idempotent by convention)
alerts/             # Alertmanager rules
dashboards/         # Grafana dashboard JSON
```

## Production Gate Rules

<!-- ANNOTATION: This is the most important section. The "production gate" rules are a hard stop — Claude should refuse to generate a `terraform apply` against prod or a `kubectl delete` command without the user explicitly acknowledging. This isn't paranoia; it's industry standard change management. -->
Any change to `terraform/environments/prod/` or `k8s/overlays/prod/` requires:
1. A Jira ticket number in the PR description
2. Review from at least one other SRE
3. A maintenance window if downtime is possible
4. A tested rollback plan documented in the PR

If asked to make a production change directly, refuse and explain this process. Suggest the staging environment as the testing target.

## Terraform Rules

<!-- ANNOTATION: Terraform state is sacred. Corrupted state means manual reconciliation across potentially hundreds of resources. Claude must treat it as untouchable unless it's a deliberate, documented recovery operation. -->
- Always run `terraform plan` before `terraform apply` — review the plan for unintended changes
- Never use `terraform apply` with `-auto-approve` outside of CI/CD pipelines
- Never manipulate Terraform state directly (`terraform state mv`, `terraform state rm`) without a runbook
- Modules in `terraform/modules/` are shared — changing them affects all environments. Note all consumers in the PR
- Remote state is in GCS — do not use local state
- Lock file (`terraform.lock.hcl`) is committed — do not ignore or regenerate it without updating all module versions

## Kubernetes Rules

```bash
# Safe inspection commands (read-only)
kubectl get pods -n production
kubectl describe deployment auth -n production
kubectl logs -f deployment/auth -n production

# Destructive commands — confirm with user before running
kubectl delete pod <name>     # Forces pod restart
kubectl rollout restart       # Rolling restart of all pods
kubectl scale deployment      # Changes replica count
```

<!-- ANNOTATION: Naming specific safe vs destructive commands gives Claude a reference to use when suggesting operational steps. It will use safe inspection commands by default and flag when it's about to suggest a destructive one. -->
- `kubectl exec` into production pods requires a note in Slack #incidents
- Force-deleting a pod (`--force --grace-period=0`) is never safe without diagnosing why it won't terminate normally

## Incident Response

When the user describes an incident:
1. Ask: what is the user-visible impact?
2. Ask: when did it start? (helps correlate with recent deploys)
3. Suggest the relevant runbook from `runbooks/` if one exists
4. Suggest investigation commands before remediation commands
5. Always suggest the least-destructive fix first

<!-- ANNOTATION: The investigation-before-remediation rule prevents Claude from suggesting a pod restart as the first response to every problem. Restarts can mask root causes and make post-incident analysis harder. -->
Do not jump to remediation before investigation. A restart may fix the symptom but destroy the evidence.

## Alert and Dashboard Changes

- Alertmanager rules in `alerts/` — test with `amtool check-config` before deploying
- Alert severity levels: `critical` (pages on-call), `warning` (Slack only), `info` (dashboard only)
- Do not lower alert thresholds without understanding the current false positive rate
- Grafana dashboards exported as JSON — run `grafana-dash-lint` before committing

## Runbook Standards

<!-- ANNOTATION: Runbooks are high-stakes documents read by engineers under stress. These standards (imperative, verified, dated) exist because an out-of-date or ambiguous runbook makes an incident worse. -->
Every runbook must:
- Use imperative steps: "Run X", not "You should run X"
- Be tested — mark untested runbooks with `⚠️ UNTESTED`
- Include a "When to escalate" section
- Include a "Rollback" section
- Include a `Last Verified:` date at the top

## What Not To Do

<!-- ANNOTATION: "Never auto-approve terraform" appears both in the Terraform section and here. This deliberate duplication ensures it's not missed. For infrastructure, this single rule prevents the most catastrophic mistakes. -->
- Never suggest `terraform apply -auto-approve` outside CI
- Never suggest deleting Kubernetes resources as the first troubleshooting step
- Never suggest disabling alerts to reduce noise — fix the alert or the root cause
- Never suggest changes to `prod/` without asking if staging has been tested first
- Never write a runbook with ambiguous steps or untested commands
- Never suggest storing secrets in Git — always use the secrets manager (Vault)
