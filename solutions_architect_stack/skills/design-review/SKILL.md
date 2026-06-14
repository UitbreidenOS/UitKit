---
name: design-review
description: Reviews a system design document for completeness, correctness, and feasibility. Checks against scalability, security, compliance, and operational best practices. Outputs structured review with critical findings, warnings, and recommendations.
allowed-tools: Read
effort: medium
---

# Design Review

## When to activate

After a solution architecture document is drafted and before development kickoff. Triggered when: design is ready for stakeholder approval, team wants a second opinion, or architecture is complex and needs validation. Can be run synchronously (get feedback before committing) or asynchronously (review after draft).

## When NOT to use

Not for code review — this is architecture/system design only. Not for performance optimization of existing systems (use performance-tuning). Not if the design document is incomplete or sketchy (run solution-architect first). Not as a substitute for customer sign-off — this is technical validation, not business approval.

## Review Checklist

**Completeness**
- [ ] Problem statement and success criteria defined?
- [ ] All requirements from Requirements Matrix addressed?
- [ ] System boundary clear (in-scope, out-of-scope)?
- [ ] All components have defined responsibility?
- [ ] Data flows documented (happy path, error cases)?
- [ ] API contracts written (request, response, errors)?
- [ ] Deployment model specified (monolith, services, serverless)?
- [ ] Security/compliance controls documented?
- [ ] Monitoring/alerting strategy defined?
- [ ] DR strategy with RTO/RPO targets?
- [ ] Implementation roadmap with phases?
- [ ] Known risks and mitigations listed?

**Correctness**
- [ ] Architecture matches requirements (no surprises)?
- [ ] Data model supports all use cases (no missing fields)?
- [ ] Component responsibilities don't overlap?
- [ ] Dependencies between components reasonable (no circular)?
- [ ] APIs are consistent (naming, error handling, versioning)?
- [ ] Scale calculations realistic (load testing planned)?

**Feasibility**
- [ ] Tech stack available and team-compatible?
- [ ] Budget and timeline realistic given scope?
- [ ] Skills/expertise available (or trainable)?
- [ ] Third-party dependencies reliable (no single points of failure)?
- [ ] Deployment frequency matches business needs?

**Scalability**
- [ ] Bottlenecks identified (CPU, memory, I/O, network)?
- [ ] Scaling strategy for each component (horizontal, vertical, caching)?
- [ ] Load testing plan defined?
- [ ] No synchronous-only critical paths?
- [ ] Stateless services where possible?

**Security & Compliance**
- [ ] Authentication/authorization strategy clear?
- [ ] Secrets managed (no hardcoding)?
- [ ] Encryption in transit and at rest?
- [ ] Audit logging for compliance?
- [ ] Data residency/GDPR/compliance checked?
- [ ] Network security (firewall, VPC isolation)?
- [ ] Dependency security scanning planned?

**Operational Readiness**
- [ ] Deployment automation planned?
- [ ] Rollback strategy defined?
- [ ] Health checks and monitoring in place?
- [ ] Log aggregation and alerting specified?
- [ ] On-call procedures documented?
- [ ] Incident response playbook needed?

## Output Format

### Design Review Report

**Executive Summary**
- Overall assessment: APPROVED / APPROVED WITH CONDITIONS / NEEDS REVISION
- Key strengths: [2-3 things the design gets right]
- Critical gaps: [What must be addressed before build]
- Estimated additional effort: [Extra weeks/complexity]

**Critical Findings** (must fix before code starts)

| Finding | Severity | Description | Recommendation |
|---|---|---|---|
| [Issue] | CRITICAL | [Why it's blocking] | [How to fix] |

**Warnings** (important, but not blocking)

| Warning | Severity | Description | Recommendation |
|---|---|---|---|
| [Issue] | HIGH | [Why it matters] | [How to address] |

**Questions for Customer**

- [ ] [Open question] — impacts [component] and [timeline]
- [ ] [Open question] — impacts [component] and [timeline]

**Best Practices Recommendations** (nice-to-haves, not blocking)

1. [Recommendation] — benefit: [what improves], effort: [S/M/L]
2. [Recommendation] — benefit: [what improves], effort: [S/M/L]

**Detailed Comments**

By section:
- **System Overview:** [Comments on clarity, completeness, diagram quality]
- **Components:** [Comments on decomposition, responsibility, tech choices]
- **Data Architecture:** [Comments on normalization, consistency model, partitioning]
- **API Contracts:** [Comments on naming, versioning, error handling]
- **Deployment:** [Comments on CI/CD, environments, rollback]
- **Scalability:** [Comments on bottlenecks, scaling strategy, load testing]
- **Security:** [Comments on auth, encryption, compliance controls]
- **Monitoring:** [Comments on metrics, alerting, observability]
- **DR:** [Comments on RTO/RPO, backup strategy, failover]

**Approval Signature**

```
Reviewed by: [Name, Role]
Date: [YYYY-MM-DD]
Approved: [YES / YES WITH CHANGES / NO]
Next steps: [Who does what, by when]
```

## Example Critical Finding

**Finding:** No caching strategy for product catalog  
**Severity:** HIGH  
**Description:** API will query database for every product request. Catalog changes 1x/month, but traffic is 10k req/sec. Database cannot handle this without sharding (expensive). Missing clear caching layer.  
**Recommendation:** Add Redis cache layer. TTL = 1 day. Invalidate on product update. Expected hit rate >95%. Estimated latency improvement: 10ms → 1ms.

---
