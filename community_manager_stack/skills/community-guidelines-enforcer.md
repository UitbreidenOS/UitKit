---
name: community-guidelines-enforcer
description: Audits moderation decisions for consistency, fairness, and transparency. Reviews flagged content, suggests enforcement action with confidence level, provides templates for common removal reasons. Ensures moderation log accuracy.
allowed-tools: Read, Write
effort: high
---

## When to activate

Before removing any content or banning a member. After major moderation action. Monthly audits for consistency. Input from moderation queue. Output: decision log, appeal history, policy update recommendations.

## When NOT to use

Not as a tool to override human moderator judgment. Not to automatically remove content without human review. Not to determine bans without legal/leadership sign-off.

## Moderation Review Checklist

Execute in order:

1. **Gather context** — Retrieve: flagged content, reporter identity + report reason, member history (prior violations, tenure, contributions), thread context, community guidelines version
2. **Classify violation type** — Choose one: Harassment, Hate Speech, Spam, Self-Promotion, Off-Topic, Misinformation, Explicit Content, Threat, Doxxing, Copyright, Other
3. **Assess severity** — Rate 1–10: (1) mild off-topic, (10) immediate safety threat. Use severity to determine response escalation.
4. **Check precedent** — Is there a prior similar case? How was it handled? Are we being consistent?
5. **Review member context** — First offense vs. repeat? Valued contributor with one slip vs. chronic offender? Tenure and contributions matter for proportionality.
6. **Evaluate confidence level** — How certain are we this is a violation? Rate: High (clear), Medium (reasonable interpretation), Low (ambiguous, borderline)
7. **Draft decision** — Recommend: Approve (no action), Warn (DM member), Hide (mods-only), Archive (move to graveyard), Remove (delete), Ban (temporary or permanent)
8. **Compose explanation** — Write concise reason for member appeal or transparency log. Avoid: blame, sarcasm, unsupported claims.
9. **Log decision** — Record: date, content_id, member_id, violation_type, severity, decision, confidence, by_whom, appeal_status
10. **Create appeal pathway** — If removed: include "You can appeal by replying to this DM with your perspective. We'll review within 48h."

## Violation Severity Scale

| Level | Examples | Response |
|---|---|---|
| **1-2: Mild** | Minor off-topic, repeated promotional tone | Gentle redirect in-thread or private message |
| **3-4: Low** | Self-promotion without community value, tone issue | Warn; give 1 chance to edit; remove if repeat |
| **5-6: Medium** | Harassment (personal attacks, mockery), misinformation | Remove; DM explanation; escalate if targeted campaign |
| **7-8: High** | Hate speech, doxxing, threats, illegal activity | Remove immediately; escalate to legal/safety; potential ban |
| **9-10: Critical** | Child safety, terrorism, explicit violence | Immediate removal; emergency escalation; preserve evidence |

## Decision Matrix

| Confidence | Severity 1–2 | Severity 3–4 | Severity 5–6 | Severity 7–8 | Severity 9–10 |
|---|---|---|---|---|---|
| **High** | Redirect | Warn → Remove if repeat | Remove + escalate | Ban + escalate | Emergency remove + all hands |
| **Medium** | Redirect | Redirect → Warn if pattern | Escalate to team | Ban + escalate | Emergency escalate |
| **Low** | Approve | Approve / Ask for clarification | Ask for clarification | Escalate to leadership | Emergency escalate |

## Moderation Log Template

```markdown
# Moderation Decision Log

**Date:** [YYYY-MM-DD]
**Decision By:** [Name]

| Content ID | Member | Violation Type | Severity | Confidence | Decision | Reason | Appeal Status | Notes |
|---|---|---|---|---|---|---|---|---|
| 45827 | @jane_smith | Self-promotion | 3 | High | Warn | Repeated promotion of external tool without community context. 1st offense. | Pending | Sent DM explaining guideline. |
| 45834 | @bob_wilson | Harassment | 6 | High | Remove | Targeted mockery of member's experience. 2nd offense (prior removed 30d ago). | Appealed | Reviewing appeal. |

---

## Consistency Audit (Monthly)

1. **Categorize last 100 decisions** by violation type and severity
2. **Compare enforcement rate** — e.g., "Self-promotion warnings: 40 → 32 removes. Ratio 1.25:1"
3. **Flag inconsistencies** — e.g., "Misinformation severity rated 4–7 depending on topic; standardize to 5"
4. **Update decision matrix** based on patterns learned
5. **Report to leadership** — Removals, bans, appeals, overturned decisions, policy updates recommended

---

## Appeal Template

If member contests removal:

```
Thank you for appealing. We take moderation seriously and want to be fair.

Here's why we removed [content/suspended you]:
- [Specific reason tied to guideline]
- [Context if relevant]

We can reconsider if:
- [Offer path to resolution, e.g., "remove the X part and repost"]
- [Or acknowledge mistake if clear error]

Reply to this message within 7 days to continue the conversation.
```

---

## Policy Update Recommendations

Quarterly, surface:
- Patterns in appeals (if >30% of removals appealed, policy may be unclear)
- High-severity cases that reveal guideline gaps
- Community feedback on enforcement tone or fairness
- Compliance or legal issues that warrant policy hardening

---
