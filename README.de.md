# Claude Code Fähigkeiten, Agenten & Plugins — Claudient

**Claudient** ist die größte Open-Source-Wissensdatenbank für **Claude Code** — Anthropics KI-Coding-CLI. Sie enthält 400+ Domain-Fähigkeiten, 182+ Spezialistagenten, 42 vorkonfigurierte Workspace-Stacks, 41 MCP-Konfigurationen, 100+ Slash-Befehle, Hooks und Workflows – alles in 30 Sekunden installierbar. Keine wiederholten Erklärungen. Claude kennt bereits Ihren Bereich.

**Neu bei Claude Code?** Claude Code ist Anthropics offizieller Command-Line-KI-Assistent für Softwareentwicklung – er liest Ihre Codebasis, führt Befehle aus, bearbeitet Dateien und erledigt Aufgaben autonom in Ihrem Terminal oder IDE. Claudient ist die Open-Source-Community-Bibliothek, die es mit expertenweit fortgeschrittenen Fähigkeiten über jeden Stack und jede Domain erweitert.

[![npm version](https://img.shields.io/npm/v/claudient?color=f97316&label=npm)](https://www.npmjs.com/package/claudient)
[![npm downloads](https://img.shields.io/npm/dm/claudient?color=f97316)](https://www.npmjs.com/package/claudient)
[![GitHub Stars](https://img.shields.io/github/stars/Claudient/Claudient?color=f97316&label=stars)](https://github.com/Claudient/Claudient)
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

**Erklären Sie Ihren Stack Claude nicht mehr bei jeder Sitzung erneut.**

Claudient ist die größte Open-Source-Wissensdatenbank für **Claude Code** — 400+ Fähigkeiten, 182+ Spezialistagenten, 100+ Slash-Befehle, 100+ Leitfäden, 40 Hooks, 45 Workflows, 83 Projektstrukturen, 42 Workspace-Stacks, 10 Personas, 32 Regeln, 41 MCP-Server-Konfigurationen, 10 Automatisierungsroutinen, 20 kommentierte CLAUDE.md-Beispiele, Cross-Harness-Adapter (Cursor/Windsurf/Codex/Gemini/Copilot), plus Output-Stile, Themen, Statuszeilen, Tastenbindungen, Einstellungsvorlagen und ein Agent-SDK-Paket – alles in 30 Sekunden installierbar.

```bash
# Installation als Claude Code Plugin Marketplace (empfohlen)
/plugin marketplace add Claudient/Claudient
/plugin install claudient-everything@claudient

# Oder über npm
npx claudient add all
```




---

## Installation als Claude Code Plugin

Claudient wird als natives Claude Code **Plugin Marketplace** bereitgestellt. Fügen Sie es einmal hinzu und installieren Sie dann nur die Domains, die Sie benötigen – Fähigkeiten aktivieren sich automatisch basierend auf dem, womit Sie arbeiten, Agenten und Hooks sind enthalten.

```bash
# 1. Marketplace hinzufügen
/plugin marketplace add Claudient/Claudient

# 2. Ein Domain-Plugin installieren (oder das Everything-Bundle)
/plugin install claudient-gtm@claudient
/plugin install claudient-devops-infra@claudient
/plugin install claudient-everything@claudient
```

**19 Plugins, 400+ Auto-Invoking-Fähigkeiten, 182 Agenten, 100 Slash-Befehle:**

| Plugin | Fähigkeiten | Plugin | Fähigkeiten |
|---|---|---|---|
| `claudient-productivity` | 66 | `claudient-finance` | 16 |
| `claudient-small-business` | 47 | `claudient-data-ml` | 15 |
| `claudient-backend` | 41 | `claudient-product` | 15 |
| `claudient-devops-infra` | 36 | `claudient-automation` | 14 |
| `claudient-gtm` | 32 | `claudient-database` | 12 |
| `claudient-marketing` | 22 | `claudient-git` | 3 |
| `claudient-legal` | 21 | `claudient-commands` | 100 Befehle |
| `claudient-sdr` | 22 | `claudient-personas` | 10 Personas |
| `claudient-ai-engineering` | 17 | `claudient-finance-payments` | 2 |
| `claudient-everything` | Meta-Bundle | | |

Jede Fähigkeit wird mit `claude plugin validate --strict` validiert. Bevorzugen Sie npm? `npx claudient add all` funktioniert immer noch.

---

## Über Fähigkeiten hinaus – das vollständige Claude Code Toolkit

Claudient deckt alle Primitive ab, die Claude Code unterstützt, nicht nur Fähigkeiten:

| Kategorie | Was ist enthalten | Installation |
|---|---|---|
| **Slash-Befehle** | 100+ Befehle über 12 Kategorien – Git, Testing, Refactor, Docs, Debug, DevOps, Datenbank, Sicherheit, Frontend, API, AI-Engineering, Produktivität | `claudient-commands` Plugin oder `commands/` Verzeichnis |
| **Personas** | 10 Betriebsprofile – Startup-CTO, Solo-Founder, Growth-Marketer, Indie-Hacker, Enterprise-Architect, Data-Driven-PM, DevRel-Advocate, Agency-Operator, AI-Product-Builder, Fractional-Exec | `claudient-personas` Plugin oder `personas/` Verzeichnis |
| **Output-Stile** | 8 Stile – Prägnant, Mentor, Code-Reviewer, Architekt, Plain-Operator, Security-Paranoid, Diagram-First, TDD-Enforcer | In `~/.claude/output-styles/` kopieren |
| **Themen** | 10 Themen – Dracula, Nord, Tokyo Night, Catppuccin, Gruvbox, Solarized, Monokai, Rosé Pine, + Claudient-Marke | In `~/.claude/themes/` kopieren, dann `/theme` verwenden |
| **Statuszeilen** | 6 Skripte – Minimal, Vollständig, Cost-Watch, Context-Budget, Git-Focused, Rate-Limit | Auf `settings.json` `statusLine` verweisen |
| **Tastenbindungen** | 4 Voreinstellungen – Vim, Emacs, Ergonomisch, Power-User | In `~/.claude/keybindings.json` zusammenführen |
| **Einstellungsvorlagen** | 5 Anfänger – Solo-Dev, Team, Security-Hardened, Enterprise, Minimal | In `.claude/settings.json` ablegen |
| **Hooks** | 40 über alle 2026-Events – einschließlich neuer `http`, `prompt` und `agent` Hook-Typen | Siehe [`hooks/`](hooks/) |
| **Routinen** | 10 geplante Cloud-Agent-Vorlagen – Daily-Standup, PR-Triage, Dependency-Audit, Incident-Watch, Weekly-Retro, Sprint-Planning, Code-Review-Rotation, Security-Scan, Changelog-Generator, Cost-Audit | Siehe [`routines/`](routines/) |
| **Computer-Use-Fähigkeiten** | 4 – UI-Testing, Visual-QA, Legacy-App-Automation, Screenshot-Verify | `/plugin install` oder kopieren |
| **CLAUDE.md-Galerie** | 20 kommentierte reale Vorlagen – Next.js SaaS, FastAPI, Monorepo, CLI-Tool, dbt, Mobil, OSS-Bibliothek, K8s, Kleinunternehmen, Rechtlich, Fintech, Game-Dev, Eingebettet und mehr | Siehe [`claude-md-examples/`](claude-md-examples/) |
| **Cross-Harness-Adapter** | Verwenden Sie Claudient in Cursor, Windsurf, Codex CLI, Gemini Code Assist, GitHub Copilot – Adapter-Guides + Install-Skript | Siehe [`compatibility/`](compatibility/) |
| **Agent-SDK-Paket** | Vollständiger Guide + lauffähige Python- & TypeScript-Starter-Agenten | Siehe [`examples/agent-sdk/`](examples/agent-sdk/) |

---

## Slash-Befehle

<a name="slash-commands"></a>

100+ Slash-Befehle über 12 Kategorien – mit `/Befehlsname` in jeder Claude Code-Sitzung aufrufen:

| Kategorie | Befehle |
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

Installation: `/plugin install claudient-commands@claudient` oder kopieren Sie [`commands/`](commands/) in `.claude/commands/`.

---

## Warum Claude Code Fähigkeiten verwenden?

| Problem | Ohne Claudient | Mit Claudient |
|---|---|---|
| **Domain-Kontext** | Erklären Sie Ihren Stack bei jeder Sitzung erneut | Fähigkeiten aktivieren sich automatisch |
| **Spezialisierte Aufgaben** | Claude rät bestenfalls Best Practices | 182+ Experten-Agenten mit eingeschränkten Tools |
| **Tool-Integrationen** | Manuelles Kopieren zwischen Tools | 41 vorkonfigurierte MCP-Server-Konfigurationen |
| **Event-Automatisierung** | Manuelle Auslöser, vergessene Schritte | 40 Hooks, die bei den richtigen Events auslösen |
| **Team / Sprache** | Nur Englisch, universelle Konfiguration | 5 Sprachen, zusammenstellbar pro Projekt |
| **Kleinunternehmen** | Generische KI-Ratschläge | 30+ vertikale Fähigkeiten für echte Workflows |

**Ein Befehl gibt Claude sofortige Expertise über jeden Bereich, in dem Sie arbeiten.**

---

## Für wen ist das gedacht?

| Sie sind... | Sie erhalten... |
|---|---|
| **Entwickler / Vibe-Coder** | Fähigkeiten für Next.js, FastAPI, Rust, Go, Drizzle, tRPC, Docker, K8s, Terraform, Unity, Flutter, Solidity und 200+ weitere Stacks – aktivieren Sie mit einem Slash-Befehl |
| **Mobile-Entwickler** | React Native/Expo, Flutter, SwiftUI, Jetpack Compose, Push-Benachrichtigungen, Offline-First, App-Store-Deployment |
| **Game-Entwickler** | Unity C#, Unreal C++, Godot GDScript, Game-Networking, Physik, Level-Design, Performance-Profiling |
| **Embedded/IoT-Ingenieur** | Firmware-Architektur, RTOS, BLE, Sensor-Integration, Low-Power-Design, OTA-Updates |
| **Web3-Builder** | Smart-Contract-Audit, DeFi-Protokolle, NFT-Marktplätze, DAO-Governance, Gas-Optimierung |
| **KI-Produktentwickler** | RAG-Architekt, LangGraph, Prompt-Engineering, LLM-Eval, MCP-Server-Builder, Claude-API-Muster mit Prompt-Caching |
| **GTM / RevOps-Ingenieur** | HubSpot-MCP, SDR-Agent, Lead-Enrichment, CRM-Hygiene, Email-Automatisierung, Deal-Desk |
| **Finanz- / Jura-Fachleute** | DCF-Modelle, 3-Statement-Modelle, IC-Memos, Vertragsüberprüfung, GDPR, SOC 2, EU-KI-Gesetz – mit obligatorischen manuellen Überprüfungs-Gates |
| **Kleinunternehmensinhaber** | Fähigkeiten in einfacher Sprache für Rechnungsstellung, Cashflow, Shopify, Bewertungen, SOPs – kein Terminal erforderlich |
| **DevOps / Platform-Team** | SLO-Design, Chaos-Engineering, Helm, Kubernetes, Terraform, SRE-Runbooks, Kostenerfassung |

---

## Claude Code Entwickler-FAQ

### Was ist Claude Code?
Claude Code ist Anthropics offizieller Command-Line-KI-Assistent für Softwareentwicklung. Er läuft in Ihrem Terminal oder IDE (VS Code, JetBrains), liest Ihre Codebasis, bearbeitet Dateien, führt Befehle aus und erledigt Aufgaben autonom. Installieren Sie es mit `npm install -g @anthropic-ai/claude-code` oder über die Desktop-App.

### Was sind Claude Code Fähigkeiten?
Fähigkeiten sind Markdown-Dateien in `.claude/commands/` (oder über das Plugin-System geladen), die wiederverwendbare Experten-Verhaltensweisen definieren. Wenn sie durch einen Slash-Befehl oder Schlüsselwörter ausgelöst werden, liest Claude Code die Fähigkeit und wendet seine Domain-Expertise auf Ihren aktuellen Kontext an – keine wiederholten Prompts erforderlich.

### Wie unterscheidet sich Claudient vom Schreiben einer CLAUDE.md-Datei?
Eine `CLAUDE.md` setzt Projekt-Level-Kontext für ein Repo. Claudient-Fähigkeiten sind Domain-Level und wiederverwendbar über jedes Projekt – 400+ Fähigkeiten, die FastAPI, Kubernetes, HubSpot, React, Terraform und Hunderte weitere Stacks abdecken.

### Funktioniert Claudient mit Cursor, GitHub Copilot oder anderen KI-Coding-Tools?
Claudient ist für Claude Code (CLI und IDE-Erweiterungen) konzipiert. Cross-Harness-Adapter in [`compatibility/`](compatibility/) unterstützen auch Cursor, Windsurf, Codex CLI, Gemini Code Assist und GitHub Copilot.

### Wie installiere ich Claude Code Fähigkeiten von Claudient?
Führen Sie `npx claudient add all` aus, um alles zu installieren, oder verwenden Sie das Claude Code Plugin-System: `/plugin marketplace add Claudient/Claudient` gefolgt von `/plugin install claudient-everything@claudient`. Installieren Sie nach Domain mit `npx claudient add skills backend` oder `npx claudient add skills devops-infra`.

---

## Profession Packs — 25 Rollenspezifische Claude Code Konfigurationen

25 berufsspezifische Packs – vorkonfigurierte Skill-Stacks, Agenten, Workflows und tägliche Routinen für jede Rolle.

| Beruf | Installation | Leitfaden |
|---|---|---|
| SDR / Vertriebsmitarbeiter | `npx claudient add skill gtm/sdr-research-brief` | [Leitfaden](guides/for-sdr.md) |
| Gründer / CEO | `npx claudient add skill gtm/founder-operating-system` | [Leitfaden](guides/for-founder.md) |
| Produktmanager | `npx claudient add skill product/product-discovery` | [Leitfaden](guides/for-product-manager.md) |
| DevOps / Platform-Ingenieur | `npx claudient add skill devops-infra/kubernetes-architect` | [Leitfaden](guides/for-devops-engineer.md) |
| Content-Vermarkter / SEO | `npx claudient add skill marketing/seo-audit` | [Leitfaden](guides/for-content-marketer.md) |
| Finanzanalyst / CFO | `npx claudient add skill finance/dcf-model` | [Leitfaden](guides/for-finance-analyst.md) |
| Jura / Compliance-Beauftragte | `npx claudient add skill legal/contract-review` | [Leitfaden](guides/for-legal-compliance.md) |
| Wachstums-Hacker / Performance-Vermarkter | `npx claudient add skill marketing/paid-ads` | [Leitfaden](guides/for-growth-marketer.md) |
| Customer Success Manager | `npx claudient add skill gtm/customer-success` | [Leitfaden](guides/for-customer-success.md) |
| Personalbeschaffung / HR | `npx claudient add skill small-business/hiring-pipeline` | [Leitfaden](guides/for-recruiter.md) |
| UX-Designer / Forscher | `npx claudient add skill product/ux-research` | [Leitfaden](guides/for-ux-designer.md) |
| Technischer Autor | `npx claudient add skill productivity/adr-writer` | [Leitfaden](guides/for-technical-writer.md) |
| Account Executive | `npx claudient add skill gtm/deal-desk` | [Leitfaden](guides/for-account-executive.md) |
| Operations Manager / COO | `npx claudient add skill small-business/sop-writer` | [Leitfaden](guides/for-operations-manager.md) |
| Email-Vermarkter | `npx claudient add skill gtm/email-automation` | [Leitfaden](guides/for-email-marketer.md) |
| E-Commerce-Operator | `npx claudient add skill small-business/ecommerce-seller` | [Leitfaden](guides/for-ecommerce-operator.md) |
| CTO / Tech-Lead | `npx claudient add skill productivity/tech-debt-tracker` | [Leitfaden](guides/for-cto.md) |
| Immobilienmakler | `npx claudient add skill small-business/real-estate-listing` | [Leitfaden](guides/for-real-estate-agent.md) |
| Investor / VC-Analyst | `npx claudient add skill finance/ic-memo` | [Leitfaden](guides/for-investor.md) |
| Datenanalyst / BI-Analyst | `npx claudient add skill data-ml/dbt` | [Leitfaden](guides/for-data-analyst.md) |
| Freiberufler / Berater | `npx claudient add skill small-business/freelancer-proposal` | [Leitfaden](guides/for-freelancer.md) |
| Geschäftsführender Assistent / Chief of Staff | `npx claudient add skill productivity/meeting-to-action` | [Leitfaden](guides/for-executive-assistant.md) |
| Pädagoge / Kurs-Creator | `npx claudient add skill small-business/online-course-creator` | [Leitfaden](guides/for-educator.md) |
| Softwareingenieur | `npx claudient add skills backend` | verwendet vorhandene Fähigkeiten – noch kein eigener Leitfaden |
| Gesundheitswesen-Administrator | `npx claudient add skills small-business` | verwendet vorhandene Fähigkeiten – noch kein eigener Leitfaden |

Jedes Pack enthält: Domain-spezifische Slash-Befehle, eine kuratierte Agenten-Roster, einen täglichen Workflow, einen 30-Tage-Rampen-Plan und Tool-Integrations-Konfigurationen.

---

## Workspace-Stacks — 42 Vorkonfigurierte Domain-Workspaces

Vollständige Workspace-Stacks mit einer `CLAUDE.md`, 8 Fähigkeiten und Projektstruktur – jeweils für eine bestimmte Rolle oder Domain konzipiert. Legen Sie einen Stack in Ihr Projekt ab und Claude verfügt sofort über Domain-Expertise.

### Engineering & Infrastruktur

| Stack | Domain | Fähigkeiten |
|---|---|---|
| `fullstack_developer_stack` | Full-Stack-Web-Entwicklung | 8 |
| `frontend_engineer_stack` | React, Vue, Angular, Svelte | 8 |
| `api_developer_stack` | API-Design, OpenAPI, Auth, Webhooks | 8 |
| `devops_platform_stack` | Kubernetes, Terraform, CI/CD, IaC | 8 |
| `sre_stack` | SLOs, Error Budgets, Incident Response | 8 |
| `security_engineer_stack` | Penetrationstests, Compliance, Threat Modeling | 8 |
| `database_admin_stack` | Query-Optimierung, Migrationen, Backups | 8 |
| `mobile_developer_stack` | React Native, Flutter, SwiftUI, Compose | 8 |
| `game_developer_stack` | Unity, Unreal, Godot, Networking, Physik | 8 |
| `embedded_iot_stack` | Firmware, RTOS, BLE, OTA-Updates | 8 |
| `blockchain_web3_stack` | Smart Contracts, DeFi, NFTs, DAOs | 8 |

### Daten & KI

| Stack | Domain | Fähigkeiten |
|---|---|---|
| `data_engineer_stack` | dbt, Spark, Airflow, Data Pipelines | 8 |
| `mlai_engineer_stack` | ML-Modelle, Training, Deployment, MLOps | 8 |
| `analytics_engineer_stack` | BI, Dashboards, Metriken, Experimentation | 8 |

### Business & GTM

| Stack | Domain | Fähigkeiten |
|---|---|---|
| `founder_ceo_stack` | Strategie, Fundraising, Team-Building | 8 |
| `finance_cfo_stack` | Finanzmodellierung, Unit-Economics, Reporting | 8 |
| `gtm_engineer_stack` | HubSpot, CRM, Revenue Ops, Analytics | 8 |
| `content_marketing_stack` | SEO, Content-Strategie, Copywriting | 8 |
| `customer_success_stack` | Retention, NRR, Onboarding, Health Scores | 8 |
| `sales_operations_stack` | Pipeline, Forecasting, Deal Desk | 8 |
| `product_manager_stack` | Discovery, Roadmaps, Experiments | 8 |
| `growth_engineer_stack` | Experimentation, A/B-Testing, Growth Loops | 8 |
| `brand_manager_stack` | Brand-Strategie, Positioning, Guidelines | 8 |

### Operations & Support

| Stack | Domain | Fähigkeiten |
|---|---|---|
| `operations_manager_stack` | Prozess-Optimierung, SOPs, Vendor-Management | 8 |
| `user_research_stack` | Studien-Design, Interviews, Synthesis | 8 |
| `hr_people_operations_stack` | HR-Workflows, People Analytics | 8 |
| `qa_testing_engineer_stack` | Test-Strategie, Automatisierung, Qualität | 8 |
| `technical_writer_stack` | Dokumentation, API-Docs, Style Guides | 8 |
| `legal_operations_stack` | Vertragsmanagement, Compliance | 8 |
| `podcast_producer_stack` | Episode-Produktion, Distribution | 8 |
| `newsletter_writer_stack` | Newsletter-Writing, Growth | 8 |
| `youtube_creator_stack` | Videoproduktion, SEO, Growth | 8 |
| `investor_vc_stack` | Deal Flow, Due Diligence, Portfolio | 8 |
| `recruiter_ta_stack` | Sourcing, Screening, Onboarding | 8 |
| `ecommerce_operator_stack` | Shopify, Marketplace, Inventory | 8 |
| `b2b_consultant_stack` | Client-Management, Proposals | 8 |
| `ai_sdr_stack` | KI-gestützte SDR-Workflows | 8 |
| `community_manager_stack` | Community-Engagement, Moderation | 8 |
| `bio_research_stack` | Experimentelles Design, Biostatistik, Publication | 8 |
| `healthcare_stack` | Klinische Ops, HIPAA, EHR-Integration, Telehealth | 8 |

```bash
# Installation eines vollständigen Workspace-Stacks
npx claudient add all   # beinhaltet alle 42 Stacks
```

---

## Schnellstart — Installation von Claude Code Fähigkeiten in 30 Sekunden

```bash
# Alles installieren
npx claudient add all

# Nach Domain installieren
npx claudient add skills backend          # 40+ Backend-Fähigkeiten
npx claudient add skills devops-infra     # Kubernetes, Terraform, Docker, CI/CD
npx claudient add skills ai-engineering   # RAG, LangGraph, Claude API, MCP Builder
npx claudient add skills legal            # GDPR, SOC 2, Contracts, NDA Review
npx claudient add skills finance          # DCF, 3-Statement Model, Pitch Deck
npx claudient add skills small-business   # Invoice Chaser, Cash Flow, Shopify

# Agenten installieren
npx claudient add agents                  # Alle 182+ Spezialistagenten

# In Ihrer Sprache installieren
npx claudient add all --lang fr           # Französisch
npx claudient add all --lang de           # Deutsch
npx claudient add all --lang nl           # Niederländisch
npx claudient add all --lang es           # Spanisch

# Entdecken
npx claudient search "circuit breaker"
npx claudient list
```

---

## Repository-Struktur

```
Claudient/
├── .claude-plugin/           # Plugin- und Marketplace-Manifeste
│   ├── plugin.json           # Plugin-Metadaten und Komponentenpfade
│   └── marketplace.json      # Marketplace-Katalog für /plugin marketplace add
│
├── plugins/                  # 19 installierbare Domain-Plugins
│   ├── claudient-productivity/     # 66 Fähigkeiten
│   ├── claudient-small-business/   # 47 Fähigkeiten
│   ├── claudient-backend/          # 41 Fähigkeiten
│   ├── claudient-devops-infra/     # 36 Fähigkeiten
│   ├── claudient-gtm/              # 32 Fähigkeiten
│   ├── claudient-marketing/        # 22 Fähigkeiten
│   ├── claudient-legal/            # 21 Fähigkeiten
│   ├── claudient-sdr/              # 18 Fähigkeiten
│   ├── claudient-ai-engineering/   # 17 Fähigkeiten
│   ├── claudient-finance/          # 16 Fähigkeiten
│   ├── claudient-data-ml/          # 15 Fähigkeiten
│   ├── claudient-product/          # 15 Fähigkeiten
│   ├── claudient-automation/       # 14 Fähigkeiten
│   ├── claudient-database/         # 12 Fähigkeiten
│   ├── claudient-git/              # 3 Fähigkeiten
│   ├── claudient-commands/         # 100 Slash-Befehle
│   ├── claudient-personas/         # 10 Personas
│   └── claudient-everything/       # Meta-Bundle (alle Domains)
│
├── skills/                   # 400+ Auto-Invoking Domain Fähigkeiten
│   ├── backend/              # Next.js, FastAPI, Go, Rust, .NET, Rails, Laravel, Flutter
│   ├── devops-infra/         # Kubernetes, Terraform, Docker, CI/CD, AWS/GCP/Azure, Helm
│   ├── ai-engineering/       # Claude API, RAG, LangGraph, MCP Builder, Agent Teams, Ultraplan
│   ├── data-ml/              # dbt, Spark, Kafka, MLOps, PyTorch, Pandas/Polars
│   ├── database/             # Drizzle, Prisma, PostgreSQL, Supabase, Redis, Elasticsearch
│   ├── gtm/                  # HubSpot, SDR, Email Automation, CRM Hygiene, Deal Desk
│   ├── legal/                # Contract Review, GDPR, SOC 2, EU AI Act, NDA, IP Clearance
│   ├── finance/              # DCF, 3-Statement Model, IC Memo, Pitch Deck, GL Reconciler
│   ├── marketing/            # SEO, AI SEO, Paid Ads, Content Strategy, CRO, Copywriting
│   ├── product/              # Discovery, Roadmap, UX Research, Competitive Teardown
│   ├── productivity/         # PR Review, ADR Writer, Tech Debt Tracker, TDD Guard
│   ├── small-business/       # Invoice Chaser, QuickBooks, Shopify, 14 Industry Verticals
│   ├── automation/           # Playwright, Browser Automation, Remotion, SaaS Scaffolder
│   ├── computer-use/         # UI Testing, Visual QA, Legacy App Automation, Screenshot Verify
│   ├── git/                  # Git Workflow Automation
│   ├── sdr/                  # Sales Development Representative Skills
│   └── finance-payments/     # Payments and Fintech Skills
│
├── agents/                   # 182+ Spezialistagenten
│   ├── advisors/             # 15 C-Suite Agenten (CEO, CTO, CFO, CMO, CISO, COO, CPO...)
│   ├── core/                 # Architekt · Planner · Code-Reviewer · Security-Reviewer
│   ├── roles/                # 100+ Domain-Spezialisten (SRE, K8s, RAG, Fintech, Jura...)
│   ├── specialists/          # Small-Business-Advisor, E-Commerce, Local-Services
│   ├── build-resolvers/      # TypeScript und Python Build-Error-Resolver
│   └── sdr/                  # SDR und GTM Agenten
│
├── commands/                 # 100+ Slash-Befehle über 12 Kategorien
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
├── hooks/                    # 40 Event-gesteuerte Automatisierungen
│   ├── pre-tool-use/         # secret-scanner · injection-scanner · block-dangerous · git-push-confirm
│   ├── post-tool-use/        # tdd-guard · lint-check · test-runner · auto-git-stage
│   ├── lifecycle/            # session-context-loader · keepalive-poke
│   ├── notification/         # telegram-pr-notify · ntfy-push · tts-announcer
│   ├── permission/           # auto-allow-readonly
│   ├── subagent/             # agent-comms
│   ├── context/              # Context-Injection-Hooks
│   └── advanced/             # sound-system · audit-log · output-size-warn
│
├── guides/                   # 100+ benutzerfreundliche Dokumentationsdateien
│   └── [de/ · es/ · fr/ · nl/]    # Übersetzte Versionen
├── workflows/                # 45+ End-to-End-Prozess-Workflows
│   └── [de/ · es/ · fr/ · nl/]
├── prompts/                  # 31+ wiederverwendbare Prompt-Vorlagen
│   ├── system-prompts/       # Rollengestützte System-Prompt-Vorlagen
│   ├── project-starters/     # Projekt-Initialisierungs-Prompts
│   └── task-specific/        # Aufgabenspezifische Prompt-Vorlagen
├── rules/                    # 32 immer-befolgte Richtlinien-Dateien
│   ├── common/               # Sprachagnostische Coding- und Workflow-Prinzipien
│   └── language-specific/    # Pro-Sprache-Stil-Regeln
├── mcp/                      # 41 MCP-Server-Konfigurationsführer
│   └── configs/              # Einsatzbereit JSON-Konfigurationen (GitHub, Postgres, Redis, Kafka, Docker und mehr)
├── personas/                 # 10 Betriebsprofile
├── output-styles/            # 8 Output-Style-Definitionen
├── themes/                   # 10 UI-Themen (Dracula, Nord, Tokyo Night, Catppuccin...)
├── statuslines/              # 6 Statuszeilen-Skripte
├── keybindings/              # 4 Voreinstellungen: Vim · Emacs · Ergonomisch · Power-User
├── settings-templates/       # 5 Starter settings.json Vorlagen
├── routines/                 # 10 geplante Cloud-Agent-Routine-Vorlagen
├── compatibility/            # Cross-Harness-Adapter (Cursor, Windsurf, Codex, Gemini, Copilot)
├── claude-md-examples/       # 20 kommentierte reale CLAUDE.md Vorlagen
├── examples/                 # Komplette funktionierende Projekt-Referenzen
│   ├── agent-sdk/            # Python & TypeScript Agent SDK Starter
│   ├── nextjs-saas/          # Next.js + Supabase + Stripe
│   ├── fastapi-ai-app/       # FastAPI + Claude API
│   ├── go-cli-tool/          # Go CLI Tool
│   └── dbt-pipeline/         # dbt Data Pipeline
├── structures/               # 83 Projektstruktur-Vorlagen
├── professional-stacks/      # 50 Vorkonfigurierte Workspace-Stacks (CLAUDE.md + 8 Fähigkeiten jeweils)
├── scripts/                  # Build- und Utility-Skripte
├── docs/                     # ADRs und interne Dokumentation
└── index.json                # Vollständig durchsuchbarer Index (npx claudient search)
```

---

## Derzeit beliebteste Claude Code Fähigkeiten

| Fähigkeit / Agent | Was es tut | Kategorie |
|---|---|---|
| `/nextjs-app` | Next.js App Router, Server Components, Server Actions, Drizzle | Backend |
| `/fastapi` | Production FastAPI mit Auth, Pydantic, Async, Tests, Docker | Backend |
| `/sre-engineer` | SLO-Design, Error Budgets, Burn-Rate-Alerts, Runbooks | Agent |
| `/security-audit` | OWASP Top 10 Scan, Secret-Exposure-Check vor jedem PR | Agent |
| `/invoice-chaser` | Automatisierte AR-Erinnerungen und Zahlungs-Eskalation (kein Code erforderlich) | Kleinunternehmen |
| `/hubspot` | CRM-Automatisierung über den offiziellen HubSpot-MCP-Server | GTM |
| `/rag-architect` | Chunking-Strategie, Embeddings, Retrieval, Reranking, Eval | KI-Engineering |
| `/kubernetes-architect` | K8s-Manifeste, Helm-Charts, HPA, NetworkPolicy, RBAC | DevOps |
| `/smart-contract-audit` | Solidity-Sicherheits-Audit — Reentrancy, Access Control, Oracles | Blockchain/Web3 |
| `/unity-csharp` | Unity DOTS/ECS, MonoBehaviour, ScriptableObjects | Game-Development |
| `/firmware-architecture` | HAL, Treiber, Memory-Layout für eingebettete Systeme | Embedded/IoT |

---

<a name="top-100-mcp-servers"></a>

## Top 100 MCP Server für Claude Code — Indie Builder Starter Stack

> **Der schnellste Weg, Claude Code zu erweitern.** MCP-Server geben Claude direkten Zugriff auf Ihre Tools — GitHub, Figma, Stripe, Jira, Notion, Slack und 94 weitere.

**Der Indie Builder Starter Stack:**

| Server | Was er tut | Monatliche Suchen |
|--------|-----------|-----------------|
| [Playwright MCP](mcp/playwright-mcp.md) | Browser-Automatisierung — navigieren, klicken, Screenshot, Scraping | 82K |
| [Figma MCP](mcp/figma.md) | Designs lesen, Tokens extrahieren, Komponenten aus Specs generieren | 74K |
| [GitHub MCP](mcp/github.md) | PRs lesen, Issues erstellen, Code durchsuchen, Releases verwalten | 69K |
| [Atlassian MCP](mcp/atlassian.md) | Jira-Tickets, Confluence-Docs, Sprint-Management | 40K |
| [Memory MCP](mcp/memory.md) | Persistenter Knowledge Graph über Claude Code Sitzungen | — |
| [Stripe MCP](mcp/stripe.md) | Kunden abfragen, Abos, Zahlungen, Churn-Daten | — |
| [Notion MCP](mcp/notion.md) | Seiten lesen/schreiben, Datenbanken abfragen, Docs erstellen | — |
| [Taskmaster MCP](mcp/taskmaster.md) | KI-Aufgabenverwaltung mit Kontext-Isolation über Sitzungen | — |
| [Postgres MCP](mcp/postgres.md) | SQL-Abfragen, Schema-Inspektion, Tabellen-Management | — |
| [Redis MCP](mcp/redis.md) | Cache-Inspektion, Key-Management, Memory-Statistiken | — |
| [Jira MCP](mcp/jira.md) | Issue-Management, Sprint-Tracking, JQL-Abfragen | — |
| [Docker MCP](mcp/docker.md) | Container-Inspektion, Log-Analyse, Ressourcen-Monitoring | — |

**→ [Vollständiger Leitfaden: Top 100 MCP Server für Indie Builder](mcp/top-mcp-servers.md)** — Installations-Konfigurationen, Tier-Rankings und kuratierte Bundles für jeden Stack.

```bash
npx claudient add mcp starter   # GitHub + Memory + Playwright
npx claudient add mcp all       # Alle 40 einzelnen Konfigurationsführer
```

---

<a name="claude-for-small-business"></a>

## Claude für Kleinunternehmen — 30+ Vertikale Fähigkeiten

> **Die vollständigste Community-Wissensdatenbank für die Verwendung von Claude in einem Kleinunternehmen.** Fähigkeiten in einfacher Sprache, kein Terminal erforderlich, geschrieben für Besitzer, die bereits für QuickBooks, Shopify, HubSpot und den Rest zahlen. Claudient erweitert Anthropics offiziellen [Claude für Kleinunternehmen](guides/claude-for-small-business.md) Launch mit 30+ Fähigkeiten, die den langen Schwanz von Vertikalen und Workflows abdecken.

```bash
npx claudient add skills small-business
```

### Claude für Kleinunternehmen nach Vertikal

Jeder Leitfaden ist eine End-to-End-Landingpage für eine bestimmte Branche – Setup, Skill-Stack, 30/60/90 Erwartungen, FAQ.

| Sie sind ein(e)... | Beginnen Sie hier |
|---|---|
| **Solopreneur, Solo-Gründer, Nebenprojekt** | [Claude für Solopreneurs](guides/claude-for-solopreneurs.md) |
| **Shopify, Amazon, Etsy oder DTC Verkäufer** | [Claude für E-Commerce](guides/claude-for-ecommerce.md) |
| **Handwerk, Salon, Zahnmedizin, Fitness, Restaurant, Immobilien-Operator** | [Claude für lokale Services](guides/claude-for-local-services.md) |
| **Executive-Coach, Business-Berater, fraktionaler Berater** | [Claude für Coaches und Berater](guides/claude-for-coaches-consultants.md) |
| **Newsletter-Autor, Podcaster, Kurs-Creator** | [Claude für Creators](guides/claude-for-creators.md) |
| **Zum ersten Mal, möchte die vollständige Übersicht** | [Claude für Kleinunternehmen — Produktleitfaden](guides/claude-for-small-business.md) |

### Top Kleinunternehmen Fähigkeiten

| Fähigkeit | Automatisiert | Funktioniert mit |
|---|---|---|
| `/invoice-chaser` | AR-Erinnerungen, Zahlungs-Eskalation | QuickBooks, Stripe |
| `/quickbooks-workflow` | Month-End Close, Reconciliation | QuickBooks |
| `/cash-flow-forecast` | 30-Tage-Liquiditätsposition, Gehaltslaufzeit | QuickBooks, PayPal |
| `/expense-audit` | Subscription Creep, Duplicate Vendors | QuickBooks |
| `/content-repurposer` | 1 Brief → Blog + Social + Email + Ads | Canva |
| `/review-response` | Google/Yelp Bewertungs-Management | Google, Yelp |
| `/customer-inquiry` | FAQ-Antwortmaschine, After-Hours-Antworten | Website, CRM |
| `/shopify-operations` | Produktbeschreibungen, Inventory Alerts | Shopify |
| `/sop-writer` | Standard Operating Procedures | Jedes Unternehmen |
| `/weekly-pulse` | KPI-Dashboard von all Ihren Tools | Multi-Tool |

### Vertikal-spezifische Fähigkeiten

| Vertikal | Fähigkeit |
|---|---|
| E-Commerce (Multi-Plattform) | [`/ecommerce-seller`](skills/small-business/ecommerce-seller.md) |
| Salon, Spa, Barbershop | [`/salon-spa-ops`](skills/small-business/salon-spa-ops.md) |
| Zahnmedizin-Praxis | [`/dental-practice`](skills/small-business/dental-practice.md) |
| Fitnessstudio, Gym | [`/fitness-gym-ops`](skills/small-business/fitness-gym-ops.md) |
| Coaching-Praxis | [`/coaching-business`](skills/small-business/coaching-business.md) |
| Online-Kurs | [`/online-course-creator`](skills/small-business/online-course-creator.md) |
| Newsletter | [`/newsletter-publisher`](skills/small-business/newsletter-publisher.md) |
| Marketing/Kreativ-Agentur | [`/agency-operations`](skills/small-business/agency-operations.md) |
| Handwerk (Klempner, HLK, Elektrik) | [`/contractor-trades`](skills/small-business/contractor-trades.md) |
| Fotostudio | [`/photography-studio`](skills/small-business/photography-studio.md) |
| Buchhaltungs-Firma | [`/bookkeeper-practice`](skills/small-business/bookkeeper-practice.md) |
| Podcast | [`/podcast-monetizer`](skills/small-business/podcast-monetizer.md) |
| Immobilien | [`/real-estate-listing`](skills/small-business/real-estate-listing.md) |
| Restaurant | [`/restaurant-ops`](skills/small-business/restaurant-ops.md) |

### Operator-Fähigkeiten (Cross-Cutting)

| Fähigkeit | Anwendungsfall |
|---|---|
| [`/hiring-pipeline`](skills/small-business/hiring-pipeline.md) | Strukturiertes Screening für hohe Bewerberverwaltung |
| [`/churn-prevention`](skills/small-business/churn-prevention.md) | Gefährdete Identifizierung und Wiederherstellung für Abonnement-Unternehmen |
| [`/pricing-optimizer`](skills/small-business/pricing-optimizer.md) | Strukturierte Preisüberprüfung, Migrations-Plan, A/B-Test-Design |
| [`/freelancer-proposal`](skills/small-business/freelancer-proposal.md) | Discovery Call → Markenbefürwortetes Proposal in 20 Minuten |
| [`/lead-triager`](skills/small-business/lead-triager.md) | ICP-Scoring bei neuen Kontakten, priorisierte Anrufliste |
| [`/meeting-to-action`](skills/small-business/meeting-to-action.md) | Transcript → Aktionsliste + Follow-Up-Email |
| [`/customer-feedback-synthesizer`](skills/small-business/customer-feedback-synthesizer.md) | Mustererkennung über 100+ Bewertungen |
| [`/competitor-monitor`](skills/small-business/competitor-monitor.md) | Was Ihre 3 nächsten Konkurrenten diesen Monat ausgeliefert haben |
| [`/margin-analyzer`](skills/small-business/margin-analyzer.md) | Brutto-Marge nach Produkt, Kanal, Kunde |
| [`/tax-organizer`](skills/small-business/tax-organizer.md) | CPA-Paket von QuickBooks und Quittungs-Ordner |

### Spezialistagenten für Kleinunternehmen

- [`small-business-advisor`](agents/specialists/small-business-advisor.md) — Generalist Diagnose und Workflow-Priorisierung
- [`ecommerce-specialist`](agents/specialists/ecommerce-specialist.md) — für Shopify/Amazon/Etsy/DTC-Operatoren
- [`local-services-specialist`](agents/specialists/local-services-specialist.md) — für Handwerk, Salon, Zahnmedizin, Fitness, Restaurant, Immobilien
- [`restaurant-specialist`](agents/roles/restaurant-specialist.md) — Restaurant-spezifische Operationen
- [`real-estate-specialist`](agents/roles/real-estate-specialist.md) — Immobilienmakler- und Makler-Operationen

```bash
npx claudient add agents small-business
```

---

## FAQ — Claude für Kleinunternehmen

### Was ist Claude für Kleinunternehmen?

Claude für Kleinunternehmen ist Anthropics Product-Schicht für Kleinunternehmen in Claude Cowork, gestartet am 13. Mai 2026, mit 15 offiziellen Workflows. Claudient ist die Community-Wissensdatenbank, die diese Workflows mit 30+ zusätzlichen Fähigkeiten erweitert, die den langen Schwanz von Vertikalen (Zahnmedizin, Salon, Handwerk, Fotografie, Coaching, E-Commerce) und Operator-Workflows (Einstellung, Churn, Preisgestaltung, Proposals) abdeckt. [Lesen Sie den Produktleitfaden](guides/claude-for-small-business.md).

### Ist Claude gut für Kleinunternehmer?

Ja. Inhaber, die 1-50-Personen-Unternehmen führen, sparen normalerweise 6-12 Stunden pro Woche innerhalb von 30 Tagen bei der mechanischen Arbeit, die früher ihre Abende ausfüllte – Rechnungsstellung, Lead Follow-up, Wochenberichte, Content-Repurposing, Kunden-FAQs. Die Claudient-Fähigkeiten sind Operator-First geschrieben, kein Terminal erforderlich.

### Wie unterscheidet sich Claude von ChatGPT für Kleinunternehmen?

ChatGPT ist ein generalistischer Chat-Assistent. Claude für Kleinunternehmen verbindet sich mit Ihren tatsächlichen Business-Tools – QuickBooks, HubSpot, PayPal, Google Workspace, Shopify – und erzeugt Outputs, die in Ihren echten Daten verankert sind. ChatGPT kann eine generische Zahlungserinnerung schreiben; Claude liest Ihren tatsächlichen AR-Alterungsbericht und verfasst personalisierte Erinnerungen nach Rechnung. Der Unterschied setzt sich über jeden Workflow fort.

### Wie viel kostet Claude für ein Kleinunternehmen?

20 $/Monat für Claude Pro deckt die meisten Solo-Inhaber und kleine Operationen ab. 30 $/Sitz/Monat für Claude Team, wenn Sie einen Partner, Office Manager oder Assistenten haben, der die Workflows nutzt. 100 $/Monat für Claude Max, wenn Sie 6+ Workflows täglich auf großen Datensätzen ausführen. Alles andere — QuickBooks, HubSpot, Shopify — bezahlen Sie bereits.

### Muss ich wissen, wie man kodiert?

Nein. Die offiziellen Claude für Kleinunternehmen Workflows sind Point-and-Click innerhalb von Claude Cowork. Die Claudient-Fähigkeiten in diesem Repo werden aktiviert, indem Sie Klartext zu Claude eingeben. Die einzige Einrichtung ist das OAuth-Verbinden Ihrer vorhandenen Tools, was ein paar Klicks pro Tool dauert.

### Kann Claude meine QuickBooks-Daten lesen?

Ja, sobald Sie die QuickBooks Online-Integration über OAuth autorisieren. Claude liest Ihre Rechnungen, Transaktionen, Kunden und Berichte zum Zeitpunkt der Workflow-Ausführung. Es wird nicht im Hintergrund in Ihrem Konto abgefragt, und Anthropic verwendet keine verbundenen Geschäftsdaten zum Training von Claude.

### Kann Claude meinen Buchhalter oder CPA ersetzen?

Nein, und das sollten Sie nicht wollen. Claude bereitet die Abstimmung vor, organisiert die Quittungen und verfasst die GuV. Ihr Buchhalter oder CPA überprüft und unterzeichnet. Die kombinerten Kosten sind niedriger als ein Buchhalter allein, und die Bearbeitungszeit ist schneller.

### Funktioniert Claude mit Shopify?

Ja, über den offiziellen Shopify-MCP. Die [Shopify Operations-Fähigkeit](skills/small-business/shopify-operations.md) und die [Ecommerce Seller-Fähigkeit](skills/small-business/ecommerce-seller.md) decken Produktbeschreibungen, Inventory-Alerts, SEO-Titel, Collection-Updates und Cross-Plattform-Listing-Arbeit ab.

### Funktioniert Claude mit HubSpot?

Ja, über den offiziellen HubSpot-MCP. [Lead Triager](skills/small-business/lead-triager.md), [Cold Outreach](skills/small-business/cold-outreach.md) und [Email Campaign](skills/small-business/email-campaign.md) lesen alle von und schreiben in HubSpot über die Integration.

### Wie fange ich an?

Führen Sie `npx claudient add skills small-business` aus, um jede Kleinunternehmen-Fähigkeit in Ihrer Claude Code-Umgebung zu installieren. Starten Sie dann mit einem Workflow — [Invoice Chaser](skills/small-business/invoice-chaser.md) ist der höchste ROI-Einstiegspunkt für die meisten Unternehmen — und überprüfen Sie den Output beim ersten Lauf sorgfältig.

### Ist Claude für Kleinunternehmen es wert?

Für Unternehmen, bei denen der Besitzer 6+ Stunden pro Woche für die Aktivitäten aufwendet, die Claude abdeckt (Rechnungsstellung, Lead Follow-up, Reporting, Content, Kunden-FAQs, vertikale Operationen), ja – typischerweise 3-5x ROI innerhalb von 60 Tagen. Für Unternehmen, die bereits straff automatisierte Stacks verwenden, ist die Grenzrendite geringer. Lesen Sie den [ROI-Leitfaden](guides/small-business-roi.md) für den Rechner und Benchmark-Daten.

### Was ist, wenn ich keine dieser Tools verwende?

Die Claudient-Fähigkeiten laufen auf Copy-Paste-Daten, wenn eine direkte Integration nicht verfügbar ist. Sie verlieren etwas der Workflow-Automatisierung, behalten aber die strukturierte Entwurfserstellung, Scoring und Analyse. Zum Beispiel funktioniert [Review Response](skills/small-business/review-response.md) auf Google-Bewertungen, die Sie einfügen, auch ohne Google-Integration.

---

<a name="agents"></a>

## 182+ Claude Code Spezialistagenten

Spezialistagenten, die mit dem `Agent` Tool in Claude Code aufgerufen werden. Jeder hat spezifische Modell, Tool-Einschränkungen und Trigger-Bedingungen, damit Claude die richtige Arbeit dem richtigen Experten delegiert.

### C-Suite-Berater (15 Agenten)

| Agent | Domain |
|---|---|
| `ceo-advisor` | Strategie, Board Prep, Investor Relations, Org Design |
| `cto-advisor` | Architecture Decisions, Build vs Buy, Technical Strategy |
| `cfo-advisor` | Unit Economics, Fundraising, Cash Management, Modelling |
| `cmo-advisor` | GTM Strategy, Channel Allocation, Positioning, Demand Gen |
| `ciso-advisor` | Security Programme Design, Risk Prioritisation, Board Reporting |
| `coo-advisor` | Process Design, OKRs, Scaling Operations |
| `cpo-advisor` | Roadmap, Discovery, Pricing, PLG Strategy |
| `cro-advisor` | Revenue Forecasting, NRR Analysis, Sales Model Design |
| `general-counsel` | Legal Risk, Contract Review, Compliance Overview |
| `chief-of-staff` | Operating Rhythm, OKR Facilitation, CEO Leverage |
| + 5 weitere | CDO, CAIO, VPE, CHRO, CCO |

### Engineering-Spezialisten

`sre-engineer` · `chaos-engineer` · `penetration-tester` · `kubernetes-architect` · `security-auditor` · `platform-engineer` · `network-engineer` · `rust-engineer` · `mlops-engineer` · `graphql-architect` · `websocket-engineer` · `fullstack-developer` · `llm-architect` · `codebase-orchestrator` · `multi-agent-coordinator` + 30 weitere

### Domain-Spezialisten

`competitive-analyst` · `market-researcher` · `trend-analyst` · `quant-analyst` · `fintech-engineer` · `healthcare-admin` · `legal-advisor` · `nlp-engineer` · `data-pipeline-architect` + mehr

```bash
npx claudient add agents
```

---

<a name="skills-by-category"></a>

## Fähigkeiten nach Kategorie — 400+ Claude Code Fähigkeiten

**400+ Fähigkeiten · 19 Kategorien · EN · FR · DE · NL · ES**

| Kategorie | Anzahl | Top-Fähigkeiten |
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

## 40 Claude Code Hooks — Event-gesteuerte Automatisierung

Event-gesteuerte Automatisierung für Claude Code – läuft außerhalb von Claudes Kontext als echte Shell-Prozesse bei den richtigen Lifecycle-Events.

| Hook | Event | Was er tut |
|---|---|---|
| `secret-scanner` | PreToolUse | Blockiert Schreibvorgänge, die API-Schlüssel oder Credentials enthalten |
| `tdd-guard` | PostToolUse | Blockiert Implementierungsdateien ohne übereinstimmende Tests |
| `injection-scanner` | PreToolUse | Scannt Tool-Eingaben auf Prompt-Injection-Versuche |
| `plannotator` | ExitPlanMode | Interaktive Plan-Annotation vor Claude-Ausführung |
| `lint-check` | PostToolUse | Auto-Lints TypeScript/Python nach jeder Dateibearbeitung |
| `test-runner` | PostToolUse | Führt verwandte Tests nach Bearbeitung einer Quell-Datei aus |
| `telegram-pr-notify` | PostToolUse | Sendet Telegram-Nachricht, wenn ein PR erstellt wird |
| `keepalive-poke` | Stop | Setzt autonome Sitzungen ohne Eingriff fort |
| `sound-system` | All Events | Plattform-native Sounds für 27 Claude Code Events |
| `session-context-loader` | SessionStart | Injiziert Datum, Branch, jüngste Commits beim Session-Start |
| `ntfy-push` | Notification | Mobile Push-Alerts über ntfy |
| `tts-announcer` | Stop | Spricht Claudes letzte Nachricht laut vor |
| + 28 weitere | — | Auto-Stage Git, Transkript-Backup, Output-Kompressor, Bug-Logger, Slack-Benachrichtiger, WhatsApp-Gate... |

---

## Leitfäden & Workflows — 100+ Claude Code Leitfäden und Workflows

### Leitfäden (100+)

[Getting Started](guides/getting-started.md) · [Agent Frontmatter Reference](guides/agent-frontmatter.md) · [Skills Frontmatter Reference](guides/skills-frontmatter.md) · [Decision Framework](guides/decision-framework.md) · [Claude Managed Agents](guides/claude-managed-agents.md) · [Advanced Tool Use](guides/advanced-tool-use.md) · [Voice Dictation](guides/voice-dictation.md) · [Desktop App](guides/desktop-app.md) · [Opus 4.7 Migration](guides/opus-47-migration.md) · [Hooks Cookbook](guides/hooks-cookbook.md) · [Multi-Agent Patterns](guides/multi-agent-patterns.md) · [Subagent Patterns](guides/subagent-patterns.md) · [Context Management](guides/context-management.md) · [Token Cost Reduction](guides/token-cost-reduction.md) · [Notifications Setup](guides/notifications-setup.md) · [Plugin Authoring](guides/plugin-authoring.md) · [RIPER Framework](guides/riper-framework.md) · [RPI Workflow](guides/rpi-workflow.md) · [CLI Reference](guides/cli-reference.md) · [Settings Scope](guides/settings-scope.md) · [Why Use Claude Code](guides/why-use-claude-code.md) · [Routines](guides/routines.md) · [Computer Use](guides/computer-use.md) · [Ultraplan](guides/ultraplan.md) · [Auto Mode](guides/auto-mode.md) + 39 weitere

### Workflows (45+)

[RPI Feature Development](workflows/rpi-feature.md) · [RIPER](workflows/riper.md) · [Incremental Build](workflows/incremental-build.md) · [Pre-Human Review](workflows/pre-human-review.md) · [Autonomous Loop](workflows/autonomous-loop.md) · [Worktree Lifecycle](workflows/worktree-lifecycle.md) · [Multi-Agent Saga](workflows/multi-agent-saga.md) · [Chaos Game Day](workflows/chaos-game-day.md) · [Error Budget](workflows/error-budget.md) · [Bug Investigation](workflows/bug-investigation.md) · [Compound Engineering](workflows/compound-engineering.md) · [Session Learning](workflows/session-learning.md) + weitere

---

## Was ist enthalten — Vollständiges Claude Code Toolkit

| Typ | Anzahl |
|---|---|
| **Fähigkeiten** | **400+** |
| **Agenten** | **182+** |
| **Workspace-Stacks** | **42** |
| **Hooks** | **40** |
| **MCP-Konfigurationsführer** | **40** |
| **Routinen** | **10** |
| **Leitfäden** | **100+** |
| **Workflows** | **45+** |
| **Prompts** | **31+** |
| **Regeln** | **32** |
| **Sprachen** | **5 (EN · FR · DE · NL · ES)** |

---

<a name="translations"></a>

## 5 Sprachen — Claude Code Fähigkeiten in EN · FR · DE · NL · ES

Jede Fähigkeit, Agent, Leitfaden, Workflow und Prompt ist verfügbar in:

**🇬🇧 Englisch · 🇫🇷 Französisch · 🇩🇪 Deutsch · 🇳🇱 Niederländisch · 🇪🇸 Spanisch**

```bash
npx claudient add all --lang fr   # Französisch
npx claudient add all --lang de   # Deutsch
npx claudient add all --lang nl   # Niederländisch
npx claudient add all --lang es   # Spanisch
```

---

## Tragen Sie eine Claude Code Fähigkeit bei — Werden Sie vorgestellt

Claudient wird von der Community angetrieben. Jede Fähigkeit lebt in einer Markdown-Datei. Eine Claude Code Fähigkeit beizutragen dauert weniger Zeit als ein GitHub Issue zu melden.

1. Lesen Sie den [Skill Authoring Guide](guides/skill-authoring.md) — 5 Minuten
2. Fork, fügen Sie Ihre Fähigkeit in einer `.md` Datei hinzu
3. Reichen Sie einen PR ein — zusammengeführte Fähigkeiten werden in **Beliebt** vorgestellt

**Empfohlene GitHub-Themen für Claude Code Projekte:** `claude` · `claude-code` · `anthropic` · `llm-tools` · `mcp` · `developer-tools` · `prompt-engineering` · `ai-assistant`

**[GitHub Discussions](https://github.com/Claudient/Claudient/discussions) · [CONTRIBUTING.md](CONTRIBUTING.md) · [Reddit](https://www.reddit.com/r/uitbreiden/)**

---

## Entwickelt von Uitbreiden

Claudient wird unterstützt von [Uitbreiden](https://uitbreiden.com/) — Entwicklung von KI-Produkten und B2B-Tools mit Developer Communities.

[![Reddit](https://img.shields.io/badge/Reddit-r%2Fuitbreiden-FF4500?logo=reddit&logoColor=white)](https://www.reddit.com/r/uitbreiden/)
[![YouTube](https://img.shields.io/badge/YouTube-%40UITBREIDEN-FF0000?logo=youtube&logoColor=white)](https://www.youtube.com/@UITBREIDEN)
[![Website](https://img.shields.io/badge/Website-uitbreiden.com-f97316)](https://uitbreiden.com/)

---

## Lizenz

Doppelt lizenziert:

- **Code** — [AGPL-3.0](LICENSE-CODE). Die Astro-Website, Hook-Skripte, npm-Paket-Quelle, alles Ausführbare.
- **Content** — [CC-BY-SA-4.0](LICENSE-CONTENT). Alle Markdown-Fähigkeiten, Agenten, Hooks, MCP-Konfigurationen, Workflows, Leitfäden, Prompts, Regeln und Dokumentation.

Siehe [LICENSE](LICENSE) für die Begründung und vollständige Details. Für kommerzielle Lizenzierungsanfragen schreiben Sie an [hello@uitbreiden.com](mailto:hello@uitbreiden.com).

© 2026 [Uitbreiden](https://uitbreiden.com/) · Tushar Aggarwal
