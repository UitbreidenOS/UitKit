# Decision Logger Hook

Logs all investment decisions with scoring rationale and partner sign-off.

## When It Fires

After investment decision is approved by partner (PostToolUse).

## What It Logs

1. Company name, stage, industry, geography
2. Founding team
3. Opportunity score and category breakdown
4. Investment recommendation (GO/REVIEW/PASS)
5. Key reasoning (2–3 bullets)
6. Financial snapshot (ARR, burn, runway if available)
7. Market snapshot (TAM, CAGR)
8. Partner name, sign-off date/time
9. Agreed terms (check size, equity target)
10. Conditions for follow-on or next review

## Settings Entry

```json
{
  "hooks": {
    "decision-logger": {
      "event": "PostToolUse",
      "script": ".claude/hooks/decision-logger.sh",
      "description": "Log investment decisions to session-log.md with partner sign-off"
    }
  }
}
```

## Script Template

```bash
#!/bin/bash

# decision-logger.sh — Log investment decisions to session-log.md

SESSION_LOG="investor_vc_stack/session-log.md"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M')

# Append decision entry to session log
cat >> "$SESSION_LOG" <<EOF

## [$TIMESTAMP]

**Company:** [Company Name, Stage, Industry, Geography]
**Founder(s):** [Names, Background]
**Opportunity Score:** [Score] — [GO/REVIEW/PASS]
**Action:** Investment Decision
**Status:** APPROVED
**Key Metrics:** ARR \$[X], Burn \$[X]/mo, Runway [X] months
**Market:** TAM \$[X]B, Growth [X]% CAGR
**Recommendation:** [GO/REVIEW/PASS with rationale]
**Partner Sign-off:** [Partner Name] — $TIMESTAMP
**Terms:** [Check size, equity target, conditions]
**Next Steps:** [Legal review, term sheet, follow-up call]

EOF

echo "Decision logged to $SESSION_LOG"
exit 0
```

## Output Location

All investment decisions logged to: `investor_vc_stack/session-log.md`
