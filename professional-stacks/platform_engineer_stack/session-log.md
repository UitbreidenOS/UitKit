# Platform Engineer Session Log Template

## Session Overview

**Date:** YYYY-MM-DD  
**Duration:** HH:MM  
**Focus Area:** [Primary domain — e.g., infrastructure deployment, Kubernetes upgrade, CI/CD optimization, incident response]  
**Participant(s):** [Names or roles]  
**On-call Engineer:** [Name, if incident-related]

---

## Objectives

- [ ] Objective 1: [Specific, measurable outcome with success criteria]
- [ ] Objective 2: [Specific, measurable outcome with success criteria]
- [ ] Objective 3: [Specific, measurable outcome with success criteria]

---

## Context & Background

[Brief summary of the problem, existing infrastructure state, or preceding sessions]

**Previous Infrastructure State:** [Link to last infrastructure audit or deployment log]  
**Related Incidents:** [Links to post-mortems or related issues]  
**Relevant SLOs:** [Applicable availability/latency/error rate targets]

---

## Work Completed

### Task 1: [Task name — e.g., Deploy new Kubernetes cluster]

**Approach:** [High-level methodology]  
**Infrastructure Changes:** [Files modified: .tf, .yml, Helm charts]  
**Deployment Method:** [Terraform apply, kubectl apply, Helm upgrade, blue-green, canary]  
**Rollback Plan:** [How to revert if issues arise]  
**Result:** [Deployment success/failure, metrics impact]  
**Time Spent:** [HH:MM]

### Task 2: [Task name — e.g., Optimize database instance sizing]

**Approach:** [Analysis method, decisions made]  
**Infrastructure Changes:** [Files modified, parameters adjusted]  
**Cost Impact:** [Estimated savings or increased costs]  
**Performance Impact:** [Latency, throughput, resource utilization changes]  
**Result:** [Successfully deployed or pending approval]  
**Time Spent:** [HH:MM]

---

## Infrastructure Changes

### Resource Additions
| Resource | Type | Count | Specification | Estimated Cost |
|----------|------|-------|---------------|---|
| [Name] | EC2/RDS/K8s Pod | [N] | [t3.large, 2vCPU, 8GB RAM] | [$X/month] |

### Resource Removals
| Resource | Type | Reason | Estimated Savings |
|----------|------|--------|---|
| [Name] | [Type] | [Why removed] | [$X/month] |

### Configuration Changes
[List significant configuration changes: scaling policies, resource requests/limits, networking rules, etc.]

---

## Deployments & Rollouts

| Service | Version | Deployment Type | Status | Duration | Issues |
|---------|---------|---|---|---|---|
| [service-name] | v1.2.3 | Rolling/Blue-Green/Canary | Success/Failure | [MM:SS] | [None/details] |
| [service-name] | v2.0.0 | Rolling | Rolled back | [MM:SS] | [Error type] |

---

## Incidents & Issues

| Issue | Severity | Root Cause | Resolution | Time to Resolution | Preventive Action |
|-------|----------|-----------|-----------|---|---|
| [Problem] | Critical/Warning | [Analysis] | [How fixed] | [MM:SS] | [Updated alert/runbook] |
| [Problem] | Critical/Warning | [Analysis] | [How fixed] | [MM:SS] | [Updated alert/runbook] |

---

## Observability & Metrics

### Key Metrics Observed
| Metric | Baseline | Observed | Status | Notes |
|--------|----------|----------|--------|-------|
| Error rate (%) | [X%] | [Y%] | Normal/Elevated | [Explanation] |
| p99 latency (ms) | [X] | [Y] | Normal/Elevated | [Explanation] |
| Pod restart count | [X/hour] | [Y/hour] | Normal/Elevated | [Explanation] |
| Infrastructure cost/hour | [$X] | [$Y] | Normal/Over budget | [Explanation] |

### Alerts Triggered
- [Alert name]: [Severity] — [Root cause analysis]
- [Alert name]: [Severity] — [Root cause analysis]

### Dashboard Updates
[Note any new dashboards created or existing ones updated during this session]

---

## Cost & Budget Impact

| Category | Baseline | Current | Delta | Notes |
|----------|----------|---------|-------|-------|
| Compute | [$X/month] | [$Y/month] | [±$Z/month] | [Right-sizing, scale changes] |
| Database | [$X/month] | [$Y/month] | [±$Z/month] | [Capacity changes] |
| Storage | [$X/month] | [$Y/month] | [±$Z/month] | [Retention policy changes] |
| **Total** | **[$X/month]** | **[$Y/month]** | **[±$Z/month]** | |

**Error Budget Remaining:** [X minutes/month] (from [Y%] allocation)

---

## Infrastructure Artifacts & Documentation

**Terraform State:** [Path or S3 location]  
**Kubernetes Manifests:** [Git repo and branch]  
**Helm Charts:** [Registry and version]  
**Deployment Logs:** [Link to CI/CD logs or deployment tool]  
**Configuration Changes:** [Git commit hashes]

---

## SLO & Reliability Impact

| SLO | Target | Actual | Status | Impact |
|-----|--------|--------|--------|--------|
| Availability | 99.95% | [X%] | Met/At risk/Breached | [Details] |
| Latency (p99) | [X]ms | [Y]ms | Normal/Degraded | [Details] |
| Error rate | < 1% | [X%] | Normal/Elevated | [Details] |

---

## Observations & Insights

1. **Finding 1:** [Specific observation about infrastructure, performance, or operations]
   - Supporting evidence: [Metric, log snippet, or data point]
   - Implication: [What this means for future work]
   - Action: [What to do about it]

2. **Finding 2:** [Specific observation]
   - Supporting evidence: [Data]
   - Implication: [Meaning]
   - Action: [Next step]

3. **Finding 3:** [Specific observation]
   - Supporting evidence: [Data]
   - Implication: [Meaning]
   - Action: [Next step]

---

## Documentation & Runbooks

### Created/Updated
- [ ] Incident runbook: [Link]
- [ ] Deployment procedure: [Link]
- [ ] Troubleshooting guide: [Link]
- [ ] Architecture diagram: [Link]
- [ ] Cost optimization guide: [Link]

### Gaps Identified
[List documentation that should be created or improved]

---

## Next Steps

- [ ] Follow-up task 1: [Description, owner, due date]
- [ ] Follow-up task 2: [Description, owner, due date]
- [ ] Follow-up task 3: [Description, owner, due date]

**Recommended Priority:** [High/Medium/Low — reason]  
**Estimated Effort:** [Hours needed]

---

## Session Summary

[2-3 sentences synthesizing the session — what was deployed/changed/fixed, whether objectives were met, impact on reliability and cost]

**Success Criteria Met:** [Yes/Partial/No — explain]  
**Infrastructure Stability:** [Improved/Unchanged/Degraded]  
**Cost Efficiency:** [Improved/Unchanged/Degraded]  
**Lessons Learned:** [Process improvements, automation opportunities, or knowledge to carry forward]

---

## Rollback Checklist

If this session requires rollback:

- [ ] Previous Terraform state preserved
- [ ] Previous image tags available in registry
- [ ] Previous Kubernetes manifests version-controlled
- [ ] Rollback procedure documented and tested
- [ ] Communication plan (notify oncall, teams, customers)
- [ ] Rollback approved by [manager/team lead]

---

## References

- [Link to architecture documentation]
- [Link to infrastructure code repository]
- [Link to incident post-mortem (if applicable)]
- [Link to related Jira/GitHub tickets]
- [Link to cloud console dashboards]
