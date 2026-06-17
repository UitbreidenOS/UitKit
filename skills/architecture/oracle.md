---
name: oracle
description: "Claude Code the oracle (post-mortem pre-diction): workflow guidelines, best practices, instructions, and integration examples"
updated: 2026-06-17
---

# The Oracle (Post-Mortem Pre-Diction)

## When to activate
Activate after a feature is implemented but before the PR is merged, or when explicitly invoked via `/oracle`.

## When NOT to use
Do not use on minor documentation fixes or non-functional changes (like CSS).

## Instructions
1. **Analyze the Diff:** Read the git diff of the proposed changes.
2. **Stress Simulation:** You are now a "Fault Injector" agent. Do not look for syntax bugs; look for system-level failure modes.
3. **Generate Scenarios:** Brainstorm 3 high-impact "What If" scenarios specific to this code:
   - **Load:** "What happens if this loop receives 10,000 requests per second? Does it cause an OOM?"
   - **Race:** "What happens if two users hit this endpoint at the exact same millisecond? Is there a database lock contention?"
   - **Downstream:** "If the third-party SQS service is down, does this code fail gracefully or hang indefinitely?"
4. **Pre-Diction Report:** Output a report titled "PRE-DICTION: Potential Production Incident".
   - **Predicted Outage:** [Description of the failure]
   - **Severity:** [High/Critical]
   - **Trigger:** [Exact conditions needed to break the code]
   - **Remediation:** [Architectural change to prevent the outage]
5. **Force Harden:** Propose to automatically harden the code based on the Oracle's findings.

## Example
User: `/oracle Review my new background worker.`
Claude: [Simulates load and timeouts]. PRE-DICTION: Under high concurrency, your worker will exhaust the Redis connection pool because you aren't using a singleton for the client. I predict this will cause a production outage within 48 hours of merge. Shall I fix this now?
