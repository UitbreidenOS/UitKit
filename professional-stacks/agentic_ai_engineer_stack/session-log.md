# Agentic AI Engineer Session Log Template

## Session Overview

**Date:** YYYY-MM-DD  
**Duration:** HH:MM  
**Focus Area:** [Primary domain — e.g., agent design, orchestration, error recovery, observability]  
**Participant(s):** [Names or roles]  

---

## Objectives

- [ ] Objective 1: [Specific, measurable outcome — e.g., design autonomous content approver]
- [ ] Objective 2: [Specific, measurable outcome]
- [ ] Objective 3: [Specific, measurable outcome]

---

## Context & Background

[Brief summary of the problem, existing agent system, or preceding sessions]

**Related Agents:** [References to other agents in the system]  
**Relevant PRs/Issues:** [Links to tracking tickets]  
**Previous Session Results:** [Link to prior session log or learnings]

---

## Work Completed

### Task 1: [Agent/Orchestration Design]

**Agent Name/System:** [Identify the agent or multi-agent system]  
**Design Approach:** [How was scope defined, constraints identified, escalation designed]  
**Constraints Defined:** [Hard limits, authority boundaries, validation rules]  
**Tools/Patterns Used:** [Key design patterns, frameworks, or methodologies]  
**Changes Made:** [Files created or modified]  
**Result:** [Agent definition complete, orchestration validated, etc.]  
**Time Spent:** [HH:MM]

### Task 2: [Error Recovery & Testing]

**System Tested:** [Which agent or orchestration]  
**Failure Modes Covered:** [List of scenarios tested]  
**Recovery Procedures:** [Retry logic, fallback agents, escalation paths tested]  
**Test Results:** [Pass/fail for each scenario]  
**Result:** [Recovery procedures verified and working]  
**Time Spent:** [HH:MM]

---

## Agents Designed or Modified

| Agent Name | Purpose | Scope | Model | Status |
|---|---|---|---|---|
| [Name] | [1-line purpose] | [Bounded authority] | [Haiku/Sonnet/Opus] | [Draft/Verified/Deployed] |
| [Name] | [1-line purpose] | [Bounded authority] | [Haiku/Sonnet/Opus] | [Draft/Verified/Deployed] |

---

## Orchestrations Designed or Modified

| Orchestration | Agents Involved | Pattern | Task Count | Status |
|---|---|---|---|---|
| [Name] | [Agent1, Agent2, ...] | [Sequential/Parallel/Hierarchical/Consensus] | [N] | [Design/Testing/Deployed] |
| [Name] | [Agent1, Agent2, ...] | [Sequential/Parallel/Hierarchical/Consensus] | [N] | [Design/Testing/Deployed] |

---

## Constraints & Validation

### New Constraints Defined

| Constraint | Type | Enforcement |
|---|---|---|
| [e.g., "No unapproved changes to production"] | Hard limit | Verified at decision time |
| [e.g., "Token budget < 10K per agent"] | Resource quota | Monitored continuously |

### Validation Results

- [ ] All constraints verified in happy path
- [ ] All constraints verified in error scenarios
- [ ] Constraint violations logged and escalated
- [ ] No constraint escapes found

---

## Observability & Instrumentation

### Logging Configuration

**Structured fields captured:**
- Agent: [Name and version]
- Input: [Sanitized input summary]
- Decision: [Decision made]
- Confidence: [Confidence score if applicable]
- Reasoning: [Key reasoning steps]
- Latency: [Execution time in ms]
- Tokens: [Input/output token count]

**Log destinations:**
- File: [Path to log file]
- Service: [DataDog/Prometheus/ELK endpoint]
- Format: [JSON/plaintext]

### Metrics Instrumented

| Metric | Type | Threshold/Target |
|---|---|---|
| [e.g., agent_execution_latency] | Histogram | P99 < 5s |
| [e.g., constraint_violation_rate] | Counter | 0 violations |
| [e.g., escalation_rate] | Gauge | < 5% |

### Audit Trail

- [ ] All agent inputs logged
- [ ] All decisions logged with reasoning
- [ ] All outputs validated and logged
- [ ] All errors and recoveries logged
- [ ] Immutable audit record maintained

---

## Testing & Validation

### Test Scenarios Executed

| Scenario | Expected Behavior | Actual Result | Status |
|---|---|---|---|
| [Happy path] | [Agent completes successfully] | [Result] | [Pass/Fail] |
| [Timeout] | [Escalate to supervisor] | [Result] | [Pass/Fail] |
| [Constraint violation] | [Reject and log] | [Result] | [Pass/Fail] |
| [Dependency failure] | [Retry with backoff] | [Result] | [Pass/Fail] |

### Failure Mode Analysis

| Failure Mode | Detection | Recovery | Verified |
|---|---|---|---|
| [e.g., External API timeout] | [Timeout after 30s] | [Retry 3x; escalate] | [Yes/No] |
| [e.g., Resource exhaustion] | [Token count exceeds budget] | [Queue remaining tasks] | [Yes/No] |
| [e.g., Deadlock in orchestration] | [No progress for 60s] | [Abort; reset shared state] | [Yes/No] |

---

## Blockers & Issues

| Issue | Root Cause | Resolution | Impact |
|---|---|---|---|
| [Problem statement] | [Analysis] | [How it was resolved or workaround] | [HH:MM delay or blocker status] |
| [Problem statement] | [Analysis] | [How it was resolved or workaround] | [HH:MM delay or blocker status] |

---

## Artifacts & Deliverables

**Agent Definition Files:**
- `agents/[agent-name].md` — Agent specification with scope, constraints, decision logic
- `agents/[agent-name].json` — JSON schema for agent configuration (if applicable)

**Orchestration Files:**
- `orchestrations/[name].md` — Orchestration design with task graph, dependencies, coordination protocol
- `orchestrations/[name].yaml` — Orchestration configuration (if using declarative format)

**Prompt Files:**
- `prompts/[agent-name].md` — System prompt for agent with input/output schema

**Test & Validation:**
- Test results → [Path or reference]
- Error recovery verification → [Path or reference]
- Observability configuration → [Path or reference]

---

## Observations & Insights

1. **Insight 1:** [Specific discovery about agent behavior, orchestration patterns, or constraint design]
   - Supporting evidence: [Metric, test result, or logged observation]
   - Implication: [What this means for the agent system]

2. **Insight 2:** [Specific discovery about error recovery or escalation]
   - Supporting evidence: [Test scenario or monitoring data]
   - Implication: [Impact on reliability or safety]

3. **Insight 3:** [Specific discovery about multi-agent coordination]
   - Supporting evidence: [Orchestration behavior or performance metric]
   - Implication: [Patterns to replicate or anti-patterns to avoid]

---

## Next Steps

- [ ] Follow-up task 1: [Description and priority]
- [ ] Follow-up task 2: [Description and priority]
- [ ] Follow-up task 3: [Description and priority]

**Recommended Priority:** [High/Medium/Low and reasoning]

---

## Session Summary

[2-3 sentences synthesizing the session — which agents were designed, what orchestrations were validated, and the impact on the overall system]

**Success Criteria Met:** [Yes/Partial/No — explain briefly]  
**Safety & Verification Status:** [All constraints verified/Pending verification/Issues found]  
**Lessons Learned:** [Process improvements, design patterns discovered, constraints learned]

---

## References

- [Link to agent specifications]
- [Link to orchestration design documentation]
- [Link to error recovery procedures]
- [Link to observability configuration]
- [Link to related GitHub issues or PRs]
