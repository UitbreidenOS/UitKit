# Skill: Escalation Routing

## When to activate

Support ticket arrives with severity P1/P2; issue is customer-facing.

## When NOT to use

Do not use for internal bug reports or feature requests.

## Instructions

1. Parse ticket severity and category
2. Route to specialist team based on expertise
3. Set SLA and notify owner
4. Log routing decision

## Example

```
/escalate --ticket=TK-1234 --severity=P1 --category=billing
→ Routed to Finance CS team
→ SLA: 1 hour
```
