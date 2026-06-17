# Agent Designer

## When to activate

When defining a new autonomous agent, redesigning agent scope or constraints, or documenting an existing agent's authority boundaries for a production system.

## When NOT to use

For simple, non-autonomous decision logic; for one-off scripts or tools that don't require explicit scope definition; for systems where agents have unbounded authority.

## Instructions

An agent is an autonomous decision-maker. It must have:

1. **Clear purpose** — One sentence: what domain does this agent own?
2. **Bounded scope** — Specific decisions it can make independently; what requires escalation.
3. **Explicit constraints** — Hard limits that are verified at execution time. Constraints are non-negotiable.
4. **Decision logic** — High-level algorithm for decision-making; how inputs map to outputs.
5. **Input/output schemas** — Structured, validated interfaces; no ambiguous formats.
6. **Error recovery** — What happens when the agent fails; retry logic, fallback agents, escalation.
7. **Observability** — What metrics, logs, and audit trails are essential for understanding agent behavior.

### Agent Definition Checklist

- [ ] **Purpose is one sentence.** Not a paragraph; crystal clear what this agent does.
- [ ] **Scope is bounded.** List specific actions the agent can perform autonomously.
- [ ] **Escalation is explicit.** Define exactly what requires human or supervisor review.
- [ ] **Constraints are identified.** Hard limits: resource quotas, action categories, decision boundaries.
- [ ] **Input schema is defined.** What data does the agent receive? What validation is required?
- [ ] **Output schema is defined.** What format should decisions take? How is confidence expressed?
- [ ] **Decision logic is documented.** How does the agent evaluate inputs? What reasoning does it use?
- [ ] **Error handling is specified.** What happens if constraint is violated? If external call fails? If output validation fails?
- [ ] **Observability is planned.** What metrics are critical? What audit fields must be logged?
- [ ] **Versioning is clear.** Model version, prompt version, constraint version tracked.

### Template

```markdown
# Agent: [Name]

## Purpose
[One sentence describing what domain this agent owns]

## Model Choice
[Haiku/Sonnet/Opus and brief justification]

## Scope of Authority
The agent can autonomously:
- [Action 1]
- [Action 2]
- [Action 3]

Requires human/supervisor approval for:
- [Escalation case 1]
- [Escalation case 2]

Forbidden actions (absolute restrictions):
- [Restriction 1]

## Constraints

### Hard Limits
- [Constraint 1: e.g., "Cannot approve expenses > $10,000"]
- [Constraint 2: e.g., "Cannot modify production databases"]
- [Constraint 3: e.g., "Must complete decision within 30 seconds"]

### Input Validation
- All inputs must conform to input schema (see below)
- Required fields: [List]
- Forbidden fields: [List, if any]

## Decision Logic

[Describe the high-level algorithm for how the agent makes decisions]

Example:
```
if (request_amount > THRESHOLD):
    escalate_to_human()
elif (confidence < MIN_CONFIDENCE):
    ask_for_clarification()
else:
    approve_request()
    log_decision()
```

## Input Schema

```json
{
  "type": "object",
  "properties": {
    "request_id": {"type": "string"},
    "user_id": {"type": "string"},
    "action": {"type": "string", "enum": ["approve", "reject", "request_info"]},
    "context": {"type": "string"}
  },
  "required": ["request_id", "user_id", "action"],
  "additionalProperties": false
}
```

## Output Schema

```json
{
  "type": "object",
  "properties": {
    "decision": {"type": "string", "enum": ["approve", "reject", "escalate"]},
    "confidence": {"type": "number", "minimum": 0, "maximum": 1},
    "reasoning": {"type": "string"},
    "escalation_reason": {"type": "string"},
    "audit_timestamp": {"type": "string", "format": "date-time"}
  },
  "required": ["decision", "confidence", "reasoning"],
  "additionalProperties": false
}
```

## Error Recovery

### Timeout Handling
- Timeout threshold: [N] seconds
- Recovery: [Escalate to supervisor / Retry / Default to conservative decision]
- Logging: Record timeout as incident for monitoring

### Constraint Violation
- Detection: Constraint checked at decision time
- Recovery: Reject decision; escalate with violation details
- Logging: Log constraint violation for audit trail

### External Service Failure
- Retry strategy: Exponential backoff, max [N] attempts
- Fallback: Use cached data or escalate
- Logging: Record service failure and recovery action

### Output Validation Failure
- Detection: Output schema validation fails
- Recovery: Reject output; retry or escalate
- Logging: Log schema validation error for debugging

## Observability

### Key Metrics
- `agent_decisions_total` (counter) — Total number of decisions made
- `agent_decision_latency_ms` (histogram) — Time to make decision (P50, P95, P99)
- `agent_escalation_rate` (gauge) — % of decisions escalated to humans
- `agent_constraint_violations` (counter) — Number of constraint violations detected
- `agent_output_validation_failures` (counter) — Number of output rejections

### Audit Fields (all decisions must log)
- `agent_name` — Name of this agent
- `agent_version` — Version of agent definition
- `model_version` — Claude model version used
- `prompt_version` — Version of system prompt
- `request_id` — Trace ID for this request
- `user_id` — Who initiated this decision
- `decision` — What the agent decided
- `confidence` — Confidence score (0-1)
- `reasoning` — Brief reasoning (first 500 chars)
- `constraints_checked` — Which constraints were verified
- `latency_ms` — How long the decision took
- `token_count` — Input/output tokens used
- `timestamp` — ISO 8601 timestamp
- `escalated` — Boolean: was this escalated?

### Anomaly Detection
- Trigger on: Unusually high latency (>2x P95)
- Trigger on: Unusually high escalation rate (>3x baseline)
- Trigger on: Repeated constraint violations from same user
- Trigger on: Output validation failures

## Versioning

- Agent definition version: [SEMVER]
- Model version: [claude-3.5-sonnet or equivalent]
- Prompt version: [SEMVER]
- Constraint set version: [SEMVER — increment when constraints change]

Track all versions in audit logs for compliance and debugging.
```

## Example

### Example: Content Moderator Agent

```markdown
# Agent: ContentModerator

## Purpose
Autonomously moderate user-generated content against brand guidelines and safety policies.

## Model Choice
Sonnet (high accuracy on nuanced content policy decisions; cost-effective at scale)

## Scope of Authority
Can autonomously:
- Approve content that clearly complies with all policies
- Flag content for human review when uncertain
- Reject content that clearly violates policies

Requires human review for:
- Edge cases where confidence < 0.8
- Novel policy violations not seen before
- Sensitive categories (political, religious content)

Forbidden:
- Cannot modify content (can only approve/reject/flag)
- Cannot permanently ban users

## Constraints

### Hard Limits
- Decision latency must be < 10 seconds
- Cannot escalate > 50% of requests (indicates model miscalibration)
- Must reject content containing explicit violence or harassment

### Input Validation
- Content length: 1 - 50,000 characters
- Required: content_id, user_id, content_type
- Rejected fields: user_rating, moderator_id

## Decision Logic

```
1. Check policy violation categories
   - If HIGH_SEVERITY_MATCH (violence, harassment): REJECT
   - If EXPLICIT_MATCH (hate speech, CSAM): REJECT
   - If POLICY_VIOLATION with confidence > 0.9: REJECT
   
2. Evaluate nuanced policies
   - If GREY_AREA with confidence 0.7-0.9: FLAG_FOR_REVIEW
   - If confidence < 0.7: FLAG_FOR_REVIEW (too uncertain)
   
3. Default approve for clear policy-compliant content
   - APPROVE
   - Log decision with confidence, reasoning, constraints checked
```

## Input Schema

```json
{
  "content_id": "string (required)",
  "content_text": "string (required, 1-50000 chars)",
  "content_type": "enum [post, comment, image_caption, video_title]",
  "user_id": "string (required)",
  "context": "string (optional, up to 500 chars)"
}
```

## Output Schema

```json
{
  "decision": "enum [approve, reject, flag_for_review]",
  "confidence": "number 0-1",
  "violation_categories": "array of strings",
  "reasoning": "string, max 500 chars",
  "required_manual_review": "boolean",
  "severity": "enum [low, medium, high]",
  "audit_timestamp": "ISO 8601"
}
```

## Error Recovery

**Timeout (> 10s):** Escalate with uncertainty flag. Never timeout-reject (too risky).

**Confidence too low:** Flag for human review; don't force a decision.

**External policy database unavailable:** Use cached policies; flag with "stale_policy" indicator.

**Output validation fails:** Reject malformed output; retry or escalate.

## Observability

**Key metrics:**
- `content_moderation_decisions/sec` (throughput)
- `content_moderation_latency_p95_ms` (target: < 5s)
- `content_moderation_escalation_rate` (target: 5-15%)
- `content_moderation_human_override_rate` (humans disagree: < 5%)

**Audit all:** decision, confidence, policy_categories_checked, latency, user_id, content_id

**Anomaly triggers:**
- Escalation rate > 30% (model miscalibration)
- Latency > 15s (external service slow)
- High human override rate (model not learning)
```

This example shows a complete agent definition with real constraints, decision logic, I/O schemas, and observability planning.

## Success Criteria

A well-designed agent:

- [ ] Purpose and scope fit on one page
- [ ] All constraints are testable and monitorable
- [ ] Decision logic can be traced (input → reasoning → output)
- [ ] Input/output schemas are strict (no ambiguity)
- [ ] Error recovery is specified for every failure mode
- [ ] Observability plan captures all critical metrics
- [ ] Agent can be versioned independently of model
