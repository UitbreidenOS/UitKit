# GDPR Compliance Stack

Automate GDPR data governance and consent tracking for Claude Code teams in Europe.

**Includes:**
- Data processing skill (identify personal data)
- Consent tracker skill
- Privacy impact assessor skill
- Data retention policy skill
- Data deletion hook (PreToolUse)
- Consent validator hook (PostToolUse)
- Data residency enforcer hook (Stop)

**Quick start:** `npx claudient add stack enterprise/compliance_stacks/gdpr`

After install, Claude Code sessions flag personal data usage and enforce retention policies.

## Requirements Covered

| Article | Skill | Automation |
|---------|-------|-----------|
| Art 5 (Lawfulness) | consent-tracker | Logs consent per session |
| Art 6 (Legal basis) | data-processing | Flags unlawful processing |
| Art 17 (Right to delete) | data-deletion | Auto-purges on request |
| Art 32 (Security) | privacy-auditor | Encryption + access controls |
| Art 35 (DPIA) | privacy-impact-assessor | Flags high-risk flows |

## Setup (5 min)

1. Install: `npx claudient add stack enterprise/compliance_stacks/gdpr`
2. Configure `.claude/settings.json`:
   ```json
   {
     "gdpr": {
       "data_region": "eu-west-1",
       "retention_days": 90,
       "require_consent": true
     }
   }
   ```
3. Verify: `npx claudient audit` → GDPR section

## Evidence for DPA Audits

- Consent logs: `~/.claude/gdpr-consent.jsonl`
- Data processing records: `~/.claude/gdpr-processing-log.jsonl`
- DPIA assessments: `npx claudient gdpr-dpia [task]`

All GDPR-required evidence auto-generated. No manual documentation needed.

Enterprise: `enterprise@claudient.ai`
