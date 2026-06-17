# Design Agent

## When to activate

When defining a new autonomous agent, redesigning an agent's scope of authority, or documenting agent constraints for production deployment.

## When NOT to use

For simple decision logic without autonomous behavior; for non-critical systems; for manual processes without automation.

## Instructions

Use this command to interactively design an agent. You will be walked through:

1. **Agent identity** — Name, purpose, and domain
2. **Model selection** — Haiku (fast, low-cost), Sonnet (balanced), or Opus (complex reasoning)
3. **Scope definition** — What decisions can this agent make independently?
4. **Constraint specification** — Hard limits and boundaries
5. **Decision logic** — How the agent evaluates inputs and makes decisions
6. **Error recovery** — What happens when things fail
7. **Observability** — What metrics and logs are critical

The output is a complete agent specification that can be deployed immediately.

### Interactive Design Flow

```
1. What is this agent called? [Name]
2. One sentence: what does it do? [Purpose]
3. Which Claude model? [Haiku/Sonnet/Opus]
4. Why this model? [Justification]

5. What decisions can this agent make autonomously?
   [List 3-5 specific, bounded decisions]

6. When must this agent escalate to humans?
   [List 2-3 escalation triggers]

7. What are the hard limits?
   [Constraints the agent cannot violate]

8. How does the agent decide?
   [Decision tree or algorithm]

9. What input does it receive?
   [JSON schema for input]

10. What output does it produce?
    [JSON schema for output]

11. What happens if it times out?
    [Recovery strategy]

12. What metrics matter most?
    [2-3 critical metrics]

Output:
- Agent specification document (MARKDOWN)
- Prompt template ready for Claude
- JSON schemas for input/output validation
- Observability configuration (logs, metrics)
```

## Example

### Example: Contract Review Agent

```
1. Agent name?
   → ContractReviewer

2. One sentence purpose?
   → Autonomously review standard vendor contracts against company legal framework and flag high-risk terms for attorney review.

3. Claude model?
   → Sonnet (high accuracy on legal nuance; cost-effective)

4. Why Sonnet?
   → Haiku is too fast for legal judgment; Opus is overkill for standard template review; Sonnet balances speed and accuracy.

5. Autonomous decisions?
   → Approve contracts matching all approved terms
   → Reject contracts with forbidden clauses
   → Flag contracts with non-standard terms for attorney review

6. Escalation triggers?
   → Confidence < 0.80
   → Unrecognized vendor
   → Unusual liability language

7. Hard limits?
   → Cannot modify contract language
   → Cannot commit to legal obligation
   → Cannot approve contracts with specific forbidden clauses (list provided)

8. Decision logic?
   If contract matches approved template with confidence > 0.95:
       → APPROVE
   Else if contract contains forbidden clause:
       → REJECT
   Else if confidence 0.80-0.95:
       → FLAG_FOR_ATTORNEY
   Else (confidence < 0.80):
       → ESCALATE

9. Input schema?
   {
     "contract_id": string,
     "vendor_name": string,
     "contract_text": string (1-50000 chars),
     "contract_type": enum [NDA, Service Agreement, License, Other]
   }

10. Output schema?
    {
      "decision": enum [approve, reject, flag_for_attorney],
      "confidence": number 0-1,
      "risk_factors": [array of strings],
      "reasoning": string (max 1000 chars),
      "attorney_notes": string or null
    }

11. Timeout recovery?
    Max latency: 60s
    Timeout action: Escalate to attorney with "timeout" flag
    Retry: Yes, exponential backoff, max 2 times

12. Critical metrics?
    - approval_rate (% approved autonomously)
    - escalation_rate (% flagged for attorney)
    - attorney_override_rate (% approved contracts rejected by attorney)
```

**Output Generated:**

Agent specification with all details above, system prompt, JSON validation schemas, and observability plan.

---

Output the agent specification document in the following format:

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

Requires human/supervisor approval for:
- [Escalation case 1]

Forbidden actions:
- [Restriction 1]

## Constraints
- [Hard limit 1]
- [Hard limit 2]

## Decision Logic
[Algorithm or decision tree]

## Input Schema
[JSON schema]

## Output Schema
[JSON schema]

## Error Recovery
[Timeout, validation failure, escalation]

## Observability
[Key metrics and audit fields]

---

## System Prompt (ready to use)

[Full system prompt for Claude]
```

This prompt is production-ready and can be deployed immediately.
