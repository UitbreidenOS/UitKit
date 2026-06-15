# EU-AI-Act Compliance Stack

Automate EU AI Act compliance (transparency, risk, human oversight) for Claude Code workflows.

**Includes:**
- High-risk detector skill (identifies regulated use cases)
- Transparency logger skill (documents AI decisions)
- Human-in-the-loop enforcer skill
- Bias auditor skill
- Prohibited use blocker hook (Stop)
- Transparency logger hook (PostToolUse)
- Risk classification hook (PreToolUse)

**Quick start:** `npx claudient add stack enterprise/compliance_stacks/eu_ai_act`

After install, Claude Code workflows flag prohibited uses, log transparency info, and enforce human oversight.

## Compliance Areas

| Area | Skill | Automation |
|------|-------|-----------|
| Prohibited uses (Art 5) | prohibited-use-blocker | Stops biometric mass surveillance, social scoring, manipulation |
| High-risk systems (Art 6) | high-risk-detector | Flags recruitment, loan decisions, law enforcement, migration |
| Transparency (Art 13) | transparency-logger | Documents AI involvement in decisions |
| Human oversight (Art 14) | human-in-loop-enforcer | Requires human approval for high-stakes outputs |
| Bias mitigation (Art 26) | bias-auditor | Tests for discrimination across protected attributes |

## Setup (5 min)

1. Install: `npx claudient add stack enterprise/compliance_stacks/eu_ai_act`
2. Configure `.claude/settings.json`:
   ```json
   {
     "eu_ai_act": {
       "risk_level": "high",
       "human_approval_required": true,
       "bias_test_frequency": "weekly"
     }
   }
   ```
3. Verify: `npx claudient audit` → EU-AI-Act section

## Evidence for Regulators

- Risk classification: `~/.claude/eu-ai-risk-log.jsonl`
- Transparency records: `~/.claude/eu-ai-transparency.jsonl`
- Human approvals: `~/.claude/eu-ai-approvals.jsonl`
- Bias audit reports: `npx claudient eu-ai-bias-audit`

All required documentation auto-generated for regulatory submission.

Enterprise: `enterprise@claudient.ai`
