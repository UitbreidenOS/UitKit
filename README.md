# Claudient — Skills, Agents & Plugins for Claude Code

> The community-powered knowledge system for Claude Code — for developers, vibe coders, AI builders, GTM teams, and small business owners.

![Claudient](web/public/social-preview.svg)

[![npm](https://img.shields.io/npm/v/claudient)](https://www.npmjs.com/package/claudient)
[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](LICENSE)
[![Skills](https://img.shields.io/badge/skills-80+-orange)](#skills)
[![Agents](https://img.shields.io/badge/agents-13-pink)](#agents)
[![Small Business](https://img.shields.io/badge/small_business-12_skills-06b6d4)](#-claude-for-small-business)
[![Languages](https://img.shields.io/badge/languages-EN%20%7C%20FR%20%7C%20DE%20%7C%20NL%20%7C%20ES-blue)](#translations)
[![Reddit](https://img.shields.io/badge/Reddit-r%2Fuitbreiden-FF4500?logo=reddit&logoColor=white)](https://www.reddit.com/r/uitbreiden/)
[![YouTube](https://img.shields.io/badge/YouTube-%40UITBREIDEN-FF0000?logo=youtube&logoColor=white)](https://www.youtube.com/@UITBREIDEN)

---

## 🏪 Claude for Small Business

> **Not a developer? Claudient has you covered.** These skills are written for business owners — plain English, no terminal commands, works with the tools you already use.

```bash
npx claudient add skills small-business
# Then in Claude Code, just describe what you need in plain English
```

Anthropic launched Claude for Small Business with 15 workflows. Claudient covers the long tail:

| Skill | What it automates | Tools |
|---|---|---|
| `/invoice-chaser` | AR reminders, escalation sequences | QuickBooks, Stripe |
| `/quickbooks-workflow` | Month-end close, reconciliation | QuickBooks |
| `/cash-flow-forecast` | 30-day cash position, payroll runway | QuickBooks, PayPal |
| `/expense-audit` | Subscription creep, duplicate vendors | QuickBooks |
| `/content-repurposer` | 1 brief → blog + social + email + ads | Canva |
| `/campaign-brief` | Marketing brief → multi-channel plan | HubSpot |
| `/review-response` | Google/Yelp review drafts | Google, Yelp |
| `/customer-inquiry` | FAQ responder + after-hours replies | Website, CRM |
| `/shopify-operations` | Product descriptions, inventory alerts | Shopify |
| `/job-description` | Write JD → screen resumes → offers | Google Workspace |
| `/sop-writer` | Standard operating procedures | Any business |
| `/weekly-pulse` | KPI report from all your tools | Multi-tool |

**Works with:** QuickBooks · HubSpot · Shopify · Stripe · PayPal · Canva · DocuSign · Google Workspace · Square

---

## 🤖 C-Suite Advisor Agents

Strategic thinking partners for founders and executives — spawn them with the `Agent` tool:

| Agent | Role |
|---|---|
| `ceo-advisor` | Strategic decisions, board prep, investor relations, org design |
| `cto-advisor` | Architecture decisions, build vs buy, technical strategy |
| `cmo-advisor` | GTM strategy, channel allocation, positioning, demand gen |
| `cfo-advisor` | Unit economics, fundraising prep, cash management, modelling |
| `coo-advisor` | Process design, OKRs, scaling operations, bottleneck removal |
| `cpo-advisor` | Roadmap prioritisation, discovery, pricing, PLG strategy |
| `general-counsel` | Legal risk identification, contract flags, compliance overview |

```bash
npx claudient add agents
```

---

## Who is this for?

- **Developers & vibe coders** — Next.js + Drizzle + Better Auth, Supabase, Railway, Vercel AI SDK
- **AI product builders** — LangGraph, Mastra AI, MCP Server Builder, Claude API
- **GTM & sales teams** — HubSpot, SDR agents, lead enrichment, CRM hygiene
- **Marketing teams** — SEO audits, CRO, email sequences, churn prevention
- **Finance professionals** — DCF models, comps analysis, IC memos, KYC, earnings analysis
- **Legal teams** — NDA review, termination analysis, DSAR response, AI impact assessment
- **Small business owners** — invoicing, cash flow, content, customer service (no code needed)

---

## Quick Start

```bash
# Guided setup (recommended for first time)
npx claudient init

# Install everything
npx claudient add all

# Install by category
npx claudient add skills small-business
npx claudient add skills marketing
npx claudient add skills finance
npx claudient add agents
```

---

## Run Claude at maximum efficiency

```bash
npx claudient add skills productivity
# /lean-claude — activates token-efficient mode in one prompt
```

---

## ⭐ Most Popular Skills

### Vibe Coding Stack
| Skill | What it does |
|---|---|
| [Next.js](skills/backend/nodejs/nextjs.md) | App Router, Server Components, Server Actions |
| [Drizzle ORM](skills/database/drizzle.md) | TypeScript-first, SQL-direct, Neon/Supabase |
| [Better Auth](skills/backend/nodejs/better-auth.md) | Open-source auth, OAuth, 2FA, RBAC |
| [shadcn/ui](skills/backend/nodejs/shadcn.md) | Component library Claude can read and modify |
| [Vercel AI SDK](skills/ai-engineering/vercel-ai-sdk.md) | Streaming AI responses, tool calls, useChat |
| [Railway](skills/devops-infra/railway.md) | 2-minute deploys, PR preview environments |

### Database Layer
| Skill | What it does |
|---|---|
| [Supabase](skills/database/supabase.md) | RLS policies, realtime, auth, storage |
| [Neon](skills/database/neon.md) | Serverless Postgres, DB branching, pgvector |
| [Prisma](skills/database/prisma.md) | Schema, nested writes, transactions, hooks |
| [Redis](skills/database/redis.md) | Caching, sessions, rate limiting, pub/sub |
| [MongoDB](skills/database/mongodb.md) | Aggregation pipeline, Atlas Search |
| [PostgreSQL](skills/database/postgresql.md) | Full-text search, JSONB, pg_notify |

### AI Engineering
| Skill | What it does |
|---|---|
| [LangGraph](skills/ai-engineering/langgraph.md) | Stateful agents, human-in-the-loop, checkpointing |
| [Vercel AI SDK](skills/ai-engineering/vercel-ai-sdk.md) | `useChat`, `streamText`, tool calls, multi-provider |
| [Mastra AI](skills/ai-engineering/mastra.md) | Agents, workflows, memory, RAG, evals |
| [MCP Server Builder](skills/ai-engineering/mcp-server-builder.md) | Connect proprietary data to Claude Code |
| [Claude API](skills/ai-engineering/claude-api.md) | Prompt caching, streaming, tool use, batch |

### GTM & Revenue
| Skill | What it does |
|---|---|
| [HubSpot](skills/gtm/hubspot.md) | CRM automation via official MCP server |
| [SDR Agent](skills/gtm/sdr-agent.md) | AI outreach: research → personalise → book |
| [Lead Enrichment](skills/gtm/lead-enrichment.md) | Web scraping → structured CRM profiles |
| [Email Automation](skills/gtm/email-automation.md) | Multi-touch sequences, reply handling |
| [CRM Hygiene](skills/gtm/crm-hygiene.md) | Dedup, stale records, field enrichment |

### Git Workflow
| Skill | What it does |
|---|---|
| [Commit Writer](skills/git/commit-writer.md) | Conventional commits from staged diff |
| [PR Description](skills/git/pr-description.md) | Structured PRs with checklist |
| [Changelog Generator](skills/git/changelog-generator.md) | Keep a Changelog from git log |

### Marketing
| Skill | What it does |
|---|---|
| [SEO Audit](skills/marketing/seo-audit.md) | Technical SEO, on-page, Core Web Vitals |
| [Page CRO](skills/marketing/page-cro.md) | Landing page audit, A/B hypotheses |
| [Email Sequence](skills/marketing/email-sequence.md) | Welcome series, nurture, re-engagement |
| [Churn Prevention](skills/marketing/churn-prevention.md) | At-risk signals, intervention playbooks |

### Deployment
| Skill | What it does |
|---|---|
| [Railway](skills/devops-infra/railway.md) | Git deploy, managed DBs, PR previews |
| [Coolify](skills/devops-infra/coolify.md) | Self-hosted PaaS on your VPS |
| [Northflank](skills/devops-infra/northflank.md) | Multi-service, secret injection, previews |

### Finance & Legal
| Skill | What it does |
|---|---|
| [DCF Model](skills/finance/dcf-model.md) | WACC, FCF projection, sensitivity table |
| [Comps Analysis](skills/finance/comps-analysis.md) | Trading and transaction comps |
| [IC Memo](skills/finance/ic-memo.md) | 9-section investment committee memo |
| [NDA Review](skills/legal/nda-review.md) | GREEN/YELLOW/RED risk flags |
| [DSAR Response](skills/legal/dsar-response.md) | GDPR/CCPA data request workflow |
| [AI Impact Assessment](skills/legal/ai-impact-assessment.md) | EU AI Act classification |

---

## What's included

| Type | Count | What it does |
|---|---|---|
| **Skills** | **80+** | Slash commands for every major stack and workflow |
| **Agents** | **13** | Core team + C-suite advisors + build resolvers |
| Hooks | 7 | Safety guards, auto-format, cost tracking |
| Rules | 8 | Coding, git, security, testing, language-specific |
| Workflows | 5 | Feature dev, debugging, code review, refactoring |
| Guides | 8 | In-depth docs including CLAUDE.md architecture |
| Prompts | 8 | System prompts, starters, task-specific |

All content in **EN · FR · DE · NL · ES**.

---

## Full Skills by Category

**Categories:** `small-business` · `backend` · `devops-infra` · `data-ml` · `database` · `finance-payments` · `ai-engineering` · `gtm` · `marketing` · `git` · `productivity` · `automation` · `legal` · `finance`

| Category | Skills |
|---|---|
| `small-business` | Invoice Chaser, QuickBooks, Cash Flow, Expense Audit, Content Repurposer, Campaign Brief, Review Response, Customer Inquiry, Shopify, Job Description, SOP Writer, Weekly Pulse |
| `backend/python` | FastAPI, Django, pytest, Python Async, API Design |
| `backend/nodejs` | Next.js, NestJS, React, Vue 3, TypeScript Advanced, Better Auth, shadcn/ui, tRPC, RBAC, Astro, Svelte, Wasp, Payload CMS |
| `backend/go` | Go |
| `backend/dotnet` | C#/.NET |
| `backend/java` | Spring Boot |
| `devops-infra` | Kubernetes, Terraform, Docker, Docker Compose, GitHub Actions, CI/CD, Monorepo, Railway, Coolify, Northflank, Sentry, OpenTelemetry, Feature Flags |
| `data-ml` | Pandas/Polars, PyTorch/TF, dbt, MLflow, Spark, SQL, Data Migration, Synthetic Data |
| `database` | Drizzle ORM, Prisma, PostgreSQL, Supabase, Neon, Redis, MongoDB, GraphQL |
| `finance-payments` | Stripe, Webhook Security |
| `ai-engineering` | Claude API, Vercel AI SDK, LangGraph, Agent Construction, Mastra AI, MCP Server Builder |
| `gtm` | HubSpot, SDR Agent, Lead Enrichment, Email Automation, CRM Hygiene |
| `marketing` | SEO Audit, Page CRO, Email Sequence, Churn Prevention |
| `finance` | DCF Model, Comps Analysis, IC Memo, KYC Screener, Financial Plan, Earnings Analysis, Deal Screening |
| `legal` | Contract Review, NDA Review, Termination Review, DSAR Response, AI Impact Assessment, OSS License Review, Privacy PIA |
| `git` | Commit Writer, PR Description, Changelog Generator |
| `productivity` | Lean Claude, Batch, Env Doctor, README Generator, Test Generator, Security Audit, Code Review, Refactor, Debug, llms.txt, No-Slop |
| `automation` | Browser (Playwright) |

---

## CLI Reference

```bash
npx claudient init                          # interactive guided setup
npx claudient add skills                    # all skills
npx claudient add skills small-business     # business owner skills
npx claudient add skills marketing          # marketing skills
npx claudient add skills finance            # finance skills
npx claudient add agents                    # all agents including advisors
npx claudient add all --lang fr             # everything in French
npx claudient search "churn prevention"     # find skills by name/description
npx claudient list                          # browse all content
```

---

## Agents

```bash
npx claudient add agents
```

**Core agents** — spawn with `subagent_type`:
- **Planner** — decomposes tasks before coding
- **Architect** — system design and structural decisions
- **Code Reviewer** — thorough PR review with security focus
- **Security Reviewer** — OWASP coverage
- **Python Build Resolver** — fixes Python dependency errors
- **TypeScript Build Resolver** — resolves TS compilation failures

**C-Suite Advisors** — strategic thinking partners:
- **CEO Advisor** — strategy, board prep, investor relations
- **CTO Advisor** — architecture, technical strategy
- **CMO Advisor** — GTM, positioning, demand generation
- **CFO Advisor** — unit economics, fundraising, cash management
- **COO Advisor** — process design, OKRs, scaling
- **CPO Advisor** — roadmap, discovery, PLG
- **General Counsel** — legal risk identification

---

## Hooks

| Hook | Event | What it does |
|---|---|---|
| `block-dangerous.sh` | PreToolUse | Blocks destructive commands |
| `git-push-confirm.sh` | PreToolUse | Warns before `git push` |
| `audit-log.sh` | PostToolUse | Logs every tool call |
| `prettier.sh` | PostToolUse | Auto-formats after Write/Edit |
| `cost-tracker.sh` | PostToolUse | Tracks token costs |
| `pre-compact-save.sh` | PreCompact | Saves state before compaction |
| `session-start.sh` | Notification | Prints branch + session notes |

---

## Translations

Every skill, guide, workflow, agent, and prompt in: **EN · FR · DE · NL · ES**

---

## Guides

| Guide | What it covers |
|---|---|
| [Getting Started](guides/getting-started.md) | Setup, first skill, first hook |
| [CLAUDE.md Architecture](guides/claude-md-architecture.md) | Structuring for solo/team/monorepo |
| [Skill Authoring](guides/skill-authoring.md) | Write a skill that actually works |
| [Token Optimization](guides/token-optimization.md) | Model selection, context, cost |
| [Memory Management](guides/memory-management.md) | Session persistence, compaction |
| [Security](guides/security.md) | Isolation, approval, sanitization |
| [Agent Orchestration](guides/agent-orchestration.md) | Subagent patterns |
| [Hooks Cookbook](guides/hooks-cookbook.md) | Hook patterns with examples |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) · [GitHub Discussions](https://github.com/Claudient/Claudient/discussions)

---

## Work With Us

Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products with developer communities.

**[uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)**

---

## License

MIT
