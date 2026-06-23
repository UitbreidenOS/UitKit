# Claude Code Vaardigheden, Agents & Plugins — Claudient

**Claudient** is de grootste open-source kennisbank voor **Claude Code** — Anthropic's AI-codering CLI. Het bevat 400+ domeinvaardigheden, 182+ specialistische agents, 42 vooraf ingestelde werkruimte-stacks, 41 MCP-configuraties, 100+ schuine streepcommando's, hooks en werkstromen, allemaal installeerbaar in 30 seconden. Geen herhaalde uitleg van stapels. Claude kent je domein al.

**Nieuw in Claude Code?** Claude Code is Anthropic's officiële opdrachtregelassistent voor softwareontwikkeling — het leest je codebase, voert commando's uit, bewerkt bestanden en voltooit taken autonoom in je terminal of IDE. Claudient is de open-source gemeenschapsbibliotheek die het uitbreidt met deskundig niveau vaardigheden over elke stack en elk domein.

[![npm version](https://img.shields.io/npm/v/claudient?color=f97316&label=npm)](https://www.npmjs.com/package/claudient)
[![npm downloads](https://img.shields.io/npm/dm/claudient?color=f97316)](https://www.npmjs.com/package/claudient)
[![GitHub Stars](https://img.shields.io/github/stars/UitbreidenOS/Claudient?color=f97316&label=stars)](https://github.com/UitbreidenOS/Claudient)
[![License: AGPL-3.0](https://img.shields.io/badge/code-AGPL--3.0-3b82f6.svg)](LICENSE-CODE)
[![Content License: CC-BY-SA-4.0](https://img.shields.io/badge/content-CC--BY--SA--4.0-ec4899.svg)](LICENSE-CONTENT)
[![Skills](https://img.shields.io/badge/skills-400+-f97316)](#skills-by-category)
[![Agents](https://img.shields.io/badge/agents-182+-ec4899)](#agents)
[![Commands](https://img.shields.io/badge/commands-100+-a855f7)](#slash-commands)
[![Plugins](https://img.shields.io/badge/plugin_marketplace-19_plugins-22c55e)](#install-as-a-claude-code-plugin)
[![Claude for Small Business](https://img.shields.io/badge/small_business-30+_skills-06b6d4)](#claude-for-small-business)
[![MCP](https://img.shields.io/badge/MCP_configs-41-8b5cf6)](#top-100-mcp-servers)
[![Languages](https://img.shields.io/badge/languages-EN%20FR%20DE%20NL%20ES-3b82f6)](#translations)
[![Reddit](https://img.shields.io/badge/Reddit-r%2Fuitbreiden-FF4500?logo=reddit&logoColor=white)](https://www.reddit.com/r/uitbreiden/)
[![YouTube](https://img.shields.io/badge/YouTube-%40UITBREIDEN-FF0000?logo=youtube&logoColor=white)](https://www.youtube.com/@UITBREIDEN)

**[FR](README.fr.md) · [DE](README.de.md) · [ES](README.es.md) · [NL](README.nl.md)**

![Claudient Hero](assets/hero.png)

**Hou op met het uitleggen van je stack aan Claude in elke sessie.**

Claudient is de grootste open-source kennisbank voor **Claude Code** — 400+ vaardigheden, 182+ specialistische agents, 100+ schuine streepcommando's, 100+ gidsen, 40 hooks, 45 werkstromen, 83 projectstructuren, 42 werkruimte-stacks, 10 persona's, 32 regels, 41 MCP-serverconfiguraties, 10 automatiseringsroutines, 20 geannoteerde CLAUDE.md-voorbeelden, cross-harness-adapters (Cursor/Windsurf/Codex/Gemini/Copilot), plus uitvoerstijlen, thema's, statusregels, toetsensnelkoppelingen, instellingssjablonen en een Agent SDK-pakket — allemaal installeerbaar in 30 seconden.

```bash
# Installeren als Claude Code-plugin marketplace (aanbevolen)
/plugin marketplace add UitbreidenOS/Claudient
/plugin install claudient-everything@claudient

# Of via npm
npx claudient add all
```




---

## Installeren als Claude Code-plugin

Claudient wordt geleverd als een native Claude Code **plugin marketplace**. Voeg het één keer toe en installeer vervolgens alleen de domeinen die je nodig hebt — vaardigheden roepen zichzelf automatisch aan op basis van waar je aan werkt, agents en hooks worden gebundeld.

```bash
# 1. Voeg de marketplace toe
/plugin marketplace add UitbreidenOS/Claudient

# 2. Installeer een domein-plugin (of de everything-bundel)
/plugin install claudient-gtm@claudient
/plugin install claudient-devops-infra@claudient
/plugin install claudient-everything@claudient
```

**19 plugins, 400+ automatisch aanroepende vaardigheden, 182 agents, 100 schuine streepcommando's:**

| Plugin | Vaardigheden | Plugin | Vaardigheden |
|---|---|---|---|
| `claudient-productivity` | 66 | `claudient-finance` | 16 |
| `claudient-small-business` | 47 | `claudient-data-ml` | 15 |
| `claudient-backend` | 41 | `claudient-product` | 15 |
| `claudient-devops-infra` | 36 | `claudient-automation` | 14 |
| `claudient-gtm` | 32 | `claudient-database` | 12 |
| `claudient-marketing` | 22 | `claudient-git` | 3 |
| `claudient-legal` | 21 | `claudient-commands` | 100 commando's |
| `claudient-sdr` | 22 | `claudient-personas` | 10 persona's |
| `claudient-ai-engineering` | 17 | `claudient-finance-payments` | 2 |
| `claudient-everything` | meta-bundel | | |

Elke vaardigheid is gevalideerd met `claude plugin validate --strict`. Geef de voorkeur aan npm? `npx claudient add all` werkt nog steeds.

---

## Voorbij vaardigheden — de volledige Claude Code toolkit

Claudient omvat elke primitive die Claude Code ondersteunt, niet alleen vaardigheden:

| Categorie | Wat erin zit | Installeren |
|---|---|---|
| **Schuine streepcommando's** | 100+ commando's over 12 categorieën — git, testen, refactor, docs, debug, devops, database, beveiliging, frontend, api, ai-engineering, productiviteit | `claudient-commands` plugin of `commands/` dir |
| **Persona's** | 10 bedrijfsprofiel — startup-cto, solo-founder, growth-marketer, indie-hacker, enterprise-architect, data-driven-pm, devrel-advocate, agency-operator, ai-product-builder, fractional-exec | `claudient-personas` plugin of `personas/` dir |
| **Uitvoerstijlen** | 8 stijlen — concise, mentor, code-reviewer, architect, plain-operator, security-paranoid, diagram-first, tdd-enforcer | kopieer naar `~/.claude/output-styles/` |
| **Thema's** | 10 thema's — Dracula, Nord, Tokyo Night, Catppuccin, Gruvbox, Solarized, Monokai, Rosé Pine, + Claudient-merk | kopieer naar `~/.claude/themes/`, dan `/theme` |
| **Statusregels** | 6 scripts — minimal, full, cost-watch, context-budget, git-focused, rate-limit | verwijs `settings.json` `statusLine` naar ze |
| **Toetsensnelkoppelingen** | 4 voorinstellingen — vim, emacs, ergonomic, power-user | voeg samen in `~/.claude/keybindings.json` |
| **Instellingssjablonen** | 5 startpunten — solo-dev, team, security-hardened, enterprise, minimal | zet in `.claude/settings.json` |
| **Hooks** | 40 over alle 2026-events — inclusief nieuwe `http`, `prompt` en `agent` hook-types | zie [`hooks/`](hooks/) |
| **Routines** | 10 geplande sjablonen voor cloud-agents — daily-standup, pr-triage, dependency-audit, incident-watch, weekly-retro, sprint-planning, code-review-rotation, security-scan, changelog-generator, cost-audit | zie [`routines/`](routines/) |
| **Computer-use vaardigheden** | 4 — ui-testing, visual-qa, legacy-app-automation, screenshot-verify | `/plugin install` of kopieer |
| **CLAUDE.md-galerij** | 20 geannoteerde real-world-sjablonen — Next.js SaaS, FastAPI, monorepo, CLI-tool, dbt, mobiel, OSS-bibliotheek, k8s, klein bedrijf, juridisch, fintech, game dev, embedded en meer | zie [`claude-md-examples/`](claude-md-examples/) |
| **Cross-harness-adapters** | Gebruik Claudient in Cursor, Windsurf, Codex CLI, Gemini Code Assist, GitHub Copilot — adapter-gidsen + installatiescript | zie [`compatibility/`](compatibility/) |
| **Agent SDK-pakket** | Volledige gids + runnable Python & TypeScript starter-agents | zie [`examples/agent-sdk/`](examples/agent-sdk/) |

---

## Schuine streepcommando's

<a name="slash-commands"></a>

100+ schuine streepcommando's over 12 categorieën — roep aan met `/command-name` in elke Claude Code-sessie:

| Categorie | Commando's |
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

Installeren: `/plugin install claudient-commands@claudient` of kopieer [`commands/`](commands/) in `.claude/commands/`.

---

## Waarom Claude Code-vaardigheden gebruiken?

| Probleem | Zonder Claudient | Met Claudient |
|---|---|---|
| **Domeincontext** | Leg je stack uit in elke sessie | Vaardigheden activeren automatisch |
| **Specialisttaken** | Claude gist best practices | 182+ deskundige agents met gerichte tools |
| **Toolintegraties** | Handmatig kopiëren tussen tools | 41 MCP-serverconfiguraties klaar om te installeren |
| **Automatisering van events** | Handmatige triggers, vergeten stappen | 40 hooks die op de juiste events afgaan |
| **Team / taal** | Alleen Engels, één-maat-configuratie | 5 talen, samenstelbaar per project |
| **Klein bedrijf** | Generieke AI-adviezen | 30+ verticale vaardigheden voor echte werkstromen |

**Één commando geeft Claude onmiddellijke deskundigheid over elk domein waarmee je werkt.**

---

## Voor wie is dit?

| Je bent... | Je krijgt... |
|---|---|
| **Ontwikkelaar / vibe-coder** | Vaardigheden voor Next.js, FastAPI, Rust, Go, Drizzle, tRPC, Docker, k8s, Terraform, Unity, Flutter, Solidity en 200+ meer stapels — activeer met een schuine streepcommando |
| **Mobiele ontwikkelaar** | React Native/Expo, Flutter, SwiftUI, Jetpack Compose, push-meldingen, offline-first, app store-implementatie |
| **Spellontwikkelaar** | Unity C#, Unreal C++, Godot GDScript, gamenetwerking, natuurkunde, levelontwerp, prestatieprofilering |
| **Embedded/IoT-engineer** | Firmware-architectuur, RTOS, BLE, sensorintegratie, zuinig energiegebruik, OTA-updates |
| **Web3-bouwer** | Smart contract audit, DeFi-protocollen, NFT-marktplaatsen, DAO-governance, gasoptimalisatie |
| **AI-productbouwer** | RAG Architect, LangGraph, Prompt Engineering, LLM Eval, MCP Server Builder, Claude API-patronen met prompt caching |
| **GTM / RevOps-engineer** | HubSpot MCP, SDR-agent, Lead Enrichment, CRM Hygiene, E-mailautomatisering, Deal Desk |
| **Financiële / juridische professional** | DCF-modellen, 3-statement-modellen, IC-memo's, contractreviews, GDPR, SOC 2, EU AI Act — met verplichte menselijke beoordelingsgates |
| **Kleine bedrijfseigenaar** | Duidelijke Engelse vaardigheden voor facturering, cashflow, Shopify, reviews, SOP's — geen terminal nodig |
| **DevOps / Platformteam** | SLO-ontwerp, chaos engineering, Helm, Kubernetes, Terraform, SRE-runbooks, kostenvolgering |

---

## Claude Code Ontwikkelaar FAQ

### Wat is Claude Code?
Claude Code is Anthropic's officiële opdrachtregelassistent voor softwareontwikkeling. Het wordt uitgevoerd in je terminal of IDE (VS Code, JetBrains), leest je codebase, bewerkt bestanden, voert commando's uit en voltooit taken autonoom. Installeer het met `npm install -g @anthropic-ai/claude-code` of via de desktop-app.

### Wat zijn Claude Code-vaardigheden?
Vaardigheden zijn markdown-bestanden in `.claude/commands/` (of geladen via het pluginsysteem) die herbruikbare deskundige gedragingen definiëren. Wanneer geactiveerd door een schuine streepcommando of trefwoorden, leest Claude Code de vaardigheid en past zijn domeindeskundigheid toe op je huidige context — geen herhaalde promptering nodig.

### Hoe verschilt Claudient van het schrijven van een CLAUDE.md-bestand?
Een `CLAUDE.md` stelt projectniveaucontext voor één repo in. Claudient-vaardigheden zijn op domeinniveau en herbruikbaar in elk project — 400+ vaardigheden die FastAPI, Kubernetes, HubSpot, React, Terraform en honderden meer stapels bestrijken.

### Werkt Claudient met Cursor, GitHub Copilot of andere AI-coderingstools?
Claudient is ontworpen voor Claude Code (CLI en IDE-extensies). Cross-harness-adapters in [`compatibility/`](compatibility/) ondersteunen ook Cursor, Windsurf, Codex CLI, Gemini Code Assist en GitHub Copilot.

### Hoe installeer ik Claude Code-vaardigheden van Claudient?
Voer `npx claudient add all` uit om alles te installeren, of gebruik het Claude Code-pluginsysteem: `/plugin marketplace add UitbreidenOS/Claudient` en vervolgens `/plugin install claudient-everything@claudient`. Installeer per domein met `npx claudient add skills backend` of `npx claudient add skills devops-infra`.

---

## Beroepspakketten — 25 Rolspecifieke Claude Code-configuraties

25 beroepsspecifieke pakketten — vooraf ingestelde vaardigheid-stacks, agents, werkstromen en dagelijkse routines voor elke rol.

| Beroep | Installeren | Gids |
|---|---|---|
| SDR / Verkoper | `npx claudient add skill gtm/sdr-research-brief` | [Gids](guides/for-sdr.md) |
| Oprichter / CEO | `npx claudient add skill gtm/founder-operating-system` | [Gids](guides/for-founder.md) |
| Productmanager | `npx claudient add skill product/product-discovery` | [Gids](guides/for-product-manager.md) |
| DevOps / Platform-engineer | `npx claudient add skill devops-infra/kubernetes-architect` | [Gids](guides/for-devops-engineer.md) |
| Content Marketer / SEO | `npx claudient add skill marketing/seo-audit` | [Gids](guides/for-content-marketer.md) |
| Financieel analist / CFO | `npx claudient add skill finance/dcf-model` | [Gids](guides/for-finance-analyst.md) |
| Juridisch / Compliance-officer | `npx claudient add skill legal/contract-review` | [Gids](guides/for-legal-compliance.md) |
| Growth Hacker / Performance Marketer | `npx claudient add skill marketing/paid-ads` | [Gids](guides/for-growth-marketer.md) |
| Customer Success Manager | `npx claudient add skill gtm/customer-success` | [Gids](guides/for-customer-success.md) |
| Recruiter / HR | `npx claudient add skill small-business/hiring-pipeline` | [Gids](guides/for-recruiter.md) |
| UX Designer / Onderzoeker | `npx claudient add skill product/ux-research` | [Gids](guides/for-ux-designer.md) |
| Technisch schrijver | `npx claudient add skill productivity/adr-writer` | [Gids](guides/for-technical-writer.md) |
| Account Executive | `npx claudient add skill gtm/deal-desk` | [Gids](guides/for-account-executive.md) |
| Operations Manager / COO | `npx claudient add skill small-business/sop-writer` | [Gids](guides/for-operations-manager.md) |
| E-mailmarketer | `npx claudient add skill gtm/email-automation` | [Gids](guides/for-email-marketer.md) |
| E-commerce-operator | `npx claudient add skill small-business/ecommerce-seller` | [Gids](guides/for-ecommerce-operator.md) |
| CTO / Tech Lead | `npx claudient add skill productivity/tech-debt-tracker` | [Gids](guides/for-cto.md) |
| Makelaar onroerend goed | `npx claudient add skill small-business/real-estate-listing` | [Gids](guides/for-real-estate-agent.md) |
| Belegger / VC-analist | `npx claudient add skill finance/ic-memo` | [Gids](guides/for-investor.md) |
| Gegevensanalist / BI-analist | `npx claudient add skill data-ml/dbt` | [Gids](guides/for-data-analyst.md) |
| Freelancer / Consultant | `npx claudient add skill small-business/freelancer-proposal` | [Gids](guides/for-freelancer.md) |
| Directiesecretaresse / Chief of Staff | `npx claudient add skill productivity/meeting-to-action` | [Gids](guides/for-executive-assistant.md) |
| Docent / Cursusmaker | `npx claudient add skill small-business/online-course-creator` | [Gids](guides/for-educator.md) |
| Software Engineer | `npx claudient add skills backend` | gebruikt bestaande vaardigheden — nog geen specifieke gids |
| Healthcare Admin | `npx claudient add skills small-business` | gebruikt bestaande vaardigheden — nog geen specifieke gids |

Elk pakket bevat: domeinspecifieke schuine streepcommando's, een samengestelde agent-roster, een dagelijkse werkstroom, een 30-dagen ramp plan en toolintegratie-configuraties.

---

## Werkruimte-stacks — 42 Vooraf ingestelde domeinwerkruimten

Volledige werkruimte-stacks met een `CLAUDE.md`, 8 vaardigheden en projectstructuur — elk ontworpen voor een specifieke rol of domein. Zet een stack in je project en Claude heeft onmiddellijk domeindeskundigheid.

### Engineering & Infrastructuur

| Stack | Domein | Vaardigheden |
|---|---|---|
| `fullstack_developer_stack` | Full-stack webontwikkeling | 8 |
| `frontend_engineer_stack` | React, Vue, Angular, Svelte | 8 |
| `api_developer_stack` | API-ontwerp, OpenAPI, auth, webhooks | 8 |
| `devops_platform_stack` | Kubernetes, Terraform, CI/CD, IaC | 8 |
| `sre_stack` | SLO's, foutbudgetten, incident-respons | 8 |
| `security_engineer_stack` | Pen testing, compliance, threat modeling | 8 |
| `database_admin_stack` | Query-optimalisatie, migraties, back-ups | 8 |
| `mobile_developer_stack` | React Native, Flutter, SwiftUI, Compose | 8 |
| `game_developer_stack` | Unity, Unreal, Godot, networking, natuurkunde | 8 |
| `embedded_iot_stack` | Firmware, RTOS, BLE, OTA-updates | 8 |
| `blockchain_web3_stack` | Smart contracts, DeFi, NFT's, DAO's | 8 |

### Gegevens & AI

| Stack | Domein | Vaardigheden |
|---|---|---|
| `data_engineer_stack` | dbt, Spark, Airflow, data pipelines | 8 |
| `mlai_engineer_stack` | ML-modellen, training, implementatie, MLOps | 8 |
| `analytics_engineer_stack` | BI, dashboards, metrics, experimenten | 8 |

### Bedrijf & GTM

| Stack | Domein | Vaardigheden |
|---|---|---|
| `founder_ceo_stack` | Strategie, fundraising, teambuilding | 8 |
| `finance_cfo_stack` | Financiële modellering, eenheidseconomie, rapportage | 8 |
| `gtm_engineer_stack` | HubSpot, CRM, revenue ops, analytics | 8 |
| `content_marketing_stack` | SEO, contentstrategie, copywriting | 8 |
| `customer_success_stack` | Retentie, NRR, onboarding, health scores | 8 |
| `sales_operations_stack` | Pipeline, forecasting, deal desk | 8 |
| `product_manager_stack` | Discovery, roadmaps, experimenten | 8 |
| `growth_engineer_stack` | Experimenten, A/B testing, groeilussen | 8 |
| `brand_manager_stack` | Merkstrategie, positioning, richtlijnen | 8 |

### Operaties & Ondersteuning

| Stack | Domein | Vaardigheden |
|---|---|---|
| `operations_manager_stack` | Procesoptimalisatie, SOP's, leveranciersbeheer | 8 |
| `user_research_stack` | Studieontwerp, interviews, synthese | 8 |
| `hr_people_operations_stack` | HR-werkstromen, people analytics | 8 |
| `qa_testing_engineer_stack` | Teststrategie, automatisering, kwaliteit | 8 |
| `technical_writer_stack` | Documentatie, API-documenten, style guides | 8 |
| `legal_operations_stack` | Contractbeheer, compliance | 8 |
| `podcast_producer_stack` | Afleveringsproductie, distributie | 8 |
| `newsletter_writer_stack` | Nieuwsbriefschrijving, groei | 8 |
| `youtube_creator_stack` | Videoproductie, SEO, groei | 8 |
| `investor_vc_stack` | Deal flow, due diligence, portfolio | 8 |
| `recruiter_ta_stack` | Sourcing, screening, onboarding | 8 |
| `ecommerce_operator_stack` | Shopify, marketplace, inventaris | 8 |
| `b2b_consultant_stack` | Clientbeheer, proposals | 8 |
| `ai_sdr_stack` | AI-aangedreven SDR-werkstromen | 8 |
| `community_manager_stack` | Community engagement, moderatie | 8 |
| `bio_research_stack` | Experimentontwerp, biostatistiek, publicatie | 8 |
| `healthcare_stack` | Klinische ops, HIPAA, EHR-integratie, telehealth | 8 |

```bash
# Installeer een volledige werkruimte-stack
npx claudient add all   # bevat alle 42 stacks
```

---

## Snelstart — Installeer Claude Code-vaardigheden in 30 seconden

```bash
# Installeer alles
npx claudient add all

# Installeer per domein
npx claudient add skills backend          # 40+ backend-vaardigheden
npx claudient add skills devops-infra     # Kubernetes, Terraform, Docker, CI/CD
npx claudient add skills ai-engineering   # RAG, LangGraph, Claude API, MCP builder
npx claudient add skills legal            # GDPR, SOC 2, contracts, NDA review
npx claudient add skills finance          # DCF, 3-statement model, pitch deck
npx claudient add skills small-business   # Invoice chaser, cash flow, Shopify

# Installeer agents
npx claudient add agents                  # Alle 182+ specialistische agents

# Installeer in je taal
npx claudient add all --lang fr           # Frans
npx claudient add all --lang de           # Duits
npx claudient add all --lang nl           # Nederlands
npx claudient add all --lang es           # Spaans

# Ontdekken
npx claudient search "circuit breaker"
npx claudient list
```

---

## Repositorystructuur

```
Claudient/
├── .claude-plugin/           # Plugin en marketplace manifests
│   ├── plugin.json           # Plugin-metadata en componentpaden
│   └── marketplace.json      # Marketplace-catalogus voor /plugin marketplace add
│
├── plugins/                  # 19 installeerbare domein-plugins
│   ├── claudient-productivity/     # 66 vaardigheden
│   ├── claudient-small-business/   # 47 vaardigheden
│   ├── claudient-backend/          # 41 vaardigheden
│   ├── claudient-devops-infra/     # 36 vaardigheden
│   ├── claudient-gtm/              # 32 vaardigheden
│   ├── claudient-marketing/        # 22 vaardigheden
│   ├── claudient-legal/            # 21 vaardigheden
│   ├── claudient-sdr/              # 18 vaardigheden
│   ├── claudient-ai-engineering/   # 17 vaardigheden
│   ├── claudient-finance/          # 16 vaardigheden
│   ├── claudient-data-ml/          # 15 vaardigheden
│   ├── claudient-product/          # 15 vaardigheden
│   ├── claudient-automation/       # 14 vaardigheden
│   ├── claudient-database/         # 12 vaardigheden
│   ├── claudient-git/              # 3 vaardigheden
│   ├── claudient-commands/         # 100 schuine streepcommando's
│   ├── claudient-personas/         # 10 persona's
│   └── claudient-everything/       # meta-bundel (alle domeinen)
│
├── skills/                   # 400+ automatisch aanroepende domeinvaardigheden
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
├── agents/                   # 182+ specialistische subagents
│   ├── advisors/             # 15 C-suite agents (CEO, CTO, CFO, CMO, CISO, COO, CPO...)
│   ├── core/                 # architect · planner · code-reviewer · security-reviewer
│   ├── roles/                # 100+ domain specialists (SRE, k8s, RAG, fintech, legal...)
│   ├── specialists/          # small-business-advisor, ecommerce, local-services
│   ├── build-resolvers/      # TypeScript and Python build error resolvers
│   └── sdr/                  # SDR and GTM agents
│
├── commands/                 # 100+ schuine streepcommando's over 12 categorieën
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
├── guides/                   # 100+ leesbare documentatiebestanden
│   └── [de/ · es/ · fr/ · nl/]    # Vertaalde versies
├── workflows/                # 45+ end-to-end processwerkstromen
│   └── [de/ · es/ · fr/ · nl/]
├── prompts/                  # 31+ herbruikbare promptsjablonen
│   ├── system-prompts/       # Op rollen gebaseerde systeemprompsjablonen
│   ├── project-starters/     # Projectinitialisatie-prompts
│   └── task-specific/        # Taakspecifieke promptsjablonen
├── rules/                    # 32 altijd-volgen richtlijnbestanden
│   ├── common/               # Taalafhankelijke programmeer- en workflowprincipes
│   └── language-specific/    # Per-taal-stijlregels
├── mcp/                      # 41 MCP-serverconfiguratie-gidsen
│   └── configs/              # Gebruiksklare JSON-configuraties (GitHub, Postgres, Redis, Kafka, Docker, en meer)
├── personas/                 # 10 bedrijfsprofielen
├── output-styles/            # 8 uitvoerstijldefinities
├── themes/                   # 10 UI-thema's (Dracula, Nord, Tokyo Night, Catppuccin...)
├── statuslines/              # 6 statusline-scripts
├── keybindings/              # 4 voorinstellingen: vim · emacs · ergonomic · power-user
├── settings-templates/       # 5 starter settings.json-sjablonen
├── routines/                 # 10 geplande cloud-agent routinesjablonen
├── compatibility/            # Cross-harness-adapters (Cursor, Windsurf, Codex, Gemini, Copilot)
├── claude-md-examples/       # 20 geannoteerde real-world CLAUDE.md-sjablonen
├── examples/                 # Volledige werkende projectreferenties
│   ├── agent-sdk/            # Python & TypeScript Agent SDK starters
│   ├── nextjs-saas/          # Next.js + Supabase + Stripe
│   ├── fastapi-ai-app/       # FastAPI + Claude API
│   ├── go-cli-tool/          # Go CLI tool
│   └── dbt-pipeline/         # dbt data pipeline
├── structures/               # 83 projectstructuursjablonen
├── professional-stacks/      # 50 vooraf ingestelde werkruimte-stacks (CLAUDE.md + 8 vaardigheden elk)
├── scripts/                  # Build- en utility-scripts
├── docs/                     # ADR's en interne documentatie
└── index.json                # Volledige doorzoekbare index (npx claudient search)
```

---

## Meest populaire Claude Code-vaardigheden nu

| Vaardigheid / Agent | Wat het doet | Categorie |
|---|---|---|
| `/nextjs-app` | Next.js App Router, Server Components, Server Actions, Drizzle | Backend |
| `/fastapi` | Production FastAPI met auth, Pydantic, async, tests, Docker | Backend |
| `/sre-engineer` | SLO-ontwerp, foutbudgetten, burn rate-waarschuwingen, runbooks | Agent |
| `/security-audit` | OWASP Top 10 scan, geheime blootstelling check voor elke PR | Agent |
| `/invoice-chaser` | Geautomatiseerde AR-herinneringen en betalingsescalatie (geen code nodig) | Kleine bedrijven |
| `/hubspot` | CRM-automatisering via de officiële HubSpot MCP-server | GTM |
| `/rag-architect` | Chunking-strategie, embeddings, retrieval, reranking, eval | AI Engineering |
| `/kubernetes-architect` | K8s-manifesten, Helm-diagrammen, HPA, NetworkPolicy, RBAC | DevOps |
| `/smart-contract-audit` | Solidity-beveiligingsaudit — reentrancy, access control, orakels | Blockchain/Web3 |
| `/unity-csharp` | Unity DOTS/ECS, MonoBehaviour, ScriptableObjects | Game Dev |
| `/firmware-architecture` | HAL, drivers, geheugenlay-out voor ingebedde systemen | Embedded/IoT |

---

<a name="top-100-mcp-servers"></a>

## Top 100 MCP-servers voor Claude Code — Indie Builder Starter Stack

> **De snelste manier om Claude Code uit te breiden.** MCP-servers geven Claude directe toegang tot je tools — GitHub, Figma, Stripe, Jira, Notion, Slack en 94 meer.

**De indie builder starter stack:**

| Server | Wat het doet | Maandelijkse zoekopdrachten |
|--------|-------------|-----------------|
| [Playwright MCP](mcp/playwright-mcp.md) | Browserautomatisering — navigeren, klikken, schermafbeeldingen, scrapen | 82K |
| [Figma MCP](mcp/figma.md) | Designs lezen, tokens extraheren, componenten genereren van specs | 74K |
| [GitHub MCP](mcp/github.md) | PR's lezen, issues maken, code zoeken, releases beheren | 69K |
| [Atlassian MCP](mcp/atlassian.md) | Jira-tickets, Confluence-documenten, sprintbeheer | 40K |
| [Memory MCP](mcp/memory.md) | Persistente kennisgraaf over Claude Code-sessies | — |
| [Stripe MCP](mcp/stripe.md) | Klanten opvragen, abonnementen, betalingen, churngegevens | — |
| [Notion MCP](mcp/notion.md) | Pagina's lezen/schrijven, databases opvragen, docs maken | — |
| [Taskmaster MCP](mcp/taskmaster.md) | AI-taakbeheer met contextisolatie over sessies | — |
| [Postgres MCP](mcp/postgres.md) | SQL-query's, schema-inspectie, tabelbeheer | — |
| [Redis MCP](mcp/redis.md) | Cache-inspectie, sleutelbeheer, geheugenstatistieken | — |
| [Jira MCP](mcp/jira.md) | Issue-beheer, sprintvolgering, JQL-query's | — |
| [Docker MCP](mcp/docker.md) | Container-inspectie, loganalyse, resourcebewaking | — |

**→ [Volledige gids: Top 100 MCP-servers voor Indie Builders](mcp/top-mcp-servers.md)** — installatie-configuraties, tier-rankings en samengestelde bundels voor elke stack.

```bash
npx claudient add mcp starter   # GitHub + Memory + Playwright
npx claudient add mcp all       # Alle 40 afzonderlijke configuratiegidsen
```

---

<a name="claude-for-small-business"></a>

## Claude voor Kleine Bedrijven — 30+ Verticale Vaardigheden

> **De meest volledige gemeenschapskennisbank voor het gebruik van Claude in een klein bedrijf.** Duidelijke Engelse vaardigheden, geen terminal nodig, geschreven voor eigenaren die al voor QuickBooks, Shopify, HubSpot en de rest betalen. Claudient breidt de officiële lancering van Anthropic uit [Claude voor Kleine Bedrijven](guides/claude-for-small-business.md) met 30+ vaardigheden die de lange staart van verticalen en werkstromen bestrijken.

```bash
npx claudient add skills small-business
```

### Claude voor Kleine Bedrijven per Verticaal

Elke gids is een end-to-end landingspagina voor een specifieke industrie — setup, vaardigheid-stack, verwachtingen voor 30/60/90 dagen, FAQ.

| Je bent een... | Begin hier |
|---|---|
| **Solopreneur, solo oprichter, side-hustler** | [Claude voor Solopreneurs](guides/claude-for-solopreneurs.md) |
| **Shopify, Amazon, Etsy of DTC-verkoper** | [Claude voor E-commerce](guides/claude-for-ecommerce.md) |
| **Handelaar, salon, tandarts, fitness, restaurant, makelaar** | [Claude voor Lokale Diensten](guides/claude-for-local-services.md) |
| **Executief coach, zakenraadgever, fractievertegenwoordiger** | [Claude voor Coaches en Consultants](guides/claude-for-coaches-consultants.md) |
| **Nieuwsbrief schrijver, podcaster, cursusmaker** | [Claude voor Makers](guides/claude-for-creators.md) |
| **Eerste keer, wil het volledige overzicht** | [Claude voor Kleine Bedrijven — Productgids](guides/claude-for-small-business.md) |

### Top Vaardigheden voor Kleine Bedrijven

| Vaardigheid | Automatiseert | Werkt met |
|---|---|---|
| `/invoice-chaser` | AR-herinneringen, betalingsescalatie | QuickBooks, Stripe |
| `/quickbooks-workflow` | Maandelijkse afsluiting, reconciliatie | QuickBooks |
| `/cash-flow-forecast` | 30-daagse contantpositie, loonloopbaan | QuickBooks, PayPal |
| `/expense-audit` | Abonnementskriep, dubbele leveranciers | QuickBooks |
| `/content-repurposer` | 1 brief → blog + sociale media + e-mail + advertenties | Canva |
| `/review-response` | Google/Yelp-review-beheer | Google, Yelp |
| `/customer-inquiry` | FAQ-respondent, reacties buiten kantooruren | Website, CRM |
| `/shopify-operations` | Productbeschrijvingen, voorraadbewakingen | Shopify |
| `/sop-writer` | Standaardoperatie-procedures | Elk bedrijf |
| `/weekly-pulse` | KPI-dashboard van al je tools | Multi-tool |

### Verticale-specifieke Vaardigheden

| Verticaal | Vaardigheid |
|---|---|
| E-commerce (multi-platform) | [`/ecommerce-seller`](skills/small-business/ecommerce-seller.md) |
| Salon, spa, kapper | [`/salon-spa-ops`](skills/small-business/salon-spa-ops.md) |
| Tandartspraktijk | [`/dental-practice`](skills/small-business/dental-practice.md) |
| Fitnessstudio, gym | [`/fitness-gym-ops`](skills/small-business/fitness-gym-ops.md) |
| Coachpraktijk | [`/coaching-business`](skills/small-business/coaching-business.md) |
| Online cursus | [`/online-course-creator`](skills/small-business/online-course-creator.md) |
| Nieuwsbrief | [`/newsletter-publisher`](skills/small-business/newsletter-publisher.md) |
| Marketing/creatief bureau | [`/agency-operations`](skills/small-business/agency-operations.md) |
| Bouwvakkers (loodgieterswerk, HVAC, elektriciteit) | [`/contractor-trades`](skills/small-business/contractor-trades.md) |
| Fotostudio | [`/photography-studio`](skills/small-business/photography-studio.md) |
| Boekhoudkundig kantoor | [`/bookkeeper-practice`](skills/small-business/bookkeeper-practice.md) |
| Podcast | [`/podcast-monetizer`](skills/small-business/podcast-monetizer.md) |
| Onroerend goed | [`/real-estate-listing`](skills/small-business/real-estate-listing.md) |
| Restaurant | [`/restaurant-ops`](skills/small-business/restaurant-ops.md) |

### Operator-vaardigheden (Cross-Cutting)

| Vaardigheid | Gebruiksscenario |
|---|---|
| [`/hiring-pipeline`](skills/small-business/hiring-pipeline.md) | Gestructureerd screenen voor hoog volume sollicitantenstroom |
| [`/churn-prevention`](skills/small-business/churn-prevention.md) | Risicoidentificatie en herstel voor abonnementsondernemingen |
| [`/pricing-optimizer`](skills/small-business/pricing-optimizer.md) | Gestructureerde prijsherziening, migratieplan, A/B-testontwerp |
| [`/freelancer-proposal`](skills/small-business/freelancer-proposal.md) | Ontdekkingsgesprek → branded proposal in 20 minuten |
| [`/lead-triager`](skills/small-business/lead-triager.md) | ICP-scoring op nieuwe contacten, geprioriteerde bellijst |
| [`/meeting-to-action`](skills/small-business/meeting-to-action.md) | Transcript → actielijst + vervolgmail |
| [`/customer-feedback-synthesizer`](skills/small-business/customer-feedback-synthesizer.md) | Patroondetectie over 100+ reviews |
| [`/competitor-monitor`](skills/small-business/competitor-monitor.md) | Wat je 3 dichtstbijzijnde concurrenten deze maand hebben gelanceeerd |
| [`/margin-analyzer`](skills/small-business/margin-analyzer.md) | Brutowinst per product, kanaal, klant |
| [`/tax-organizer`](skills/small-business/tax-organizer.md) | CPA-pakket uit QuickBooks en ontvangstenmapje |

### Specialistische Agents voor Kleine Bedrijven

- [`small-business-advisor`](agents/specialists/small-business-advisor.md) — generalistische diagnose en werkstroompriorisering
- [`ecommerce-specialist`](agents/specialists/ecommerce-specialist.md) — voor Shopify/Amazon/Etsy/DTC-operators
- [`local-services-specialist`](agents/specialists/local-services-specialist.md) — voor bouwvakkers, salon, tandarts, fitness, restaurant, onroerend goed
- [`restaurant-specialist`](agents/roles/restaurant-specialist.md) — restaurantspecifieke operaties
- [`real-estate-specialist`](agents/roles/real-estate-specialist.md) — onroerendgoedagent en makelaarshuisoperaties

```bash
npx claudient add agents small-business
```

---

## FAQ — Claude voor Kleine Bedrijven

### Wat is Claude voor Kleine Bedrijven?

Claude voor Kleine Bedrijven is Anthropic's kleine-bedrijfs-gericht productlaag in Claude Cowork, gelanceerd op 13 mei 2026, met 15 officiële werkstromen. Claudient is de gemeenschapskennisbank die die werkstromen uitbreidt met 30+ aanvullende vaardigheden die de lange staart van verticalen (tandartsen, salon, bouwvakkers, fotografie, coaching, e-commerce) en operator-werkstromen (aanwerving, churn, prijzen, proposals) bestrijken. [Lees de productgids](guides/claude-for-small-business.md).

### Is Claude goed voor kleine bedrijfseigenaren?

Ja. Eigenaren van 1-50 persoonlijke bedrijven besparen doorgaans 6-12 uur per week binnen 30 dagen, op het mechanische werk dat eerder hun avonden vulde — facturering, vervolgingslead, wekelijkse rapportage, content-hergebruik, klanten-FAQ. De Claudient-vaardigheden zijn geschreven met exploitant als eerste, geen terminal nodig.

### Hoe verschilt Claude van ChatGPT voor kleine bedrijven?

ChatGPT is een generalistische chatassistent. Claude voor Kleine Bedrijven maakt verbinding met je werkelijke bedrijfstools — QuickBooks, HubSpot, PayPal, Google Workspace, Shopify — en produceert outputs die zijn gebaseerd op je echte gegevens. ChatGPT kan een generieke factuurherinnering schrijven; Claude leest je werkelijke AR-verouderingrapport en concept gepersonaliseerde herinneringen per factuur. Het verschil stijgt in elke werkstroom.

### Hoeveel kost Claude voor een klein bedrijf?

$20/maand voor Claude Pro dekt de meeste solo-eigenaren en kleine operaties. $30/stoel/maand voor Claude Team als je een partner, kantoormanager of assistent hebt die de werkstromen gebruikt. $100/maand voor Claude Max als je 6+ werkstromen dagelijks op grote datasets uitvoert. Al het andere — QuickBooks, HubSpot, Shopify — betaal je al voor.

### Moet ik weten hoe ik moet coderen?

Nee. De officiële Claude voor Kleine Bedrijven-werkstromen zijn point-and-click in Claude Cowork. De Claudient-vaardigheden in deze repo worden geactiveerd door gewone Engelse tekst naar Claude te typen. De enige setup is OAuth-verbinding met je bestaande tools, wat een paar klikken per tool kost.

### Kan Claude mijn QuickBooks-gegevens lezen?

Ja, eenmaal geautoriseerd met de QuickBooks Online-integratie via OAuth. Claude leest je facturen, transacties, klanten en rapporten op het moment dat een werkstroom wordt uitgevoerd. Het peilt je account niet op de achtergrond, en Anthropic gebruikt verbonden bedrijfsgegevens niet om Claude te trainen.

### Kan Claude mijn boekhouder of CPA vervangen?

Nee, en je wilt dat ook niet. Claude bereidt de reconciliatie voor, organiseert de ontvangsten en ontwerp de P&L. Je boekhouder of CPA beoordeelt en ondertekent. De gecombineerde kosten zijn lager dan een boekhouder alleen, en de doorlooptijd is sneller.

### Werkt Claude met Shopify?

Ja, via de officiële Shopify MCP. De [Shopify Operations-vaardigheid](skills/small-business/shopify-operations.md) en de [Ecommerce Seller-vaardigheid](skills/small-business/ecommerce-seller.md) bestrijken productbeschrijvingen, voorraadbewakingen, SEO-titels, verzamelingsupdates en cross-platform-listing-werk.

### Werkt Claude met HubSpot?

Ja, via de officiële HubSpot MCP. [Lead Triager](skills/small-business/lead-triager.md), [Cold Outreach](skills/small-business/cold-outreach.md) en [Email Campaign](skills/small-business/email-campaign.md) lezen allemaal van en schrijven naar HubSpot via de integratie.

### Hoe kan ik beginnen?

Voer `npx claudient add skills small-business` uit om elke kleine-bedrijfs-vaardigheid in je Claude Code-omgeving te installeren. Begin vervolgens met één werkstroom — [Invoice Chaser](skills/small-business/invoice-chaser.md) is het startpunt met de hoogste ROI voor de meeste bedrijven — en controleer de output zorgvuldig op de eerste run.

### Loont Claude voor Kleine Bedrijven zich?

Voor bedrijven waar de eigenaar 6+ uur per week besteedt aan de activiteiten die Claude omvat (facturering, vervolgingslead, rapportage, inhoud, klanten-FAQ, verticale operaties), ja — meestal een 3-5x ROI binnen 60 dagen. Voor bedrijven die al strak geautomatiseerde stacks gebruiken, is de marginale winst kleiner. Lees de [ROI-gids](guides/small-business-roi.md) voor de rekenmachine en benchmarkgegevens.

### Wat als ik geen van deze tools gebruik?

De Claudient-vaardigheden worden op copy-paste-gegevens uitgevoerd wanneer een directe integratie niet beschikbaar is. Je verliest wat workflowautomatisering maar behoudt de gestructureerde concepten, scoring en analyse. [Review Response](skills/small-business/review-response.md) werkt bijvoorbeeld op Google-reviews die je eraan hebt geplakt, zelfs zonder Google-integratie.

---

<a name="agents"></a>

## 182+ Claude Code Specialistische Agents

Specialistische agents die zijn voortgebracht met het Agent-hulpmiddel in Claude Code. Elk heeft specifieke modelbeperkingen en triggervoorwaarden, zodat Claude het juiste werk aan de juiste expert delegeert.

### C-Suite Advisors (15 agents)

| Agent | Domein |
|---|---|
| `ceo-advisor` | Strategie, bestuursbereiding, beleggersverhoudingen, organisatieontwerp |
| `cto-advisor` | Architectuurbeslissingen, bouwen vs kopen, technische strategie |
| `cfo-advisor` | Eenheidseconomie, financiering, kasbeheer, modellering |
| `cmo-advisor` | GTM-strategie, kanaaltoewijzing, positionering, vraagopwekking |
| `ciso-advisor` | Veiligheidsprogramma-ontwerp, risicopriorisering, bestuurrapportage |
| `coo-advisor` | Procesontwerp, OKR's, schaaloperaties |
| `cpo-advisor` | Roadmap, discovery, pricing, PLG-strategie |
| `cro-advisor` | Opbrengsten forecasting, NRR-analyse, verkoopmodelontwerp |
| `general-counsel` | Juridisch risico, contractreview, complianceoverzicht |
| `chief-of-staff` | Bedrijfsritme, OKR-facilitering, CEO-hefboom |
| + 5 meer | CDO, CAIO, VPE, CHRO, CCO |

### Engineering Specialists

`sre-engineer` · `chaos-engineer` · `penetration-tester` · `kubernetes-architect` · `security-auditor` · `platform-engineer` · `network-engineer` · `rust-engineer` · `mlops-engineer` · `graphql-architect` · `websocket-engineer` · `fullstack-developer` · `llm-architect` · `codebase-orchestrator` · `multi-agent-coordinator` + 30 meer

### Domain Specialists

`competitive-analyst` · `market-researcher` · `trend-analyst` · `quant-analyst` · `fintech-engineer` · `healthcare-admin` · `legal-advisor` · `nlp-engineer` · `data-pipeline-architect` + meer

```bash
npx claudient add agents
```

---

<a name="skills-by-category"></a>

## Vaardigheden per Categorie — 400+ Claude Code-vaardigheden

**400+ vaardigheden · 19 categorieën · EN · FR · DE · NL · ES**

| Categorie | Aantal | Topvaardigheden |
|---|---|---|
| `backend/nodejs` | 25 | Next.js, Hono, NestJS, tRPC, Astro, Svelte, React Native, Angular, WebSockets |
| `backend/python` | 5 | FastAPI, Django, pytest, Python Async |
| `backend/other` | 11 | Go, C#/.NET, Spring Boot, Rust, Rails, Laravel, Elixir, Flutter, PHP, Ruby, Swift |
| `devops-infra` | 36 | AWS/Azure/GCP, Kubernetes, Helm, Terraform, Terragrunt, Docker, GitHub Actions, Sentry, OpenTelemetry |
| `ai-engineering` | 20 | Claude API, Vercel AI SDK, LangGraph, RAG Architect, Prompt Caching, Batch API, MCP Builder, Agent Teams, Ultraplan, Ultrareview |
| `data-ml` | 15 | dbt, Spark, Kafka, MLOps, NLP Pipelines, Reinforcement Learning, Pandas/Polars, PyTorch |
| `database` | 12 | Drizzle, Prisma, PostgreSQL, Supabase, Neon, Redis, Elasticsearch, Blockchain/Solidity |
| `gtm` | 32 | HubSpot, SDR-agent, Lead Enrichment, E-mailautomatisering, CRM Hygiene, Deal Desk, Revenue Ops |
| `legal` | 21 | Contractreview, NDA, DSAR, GDPR, SOC 2, EU AI Act, ISO 27001, IP Clearance, Privacy PIA |
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

Event-driven automation voor Claude Code — wordt uitgevoerd buiten Claude's context als echte shell-processen op de juiste lifecycle-events.

| Hook | Event | Wat het doet |
|---|---|---|
| `secret-scanner` | PreToolUse | Blokkeert schrijvingen met API-sleutels of inloggegevens |
| `tdd-guard` | PostToolUse | Blokkeert implementatiebestanden zonder een overeenkomstige test |
| `injection-scanner` | PreToolUse | Scant toolinvoer op pogingen voor prompt-injectie |
| `plannotator` | ExitPlanMode | Interactieve planannotatie voordat Claude wordt uitgevoerd |
| `lint-check` | PostToolUse | Auto-lint TypeScript/Python na elke bewerking van het bestand |
| `test-runner` | PostToolUse | Voert gerelateerde tests uit na het bewerken van een bronbestand |
| `telegram-pr-notify` | PostToolUse | Stuurt Telegram-bericht wanneer een PR wordt gemaakt |
| `keepalive-poke` | Stop | Zet autonome sessies voort zonder interventie |
| `sound-system` | All events | Platformeigen geluiden voor 27 Claude Code-events |
| `session-context-loader` | SessionStart | Injecteert datum, branch, recente commits bij sessiestart |
| `ntfy-push` | Notification | Mobiele push-meldingen via ntfy |
| `tts-announcer` | Stop | Spreekt Claude's uiteindelijke bericht hardop uit |
| + 28 meer | — | Auto-stage git, transcriptback-up, output compressor, bug logger, Slack notifier, WhatsApp gate... |

---

## Gidsen & Werkstromen — 100+ Claude Code Gidsen en Werkstromen

### Gidsen (100+)

[Aan de slag](guides/getting-started.md) · [Agent Frontmatter Referentie](guides/agent-frontmatter.md) · [Skills Frontmatter Referentie](guides/skills-frontmatter.md) · [Beslissingskader](guides/decision-framework.md) · [Claude Managed Agents](guides/claude-managed-agents.md) · [Geavanceerd Toolgebruik](guides/advanced-tool-use.md) · [Spraakdictaat](guides/voice-dictation.md) · [Desktop App](guides/desktop-app.md) · [Opus 4.7 Migratie](guides/opus-47-migration.md) · [Hooks Kookboek](guides/hooks-cookbook.md) · [Multi-Agent-patronen](guides/multi-agent-patterns.md) · [Subagent-patronen](guides/subagent-patterns.md) · [Contextbeheer](guides/context-management.md) · [Token-kostenreductie](guides/token-cost-reduction.md) · [Meldingssetup](guides/notifications-setup.md) · [Plugin Authoring](guides/plugin-authoring.md) · [RIPER Framework](guides/riper-framework.md) · [RPI Workflow](guides/rpi-workflow.md) · [CLI Referentie](guides/cli-reference.md) · [Instellingenbereik](guides/settings-scope.md) · [Waarom Claude Code gebruiken](guides/why-use-claude-code.md) · [Routines](guides/routines.md) · [Computer Use](guides/computer-use.md) · [Ultraplan](guides/ultraplan.md) · [Auto Mode](guides/auto-mode.md) + 39 meer

### Werkstromen (45+)

[RPI Feature Development](workflows/rpi-feature.md) · [RIPER](workflows/riper.md) · [Incremental Build](workflows/incremental-build.md) · [Pre-Human Review](workflows/pre-human-review.md) · [Autonomous Loop](workflows/autonomous-loop.md) · [Worktree Lifecycle](workflows/worktree-lifecycle.md) · [Multi-Agent Saga](workflows/multi-agent-saga.md) · [Chaos Game Day](workflows/chaos-game-day.md) · [Error Budget](workflows/error-budget.md) · [Bug Investigation](workflows/bug-investigation.md) · [Compound Engineering](workflows/compound-engineering.md) · [Session Learning](workflows/session-learning.md) + meer

---

## Wat Is Inbegrepen — Complete Claude Code Toolkit

| Type | Aantal |
|---|---|
| **Vaardigheden** | **400+** |
| **Agents** | **182+** |
| **Werkruimte-stacks** | **42** |
| **Hooks** | **40** |
| **MCP-configuratieguides** | **40** |
| **Routines** | **10** |
| **Gidsen** | **100+** |
| **Werkstromen** | **45+** |
| **Prompts** | **31+** |
| **Regels** | **32** |
| **Talen** | **5 (EN · FR · DE · NL · ES)** |

---

<a name="translations"></a>

## 5 Talen — Claude Code-vaardigheden in EN · FR · DE · NL · ES

Elke vaardigheid, agent, gids, werkstroom en prompt is beschikbaar in:

**🇬🇧 Engels · 🇫🇷 Frans · 🇩🇪 Duits · 🇳🇱 Nederlands · 🇪🇸 Spaans**

```bash
npx claudient add all --lang fr   # Frans
npx claudient add all --lang de   # Duits
npx claudient add all --lang nl   # Nederlands
npx claudient add all --lang es   # Spaans
```

---

## Draag een Claude Code-vaardigheid bij — Uitgelicht Worden

Claudient wordt door de gemeenschap aangestuurd. Elke vaardigheid staat in één markdown-bestand. Het inzenden van een Claude Code-vaardigheid neemt minder tijd in beslag dan het indienen van een GitHub-issue.

1. Lees de [Gids voor Vaardigheid Authoring](guides/skill-authoring.md) — 5 minuten
2. Fork, voeg je vaardigheid in één `.md`-bestand toe
3. Dien een PR in — samengevoegde vaardigheden staan uitgelicht in **Meest Populair**

**Aanbevolen GitHub-onderwerpen voor Claude Code-projecten:** `claude` · `claude-code` · `anthropic` · `llm-tools` · `mcp` · `developer-tools` · `prompt-engineering` · `ai-assistant`

**[GitHub Discussions](https://github.com/UitbreidenOS/Claudient/discussions) · [CONTRIBUTING.md](CONTRIBUTING.md) · [Reddit](https://www.reddit.com/r/uitbreiden/)**

---

## Gebouwd door Uitbreiden

Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — het bouwen van AI-producten en B2B-tools met ontwikkelaarsgemeenschappen.

[![Reddit](https://img.shields.io/badge/Reddit-r%2Fuitbreiden-FF4500?logo=reddit&logoColor=white)](https://www.reddit.com/r/uitbreiden/)
[![YouTube](https://img.shields.io/badge/YouTube-%40UITBREIDEN-FF0000?logo=youtube&logoColor=white)](https://www.youtube.com/@UITBREIDEN)
[![Website](https://img.shields.io/badge/Website-uitbreiden.com-f97316)](https://uitbreiden.com/)

---

## Licentie

Duaal gelicentieerd:

- **Code** — [AGPL-3.0](LICENSE-CODE). De Astro-site, hook-scripts, npm-pakketbron, alles wat kan worden uitgevoerd.
- **Inhoud** — [CC-BY-SA-4.0](LICENSE-CONTENT). Alle markdown-vaardigheden, agents, hooks, MCP-configs, werkstromen, gidsen, prompts, regels en documentatie.

Zie [LICENSE](LICENSE) voor de grondslag en volledige details. Voor commerciële licentieaanvragen, schrijf naar [hello@uitbreiden.com](mailto:hello@uitbreiden.com).

© 2026 [Uitbreiden](https://uitbreiden.com/) · Tushar Aggarwal
