# Compétences Claude Code, Agents et Plugins — Claudient

**Claudient** est la plus grande base de connaissances open-source pour **Claude Code** — l'outil CLI de codage IA d'Anthropic. Il comprend 400+ compétences de domaine, 182+ agents spécialisés, 42 piles de travail pré-filaires, 41 configurations MCP, 100+ commandes slash, hooks et workflows, tous installables en 30 secondes. Pas de réexplication de pile. Claude connaît déjà votre domaine.

**Nouveau dans Claude Code ?** Claude Code est l'assistant IA officiel en ligne de commande d'Anthropic pour le développement logiciel — il lit votre codebase, exécute les commandes, édite les fichiers et complète les tâches de manière autonome dans votre terminal ou IDE. Claudient est la bibliothèque communautaire open-source qui l'étend avec des compétences au niveau des experts dans toutes les piles et domaines.

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

**Arrêtez d'expliquer votre pile à Claude à chaque session.**

Claudient est la plus grande base de connaissances open-source pour **Claude Code** — 400+ compétences, 182+ agents spécialisés, 100+ commandes slash, 100+ guides, 40 hooks, 45 workflows, 83 structures de projet, 42 piles de travail, 10 personas, 32 règles, 41 configurations de serveurs MCP, 10 routines d'automatisation, 20 exemples CLAUDE.md annotés, adaptateurs inter-harness (Cursor/Windsurf/Codex/Gemini/Copilot), plus des styles de sortie, des thèmes, des statuslines, des raccourcis clavier, des modèles de paramètres et un pack Agent SDK — tous installables en 30 secondes.

```bash
# Installer en tant que plugin du marché Claude Code (recommandé)
/plugin marketplace add Claudient/Claudient
/plugin install claudient-everything@claudient

# Ou via npm
npx claudient add all
```




---

## Installer en tant que plugin Claude Code

Claudient se présente comme un **marché de plugins** natif de Claude Code. Ajoutez-le une fois, puis installez uniquement les domaines dont vous avez besoin — les compétences s'auto-invoquent en fonction de ce sur quoi vous travaillez, les agents et les hooks sont fournis en bundle.

```bash
# 1. Ajouter le marché
/plugin marketplace add Claudient/Claudient

# 2. Installer un plugin de domaine (ou le bundle everything)
/plugin install claudient-gtm@claudient
/plugin install claudient-devops-infra@claudient
/plugin install claudient-everything@claudient
```

**19 plugins, 400+ compétences auto-invoquées, 182 agents, 100 commandes slash :**

| Plugin | Compétences | Plugin | Compétences |
|---|---|---|---|
| `claudient-productivity` | 66 | `claudient-finance` | 16 |
| `claudient-small-business` | 47 | `claudient-data-ml` | 15 |
| `claudient-backend` | 41 | `claudient-product` | 15 |
| `claudient-devops-infra` | 36 | `claudient-automation` | 14 |
| `claudient-gtm` | 32 | `claudient-database` | 12 |
| `claudient-marketing` | 22 | `claudient-git` | 3 |
| `claudient-legal` | 21 | `claudient-commands` | 100 commandes |
| `claudient-sdr` | 22 | `claudient-personas` | 10 personas |
| `claudient-ai-engineering` | 17 | `claudient-finance-payments` | 2 |
| `claudient-everything` | meta-bundle | | |

Chaque compétence est validée avec `claude plugin validate --strict`. Vous préférez npm ? `npx claudient add all` fonctionne toujours.

---

## Au-delà des compétences — la boîte à outils complète de Claude Code

Claudient couvre chaque primitive supportée par Claude Code, pas seulement les compétences :

| Catégorie | Contenu | Installation |
|---|---|---|
| **Commandes slash** | 100+ commandes dans 12 catégories — git, test, refactor, docs, debug, devops, base de données, sécurité, frontend, api, ai-engineering, productivité | Plugin `claudient-commands` ou répertoire `commands/` |
| **Personas** | 10 profils opérationnels — startup-cto, solo-founder, growth-marketer, indie-hacker, enterprise-architect, data-driven-pm, devrel-advocate, agency-operator, ai-product-builder, fractional-exec | Plugin `claudient-personas` ou répertoire `personas/` |
| **Styles de sortie** | 8 styles — concis, mentor, code-reviewer, architect, plain-operator, security-paranoid, diagram-first, tdd-enforcer | Copier vers `~/.claude/output-styles/` |
| **Thèmes** | 10 thèmes — Dracula, Nord, Tokyo Night, Catppuccin, Gruvbox, Solarized, Monokai, Rosé Pine, + marque Claudient | Copier vers `~/.claude/themes/`, puis `/theme` |
| **Statuslines** | 6 scripts — minimal, full, cost-watch, context-budget, git-focused, rate-limit | Pointer vers `settings.json` `statusLine` |
| **Raccourcis clavier** | 4 présets — vim, emacs, ergonomic, power-user | Fusionner dans `~/.claude/keybindings.json` |
| **Modèles de paramètres** | 5 démarreurs — solo-dev, team, security-hardened, enterprise, minimal | Déposer dans `.claude/settings.json` |
| **Hooks** | 40 dans tous les événements 2026 — y compris les nouveaux types de hooks `http`, `prompt` et `agent` | Voir [`hooks/`](hooks/) |
| **Routines** | 10 modèles de cloud-agents programmés — daily-standup, pr-triage, dependency-audit, incident-watch, weekly-retro, sprint-planning, code-review-rotation, security-scan, changelog-generator, cost-audit | Voir [`routines/`](routines/) |
| **Compétences computer-use** | 4 — ui-testing, visual-qa, legacy-app-automation, screenshot-verify | `/plugin install` ou copier |
| **Galerie CLAUDE.md** | 20 modèles annotés du monde réel — Next.js SaaS, FastAPI, monorepo, outil CLI, dbt, mobile, bibliothèque OSS, k8s, petite entreprise, légal, fintech, développement de jeux, embarqué, et plus | Voir [`claude-md-examples/`](claude-md-examples/) |
| **Adaptateurs inter-harness** | Utiliser Claudient dans Cursor, Windsurf, Codex CLI, Gemini Code Assist, GitHub Copilot — guides d'adaptateurs + script d'installation | Voir [`compatibility/`](compatibility/) |
| **Pack Agent SDK** | Guide complet + agents démarreurs exécutables en Python et TypeScript | Voir [`examples/agent-sdk/`](examples/agent-sdk/) |

---

## Commandes slash

<a name="slash-commands"></a>

100+ commandes slash dans 12 catégories — invoquer avec `/command-name` dans n'importe quelle session Claude Code :

| Catégorie | Commandes |
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

Installer : `/plugin install claudient-commands@claudient` ou copier [`commands/`](commands/) dans `.claude/commands/`.

---

## Pourquoi utiliser les compétences Claude Code ?

| Problème | Sans Claudient | Avec Claudient |
|---|---|---|
| **Contexte de domaine** | Réexpliquer votre pile à chaque session | Les compétences s'activent automatiquement |
| **Tâches spécialisées** | Claude devine les meilleures pratiques | 182+ agents experts avec outils limités |
| **Intégrations d'outils** | Copier-coller manuel entre les outils | 41 configurations de serveurs MCP prêtes à installer |
| **Automatisation d'événements** | Déclencheurs manuels, étapes oubliées | 40 hooks qui s'activent au bon moment |
| **Équipe / langue** | Anglais uniquement, config unique | 5 langues, composable par projet |
| **Petite entreprise** | Conseils IA génériques | 30+ compétences verticales pour les vrais workflows |

**Une seule commande donne à Claude une expertise instantanée dans chaque domaine sur lequel vous travaillez.**

---

## Pour qui est-ce ?

| Vous êtes... | Vous obtenez... |
|---|---|
| **Développeur / codeur vibes** | Compétences pour Next.js, FastAPI, Rust, Go, Drizzle, tRPC, Docker, k8s, Terraform, Unity, Flutter, Solidity et 200+ autres piles — activation avec une commande slash |
| **Développeur mobile** | React Native/Expo, Flutter, SwiftUI, Jetpack Compose, notifications push, offline-first, déploiement sur app store |
| **Développeur de jeux** | Unity C#, Unreal C++, Godot GDScript, réseautage des jeux, physique, conception de niveaux, profilage des performances |
| **Ingénieur embarqué/IoT** | Architecture firmware, RTOS, BLE, intégration de capteurs, conception à faible puissance, mises à jour OTA |
| **Constructeur Web3** | Audit de contrats intelligents, protocoles DeFi, marchés NFT, gouvernance DAO, optimisation des gaz |
| **Créateur de produit IA** | RAG Architect, LangGraph, Prompt Engineering, LLM Eval, MCP Server Builder, modèles Claude API avec mise en cache de prompts |
| **Ingénieur GTM / RevOps** | HubSpot MCP, SDR Agent, Lead Enrichment, CRM Hygiene, Email Automation, Deal Desk |
| **Professionnel de la finance / juriste** | Modèles DCF, modèles 3 déclarations, mémos IC, examen des contrats, RGPD, SOC 2, Loi IA de l'UE — avec portes d'examen humain obligatoires |
| **Propriétaire de petite entreprise** | Compétences en langage clair pour facturation, flux de trésorerie, Shopify, avis, SOP — pas de terminal requis |
| **Équipe DevOps / Platform** | Conception SLO, chaos engineering, Helm, Kubernetes, Terraform, runbooks SRE, suivi des coûts |

---

## FAQ pour développeurs Claude Code

### Qu'est-ce que Claude Code ?
Claude Code est l'assistant IA officiel en ligne de commande d'Anthropic pour le développement logiciel. Il s'exécute dans votre terminal ou IDE (VS Code, JetBrains), lit votre codebase, édite les fichiers, exécute les commandes et complète les tâches de manière autonome. Installez-le avec `npm install -g @anthropic-ai/claude-code` ou via l'application de bureau.

### Quelles sont les compétences Claude Code ?
Les compétences sont des fichiers markdown dans `.claude/commands/` (ou chargés via le système de plugins) qui définissent des comportements experts réutilisables. Lorsqu'elles sont déclenchées par une commande slash ou des mots clés, Claude Code lit la compétence et applique son expertise de domaine à votre contexte actuel — aucun invite répété requis.

### En quoi Claudient est-il différent de l'écriture d'un fichier CLAUDE.md ?
Un `CLAUDE.md` définit le contexte au niveau du projet pour un seul repo. Les compétences de Claudient sont au niveau du domaine et réutilisables dans tous les projets — 400+ compétences couvrant FastAPI, Kubernetes, HubSpot, React, Terraform et des centaines d'autres piles.

### Claudient fonctionne-t-il avec Cursor, GitHub Copilot ou d'autres outils de codage IA ?
Claudient est conçu pour Claude Code (CLI et extensions IDE). Les adaptateurs inter-harness dans [`compatibility/`](compatibility/) supportent également Cursor, Windsurf, Codex CLI, Gemini Code Assist et GitHub Copilot.

### Comment installer les compétences Claude Code de Claudient ?
Exécutez `npx claudient add all` pour installer tout, ou utilisez le système de plugins de Claude Code : `/plugin marketplace add Claudient/Claudient` puis `/plugin install claudient-everything@claudient`. Installez par domaine avec `npx claudient add skills backend` ou `npx claudient add skills devops-infra`.

---

## Packs de profession — 25 configurations Claude Code spécifiques à un rôle

25 packs spécifiques à une profession — piles de compétences pré-filaires, agents, workflows et routines quotidiennes pour chaque rôle.

| Profession | Installation | Guide |
|---|---|---|
| SDR / Représentant commercial | `npx claudient add skill gtm/sdr-research-brief` | [Guide](guides/for-sdr.md) |
| Fondateur / PDG | `npx claudient add skill gtm/founder-operating-system` | [Guide](guides/for-founder.md) |
| Gestionnaire de produit | `npx claudient add skill product/product-discovery` | [Guide](guides/for-product-manager.md) |
| Ingénieur DevOps / Platform | `npx claudient add skill devops-infra/kubernetes-architect` | [Guide](guides/for-devops-engineer.md) |
| Marketeur de contenu / SEO | `npx claudient add skill marketing/seo-audit` | [Guide](guides/for-content-marketer.md) |
| Analyste financier / CFO | `npx claudient add skill finance/dcf-model` | [Guide](guides/for-finance-analyst.md) |
| Juriste / Agent de conformité | `npx claudient add skill legal/contract-review` | [Guide](guides/for-legal-compliance.md) |
| Growth Hacker / Marketeur de performance | `npx claudient add skill marketing/paid-ads` | [Guide](guides/for-growth-marketer.md) |
| Gestionnaire du succès client | `npx claudient add skill gtm/customer-success` | [Guide](guides/for-customer-success.md) |
| Recruteur / Ressources humaines | `npx claudient add skill small-business/hiring-pipeline` | [Guide](guides/for-recruiter.md) |
| Designer / Chercheur UX | `npx claudient add skill product/ux-research` | [Guide](guides/for-ux-designer.md) |
| Rédacteur technique | `npx claudient add skill productivity/adr-writer` | [Guide](guides/for-technical-writer.md) |
| Directeur des comptes | `npx claudient add skill gtm/deal-desk` | [Guide](guides/for-account-executive.md) |
| Gestionnaire des opérations / COO | `npx claudient add skill small-business/sop-writer` | [Guide](guides/for-operations-manager.md) |
| Marketeur par email | `npx claudient add skill gtm/email-automation` | [Guide](guides/for-email-marketer.md) |
| Opérateur e-commerce | `npx claudient add skill small-business/ecommerce-seller` | [Guide](guides/for-ecommerce-operator.md) |
| CTO / Leader technique | `npx claudient add skill productivity/tech-debt-tracker` | [Guide](guides/for-cto.md) |
| Agent immobilier | `npx claudient add skill small-business/real-estate-listing` | [Guide](guides/for-real-estate-agent.md) |
| Investisseur / Analyste VC | `npx claudient add skill finance/ic-memo` | [Guide](guides/for-investor.md) |
| Analyste de données / Analyste BI | `npx claudient add skill data-ml/dbt` | [Guide](guides/for-data-analyst.md) |
| Freelancer / Consultant | `npx claudient add skill small-business/freelancer-proposal` | [Guide](guides/for-freelancer.md) |
| Assistant exécutif / Chief of Staff | `npx claudient add skill productivity/meeting-to-action` | [Guide](guides/for-executive-assistant.md) |
| Éducateur / Créateur de cours | `npx claudient add skill small-business/online-course-creator` | [Guide](guides/for-educator.md) |
| Ingénieur logiciel | `npx claudient add skills backend` | utilise les compétences existantes — aucun guide dédié pour le moment |
| Admin santé | `npx claudient add skills small-business` | utilise les compétences existantes — aucun guide dédié pour le moment |

Chaque pack comprend : commandes slash spécifiques au domaine, un roster d'agents sélectionnés, un workflow quotidien, un plan de montée en charge de 30 jours et des configurations d'intégration d'outils.

---

## Piles de travail — 42 espaces de travail de domaine pré-filaires

Les piles d'espace de travail complètes avec un `CLAUDE.md`, 8 compétences et une structure de projet — chacune conçue pour un rôle ou un domaine spécifique. Déposez une pile dans votre projet et Claude a immédiatement une expertise de domaine.

### Ingénierie et infrastructure

| Pile | Domaine | Compétences |
|---|---|---|
| `fullstack_developer_stack` | Développement web full-stack | 8 |
| `frontend_engineer_stack` | React, Vue, Angular, Svelte | 8 |
| `api_developer_stack` | Conception d'API, OpenAPI, auth, webhooks | 8 |
| `devops_platform_stack` | Kubernetes, Terraform, CI/CD, IaC | 8 |
| `sre_stack` | SLOs, budgets d'erreurs, réponse aux incidents | 8 |
| `security_engineer_stack` | Pen testing, conformité, modélisation des menaces | 8 |
| `database_admin_stack` | Optimisation des requêtes, migrations, sauvegardes | 8 |
| `mobile_developer_stack` | React Native, Flutter, SwiftUI, Compose | 8 |
| `game_developer_stack` | Unity, Unreal, Godot, réseautage, physique | 8 |
| `embedded_iot_stack` | Firmware, RTOS, BLE, mises à jour OTA | 8 |
| `blockchain_web3_stack` | Contrats intelligents, DeFi, NFT, DAO | 8 |

### Données et IA

| Pile | Domaine | Compétences |
|---|---|---|
| `data_engineer_stack` | dbt, Spark, Airflow, pipelines de données | 8 |
| `mlai_engineer_stack` | Modèles ML, entraînement, déploiement, MLOps | 8 |
| `analytics_engineer_stack` | BI, tableaux de bord, métriques, expérimentation | 8 |

### Affaires et GTM

| Pile | Domaine | Compétences |
|---|---|---|
| `founder_ceo_stack` | Stratégie, levée de fonds, constitution d'équipe | 8 |
| `finance_cfo_stack` | Modélisation financière, économie unitaire, reporting | 8 |
| `gtm_engineer_stack` | HubSpot, CRM, revenue ops, analytics | 8 |
| `content_marketing_stack` | SEO, stratégie de contenu, copywriting | 8 |
| `customer_success_stack` | Rétention, NRR, onboarding, health scores | 8 |
| `sales_operations_stack` | Pipeline, prévisions, deal desk | 8 |
| `product_manager_stack` | Découverte, roadmaps, expériences | 8 |
| `growth_engineer_stack` | Expérimentation, test A/B, boucles de croissance | 8 |
| `brand_manager_stack` | Stratégie de marque, positionnement, directives | 8 |

### Opérations et support

| Pile | Domaine | Compétences |
|---|---|---|
| `operations_manager_stack` | Optimisation des processus, SOP, gestion des fournisseurs | 8 |
| `user_research_stack` | Conception d'études, entretiens, synthèse | 8 |
| `hr_people_operations_stack` | Workflows RH, analytique RH | 8 |
| `qa_testing_engineer_stack` | Stratégie de test, automatisation, qualité | 8 |
| `technical_writer_stack` | Documentation, docs API, guides de style | 8 |
| `legal_operations_stack` | Gestion de contrats, conformité | 8 |
| `podcast_producer_stack` | Production d'épisodes, distribution | 8 |
| `newsletter_writer_stack` | Rédaction de newsletters, croissance | 8 |
| `youtube_creator_stack` | Production vidéo, SEO, croissance | 8 |
| `investor_vc_stack` | Flux de transactions, due diligence, portefeuille | 8 |
| `recruiter_ta_stack` | Sourcing, sélection, onboarding | 8 |
| `ecommerce_operator_stack` | Shopify, marketplace, inventaire | 8 |
| `b2b_consultant_stack` | Gestion de clients, propositions | 8 |
| `ai_sdr_stack` | Workflows SDR alimentés par l'IA | 8 |
| `community_manager_stack` | Engagement communautaire, modération | 8 |
| `bio_research_stack` | Conception expérimentale, biostatistique, publication | 8 |
| `healthcare_stack` | Ops cliniques, HIPAA, intégration EHR, téléhealth | 8 |

```bash
# Installer une pile d'espace de travail complète
npx claudient add all   # inclut les 42 piles
```

---

## Démarrage rapide — Installer les compétences Claude Code en 30 secondes

```bash
# Tout installer
npx claudient add all

# Installer par domaine
npx claudient add skills backend          # 40+ compétences backend
npx claudient add skills devops-infra     # Kubernetes, Terraform, Docker, CI/CD
npx claudient add skills ai-engineering   # RAG, LangGraph, Claude API, MCP builder
npx claudient add skills legal            # RGPD, SOC 2, contrats, examen NDA
npx claudient add skills finance          # DCF, modèle 3 déclarations, pitch deck
npx claudient add skills small-business   # Invoice chaser, flux de trésorerie, Shopify

# Installer des agents
npx claudient add agents                  # Tous les 182+ agents spécialisés

# Installer dans votre langue
npx claudient add all --lang fr           # Français
npx claudient add all --lang de           # Allemand
npx claudient add all --lang nl           # Néerlandais
npx claudient add all --lang es           # Espagnol

# Découvrir
npx claudient search "circuit breaker"
npx claudient list
```

---

## Structure du dépôt

```
Claudient/
├── .claude-plugin/           # Manifestes de plugin et de marché
│   ├── plugin.json           # Métadonnées de plugin et chemins de composants
│   └── marketplace.json      # Catalogue du marché pour /plugin marketplace add
│
├── plugins/                  # 19 plugins de domaine installables
│   ├── claudient-productivity/     # 66 compétences
│   ├── claudient-small-business/   # 47 compétences
│   ├── claudient-backend/          # 41 compétences
│   ├── claudient-devops-infra/     # 36 compétences
│   ├── claudient-gtm/              # 32 compétences
│   ├── claudient-marketing/        # 22 compétences
│   ├── claudient-legal/            # 21 compétences
│   ├── claudient-sdr/              # 18 compétences
│   ├── claudient-ai-engineering/   # 17 compétences
│   ├── claudient-finance/          # 16 compétences
│   ├── claudient-data-ml/          # 15 compétences
│   ├── claudient-product/          # 15 compétences
│   ├── claudient-automation/       # 14 compétences
│   ├── claudient-database/         # 12 compétences
│   ├── claudient-git/              # 3 compétences
│   ├── claudient-commands/         # 100 commandes slash
│   ├── claudient-personas/         # 10 personas
│   └── claudient-everything/       # meta-bundle (tous les domaines)
│
├── skills/                   # 400+ compétences de domaine auto-invoquées
│   ├── backend/              # Next.js, FastAPI, Go, Rust, .NET, Rails, Laravel, Flutter
│   ├── devops-infra/         # Kubernetes, Terraform, Docker, CI/CD, AWS/GCP/Azure, Helm
│   ├── ai-engineering/       # Claude API, RAG, LangGraph, MCP builder, Agent Teams, Ultraplan
│   ├── data-ml/              # dbt, Spark, Kafka, MLOps, PyTorch, Pandas/Polars
│   ├── database/             # Drizzle, Prisma, PostgreSQL, Supabase, Redis, Elasticsearch
│   ├── gtm/                  # HubSpot, SDR, email automation, CRM hygiene, deal desk
│   ├── legal/                # Examen de contrats, RGPD, SOC 2, Loi IA de l'UE, NDA, vérification IP
│   ├── finance/              # DCF, modèle 3 déclarations, memo IC, pitch deck, GL reconciler
│   ├── marketing/            # SEO, SEO IA, publicités payantes, stratégie de contenu, CRO, copywriting
│   ├── product/              # Découverte, roadmap, recherche UX, teardown concurrentiel
│   ├── productivity/         # Examen PR, ADR writer, tech debt tracker, TDD guard
│   ├── small-business/       # Invoice chaser, QuickBooks, Shopify, 14 verticales de l'industrie
│   ├── automation/           # Playwright, automatisation du navigateur, Remotion, SaaS scaffolder
│   ├── computer-use/         # UI testing, visual QA, legacy-app automation, screenshot verify
│   ├── git/                  # Automatisation du workflow Git
│   ├── sdr/                  # Compétences du représentant du développement des ventes
│   └── finance-payments/     # Compétences des paiements et fintech
│
├── agents/                   # 182+ subagents spécialisés
│   ├── advisors/             # 15 agents de la suite C (PDG, CTO, CFO, CMO, CISO, COO, CPO...)
│   ├── core/                 # architect · planner · code-reviewer · security-reviewer
│   ├── roles/                # 100+ spécialistes de domaine (SRE, k8s, RAG, fintech, juriste...)
│   ├── specialists/          # small-business-advisor, ecommerce, local-services
│   ├── build-resolvers/      # Résolveurs d'erreurs de construction TypeScript et Python
│   └── sdr/                  # Agents SDR et GTM
│
├── commands/                 # 100+ commandes slash dans 12 catégories
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
├── hooks/                    # 40 automatisations pilotées par des événements
│   ├── pre-tool-use/         # secret-scanner · injection-scanner · block-dangerous · git-push-confirm
│   ├── post-tool-use/        # tdd-guard · lint-check · test-runner · auto-git-stage
│   ├── lifecycle/            # session-context-loader · keepalive-poke
│   ├── notification/         # telegram-pr-notify · ntfy-push · tts-announcer
│   ├── permission/           # auto-allow-readonly
│   ├── subagent/             # agent-comms
│   ├── context/              # context injection hooks
│   └── advanced/             # sound-system · audit-log · output-size-warn
│
├── guides/                   # 100+ fichiers de documentation lisibles
│   └── [de/ · es/ · fr/ · nl/]    # Versions traduites
├── workflows/                # 45+ workflows de processus de bout en bout
│   └── [de/ · es/ · fr/ · nl/]
├── prompts/                  # 31+ modèles de prompts réutilisables
│   ├── system-prompts/       # Modèles de prompt système basés sur des rôles
│   ├── project-starters/     # Prompts d'initialisation de projet
│   └── task-specific/        # Modèles de prompts spécifiques aux tâches
├── rules/                    # 32 fichiers de directives à suivre toujours
│   ├── common/               # Principes de codage et de workflow indépendants du langage
│   └── language-specific/    # Règles de style par langage
├── mcp/                      # 41 guides de configuration de serveur MCP
│   └── configs/              # Configurations JSON prêtes à l'emploi (GitHub, Postgres, Redis, Kafka, Docker, etc.)
├── personas/                 # 10 profils opérationnels
├── output-styles/            # 8 définitions de style de sortie
├── themes/                   # 10 thèmes UI (Dracula, Nord, Tokyo Night, Catppuccin...)
├── statuslines/              # 6 scripts de statusline
├── keybindings/              # 4 présets : vim · emacs · ergonomic · power-user
├── settings-templates/       # 5 modèles de démarrage settings.json
├── routines/                 # 10 modèles de routine de cloud-agents programmés
├── compatibility/            # Adaptateurs inter-harness (Cursor, Windsurf, Codex, Gemini, Copilot)
├── claude-md-examples/       # 20 modèles CLAUDE.md annotés du monde réel
├── examples/                 # Références de projets complets et fonctionnels
│   ├── agent-sdk/            # Démarreurs Agent SDK en Python et TypeScript
│   ├── nextjs-saas/          # Next.js + Supabase + Stripe
│   ├── fastapi-ai-app/       # FastAPI + Claude API
│   ├── go-cli-tool/          # Outil CLI Go
│   └── dbt-pipeline/         # Pipeline de données dbt
├── structures/               # 83 modèles de structure de projet
├── *_stack/                  # 42 piles d'espace de travail pré-filaires (CLAUDE.md + 8 compétences chacune)
├── scripts/                  # Scripts de compilation et d'utilitaires
├── docs/                     # ADR et documentation interne
└── index.json                # Index complet et consultable (npx claudient search)
```

---

## Compétences Claude Code les plus populaires en ce moment

| Compétence / Agent | Ce qu'elle fait | Catégorie |
|---|---|---|
| `/nextjs-app` | Next.js App Router, Server Components, Server Actions, Drizzle | Backend |
| `/fastapi` | FastAPI de production avec auth, Pydantic, async, tests, Docker | Backend |
| `/sre-engineer` | Conception SLO, budgets d'erreurs, alertes de burn rate, runbooks | Agent |
| `/security-audit` | Scan OWASP Top 10, vérification d'exposition de secrets avant chaque PR | Agent |
| `/invoice-chaser` | Rappels AR automatisés et escalade de paiement (aucun code requis) | Petite entreprise |
| `/hubspot` | Automatisation CRM via le serveur HubSpot MCP officiel | GTM |
| `/rag-architect` | Stratégie de chunking, embeddings, récupération, reranking, eval | Ingénierie IA |
| `/kubernetes-architect` | Manifestes K8s, charts Helm, HPA, NetworkPolicy, RBAC | DevOps |
| `/smart-contract-audit` | Audit de sécurité Solidity — reentrancy, contrôle d'accès, oracles | Blockchain/Web3 |
| `/unity-csharp` | Unity DOTS/ECS, MonoBehaviour, ScriptableObjects | Développement de jeux |
| `/firmware-architecture` | HAL, drivers, disposition mémoire pour les systèmes embarqués | Embarqué/IoT |

---

<a name="top-100-mcp-servers"></a>

## Top 100 serveurs MCP pour Claude Code — Indie Builder Starter Stack

> **Le moyen le plus rapide d'étendre Claude Code.** Les serveurs MCP donnent à Claude un accès direct à vos outils — GitHub, Figma, Stripe, Jira, Notion, Slack et 94 autres.

**La pile de démarrage indie builder :**

| Serveur | Ce qu'il fait | Recherches mensuelles |
|--------|-------------|-----------------|
| [Playwright MCP](mcp/playwright-mcp.md) | Automatisation du navigateur — naviguer, cliquer, capture d'écran, scraper | 82K |
| [Figma MCP](mcp/figma.md) | Lire les designs, extraire les tokens, générer des composants à partir des specs | 74K |
| [GitHub MCP](mcp/github.md) | Lire les PR, créer des issues, rechercher du code, gérer les releases | 69K |
| [Atlassian MCP](mcp/atlassian.md) | Tickets Jira, docs Confluence, gestion de sprint | 40K |
| [Memory MCP](mcp/memory.md) | Graphe de connaissances persistant à travers les sessions Claude Code | — |
| [Stripe MCP](mcp/stripe.md) | Requête clients, abonnements, paiements, données d'attrition | — |
| [Notion MCP](mcp/notion.md) | Lire/écrire des pages, requête de bases de données, créer des docs | — |
| [Taskmaster MCP](mcp/taskmaster.md) | Gestion des tâches IA avec isolation du contexte à travers les sessions | — |
| [Postgres MCP](mcp/postgres.md) | Requêtes SQL, inspection de schéma, gestion de tables | — |
| [Redis MCP](mcp/redis.md) | Inspection du cache, gestion des clés, stats mémoire | — |
| [Jira MCP](mcp/jira.md) | Gestion des issues, suivi des sprints, requêtes JQL | — |
| [Docker MCP](mcp/docker.md) | Inspection des conteneurs, analyse des logs, surveillance des ressources | — |

**→ [Guide complet : Top 100 serveurs MCP pour les Indie Builders](mcp/top-mcp-servers.md)** — configurations d'installation, classements de tier et bundles sélectionnés pour chaque pile.

```bash
npx claudient add mcp starter   # GitHub + Memory + Playwright
npx claudient add mcp all       # Tous les 40 guides de configuration individuels
```

---

<a name="claude-for-small-business"></a>

## Claude pour les petites entreprises — 30+ compétences verticales

> **La base de connaissances communautaire la plus complète pour utiliser Claude dans une petite entreprise.** Des compétences en langage clair, aucun terminal requis, écrites pour les propriétaires qui paient déjà pour QuickBooks, Shopify, HubSpot et le reste. Claudient étend le lancement officiel d'Anthropic [Claude pour les petites entreprises](guides/claude-for-small-business.md) avec 30+ compétences couvrant la longue traîne de verticales et de workflows.

```bash
npx claudient add skills small-business
```

### Claude pour les petites entreprises par verticale

Chaque guide est une page de destination de bout en bout pour une industrie spécifique — setup, pile de compétences, attentes 30/60/90, FAQ.

| Vous êtes... | Commencez ici |
|---|---|
| **Solopreneur, fondateur solo, side-hustler** | [Claude pour les solopreneurs](guides/claude-for-solopreneurs.md) |
| **Vendeur Shopify, Amazon, Etsy ou DTC** | [Claude pour l'e-commerce](guides/claude-for-ecommerce.md) |
| **Métiers, salon, dentaire, fitness, restaurant, agent immobilier** | [Claude pour les services locaux](guides/claude-for-local-services.md) |
| **Coach exécutif, consultant en affaires, conseiller fractionnaire** | [Claude pour les coaches et consultants](guides/claude-for-coaches-consultants.md) |
| **Rédacteur de newsletters, podcasteur, créateur de cours** | [Claude pour les créateurs](guides/claude-for-creators.md) |
| **Première fois, voulez un aperçu complet** | [Claude pour les petites entreprises — Guide produit](guides/claude-for-small-business.md) |

### Compétences des petites entreprises les plus populaires

| Compétence | Automatise | Fonctionne avec |
|---|---|---|
| `/invoice-chaser` | Rappels AR, escalade de paiement | QuickBooks, Stripe |
| `/quickbooks-workflow` | Clôture de fin de mois, rapprochement | QuickBooks |
| `/cash-flow-forecast` | Position de trésorerie sur 30 jours, runway de paie | QuickBooks, PayPal |
| `/expense-audit` | Creep d'abonnement, fournisseurs dupliqués | QuickBooks |
| `/content-repurposer` | 1 brief → blog + réseaux sociaux + email + annonces | Canva |
| `/review-response` | Gestion d'avis Google/Yelp | Google, Yelp |
| `/customer-inquiry` | Répondeur FAQ, réponses après-heures | Site web, CRM |
| `/shopify-operations` | Descriptions de produits, alertes d'inventaire | Shopify |
| `/sop-writer` | Procédures d'exploitation standard | Toute entreprise |
| `/weekly-pulse` | Tableau de bord KPI de tous vos outils | Multi-outils |

### Compétences spécifiques aux verticales

| Verticale | Compétence |
|---|---|
| E-commerce (multi-plateforme) | [`/ecommerce-seller`](skills/small-business/ecommerce-seller.md) |
| Salon, spa, barbershop | [`/salon-spa-ops`](skills/small-business/salon-spa-ops.md) |
| Cabinet dentaire | [`/dental-practice`](skills/small-business/dental-practice.md) |
| Studio de fitness, gym | [`/fitness-gym-ops`](skills/small-business/fitness-gym-ops.md) |
| Cabinet de coaching | [`/coaching-business`](skills/small-business/coaching-business.md) |
| Cours en ligne | [`/online-course-creator`](skills/small-business/online-course-creator.md) |
| Newsletter | [`/newsletter-publisher`](skills/small-business/newsletter-publisher.md) |
| Agence marketing/créative | [`/agency-operations`](skills/small-business/agency-operations.md) |
| Métiers (plomberie, CVC, électrique) | [`/contractor-trades`](skills/small-business/contractor-trades.md) |
| Studio de photographie | [`/photography-studio`](skills/small-business/photography-studio.md) |
| Cabinet de comptabilité | [`/bookkeeper-practice`](skills/small-business/bookkeeper-practice.md) |
| Podcast | [`/podcast-monetizer`](skills/small-business/podcast-monetizer.md) |
| Immobilier | [`/real-estate-listing`](skills/small-business/real-estate-listing.md) |
| Restaurant | [`/restaurant-ops`](skills/small-business/restaurant-ops.md) |

### Compétences d'opérateur (transversales)

| Compétence | Cas d'usage |
|---|---|
| [`/hiring-pipeline`](skills/small-business/hiring-pipeline.md) | Sélection structurée pour flux de candidatures à haut volume |
| [`/churn-prevention`](skills/small-business/churn-prevention.md) | Identification à risque et récupération pour entreprises d'abonnement |
| [`/pricing-optimizer`](skills/small-business/pricing-optimizer.md) | Examen des prix structuré, plan de migration, conception de test A/B |
| [`/freelancer-proposal`](skills/small-business/freelancer-proposal.md) | Appel de découverte → propositions de marque en 20 minutes |
| [`/lead-triager`](skills/small-business/lead-triager.md) | Scoring ICP sur les nouveaux contacts, liste d'appels priorisée |
| [`/meeting-to-action`](skills/small-business/meeting-to-action.md) | Transcription → liste d'actions + email de suivi |
| [`/customer-feedback-synthesizer`](skills/small-business/customer-feedback-synthesizer.md) | Détection de motifs à travers 100+ avis |
| [`/competitor-monitor`](skills/small-business/competitor-monitor.md) | Ce que vos 3 concurrents les plus proches ont lancé ce mois-ci |
| [`/margin-analyzer`](skills/small-business/margin-analyzer.md) | Marge brute par produit, canal, client |
| [`/tax-organizer`](skills/small-business/tax-organizer.md) | Paquet CPA à partir de QuickBooks et dossier de reçus |

### Agents spécialisés pour les petites entreprises

- [`small-business-advisor`](agents/specialists/small-business-advisor.md) — diagnostic généraliste et priorisation de workflows
- [`ecommerce-specialist`](agents/specialists/ecommerce-specialist.md) — pour les opérateurs Shopify/Amazon/Etsy/DTC
- [`local-services-specialist`](agents/specialists/local-services-specialist.md) — pour les métiers, salon, dentaire, fitness, restaurant, immobilier
- [`restaurant-specialist`](agents/roles/restaurant-specialist.md) — opérations spécifiques aux restaurants
- [`real-estate-specialist`](agents/roles/real-estate-specialist.md) — opérations d'agents immobiliers et de courtage

```bash
npx claudient add agents small-business
```

---

## FAQ — Claude pour les petites entreprises

### Qu'est-ce que Claude pour les petites entreprises ?

Claude pour les petites entreprises est la couche de produit axée sur les petites entreprises d'Anthropic dans Claude Cowork, lancée le 13 mai 2026, avec 15 workflows officiels. Claudient est la base de connaissances communautaire qui étend ces workflows avec 30+ compétences supplémentaires couvrant la longue traîne de verticales (dentaire, salon, métiers, photographie, coaching, e-commerce) et de workflows d'opérateur (embauche, attrition, tarification, propositions). [Lisez le guide produit](guides/claude-for-small-business.md).

### Claude est-il bon pour les propriétaires de petites entreprises ?

Oui. Les propriétaires exploitant des entreprises de 1 à 50 personnes économisent généralement 6 à 12 heures par semaine dans les 30 jours, sur le travail mécanique qui remplissait auparavant leurs soirées — facturation, suivi des prospects, rapports hebdomadaires, repurposage de contenu, FAQ clients. Les compétences Claudient sont écrites en premier par les opérateurs, aucun terminal requis.

### En quoi Claude est-il différent de ChatGPT pour les petites entreprises ?

ChatGPT est un assistant de discussion généraliste. Claude pour les petites entreprises se connecte à vos outils commerciaux réels — QuickBooks, HubSpot, PayPal, Google Workspace, Shopify — et produit des outputs basés sur vos données réelles. ChatGPT peut rédiger un rappel de facture générique ; Claude lit votre rapport réel de vieillissement AR et rédige des rappels personnalisés par facture. La différence s'accumule dans chaque workflow.

### Combien coûte Claude pour une petite entreprise ?

20 $/mois pour Claude Pro couvre la plupart des propriétaires solo et des petites opérations. 30 $/siège/mois pour Claude Team si vous avez un partenaire, un gestionnaire de bureau ou un assistant utilisant les workflows. 100 $/mois pour Claude Max si vous exécutez 6+ workflows quotidiens sur de grands ensembles de données. Tout le reste — QuickBooks, HubSpot, Shopify — vous le payez déjà.

### Dois-je savoir comment coder ?

Non. Les workflows officiels de Claude pour les petites entreprises sont point-and-click dans Claude Cowork. Les compétences Claudient dans ce repo sont activées en tapant de l'anglais clair à Claude. Le seul setup est la connexion OAuth de vos outils existants, ce qui prend quelques clics par outil.

### Claude peut-il lire mes données QuickBooks ?

Oui, une fois que vous autorisez l'intégration QuickBooks Online via OAuth. Claude lit vos factures, transactions, clients et rapports au moment où un workflow s'exécute. Il ne scrute pas votre compte en arrière-plan, et Anthropic n'utilise pas les données commerciales connectées pour entraîner Claude.

### Claude peut-il remplacer mon comptable ou mon CPA ?

Non, et vous ne devriez pas le vouloir. Claude prépare le rapprochement, organise les reçus et rédige le P&L. Votre comptable ou CPA examine et approuve. Le coût combiné est inférieur à un comptable seul, et le délai d'exécution est plus rapide.

### Claude fonctionne-t-il avec Shopify ?

Oui, via le MCP Shopify officiel. La [compétence Shopify Operations](skills/small-business/shopify-operations.md) et la [compétence Ecommerce Seller](skills/small-business/ecommerce-seller.md) couvrent les descriptions de produits, les alertes d'inventaire, les titres SEO, les mises à jour de collections et le travail de liste inter-plateforme.

### Claude fonctionne-t-il avec HubSpot ?

Oui, via le MCP HubSpot officiel. [Lead Triager](skills/small-business/lead-triager.md), [Cold Outreach](skills/small-business/cold-outreach.md) et [Email Campaign](skills/small-business/email-campaign.md) lisent tous les deux et écrivent dans HubSpot via l'intégration.

### Comment commencer ?

Exécutez `npx claudient add skills small-business` pour installer chaque compétence de petite entreprise dans votre environnement Claude Code. Ensuite, commencez par un workflow — [Invoice Chaser](skills/small-business/invoice-chaser.md) est le point de départ avec le ROI le plus élevé pour la plupart des entreprises — et examinez attentivement le résultat à la première exécution.

### Claude pour les petites entreprises en vaut-il la peine ?

Pour les entreprises où le propriétaire passe 6+ heures par semaine sur les activités que Claude couvre (facturation, suivi des prospects, rapports, contenu, FAQ clients, opérations verticales), oui — généralement un ROI de 3-5x dans les 60 jours. Pour les entreprises utilisant déjà des piles automatisées étroites, le rendement marginal est plus petit. Lisez le [guide ROI](guides/small-business-roi.md) pour la calculatrice et les données de référence.

### Que se passe-t-il si je n'utilise aucun de ces outils ?

Les compétences Claudient s'exécutent sur les données copier-coller lorsqu'une intégration directe n'est pas disponible. Vous perdez une partie de l'automatisation du workflow mais gardez le brouillon structuré, la notation et l'analyse. Par exemple, [Review Response](skills/small-business/review-response.md) fonctionne sur les avis Google que vous collez, même sans intégration Google.

---

<a name="agents"></a>

## 182+ agents spécialisés Claude Code

Agents spécialisés invoqués avec l'outil `Agent` dans Claude Code. Chaque agent a un modèle spécifique, des restrictions d'outils et des conditions de déclenchement afin que Claude délègue le bon travail au bon expert.

### Conseillers de la suite C (15 agents)

| Agent | Domaine |
|---|---|
| `ceo-advisor` | Stratégie, préparation du conseil, relations investisseurs, conception organisationnelle |
| `cto-advisor` | Décisions d'architecture, make vs buy, stratégie technique |
| `cfo-advisor` | Économie unitaire, levée de fonds, gestion de trésorerie, modélisation |
| `cmo-advisor` | Stratégie GTM, allocation de canaux, positionnement, demande gen |
| `ciso-advisor` | Conception du programme de sécurité, priorisation des risques, rapports du conseil |
| `coo-advisor` | Conception des processus, OKR, mise à l'échelle des opérations |
| `cpo-advisor` | Roadmap, découverte, tarification, stratégie PLG |
| `cro-advisor` | Prévisions de revenus, analyse NRR, conception de modèle de ventes |
| `general-counsel` | Risque légal, examen de contrats, aperçu de conformité |
| `chief-of-staff` | Rythme opérationnel, facilitation OKR, levier PDG |
| + 5 autres | CDO, CAIO, VPE, CHRO, CCO |

### Spécialistes en ingénierie

`sre-engineer` · `chaos-engineer` · `penetration-tester` · `kubernetes-architect` · `security-auditor` · `platform-engineer` · `network-engineer` · `rust-engineer` · `mlops-engineer` · `graphql-architect` · `websocket-engineer` · `fullstack-developer` · `llm-architect` · `codebase-orchestrator` · `multi-agent-coordinator` + 30 autres

### Spécialistes de domaine

`competitive-analyst` · `market-researcher` · `trend-analyst` · `quant-analyst` · `fintech-engineer` · `healthcare-admin` · `legal-advisor` · `nlp-engineer` · `data-pipeline-architect` + plus

```bash
npx claudient add agents
```

---

<a name="skills-by-category"></a>

## Compétences par catégorie — 400+ compétences Claude Code

**400+ compétences · 19 catégories · EN · FR · DE · NL · ES**

| Catégorie | Nombre | Compétences populaires |
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

## 40 hooks Claude Code — Automatisation pilotée par événements

Automatisation pilotée par événements pour Claude Code — s'exécute en dehors du contexte de Claude comme des processus shell réels sur les événements du bon cycle de vie.

| Hook | Événement | Ce qu'il fait |
|---|---|---|
| `secret-scanner` | PreToolUse | Bloque les écritures contenant les clés API ou les identifiants |
| `tdd-guard` | PostToolUse | Bloque les fichiers d'implémentation sans test correspondant |
| `injection-scanner` | PreToolUse | Scanne les entrées d'outils pour les tentatives d'injection de prompts |
| `plannotator` | ExitPlanMode | Annotation interactive du plan avant l'exécution de Claude |
| `lint-check` | PostToolUse | Linting automatique TypeScript/Python après chaque édition de fichier |
| `test-runner` | PostToolUse | Exécute les tests associés après édition d'un fichier source |
| `telegram-pr-notify` | PostToolUse | Envoie un message Telegram lorsqu'une PR est créée |
| `keepalive-poke` | Stop | Continue les sessions autonomes sans intervention |
| `sound-system` | All events | Sons natifs à la plateforme pour 27 événements Claude Code |
| `session-context-loader` | SessionStart | Injecte la date, la branche, les commits récents au démarrage de la session |
| `ntfy-push` | Notification | Alertes push mobiles via ntfy |
| `tts-announcer` | Stop | Prononce le message final de Claude à haute voix |
| + 28 autres | — | Auto-stage git, sauvegarde de transcription, compresseur de sortie, enregistreur de bug, notificateur Slack, portail WhatsApp... |

---

## Guides et workflows — 100+ guides et workflows Claude Code

### Guides (100+)

[Mise en route](guides/getting-started.md) · [Référence frontmatter d'agent](guides/agent-frontmatter.md) · [Référence frontmatter des compétences](guides/skills-frontmatter.md) · [Cadre de décision](guides/decision-framework.md) · [Agents gérés Claude](guides/claude-managed-agents.md) · [Utilisation avancée d'outils](guides/advanced-tool-use.md) · [Dictée vocale](guides/voice-dictation.md) · [Application de bureau](guides/desktop-app.md) · [Migration Opus 4.7](guides/opus-47-migration.md) · [Livre de recettes des hooks](guides/hooks-cookbook.md) · [Modèles multi-agents](guides/multi-agent-patterns.md) · [Modèles de subagents](guides/subagent-patterns.md) · [Gestion du contexte](guides/context-management.md) · [Réduction des coûts en tokens](guides/token-cost-reduction.md) · [Configuration des notifications](guides/notifications-setup.md) · [Authoring de plugins](guides/plugin-authoring.md) · [Cadre RIPER](guides/riper-framework.md) · [Workflow RPI](guides/rpi-workflow.md) · [Référence CLI](guides/cli-reference.md) · [Portée des paramètres](guides/settings-scope.md) · [Pourquoi utiliser Claude Code](guides/why-use-claude-code.md) · [Routines](guides/routines.md) · [Computer Use](guides/computer-use.md) · [Ultraplan](guides/ultraplan.md) · [Mode auto](guides/auto-mode.md) + 39 autres

### Workflows (45+)

[Développement de fonctionnalités RPI](workflows/rpi-feature.md) · [RIPER](workflows/riper.md) · [Compilation incrémentale](workflows/incremental-build.md) · [Examen pré-humain](workflows/pre-human-review.md) · [Boucle autonome](workflows/autonomous-loop.md) · [Cycle de vie Worktree](workflows/worktree-lifecycle.md) · [Saga multi-agents](workflows/multi-agent-saga.md) · [Chaos Game Day](workflows/chaos-game-day.md) · [Budget d'erreurs](workflows/error-budget.md) · [Investigation de bugs](workflows/bug-investigation.md) · [Ingénierie composée](workflows/compound-engineering.md) · [Apprentissage de session](workflows/session-learning.md) + plus

---

## Ce qui est inclus — Boîte à outils Claude Code complète

| Type | Nombre |
|---|---|
| **Compétences** | **400+** |
| **Agents** | **182+** |
| **Piles d'espace de travail** | **42** |
| **Hooks** | **40** |
| **Guides de configuration MCP** | **40** |
| **Routines** | **10** |
| **Guides** | **100+** |
| **Workflows** | **45+** |
| **Prompts** | **31+** |
| **Règles** | **32** |
| **Langues** | **5 (EN · FR · DE · NL · ES)** |

---

<a name="translations"></a>

## 5 langues — Compétences Claude Code en EN · FR · DE · NL · ES

Chaque compétence, agent, guide, workflow et prompt est disponible en :

**🇬🇧 Anglais · 🇫🇷 Français · 🇩🇪 Allemand · 🇳🇱 Néerlandais · 🇪🇸 Espagnol**

```bash
npx claudient add all --lang fr   # Français
npx claudient add all --lang de   # Allemand
npx claudient add all --lang nl   # Néerlandais
npx claudient add all --lang es   # Espagnol
```

---

## Contribuer une compétence Claude Code — Soyez mis en avant

Claudient est basé sur la communauté. Chaque compétence vit dans un fichier markdown. Contribuer une compétence Claude Code prend moins de temps que de classer un problème GitHub.

1. Lisez le [Guide d'authoring des compétences](guides/skill-authoring.md) — 5 minutes
2. Forkez, ajoutez votre compétence dans un fichier `.md`
3. Soumettez une PR — les compétences fusionnées sont mises en avant dans **Les plus populaires**

**Rubriques GitHub recommandées pour les projets Claude Code :** `claude` · `claude-code` · `anthropic` · `llm-tools` · `mcp` · `developer-tools` · `prompt-engineering` · `ai-assistant`

**[Discussions GitHub](https://github.com/Claudient/Claudient/discussions) · [CONTRIBUTING.md](CONTRIBUTING.md) · [Reddit](https://www.reddit.com/r/uitbreiden/)**

---

## Construit par Uitbreiden

Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — construction de produits IA et d'outils B2B avec des communautés de développeurs.

[![Reddit](https://img.shields.io/badge/Reddit-r%2Fuitbreiden-FF4500?logo=reddit&logoColor=white)](https://www.reddit.com/r/uitbreiden/)
[![YouTube](https://img.shields.io/badge/YouTube-%40UITBREIDEN-FF0000?logo=youtube&logoColor=white)](https://www.youtube.com/@UITBREIDEN)
[![Website](https://img.shields.io/badge/Website-uitbreiden.com-f97316)](https://uitbreiden.com/)

---

## Licence

Double licence :

- **Code** — [AGPL-3.0](LICENSE-CODE). Le site Astro, scripts de hooks, source du package npm, tout ce qui est exécutable.
- **Contenu** — [CC-BY-SA-4.0](LICENSE-CONTENT). Tous les fichiers markdown skills, agents, hooks, configurations MCP, workflows, guides, prompts, règles et documentation.

Voir [LICENSE](LICENSE) pour la justification et les détails complets. Pour les demandes de licences commerciales, écrivez à [hello@uitbreiden.com](mailto:hello@uitbreiden.com).

© 2026 [Uitbreiden](https://uitbreiden.com/) · Tushar Aggarwal
