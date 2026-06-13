# Claude for Software Engineers

Everything a Software Engineer or Full-Stack Developer needs to run AI-augmented feature development, code review, debugging, architecture documentation, and technical decision-making in Claude Code.

---

## Who this is for

You are a software engineer, full-stack developer, or technical lead whose job is to ship reliable code — designing systems, writing features, reviewing PRs, fixing bugs, and keeping technical debt from compounding. You spend too much time context-switching between tools, writing boilerplate, and manually generating documentation. Claude Code cuts that overhead by 20-40x.

**Before Claude Code:** 45 minutes to review a complex PR. 2 hours to debug a production issue with no obvious stack trace. Architecture decisions documented weeks later, if at all. Onboarding a new teammate takes a full week.

**After:** PR reviewed with inline comments in under 5 minutes. Root cause identified in one debugging session. ADRs written at the moment of decision. Onboarding doc generated from the codebase in 30 seconds.

---

## 30-second install

```bash
# Install skill sets by discipline
npx claudient add skills backend
npx claudient add skills devops-infra
npx claudient add skills ai-engineering
npx claudient add skills database
npx claudient add skills productivity

# Or cherry-pick what you need:
npx claudient add skill backend/next-js
npx claudient add skill backend/fastapi
npx claudient add skill devops-infra/docker
npx claudient add skill devops-infra/kubernetes
npx claudient add skill devops-infra/terraform
npx claudient add skill productivity/code-review
npx claudient add skill productivity/debug
npx claudient add skill productivity/refactor
npx claudient add skill productivity/pr-review
npx claudient add skill productivity/adr-writer
npx claudient add skill productivity/ship-gate
npx claudient add skill productivity/tech-debt-tracker
npx claudient add skill ai-engineering/claude-api
npx claudient add skill ai-engineering/rag-architect
npx claudient add skill ai-engineering/mcp-server-builder
npx claudient add skill database/drizzle
npx claudient add skill database/postgres
```

---

## Your Claude Code engineering stack

### Skills (slash commands)

| Skill | What it does | When to use |
|---|---|---|
| `/next-js` | Next.js App Router scaffolding, RSC patterns, routing, API routes, server actions | Building or extending Next.js apps |
| `/fastapi` | FastAPI endpoint generation, Pydantic schemas, dependency injection, background tasks | Python API development |
| `/docker` | Dockerfile authoring, multi-stage builds, Compose files, image optimisation | Containerising services |
| `/kubernetes` | Manifest generation, deployment strategies, Helm chart review, resource limits | K8s configuration and deploy reviews |
| `/terraform` | Infrastructure-as-code modules, plan review, state management guidance | Cloud infrastructure provisioning |
| `/code-review` | Deep correctness review: bugs, logic errors, edge cases, security issues | Reviewing your own code before pushing |
| `/debug` | Systematic root-cause analysis — stack traces, logs, hypotheses, reproduction steps | Any bug that is not obvious in 10 minutes |
| `/refactor` | Structured refactoring with a before/after diff and test impact analysis | Cleaning up code without breaking behaviour |
| `/pr-review` | PR summary, risk rating, inline comment generation, merge recommendation | Reviewing incoming PRs |
| `/adr-writer` | Architecture Decision Record generation from a context and decision | Documenting architectural choices at decision time |
| `/ship-gate` | Pre-merge checklist: tests, coverage, security, performance, docs | Final check before merging to main |
| `/tech-debt-tracker` | Identify, categorise, and prioritise technical debt across a codebase | Quarterly debt planning sessions |
| `/claude-api` | Claude API and Anthropic SDK integration with prompt caching, tool use, streaming | Building features on top of Claude |
| `/rag-architect` | RAG pipeline design: chunking, embeddings, retrieval, reranking | Building knowledge-retrieval features |
| `/mcp-server-builder` | Scaffold and wire up a Model Context Protocol server | Extending Claude with custom tools |
| `/drizzle` | Drizzle ORM schema design, migrations, query generation, relations | TypeScript database work |
| `/postgres` | Query optimisation, schema design, indexing strategy, EXPLAIN analysis | PostgreSQL database work |

### Agents

| Agent | Model | When to spawn |
|---|---|---|
| `core/architect` | Opus | System design decisions, cross-service architecture, major refactors |
| `core/code-reviewer` | Sonnet | Deep PR review, correctness audits, logic verification |
| `core/security-reviewer` | Sonnet | Security audits, dependency review, threat modelling |
| `core/planner` | Sonnet | Breaking epics into tasks, sprint planning, estimation |
| `roles/senior-backend` | Sonnet | Backend implementation, API design, performance tuning |
| `roles/senior-frontend` | Sonnet | UI/UX implementation, component architecture, accessibility |
| `roles/fullstack-developer` | Sonnet | Features that span frontend and backend with shared types |
| `build-resolvers/typescript-resolver` | Haiku | TypeScript compilation errors, type inference failures, tsconfig issues |
| `build-resolvers/python-resolver` | Haiku | Python import errors, dependency conflicts, virtual environment issues |

---

## Daily workflow

### Morning — context load (10-15 minutes)

**1. Orient on what changed overnight**
```
/pr-review

List all open PRs on main. For each one:
- One-line summary of what it does
- Risk rating (low / medium / high)
- Whether it needs my review today
```

**2. Load context on your current feature branch**
```
/adr-writer

I am picking up work on [feature name].
Here is the branch diff: [paste git diff or describe the state]

Summarise what has been decided, what is still open,
and flag any decisions I need to make before writing more code.
```

---

### Feature development (ongoing)

**3. Scaffold a new endpoint or component**
```
/fastapi

Add a POST /api/v1/documents/ingest endpoint:
- Auth: Bearer token, validate against users table
- Body: { source_url: str, metadata: dict }
- Background task: fetch content, chunk, embed, store in pgvector
- Response: { job_id: uuid, status: "queued" }

Use the existing dependency injection pattern in app/dependencies.py.
```

**4. Review your own code before pushing**
```
/code-review

[paste the diff or describe the file]

Check for:
- Correctness bugs and edge cases
- SQL injection or auth bypass risks
- N+1 queries or missing indexes
- Missing error handling
- Any logic that will break under concurrency
```

---

### PR review (5-10 minutes per PR)

**5. Review an incoming PR**
```
/pr-review

PR: [title or link]
Author: [name]
Diff:
[paste diff]

Give me:
- What this PR does in 2-3 sentences
- Risk rating and why
- Any bugs or correctness issues
- Inline comments I should post
- Merge recommendation
```

---

### Debugging (on demand)

**6. Diagnose a bug systematically**
```
/debug

Error:
[paste stack trace or describe the symptom]

Context:
- Environment: [production / staging / local]
- When it started: [deploy, config change, data event]
- Frequency: [every request / intermittent / under load]
- What I have already checked: [list]

Walk me through root cause isolation step by step.
```

---

### Architecture and documentation

**7. Document a decision at the moment of making it**
```
/adr-writer

Decision: Move from REST to tRPC for internal service communication
Context: We have 4 services sharing TypeScript types. REST is generating drift.
Alternatives considered: GraphQL, gRPC, plain REST with shared types package
Decision: tRPC — same language, zero schema drift, type safety end-to-end
Consequences: Frontend team needs to update, all existing REST clients deprecated

Write the ADR in standard format.
```

**8. Weekly tech debt session**
```
/tech-debt-tracker

Scan the following files/directories for technical debt:
[paste file list or describe the area]

Categorise by:
- Correctness risk (will this break?)
- Velocity drag (is this slowing development?)
- Security exposure
- Maintenance cost

Output a prioritised backlog entry for each item.
```

---

## 30-day ramp plan (engineers new to Claude Code)

### Week 1 — Install and first wins
- Install all skill sets: `npx claudient add skills backend devops-infra productivity`
- Configure GitHub MCP (see tool integrations below)
- Run `/pr-review` on the last 5 merged PRs in your repo — calibrate to your codebase's patterns
- Use `/debug` on the most recent bug you solved manually — see what it would have caught faster
- Use `/code-review` on your next PR before pushing — find at least one issue you would have missed

### Week 2 — Daily workflow integration
- Start every morning with a PR queue scan using `/pr-review`
- Use `/fastapi` or `/next-js` for every new endpoint or page scaffold — no blank-page syndrome
- Write your first ADR with `/adr-writer` — any decision made this week qualifies
- Run `/ship-gate` on your next PR before requesting review

### Week 3 — Deeper automation
- Set up the Sentry hook (see tool integrations below) so bug context arrives in Claude automatically
- Run `/tech-debt-tracker` on the area of the codebase you own
- Use `core/architect` for any design decision involving more than 2 services
- Spawn `build-resolvers/typescript-resolver` for the next TypeScript build error — stop reading red text manually

### Week 4 — Team leverage
- Run `/pr-review` on every PR before approving — post Claude-generated inline comments directly
- Use `core/planner` to break your next epic into a sprint-sized task list
- Schedule a quarterly tech debt session with `/tech-debt-tracker` across the whole repo
- Measure: track PR review time, bug resolution time, and doc coverage before and after

---

## Tool integrations

### GitHub MCP (recommended)

```json
// Add to ~/.claude/settings.json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token-here"
      }
    }
  }
}
```

With this connected, Claude can:
- Read PR diffs, comments, and review threads without copy-pasting
- Post inline review comments directly to GitHub
- Read issue descriptions and link them to code changes
- Check CI status and surface failing test output

### Jira / Linear MCP

```json
// Linear — add to ~/.claude/settings.json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "your-key-here"
      }
    }
  }
}
```

With this connected, Claude can:
- Read ticket descriptions when planning implementation
- Update ticket status and add engineering notes
- Link PRs to issues automatically during `/pr-review` sessions
- Generate sprint summaries from completed tickets

### Sentry hook (automated bug context)

Set up a hook that pipes Sentry alert context into Claude before a `/debug` session:

```json
// Add to .claude/settings.json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "sentry",
        "command": "python .claude/hooks/sentry-context.py"
      }
    ]
  }
}
```

The hook fetches the full Sentry event — stack trace, breadcrumbs, tags, affected users — and prepends it to your `/debug` session automatically. No manual copy-pasting from the Sentry dashboard.

---

## Benchmarks

These are observed outcomes from engineering teams using the full Claudient stack. Individual results vary with codebase complexity and workflow adoption.

| Metric | Before Claude Code | After Claude Code |
|---|---|---|
| PR review time (average) | 35-50 min | 5-8 min |
| Bug resolution time (P2) | 2-4 hours | 25-45 min |
| ADR coverage (decisions documented) | 20-30% | 85-95% |
| Time to scaffold a new endpoint | 20-30 min | 3-5 min |
| Onboarding time (new engineer to first PR) | 5-7 days | 2-3 days |
| Tech debt backlog items identified/quarter | 10-20 (manual) | 60-100 (automated scan) |
| Build error resolution time | 15-30 min | 3-8 min |

---

## Resources

- [Getting started with Claude Code](./getting-started.md)
- [GitHub MCP setup](../mcp/github.md)
- [Jira MCP setup](../mcp/jira.md)
- [Code review workflow](../workflows/code-review.md)
- [ADR writer skill](../skills/productivity/adr-writer.md)
- [RAG architecture skill](../skills/ai-engineering/rag-architect.md)
- [MCP server builder skill](../skills/ai-engineering/mcp-server-builder.md)

---
