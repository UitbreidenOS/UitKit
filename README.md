# Claudient — The Claude Code Knowledge Base

[![npm version](https://img.shields.io/npm/v/claudient?color=f97316&label=npm)](https://www.npmjs.com/package/claudient)
[![npm downloads](https://img.shields.io/npm/dm/claudient?color=f97316)](https://www.npmjs.com/package/claudient)
[![GitHub Stars](https://img.shields.io/github/stars/Claudient/Claudient?color=f97316&label=stars)](https://github.com/Claudient/Claudient)
[![License: AGPL-3.0](https://img.shields.io/badge/code-AGPL--3.0-3b82f6.svg)](LICENSE-CODE)
[![Content License: CC-BY-SA-4.0](https://img.shields.io/badge/content-CC--BY--SA--4.0-ec4899.svg)](LICENSE-CONTENT)
[![Skills](https://img.shields.io/badge/skills-295+-f97316)](#skills-by-category)
[![Agents](https://img.shields.io/badge/agents-99+-ec4899)](#agents)
[![Claude for Small Business](https://img.shields.io/badge/small_business-30+_skills-06b6d4)](#-claude-for-small-business)
[![MCP](https://img.shields.io/badge/MCP_configs-31+-8b5cf6)](#top-100-mcp-servers)
[![Languages](https://img.shields.io/badge/languages-EN%20FR%20DE%20NL%20ES-3b82f6)](#translations)
[![Reddit](https://img.shields.io/badge/Reddit-r%2Fuitbreiden-FF4500?logo=reddit&logoColor=white)](https://www.reddit.com/r/uitbreiden/)
[![YouTube](https://img.shields.io/badge/YouTube-%40UITBREIDEN-FF0000?logo=youtube&logoColor=white)](https://www.youtube.com/@UITBREIDEN)

**Stop explaining your stack to Claude every session.**

Claudient is the largest open-source knowledge base for **Claude Code** — 295+ skills, 99+ specialist agents, 31 MCP server configs, 64 guides, 31 hooks, and 23 workflows, all installable in 30 seconds. Skills activate automatically based on what you're working on. Agents spawn when their expertise is needed. Hooks run on the right events. Works with any Claude Code project, in 5 languages. Including the most complete community knowledge base for **Claude for Small Business** — 30+ vertical and operator skills for solopreneurs, ecommerce, local services, coaches, and creators.

```bash
npx claudient add all
```

<img width="800" height="450" alt="hero11" src="https://github.com/user-attachments/assets/8f15589d-4f59-4c1f-991f-166170d00cc8" />




---

## Why Claudient?

| Problem | Without Claudient | With Claudient |
|---|---|---|
| **Domain context** | Re-explain your stack every session | Skills activate automatically |
| **Specialist tasks** | Claude guesses at best practices | 99+ expert agents with scoped tools |
| **Tool integrations** | Manual copy-paste between tools | 31 MCP server configs ready to install |
| **Event automation** | Manual triggers, forgotten steps | 31 hooks that fire on the right events |
| **Team / language** | English only, one-size config | 5 languages, composable per project |
| **Small business** | Generic AI advice | 30+ vertical skills for real workflows |

**One command gives Claude instant expertise across every domain you work in.**

---

## Who Is This For?

| You are... | You get... |
|---|---|
| **Developer / vibe coder** | Skills for Next.js, FastAPI, Rust, Go, Drizzle, tRPC, Docker, k8s, Terraform, and 200+ more stacks — activate with a slash command |
| **AI product builder** | RAG Architect, LangGraph, Prompt Engineering, LLM Eval, MCP Server Builder, Claude API patterns with prompt caching |
| **GTM / RevOps engineer** | HubSpot MCP, SDR Agent, Lead Enrichment, CRM Hygiene, Email Automation, Deal Desk |
| **Finance / Legal professional** | DCF models, 3-statement models, IC memos, contract review, GDPR, SOC 2, EU AI Act — with mandatory human review gates |
| **Small business owner** | Plain-English skills for invoicing, cash flow, Shopify, reviews, SOPs — no terminal required |
| **DevOps / Platform team** | SLO design, chaos engineering, Helm, Kubernetes, Terraform, SRE runbooks, cost tracking |

---

## 🎯 Profession Packs

25 profession-specific packs — pre-wired skill stacks, agents, workflows, and daily routines for each role.

| Profession | Install | Guide |
|---|---|---|
| SDR / Sales Rep | `npx claudient add skill gtm/sdr-research-brief` | [Guide](guides/for-sdr.md) |
| Founder / CEO | `npx claudient add skill gtm/founder-operating-system` | [Guide](guides/for-founder.md) |
| Product Manager | `npx claudient add skill product/product-discovery` | [Guide](guides/for-product-manager.md) |
| DevOps / Platform Engineer | `npx claudient add skill devops-infra/kubernetes-architect` | [Guide](guides/for-devops-engineer.md) |
| Content Marketer / SEO | `npx claudient add skill marketing/seo-audit` | [Guide](guides/for-content-marketer.md) |
| Finance Analyst / CFO | `npx claudient add skill finance/dcf-model` | [Guide](guides/for-finance-analyst.md) |
| Legal / Compliance Officer | `npx claudient add skill legal/contract-review` | [Guide](guides/for-legal-compliance.md) |
| Growth Hacker / Performance Marketer | `npx claudient add skill marketing/paid-ads` | [Guide](guides/for-growth-marketer.md) |
| Customer Success Manager | `npx claudient add skill gtm/customer-success` | [Guide](guides/for-customer-success.md) |
| Recruiter / HR | `npx claudient add skill small-business/hiring-pipeline` | [Guide](guides/for-recruiter.md) |
| UX Designer / Researcher | `npx claudient add skill product/ux-research` | [Guide](guides/for-ux-designer.md) |
| Technical Writer | `npx claudient add skill productivity/adr-writer` | [Guide](guides/for-technical-writer.md) |
| Account Executive | `npx claudient add skill gtm/deal-desk` | [Guide](guides/for-account-executive.md) |
| Operations Manager / COO | `npx claudient add skill small-business/sop-writer` | [Guide](guides/for-operations-manager.md) |
| Email Marketer | `npx claudient add skill gtm/email-automation` | [Guide](guides/for-email-marketer.md) |
| E-commerce Operator | `npx claudient add skill small-business/ecommerce-seller` | [Guide](guides/for-ecommerce-operator.md) |
| CTO / Tech Lead | `npx claudient add skill productivity/tech-debt-tracker` | [Guide](guides/for-cto.md) |
| Real Estate Agent | `npx claudient add skill small-business/real-estate-listing` | [Guide](guides/for-real-estate-agent.md) |
| Investor / VC Analyst | `npx claudient add skill finance/ic-memo` | [Guide](guides/for-investor.md) |
| Data Analyst / BI Analyst | `npx claudient add skill data-ml/dbt` | [Guide](guides/for-data-analyst.md) |
| Freelancer / Consultant | `npx claudient add skill small-business/freelancer-proposal` | [Guide](guides/for-freelancer.md) |
| Executive Assistant / Chief of Staff | `npx claudient add skill productivity/meeting-to-action` | [Guide](guides/for-executive-assistant.md) |
| Educator / Course Creator | `npx claudient add skill small-business/online-course-creator` | [Guide](guides/for-educator.md) |
| Software Engineer | `npx claudient add skills backend` | uses existing skills — no dedicated guide yet |
| Healthcare Admin | `npx claudient add skills small-business` | uses existing skills — no dedicated guide yet |

Each pack includes: domain-specific slash commands, a curated agent roster, a daily workflow, a 30-day ramp plan, and tool integration configs.

---

## ⚡ Quick Start

```bash
# Install everything
npx claudient add all

# Install by domain
npx claudient add skills backend          # 80+ backend skills
npx claudient add skills devops-infra     # Kubernetes, Terraform, Docker, CI/CD
npx claudient add skills ai-engineering   # RAG, LangGraph, Claude API, MCP builder
npx claudient add skills legal            # GDPR, SOC 2, contracts, NDA review
npx claudient add skills finance          # DCF, 3-statement model, pitch deck
npx claudient add skills small-business   # Invoice chaser, cash flow, Shopify

# Install agents
npx claudient add agents                  # All 99+ specialist agents

# Install in your language
npx claudient add all --lang fr           # French
npx claudient add all --lang de           # German
npx claudient add all --lang nl           # Dutch
npx claudient add all --lang es           # Spanish

# Discover
npx claudient search "circuit breaker"
npx claudient list
```

---

## 🔥 Most Popular Right Now

| Skill / Agent | What it does | Category |
|---|---|---|
| `/nextjs-app` | Next.js App Router, Server Components, Server Actions, Drizzle | Backend |
| `/fastapi` | Production FastAPI with auth, Pydantic, async, tests, Docker | Backend |
| `/sre-engineer` | SLO design, error budgets, burn rate alerts, runbooks | Agent |
| `/security-audit` | OWASP Top 10 scan, secret exposure check before every PR | Agent |
| `/invoice-chaser` | Automated AR reminders and payment escalation (no code needed) | Small Business |
| `/hubspot` | CRM automation via the official HubSpot MCP server | GTM |
| `/rag-architect` | Chunking strategy, embeddings, retrieval, reranking, eval | AI Engineering |
| `/kubernetes-architect` | K8s manifests, Helm charts, HPA, NetworkPolicy, RBAC | DevOps |

---

## 🔌 Top 100 MCP Servers for Indie Builders

> **The fastest way to extend Claude Code.** MCP servers give Claude direct access to your tools — GitHub, Figma, Stripe, Jira, Notion, Slack, and 94 more.

**The indie builder starter stack:**

| Server | What it does | Monthly searches |
|--------|-------------|-----------------|
| [Playwright MCP](mcp/playwright-mcp.md) | Browser automation — navigate, click, screenshot, scrape | 82K |
| [Figma MCP](mcp/figma.md) | Read designs, extract tokens, generate components from specs | 74K |
| [GitHub MCP](mcp/github.md) | Read PRs, create issues, search code, manage releases | 69K |
| [Atlassian MCP](mcp/atlassian.md) | Jira tickets, Confluence docs, sprint management | 40K |
| [Memory MCP](mcp/memory.md) | Persistent knowledge graph across Claude Code sessions | — |
| [Stripe MCP](mcp/stripe.md) | Query customers, subscriptions, payments, churn data | — |
| [Notion MCP](mcp/notion.md) | Read/write pages, query databases, create docs | — |
| [Taskmaster MCP](mcp/taskmaster.md) | AI task management with context isolation across sessions | — |

**→ [Full guide: Top 100 MCP Servers for Indie Builders](mcp/top-mcp-servers.md)** — installation configs, tier rankings, and curated bundles for every stack.

```bash
npx claudient add mcp starter   # GitHub + Memory + Playwright
npx claudient add mcp all       # All 31 individual config guides
```

---

## 🏪 Claude for Small Business

> **The most complete community knowledge base for using Claude in a small business.** Plain English skills, no terminal required, written for owners who already pay for QuickBooks, Shopify, HubSpot, and the rest. Claudient extends Anthropic's official [Claude for Small Business](guides/claude-for-small-business.md) launch with 30+ skills covering the long tail of verticals and workflows.

```bash
npx claudient add skills small-business
```

### Claude for Small Business by Vertical

Each guide is an end-to-end landing page for a specific industry — setup, skill stack, 30/60/90 expectations, FAQ.

| You are a... | Start here |
|---|---|
| **Solopreneur, solo founder, side-hustler** | [Claude for Solopreneurs](guides/claude-for-solopreneurs.md) |
| **Shopify, Amazon, Etsy, or DTC seller** | [Claude for Ecommerce](guides/claude-for-ecommerce.md) |
| **Trades, salon, dental, fitness, restaurant, real estate operator** | [Claude for Local Services](guides/claude-for-local-services.md) |
| **Executive coach, business consultant, fractional advisor** | [Claude for Coaches and Consultants](guides/claude-for-coaches-consultants.md) |
| **Newsletter writer, podcaster, course creator** | [Claude for Creators](guides/claude-for-creators.md) |
| **First-time, want the full overview** | [Claude for Small Business — Product Guide](guides/claude-for-small-business.md) |

### Top Small Business Skills

| Skill | Automates | Works with |
|---|---|---|
| `/invoice-chaser` | AR reminders, payment escalation | QuickBooks, Stripe |
| `/quickbooks-workflow` | Month-end close, reconciliation | QuickBooks |
| `/cash-flow-forecast` | 30-day cash position, payroll runway | QuickBooks, PayPal |
| `/expense-audit` | Subscription creep, duplicate vendors | QuickBooks |
| `/content-repurposer` | 1 brief → blog + social + email + ads | Canva |
| `/review-response` | Google/Yelp review management | Google, Yelp |
| `/customer-inquiry` | FAQ responder, after-hours replies | Website, CRM |
| `/shopify-operations` | Product descriptions, inventory alerts | Shopify |
| `/sop-writer` | Standard operating procedures | Any business |
| `/weekly-pulse` | KPI dashboard from all your tools | Multi-tool |

### Vertical-Specific Skills

| Vertical | Skill |
|---|---|
| Ecommerce (multi-platform) | [`/ecommerce-seller`](skills/small-business/ecommerce-seller.md) |
| Salon, spa, barbershop | [`/salon-spa-ops`](skills/small-business/salon-spa-ops.md) |
| Dental practice | [`/dental-practice`](skills/small-business/dental-practice.md) |
| Fitness studio, gym | [`/fitness-gym-ops`](skills/small-business/fitness-gym-ops.md) |
| Coaching practice | [`/coaching-business`](skills/small-business/coaching-business.md) |
| Online course | [`/online-course-creator`](skills/small-business/online-course-creator.md) |
| Newsletter | [`/newsletter-publisher`](skills/small-business/newsletter-publisher.md) |
| Marketing/creative agency | [`/agency-operations`](skills/small-business/agency-operations.md) |
| Trades (plumbing, HVAC, electrical) | [`/contractor-trades`](skills/small-business/contractor-trades.md) |
| Photography studio | [`/photography-studio`](skills/small-business/photography-studio.md) |
| Bookkeeping firm | [`/bookkeeper-practice`](skills/small-business/bookkeeper-practice.md) |
| Podcast | [`/podcast-monetizer`](skills/small-business/podcast-monetizer.md) |
| Real estate | [`/real-estate-listing`](skills/small-business/real-estate-listing.md) |
| Restaurant | [`/restaurant-ops`](skills/small-business/restaurant-ops.md) |

### Operator Skills (Cross-Cutting)

| Skill | Use case |
|---|---|
| [`/hiring-pipeline`](skills/small-business/hiring-pipeline.md) | Structured screening for high-volume applicant flow |
| [`/churn-prevention`](skills/small-business/churn-prevention.md) | At-risk identification and recovery for subscription businesses |
| [`/pricing-optimizer`](skills/small-business/pricing-optimizer.md) | Structured price review, migration plan, A/B test design |
| [`/freelancer-proposal`](skills/small-business/freelancer-proposal.md) | Discovery call → branded proposal in 20 minutes |
| [`/lead-triager`](skills/small-business/lead-triager.md) | ICP scoring on new contacts, prioritized call list |
| [`/meeting-to-action`](skills/small-business/meeting-to-action.md) | Transcript → action list + follow-up email |
| [`/customer-feedback-synthesizer`](skills/small-business/customer-feedback-synthesizer.md) | Pattern detection across 100+ reviews |
| [`/competitor-monitor`](skills/small-business/competitor-monitor.md) | What your 3 closest competitors shipped this month |
| [`/margin-analyzer`](skills/small-business/margin-analyzer.md) | Gross margin by product, channel, customer |
| [`/tax-organizer`](skills/small-business/tax-organizer.md) | CPA packet from QuickBooks and receipt folder |

### Specialist Agents for Small Business

- [`small-business-advisor`](agents/specialists/small-business-advisor.md) — generalist diagnosis and workflow prioritization
- [`ecommerce-specialist`](agents/specialists/ecommerce-specialist.md) — for Shopify/Amazon/Etsy/DTC operators
- [`local-services-specialist`](agents/specialists/local-services-specialist.md) — for trades, salon, dental, fitness, restaurant, real estate
- [`restaurant-specialist`](agents/roles/restaurant-specialist.md) — restaurant-specific operations
- [`real-estate-specialist`](agents/roles/real-estate-specialist.md) — real estate agent and brokerage operations

```bash
npx claudient add agents small-business
```

---

## ❓ FAQ — Claude for Small Business

### What is Claude for Small Business?

Claude for Small Business is Anthropic's small-business-focused product layer inside Claude Cowork, launched May 13, 2026, with 15 official workflows. Claudient is the community knowledge base that extends those workflows with 30+ additional skills covering the long tail of verticals (dental, salon, trades, photography, coaching, ecommerce) and operator workflows (hiring, churn, pricing, proposals). [Read the product guide](guides/claude-for-small-business.md).

### Is Claude good for small business owners?

Yes. Owners running 1-50 person businesses typically save 6-12 hours per week within 30 days, on the mechanical work that previously filled their evenings — invoicing, lead follow-up, weekly reporting, content repurposing, customer FAQs. The Claudient skills are written operator-first, no terminal required.

### How is Claude different from ChatGPT for small business?

ChatGPT is a generalist chat assistant. Claude for Small Business connects to your actual business tools — QuickBooks, HubSpot, PayPal, Google Workspace, Shopify — and produces outputs grounded in your real data. ChatGPT can write a generic invoice reminder; Claude reads your actual AR aging report and drafts personalized reminders by invoice. The difference compounds across every workflow.

### How much does Claude cost for a small business?

$20/month for Claude Pro covers most solo owners and small operations. $30/seat/month for Claude Team if you have a partner, office manager, or assistant using the workflows. $100/month for Claude Max if you run 6+ workflows daily on large datasets. Everything else — QuickBooks, HubSpot, Shopify — you already pay for.

### Do I need to know how to code?

No. The official Claude for Small Business workflows are point-and-click inside Claude Cowork. The Claudient skills in this repo are activated by typing plain English to Claude. The only setup is OAuth-connecting your existing tools, which takes a few clicks per tool.

### Can Claude read my QuickBooks data?

Yes, once you authorize the QuickBooks Online integration via OAuth. Claude reads your invoices, transactions, customers, and reports at the moment a workflow runs. It does not poll your account in the background, and Anthropic does not use connected business data to train Claude.

### Can Claude replace my bookkeeper or CPA?

No, and you shouldn't want it to. Claude prepares the reconciliation, organizes the receipts, and drafts the P&L. Your bookkeeper or CPA reviews and signs off. The combined cost is lower than a bookkeeper alone, and the turnaround is faster.

### Does Claude work with Shopify?

Yes, via the official Shopify MCP. The [Shopify Operations skill](skills/small-business/shopify-operations.md) and the [Ecommerce Seller skill](skills/small-business/ecommerce-seller.md) cover product descriptions, inventory alerts, SEO titles, collection updates, and cross-platform listing work.

### Does Claude work with HubSpot?

Yes, via the official HubSpot MCP. [Lead Triager](skills/small-business/lead-triager.md), [Cold Outreach](skills/small-business/cold-outreach.md), and [Email Campaign](skills/small-business/email-campaign.md) all read from and write to HubSpot via the integration.

### How do I get started?

Run `npx claudient add skills small-business` to install every small-business skill into your Claude Code environment. Then start with one workflow — [Invoice Chaser](skills/small-business/invoice-chaser.md) is the highest-ROI starting point for most businesses — and review the output carefully on the first run.

### Is Claude for Small Business worth it?

For businesses where the owner spends 6+ hours per week on the activities Claude covers (invoicing, lead follow-up, reporting, content, customer FAQs, vertical operations), yes — typically a 3-5x ROI within 60 days. For businesses already running tight automated stacks, the marginal return is smaller. Read the [ROI guide](guides/small-business-roi.md) for the calculator and benchmark data.

### What if I'm not using any of these tools?

The Claudient skills run on copy-paste data when a direct integration isn't available. You lose some of the workflow automation but keep the structured drafting, scoring, and analysis. For example, [Review Response](skills/small-business/review-response.md) works on Google reviews you paste in, even without a Google integration.

---

## 🤖 99+ Agents

Specialist agents spawned with the `Agent` tool in Claude Code. Each has a specific model, tool restrictions, and trigger conditions so Claude delegates the right work to the right expert.

### C-Suite Advisors (15 agents)

| Agent | Domain |
|---|---|
| `ceo-advisor` | Strategy, board prep, investor relations, org design |
| `cto-advisor` | Architecture decisions, build vs buy, technical strategy |
| `cfo-advisor` | Unit economics, fundraising, cash management, modelling |
| `cmo-advisor` | GTM strategy, channel allocation, positioning, demand gen |
| `ciso-advisor` | Security programme design, risk prioritisation, board reporting |
| `coo-advisor` | Process design, OKRs, scaling operations |
| `cpo-advisor` | Roadmap, discovery, pricing, PLG strategy |
| `cro-advisor` | Revenue forecasting, NRR analysis, sales model design |
| `general-counsel` | Legal risk, contract review, compliance overview |
| `chief-of-staff` | Operating rhythm, OKR facilitation, CEO leverage |
| + 5 more | CDO, CAIO, VPE, CHRO, CCO |

### Engineering Specialists

`sre-engineer` · `chaos-engineer` · `penetration-tester` · `kubernetes-architect` · `security-auditor` · `platform-engineer` · `network-engineer` · `rust-engineer` · `mlops-engineer` · `graphql-architect` · `websocket-engineer` · `fullstack-developer` · `llm-architect` · `codebase-orchestrator` · `multi-agent-coordinator` + 30 more

### Domain Specialists

`competitive-analyst` · `market-researcher` · `trend-analyst` · `quant-analyst` · `fintech-engineer` · `healthcare-admin` · `legal-advisor` · `nlp-engineer` · `data-pipeline-architect` + more

```bash
npx claudient add agents
```

---

## 📦 Skills by Category

**295+ skills · 15 categories · EN · FR · DE · NL · ES**

| Category | Count | Top skills |
|---|---|---|
| `backend/nodejs` | 20+ | Next.js, Hono, NestJS, tRPC, Astro, Svelte, React Native, Angular, WebSockets |
| `backend/python` | 5 | FastAPI, Django, pytest, Python Async |
| `backend/other` | 8 | Go, C#/.NET, Spring Boot, Rust, Rails, Laravel, Elixir, Flutter |
| `devops-infra` | 34 | AWS/Azure/GCP, Kubernetes, Helm, Terraform, Terragrunt, Docker, GitHub Actions, Sentry, OpenTelemetry |
| `ai-engineering` | 17 | Claude API, Vercel AI SDK, LangGraph, RAG Architect, Prompt Caching, Batch API, MCP Builder |
| `data-ml` | 12 | dbt, Spark, Kafka, MLOps, NLP Pipelines, Reinforcement Learning, Pandas/Polars, PyTorch |
| `database` | 12 | Drizzle, Prisma, PostgreSQL, Supabase, Neon, Redis, Elasticsearch, Blockchain/Solidity |
| `gtm` | 12 | HubSpot, SDR Agent, Lead Enrichment, Email Automation, CRM Hygiene, Deal Desk, Revenue Ops |
| `legal` | 19 | Contract Review, NDA, DSAR, GDPR, SOC 2, EU AI Act, ISO 27001, IP Clearance, Privacy PIA |
| `finance` | 12 | DCF Model, 3-Statement Model, IC Memo, Pitch Deck, KYC Screener, GL Reconciler |
| `marketing` | 16 | SEO Audit, AI SEO, Programmatic SEO, Paid Ads, Content Strategy, CRO, Copywriting |
| `product` | 10 | Product Discovery, Experiment Designer, Competitive Teardown, UX Research, Roadmap |
| `productivity` | 50 | Ship Gate, PR Review, ADR Writer, Tech Debt Tracker, Context Engineering, TDD Guard |
| `small-business` | 41 | Invoice Chaser, QuickBooks, Cash Flow, Shopify, SOP Writer, Review Response, Dental Practice, Salon-Spa, Fitness Gym, Contractor Trades, Coaching, Newsletter, Online Course, Agency Operations, Hiring Pipeline, Churn Prevention, Pricing Optimizer |
| `automation` | 14 | Playwright Pro, Browser Automation, Remotion, SaaS Scaffolder, Office Docs |

---

## 🪝 31 Hooks

Event-driven automation for Claude Code — runs outside Claude's context as real shell processes on the right lifecycle events.

| Hook | Event | What it does |
|---|---|---|
| `secret-scanner` | PreToolUse | Blocks writes containing API keys or credentials |
| `tdd-guard` | PostToolUse | Blocks implementation files without a matching test |
| `injection-scanner` | PreToolUse | Scans tool inputs for prompt injection attempts |
| `plannotator` | ExitPlanMode | Interactive plan annotation before Claude executes |
| `lint-check` | PostToolUse | Auto-lints TypeScript/Python after every file edit |
| `test-runner` | PostToolUse | Runs related tests after editing a source file |
| `telegram-pr-notify` | PostToolUse | Sends Telegram message when a PR is created |
| `keepalive-poke` | Stop | Continues autonomous sessions without intervention |
| `sound-system` | All events | Platform-native sounds for 27 Claude Code events |
| `session-context-loader` | SessionStart | Injects date, branch, recent commits at session start |
| `ntfy-push` | Notification | Mobile push alerts via ntfy |
| `tts-announcer` | Stop | Speaks Claude's final message aloud |
| + 19 more | — | Auto-stage git, transcript backup, output compressor, bug logger, Slack notifier, WhatsApp gate... |

---

## 📖 Guides & Workflows

### Guides (64+)

[Getting Started](guides/getting-started.md) · [Agent Frontmatter Reference](guides/agent-frontmatter.md) · [Skills Frontmatter Reference](guides/skills-frontmatter.md) · [Decision Framework](guides/decision-framework.md) · [Claude Managed Agents](guides/claude-managed-agents.md) · [Advanced Tool Use](guides/advanced-tool-use.md) · [Voice Dictation](guides/voice-dictation.md) · [Desktop App](guides/desktop-app.md) · [Opus 4.7 Migration](guides/opus-47-migration.md) · [Hooks Cookbook](guides/hooks-cookbook.md) · [Multi-Agent Patterns](guides/multi-agent-patterns.md) · [Subagent Patterns](guides/subagent-patterns.md) · [Context Management](guides/context-management.md) · [Token Cost Reduction](guides/token-cost-reduction.md) · [Notifications Setup](guides/notifications-setup.md) · [Plugin Authoring](guides/plugin-authoring.md) · [RIPER Framework](guides/riper-framework.md) · [RPI Workflow](guides/rpi-workflow.md) · [CLI Reference](guides/cli-reference.md) · [Settings Scope](guides/settings-scope.md) · [Why Use Claude Code](guides/why-use-claude-code.md) · [Routines](guides/routines.md) · [Computer Use](guides/computer-use.md) · [Ultraplan](guides/ultraplan.md) · [Auto Mode](guides/auto-mode.md) + 39 more

### Workflows (23+)

[RPI Feature Development](workflows/rpi-feature.md) · [RIPER](workflows/riper.md) · [Incremental Build](workflows/incremental-build.md) · [Pre-Human Review](workflows/pre-human-review.md) · [Autonomous Loop](workflows/autonomous-loop.md) · [Worktree Lifecycle](workflows/worktree-lifecycle.md) · [Multi-Agent Saga](workflows/multi-agent-saga.md) · [Chaos Game Day](workflows/chaos-game-day.md) · [Error Budget](workflows/error-budget.md) · [Bug Investigation](workflows/bug-investigation.md) · [Compound Engineering](workflows/compound-engineering.md) · [Session Learning](workflows/session-learning.md) + more

---

## 📊 What's Included

| Type | Count |
|---|---|
| **Skills** | **295+** |
| **Agents** | **99+** |
| **Hooks** | **31+** |
| **MCP config guides** | **31+** |
| **Guides** | **64+** |
| **Workflows** | **23+** |
| **Prompts** | **31+** |
| **Rules** | **12** |
| **Languages** | **5 (EN · FR · DE · NL · ES)** |

---

## 🌍 5 Languages

Every skill, agent, guide, workflow, and prompt is available in:

**🇬🇧 English · 🇫🇷 French · 🇩🇪 German · 🇳🇱 Dutch · 🇪🇸 Spanish**

```bash
npx claudient add all --lang fr   # French
npx claudient add all --lang de   # German
npx claudient add all --lang nl   # Dutch
npx claudient add all --lang es   # Spanish
```

---

## 🤝 Add Your Skill — Get Featured

Claudient is community-powered. Every skill lives in one markdown file. Contributing a Claude Code skill takes less time than filing a GitHub issue.

1. Read the [Skill Authoring Guide](guides/skill-authoring.md) — 5 minutes
2. Fork, add your skill in one `.md` file
3. Submit a PR — merged skills get featured in **Most Popular**

**[GitHub Discussions](https://github.com/Claudient/Claudient/discussions) · [CONTRIBUTING.md](CONTRIBUTING.md) · [Reddit](https://www.reddit.com/r/uitbreiden/)**

---

## Built by Uitbreiden

Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — building AI products and B2B tools with developer communities.

[![Reddit](https://img.shields.io/badge/Reddit-r%2Fuitbreiden-FF4500?logo=reddit&logoColor=white)](https://www.reddit.com/r/uitbreiden/)
[![YouTube](https://img.shields.io/badge/YouTube-%40UITBREIDEN-FF0000?logo=youtube&logoColor=white)](https://www.youtube.com/@UITBREIDEN)
[![Website](https://img.shields.io/badge/Website-uitbreiden.com-f97316)](https://uitbreiden.com/)

---

## License

Dual licensed:

- **Code** — [AGPL-3.0](LICENSE-CODE). The Astro site, hook scripts, npm package source, anything executable.
- **Content** — [CC-BY-SA-4.0](LICENSE-CONTENT). All markdown skills, agents, hooks, MCP configs, workflows, guides, prompts, rules, and documentation.

See [LICENSE](LICENSE) for the rationale and full details. For commercial licensing inquiries, write to [hello@uitbreiden.com](mailto:hello@uitbreiden.com).

© 2026 [Uitbreiden](https://uitbreiden.com/) · Tushar Aggarwal
