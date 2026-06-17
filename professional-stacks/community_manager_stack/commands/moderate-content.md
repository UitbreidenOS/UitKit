# /moderate-content

Review flagged content, moderate decisions, ensure consistency against community guidelines. Provides moderation templates for common violations.

## What It Does

Executes the community-guidelines-enforcer skill to:
- Assess severity (1–10 scale) of flagged content
- Review member history and moderation precedents for consistency
- Recommend action: Approve, Warn, Hide, Archive, Remove, or Ban
- Draft explanation for removal (if applicable) tied to specific guideline
- Log decision to moderation log with confidence level and appeal pathway
- Provide transparency post template (if community-wide impact)
- Suggest policy updates based on patterns

**Output:** Moderation decision log, templated explanation to member, public response (if applicable), appeal pathway.

## Usage

```
/moderate-content [content_id] [violation_type]
```

Examples:
```
/moderate-content post_4827 harassment
/moderate-content comment_5192 misinformation
/moderate-content user_3847 spam
```

## Outputs

1. **Moderation Decision** — Content ID, member, violation type, severity, confidence, recommended action, and explanation
2. **Member Notification Template** — Copy/paste explanation + appeal pathway
3. **Public Transparency Post (if applicable)** — Short summary of action + guideline reference
4. **Appeal Log Entry** — Log decision for consistency audits

## Decision Matrix Quick Reference

| Severity | Confidence High | Confidence Medium | Confidence Low |
|---|---|---|---|
| **1–2: Mild** | Redirect | Redirect | Approve |
| **3–4: Low** | Warn → Remove if repeat | Redirect → Warn | Redirect |
| **5–6: Medium** | Remove + escalate | Ask clarification | Escalate |
| **7–8: High** | Ban + escalate | Ban + escalate | Escalate |
| **9–10: Critical** | Emergency remove + escalate | Emergency escalate | Emergency escalate |

## SOP

Review flagged content within 4 hours. Document all decisions. Consistency audit monthly. When removing content: always explain why. When banning: always escalate to leadership. When unsure: escalate instead of removing. Publish decision transparency post weekly (show what was removed, why, how many appeals).

## Related Skills

- `community-guidelines-enforcer` — Makes the decision and provides templates
- `crisis-responder` — Handles escalations and community backlash
- `sentiment-analyzer` — Monitors for harassment/misinformation spikes
