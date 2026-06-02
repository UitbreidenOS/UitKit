# Structures

Project structures are ready-to-use directory blueprints — opinionated, stack-specific layouts for real projects and real roles. Each file pairs a deep directory tree with a pre-written CLAUDE.md, MCP server configs, hook definitions, and skill install commands so you can scaffold a working Claude Code setup in minutes. Unlike `guides/`, which teach concepts in depth, structures are reference artifacts you paste and adapt — the goal is to eliminate the blank-page problem when starting a new project or configuring a new workspace.

## How to pick

**Workspace vs. template:** Pick a *Professional Workspace* if you are setting up a personal Claude Code environment around a job function (e.g., you are a data analyst and want Claude to understand your toolchain across all projects). Pick a *Project Template* if you are scaffolding a specific codebase or business operation and need a full directory layout and CLAUDE.md for that project type.

**By role:** Browse the Professional Workspaces table and match your title or primary toolchain. Each workspace is self-contained — install the skills listed, drop the CLAUDE.md into your home project, and Claude Code will understand your context.

**By project type:** Browse the Project Templates table and match the kind of thing you are building. Templates are more prescriptive — they include real file names, real subdirectory depth, and environment variable conventions specific to the stack.

---

## Professional Workspaces

| File | Role | Primary Tools |
|---|---|---|
| `sdr-workspace.md` | Sales Development Representative | HubSpot, Apollo, LinkedIn Sales Navigator, Gong, Slack |
| `account-executive-workspace.md` | Account Executive | Salesforce, Gong, Notion, Clari, DocuSign, Slack |
| `content-marketer-workspace.md` | Content Marketer | Notion, Webflow, Ahrefs, Buffer, Google Analytics, Figma |
| `cto-workspace.md` | Chief Technology Officer | GitHub, Linear, Terraform, Datadog, Notion, Google Meet |
| `customer-success-workspace.md` | Customer Success Manager | Gainsight, Salesforce, Intercom, Looker, Slack, Notion |
| `data-analyst-workspace.md` | Data Analyst | BigQuery / Snowflake, dbt, Looker / Metabase, Python, Jupyter |
| `devops-sre-workspace.md` | DevOps / SRE | Terraform, Kubernetes, Datadog, PagerDuty, GitHub Actions, Grafana |
| `ecommerce-operator-workspace.md` | E-commerce Operator | Shopify, Google Analytics 4, Klaviyo, Meta Ads, Gorgias |
| `educator-workspace.md` | Educator / Instructor | Notion, Google Classroom, Loom, Canva, Zoom, Typeform |
| `email-marketer-workspace.md` | Email Marketer | Klaviyo / Mailchimp, Litmus, Google Analytics, Figma, Notion |
| `executive-assistant-workspace.md` | Executive Assistant | Google Workspace, Notion, Calendly, Slack, Zoom, Asana |
| `finance-analyst-workspace.md` | Finance Analyst | Excel / Google Sheets, Pigment / Mosaic, QuickBooks, Looker, Python |
| `founder-workspace.md` | Founder / CEO | Notion, Linear, Stripe, Slack, Google Analytics, Figma |
| `freelancer-workspace.md` | Freelancer | Notion, Toggl, Bonsai / HoneyBook, Slack, Figma, GitHub |
| `growth-marketer-workspace.md` | Growth Marketer | Amplitude, Mixpanel, Google Ads, Meta Ads, Segment, Notion |
| `healthcare-admin-workspace.md` | Healthcare Administrator | EHR systems, Google Workspace, Slack, Zoom, HIPAA-compliant storage |
| `investor-workspace.md` | Investor / VC Analyst | Affinity CRM, Carta, Notion, PitchBook, Google Sheets, Slack |
| `legal-compliance-workspace.md` | Legal / Compliance | Ironclad, DocuSign, Notion, Google Workspace, Slack, Clio |
| `operations-manager-workspace.md` | Operations Manager | Notion, Asana / Linear, Google Sheets, Slack, Zapier, Airtable |
| `product-manager-workspace.md` | Product Manager | Linear, Notion, Figma, Mixpanel / Amplitude, GitHub, Slack |
| `real-estate-workspace.md` | Real Estate Professional | MLS, DocuSign, Zillow, Google Sheets, Calendly, Slack |
| `recruiter-workspace.md` | Recruiter | Greenhouse / Lever, LinkedIn Recruiter, Notion, Calendly, Slack |
| `software-engineer-workspace.md` | Software Engineer | GitHub, VS Code, Docker, Datadog, Linear, Slack |
| `technical-writer-workspace.md` | Technical Writer | GitHub, Docusaurus / Mintlify, Figma, Notion, Grammarly |
| `ux-designer-workspace.md` | UX Designer | Figma, Notion, Maze / Hotjar, Linear, Loom, Slack |

---

## Project Templates

| File | Project Type | Stack |
|---|---|---|
| `saas-web-app.md` | Full-stack SaaS product | Next.js 14, Supabase, Drizzle ORM, Stripe, Tailwind, Vercel |
| `rest-api-service.md` | Backend REST API | FastAPI or Express, PostgreSQL, Redis, Docker, GitHub Actions |
| `mobile-app.md` | Cross-platform mobile app | React Native + Expo, Supabase, EAS Build, App Store / Play Store |
| `chrome-extension.md` | Browser extension | TypeScript, Plasmo or CRXJS, React, Chrome APIs, Web Store |
| `cli-tool.md` | Command-line tool | Node.js + Commander or Python + Click / Typer, npm / PyPI publish |
| `monorepo.md` | Multi-package monorepo | Turborepo, pnpm workspaces, TypeScript, Changesets, GitHub Actions |
| `microservices.md` | Microservices system | Docker Compose, Kubernetes, gRPC, API Gateway, Datadog, Terraform |
| `infrastructure-as-code.md` | Cloud infrastructure | Terraform 1.8, GitHub Actions, AWS or GCP, remote state, modules |
| `open-source-library.md` | OSS library / SDK | TypeScript or Python, semantic-release, npm / PyPI, GitHub Actions, docs |
| `documentation-site.md` | Technical docs site | Docusaurus 3 or Mintlify, MDX, Algolia, GitHub Actions, Vercel |
| `ml-research-project.md` | ML research repo | Python, PyTorch or JAX, Jupyter, Weights & Biases, HuggingFace, DVC |
| `ai-agent-app.md` | AI agent application | Claude API, LangGraph or custom orchestration, tools, MCP, streaming |
| `rag-knowledge-base.md` | RAG system | Embeddings, pgvector or Pinecone, chunking pipeline, retrieval eval |
| `data-pipeline.md` | Data engineering pipeline | Airflow or Dagster, Python, dbt, BigQuery or Snowflake, Great Expectations |
| `analytics-platform.md` | Full analytics platform | Fivetran / Airbyte, BigQuery / Snowflake, dbt Core, Looker / Metabase, Soda |
| `marketing-agency.md` | Marketing agency operations | Notion, Asana, HubSpot, Canva, Google Analytics, Meta Ads |
| `ecommerce-brand.md` | E-commerce brand | Shopify, Klaviyo, Google Analytics 4, Meta / Google Ads, Gorgias |
| `freelance-studio.md` | Freelance design / dev studio | Notion, Bonsai, Figma, GitHub, Toggl, Stripe |
| `legal-firm.md` | Legal practice | Clio, DocuSign, Notion, Microsoft 365, Calendly, HIPAA-compliant storage |
| `investment-fund.md` | Investment fund operations | Affinity CRM, Carta, Notion, Google Sheets, DocuSign, PitchBook |
| `newsletter-business.md` | Newsletter publication | Beehiiv or Substack, Notion, Ghost, Canva, Stripe, ConvertKit |
| `podcast-studio.md` | Podcast production | Descript, Riverside, Notion, Transistor or Buzzsprout, Canva, Slack |
| `online-course-business.md` | Online education business | Kajabi or Teachable, Loom, Notion, Stripe, ConvertKit, Circle |
| `design-agency.md` | Design agency | Figma, Notion, Linear, Harvest, Bonsai, Loom, Slack |
| `nonprofit-operations.md` | Nonprofit organization | Salesforce Nonprofit, Mailchimp, Google Workspace, Stripe, Airtable, Zoom |

---

## What each structure file contains

Every structure file follows the same eight-section format so you always know where to look:

- **Stack** — specific versioned tools with their roles in the system
- **Directory tree** — deep ASCII tree with real file names, real subdirectory depth, and inline comments on every meaningful file and directory
- **Key files explained** — a table of 8–10 critical files with precise descriptions of what each one does and why it matters
- **Quick scaffold** — real shell commands to bootstrap the structure from scratch, including `npx claudient add` skill installs
- **CLAUDE.md template** — a 50+ line, ready-to-paste CLAUDE.md specific to the stack, covering common tasks, env var conventions, access control, and anti-patterns
- **MCP servers** — a ready-to-paste `mcpServers` JSON block with real MCP server configurations for the stack
- **Recommended hooks** — a ready-to-paste `hooks` JSON block with `PreToolUse` and `PostToolUse` hooks tailored to the project type
- **Skills to install** — `npx claudient add` commands for every relevant skill

---

## Related

- [Guides](../guides/) — in-depth documentation on Claude Code features, tools, and integrations
- [Workflows](../workflows/) — end-to-end multi-step process documentation for recurring tasks

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
