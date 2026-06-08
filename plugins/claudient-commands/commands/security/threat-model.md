---
description: Produce a STRIDE threat model for a system component or the full application
argument-hint: "[component, feature, or diagram description]"
---
Produce a STRIDE threat model for `$ARGUMENTS`. If no argument is given, model the full application based on the codebase, README, and any architecture documentation found in the repo.

**Step 1 — Understand the system**

Before modeling, answer these questions from the code and docs:
- What are the entry points? (HTTP endpoints, message queues, file ingestion, CLI)
- What data stores are used and what do they contain?
- What external services does the system call?
- What are the trust boundaries? (internet-facing vs internal, user vs admin vs service-to-service)
- What is the most sensitive data the system handles?

Produce a brief data flow summary: actors → entry points → processing → data stores → external services.

**Step 2 — Apply STRIDE**

For each component or data flow identified, assess each threat category:

| Threat | Question to ask |
|---|---|
| **Spoofing** | Can an attacker impersonate a user, service, or component? |
| **Tampering** | Can data be modified in transit or at rest without detection? |
| **Repudiation** | Can an actor deny performing an action due to missing logs or weak attribution? |
| **Information Disclosure** | Can sensitive data leak through errors, logs, side-channels, or overly broad API responses? |
| **Denial of Service** | Can an attacker exhaust resources (CPU, memory, connections, rate limits)? |
| **Elevation of Privilege** | Can a lower-trust actor gain capabilities reserved for higher-trust actors? |

**Step 3 — Rate each threat**

Use DREAD-lite scoring for each finding:
- **Damage**: 1–3 (low / medium / high impact if exploited)
- **Reproducibility**: 1–3 (hard / sometimes / always reproducible)
- **Exploitability**: 1–3 (expert / moderate / unskilled attacker)
- Score = sum (max 9). ≥7 = Critical, 5–6 = High, 3–4 = Medium, ≤2 = Low

**Step 4 — Output**

```
## Threat Model: [Component/System]

### System Overview
[Data flow summary from Step 1]

### Threats

#### [STRIDE category] — [Threat title]
Component: [entry point, data flow, or store]
Description: what the attacker does and achieves
DREAD score: D=N R=N E=N → Total=N (Severity)
Mitigations:
  - [current control, if any]
  - [recommended control]

### Risk Summary Table
| # | Threat | Severity | Mitigated? |
```

**Step 5 — Prioritized recommendations**

List the top 5 mitigations by risk score, with specific implementation guidance for this codebase.
