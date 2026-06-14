# Claude Code Skills, Agents & Plugins — Claudient

**Claudient** is the largest open-source knowledge base for **Claude Code** — Anthropic's AI coding CLI. It ships 384+ domain skills, 182+ specialist agents, 43 pre-wired workspace stacks, 40 MCP configs, 100+ slash commands, hooks, and workflows, all installable in 30 seconds. No stack re-explaining. Claude already knows your domain.

**New to Claude Code?** Claude Code is Anthropic's official command-line AI assistant for software development — it reads your codebase, runs commands, edits files, and completes tasks autonomously inside your terminal or IDE. Claudient is the open-source community library that extends it with expert-level skills across every stack and domain.

[![npm version](https://img.shields.io/npm/v/claudient?color=f97316&label=npm)](https://www.npmjs.com/package/claudient)
[![npm downloads](https://img.shields.io/npm/dm/claudient?color=f97316)](https://www.npmjs.com/package/claudient)
[![GitHub Stars](https://img.shields.io/github/stars/Claudient/Claudient?color=f97316&label=stars)](https://github.com/Claudient/Claudient)
[![License: AGPL-3.0](https://img.shields.io/badge/code-AGPL--3.0-3b82f6.svg)](LICENSE-CODE)
[![Content License: CC-BY-SA-4.0](https://img.shields.io/badge/content-CC--BY--SA--4.0-ec4899.svg)](LICENSE-CONTENT)
[![Skills](https://img.shields.io/badge/skills-384+-f97316)](#skills-by-category)
[![Agents](https://img.shields.io/badge/agents-182+-ec4899)](#agents)
[![Commands](https://img.shields.io/badge/commands-100+-a855f7)](#slash-commands)
[![Plugins](https://img.shields.io/badge/plugin_marketplace-19_plugins-22c55e)](#install-as-a-claude-code-plugin)
[![Claude for Small Business](https://img.shields.io/badge/small_business-30+_skills-06b6d4)](#claude-for-small-business)
[![MCP](https://img.shields.io/badge/MCP_configs-40-8b5cf6)](#top-100-mcp-servers)
[![Languages](https://img.shields.io/badge/languages-EN%20FR%20DE%20NL%20ES-3b82f6)](#translations)
[![Reddit](https://img.shields.io/badge/Reddit-r%2Fuitbreiden-FF4500?logo=reddit&logoColor=white)](https://www.reddit.com/r/uitbreiden/)
[![YouTube](https://img.shields.io/badge/YouTube-%40UITBREIDEN-FF0000?logo=youtube&logoColor=white)](https://www.youtube.com/@UITBREIDEN)

**Stop explaining your stack to Claude every session.**

Claudient is the largest open-source knowledge base for **Claude Code** — 384+ skills, 182+ specialist agents, 100+ slash commands, 100+ guides, 40 hooks, 45 workflows, 83 project structures, 43 workspace stacks, 10 personas, 32 rules, 40 MCP server configs, 10 automation routines, 20 annotated CLAUDE.md examples, cross-harness adapters (Cursor/Windsurf/Codex/Gemini/Copilot), plus output styles, themes, statuslines, keybindings, settings templates, and an Agent SDK pack — all installable in 30 seconds.

```bash
# Install as a Claude Code plugin marketplace (recommended)
/plugin marketplace add Claudient/Claudient
/plugin install claudient-everything@claudient

# Or via npm
npx claudient add all
```

<img width="800" height="450" alt="hero11" src="https://github.com/user-attachments/assets/8f15589d-4f59-4c1f-991f-166170d00cc8" />




---

## Install as a Claude Code plugin

Claudient ships as a native Claude Code **plugin marketplace**. Add it once, then install only the domains you need — skills auto-invoke based on what you're working on, agents and hooks come bundled.

```bash
# 1. Add the marketplace
/plugin marketplace add Claudient/Claudient

# 2. Install a domain plugin (or the everything bundle)
/plugin install claudient-gtm@claudient
/plugin install claudient-devops-infra@claudient
/plugin install claudient-everything@claudient
```

**19 plugins, 380+ auto-invoking skills, 182 agents, 100 slash commands:**

| Plugin | Skills | Plugin | Skills |
|---|---|---|---|
| `claudient-productivity` | 66 | `claudient-finance` | 16 |
| `claudient-small-business` | 47 | `claudient-data-ml` | 15 |
| `claudient-backend` | 41 | `claudient-product` | 15 |
| `claudient-devops-infra` | 36 | `claudient-automation` | 14 |
| `claudient-gtm` | 32 | `claudient-database` | 12 |
| `claudient-marketing` | 22 | `claudient-git` | 3 |
| `claudient-legal` | 21 | `claudient-commands` | 100 commands |
| `claudient-sdr` | 22 | `claudient-personas` | 10 personas |
| `claudient-ai-engineering` | 17 | `claudient-finance-payments` | 2 |
| `claudient-everything` | meta-bundle | | |

Every skill is validated with `claude plugin validate --strict`. Prefer npm? `npx claudient add all` still works.

---

## Beyond skills — the full Claude Code toolkit

Claudient covers every primitive Claude Code supports, not just skills:

| Category | What's inside | Install |
|---|---|---|
| **Slash commands** | 100+ commands across 12 categories — git, testing, refactor, docs, debug, devops, database, security, frontend, api, ai-engineering, productivity | `claudient-commands` plugin or `commands/` dir |
| **Personas** | 10 operating profiles — startup-cto, solo-founder, growth-marketer, indie-hacker, enterprise-architect, data-driven-pm, devrel-advocate, agency-operator, ai-product-builder, fractional-exec | `claudient-personas` plugin or `personas/` dir |
| **Output styles** | 8 styles — concise, mentor, code-reviewer, architect, plain-operator, security-paranoid, diagram-first, tdd-enforcer | copy to `~/.claude/output-styles/` |
| **Themes** | 10 themes — Dracula, Nord, Tokyo Night, Catppuccin, Gruvbox, Solarized, Monokai, Rosé Pine, + Claudient brand | copy to `~/.claude/themes/`, then `/theme` |
| **Statuslines** | 6 scripts — minimal, full, cost-watch, context-budget, git-focused, rate-limit | point `settings.json` `statusLine` at them |
| **Keybindings** | 4 presets — vim, emacs, ergonomic, power-user | merge into `~/.claude/keybindings.json` |
| **Settings templates** | 5 starters — solo-dev, team, security-hardened, enterprise, minimal | drop into `.claude/settings.json` |
| **Hooks** | 40 across all 2026 events — including new `http`, `prompt`, and `agent` hook types | see [`hooks/`](hooks/) |
| **Routines** | 10 scheduled cloud-agent templates — daily-standup, pr-triage, dependency-audit, incident-watch, weekly-retro, sprint-planning, code-review-rotation, security-scan, changelog-generator, cost-audit | see [`routines/`](routines/) |
| **Computer-use skills** | 4 — ui-testing, visual-qa, legacy-app-automation, screenshot-verify | `/plugin install` or copy |
| **CLAUDE.md gallery** | 20 annotated real-world templates — Next.js SaaS, FastAPI, monorepo, CLI tool, dbt, mobile, OSS library, k8s, small business, legal, fintech, game dev, embedded, and more | see [`claude-md-examples/`](claude-md-examples/) |
| **Cross-harness adapters** | Use Claudient in Cursor, Windsurf, Codex CLI, Gemini Code Assist, GitHub Copilot — adapter guides + install script | see [`compatibility/`](compatibility/) |
| **Agent SDK pack** | Full guide + runnable Python & TypeScript starter agents | see [`examples/agent-sdk/`](examples/agent-sdk/) |

---

## Slash commands

<a name="slash-commands"></a>

100+ slash commands across 12 categories — invoke with `/command-name` in any Claude Code session:

| Category | Commands |
|---|---|
| `git` | commit-msg, pr-description, changelog, rebase-helper, conflict-resolver, branch-cleanup, squash-guide, gitignore-gen, release-notes, blame-explain |
| `testing` | write-tests, test-coverage, fix-failing-test, mock-gen, e2e-scaffold, test-plan, flaky-finder, assertion-improve, tdd-start, snapshot-review |
| `refactor` | extract-function, simplify, remove-dead-code, split-file, dedupe, modernize-syntax, tighten-types, rename-symbol, reduce-complexity, inline |
| `docs` | readme-gen, api-docs, docstring-add, architecture-doc, comment-explain, contributing-gen, adr-write, onboarding-doc |
| `debug` | explain-error, add-logging, repro-steps, stacktrace-analyze, memory-leak, race-condition, bisect-helper, perf-profile |
| `devops` | dockerfile-gen, compose-gen, k8s-manifest, ci-pipeline, terraform-module, helm-chart, github-action, env-audit, healthcheck, rollback-plan |
| `database` | migration-gen, query-optimize, schema-review, index-advisor, seed-data, n-plus-one-finder, backup-plan, er-diagram |
| `security` | security-scan, dep-audit, secret-scan, authz-review, input-validation, owasp-check, threat-model, cors-config |
| `frontend` | component-gen, a11y-audit, responsive-fix, state-refactor, form-validation, lighthouse-pass, storybook-gen, css-cleanup |
| `api` | endpoint-gen, openapi-spec, rate-limit, pagination, error-schema, webhook-handler, versioning-plan, sdk-gen |
| `ai-engineering` | prompt-improve, eval-harness, rag-setup, token-optimize, mcp-server-gen, agent-scaffold |
| `productivity` | standup-notes, meeting-summary, task-breakdown, decision-doc, weekly-review, email-draft |

Install: `/plugin install claudient-commands@claudient` or copy [`commands/`](commands/) into `.claude/commands/`.

---

## Why Use Claude Code Skills?

| Problem | Without Claudient | With Claudient |
|---|---|---|
| **Domain context** | Re-explain your stack every session | Skills activate automatically |
| **Specialist tasks** | Claude guesses at best practices | 182+ expert agents with scoped tools |
| **Tool integrations** | Manual copy-paste between tools | 40 MCP server configs ready to install |
| **Event automation** | Manual triggers, forgotten steps | 40 hooks that fire on the right events |
| **Team / language** | English only, one-size config | 5 languages, composable per project |
| **Small business** | Generic AI advice | 30+ vertical skills for real workflows |

**One command gives Claude instant expertise across every domain you work in.**

---

## Who Is This For?

| You are... | You get... |
|---|---|
| **Developer / vibe coder** | Skills for Next.js, FastAPI, Rust, Go, Drizzle, tRPC, Docker, k8s, Terraform, Unity, Flutter, Solidity, and 200+ more stacks — activate with a slash command |
| **Mobile developer** | React Native/Expo, Flutter, SwiftUI, Jetpack Compose, push notifications, offline-first, app store deployment |
| **Game developer** | Unity C#, Unreal C++, Godot GDScript, game networking, physics, level design, performance profiling |
| **Embedded/IoT engineer** | Firmware architecture, RTOS, BLE, sensor integration, low-power design, OTA updates |
| **Web3 builder** | Smart contract audit, DeFi protocols, NFT marketplaces, DAO governance, gas optimization |
| **AI product builder** | RAG Architect, LangGraph, Prompt Engineering, LLM Eval, MCP Server Builder, Claude API patterns with prompt caching |
| **GTM / RevOps engineer** | HubSpot MCP, SDR Agent, Lead Enrichment, CRM Hygiene, Email Automation, Deal Desk |
| **Finance / Legal professional** | DCF models, 3-statement models, IC memos, contract review, GDPR, SOC 2, EU AI Act — with mandatory human review gates |
| **Small business owner** | Plain-English skills for invoicing, cash flow, Shopify, reviews, SOPs — no terminal required |
| **DevOps / Platform team** | SLO design, chaos engineering, Helm, Kubernetes, Terraform, SRE runbooks, cost tracking |

---

## Claude Code Developer FAQ

### What is Claude Code?
Claude Code is Anthropic's official command-line AI assistant for software development. It runs in your terminal or IDE (VS Code, JetBrains), reads your codebase, edits files, runs commands, and completes tasks autonomously. Install it with `npm install -g @anthropic-ai/claude-code` or via the desktop app.

### What are Claude Code skills?
Skills are markdown files in `.claude/commands/` (or loaded via the plugin system) that define reusable expert behaviors. When triggered by a slash command or keywords, Claude Code reads the skill and applies its domain expertise to your current context — no repeated prompting required.

### How is Claudient different from writing a CLAUDE.md file?
A `CLAUDE.md` sets project-level context for one repo. Claudient skills are domain-level and reusable across every project — 384+ skills covering FastAPI, Kubernetes, HubSpot, React, Terraform, and hundreds more stacks.

### Does Claudient work with Cursor, GitHub Copilot, or other AI coding tools?
Claudient is designed for Claude Code (CLI and IDE extensions). Cross-harness adapters in [`compatibility/`](compatibility/) also support Cursor, Windsurf, Codex CLI, Gemini Code Assist, and GitHub Copilot.

### How do I install Claude Code skills from Claudient?
Run `npx claudient add all` to install everything, or use the Claude Code plugin system: `/plugin marketplace add Claudient/Claudient` then `/plugin install claudient-everything@claudient`. Install by domain with `npx claudient add skills backend` or `npx claudient add skills devops-infra`.

---

## Profession Packs — 25 Role-Specific Claude Code Configurations

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

## Workspace Stacks — 43 Pre-Wired Domain Workspaces

Complete workspace stacks with a `CLAUDE.md`, 8 skills, and project structure — each designed for a specific role or domain. Drop a stack into your project and Claude immediately has domain expertise.

### Engineering & Infrastructure

| Stack | Domain | Skills |
|---|---|---|
| `fullstack_developer_stack` | Full-stack web development | 8 |
| `frontend_engineer_stack` | React, Vue, Angular, Svelte | 8 |
| `api_developer_stack` | API design, OpenAPI, auth, webhooks | 8 |
| `devops_platform_stack` | Kubernetes, Terraform, CI/CD, IaC | 8 |
| `sre_stack` | SLOs, error budgets, incident response | 8 |
| `security_engineer_stack` | Pen testing, compliance, threat modeling | 8 |
| `database_admin_stack` | Query optimization, migrations, backups | 8 |
| `mobile_developer_stack` | React Native, Flutter, SwiftUI, Compose | 8 |
| `game_developer_stack` | Unity, Unreal, Godot, networking, physics | 8 |
| `embedded_iot_stack` | Firmware, RTOS, BLE, OTA updates | 8 |
| `blockchain_web3_stack` | Smart contracts, DeFi, NFTs, DAOs | 8 |

### Data & AI

| Stack | Domain | Skills |
|---|---|---|
| `data_engineer_stack` | dbt, Spark, Airflow, data pipelines | 8 |
| `mlai_engineer_stack` | ML models, training, deployment, MLOps | 8 |
| `analytics_engineer_stack` | BI, dashboards, metrics, experimentation | 8 |

### Business & GTM

| Stack | Domain | Skills |
|---|---|---|
| `founder_ceo_stack` | Strategy, fundraising, team building | 8 |
| `finance_cfo_stack` | Financial modeling, unit economics, reporting | 8 |
| `gtm_engineer_stack` | HubSpot, CRM, revenue ops, analytics | 8 |
| `content_marketing_stack` | SEO, content strategy, copywriting | 8 |
| `customer_success_stack` | Retention, NRR, onboarding, health scores | 8 |
| `sales_operations_stack` | Pipeline, forecasting, deal desk | 8 |
| `product_manager_stack` | Discovery, roadmaps, experiments | 8 |
| `growth_engineer_stack` | Experimentation, A/B testing, growth loops | 8 |
| `brand_manager_stack` | Brand strategy, positioning, guidelines | 8 |

### Operations & Support

| Stack | Domain | Skills |
|---|---|---|
| `operations_manager_stack` | Process optimization, SOPs, vendor management | 8 |
| `user_research_stack` | Study design, interviews, synthesis | 8 |
| `hr_people_operations_stack` | HR workflows, people analytics | 8 |
| `qa_testing_engineer_stack` | Test strategy, automation, quality | 8 |
| `technical_writer_stack` | Documentation, API docs, style guides | 8 |
| `legal_operations_stack` | Contract management, compliance | 8 |
| `podcast_producer_stack` | Episode production, distribution | 8 |
| `newsletter_writer_stack` | Newsletter writing, growth | 8 |
| `youtube_creator_stack` | Video production, SEO, growth | 8 |
| `investor_vc_stack` | Deal flow, due diligence, portfolio | 8 |
| `recruiter_ta_stack` | Sourcing, screening, onboarding | 8 |
| `ecommerce_operator_stack` | Shopify, marketplace, inventory | 8 |
| `b2b_consultant_stack` | Client management, proposals | 8 |
| `ai_sdr_stack` | AI-powered SDR workflows | 8 |
| `community_manager_stack` | Community engagement, moderation | 8 |

```bash
# Install a complete workspace stack
npx claudient add all   # includes all 43 stacks
```

---

## Quick Start — Install Claude Code Skills in 30 Seconds

```bash
# Install everything
npx claudient add all

# Install by domain
npx claudient add skills backend          # 40+ backend skills
npx claudient add skills devops-infra     # Kubernetes, Terraform, Docker, CI/CD
npx claudient add skills ai-engineering   # RAG, LangGraph, Claude API, MCP builder
npx claudient add skills legal            # GDPR, SOC 2, contracts, NDA review
npx claudient add skills finance          # DCF, 3-statement model, pitch deck
npx claudient add skills small-business   # Invoice chaser, cash flow, Shopify

# Install agents
npx claudient add agents                  # All 182+ specialist agents

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

## Repository Structure

```
Claudient/
├── .claude-plugin/           # Plugin and marketplace manifests
│   ├── plugin.json           # Plugin metadata and component paths
│   └── marketplace.json      # Marketplace catalog for /plugin marketplace add
│
├── plugins/                  # 19 installable domain plugins
│   ├── claudient-productivity/     # 66 skills
│   ├── claudient-small-business/   # 47 skills
│   ├── claudient-backend/          # 41 skills
│   ├── claudient-devops-infra/     # 36 skills
│   ├── claudient-gtm/              # 32 skills
│   ├── claudient-marketing/        # 22 skills
│   ├── claudient-legal/            # 21 skills
│   ├── claudient-sdr/              # 18 skills
│   ├── claudient-ai-engineering/   # 17 skills
│   ├── claudient-finance/          # 16 skills
│   ├── claudient-data-ml/          # 15 skills
│   ├── claudient-product/          # 15 skills
│   ├── claudient-automation/       # 14 skills
│   ├── claudient-database/         # 12 skills
│   ├── claudient-git/              # 3 skills
│   ├── claudient-commands/         # 100 slash commands
│   ├── claudient-personas/         # 10 personas
│   └── claudient-everything/       # meta-bundle (all domains)
│
├── skills/                   # 384+ auto-invoking domain skills
│   ├── backend/              # Next.js, FastAPI, Go, Rust, .NET, Rails, Laravel, Flutter
│   ├── devops-infra/         # Kubernetes, Terraform, Docker, CI/CD, AWS/GCP/Azure, Helm
│   ├── ai-engineering/       # Claude API, RAG, LangGraph, MCP builder, Agent Teams, Ultraplan
│   ├── data-ml/              # dbt, Spark, Kafka, MLOps, PyTorch, Pandas/Polars
│   ├── database/             # Drizzle, Prisma, PostgreSQL, Supabase, Redis, Elasticsearch
│   ├── gtm/                  # HubSpot, SDR, email automation, CRM hygiene, deal desk
│   ├── legal/                # Contract review, GDPR, SOC 2, EU AI Act, NDA, IP clearance
│   ├── finance/              # DCF, 3-statement model, IC memo, pitch deck, GL reconciler
│   ├── marketing/            # SEO, AI SEO, paid ads, content strategy, CRO, copywriting
│   ├── product/              # Discovery, roadmap, UX research, competitive teardown
│   ├── productivity/         # PR review, ADR writer, tech debt tracker, TDD guard
│   ├── small-business/       # Invoice chaser, QuickBooks, Shopify, 14 industry verticals
│   ├── automation/           # Playwright, browser automation, Remotion, SaaS scaffolder
│   ├── computer-use/         # UI testing, visual QA, legacy-app automation, screenshot verify
│   ├── git/                  # Git workflow automation
│   ├── sdr/                  # Sales development representative skills
│   └── finance-payments/     # Payments and fintech skills
│
├── agents/                   # 182+ specialist subagents
│   ├── advisors/             # 15 C-suite agents (CEO, CTO, CFO, CMO, CISO, COO, CPO...)
│   ├── core/                 # architect · planner · code-reviewer · security-reviewer
│   ├── roles/                # 100+ domain specialists (SRE, k8s, RAG, fintech, legal...)
│   ├── specialists/          # small-business-advisor, ecommerce, local-services
│   ├── build-resolvers/      # TypeScript and Python build error resolvers
│   └── sdr/                  # SDR and GTM agents
│
├── commands/                 # 100+ slash commands across 12 categories
│   ├── git/                  # commit-msg · pr-description · changelog · release-notes
│   ├── testing/              # write-tests · test-coverage · fix-failing-test · e2e-scaffold
│   ├── refactor/             # extract-function · simplify · remove-dead-code · modernize-syntax
│   ├── docs/                 # readme-gen · api-docs · docstring-add · architecture-doc
│   ├── debug/                # explain-error · stacktrace-analyze · memory-leak · perf-profile
│   ├── devops/               # dockerfile-gen · k8s-manifest · ci-pipeline · terraform-module
│   ├── database/             # migration-gen · query-optimize · index-advisor · er-diagram
│   ├── security/             # security-scan · dep-audit · secret-scan · threat-model
│   ├── frontend/             # component-gen · a11y-audit · storybook-gen · css-cleanup
│   ├── api/                  # endpoint-gen · openapi-spec · rate-limit · webhook-handler
│   ├── ai-engineering/       # prompt-improve · rag-setup · mcp-server-gen · agent-scaffold
│   └── productivity/         # standup-notes · task-breakdown · decision-doc · weekly-review
│
├── hooks/                    # 40 event-driven automations
│   ├── pre-tool-use/         # secret-scanner · injection-scanner · block-dangerous · git-push-confirm
│   ├── post-tool-use/        # tdd-guard · lint-check · test-runner · auto-git-stage
│   ├── lifecycle/            # session-context-loader · keepalive-poke
│   ├── notification/         # telegram-pr-notify · ntfy-push · tts-announcer
│   ├── permission/           # auto-allow-readonly
│   ├── subagent/             # agent-comms
│   ├── context/              # context injection hooks
│   └── advanced/             # sound-system · audit-log · output-size-warn
│
├── guides/                   # 100+ human-readable documentation files
│   └── [de/ · es/ · fr/ · nl/]    # Translated versions
├── workflows/                # 45+ end-to-end process workflows
│   └── [de/ · es/ · fr/ · nl/]
├── prompts/                  # 31+ reusable prompt templates
│   ├── system-prompts/       # Role-based system prompt templates
│   ├── project-starters/     # Project initialization prompts
│   └── task-specific/        # Task-specific prompt templates
├── rules/                    # 32 always-follow guideline files
│   ├── common/               # Language-agnostic coding and workflow principles
│   └── language-specific/    # Per-language style rules
├── mcp/                      # 40 MCP server config guides
│   └── configs/              # Ready-to-use JSON configs (GitHub, Postgres, Redis, Kafka, Docker, and more)
├── personas/                 # 10 operating profiles
├── output-styles/            # 8 output style definitions
├── themes/                   # 10 UI themes (Dracula, Nord, Tokyo Night, Catppuccin...)
├── statuslines/              # 6 statusline scripts
├── keybindings/              # 4 presets: vim · emacs · ergonomic · power-user
├── settings-templates/       # 5 starter settings.json templates
├── routines/                 # 10 scheduled cloud-agent routine templates
├── compatibility/            # Cross-harness adapters (Cursor, Windsurf, Codex, Gemini, Copilot)
├── claude-md-examples/       # 20 annotated real-world CLAUDE.md templates
├── examples/                 # Complete working project references
│   ├── agent-sdk/            # Python & TypeScript Agent SDK starters
│   ├── nextjs-saas/          # Next.js + Supabase + Stripe
│   ├── fastapi-ai-app/       # FastAPI + Claude API
│   ├── go-cli-tool/          # Go CLI tool
│   └── dbt-pipeline/         # dbt data pipeline
├── structures/               # 83 project structure templates
├── *_stack/                  # 43 pre-wired workspace stacks (CLAUDE.md + 8 skills each)
├── scripts/                  # Build and utility scripts
├── site/                     # Astro documentation site source
├── docs/                     # ADRs and internal documentation
└── index.json                # Full searchable index (npx claudient search)
```

---

## Most Popular Claude Code Skills Right Now

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

<a name="top-100-mcp-servers"></a>

## Top 100 MCP Servers for Claude Code — Indie Builder Starter Stack

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
| [Postgres MCP](mcp/postgres.md) | SQL queries, schema inspection, table management | — |
| [Redis MCP](mcp/redis.md) | Cache inspection, key management, memory stats | — |
| [Jira MCP](mcp/jira.md) | Issue management, sprint tracking, JQL queries | — |
| [Docker MCP](mcp/docker.md) | Container inspection, log analysis, resource monitoring | — |

**→ [Full guide: Top 100 MCP Servers for Indie Builders](mcp/top-mcp-servers.md)** — installation configs, tier rankings, and curated bundles for every stack.

```bash
npx claudient add mcp starter   # GitHub + Memory + Playwright
npx claudient add mcp all       # All 40 individual config guides
```

---

<a name="claude-for-small-business"></a>

## Claude for Small Business — 30+ Vertical Skills

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

## FAQ — Claude for Small Business

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

<a name="agents"></a>

## 182+ Claude Code Specialist Agents

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

<a name="skills-by-category"></a>

## Skills by Category — 384+ Claude Code Skills

**384+ skills · 19 categories · EN · FR · DE · NL · ES**

| Category | Count | Top skills |
|---|---|---|
| `backend/nodejs` | 25 | Next.js, Hono, NestJS, tRPC, Astro, Svelte, React Native, Angular, WebSockets |
| `backend/python` | 5 | FastAPI, Django, pytest, Python Async |
| `backend/other` | 11 | Go, C#/.NET, Spring Boot, Rust, Rails, Laravel, Elixir, Flutter, PHP, Ruby, Swift |
| `devops-infra` | 36 | AWS/Azure/GCP, Kubernetes, Helm, Terraform, Terragrunt, Docker, GitHub Actions, Sentry, OpenTelemetry |
| `ai-engineering` | 20 | Claude API, Vercel AI SDK, LangGraph, RAG Architect, Prompt Caching, Batch API, MCP Builder, Agent Teams, Ultraplan, Ultrareview |
| `data-ml` | 15 | dbt, Spark, Kafka, MLOps, NLP Pipelines, Reinforcement Learning, Pandas/Polars, PyTorch |
| `database` | 12 | Drizzle, Prisma, PostgreSQL, Supabase, Neon, Redis, Elasticsearch, Blockchain/Solidity |
| `gtm` | 32 | HubSpot, SDR Agent, Lead Enrichment, Email Automation, CRM Hygiene, Deal Desk, Revenue Ops |
| `legal` | 21 | Contract Review, NDA, DSAR, GDPR, SOC 2, EU AI Act, ISO 27001, IP Clearance, Privacy PIA |
| `finance` | 16 | DCF Model, 3-Statement Model, IC Memo, Pitch Deck, KYC Screener, GL Reconciler |
| `marketing` | 22 | SEO Audit, AI SEO, Programmatic SEO, Paid Ads, Content Strategy, CRO, Copywriting |
| `product` | 15 | Product Discovery, Experiment Designer, Competitive Teardown, UX Research, Roadmap |
| `productivity` | 66 | Ship Gate, PR Review, ADR Writer, Tech Debt Tracker, Context Engineering, TDD Guard |
| `small-business` | 47 | Invoice Chaser, QuickBooks, Cash Flow, Shopify, SOP Writer, Review Response, Dental Practice, Salon-Spa, Fitness Gym, Contractor Trades, Coaching, Newsletter, Online Course, Agency Operations, Hiring Pipeline, Churn Prevention, Pricing Optimizer |
| `sdr` | 18 | Research Brief, Cold Outreach, LinkedIn Prospecting, Objection Handler, Follow-up Sequences |
| `automation` | 14 | Playwright Pro, Browser Automation, Remotion, SaaS Scaffolder, Office Docs |
| `computer-use` | 4 | UI Testing, Visual QA, Legacy App Automation, Screenshot Verify |
| `finance-payments` | 2 | Payments, Fintech |
| `git` | 3 | Git Workflow Automation |

---

## 40 Claude Code Hooks — Event-Driven Automation

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
| + 28 more | — | Auto-stage git, transcript backup, output compressor, bug logger, Slack notifier, WhatsApp gate... |

---

## Guides & Workflows — 100+ Claude Code Guides and Workflows

### Guides (100+)

[Getting Started](guides/getting-started.md) · [Agent Frontmatter Reference](guides/agent-frontmatter.md) · [Skills Frontmatter Reference](guides/skills-frontmatter.md) · [Decision Framework](guides/decision-framework.md) · [Claude Managed Agents](guides/claude-managed-agents.md) · [Advanced Tool Use](guides/advanced-tool-use.md) · [Voice Dictation](guides/voice-dictation.md) · [Desktop App](guides/desktop-app.md) · [Opus 4.7 Migration](guides/opus-47-migration.md) · [Hooks Cookbook](guides/hooks-cookbook.md) · [Multi-Agent Patterns](guides/multi-agent-patterns.md) · [Subagent Patterns](guides/subagent-patterns.md) · [Context Management](guides/context-management.md) · [Token Cost Reduction](guides/token-cost-reduction.md) · [Notifications Setup](guides/notifications-setup.md) · [Plugin Authoring](guides/plugin-authoring.md) · [RIPER Framework](guides/riper-framework.md) · [RPI Workflow](guides/rpi-workflow.md) · [CLI Reference](guides/cli-reference.md) · [Settings Scope](guides/settings-scope.md) · [Why Use Claude Code](guides/why-use-claude-code.md) · [Routines](guides/routines.md) · [Computer Use](guides/computer-use.md) · [Ultraplan](guides/ultraplan.md) · [Auto Mode](guides/auto-mode.md) + 39 more

### Workflows (45+)

[RPI Feature Development](workflows/rpi-feature.md) · [RIPER](workflows/riper.md) · [Incremental Build](workflows/incremental-build.md) · [Pre-Human Review](workflows/pre-human-review.md) · [Autonomous Loop](workflows/autonomous-loop.md) · [Worktree Lifecycle](workflows/worktree-lifecycle.md) · [Multi-Agent Saga](workflows/multi-agent-saga.md) · [Chaos Game Day](workflows/chaos-game-day.md) · [Error Budget](workflows/error-budget.md) · [Bug Investigation](workflows/bug-investigation.md) · [Compound Engineering](workflows/compound-engineering.md) · [Session Learning](workflows/session-learning.md) + more

---

## What's Included — Complete Claude Code Toolkit

| Type | Count |
|---|---|
| **Skills** | **384+** |
| **Agents** | **182+** |
| **Workspace Stacks** | **43** |
| **Hooks** | **40** |
| **MCP config guides** | **40** |
| **Routines** | **10** |
| **Guides** | **100+** |
| **Workflows** | **45+** |
| **Prompts** | **31+** |
| **Rules** | **32** |
| **Languages** | **5 (EN · FR · DE · NL · ES)** |

---

<a name="translations"></a>

## 5 Languages — Claude Code Skills in EN · FR · DE · NL · ES

Every skill, agent, guide, workflow, and prompt is available in:

**🇬🇧 English · 🇫🇷 French · 🇩🇪 German · 🇳🇱 Dutch · 🇪🇸 Spanish**

```bash
npx claudient add all --lang fr   # French
npx claudient add all --lang de   # German
npx claudient add all --lang nl   # Dutch
npx claudient add all --lang es   # Spanish
```

---

## Contribute a Claude Code Skill — Get Featured

Claudient is community-powered. Every skill lives in one markdown file. Contributing a Claude Code skill takes less time than filing a GitHub issue.

1. Read the [Skill Authoring Guide](guides/skill-authoring.md) — 5 minutes
2. Fork, add your skill in one `.md` file
3. Submit a PR — merged skills get featured in **Most Popular**

**Recommended GitHub topics for Claude Code projects:** `claude` · `claude-code` · `anthropic` · `llm-tools` · `mcp` · `developer-tools` · `prompt-engineering` · `ai-assistant`

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
