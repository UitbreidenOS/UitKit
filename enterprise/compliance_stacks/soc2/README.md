# SOC2 Compliance Stack

Automate SOC2 Type II compliance checks and audit logging for Claude Code teams.

**Includes:**
- Access audit skill
- Change log skill  
- Security reviewer skill
- Compliance reporter skill
- Audit trail hook (PostToolUse)
- Access control validator hook (PreToolUse)
- Compliance alert hook (Stop)

**Quick start:** `npx claudient add stack enterprise/compliance_stacks/soc2`

After install, every Claude Code session logs to `~/.claude/audit-logs/` (append-only, immutable).

Run `npx claudient audit` to see SOC2 controls status.

## Controls Covered

| Control | Hook/Skill | Evidence |
|---------|-----------|----------|
| CC6.1 (Logical access) | access-control-validator | Audit log with permission checks |
| CC6.2 (Access removal) | compliance-alert | Alert on unexpected removals |
| CC7.1 (Change management) | change-logger | Immutable change log |
| CC7.2 (Change testing) | security-reviewer | Pre-deploy scan |

## Setup (5 min)

1. Install: `npx claudient add stack enterprise/compliance_stacks/soc2`
2. Enable hooks in `.claude/settings.json`:
   ```json
   {
     "hooks": {
       "audit-trail": true,
       "access-control-validator": true,
       "compliance-alert": true
     }
   }
   ```
3. Verify: `npx claudient doctor` → should show "Audit hooks active ✅"

## For Auditors

Provide this evidence each audit cycle:
- `~/.claude/audit-logs/` (30-day rolling)
- Output of `npx claudient compliance-report`
- Git change log with signed commits

No manual work — fully automated.

Enterprise: `enterprise@claudient.ai`
