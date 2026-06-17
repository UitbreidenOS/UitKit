# Design Prompt Framework

## When to activate

When creating system prompts for agents, designing parameterized prompt templates, defining constraint enforcement via prompts, or implementing guard rails for autonomous agent behavior.

## When NOT to use

For simple retrieval or analysis; for non-agent systems without formal constraints; for one-off prompts without production deployment.

## Instructions

Use this command to interactively design a production-grade prompt framework for an agent. You will define:

1. **Agent role** — Identity, scope, and authority
2. **Constraints** — Hard limits enforced in the prompt
3. **Input schema** — What the agent receives and validation rules
4. **Output schema** — Structured format for decisions
5. **Decision logic** — How the agent evaluates inputs
6. **Examples** — Input-output examples for calibration
7. **Failure handling** — How the agent handles edge cases

The output is a complete system prompt that can be used immediately with Claude.

### Interactive Design Flow

```
1. What role does this agent play? [Role/Title]
2. One sentence: what is the agent's purpose? [Purpose]
3. What decisions can it make autonomously?
   [List 2-3 specific decisions]

4. What must it escalate?
   [List 2-3 escalation triggers]

5. What are the hard constraints?
   [List 2-3 absolute limits]

6. Input format:
   [JSON schema or textual description]
   
   Example:
   {
     "request_id": "string",
     "input_data": "string",
     "context": "object"
   }

7. Output format:
   [JSON schema with decision, confidence, reasoning]
   
   Example:
   {
     "decision": "enum [option1, option2, escalate]",
     "confidence": "number 0-1",
     "reasoning": "string"
   }

8. Decision rules:
   If [condition]: → [decision]
   Else if [condition]: → [decision]
   Else: → [default]

9. Example 1 (happy path):
   Input: [example input]
   Expected output: [example output]

10. Example 2 (edge case):
    Input: [example input]
    Expected output: [example output]

11. What happens if:
    - Input is invalid? [Reject with error]
    - Confidence is low? [Escalate]
    - External service fails? [Retry/default]

Output:
- System prompt (production-ready)
- Input/output validation schemas
- Decision tree
- Test cases for validation
```

## Example

### Example: Expense Approval Agent

```
1. Agent role?
   → ExpenseApprover

2. Purpose?
   → Autonomously approve employee expense reports within budget limits.

3. Autonomous decisions?
   → Approve expenses within policy
   → Reject expenses that violate policy
   → Flag borderline expenses for manager review

4. Escalation triggers?
   → Confidence < 0.75
   → Expense category is ambiguous
   → Employee is new (< 3 months tenure)

5. Hard constraints?
   → Cannot approve expenses > $5,000
   → Cannot modify or change requested amount
   → Cannot approve expense without receipt evidence

6. Input format?
   {
     "expense_id": "string",
     "employee_id": "string",
     "amount": "number",
     "category": "enum [travel, meals, supplies, equipment, other]",
     "description": "string",
     "has_receipt": "boolean",
     "policy_category": "string"
   }

7. Output format?
   {
     "decision": "enum [approve, reject, flag_for_review]",
     "confidence": "number 0-1",
     "reasoning": "string max 500 chars",
     "policy_match": "boolean",
     "flag_reason": "string or null"
   }

8. Decision rules?
   If amount > 5000:
       → REJECT (hard limit)
   Else if !has_receipt:
       → REJECT (policy violation)
   Else if category matches policy with confidence > 0.90:
       → APPROVE
   Else if confidence 0.75-0.90:
       → FLAG_FOR_REVIEW (manager judgment needed)
   Else:
       → FLAG_FOR_REVIEW (too uncertain)

9. Example 1 (approve):
   Input:
   {
     "expense_id": "EXP-001",
     "employee_id": "EMP-123",
     "amount": 250,
     "category": "travel",
     "description": "Flight to client meeting",
     "has_receipt": true,
     "policy_category": "airfare"
   }
   Output:
   {
     "decision": "approve",
     "confidence": 0.95,
     "reasoning": "Travel expense within $5000 limit; receipt provided; matches airfare policy category",
     "policy_match": true,
     "flag_reason": null
   }

10. Example 2 (ambiguous):
    Input:
    {
      "expense_id": "EXP-002",
      "amount": 150,
      "category": "other",
      "description": "Office plants for team morale",
      "has_receipt": true
    }
    Output:
    {
      "decision": "flag_for_review",
      "confidence": 0.60,
      "reasoning": "Category is 'other'; office plants may or may not be approved under company policy. Manager judgment required.",
      "policy_match": false,
      "flag_reason": "Ambiguous category; manager review needed"
    }

11. Edge case handling?
    - Invalid category: Reject with "invalid_category"
    - Missing receipt: Reject with "missing_receipt"
    - Amount > limit: Reject with "exceeds_limit"
    - Low confidence: Flag for review, not approve/reject
```

**Output Generated:**

Production-ready system prompt with role, constraints, input/output schemas, decision logic, and examples.

---

Output the prompt framework in the following format:

```markdown
# Prompt Framework: [Agent Name]

## Agent Identity

You are [specific role] designed to [specific task]. Your decisions are audited; they impact [consequences]. Work within defined constraints; never deviate.

## Scope & Authority

You can autonomously:
- [Action 1]
- [Action 2]

You must escalate:
- [Escalation case 1]
- [Escalation case 2]

You CANNOT:
- [Forbidden action 1]

## Constraints

### Hard Limits
- [Constraint 1]
- [Constraint 2]

### Input Validation
[Validation rules]

## Input Format

```json
{...}
```

Validation:
- [Rule 1]
- [Rule 2]

## Output Format

```json
{...}
```

## Decision Logic

```
If [condition]:
    → [decision]
Else if [condition]:
    → [decision]
Else:
    → [default decision]
```

## Examples

### Example 1: Happy Path
Input: {...}
Output: {...}

### Example 2: Edge Case
Input: {...}
Output: {...}

## Testing Checklist

- [ ] Happy path works
- [ ] Rejection case works
- [ ] Escalation case works
- [ ] Input validation catches errors
- [ ] Output is always valid JSON
```

This prompt is production-ready and can be deployed immediately with Claude.
