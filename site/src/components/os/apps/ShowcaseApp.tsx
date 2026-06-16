import { useState } from "react";
import { Eyebrow } from "./ui";

interface Feature {
  id: string;
  icon: string;
  name: string;
  tagline: string;
  desc: string;
  how: string;
  example: string;
  color: string;
  category: string;
}

interface Category {
  id: string;
  label: string;
  color: string;
  audience: string;
}

const CATEGORIES: Category[] = [
  { id: "cost", label: "Context & Cost Optimization", color: "#3fb950", audience: "CTOs & Power Users" },
  { id: "resilience", label: "Resilience & Zero-Hallucination", color: "#1d4aff", audience: "DevSecOps & QA Leads" },
  { id: "enterprise", label: "Enterprise Architecture", color: "#b62ad9", audience: "Architects & Staff Engineers" },
  { id: "swarms", label: "Multi-Agent Swarms", color: "#f54e00", audience: "Lead Developers" },
  { id: "context", label: "Environment & Context Engineering", color: "#f5b800", audience: "Onboarding & Daily Contributors" },
];

const FEATURES: Feature[] = [
  // ── Category 1: Context & Cost Optimization ──
  {
    id: "claudeignore",
    icon: "🚫",
    name: ".claudeignore Templates",
    tagline: "Token cost reduction",
    desc: "Optimized ignore templates for Node, Python, and Go that prevent Claude from reading package-lock.json, dist/ folders, and other noise files.",
    how: "Drop a .claudeignore template into your repo root. Claudient's /setup-ignore skill auto-detects your stack and generates optimized patterns that slash token waste.",
    example: "$ /setup-ignore\n→ Detected: Node.js + TypeScript\n→ Generated .claudeignore:\n  node_modules/**\n  dist/**\n  package-lock.json\n  *.map\n→ \"Token cost reduced by ~60% per request!\"",
    color: "#3fb950",
    category: "cost",
  },
  {
    id: "save-state",
    icon: "💾",
    name: "Context Compactor",
    tagline: "Infinite memory, zero bloat",
    desc: "Synthesizes a massive chat history into a single CLAUDE_STATE.md file so users can safely clear their context without losing their place.",
    how: "The /save-state skill compresses your entire session — decisions made, files edited, architecture choices — into a portable markdown file. Start fresh, import state, continue seamlessly.",
    example: "$ /save-state\n→ Analyzing 47 messages, 12 files edited...\n→ Created CLAUDE_STATE.md (85 lines)\n→ \"Context compacted! Clear your chat and\n   add @CLAUDE_STATE.md to resume.\"",
    color: "#3fb950",
    category: "cost",
  },
  {
    id: "caveman",
    icon: "🦴",
    name: "Caveman Mode",
    tagline: "Pure execution, zero filler",
    desc: "Enforces a strict DSL that forbids conversational English, outputting only machine-readable actions. Strips all chatbot behavior for raw code execution.",
    how: "Activates via /caveman skill + PreToolUse hook. Claude can only output structured JSON actions. No explanations, no pleasantries — just pure tool invocations at a fraction of the token cost.",
    example: "$ /caveman\n→ Caveman Mode activated 🦴\n→ Claude output:\n  {\"action\":\"write\",\"file\":\"auth.ts\",\"lines\":42}\n  {\"action\":\"test\",\"cmd\":\"npm test -- auth\"}\n  {\"action\":\"done\"}\n→ Token savings: 73%",
    color: "#3fb950",
    category: "cost",
  },

  // ── Category 2: Resilience & Zero-Hallucination ──
  {
    id: "shadow-compiler",
    icon: "👻",
    name: "Shadow Compiler",
    tagline: "Zero-hallucination type safety",
    desc: "Silently runs the project's compiler in the background after every edit. Catches syntax errors, missing imports, and type violations before the task is marked complete.",
    how: "PostToolUse hook fires after every file write. Runs tsc --noEmit, cargo check, ruff check, or go build depending on file extension. Feeds errors back to Claude for auto-correction.",
    example: "// Claude edits auth.ts\n// Shadow Compiler fires silently:\n//   ✗ Property 'usre' does not exist on type 'User'\n// Claude sees the error and fixes it\n// before you even notice.",
    color: "#1d4aff",
    category: "resilience",
  },
  {
    id: "safe-commit",
    icon: "🛡️",
    name: "Safe Commit Hook",
    tagline: "If it hits GitHub, it works",
    desc: "A wrapper around git that forces Claude to run local tests and linters before executing a commit, blocking dirty code from ever reaching the repository.",
    how: "Intercepts git commit via PreToolUse hook. Runs the project's test suite, linter, and type checker. If any fail, the commit is blocked and Claude must fix the issues first.",
    example: "$ git commit -m \"add auth\"\n→ Safe Commit Hook triggered:\n  ✓ ESLint — passed\n  ✗ vitest — 2 tests failing\n→ Commit BLOCKED. Fixing tests...\n→ All passed. Committing.",
    color: "#1d4aff",
    category: "resilience",
  },
  {
    id: "spec-enforcer",
    icon: "📐",
    name: "Spec-First Enforcer",
    tagline: "Total architectural compliance",
    desc: "A pre-tool hook that reads SPEC.md and physically blocks Claude from executing bash commands or code writes that violate the approved architecture.",
    how: "PreToolUse hook intercepts every Bash and Write action. Compares the intent against SPEC.md constraints. Non-compliant actions are rejected with a citation to the violated spec section.",
    example: "// Claude tries: ALTER TABLE users DROP COLUMN email\n// Spec Enforcer: ✗ BLOCKED\n//   SPEC.md §4.2: \"User email is immutable.\"\n//   \"I cannot drop this column per your spec.\"",
    color: "#1d4aff",
    category: "resilience",
  },
  {
    id: "chaos-monkey",
    icon: "🐒",
    name: "Chaos Monkey",
    tagline: "AI designed to break your code",
    desc: "An adversarial agent swarm that rewrites unit tests to simulate network drops, race conditions, and massive payloads to harden infrastructure code.",
    how: "/chaos-test spawns adversarial test-engineer agents that inject failure modes: 500ms network delays, concurrent writes, 10MB payloads, null returns, and permission errors.",
    example: "$ /chaos-test src/api/payments.ts\n→ Spawning 5 chaos agents...\n→ Agent 1: Injected 3s timeout on DB call\n→ Agent 2: Race condition on concurrent txns\n→ Agent 3: Null response from Stripe mock\n→ 2/5 scenarios broke your code. Fix?",
    color: "#1d4aff",
    category: "resilience",
  },

  // ── Category 3: Enterprise Architecture & Strategy ──
  {
    id: "grill-me",
    icon: "🔥",
    name: "Grill Me",
    tagline: "Staff Engineer interrogation",
    desc: "Forces Claude to refuse to write code until it has ruthlessly interrogated the user on edge cases, security, and data constraints to generate a hardened SPEC.md.",
    how: "/grill-me activates a Socratic loop. Claude asks pointed questions about failure modes, auth, data volume, and compliance. Only after 10+ rounds does it produce a SPEC.md ready for implementation.",
    example: "$ /grill-me Build a payment webhook handler\n→ Q1: What happens if Stripe sends duplicate events?\n→ Q2: What's your idempotency key strategy?\n→ Q3: How do you handle webhook timeouts >30s?\n→ ... (12 questions later)\n→ Generated SPEC.md — ready for /mason",
    color: "#b62ad9",
    category: "enterprise",
  },
  {
    id: "stunt-double",
    icon: "🎬",
    name: "Stunt Double",
    tagline: "True AI Test-Driven Development",
    desc: "Enforces strict TDD by orchestrating a test-engineer agent to write failing tests, followed by an implementation-engineer agent to make them pass.",
    how: "/stunt-double spawns two agents sequentially: TestEngineer writes comprehensive failing tests from the spec, then ImplementationEngineer writes the minimum code to make every test green.",
    example: "$ /stunt-double Add rate limiter middleware\n→ Phase 1: TestEngineer writing 8 tests...\n  ✗ rateLimit blocks after 100 req/min\n  ✗ rateLimit returns 429 with Retry-After\n→ Phase 2: ImplementationEngineer...\n  ✓ All 8 tests passing",
    color: "#b62ad9",
    category: "enterprise",
  },
  {
    id: "architect-mason",
    icon: "🏗️",
    name: "Architect / Mason",
    tagline: "Opus blueprints, Haiku bricks",
    desc: "Uses an expensive model to design a detailed spec and architecture, then hands off to a cheap, fast model to grind out the boilerplate implementation.",
    how: "/architect uses Opus-level reasoning to produce a detailed ARCHITECTURE.md with file plans, interfaces, and data flow. /mason uses Haiku to implement each file rapidly at minimal cost.",
    example: "$ /architect Design a real-time notification system\n→ Opus: Analyzing requirements...\n→ Created ARCHITECTURE.md (200 lines)\n  - WebSocket gateway\n  - Redis pub/sub layer\n  - 5 files planned\n$ /mason implement\n→ Haiku: Implementing 5 files... ✓ ($0.03)",
    color: "#b62ad9",
    category: "enterprise",
  },
  {
    id: "adr",
    icon: "📋",
    name: "ADR Generator",
    tagline: "Never lose the why",
    desc: "Automatically generates standardized Markdown Architectural Decision Records when major systemic changes are detected in the codebase.",
    how: "/adr detects architectural pivots — new frameworks, database changes, API contract shifts — and generates ADR files following the Michael Nygard format in docs/adr/.",
    example: "$ /adr\n→ Detected: switching from REST to GraphQL\n→ Generated docs/adr/003-graphql-migration.md\n  Status: ACCEPTED\n  Context: REST N+1 queries at scale\n  Decision: Adopt GraphQL with DataLoader\n  Consequences: Schema-first, codegen needed",
    color: "#b62ad9",
    category: "enterprise",
  },
  {
    id: "historian",
    icon: "📜",
    name: "The Historian",
    tagline: "Self-writing documentation",
    desc: "A background hook that watches for edits in core directories (src/api, src/db) and queues automatic rewrites of the ARCHITECTURE.md file.",
    how: "PostToolUse hook monitors critical paths. When src/api/* or src/db/* changes, it queues a background task to update ARCHITECTURE.md with new endpoints, schemas, and data flows.",
    example: "// You edit src/api/payments.ts\n// Historian hook fires:\n// → Detected: new endpoint POST /refunds\n// → Updating ARCHITECTURE.md...\n// → Added §4.3 Refund Flow (12 lines)",
    color: "#b62ad9",
    category: "enterprise",
  },
  {
    id: "blast-radius",
    icon: "💥",
    name: "Blast Radius Analyzer",
    tagline: "Map what you'll break",
    desc: "AST-traces downstream imports before a breaking change, generating a visual map of impacted files and dependencies.",
    how: "/blast-radius parses the AST of the target file, traces all import chains downstream, and generates a dependency graph showing every file that will be affected.",
    example: "$ /blast-radius src/utils/auth.ts\n→ Tracing import graph...\n→ 14 files depend on auth.ts:\n  ├── src/api/users.ts (import: verifyToken)\n  ├── src/api/admin.ts (import: requireRole)\n  ├── src/middleware/cors.ts (import: decodeJWT)\n  └── ... 11 more files impacted",
    color: "#b62ad9",
    category: "enterprise",
  },
  {
    id: "legacy-strangler",
    icon: "🌿",
    name: "Legacy Strangler",
    tagline: "Don't rewrite. Strangle.",
    desc: "A guided methodology that prevents Big Bang rewrites, teaching Claude to build facades and extract microservices safely from legacy monoliths.",
    how: "/strangle analyzes the monolith, identifies bounded contexts, and creates a strangler fig plan: facade layer → proxy routes → extract service → verify → cut over.",
    example: "$ /strangle src/monolith/orders.ts (2,400 lines)\n→ Identified 4 bounded contexts:\n  1. Order Creation (facade → extract)\n  2. Payment Processing (proxy → extract)\n  3. Inventory Check (facade → extract)\n  4. Shipping (proxy → extract)\n→ Phase 1: Extracting Order Creation...",
    color: "#b62ad9",
    category: "enterprise",
  },

  // ── Category 4: Multi-Agent Swarms & Autonomy ──
  {
    id: "night-shift",
    icon: "🌙",
    name: "Night Shift",
    tagline: "Autonomous batch processor",
    desc: "An autonomous batch processor that queues hundreds of files and manages its own API rate limits (sleeping/resuming) via a specialized notification hook.",
    how: "Creates a BATCH_QUEUE.md, processes each file individually, marks them done, and handles rate limits automatically. Designed for 3+ hour unsupervised sessions.",
    example: "$ /night-shift Migrate all .js to TypeScript\n→ BATCH_QUEUE.md: 50 files queued\n→ Processing 1/50: auth.js → auth.ts ✓\n→ Processing 2/50: helpers.js → helpers.ts ✓\n→ Rate limit hit. Sleeping 60s...\n→ Resuming. 3/50: utils.js → utils.ts ✓",
    color: "#f54e00",
    category: "swarms",
  },
  {
    id: "hive-swarm",
    icon: "🐝",
    name: "Hive Orchestrator",
    tagline: "Virtual engineering department",
    desc: "A master routing agent that breaks massive epics into sub-tasks and spawns specialized subagents (backend, frontend, security) sequentially.",
    how: "/hive-swarm decomposes an epic into a task graph, assigns each task to a specialist agent (backend, frontend, security-reviewer), and orchestrates execution with dependency management.",
    example: "$ /hive-swarm Build user dashboard with auth\n→ Decomposing epic into 6 tasks:\n  1. [backend] Create User API endpoints\n  2. [backend] JWT auth middleware\n  3. [frontend] Dashboard React component\n  4. [frontend] Auth context provider\n  5. [security] Audit auth flow\n  6. [integration] E2E test suite\n→ Spawning agents...",
    color: "#f54e00",
    category: "swarms",
  },
  {
    id: "tribunal",
    icon: "⚖️",
    name: "Tribunal Review",
    tagline: "3-agent adversarial PR review",
    desc: "Spawns three adversarial personas (The Hacker, The Performance Junkie, The Senior Pedant) to simultaneously audit a PR from every angle.",
    how: "Orchestrator spawns security-hacker, performance-junkie, and senior-pedant agents sequentially. Each reviews the same diff with adversarial perspective. Results synthesized into one brutal review.",
    example: "$ /tribunal-review Check auth.js\n\n⚖️ The Tribunal:\n🛡️ Hacker: Timing attack in password compare (L42)\n⚡ Perf: N+1 query in user lookup loop\n📐 Pedant: console.log in production (L88)\n→ 3 findings. Fix all?",
    color: "#f54e00",
    category: "swarms",
  },
  {
    id: "sweeper",
    icon: "🧹",
    name: "Codebase Sweeper",
    tagline: "The janitor you never pay",
    desc: "A low-cost background agent that continuously hunts and removes dead code, unused imports, resolved TODOs, and stale comments.",
    how: "/sweep runs AST analysis to find unused exports, dead imports, resolved TODO comments, and outdated documentation. Removes them silently in the background.",
    example: "$ /sweep\n→ Scanning 340 files...\n→ Found 23 dead imports\n→ Found 8 resolved TODOs\n→ Found 4 unused exports\n→ Cleaned 35 items across 18 files\n→ \"Your codebase just lost 200 lines of debt.\"",
    color: "#f54e00",
    category: "swarms",
  },
  {
    id: "bisect-bug",
    icon: "🔬",
    name: "Time-Travel Debugger",
    tagline: "Git bisect automated bug finder",
    desc: "Autonomously integrates with git bisect by writing a test script and jumping through Git history to find the exact commit that broke the code.",
    how: "Writes a deterministic test script, runs git bisect with automated binary search through history, identifies the offending commit, reads the diff, and proposes a fix.",
    example: "$ /bisect-bug Login returns 500. Was working in a1b2c3d.\n→ Writing bisect-test.sh...\n→ Running git bisect through 47 commits...\n→ Found it! Commit f9e8d7c by Jane Doe\n→ \"Removed await before database call\"\n→ Shall I fix it?",
    color: "#f54e00",
    category: "swarms",
  },

  // ── Category 5: Environment & Context Engineering ──
  {
    id: "auto-tdd",
    icon: "🧪",
    name: "Auto-TDD Hook",
    tagline: "Instant test feedback",
    desc: "Automatically watches for file saves and runs the corresponding test file (Jest/Pytest/Vitest) in the background, feeding results back to Claude.",
    how: "PostToolUse hook maps source files to test files using naming conventions. When src/auth.ts is saved, it auto-runs tests/auth.test.ts and shows pass/fail to Claude immediately.",
    example: "// You edit src/auth.ts\n// Auto-TDD fires:\n//   $ vitest tests/auth.test.ts\n//   ✓ verifyToken (12ms)\n//   ✗ refreshToken — expected 200, got 401\n// Claude sees the failure and fixes it.",
    color: "#f5b800",
    category: "context",
  },
  {
    id: "dev-doctor",
    icon: "🩺",
    name: "Dev Doctor",
    tagline: "Environment diagnostics",
    desc: "Acts as a SysAdmin to diagnose ECONNREFUSED errors by checking Docker status, port conflicts, .env drift, and common development environment issues.",
    how: "/dev-doctor runs a diagnostic checklist: Docker running? Port in use? .env matches .env.example? Node version correct? Database migrated? Produces a health report with fixes.",
    example: "$ /dev-doctor\n→ Running diagnostics...\n  ✓ Node v20.11 — OK\n  ✗ Port 3000 — occupied by PID 4521\n  ✗ .env — missing DATABASE_URL\n  ✗ Docker — not running\n→ 3 issues found. Auto-fix? [Y/n]",
    color: "#f5b800",
    category: "context",
  },
  {
    id: "jit-context",
    icon: "💉",
    name: "JIT Context Injector",
    tagline: "Just-in-time dependency injection",
    desc: "Dynamically finds and injects the signatures of downstream dependencies into Claude's prompt right before it edits a core file.",
    how: "PreToolUse hook detects which file Claude is about to edit. AST-traces its imports, extracts type signatures and function interfaces, and injects them as context before the edit happens.",
    example: "// Claude is about to edit src/api/users.ts\n// JIT Injector fires:\n// → Detected 4 imports: db, auth, cache, mail\n// → Injected signatures:\n//   db.query<T>(sql): Promise<T[]>\n//   auth.verifyToken(t): { userId, role }\n//   cache.get/set(key, val, ttl)\n// Claude now has full context. Editing...",
    color: "#f5b800",
    category: "context",
  },
];

export function ShowcaseApp() {
  const [selected, setSelected] = useState(FEATURES[0]);
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const filtered = activeCat ? FEATURES.filter((f) => f.category === activeCat) : FEATURES;

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-[220px] border-r border-hairline bg-cream/50 p-3 overflow-y-auto shrink-0">
        <Eyebrow color="#f54e00">Showcase · 22 Features</Eyebrow>
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
                {(activeCat ? FEATURES.filter((f) => f.category === cat.id) : FEATURES.filter((f) => f.category === cat.id)).map((f) => (
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

      {/* Content */}
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
          <pre className="rounded-lg bg-[#1d1f27] text-[#e6e6e6] p-4 text-[11px] font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto">
            {selected.example}
          </pre>
        </div>

        {/* Category audience badge */}
        <div className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-cream px-2.5 py-1 text-[11px] text-mute">
          🎯 Target: {CATEGORIES.find((c) => c.id === selected.category)?.audience}
        </div>
      </div>
    </div>
  );
}
