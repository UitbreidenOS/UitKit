🔍 Claude Code Compliance Audit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Project: /Users/tushar/Desktop/Claudient
Date:    2026-06-15

DIMENSION              STATUS    SCORE    FINDING
Skills Coverage        ❌ FAIL    0/20     No skills installed
Agent Configuration    ❌ FAIL    0/20     No agents deployed
Hook Security          ⚠️ WARN   0/20     No hooks installed
CLAUDE.md Governance   ✅ PASS    20/20    CLAUDE.md with 18 sections
Rules Compliance       ❌ FAIL    0/20     No rules configured
Freshness              ✅ PASS    20/20    All current
Permission Scope       ✅ PASS    20/20    Permission scope OK
Benchmark Coverage     ❌ FAIL    0/20     No skills to benchmark

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Audit Score: 60/160 (38%)

Recommendations:
  → Install more skill categories: npx claudient add skills all
  → Deploy agents: npx claudient add agents
  → Review and install hooks: npx claudient add hooks
  → Add rules to CLAUDE.md: npx claudient add rules --write
  → Run: npm run benchmark (in repo context)

─────────────────────────────────────────────────────────────────
🏢 Need a full governance audit with remediation support?
   Claudient Enterprise includes:
   • SOC2 / GDPR / EU-AI-Act compliance stacks
   • Audit trail hooks with SSO integration
   • Dedicated stack engineer
   → Book a demo: https://claudient.ai/enterprise
   → Email: enterprise@claudient.ai
─────────────────────────────────────────────────────────────────
