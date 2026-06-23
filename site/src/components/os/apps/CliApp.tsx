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
  {
    id: "init",
    name: "claudient init",
    icon: "🚀",
    desc: "Interactive first-run setup — walks through CLAUDE.md generation, skill selection, hook configuration, and MCP server setup.",
    usage: "claudient init",
    tier: "free",
    output: `claudient init — First-Run Setup
────────────────────────────────────────────
Welcome to Claudient! Let's set up your Claude Code environment.

[1/4] Project Detection
  Detected: Next.js 15 + TypeScript + Tailwind
  Stack: fullstack_developer_stack (recommended)

[2/4] Skill Selection
  ? Install recommended skills? (Y/n)
  ✓ backend/fastapi-expert
  ✓ frontend/react-components
  ✓ devops-infra/ci-cd-pipeline
  ✓ productivity/testing-suite
  → 4 skills installed

[3/4] Hook Configuration
  ? Enable safety hooks? (Y/n)
  ✓ test-coverage-enforcer (PreToolUse)
  ✓ security-scanner (PostToolUse)
  ✓ cost-cap-enforcer (Stop)
  → 3 hooks activated

[4/4] MCP Server Setup
  ? Connect MCP servers? (Y/n)
  ✓ postgres (pg-mcp-server)
  ✓ github (github-mcp-server)
  → 2 MCP servers connected
────────────────────────────────────────────
✓ Setup complete! Run claudient doctor to verify.

For enterprise governance: claudient init --enterprise`,
  },
  {
    id: "benchmark",
    name: "claudient benchmark",
    icon: "📊",
    desc: "Display eval scores for benchmarked skills. No args: top 10 by score. With skill-id: detailed result card with grade, tests, and notes.",
    usage: "claudient benchmark [skill-id]",
    tier: "free",
    output: `claudient benchmark — Skill Eval Scores
────────────────────────────────────────────
Benchmarked: 20 skills | Avg score: 88.8%

Top 10 by score:
  ✅ fastapi-crud           96%  (A)  10/10 tests  [2026-06-14]
  ✅ react-components       94%  (A)  10/10 tests  [2026-06-14]
  ✅ auth-patterns          92%  (A)   9/10 tests  [2026-06-14]
  ✅ terraform-modules      91%  (A)  10/10 tests  [2026-06-13]
  ✅ pr-reviewer            90%  (A)   9/10 tests  [2026-06-13]
  🟦 ci-cd-pipeline        88%  (B)   9/10 tests  [2026-06-13]
  🟦 sql-optimization      86%  (B)   8/10 tests  [2026-06-12]
  🟦 adr-writer            85%  (B)   9/10 tests  [2026-06-12]
  🟨 cold-email-v1         72%  (C)   7/10 tests  [2026-06-11]
  🟨 lead-scoring          68%  (C)   6/10 tests  [2026-06-11]

Grade scale: A (90%+) | B (75-89%) | C (60-74%) | F (<60%)
Methodology: each skill tested on 10 real-world prompts.

→ Run claudient benchmark <skill-id> for details`,
  },
  {
    id: "init-enterprise",
    name: "claudient init --enterprise",
    icon: "🏢",
    desc: "Enterprise-scale setup wizard — configures SSO, RBAC, audit trails, compliance stacks (SOC2/GDPR/EU-AI-Act), PII scanning, and cost governance.",
    usage: "claudient init --enterprise",
    tier: "enterprise",
    output: `claudient init --enterprise — Enterprise Governance Setup
────────────────────────────────────────────
Welcome to Claudient Enterprise. This wizard configures
full governance, compliance, and security for your organization.

[1/7] Organization Profile
  Company: Acme Corp
  Team size: 120 engineers
  Compliance required: SOC2 ✓  GDPR ✓  EU-AI-Act ✓

[2/7] Authentication & SSO
  ? Configure SAML SSO? (Y/n)
  ✓ IdP: Okta (SAML 2.0)
  ✓ MFA enforcement: enabled
  ✓ Session timeout: 8 hours

[3/7] Role-Based Access Control (RBAC)
  ✓ Roles created: admin, developer, auditor, viewer
  ✓ Audit log access: auditor role only
  ✓ Cost controller: admin role only

[4/7] Compliance Stacks
  ? Install compliance stacks? (Y/n)
  ✓ SOC2 stack — audit trail + access control hooks
  ✓ GDPR stack — consent tracker + data retention
  ✓ EU-AI-Act stack — transparency + risk classification
  → 3 compliance stacks installed (12 skills + 9 hooks)

[5/7] Audit & Logging
  ✓ Audit trail: enabled (append-only, 7-year retention)
  ✓ PII scanning: enabled (6 patterns + custom)
  ✓ Cost cap enforcer: $500/team/day
  ✓ Encryption: AES-256 at rest, TLS 1.3 in transit

[6/7] Evidence & Reporting
  ✓ SOC2 evidence: ~/.claude/audit-logs/
  ✓ GDPR logs: ~/.claude/gdpr-consent.jsonl
  ✓ EU-AI-Act: ~/.claude/eu-ai-risk-log.jsonl
  ✓ Monthly compliance reports: enabled

[7/7] Verification
  ✓ SSO configured
  ✓ RBAC active
  ✓ All compliance stacks loaded
  ✓ Audit logging verified
  ✓ PII scanning verified
────────────────────────────────────────────
✓ Enterprise governance ready! Score: 158/160

Next: Run claudient audit for your first compliance report.
Support: ceo@uitbreiden.com`,
  },
  {
    id: "dashboard",
    name: "claudient dashboard",
    icon: "🖥️",
    desc: "Launch the local dashboard app. Spawns the Astro dev server and auto-opens the web GUI in the default browser.",
    usage: "claudient dashboard",
    tier: "free",
    output: `Launching Claudient Workspace Dashboard locally...
Starting local Astro dev server...
Opening dashboard at http://localhost:4321 in your browser...

Press Ctrl+C to terminate dashboard server.`,
  },
  {
    id: "council",
    name: "claudient council",
    icon: "🤝",
    desc: "Trigger domain-wide subagent swarm orchestration. Compiles stack-specific agent roles, tools, and rules into a dynamic markdown instruction file (COUNCIL_INSTRUCTIONS.md) to run collaborative multi-agent swarms.",
    usage: "claudient council <domain>",
    tier: "free",
    output: `
══════════════════════════════════════════════════════════════════════════════════
  ASSEMBLING CLAUDE COUNCIL: SDR STACK
  Specialized B2B outreach & automated pipeline qualification
══════════════════════════════════════════════════════════════════════════════════

✔ Resolved stack folder: sdr
✔ Loading primary persona...
  "You are a senior SDR agent focused on crafting high-converting cold email outreach..."
✔ Deploying specialized skills (3):
  • lead-qualification — Scoring inbound leads and categorizing fit
  • email-copywriter — Writing targeted personalized cold emails
  • sequence-builder — Creating 4-step nurturing email flows
✔ Initializing command mapping (2):
  • /score-lead — Run automatic lead scoring matrix
  • /draft-email — Generate outreach draft for contact
✔ Activating runtime security hooks (1):
  • pii-check — Scan outgoing mail content for personal info

Define the Swarm Objective/Task:
> Draft a personalized cold email sequence for VP of Engineering at Vercel targeting Next.js cost optimizations.

✔ Claude Council Swarm instructions formulated successfully!
Saved instructions file to: /Users/tushar/Desktop/Claudient/COUNCIL_INSTRUCTIONS.md

To run the swarm, start your Claude Code session and instruct it:
  "Read COUNCIL_INSTRUCTIONS.md and execute the swarm workflow steps to achieve the objective."`,
  },
  {
    id: "nightshift",
    name: "claudient nightshift",
    icon: "🌙",
    desc: "Autonomous batch processor — queues hundreds of files, manages its own API rate limits, designed for 3+ hour unsupervised sessions.",
    usage: "node scripts/nightshift.js",
    tier: "free",
    output: `claudient nightshift — Batch Queue
────────────────────────────────────────────
Queue: BATCH_QUEUE.md (50 files)
Mode: autonomous | Rate limit: auto-managed

1/50: auth.js → auth.ts ✓
2/50: utils.js → utils.ts ✓
3/50: api/payments.js → payments.ts ✓
...
Rate limit hit. Sleeping 60s...
4/50: components/header.js → header.tsx ✓
────────────────────────────────────────────
Processed: 50/50 | Errors: 2 | Time: 3h 12m`,
  },
  {
    id: "tribunal",
    name: "claudient tribunal",
    icon: "⚖️",
    desc: "3-agent adversarial PR review — spawns Hacker, Performance Junkie, and Senior Pedant to audit a PR from every angle.",
    usage: "node scripts/tribunal.js <file>",
    tier: "free",
    output: `claudient tribunal — Adversarial Review
────────────────────────────────────────────
File: src/auth/handler.ts

🛡️ Hacker Agent:
  ✗ Timing attack vulnerability L42
  ✗ SQL injection via unsanitized query L67

⚡ Performance Agent:
  ✗ N+1 query in user lookup (L31)
  ✗ Missing index on orders.user_id

📐 Pedant Agent:
  ✗ console.log on L88 (remove for prod)
  ✗ Missing JSDoc on exported functions

────────────────────────────────────────────
Verdict: 6 issues found | 3 critical, 3 minor`,
  },
  {
    id: "oracle",
    name: "claudient oracle",
    icon: "🎱",
    desc: "Pre-mortem prediction — simulates edge cases against a PR to predict specific production failure modes before merge.",
    usage: "node scripts/oracle.js <file>",
    tier: "free",
    output: `claudient oracle — Pre-Mortem Analysis
────────────────────────────────────────────
PR: #128 "Add payment retry logic"

Simulating 15 edge cases...
🔴 FAIL: 10K concurrent users → deadlock in retry.ts L45
🔴 FAIL: Stripe webhook timeout → orphaned transaction
🟡 WARN: null response from payment API (no fallback)
🟡 WARN: race condition in idempotency key generation
✅ PASS: 11/15 scenarios

Recommendation: Fix 2 critical issues before merge`,
  },
  {
    id: "learn",
    name: "claudient learn",
    icon: "📖",
    desc: "Scans your project and generates custom CLAUDE.md guidelines and rules based on your actual codebase patterns.",
    usage: "node scripts/learn.js",
    tier: "free",
    output: `claudient learn — Codebase Analysis
────────────────────────────────────────────
Scanning project structure...
✓ Detected: Next.js 15 + TypeScript + Prisma
✓ Found 47 TypeScript files, 12 React components
✓ Analyzed import patterns and conventions

Generating custom guidelines:
  → Naming: camelCase for vars, PascalCase for components
  → Testing: vitest + React Testing Library
  → State: Zustand (no Redux patterns found)
  → API: tRPC with Zod validation

✓ Generated: CLAUDE.md (42 lines)
✓ Generated: rules/code-style.md
✓ Generated: rules/testing-conventions.md`,
  },
  {
    id: "chart",
    name: "claudient chart",
    icon: "🗺️",
    desc: "Codebase cartographer — AST/signature extraction for massive repos. Gives Claude an exact map of all APIs and types.",
    usage: "node scripts/chart.js",
    tier: "free",
    output: `claudient chart — Codebase Map
────────────────────────────────────────────
Scanning 2,400 files...

Indexed:
  340 public APIs
  180 type definitions
   90 interfaces
  1,200 functions
   65 modules

Output: .claudient/map.json
Density: 84% | Coverage: 92%

Claude now has full repo vision.
→ Query: "Show me all handlers that touch User"
→ Result: 8 handlers across 4 modules`,
  },
  {
    id: "spec",
    name: "claudient spec",
    icon: "📐",
    desc: "Spec-first enforcement wizard — reads SPEC.md and blocks Claude from violating approved architecture.",
    usage: "node scripts/spec.js",
    tier: "free",
    output: `claudient spec — Architecture Enforcement
────────────────────────────────────────────
Loading: SPEC.md (127 lines, 8 sections)

Active enforcements:
  ✓ API routes must use Zod validation
  ✓ Database access only via repositories/
  ✓ No direct ORM calls in controllers
  ✓ All mutations require audit logging

Intercepting code writes...
  ✗ BLOCKED: ALTER TABLE users DROP email
    → SPEC.md §4.2: email field is immutable
  ✓ ALLOWED: Adding new migration for orders

Session: 14 writes checked | 2 blocked`,
  },
  {
    id: "bisect",
    name: "claudient bisect",
    icon: "🔬",
    desc: "Time-travel debugger — writes a test script and jumps through Git history to find the exact commit that broke the code.",
    usage: "node scripts/bisect.js",
    tier: "free",
    output: `claudient bisect — Bug Finder
────────────────────────────────────────────
Issue: "Login returns 500 for expired tokens"

Writing deterministic test: test_login_500.sh
✓ Test reproduces the issue

Running git bisect through 47 commits...
  good: a1b2c3d (2026-05-01)
  bad:  f9e8d7c (2026-06-12)
  ...
────────────────────────────────────────────
Found! Commit f9e8d7c: "Optimize token validation"
  → Removed 'await' before DB call on L34
  → Fix: Restore async/await pattern

Applying fix...`,
  },
  {
    id: "checkpoint",
    name: "claudient checkpoint",
    icon: "💾",
    desc: "Session checkpointing — saves current state (decisions, edits, context) so you can resume without losing progress.",
    usage: "node scripts/checkpoint.js",
    tier: "free",
    output: `claudient checkpoint — Session Save
────────────────────────────────────────────
Saving session state...

✓ Decisions: 8 architectural choices saved
✓ Edits: 23 files modified this session
✓ Context: compressed to CLAUDE_STATE.md
✓ Tasks: 4/7 completed, 3 remaining

Checkpoint: .claudient/checkpoint-2026-06-15.md

To resume:
  Add @CLAUDE_STATE.md to your next session
  Run: claudient doctor to verify state`,
  },
  {
    id: "repair",
    name: "claudient repair",
    icon: "🩹",
    desc: "Auto-repair — reads failing test output, patches the code, and re-runs tests until all pass.",
    usage: "node scripts/repair.js",
    tier: "free",
    output: `claudient repair — Auto-Fix
────────────────────────────────────────────
Running test suite... 3 failing

1/3: test_auth.py — AssertionError
  → Expected: 200, Got: 401
  → Fix: Updated token expiry check (L42)
  → ✓ PASS

2/3: test_api.py — TypeError
  → Missing null check on user param
  → Fix: Added optional chaining (L67)
  → ✓ PASS

3/3: test_db.py — IntegrityError
  → Duplicate key on insert
  → Fix: Added upsert pattern (L23)
  → ✓ PASS
────────────────────────────────────────────
Repaired: 3/3 | All tests passing`,
  },
  {
    id: "dependency-graph",
    name: "claudient dependency-graph",
    icon: "🕸️",
    desc: "AST dependency analysis — analyzes skill and agent files for cross-references, generates dependency maps.",
    usage: "node scripts/dependency-graph.js",
    tier: "free",
    output: `claudient dependency-graph — Analysis
────────────────────────────────────────────
Scanning 447 skills + 206 agents...

Graph generated:
  Nodes: 653 (skills + agents)
  Edges: 1,847 (cross-references)
  Clusters: 28 (domain groups)

Top connected:
  1. backend/fastapi-expert (12 references)
  2. devops-infra/terraform-modules (9)
  3. productivity/testing-suite (8)

Output: .claudient/dependency-graph.json
→ Visualize: node scripts/visualize-graph.js`,
  },
  {
    id: "translate",
    name: "claudient translate",
    icon: "🌍",
    desc: "Auto-translation — translates skills, agents, and guides into DE, FR, NL, ES using structured templates.",
    usage: "node scripts/translate-assets.js",
    tier: "free",
    output: `claudient translate — Asset Localization
────────────────────────────────────────────
Source: English (en)
Targets: de, fr, nl, es

Translating 447 skills...
  ✓ de/ — 6 files (initial batch)
  ✓ es/ — 3 files (initial batch)
  ○ fr/ — pending
  ○ nl/ — pending

Translating 117 guides...
  ✓ guides/de/ — 92 files
  ✓ guides/es/ — 92 files
  ✓ guides/fr/ — 92 files
  ✓ guides/nl/ — 92 files
────────────────────────────────────────────
Translated: 383 files across 4 languages`,
  },
  {
    id: "validate-all",
    name: "claudient validate",
    icon: "✅",
    desc: "Suite of 5 validators — catalog, frontmatter, manifests, stacks, and certification checks.",
    usage: "node scripts/validate-catalog.js && node scripts/validate-frontmatter.js && node scripts/validate-stacks.js",
    tier: "free",
    output: `claudient validate — Full Suite
────────────────────────────────────────────
1/5: Catalog Validation
  ✓ 50 stacks indexed
  ✓ All required fields present
  ✓ Category mapping valid

2/5: Frontmatter Validation
  ✓ 447 skills checked
  ✓ All have title, description, tags
  ⚠ 3 skills missing 'date' field

3/5: Manifest Validation
  ✓ 19 plugins verified
  ✓ All plugin.json schemas valid

4/5: Stack Validation
  ✓ 50 stacks passed
  ✓ All CLAUDE.md files present

5/5: Certification Check
  ✓ 5 certified stacks verified
────────────────────────────────────────────
Result: PASS | 0 errors, 3 warnings`,
  },
  {
    id: "generate-changelog",
    name: "claudient changelog",
    icon: "📝",
    desc: "Generates structured changelog from git history with categorized entries and version tagging.",
    usage: "node scripts/generate-changelog.js",
    tier: "free",
    output: `claudient changelog — Release Notes
────────────────────────────────────────────
Analyzing git history: v1.9.0 → v1.10.1

🚀 Features (12):
  • Added 5 new enterprise compliance stacks
  • Expanded CLI from 9 to 11 commands
  • New MarketplaceApp window
  
🔧 Improvements (8):
  • ShowcaseApp: 61 features across 10 categories
  • ToolkitApp: added Playground + Harness tabs

🐛 Fixes (5):
  • Fixed duplicate code in ShowcaseApp
  • Resolved Vercel deployment rootDirectory issue
────────────────────────────────────────────
Output: CHANGELOG.md (v1.10.1)`
  },
  {
    id: "caveman",
    name: "claudient caveman",
    icon: "🦴",
    desc: "Token-efficient mode — enforces a strict DSL that forbids conversational output, saving ~40% API tokens per session.",
    usage: "node scripts/caveman.js",
    tier: "free",
    output: `claudient caveman — Token Optimizer
────────────────────────────────────────────
Mode: ACTIVATED
DSL: strict (JSON-only output)

Before: ~2,400 tokens/response
After:  ~640 tokens/response
Savings: 73%

Hook installed: PreToolUse → strips filler
Claude output: {"action":"write","file":"auth.ts","lines":42}

→ Deactivate: /caveman off`,
  },
  {
    id: "commit",
    name: "claudient commit",
    icon: "🛡️",
    desc: "Safe commit — runs validation audits and unit tests before executing git commits under the strict author profile.",
    usage: 'node scripts/commit.js -m "feat: add auth module"',
    tier: "free",
    output: `claudient commit — Safe Commit
────────────────────────────────────────────
Message: feat: add auth module

Running pre-commit checks...
  ✓ ESLint           0 errors
  ✓ TypeScript       0 errors
  ✓ vitest           47/47 passing
  ✓ Security scan    0 vulnerabilities
  ✓ Author check     tushar2704 <uitbreidenai@gmail.com>

Committing: abc1234 feat: add auth module
✓ Committed successfully`,
  },
  {
    id: "tdd",
    name: "claudient tdd",
    icon: "🧪",
    desc: "Stunt Double TDD — automates recursive Red-Green-Refactor: TestEngineer writes failing tests, ImplementationEngineer makes them pass.",
    usage: "node scripts/tdd.js Add rate limiter",
    tier: "free",
    output: `claudient tdd — Test-Driven Development
────────────────────────────────────────────
Task: Add rate limiter

Phase 1: RED (TestEngineer)
  ✓ test_rate_limit_basic      FAIL (expected)
  ✓ test_rate_limit_burst      FAIL (expected)
  ✓ test_rate_limit_reset      FAIL (expected)
  ✓ test_rate_limit_headers    FAIL (expected)
  → 4 failing tests written

Phase 2: GREEN (ImplementationEngineer)
  ✓ test_rate_limit_basic      PASS
  ✓ test_rate_limit_burst      PASS
  ✓ test_rate_limit_reset      PASS
  ✓ test_rate_limit_headers    PASS
  → All 4 tests passing

Phase 3: REFACTOR
  ✓ Extracted RateLimiter class
  ✓ Added JSDoc comments
  → Clean implementation ready`,
  },
  {
    id: "sweep",
    name: "claudient sweep",
    icon: "🧹",
    desc: "Codebase sweeper — background agent that hunts dead code, unused imports, duplicate utilities, and stale comments.",
    usage: "node scripts/sweep.js",
    tier: "free",
    output: `claudient sweep — Dead Code Hunter
────────────────────────────────────────────
Scanning 340 files...

Dead imports found:     23
Unused exports:          8
Resolved TODOs:          4
Duplicate utilities:     3
Stale comments:         12
────────────────────────────────────────────
Total debt items: 50
Auto-removed: 35 (safe deletions)
Flagged for review: 15

Lines removed: ~200
→ Run again: claudient sweep --deep`,
  },
  {
    id: "documentation",
    name: "claudient documentation",
    icon: "📖",
    desc: "The Historian — automated docs updater that watches code changes and rewrites ARCHITECTURE.md to eliminate documentation drift.",
    usage: "node scripts/documentation.js",
    tier: "free",
    output: `claudient documentation — The Historian
────────────────────────────────────────────
Scanning recent changes: 12 files

Docs drift detected:
  ✗ ARCHITECTURE.md: missing §4.3 (new refund endpoint)
  ✗ ARCHITECTURE.md: §2.1 outdated (auth flow changed)
  ✗ API.md: missing POST /refunds documentation

Auto-updating:
  ✓ Added §4.3 Refund Flow (12 lines)
  ✓ Updated §2.1 Auth Flow (8 lines changed)
  ✓ Added POST /refunds to API.md

Docs synchronized: 3 sections updated
→ Zero drift guaranteed`,
  },
  {
    id: "chaos",
    name: "claudient chaos",
    icon: "🐒",
    desc: "Chaos Monkey — adversarial agent that injects edge cases, network delays, null returns, and exceptions to test unit test resilience.",
    usage: "node scripts/chaos.js src/api/payments.ts",
    tier: "free",
    output: `claudient chaos — Adversarial Resilience Test
────────────────────────────────────────────
Target: src/api/payments.ts
Spawning 5 chaos agents...

🐒 Agent 1: Network timeout after 200ms
  ✗ FAIL: No timeout handler → unhandled rejection

🐒 Agent 2: Null response from Stripe
  ✗ FAIL: Cannot read property 'id' of null

🐒 Agent 3: Concurrent writes (100 req/s)
  ✓ PASS: Idempotency key handles duplicates

🐒 Agent 4: Permission denied on DB
  ✓ PASS: Graceful fallback with retry

🐒 Agent 5: Negative payment amount
  ✗ FAIL: No validation on amount field
────────────────────────────────────────────
Result: 3/5 scenarios broke your code
→ Fix 3 issues and re-run`,
  },
  {
    id: "jit",
    name: "claudient jit",
    icon: "💉",
    desc: "JIT Context Injector — fetches public dependency signatures before file modifications to safeguard codebase stability.",
    usage: "node scripts/jit.js src/api/users.ts",
    tier: "free",
    output: `claudient jit — Just-In-Time Context
────────────────────────────────────────────
Target: src/api/users.ts

Tracing imports...
  → db.query<T>()          (src/db/repository.ts)
  → auth.verifyToken()     (src/auth/jwt.ts)
  → cache.get()            (src/cache/redis.ts)
  → logger.info()          (src/utils/logger.ts)

Injecting signatures:
  ✓ db.query<T>(sql: string, params: any[]): Promise<T[]>
  ✓ auth.verifyToken(token: string): { userId: string; role: string }
  ✓ cache.get<T>(key: string): Promise<T | null>
  ✓ logger.info(msg: string, ctx?: object): void

→ 4 signatures injected as context
→ Claude now has full downstream awareness`,
  },
  {
    id: "enforce",
    name: "claudient enforce",
    icon: "📋",
    desc: "Spec-first enforcer — audits active git diff against SPEC.md rules and blocks any non-compliant changes.",
    usage: "node scripts/enforce.js",
    tier: "free",
    output: `claudient enforce — Spec Audit
────────────────────────────────────────────
Loading: SPEC.md (127 lines, 8 sections)
Active git diff: 14 files changed

Auditing changes against spec...
  ✓ src/api/users.ts       — compliant
  ✓ src/api/orders.ts      — compliant
  ✗ src/db/migrations/003  — BLOCKED
    → SPEC.md §4.2: email field is immutable
    → Cannot DROP COLUMN email

  ✓ src/utils/auth.ts      — compliant
  ✗ src/api/public.ts      — BLOCKED
    → SPEC.md §3.1: PII must not appear in public responses
────────────────────────────────────────────
Result: 14 checked | 12 compliant | 2 blocked`,
  },
  {
    id: "handoff",
    name: "claudient handoff",
    icon: "🏗️",
    desc: "Architect/Mason handoff — coordinates design specification generation (Opus) and code scaffolding (Haiku) loops.",
    usage: "node scripts/handoff.js Build notification system",
    tier: "free",
    output: `claudient handoff — Dual-Model Orchestration
────────────────────────────────────────────
Task: Build notification system

Phase 1: ARCHITECT (Opus)
  ✓ Analyzed requirements
  ✓ Generated ARCHITECTURE.md (200 lines)
  ✓ Planned 5 files with dependency graph
  → Cost: $0.08

Phase 2: MASON (Haiku)
  ✓ src/notifications/service.ts      (42 lines)
  ✓ src/notifications/templates.ts    (28 lines)
  ✓ src/notifications/queue.ts        (35 lines)
  ✓ src/notifications/config.ts       (12 lines)
  ✓ tests/notifications.test.ts       (64 lines)
  → Cost: $0.03
────────────────────────────────────────────
Total: $0.11 | 5 files | Enterprise architecture`,
  },
  {
    id: "permissions",
    name: "claudient permissions",
    icon: "🔐",
    desc: "Permission editor — lists, allows, denies, and revokes Claude model tool permissions in .claude/settings.local.json.",
    usage: "node scripts/permissions.js",
    tier: "free",
    output: `claudient permissions — Tool Permission Manager
────────────────────────────────────────────
Reading: .claude/settings.local.json

Current permissions (12 rules):
  ✓ ALLOW  Read            *.ts, *.js, *.md
  ✓ ALLOW  Write           src/**, tests/**
  ✗ DENY   Write           *.env, .claude/settings.json
  ✓ ALLOW  Bash            npm run *, npx vitest *
  ✗ DENY   Bash            rm -rf *, sudo *
  ✓ ALLOW  WebFetch        github.com, npmjs.com
  ✗ DENY   WebFetch        * (all other domains)

Interactive:
  ? Add new rule? (y/N)
  → Type: Write
  → Pattern: scripts/**
  → Action: ALLOW
  ✓ Rule added: ALLOW Write scripts/**`,
  },
  {
    id: "prophet",
    name: "claudient prophet",
    icon: "🔮",
    desc: "Predictive tech debt analyzer — correlates git hotspots, change frequency, and test coverage to predict fragile files.",
    usage: "node scripts/prophet.js",
    tier: "free",
    output: `claudient prophet — Predictive Debt Analysis
────────────────────────────────────────────
Analyzing 6 months of git history...
432 commits | 287 files | 18 contributors

🔴 HIGH RISK (3 files):
  src/api/payments.ts    47 changes, 30% coverage
  src/utils/auth.ts      22 changes, 45% coverage
  src/db/migrations.ts   15 changes, 20% coverage

🟡 MEDIUM RISK (5 files):
  src/api/users.ts       18 changes, 60% coverage
  src/services/email.ts  12 changes, 55% coverage

🟢 LOW RISK: 279 files (stable)
────────────────────────────────────────────
Recommendation: Add tests to 3 high-risk files
→ Priority: payments.ts (most fragile)`,
  },
  {
    id: "incident",
    name: "claudient incident",
    icon: "🚨",
    desc: "Incident Commander — wakes on PagerDuty alerts, reads logs, identifies root cause, executes rollback, drafts post-mortems.",
    usage: "node scripts/incident.js",
    tier: "free",
    output: `claudient incident — PagerDuty Autonomy
────────────────────────────────────────────
⏰ ALERT: 500 errors spike (threshold: 5%)

Reading CloudWatch logs...
  → Error rate: 23% (normal: 0.3%)
  → Deployment: abc123 (12 min ago)
  → Error: TypeError in /api/checkout

Root cause identified:
  → Missing null check on user.cart.items
  → Introduced in commit abc123

Executing rollback playbook...
  ✓ Rolling back to previous version (def456)
  ✓ Health check: passing
  ✓ Error rate: 0.2% (recovered)

Drafting post-mortem...
  ✓ docs/postmortems/2026-06-15-checkout.md
  → 5 action items generated`,
  },
  {
    id: "recommend",
    name: "claudient recommend",
    icon: "💡",
    desc: "Personalized recommendations — analyzes your project structure and suggests the optimal Claudient configuration.",
    usage: "node scripts/recommend.js",
    tier: "free",
    output: `claudient recommend — Personalized Setup
────────────────────────────────────────────
Analyzing project: Next.js 15 + TypeScript + Prisma

Recommended skills (8):
  ✓ frontend/react-components      (score: 0.95)
  ✓ backend/auth-patterns          (score: 0.92)
  ✓ database/prisma-optimization   (score: 0.90)
  ✓ productivity/testing-suite     (score: 0.88)
  ✓ devops-infra/ci-cd-pipeline    (score: 0.85)
  + 3 more

Recommended stack: fullstack_developer_stack
  → 8 skills + 3 commands + 4 hooks + 2 MCP

Recommended hooks (3):
  ✓ test-coverage-enforcer
  ✓ security-scanner
  ✓ performance-regression

Install all: npx claudient add stack fullstack_developer_stack`,
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
          <div className="mt-1 text-[11px] text-mute">38 commands — 35 free, 3 enterprise</div>
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
          Free tier: doctor, consult, share, import, benchmark, score, init, dashboard, council, nightshift, tribunal, oracle, learn, chart, spec, bisect, checkpoint, repair, dependency-graph, translate, validate, changelog, caveman, commit, tdd, sweep, documentation, chaos, jit, enforce, handoff, permissions, prophet, incident, recommend
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
            <pre className="flex-1 rounded-lg bg-code-bg text-code-text px-3 py-2 text-[11px] font-mono overflow-auto">
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
          <pre className="rounded-xl bg-code-bg text-code-text p-4 text-[11px] font-mono leading-relaxed overflow-auto max-h-72 whitespace-pre-wrap">
            <code>{cmd.output}</code>
          </pre>
        </div>

        {/* Actions */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <YellowButton onClick={copyOutput}>{copied ? "✓ Copied!" : "Copy Output"}</YellowButton>
          {cmd.tier === "enterprise" && (
            <a
              href="mailto:ceo@uitbreiden.com"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-purple px-3 py-1.5 text-[12px] font-bold text-white hover:bg-brand-purple/90 transition"
            >
              Upgrade to Enterprise →
            </a>
          )}
          {cmd.tier === "free" && (
            <a
              href="https://github.com/UitbreidenOS/Claudient"
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
