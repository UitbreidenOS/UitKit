import { useState } from "react";
import { Eyebrow } from "./ui";

interface Feature {
  id: string; icon: string; name: string; tagline: string;
  desc: string; how: string; example: string; color: string; category: string;
  install?: string;
  steps?: string[];
  related?: string[];
}
interface Category { id: string; label: string; color: string; audience: string; }

interface BlastNode { id: string; label: string; x: number; y: number; risk: "critical" | "medium" | "safe"; imports: string[]; depth: number; }
const BLAST_GRAPH: { nodes: BlastNode[]; links: { source: string; target: string }[] } = {
  nodes: [
    { id: "src/utils/auth.ts", label: "auth.ts", x: 220, y: 160, risk: "critical", imports: ["jwt", "crypto", "db/users"], depth: 0 },
    { id: "src/api/payments.ts", label: "payments.ts", x: 80, y: 60, risk: "critical", imports: ["auth", "db/orders", "stripe"], depth: 1 },
    { id: "src/api/users.ts", label: "users.ts", x: 80, y: 160, risk: "critical", imports: ["auth", "db/users", "validator"], depth: 1 },
    { id: "src/api/admin.ts", label: "admin.ts", x: 80, y: 260, risk: "medium", imports: ["auth", "db/users", "acl"], depth: 1 },
    { id: "src/db/users.ts", label: "db/users.ts", x: 360, y: 100, risk: "medium", imports: ["prisma", "auth-types"], depth: 2 },
    { id: "src/db/orders.ts", label: "db/orders.ts", x: 360, y: 200, risk: "safe", imports: ["prisma", "order-types"], depth: 2 },
    { id: "src/middleware/rate-limit.ts", label: "rate-limit.ts", x: 80, y: 350, risk: "medium", imports: ["auth", "redis"], depth: 1 },
    { id: "src/hooks/useAuth.ts", label: "useAuth.ts", x: 360, y: 310, risk: "safe", imports: ["auth-types", "api-client"], depth: 2 },
    { id: "src/components/Login.tsx", label: "Login.tsx", x: 480, y: 50, risk: "safe", imports: ["useAuth", "ui/Button"], depth: 3 },
    { id: "src/components/Dashboard.tsx", label: "Dashboard.tsx", x: 480, y: 160, risk: "safe", imports: ["useAuth", "api/payments"], depth: 3 },
    { id: "src/components/Admin.tsx", label: "AdminPanel.tsx", x: 480, y: 270, risk: "safe", imports: ["useAuth", "api/admin"], depth: 3 },
  ],
  links: [
    { source: "src/utils/auth.ts", target: "src/api/payments.ts" },
    { source: "src/utils/auth.ts", target: "src/api/users.ts" },
    { source: "src/utils/auth.ts", target: "src/api/admin.ts" },
    { source: "src/utils/auth.ts", target: "src/middleware/rate-limit.ts" },
    { source: "src/api/payments.ts", target: "src/db/orders.ts" },
    { source: "src/api/users.ts", target: "src/db/users.ts" },
    { source: "src/api/admin.ts", target: "src/db/users.ts" },
    { source: "src/db/users.ts", target: "src/hooks/useAuth.ts" },
    { source: "src/hooks/useAuth.ts", target: "src/components/Login.tsx" },
    { source: "src/hooks/useAuth.ts", target: "src/components/Dashboard.tsx" },
    { source: "src/hooks/useAuth.ts", target: "src/components/Admin.tsx" },
    { source: "src/api/payments.ts", target: "src/components/Dashboard.tsx" },
    { source: "src/api/admin.ts", target: "src/components/Admin.tsx" },
  ],
};
const RISK_COLORS = { critical: "#ef4444", medium: "#eab308", safe: "#22c55e" };

const CATEGORIES: Category[] = [
  { id: "cost", label: "Context & Cost Optimization", color: "#3fb950", audience: "CTOs & Power Users" },
  { id: "resilience", label: "Resilience & Zero-Hallucination", color: "#1d4aff", audience: "DevSecOps & QA Leads" },
  { id: "enterprise", label: "Enterprise Architecture", color: "#b62ad9", audience: "Architects & Staff Engineers" },
  { id: "swarms", label: "Multi-Agent Swarms", color: "#f54e00", audience: "Lead Developers" },
  { id: "context", label: "Environment & Context Engineering", color: "#f5b800", audience: "Onboarding & Daily Contributors" },
  { id: "zero-trust", label: "Zero-Trust & Compliance", color: "#ff5722", audience: "Security & Compliance Teams" },
  { id: "enterprise-intel", label: "Enterprise Intelligence", color: "#00bcd4", audience: "Platform & Architecture Leads" },
  { id: "multi-agent", label: "Multi-Agent & Federation", color: "#ff9800", audience: "DevOps & Infrastructure Teams" },
  { id: "creative", label: "Creative & Vibe Coding", color: "#e91e63", audience: "Frontend & Product Engineers" },
  { id: "ux", label: "UX & Developer Experience", color: "#7c4dff", audience: "Power Users & DX Teams" },
];

const FEATURES: Feature[] = [
  // ── Cost & Optimization ──
  { id: "claudeignore", icon: "🚫", name: ".claudeignore Templates", tagline: "Token cost reduction",
    desc: "Optimized ignore templates for Node, Python, and Go that prevent Claude from reading lockfiles and noise.",
    how: "Drop a .claudeignore template into your repo root. /setup-ignore auto-detects your stack and generates optimized patterns.",
    example: "$ /setup-ignore\n→ Detected: Node.js + TypeScript\n→ Generated .claudeignore (node_modules, dist, *.map)\n→ Token cost reduced by ~60%",
    color: "#3fb950", category: "cost",
    install: "npx claudient add skill claudeignore-templates",
    steps: ["Create .claudeignore in your repo root", "Run /setup-ignore to auto-detect your stack", "Review generated patterns and adjust as needed", "Verify token savings with claudient doctor"],
    related: ["claudient doctor", "claudient caveman", "claudient score"] },
  { id: "save-state", icon: "💾", name: "Context Compactor", tagline: "Infinite memory, zero bloat",
    desc: "Synthesizes a massive chat history into a single CLAUDE_STATE.md so users can clear context without losing their place.",
    how: "/save-state compresses your entire session — decisions, edits, architecture — into a portable markdown file.",
    example: "$ /save-state\n→ Analyzing 47 messages, 12 files edited...\n→ Created CLAUDE_STATE.md (85 lines)\n→ Context compacted! Add @CLAUDE_STATE.md to resume.",
    color: "#3fb950", category: "cost",
    install: "npx claudient add skill save-state",
    steps: ["Work normally in a long session", "Run /save-state before clearing context", "Review the generated CLAUDE_STATE.md", "Run /clear then add @CLAUDE_STATE.md to resume"],
    related: ["claudient doctor", "claudient prune-context"] },
  { id: "caveman", icon: "🦴", name: "Caveman Mode", tagline: "Pure execution, zero filler",
    desc: "Enforces a strict DSL that forbids conversational English. Strips all chatbot behavior for raw code execution.",
    how: "Activates via /caveman + PreToolUse hook. Claude outputs only structured JSON actions at a fraction of the token cost.",
    example: "$ /caveman\n→ Caveman Mode activated 🦴\n→ Output: {\"action\":\"write\",\"file\":\"auth.ts\"}\n→ Token savings: 73%",
    color: "#3fb950", category: "cost",
    install: "npx claudient add skill caveman-mode",
    steps: ["Activate with /caveman in any session", "PreToolUse hook auto-enforces structured output", "Claude outputs only JSON actions — no filler text", "Monitor savings with claudient doctor"],
    related: ["claudient caveman", "claudient doctor", "claudient jit"] },
  { id: "prune-context", icon: "✂️", name: "Context Pruner", tagline: "Slash token bloat instantly",
    desc: "Slash command that prompts Claude to write a session snapshot to .claude/pruned_context.md, then directs the user to wipe memory to avoid token bloat.",
    how: "/prune-context captures all decisions, file edits, and architecture from the current session into a compact markdown file. User then clears context and adds @pruned_context.md to resume.",
    example: "$ /prune-context\n→ Snapshotting 83 messages, 19 files edited...\n→ Written .claude/pruned_context.md (120 lines)\n→ Now run: /clear && @pruned_context.md\n→ Context reduced by 94%. Session resumed.",
    color: "#3fb950", category: "cost",
    install: "npx claudient add skill prune-context",
    steps: ["Run /prune-context in a long session", "Review the generated .claude/pruned_context.md", "Run /clear to wipe context", "Add @pruned_context.md to resume with minimal tokens"],
    related: ["claudient doctor", "claudient save-state"] },

  // ── Resilience & Zero-Hallucination ──
  { id: "shadow-compiler", icon: "👻", name: "Shadow Compiler", tagline: "Zero-hallucination type safety",
    desc: "Silently runs the project's compiler after every edit. Catches errors before the task is marked complete.",
    how: "PostToolUse hook fires after every file write. Runs tsc --noEmit, cargo check, or ruff check. Feeds errors back for auto-correction.",
    example: "// Claude edits auth.ts\n// Shadow Compiler: ✗ Property 'usre' does not exist\n// Claude fixes it before you notice.",
    color: "#1d4aff", category: "resilience",
    install: "npx claudient add hook shadow-compiler",
    steps: ["Install the PostToolUse hook", "Hook auto-fires after every file write", "Runs tsc --noEmit or cargo check in background", "Errors fed back to Claude for auto-correction"],
    related: ["claudient doctor", "claudient commit", "claudient enforce"] },
  { id: "safe-commit", icon: "🛡️", name: "Safe Commit Hook", tagline: "If it hits GitHub, it works",
    desc: "Forces Claude to run local tests and linters before executing a commit. Blocks dirty code from reaching the repo.",
    how: "Intercepts git commit via PreToolUse hook. Runs test suite, linter, type checker. If any fail, commit is blocked.",
    example: "$ git commit -m \"add auth\"\n→ Safe Commit: ✓ ESLint  ✗ vitest — 2 failing\n→ BLOCKED. Fixing... All passed. Committing.",
    color: "#1d4aff", category: "resilience",
    install: "npx claudient add hook safe-commit",
    steps: ["Install the PreToolUse hook for git commit", "Run git commit as usual", "Hook runs tests + linter + type check", "Commit blocked if any check fails — auto-fix offered"],
    related: ["claudient commit", "claudient enforce", "claudient tdd"] },
  { id: "spec-enforcer", icon: "📐", name: "Spec-First Enforcer", tagline: "Total architectural compliance",
    desc: "Reads SPEC.md and physically blocks Claude from executing actions that violate the approved architecture.",
    how: "PreToolUse hook intercepts every Bash/Write. Compares against SPEC.md. Non-compliant actions rejected with citation.",
    example: "// Claude: ALTER TABLE users DROP COLUMN email\n// Spec Enforcer: ✗ BLOCKED — SPEC.md §4.2: email is immutable.",
    color: "#1d4aff", category: "resilience",
    install: "npx claudient add hook spec-enforcer",
    steps: ["Create SPEC.md with your architecture rules", "Install the PreToolUse enforcer hook", "Every Bash/Write is intercepted and validated", "Non-compliant actions rejected with SPEC.md citation"],
    related: ["claudient enforce", "claudient audit", "claudient spec"] },
  { id: "chaos-monkey", icon: "🐒", name: "Chaos Monkey", tagline: "AI designed to break your code",
    desc: "Adversarial agent swarm that rewrites tests to simulate network drops, race conditions, and massive payloads.",
    how: "/chaos-test spawns adversarial agents that inject failure modes: delays, concurrent writes, null returns, permission errors.",
    example: "$ /chaos-test src/api/payments.ts\n→ 5 chaos agents spawned\n→ 2/5 scenarios broke your code. Fix?",
    color: "#1d4aff", category: "resilience",
    install: "npx claudient add skill chaos-test",
    steps: ["Run /chaos-test <target-file>", "5 adversarial agents spawned automatically", "Each agent injects different failure modes", "Review results and fix broken scenarios"],
    related: ["claudient chaos", "claudient tdd", "claudient repair"] },
  { id: "repair-agent", icon: "🔧", name: "Self-Healing CLI Repair Agent", tagline: "Auto-diagnose and fix failures",
    desc: "Diagnostics engine that runs tests, captures errors, and compiles self-healing recommendations automatically.",
    how: "claudient repair runs the full test suite, captures stack traces, identifies root causes, and generates fix suggestions with code patches.",
    example: "$ claudient repair\n→ Running 142 tests...\n→ ✗ 3 failures detected\n→ src/auth.ts:42 — TypeError: Cannot read property 'id'\n→ Suggested fix: add null check before .id access\n→ Patch applied. Re-running... ✓ All 142 passing.",
    color: "#1d4aff", category: "resilience",
    install: "npx claudient install repair",
    steps: ["Run claudient repair in your project root", "Full test suite executed with error capture", "Stack traces analyzed for root cause", "Auto-generated patches applied and re-tested"],
    related: ["claudient doctor", "claudient tdd", "claudient sweep"] },
  { id: "fail-fast", icon: "🛑", name: "Fail-Fast Enforcer", tagline: "No silent failures, ever",
    desc: "Global guidelines and PostToolUse hook that block execution and error swallowing when shell commands exit with non-zero status.",
    how: "fail-fast.md defines the rule. fail-fast.sh PostToolUse hook intercepts every Bash execution. If exit code ≠ 0, it blocks further execution and forces error handling.",
    example: "// Claude runs: npm test\n// Exit code: 1\n// Fail-Fast: ✗ BLOCKED — Command failed with exit code 1\n// Error output captured. Fix before continuing.",
    color: "#1d4aff", category: "resilience",
    install: "npx claudient add rule fail-fast && npx claudient add hook fail-fast",
    steps: ["Install fail-fast.md rule into your rules directory", "Install fail-fast.sh as a PostToolUse hook", "Hook intercepts every Bash command execution", "Non-zero exit codes block further execution"],
    related: ["claudient enforce", "claudient doctor"] },
  { id: "measure-twice", icon: "📏", name: "Measure Twice / Plan-First Hook", tagline: "Plan before you code",
    desc: "Rules and PreToolUse validation hook that block file changes or script executions unless a .claude/plan.md has been marked as approved.",
    how: "measure-twice.md defines the planning rule. measure-twice.sh PreToolUse hook checks for .claude/plan.md with APPROVED status before allowing any file write or script execution.",
    example: "// Claude: Write file src/api/users.ts\n// Measure Twice: ✗ BLOCKED — No approved plan found\n// Create .claude/plan.md first, then mark APPROVED\n→ Plan approved. Proceeding with implementation.",
    color: "#1d4aff", category: "resilience",
    install: "npx claudient add rule measure-twice && npx claudient add hook measure-twice",
    steps: ["Install measure-twice.md rule and measure-twice.sh hook", "Create .claude/plan.md before starting work", "Mark plan as APPROVED when ready", "Hook gates all file writes until plan is approved"],
    related: ["claudient spec", "claudient enforce"] },
  { id: "grill-me", icon: "🔥", name: "Grill Me", tagline: "Staff Engineer interrogation",
    desc: "Refuses to write code until Claude has ruthlessly interrogated the user on edge cases and security.",
    how: "/grill-me activates a Socratic loop. After 10+ rounds of questions, produces a hardened SPEC.md.",
    example: "$ /grill-me Build a payment webhook\n→ Q1: Duplicate Stripe events?\n→ Q2: Idempotency key strategy?\n→ ... 12 questions → Generated SPEC.md",
    color: "#b62ad9", category: "enterprise",
    install: "npx claudient add skill grill-me",
    steps: ["Run /grill-me <your feature description>", "Answer 10+ rounds of Socratic questions", "Review the hardened SPEC.md output", "Proceed to implementation with full spec coverage"],
    related: ["claudient spec", "claudient enforce", "claudient audit"] },
  { id: "stunt-double", icon: "🎬", name: "Stunt Double", tagline: "True AI Test-Driven Development",
    desc: "Orchestrates a test-engineer agent to write failing tests, then an implementation-engineer to make them pass.",
    how: "/stunt-double spawns two agents sequentially: TestEngineer writes tests, ImplementationEngineer writes minimal code.",
    example: "$ /stunt-double Add rate limiter\n→ Phase 1: 8 failing tests\n→ Phase 2: All 8 passing ✓",
    color: "#b62ad9", category: "enterprise",
    install: "npx claudient add skill stunt-double",
    steps: ["Run /stunt-double <feature name>", "TestEngineer agent writes failing tests first", "ImplementationEngineer writes minimal code to pass", "All tests green — feature complete"],
    related: ["claudient tdd", "claudient commit", "claudient enforce"] },
  { id: "architect-mason", icon: "🏗️", name: "Architect / Mason", tagline: "Opus blueprints, Haiku bricks",
    desc: "Expensive model designs the architecture, cheap model implements the boilerplate at minimal cost.",
    how: "/architect uses Opus for ARCHITECTURE.md. /mason uses Haiku to implement each file rapidly.",
    example: "$ /architect Design notification system\n→ ARCHITECTURE.md (200 lines, 5 files)\n$ /mason implement → ✓ ($0.03)",
    color: "#b62ad9", category: "enterprise",
    install: "npx claudient add skill architect-mason",
    steps: ["Run /architect <system name> with Opus model", "Review generated ARCHITECTURE.md blueprint", "Run /mason implement to build each file with Haiku", "Verify implementation matches architecture spec"],
    related: ["claudient handoff", "claudient spec", "claudient enforce"] },
  { id: "adr", icon: "📋", name: "ADR Generator", tagline: "Never lose the why",
    desc: "Generates standardized Architectural Decision Records when major systemic changes are detected.",
    how: "/adr detects architectural pivots and generates ADR files following the Michael Nygard format.",
    example: "$ /adr → Detected: REST to GraphQL\n→ docs/adr/003-graphql-migration.md\n  Status: ACCEPTED",
    color: "#b62ad9", category: "enterprise",
    install: "npx claudient add skill adr-generator",
    steps: ["Work normally — /adr detects architectural pivots", "Review the generated ADR file in docs/adr/", "Accept or modify the decision record", "ADRs auto-link to git commits for traceability"],
    related: ["claudient documentation", "claudient commit"] },
  { id: "blast-radius", icon: "💥", name: "Blast Radius Analyzer", tagline: "Map what you'll break",
    desc: "AST-traces downstream imports before a breaking change, generating a visual impact map.",
    how: "/blast-radius parses the AST, traces import chains, generates a dependency graph of affected files.",
    example: "$ /blast-radius src/utils/auth.ts\n→ 14 files depend on auth.ts\n→ 3 critical paths identified",
    color: "#b62ad9", category: "enterprise",
    install: "npx claudient add skill blast-radius",
    steps: ["Run /blast-radius <target-file>", "AST parses all import chains downstream", "Review the interactive dependency graph", "Critical paths highlighted in red — proceed with caution"],
    related: ["claudient oracle", "claudient prophet", "claudient sweep"] },
  { id: "legacy-strangler", icon: "🌿", name: "Legacy Strangler", tagline: "Don't rewrite. Strangle.",
    desc: "Prevents Big Bang rewrites. Builds facades and extracts microservices safely from legacy monoliths.",
    how: "/strangle analyzes the monolith, identifies bounded contexts, creates a strangler fig plan.",
    example: "$ /strangle orders.ts (2,400 lines)\n→ 4 bounded contexts identified\n→ Phase 1: Extracting Order Creation...",
    color: "#b62ad9", category: "enterprise",
    install: "npx claudient add skill legacy-strangler",
    steps: ["Run /strangle <monolith-file>", "Bounded contexts identified automatically", "Facade layer generated for safe extraction", "Phase-by-phase migration plan produced"],
    related: ["claudient sweep", "claudient documentation", "claudient prophet"] },
  { id: "council", icon: "🏛️", name: "Claude Council Swarm Launcher", tagline: "Multi-agent domain coordinator",
    desc: "Multi-agent system coordinator that spawns domain-specific subagents and outputs tailored domain rules to COUNCIL_INSTRUCTIONS.md.",
    how: "claudient council <domain> activates a council of specialist agents. Each agent contributes domain expertise. Results synthesized into a unified instruction set.",
    example: "$ claudient council fintech\n→ Spawning 5 specialist agents...\n→ Compliance Agent: PCI-DSS rules drafted\n→ Security Agent: encryption standards defined\n→ Architecture Agent: microservice patterns set\n→ Written COUNCIL_INSTRUCTIONS.md (180 lines)",
    color: "#b62ad9", category: "enterprise",
    install: "npx claudient install council",
    steps: ["Run claudient council <domain>", "5 specialist agents spawned for your domain", "Each agent drafts domain-specific rules", "Results merged into COUNCIL_INSTRUCTIONS.md"],
    related: ["claudient hive-swarm", "claudient tribunal"] },
  { id: "swarm-sandbox", icon: "🧫", name: "Swarm Sandbox Simulator", tagline: "Visualize agent teams in action",
    desc: "Interactive visualization UI for agent teams and swarm simulation. Watch agents coordinate, delegate, and resolve tasks in real-time.",
    how: "Opens the Swarm window in the Claudient OS dashboard. Renders a live simulation of agent orchestration with task graphs, delegation chains, and progress tracking.",
    example: "→ Open Swarm window from desktop\n→ Select: Hive Orchestrator pattern\n→ 6 agents spawned: backend, frontend, security, QA, docs, devops\n→ Live task graph: 12 tasks, 3 dependencies\n→ Simulation complete: all tasks green ✓",
    color: "#b62ad9", category: "enterprise",
    install: "claudient dashboard",
    steps: ["Run claudient dashboard to open the OS interface", "Open the Swarm window from the desktop", "Select a swarm pattern: Hive, Night Shift, or Tribunal", "Watch agents coordinate in real-time with task graphs"],
    related: ["claudient hive-swarm", "claudient nightshift", "claudient tribunal"] },

  // ── Multi-Agent Swarms ──
  { id: "night-shift", icon: "🌙", name: "Night Shift", tagline: "Autonomous batch processor",
    desc: "Queues hundreds of files and manages its own API rate limits via notification hooks.",
    how: "Creates BATCH_QUEUE.md, processes each file, marks done, handles rate limits. Designed for 3+ hour unsupervised sessions.",
    example: "$ /night-shift Migrate .js to TypeScript\n→ 50 files queued\n→ 1/50: auth.js → auth.ts ✓\n→ Rate limit hit. Sleeping 60s...",
    color: "#f54e00", category: "swarms",
    install: "npx claudient add skill night-shift",
    steps: ["Run /night-shift <task description>", "Files queued into BATCH_QUEUE.md", "Each file processed sequentially with rate-limit handling", "Check BATCH_QUEUE.md for progress — designed for 3+ hour sessions"],
    related: ["claudient nightshift", "claudient sweep"] },
  { id: "hive-swarm", icon: "🐝", name: "Hive Orchestrator", tagline: "Virtual engineering department",
    desc: "Master routing agent that breaks epics into sub-tasks and spawns specialized subagents.",
    how: "/hive-swarm decomposes an epic into a task graph, assigns to specialist agents, orchestrates with dependency management.",
    example: "$ /hive-swarm Build user dashboard\n→ 6 tasks: backend, frontend, security, integration\n→ Spawning agents...",
    color: "#f54e00", category: "swarms",
    install: "npx claudient add skill hive-swarm",
    steps: ["Run /hive-swarm <epic description>", "Epic decomposed into task graph with dependencies", "Specialist agents assigned to each task", "Agents execute in parallel with dependency management"],
    related: ["claudient council", "claudient tribunal"] },
  { id: "tribunal", icon: "⚖️", name: "Tribunal Review", tagline: "3-agent adversarial PR review",
    desc: "Spawns Hacker, Performance Junkie, and Senior Pedant to audit a PR from every angle.",
    how: "Orchestrator spawns three adversarial personas. Each reviews the same diff. Results synthesized into one review.",
    example: "$ /tribunal auth.js\n⚖️ 🛡️ Hacker: Timing attack L42\n⚡ Perf: N+1 query in lookup\n📐 Pedant: console.log L88",
    color: "#f54e00", category: "swarms",
    install: "npx claudient add skill tribunal",
    steps: ["Run /tribunal <file-or-PR>", "3 adversarial personas spawned: Hacker, Perf Junkie, Pedant", "Each reviews the same diff independently", "Results synthesized into one unified review"],
    related: ["claudient commit", "claudient audit"] },
  { id: "sweeper", icon: "🧹", name: "Codebase Sweeper", tagline: "The janitor you never pay",
    desc: "Low-cost background agent that continuously hunts dead code, unused imports, and stale comments.",
    how: "/sweep runs AST analysis to find unused exports, dead imports, resolved TODOs. Removes silently.",
    example: "$ /sweep → Scanning 340 files...\n→ 23 dead imports, 8 TODOs, 4 unused exports\n→ Cleaned 35 items. -200 lines of debt.",
    color: "#f54e00", category: "swarms",
    install: "npx claudient add skill sweeper",
    steps: ["Run /sweep in your project root", "AST analysis scans all files for dead code", "Unused imports, exports, and TODOs identified", "Items cleaned automatically — review the diff"],
    related: ["claudient sweep", "claudient doctor"] },
  { id: "bisect-bug", icon: "🔬", name: "Time-Travel Debugger", tagline: "Git bisect automated bug finder",
    desc: "Writes a test script and jumps through Git history to find the exact commit that broke the code.",
    how: "Writes deterministic test, runs git bisect, identifies offending commit, reads diff, proposes fix.",
    example: "$ /bisect-bug Login returns 500\n→ git bisect through 47 commits...\n→ Found! Commit f9e8d7c: removed await before DB call",
    color: "#f54e00", category: "swarms",
    install: "npx claudient add skill bisect-bug",
    steps: ["Run /bisect-bug <bug description>", "Deterministic test script written automatically", "Git bisect jumps through commit history", "Offending commit identified — fix proposed"],
    related: ["claudient repair", "claudient commit"] },

  // ── Environment & Context Engineering ──
  { id: "auto-tdd", icon: "🧪", name: "Auto-TDD Hook", tagline: "Instant test feedback",
    desc: "Watches for file saves and runs the corresponding test file in the background, feeding results to Claude.",
    how: "PostToolUse hook maps source files to test files. When src/auth.ts is saved, auto-runs tests/auth.test.ts.",
    example: "// Edit src/auth.ts\n// Auto-TDD: ✓ verifyToken  ✗ refreshToken\n// Claude sees the failure and fixes it.",
    color: "#f5b800", category: "context",
    install: "npx claudient add hook auto-tdd",
    steps: ["Install the PostToolUse auto-tdd hook", "Hook maps source files to test files automatically", "When src/auth.ts is saved, tests/auth.test.ts runs", "Results fed back to Claude for instant feedback"],
    related: ["claudient tdd", "claudient commit"] },
  { id: "dev-doctor", icon: "🩺", name: "Dev Doctor", tagline: "Environment diagnostics",
    desc: "Diagnoses ECONNREFUSED errors by checking Docker, port conflicts, .env drift, and common issues.",
    how: "/dev-doctor runs a diagnostic checklist: Docker? Port? .env? Node version? Database?",
    example: "$ /dev-doctor\n→ ✓ Node v20.11  ✗ Port 3000 occupied\n→ ✗ .env missing DATABASE_URL\n→ 3 issues. Auto-fix? [Y/n]",
    color: "#f5b800", category: "context",
    install: "npx claudient install doctor",
    steps: ["Run claudient doctor or /dev-doctor", "Diagnostic checklist runs: Docker, ports, .env, Node", "Issues identified with auto-fix suggestions", "Accept fixes and re-run to verify"],
    related: ["claudient doctor", "claudient repair"] },
  { id: "jit-context", icon: "💉", name: "JIT Context Injector", tagline: "Just-in-time dependency injection",
    desc: "Dynamically finds and injects downstream dependency signatures before Claude edits a core file.",
    how: "PreToolUse hook detects target file, AST-traces imports, extracts type signatures, injects as context.",
    example: "// About to edit src/api/users.ts\n// JIT: Detected 4 imports → Injected signatures\n// db.query<T>(), auth.verifyToken()...",
    color: "#f5b800", category: "context",
    install: "npx claudient add hook jit-context",
    steps: ["Install the PreToolUse JIT hook", "Hook detects target file before every edit", "AST traces imports and extracts type signatures", "Signatures injected as context for Claude"],
    related: ["claudient jit", "claudient caveman"] },

  // ── Zero-Trust & Compliance (NEW) ──
  { id: "constitution", icon: "📜", name: "Constitution Guardrail", tagline: "Hard enforcement of soft rules",
    desc: "Physically blocks code that violates CONSTITUTION.md. Turns guidelines into architectural enforcements.",
    how: "PreToolUse hook reads CONSTITUTION.md, intercepts every code write. Violations are rejected with a citation to the violated article.",
    example: "// Claude: Add user email to public API\n// Constitution: ✗ BLOCKED — Art.3: PII must not appear in public responses.\n// Rewriting with anonymization...",
    color: "#ff5722", category: "zero-trust",
    install: "npx claudient add hook constitution",
    steps: ["Create CONSTITUTION.md with your team guidelines", "Install the PreToolUse constitution hook", "Every code write is checked against your articles", "Violations rejected with citation to the violated article"],
    related: ["claudient enforce", "claudient audit"] },
  { id: "auditor", icon: "🔍", name: "The Auditor", tagline: "Code vs spec verification",
    desc: "Side-by-side comparison of final code against the original SPEC.md. Guarantees AI didn't go rogue.",
    how: "/audit-spec compares every implementation file against SPEC.md sections. Generates a compliance report with deviations.",
    example: "$ /audit-spec\n→ Comparing 12 files vs SPEC.md...\n→ 11/12 compliant\n→ Deviation: auth.ts §2.1 — missing rate limit\n→ Fix deviation?",
    color: "#ff5722", category: "zero-trust",
    install: "npx claudient add skill auditor",
    steps: ["Run /audit-spec after implementation", "Every file compared against SPEC.md sections", "Compliance report generated with deviations", "Fix flagged deviations before shipping"],
    related: ["claudient audit", "claudient enforce"] },
  { id: "shadow-pr", icon: "👤", name: "Ghost in the Machine", tagline: "Shadow PRs for continuous quality",
    desc: "Background routine that generates a refactored 'ideal' version of recent edits. Non-intrusive architectural mentoring.",
    how: "PostToolUse routine watches edits, generates a shadow branch with cleaner patterns. Review at your leisure.",
    example: "// You edit 5 files for a feature\n// Ghost: Generated shadow-patch-001\n→ Suggests: extract shared util, DRY 3 duplications\n→ Apply? [Y/n]",
    color: "#ff5722", category: "zero-trust",
    install: "npx claudient add hook shadow-pr",
    steps: ["Install the PostToolUse shadow-pr hook", "Hook watches every edit silently", "Generates shadow-patch-NNN with cleaner patterns", "Review shadow patches at your leisure"],
    related: ["claudient sweep", "claudient commit"] },
  { id: "interrogator", icon: "🕵️", name: "The Interrogator", tagline: "Automated issue triaging",
    desc: "Comments on vague GitHub/Linear tickets to extract reproduction steps automatically.",
    how: "/triage-issue reads the ticket, identifies missing info, and posts a structured comment asking for repro steps, environment, logs.",
    example: "$ /triage-issue #342\n→ Analyzing: 'Login is broken'\n→ Missing: browser, OS, error logs, steps\n→ Posted comment: 4 clarifying questions",
    color: "#ff5722", category: "zero-trust",
    install: "npx claudient add skill interrogator",
    steps: ["Run /triage-issue <issue-number>", "Ticket analyzed for missing information", "Structured comment posted with clarifying questions", "Repro steps, environment, and logs requested"],
    related: ["claudient documentation"] },
  { id: "archaeologist", icon: "🏺", name: "The Archaeologist", tagline: "Semantic context engine",
    desc: "Local vector-based search for conceptual code finding. Instant onboarding into massive codebases.",
    how: "/find-concept builds a local embedding index of the repo. Query by concept, not just keyword.",
    example: "$ /find-concept \"how do we handle auth tokens?\"\n→ Found 8 relevant files across 3 modules\n→ Top: src/auth/jwt.ts (score: 0.94)",
    color: "#ff5722", category: "zero-trust",
    install: "npx claudient add skill archaeologist",
    steps: ["Run /find-concept \"<concept query>\"", "Local embedding index built from your repo", "Files ranked by conceptual relevance score", "Navigate to top results for instant onboarding"],
    related: ["claudient jit", "claudient prophet"] },
  { id: "compliance-agent", icon: "✅", name: "Specify Wizard", tagline: "Spec Kit automation",
    desc: "Interactive skill that generates GitHub-compliant specs using Grill Me logic. Automates formal engineering.",
    how: "/specify walks through structured questions, generates SPEC.md, ARCHITECTURE.md, and ADR in one session.",
    example: "$ /specify New payment gateway\n→ 15 questions answered\n→ Generated: SPEC.md, ARCH.md, ADR-004\n→ Ready for /mason implement",
    color: "#ff5722", category: "zero-trust",
    install: "npx claudient add skill specify-wizard",
    steps: ["Run /specify <feature name>", "Answer 15 structured questions about your feature", "SPEC.md, ARCHITECTURE.md, and ADR generated", "Ready for /mason implement"],
    related: ["claudient spec", "claudient grill-me"] },
  { id: "telemetry-optin", icon: "🔒", name: "Privacy-First Telemetry Opt-in", tagline: "Secure onboarding configuration",
    desc: "Secure onboarding configuration step in claudient init with settings state persistence. Users explicitly opt-in to any data collection.",
    how: "During claudient init, a dedicated step presents telemetry options. Settings persisted to .claude/settings.json. Zero data collected without explicit opt-in.",
    example: "$ claudient init\n→ Step 4/5: Telemetry Settings\n→ [ ] Anonymous usage statistics\n→ [ ] Error reporting\n→ [ ] Performance metrics\n→ None selected by default. Opt-in? [y/N]\n→ Settings saved to .claude/settings.json",
    color: "#ff5722", category: "zero-trust",
    install: "npx claudient init",
    steps: ["Run claudient init to start onboarding", "Navigate to Step 4: Telemetry Settings", "Select which data categories to opt-in", "Settings saved to .claude/settings.json"],
    related: ["claudient doctor", "claudient permissions"] },
  { id: "audit-html", icon: "📊", name: "Executive HTML Compliance Audit", tagline: "SOC2/GDPR audit reports",
    desc: "Generates strict compliance audit logs in HTML format for SOC2/GDPR auditing. Produces a professional claudient-audit-report.html.",
    how: "claudient audit --html scans the project against SOC2, GDPR, and EU AI Act frameworks. Generates a styled HTML report with pass/fail matrices and remediation steps.",
    example: "$ claudient audit --html\n→ Scanning 8 compliance dimensions...\n→ ✓ Access Control (SOC2 CC6.1)\n→ ✗ Data Retention (GDPR Art.17) — 2 violations\n→ ✓ Encryption at Rest (SOC2 CC6.7)\n→ Generated claudient-audit-report.html (24 pages)",
    color: "#ff5722", category: "zero-trust",
    install: "npx claudient install audit",
    steps: ["Run claudient audit --html", "8 compliance dimensions scanned", "Pass/fail matrix generated per framework", "Open claudient-audit-report.html in browser"],
    related: ["claudient audit", "claudient score"] },
  { id: "permissions-editor", icon: "🔐", name: "Model Permission Editor", tagline: "Granular auto-execution control",
    desc: "Interactive command manager for listing, granting, or revoking auto-execution permissions for Claude Code tools and actions.",
    how: "claudient permissions opens an interactive editor showing all tool permissions. Grant or revoke auto-execution for Bash, file writes, MCP servers, and network access.",
    example: "$ claudient permissions\n→ Current permissions (14 rules):\n  ✓ Bash: allowed (npm, git, node)\n  ✗ Bash: denied (rm, sudo, curl)\n  ✓ FileWrite: allowed (*.ts, *.js)\n  ✗ Network: denied (external APIs)\n→ Toggle [Bash:denied] → grant? [y/N]",
    color: "#ff5722", category: "zero-trust",
    install: "npx claudient install permissions",
    steps: ["Run claudient permissions", "Review current permission rules (Bash, FileWrite, Network)", "Toggle allow/deny for each tool category", "Changes saved immediately — no restart needed"],
    related: ["claudient enforce", "claudient sentinel"] },
  { id: "sentinel", icon: "🛡️", name: "CLAUDE.md Sentinel", tagline: "Anti-hallucination rule writer",
    desc: "CLI rules scanner and writer that automatically writes or updates anti-hallucination project rules inside CLAUDE.md.",
    how: "claudient sentinel scans project patterns, common hallucination risks, and team conventions. Writes defensive rules directly into CLAUDE.md to prevent AI from guessing.",
    example: "$ claudient sentinel\n→ Scanning project structure...\n→ Detected: TypeScript + Prisma + Express\n→ Writing 8 anti-hallucination rules to CLAUDE.md:\n  - Never guess Prisma schema fields\n  - Always verify import paths exist\n  - Check API route definitions before writing handlers\n→ CLAUDE.md updated with sentinel rules.",
    color: "#ff5722", category: "zero-trust",
    install: "npx claudient install sentinel",
    steps: ["Run claudient sentinel", "Project structure scanned for hallucination risks", "Anti-hallucination rules written to CLAUDE.md", "Rules updated on each run — safe to re-run"],
    related: ["claudient enforce", "claudient doctor"] },

  // ── Enterprise Intelligence (NEW) ──
  { id: "historian", icon: "📜", name: "The Historian", tagline: "Self-writing documentation",
    desc: "Background hook that watches for edits in core directories and queues automatic ARCHITECTURE.md rewrites.",
    how: "PostToolUse hook monitors critical paths. When src/api/* or src/db/* changes, updates ARCHITECTURE.md.",
    example: "// You edit src/api/payments.ts\n// Historian: new endpoint POST /refunds\n→ Added §4.3 Refund Flow (12 lines)",
    color: "#00bcd4", category: "enterprise-intel",
    install: "npx claudient add hook historian",
    steps: ["Install the PostToolUse historian hook", "Hook monitors src/api/* and src/db/* changes", "ARCHITECTURE.md auto-updated when core files change", "Review new sections for accuracy"],
    related: ["claudient documentation", "claudient adr"] },
  { id: "sonar", icon: "🗺️", name: "Sonar Codebase Cartographer", tagline: "AST-powered repo mapping",
    desc: "AST/signature extraction for massive repos. Gives Claude an exact map instead of guessing from context.",
    how: "/map-repo builds an AST index of all public APIs, types, and relationships. Stores in .claudient/map.json.",
    example: "$ /map-repo\n→ Scanning 2,400 files...\n→ Indexed: 340 APIs, 180 types, 90 interfaces\n→ Context map ready. Claude now has full repo vision.",
    color: "#00bcd4", category: "enterprise-intel",
    install: "npx claudient install chart",
    steps: ["Run claudient map or claudient chart", "AST scans all files for public APIs and types", "Index stored in .claudient/map.json", "Claude now has full repo vision for precise context"],
    related: ["claudient prophet", "claudient oracle"] },
  { id: "prophet", icon: "🔮", name: "The Prophet", tagline: "Predictive tech debt analyzer",
    desc: "Analyzes Git hotspots to predict which files will cause the next production outage.",
    how: "/prophet correlates git blame density, change frequency, and test coverage to predict fragile files.",
    example: "$ /prophet\n→ Analyzing 6 months of git history...\n→ 🔴 HIGH RISK: src/api/payments.ts (47 changes, 30% coverage)\n→ 🟡 MEDIUM: src/utils/auth.ts (22 changes)",
    color: "#00bcd4", category: "enterprise-intel",
    install: "npx claudient install prophet",
    steps: ["Run claudient prophet in your project root", "6 months of git history analyzed", "Files ranked by risk score (change frequency x low coverage)", "Prioritize refactoring high-risk files first"],
    related: ["claudient oracle", "claudient sweep"] },
  { id: "invariant", icon: "🧬", name: "Invariant Discovery", tagline: "Unwritten team conventions",
    desc: "Analyzes Git history to extract unwritten team conventions — the rules of the road that aren't documented.",
    how: "/discover-invariants scans commit patterns, PR reviews, and code style to surface implicit team agreements.",
    example: "$ /discover-invariants\n→ 3 months of history analyzed\n→ Found 12 invariants:\n  1. Always use async/await (never .then)\n  2. DB queries always in repositories/\n  3. No console.log in production code",
    color: "#00bcd4", category: "enterprise-intel",
    install: "npx claudient add skill discover-invariants",
    steps: ["Run /discover-invariants", "3 months of git history scanned", "Unwritten conventions extracted from commit patterns", "Add discovered invariants to CLAUDE.md or CONSTITUTION.md"],
    related: ["claudient sentinel", "claudient enforce"] },
  { id: "oracle", icon: "🎱", name: "The Oracle", tagline: "Pre-mortem prediction",
    desc: "Simulates edge cases against a PR to predict specific production failure modes before merge.",
    how: "/oracle-pr reads the diff, generates adversarial test scenarios: high load, race conditions, null inputs.",
    example: "$ /oracle-pr #128\n→ Simulating 15 edge cases...\n→ 🔴 FAIL: 10K concurrent users → deadlock in order.ts\n→ 🟡 WARN: null response from payment API",
    color: "#00bcd4", category: "enterprise-intel",
    install: "npx claudient install oracle",
    steps: ["Run claudient oracle <PR-number-or-file>", "15 adversarial edge cases simulated", "Race conditions, null inputs, high load tested", "Review FAIL/WARN results before merging"],
    related: ["claudient prophet", "claudient tribunal"] },
  { id: "graph-context", icon: "🕸️", name: "Graph-Augmented Context", tagline: "Knowledge graph for repos",
    desc: "Maps the repository as a Knowledge Graph instead of a flat file list. Understands inheritance and data flow.",
    how: "/build-graph creates a SQLite-backed knowledge graph of code relationships. Claude queries it for precise context.",
    example: "$ /build-graph\n→ Building knowledge graph...\n→ 1,200 nodes, 3,400 edges\n→ Claude: \"Show me all handlers that touch User\"\n→ 8 handlers found across 4 modules",
    color: "#00bcd4", category: "enterprise-intel",
    install: "npx claudient add skill graph-context",
    steps: ["Run /build-graph to create the knowledge graph", "SQLite-backed graph of all code relationships", "Query with natural language: \"Show me all handlers that touch User\"", "Claude gets precise, relationship-aware context"],
    related: ["claudient jit", "claudient prophet"] },
  { id: "recursive-reflection", icon: "🪞", name: "Recursive Reflection", tagline: "Self-healing workflows",
    desc: "PostToolUse hook that forces Claude to reflect on its own code by running it against a Judge model.",
    how: "After every tool use, a lightweight Judge model reviews the output. If issues found, Claude self-corrects before returning.",
    example: "// Claude writes function\n// Judge: ✗ Missing null check on user param\n// Claude: Self-correcting...\n// Final output: validated and clean",
    color: "#00bcd4", category: "enterprise-intel",
    install: "npx claudient add hook recursive-reflection",
    steps: ["Install the PostToolUse reflection hook", "Judge model reviews every tool output", "Issues flagged and sent back for self-correction", "Final output validated before returning to user"],
    related: ["claudient enforce", "claudient shadow-compiler"] },
  { id: "svg-map-inspector", icon: "🗺️", name: "SVG Interactive Map Inspector", tagline: "Browse file nodes visually",
    desc: "High-performance SVG visualization module in the dashboard GUI to browse file nodes, inspect dependencies, and explore the codebase interactively.",
    how: "Accessible via the Toolkit → Codebase Map tab. Renders an interactive SVG graph of all project files. Click any node to inspect its functions, imports, and downstream dependencies.",
    example: "→ Open Toolkit → Codebase Map\n→ 10 nodes rendered across 3 groups (CLI, Core, Website)\n→ Click: cli.js → 4 functions, 4 imports\n→ Highlighted: 3 downstream dependencies\n→ Inspector panel: initCommand(), doctorCommand()...",
    color: "#00bcd4", category: "enterprise-intel",
    install: "claudient dashboard",
    steps: ["Run claudient dashboard to open the OS interface", "Open Toolkit, then click the Codebase Map tab", "Click any node to inspect its functions and imports", "Highlighted links show downstream dependencies"],
    related: ["claudient chart", "claudient prophet"] },
  { id: "architect-federation", icon: "🌐", name: "Architect / Mason Federation", tagline: "Dual-model orchestration at scale",
    desc: "Expensive model designs, cheap model builds — orchestrated across multiple files with dependency tracking.",
    how: "/federation takes an epic, Architect creates full blueprint, Mason agents implement each file in parallel.",
    example: "$ /federation Build notification system\n→ Architect: 8 files planned, dependency graph ready\n→ Mason agents: 8 parallel implementations\n→ All done in 45 seconds ($0.12 total)",
    color: "#ff9800", category: "multi-agent",
    install: "npx claudient add skill federation",
    steps: ["Run /federation with your epic description", "Architect model creates full blueprint with dependency graph", "Mason agents implement each file in parallel", "Review consolidated output and merge"],
    related: ["claudient swarm", "claudient prophet"] },
  { id: "cross-talk", icon: "📡", name: "Cross-Talk", tagline: "Agent federation protocol",
    desc: "Allows a local Claude session to query a colleague's Claude session. Collective team hive-mind.",
    how: "/cross-talk connects to a teammate's session via MCP. Query their context, share findings, coordinate.",
    example: "$ /cross-talk @alice \"What auth pattern are you using?\"\n→ Alice's session: JWT with refresh tokens, RSA-256\n→ Shall I adopt the same pattern?",
    color: "#ff9800", category: "multi-agent",
    install: "npx claudient add skill cross-talk",
    steps: ["Install the cross-talk MCP bridge", "Run /cross-talk @teammate with your query", "Teammate's Claude session responds with context", "Adopt or adapt their patterns in your codebase"],
    related: ["claudient swarm", "claudient handoff"] },
  { id: "dba-box", icon: "🗄️", name: "DBA-in-a-Box", tagline: "Production query auditor",
    desc: "Uses MCP to run EXPLAIN ANALYZE on a replica before writing migrations. Prevents bad queries hitting prod.",
    how: "PreToolUse hook intercepts migration files. Runs EXPLAIN ANALYZE on replica. Blocks queries with full table scans.",
    example: "// Claude: CREATE INDEX ON orders(user_id, created_at)\n// DBA-in-a-Box: Running EXPLAIN on replica...\n→ ⚠️ Sequential scan detected on 2M rows\n→ Suggestion: Add partial index WHERE status = 'active'",
    color: "#ff9800", category: "multi-agent",
    install: "npx claudient add hook dba-box",
    steps: ["Install the PreToolUse migration hook", "Write a migration file as normal", "Hook runs EXPLAIN ANALYZE on replica automatically", "Blocks bad queries and suggests index improvements"],
    related: ["claudient enforce", "claudient doctor"] },
  { id: "incident-cmdr", icon: "🚨", name: "Incident Commander", tagline: "PagerDuty autonomy",
    desc: "Wakes up on PagerDuty alerts, reads logs, rolls back deployments, drafts post-mortems.",
    how: "Webhook triggers on PagerDuty alert. Reads CloudWatch/Datadog logs, identifies root cause, executes rollback playbook.",
    example: "⏰ PagerDuty: 500 errors spike\n→ Incident Commander activated\n→ Reading logs... found: deployment abc123\n→ Rolling back to previous version...\n→ Drafting post-mortem...",
    color: "#ff9800", category: "multi-agent",
    install: "npx claudient add skill incident-commander",
    steps: ["Configure PagerDuty webhook in claudient.json", "Alert triggers Claudient session automatically", "Agent reads logs, identifies root cause, executes rollback", "Post-mortem draft generated for review"],
    related: ["claudient sentinel", "claudient fail-fast"] },
  { id: "self-healing-ci", icon: "🩹", name: "Self-Healing CI Pipeline", tagline: "Auto-patch failing tests",
    desc: "GitHub Action that automatically patches and pushes fixes for failing CI tests.",
    how: "On CI failure, spawns a repair agent that reads the error, patches the code, pushes a fix commit, re-triggers CI.",
    example: "CI: ✗ test_auth.py — AssertionError\n→ Self-Healing CI activated\n→ Agent: updated expected value (line 42)\n→ Pushed fix commit → CI: ✓ All passing",
    color: "#ff9800", category: "multi-agent",
    install: "npx claudient add action self-healing-ci",
    steps: ["Add the self-healing-ci GitHub Action to your workflow", "On CI failure, repair agent spawns automatically", "Agent reads error, patches code, pushes fix commit", "CI re-triggers and validates the fix"],
    related: ["claudient repair-agent", "claudient fail-fast"] },
  { id: "mcp-discovery", icon: "🔌", name: "MCP Dynamic Discovery", tagline: "Zero-config integrations",
    desc: "Scans the user's system for available MCP servers and automatically wires them into the active session.",
    how: "/discover-mcp scans localhost, Docker, and common ports. Auto-generates MCP configs for found services.",
    example: "$ /discover-mcp\n→ Scanning system...\n→ Found: PostgreSQL (5432), Redis (6379), Figma MCP\n→ Auto-generated 3 MCP configs\n→ Connected and ready",
    color: "#ff9800", category: "multi-agent",
    install: "npx claudient add skill mcp-discovery",
    steps: ["Run /discover-mcp to scan your system", "Review discovered services (databases, APIs, tools)", "Auto-generated MCP configs added to .claude/", "Connect and use discovered services in your session"],
    related: ["claudient doctor", "claudient recommend"] },

  // ── Creative & Vibe Coding (NEW) ──
  { id: "vibe-verify", icon: "🎨", name: "Vibe & Verify", tagline: "Adversarial UI loop",
    desc: "Vibe-Maker builds UI, Skeptic audits for accessibility, responsiveness, and edge cases. Polished pixels guaranteed.",
    how: "/vibe spawns two agents: Vibe-Maker generates React components, Skeptic runs WCAG audit and mobile-responsiveness checks.",
    example: "$ /vibe Build a pricing page\n→ Vibe-Maker: 3-tier pricing cards ✨\n→ Skeptic: ✗ Mobile overflow at 320px\n→ Vibe-Maker: Fixed. ✓ WCAG AA ✓ Responsive",
    color: "#e91e63", category: "creative",
    install: "npx claudient add skill vibe-verify",
    steps: ["Run /vibe with your UI description", "Vibe-Maker agent generates React components", "Skeptic agent audits for WCAG and responsiveness", "Iterate until both agents approve"],
    related: ["claudient design-extract", "claudient figma-bridge"] },
  { id: "figma-bridge", icon: "🎭", name: "Figma-to-Code Bridge", tagline: "Design to React in seconds",
    desc: "Uses Figma MCP to autonomously build React components from JSON design trees.",
    how: "/figma-to-code reads Figma design tree via MCP, maps to React components, generates styled JSX with Tailwind.",
    example: "$ /figma-to-code Frame \"Hero Section\"\n→ Reading Figma tree... 12 layers detected\n→ Generated: HeroSection.tsx (48 lines)\n→ Tailwind classes applied ✓  Responsive ✓",
    color: "#e91e63", category: "creative",
    install: "npx claudient add skill figma-bridge",
    steps: ["Ensure Figma MCP server is running", "Run /figma-to-code with the frame name", "Claudent reads Figma design tree via MCP", "Generated React component with Tailwind classes ready"],
    related: ["claudient design-extract", "claudient vibe-verify"] },
  { id: "artifact", icon: "📦", name: "The Artifact", tagline: "Self-documenting spec flow",
    desc: "Every prompt generates a versioned Artifact that acts as single source of truth. Code is just a renderable output.",
    how: "/artifact creates a Spec Kit-compatible versioned document. Edit the Artifact → Claudient regenerates the code.",
    example: "$ /artifact Build user settings page\n→ Generated Artifact v1.0 (spec + acceptance criteria)\n→ Code rendered from Artifact\n→ Business change? Edit Artifact → Code regenerates",
    color: "#e91e63", category: "creative",
    install: "npx claudient add skill artifact",
    steps: ["Run /artifact with your feature description", "Review generated spec and acceptance criteria", "Code renders from the Artifact as single source of truth", "Edit Artifact to regenerate code on requirement changes"],
    related: ["claudient measure-twice", "claudient atomic-commit"] },
  { id: "atomic-commit", icon: "📌", name: "Atomic Commit Hook", tagline: "Micro-versioning for AI edits",
    desc: "Auto-commits successfully tested code after every AI edit. Instant rollbacks without untangling files.",
    how: "PostToolUse hook: after tests pass, creates a micro-commit. If the next edit breaks things, git revert to last good state.",
    example: "// Claude edits 5 files\n// Hook: ✓ tests pass → commit ai-edit-001\n// Claude edits again → ✗ tests fail\n// Hook: auto-revert to ai-edit-001 ✓",
    color: "#e91e63", category: "creative",
    install: "npx claudient add hook atomic-commit",
    steps: ["Install the PostToolUse commit hook", "Claude edits code as normal", "After tests pass, micro-commit created automatically", "On test failure, auto-revert to last good commit"],
    related: ["claudient commit", "claudient safe-commit"] },
  { id: "design-extract", icon: "🎯", name: "Design System Extraction", tagline: "Tokens from any design",
    desc: "Extracts design tokens from Figma/designs, generates component libraries and theme mappings.",
    how: "/extract-tokens reads Figma file, extracts colors, spacing, typography, shadows. Generates CSS variables + Tailwind config.",
    example: "$ /extract-tokens Figma URL\n→ Extracted: 24 colors, 8 spacing, 6 typography\n→ Generated: tokens.css + tailwind.extend.js\n→ Theme mapping: 100% coverage",
    color: "#e91e63", category: "creative",
    install: "npx claudient add skill design-extract",
    steps: ["Run /extract-tokens with Figma file URL", "Colors, spacing, typography, shadows extracted", "Generated tokens.css and tailwind.extend.js", "Apply theme mapping across your component library"],
    related: ["claudient figma-bridge", "claudient vibe-verify"] },

  // ── UX & Developer Experience (NEW) ──
  { id: "pulse-statusline", icon: "💓", name: "The Pulse Statusline", tagline: "Dynamic real-time dashboard",
    desc: "Live statusline showing swarm status, context budget, session cost, and map density on the Claude terminal floor.",
    how: "Installs as a statusline config. Renders real-time metrics with color-coded indicators.",
    example: "Swarm: 2 active | Density: 84% | Budget: $0.42 | CTX: [▓▓▓▓░░] 62%",
    color: "#7c4dff", category: "ux",
    install: "npx claudient add skill pulse-statusline",
    steps: ["Install the statusline config", "Configure metrics in .claudient/statusline.json", "Statusline renders at terminal bottom in real-time", "Color-coded alerts for budget and context thresholds"],
    related: ["claudient doctor", "claudient dashboard"] },
  { id: "matrix-theme", icon: "🖥️", name: "The Matrix Theme Pack", tagline: "Premium aesthetic UX",
    desc: "Brand-aligned high-contrast themes: Claudient Neon, Ghost Shell. For senior power users.",
    how: "Install via /theme matrix-neon. Applies color scheme to statusline, terminal, and Claude Code UI.",
    example: "$ /theme matrix-neon\n→ Applied: Claudient Neon theme\n→ Terminal: green-on-black with syntax highlighting\n→ Statusline: matching neon accents",
    color: "#7c4dff", category: "ux",
    install: "npx claudient theme install matrix-neon",
    steps: ["Run /theme matrix-neon to install", "Theme applies to statusline, terminal, and UI", "Syntax highlighting updates across all panes", "Switch themes anytime with /theme <name>"],
    related: ["claudient dashboard", "claudient doctor"] },
  { id: "power-keybindings", icon: "⚡", name: "Power-User Keybindings", tagline: "Ergonomic speed",
    desc: "Shortcut map for high-frequency skills: Doctor, Save-State, Grill-Me. Professional AI engineer ergonomics.",
    how: "Install keybindings.json. Maps Ctrl+D to doctor, Ctrl+S to save-state, Ctrl+G to grill-me.",
    example: "Ctrl+D → claudient doctor (instant)\nCtrl+G → /grill-me (interrogation mode)\nCtrl+Shift+S → /save-state (compact & resume)",
    color: "#7c4dff", category: "ux",
    install: "npx claudient add skill keybindings",
    steps: ["Install keybindings.json to .claude/", "Restart Claude Code to load new shortcuts", "Ctrl+D triggers doctor, Ctrl+G triggers grill-me", "Customize bindings in .claude/keybindings.json"],
    related: ["claudient doctor", "claudient shell-aliases"] },
  { id: "shell-aliases", icon: "🐚", name: "High-Speed Shell Aliases", tagline: "Claudient as standalone platform",
    desc: "Short-circuit CLI commands: cx, cxd, cxa. Reduces friction and reinforces Claudient as a platform.",
    how: "Add to .bashrc/.zshrc. cx = claudient, cxd = claudient doctor, cxa = claudient audit.",
    example: "$ cx doctor   (≡ claudient doctor)\n$ cx score    (≡ claudient score)\n$ cxa         (≡ claudient audit --full)",
    color: "#7c4dff", category: "ux",
    install: "npx claudient setup aliases",
    steps: ["Run setup to append aliases to .bashrc/.zshrc", "Reload shell with source ~/.zshrc", "Use cx, cxd, cxa as short commands", "Add custom aliases in .claudient/aliases.sh"],
    related: ["claudient doctor", "claudient dashboard"] },
  { id: "dashboard-launcher", icon: "🖥️", name: "Offline GUI Desktop Dashboard", tagline: "Local web dashboard launcher",
    desc: "Launchable local web dashboard interface for playground stacks and harness-neutral downloads. Run claudient dashboard to open the full OS experience.",
    how: "claudient dashboard starts a local web server and opens the Claudient OS interface in your browser. Access all windows: CLI, Toolkit, Showcase, Swarm, and more.",
    example: "$ claudient dashboard\n→ Starting local server...\n→ ✓ Server running at http://localhost:4321\n→ Opening Claudient OS desktop...\n→ 16 windows available: Skills, Agents, Stacks, CLI...\n→ Drag windows, open apps, explore the ecosystem.",
    color: "#7c4dff", category: "ux",
    install: "npm install -g claudient",
    steps: ["Run claudient dashboard from any project", "Local server starts at http://localhost:4321", "OS desktop opens with 16 draggable windows", "Explore CLI, Toolkit, Showcase, Swarm, and more"],
    related: ["claudient doctor", "claudient score"] },
  { id: "tdd-workflow", icon: "🧪", name: "TDD Workflow Skill", tagline: "True test-driven loop",
    desc: "Enforces strict Test-Driven Development execution sequence: write failing test, code minimal features, refactor code.",
    how: "Enforced automatically during developer agent execution loops to ensure 100% test validation.",
    example: "$ claudient add skill tdd-workflow\n→ Stage 1: Red test added\n→ Stage 2: Green minimal code written\n→ Stage 3: Code refactored",
    color: "#1d4aff", category: "resilience",
    install: "npx claudient add skill tdd-workflow",
    steps: ["Write a failing test case first", "Run tests and confirm failure (Red)", "Implement minimal code to pass tests", "Refactor and verify tests stay green"],
    related: ["claudient tdd", "claudient stunt-double"] },
  { id: "glassmorphism-ui", icon: "🔮", name: "Glassmorphism UI System", tagline: "Premium frosted aesthetics",
    desc: "Provides style guidelines and utility parameters for frosted glass container panels using backdrop blurs and subtle borders.",
    how: "Renders layout parameters to align CSS backdrop blurs and transparent gradients.",
    example: "class=\"bg-white/70 backdrop-blur-md border border-white/20 shadow-lg\"",
    color: "#e91e63", category: "creative",
    install: "npx claudient add skill glassmorphism-ui",
    steps: ["Apply semi-transparent base color layer", "Enable browser backdrop blur filter", "Render top/left translucent border highlights", "Apply deep, soft box shadows"],
    related: ["claudient vibe-verify", "claudient design-extract"] },
  { id: "responsive-grids", icon: "📐", name: "Responsive CSS Grids", tagline: "Fluid multi-device layout",
    desc: "Layout guidelines and column setups for fluid grid systems that scale gracefully from mobile to desktop sizes.",
    how: "Configures media queries and grid repeaters to automatically align layout structures.",
    example: "class=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6\"",
    color: "#e91e63", category: "creative",
    install: "npx claudient add skill responsive-grids",
    steps: ["Establish single-column grid defaults", "Scale columns up inside responsive breakpoints", "Utilize repeat auto-fit minmax patterns", "Align grid gutters proportionally"],
    related: ["claudient vibe-verify", "claudient figma-bridge"] },
  { id: "marketing-funnel", icon: "📈", name: "Marketing Funnel Auditor", tagline: "Diagnose acquisition leaks",
    desc: "Diagnostic checklist to audit conversion metrics and dropoffs across Top, Middle, and Bottom of the customer funnel.",
    how: "Evaluates ad click-through rates, trial signup conversions, and checkout friction points.",
    example: "$ claudient add skill marketing-funnel-analysis\n→ TOFU Leak: 3.2% ad CTR detected\n→ MOFU Leak: 85% signup dropoff\n→ BOFU Leak: 40% bounce on pricing page",
    color: "#7c4dff", category: "ux",
    install: "npx claudient add skill marketing-funnel-analysis",
    steps: ["Audit awareness channels and CTR metrics (TOFU)", "Check visitor conversion to lead signups (MOFU)", "Identify friction points in pricing/checkout (BOFU)", "Optimize headlines and user onboarding flows"],
    related: ["claudient page-cro", "claudient analytics-tracking"] },
  { id: "moe-router", icon: "🤝", name: "Mixture of Experts Router", tagline: "Dynamic multi-model routing",
    desc: "Intelligent orchestrator agent that parses developer tasks and delegates parts to Opus, Sonnet, and Haiku for maximum speed and cost efficiency.",
    how: "Interprets request complexity to build and trigger model execution blueprints.",
    example: "Plan Task -> Opus\nWrite Boilerplate -> Haiku\nAssemble -> Sonnet",
    color: "#f54e00", category: "swarms",
    install: "npx claudient add agent moe-router",
    steps: ["Classify request complexity and risk levels", "Generate execution blueprint JSON", "Dispatch reasoning-heavy parts to Opus", "Build and write boilerplate using Haiku"],
    related: ["claudient architect-mason", "claudient council"] },
];

export function ShowcaseApp() {
  const [selected, setSelected] = useState(FEATURES[0]);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [blastSelectedId, setBlastSelectedId] = useState("src/utils/auth.ts");
  const filtered = activeCat ? FEATURES.filter((f) => f.category === activeCat) : FEATURES;
  const blastNode = BLAST_GRAPH.nodes.find(n => n.id === blastSelectedId) || BLAST_GRAPH.nodes[0];

  return (
    <div className="flex h-full">
      <div className="w-[220px] border-r border-hairline bg-cream/50 p-3 overflow-y-auto shrink-0">
        <Eyebrow color="#f54e00">Showcase · {FEATURES.length} Features</Eyebrow>
        <div className="mt-3 space-y-3">
          {CATEGORIES.map((cat) => (
            <div key={cat.id}>
              <button
                onClick={() => setActiveCat(activeCat === cat.id ? null : cat.id)}
                className={`w-full text-left flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${activeCat === cat.id ? "bg-white text-ink shadow-sm" : "text-mute hover:text-body"}`}
              >
                <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                {cat.label}
              </button>
              <div className="ml-1 mt-0.5 space-y-0.5">
                {FEATURES.filter((f) => f.category === cat.id).map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelected(f)}
                    className={`w-full text-left rounded-md px-2 py-1.5 text-[11.5px] transition ${selected.id === f.id ? "bg-white font-bold text-ink shadow-sm" : "text-body hover:bg-white/50"}`}
                  >
                    <span className="mr-1">{f.icon}</span>{f.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 p-5 overflow-y-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="grid place-items-center size-12 rounded-xl text-2xl" style={{ backgroundColor: selected.color + "1a" }}>
            {selected.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full" style={{ backgroundColor: selected.color }} />
              <span className="text-[11px] font-bold uppercase tracking-wider text-mute">
                {CATEGORIES.find((c) => c.id === selected.category)?.label}
              </span>
            </div>
            <Eyebrow color={selected.color}>{selected.tagline}</Eyebrow>
            <h2 className="text-xl font-bold text-ink">{selected.name}</h2>
          </div>
        </div>
        <p className="text-[14px] text-body leading-relaxed mb-5">{selected.desc}</p>
        <div className="mb-5">
          <div className="text-[12px] font-bold text-mute uppercase tracking-wider mb-2">How it works</div>
          <p className="text-[13px] text-body leading-relaxed">{selected.how}</p>
        </div>
        <div className="mb-5">
          <div className="text-[12px] font-bold text-mute uppercase tracking-wider mb-2">Example</div>
          <pre className="rounded-lg bg-code-bg text-code-text p-4 text-[11px] font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto">
            {selected.example}
          </pre>
        </div>
        {selected.install && (
          <div className="mb-5">
            <div className="text-[12px] font-bold text-mute uppercase tracking-wider mb-2">Install</div>
            <div className="flex items-center gap-2 rounded-lg bg-code-bg px-4 py-2.5">
              <code className="flex-1 text-[12px] font-mono text-emerald-400">{selected.install}</code>
              <button onClick={() => navigator.clipboard.writeText(selected.install!)}
                className="text-[10px] font-bold text-slate-400 hover:text-white transition shrink-0">Copy</button>
            </div>
          </div>
        )}

        {selected.steps && selected.steps.length > 0 && (
          <div className="mb-5">
            <div className="text-[12px] font-bold text-mute uppercase tracking-wider mb-2">Step-by-Step</div>
            <div className="space-y-2">
              {selected.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-hairline bg-white p-3">
                  <span className="grid place-items-center size-6 rounded-full text-[11px] font-bold shrink-0" style={{ backgroundColor: selected.color + "20", color: selected.color }}>{i + 1}</span>
                  <span className="text-[12.5px] text-body leading-relaxed pt-0.5">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {selected.related && selected.related.length > 0 && (
          <div className="mb-5">
            <div className="text-[12px] font-bold text-mute uppercase tracking-wider mb-2">Related Commands</div>
            <div className="flex flex-wrap gap-2">
              {selected.related.map((cmd) => (
                <span key={cmd} className="inline-flex items-center rounded-md bg-code-bg px-2.5 py-1.5 text-[11px] font-mono font-semibold text-brand-purple">
                  {cmd}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-cream px-2.5 py-1 text-[11px] text-mute">
          Target: {CATEGORIES.find((c) => c.id === selected.category)?.audience}
        </div>

        {selected.id === "blast-radius" && (
          <div className="mt-6">
            <div className="text-[12px] font-bold text-mute uppercase tracking-wider mb-3">Interactive Dependency Graph</div>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 rounded-xl border border-hairline bg-[#1a1b26] relative overflow-hidden min-h-[340px]">
                <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 z-10">
                  # Blast Radius — src/utils/auth.ts (click nodes to inspect)
                </div>
                <svg className="w-full h-full min-h-[340px]">
                  {BLAST_GRAPH.links.map((link, i) => {
                    const s = BLAST_GRAPH.nodes.find(n => n.id === link.source);
                    const t = BLAST_GRAPH.nodes.find(n => n.id === link.target);
                    if (!s || !t) return null;
                    const hl = blastSelectedId === link.source || blastSelectedId === link.target;
                    return <line key={i} x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke={hl ? "#fabd2f" : "#444b6a"} strokeWidth={hl ? 2 : 1} strokeDasharray={hl ? "none" : "3,3"} className="transition-all duration-300" />;
                  })}
                  {BLAST_GRAPH.nodes.map((node) => {
                    const isSel = blastSelectedId === node.id;
                    return (
                      <g key={node.id} transform={`translate(${node.x},${node.y})`} onClick={() => setBlastSelectedId(node.id)} className="cursor-pointer group">
                        <circle r={isSel ? 12 : 9} fill={RISK_COLORS[node.risk]} stroke={isSel ? "#fff" : "transparent"} strokeWidth={2} className="transition-all duration-300 group-hover:scale-125" />
                        <text y={22} textAnchor="middle" fill={isSel ? "#ffffff" : "#a9b1d6"} className="text-[10px] font-mono select-none font-semibold">{node.label}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
              <div className="w-full lg:w-64 rounded-xl border border-hairline bg-white p-4 shrink-0">
                <span className="text-[10px] font-bold text-mute uppercase tracking-wider block mb-1">Node Inspector</span>
                <h3 className="text-[13px] font-mono font-bold text-ink truncate mb-2">{blastNode.id}</h3>
                <div className="flex gap-1.5 flex-wrap mb-3">
                  <span className="text-[9px] font-bold uppercase rounded px-1.5 py-0.5" style={{ backgroundColor: RISK_COLORS[blastNode.risk] + "20", color: RISK_COLORS[blastNode.risk] }}>
                    {blastNode.risk} risk
                  </span>
                  <span className="text-[9px] font-bold uppercase rounded px-1.5 py-0.5 bg-slate-100 text-slate-500">
                    depth {blastNode.depth}
                  </span>
                </div>
                <div className="mb-3">
                  <span className="text-[11px] font-bold text-mute uppercase tracking-wider block mb-1.5">Imports ({blastNode.imports.length})</span>
                  <div className="space-y-1">
                    {blastNode.imports.map((imp, i) => (
                      <code key={i} className="block text-[10px] font-mono bg-slate-50 text-slate-600 px-2 py-0.5 rounded">"{imp}"</code>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-mute uppercase tracking-wider block mb-1.5">Downstream Impact</span>
                  <span className="text-[12px] text-body">
                    {BLAST_GRAPH.links.filter(l => l.source === blastNode.id || l.target === blastNode.id).length} direct connections
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-hairline">
                  <div className="text-[10px] font-bold text-mute uppercase tracking-wider mb-2">Risk Legend</div>
                  <div className="space-y-1">
                    {(["critical", "medium", "safe"] as const).map(r => (
                      <div key={r} className="flex items-center gap-1.5">
                        <span className="size-2.5 rounded-full" style={{ backgroundColor: RISK_COLORS[r] }} />
                        <span className="text-[10px] text-body capitalize">{r} path</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
