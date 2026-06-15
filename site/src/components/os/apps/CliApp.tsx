import { useState } from "react";
import { Eyebrow, Tag, YellowButton } from "./ui";

interface CmdDef {
  id: string;
  name: string;
  icon: string;
  desc: string;
  usage: string;
  output: string;
  tier: "free" | "team" | "enterprise";
}

const commands: CmdDef[] = [
  {
    id: "doctor",
    name: "claudient doctor",
    icon: "🩺",
    desc: "Health check — scans .claude/ setup, reports conflicts, stale skills, missing hooks, token waste.",
    usage: "claudient doctor",
    tier: "free",
    output: `claudient doctor — Health Check Report
────────────────────────────────────────────
✓ CLAUDE.md found              (3 files)
✓ Skills installed             (412 files)
✓ Agents installed             (194 files)
✓ Hooks configured             (8 hooks)
✓ MCP servers connected        (3 servers)
! Stale skills detected        (4 skills > 6 months)
  → backend/fastapi-crud       (last updated: 2025-11-20)
  → gtm/lead-scoring           (last updated: 2025-12-01)
  → legal/gdpr-expert          (last updated: 2025-10-15)
  → sdr/cold-email-v1          (last updated: 2025-09-01)
! Token waste detected          (~1,240 tokens/session)
  → Consider enabling Caveman mode for verbose agents
✓ No conflicts found
────────────────────────────────────────────
Score: 88/100  Grade: B+
Recommendation: Update 4 stale skills → run claudient update`,
  },
  {
    id: "consult",
    name: "claudient consult",
    icon: "🔍",
    desc: "Skill finder — asks what you're building, recommends stacks and skills from the 400+ catalog.",
    usage: 'claudient consult "I need to build a REST API with auth and testing"',
    tier: "free",
    output: `claudient consult — Skill Recommendation
────────────────────────────────────────────
Query: "build a REST API with auth and testing"

Top recommended skills:
  1. backend/fastapi-expert       (score: 0.95)
  2. backend/auth-patterns        (score: 0.92)
  3. productivity/testing-suite   (score: 0.90)
  4. devops-infra/api-testing     (score: 0.87)
  5. database/postgresql-tuning   (score: 0.85)

Recommended stack: fullstack_developer_stack
  → 8 skills + 3 commands + 4 hooks + 2 MCP configs

Install with:
  npx claudient add stack fullstack_developer_stack`,
  },
  {
    id: "share",
    name: "claudient share",
    icon: "📤",
    desc: "Export your active skills as a shareable GitHub Gist. Network effect: every share is a referral.",
    usage: "claudient share --gist",
    tier: "free",
    output: `claudient share — Bundle Export
────────────────────────────────────────────
Bundling 12 active skills...
✓ Created bundle: claudient-bundle-2026-06-15.yaml

Skills included:
  backend/fastapi-expert
  backend/auth-patterns
  productivity/adr-writer
  productivity/testing-suite
  devops-infra/terraform-modules
  + 7 more

Gist URL: https://gist.github.com/tushar2704/abc123...
Share with: claudient import https://gist.github.com/tushar2704/abc123`,
  },
  {
    id: "import",
    name: "claudient import",
    icon: "📥",
    desc: "Import a community bundle from a GitHub Gist URL. One command to replicate any team's setup.",
    usage: "claudient import <gist-url>",
    tier: "free",
    output: `claudient import — Bundle Import
────────────────────────────────────────────
Fetching: https://gist.github.com/community/backend-pro...
✓ Validated bundle (15 skills, 2 agents, 3 hooks)

Installing:
  ✓ backend/fastapi-expert
  ✓ backend/auth-patterns
  ✓ backend/django-orm
  ✓ productivity/adr-writer
  ... (15 skills total)

✓ Imported to: ~/.claude/skills/community/backend-pro/
✓ Added 2 agents: pr-reviewer, test-generator
✓ Activated 3 hooks: test-coverage, lint-check, security-scan

Next: Run claudient doctor to verify your setup`,
  },
  {
    id: "audit",
    name: "claudient audit",
    icon: "📋",
    desc: "Deep compliance audit across 8 dimensions: SOC2, GDPR, EU-AI-Act, HIPAA. Score 0–160.",
    usage: "claudient audit --full",
    tier: "enterprise",
    output: `claudient audit — Compliance Report (8 Dimensions)
────────────────────────────────────────────
Date: 2026-06-15 | Scope: Full Organization

1. Access Control (SOC2)         ████████░░ 16/20
   ✓ SSO enabled   ✓ Role-based access   ! 2 users without MFA

2. Data Protection (GDPR)        ███████░░░ 14/20
   ✓ Data minimization   ✓ Retention policies   ! PII detected in 3 skills

3. AI Governance (EU-AI-Act)     █████████░ 18/20
   ✓ Transparency logs   ✓ Human-in-the-loop   ✓ Risk classification

4. Healthcare (HIPAA)            ███████░░░ 14/20
   ✓ Audit trail   ! PHI handling not configured

5. Financial (SOX)               ████████░░ 16/20
   ✓ Immutable records   ✓ Change logging

6. Security (ISO 27001)          █████████░ 18/20
   ✓ Encryption   ✓ Key rotation   ✓ Incident response

7. Privacy (CCPA)                ███████░░░ 14/20
   ✓ Data subject rights   ! Opt-out not automated

8. Operational Resilience        █████████░ 18/20
   ✓ Disaster recovery   ✓ Backup verified
────────────────────────────────────────────
Total Score: 128/160  Grade: B+  Tier: Business-ready

Fix 3 warnings → upgrade to Enterprise for automated remediation`,
  },
  {
    id: "score",
    name: "claudient score",
    icon: "🎯",
    desc: "AI-Readiness Scorecard — evaluates your team's Claude Code setup on 5 axes, outputs 0–100 with tier recommendations.",
    usage: "claudient score",
    tier: "free",
    output: `claudient score — AI-Readiness Scorecard
────────────────────────────────────────────
Organization: acme-corp
Date: 2026-06-15

Score Breakdown:
  Skills Coverage       █████████░  88/100
  Agent Maturity        ████████░░  76/100
  Hook Integration      ███████░░░  65/100
  MCP Connectivity      █████████░  90/100
  Documentation         ████████░░  78/100
────────────────────────────────────────────
Overall Score: 79/100   Grade: B   Tier: Team-ready

Recommendations:
  1. Add 5 more hooks → +10 points
  2. Enable 2 more MCP servers → +5 points
  3. Document 3 custom agents → +5 points

Projected after fixes: 99/100 (Grade A, Enterprise-ready)

→ Run claudient consult to find the right skills
→ Upgrade to Team for governance hooks + priority support`,
  },
];

export function CliApp() {
  const [active, setActive] = useState("doctor");
  const [copied, setCopied] = useState(false);
  const cmd = commands.find((c) => c.id === active) ?? commands[0];

  const copyOutput = () => {
    navigator.clipboard.writeText(cmd.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyUsage = () => {
    navigator.clipboard.writeText(cmd.usage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col sm:flex-row">
      {/* Sidebar */}
      <aside className="sm:w-56 shrink-0 border-r border-hairline bg-cream flex flex-col overflow-hidden">
        <div className="p-3">
          <Eyebrow color="#f54e00">CLI Commands</Eyebrow>
          <div className="mt-1 text-[11px] text-mute">6 commands — 4 free, 2 enterprise</div>
        </div>
        <div className="flex-1 overflow-auto px-2 pb-2 space-y-0.5">
          {commands.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`w-full text-left flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12px] font-semibold transition ${
                c.id === active ? "bg-white border border-hairline text-ink shadow-sm" : "text-body hover:bg-white/60"
              }`}
            >
              <span className="text-sm">{c.icon}</span>
              <span className="flex-1 truncate">{c.name.replace("claudient ", "")}</span>
              {c.tier === "enterprise" && (
                <span className="text-[8px] font-bold uppercase text-brand-purple bg-brand-purple/10 px-1 py-0.5 rounded">Pro</span>
              )}
            </button>
          ))}
        </div>
        <div className="px-3 py-2 border-t border-hairline text-[10px] text-mute">
          Free tier: doctor, consult, share, import, score
        </div>
      </aside>

      {/* Detail */}
      <div className="flex-1 min-w-0 overflow-auto p-5">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{cmd.icon}</span>
          <div>
            <h1 className="text-lg font-extrabold text-ink font-mono">{cmd.name}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              {cmd.tier === "enterprise" ? (
                <Tag color="#b62ad9">Enterprise</Tag>
              ) : (
                <Tag color="#3fb950">Free</Tag>
              )}
            </div>
          </div>
        </div>

        <p className="mt-2 text-[13px] text-body max-w-lg leading-relaxed">{cmd.desc}</p>

        {/* Usage */}
        <div className="mt-4">
          <div className="text-[11px] font-bold text-mute uppercase tracking-wider mb-1.5">Usage</div>
          <div className="flex items-center gap-2">
            <pre className="flex-1 rounded-lg bg-[#1d1f27] text-[#e6e6e6] px-3 py-2 text-[11px] font-mono overflow-auto">
              <code>{cmd.usage}</code>
            </pre>
            <button
              onClick={copyUsage}
              className="shrink-0 rounded-md border border-olive/60 bg-white px-2.5 py-2 text-[11px] font-semibold text-ink hover:bg-cream transition"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="mt-4">
          <div className="text-[11px] font-bold text-mute uppercase tracking-wider mb-1.5">Sample Output</div>
          <pre className="rounded-xl bg-[#1d1f27] text-[#c8d6e5] p-4 text-[11px] font-mono leading-relaxed overflow-auto max-h-72 whitespace-pre-wrap">
            <code>{cmd.output}</code>
          </pre>
        </div>

        {/* Actions */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <YellowButton onClick={copyOutput}>{copied ? "✓ Copied!" : "Copy Output"}</YellowButton>
          {cmd.tier === "enterprise" && (
            <a
              href="mailto:enterprise@claudient.ai"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-purple px-3 py-1.5 text-[12px] font-bold text-white hover:bg-brand-purple/90 transition"
            >
              Upgrade to Enterprise →
            </a>
          )}
          {cmd.tier === "free" && (
            <a
              href="https://github.com/Claudient/Claudient"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-olive/60 bg-white px-3 py-1.5 text-[12px] font-semibold text-ink hover:bg-cream transition"
            >
              View on GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
