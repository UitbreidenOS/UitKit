# Claudient Media Outreach Strategy

## Overview

Claudient is a game-changing knowledge system for Claude Code — 400+ skills, 182+ agents, 42 workspace stacks, 41 MCP configs, 100+ slash commands, and a full plugin marketplace. This outreach plan targets tech journalists, developer communities, and indie builders.

---

## Target Outlets

### Tier 1: Major Tech Publications

| Outlet | Contact | Angles |
|---|---|---|
| **TechCrunch** | News@TechCrunch.com | AI developer tools, Claude ecosystem, plugin marketplace |
| **VentureBeat** | News@VentureBeat.com | Claude Code adoption, developer productivity, AI workflows |
| **InfoQ** | editorial@infoq.com | Enterprise AI, AI engineering practices, tool integration |
| **The Verge** | news@theverge.com | Anthropic ecosystem, AI tools for creators |
| **Hacker News** | — | Self-post + organic engagement (high-impact) |
| **Slashdot** | editors@slashdot.org | Open-source AI, developer tools |

### Tier 2: Developer Platforms & Communities

| Platform | Strategy |
|---|---|
| **GitHub Trending** | Add to awesome-lists, optimize README with keywords |
| **Product Hunt** | Launch with founder story + press kit link |
| **Indie Hackers** | Post launch + founder AMA |
| **Dev.to** | Cross-post CEO article on AI developer workflows |
| **Hashnode** | Launch announcement + 3-part skill series |

### Tier 3: Reddit & Discord Communities

| Community | Strategy | Posting guide |
|---|---|---|
| **r/Claude** | Announcement post, AMA | Direct link + highlight use cases |
| **r/LocalLLM** | Skill examples (RAG, MCP) | Show real workflows |
| **r/SideProject** | Founder story | Include press kit |
| **r/uitbreiden** (native) | Daily skills + updates | Sticky pinned |
| **Claude Discord** | #announcements + #skills channel | Announce + demo |
| **Anthropic Discord** | Appropriate channels | Link to GitHub |

---

## Press Kit

### Download Link
```
https://github.com/UitbreidenOS/Claudient/tree/main/press-kit
```

### Press Kit Contents (Create at `/Users/tushar/Desktop/Claudient/press-kit/`)

1. **One-liner**: The definitive open-source Claude Code knowledge base — 400+ skills, 182+ agents, 42 workspace stacks. Install in 30 seconds.

2. **Two-paragraph pitch**: See below

3. **High-res logo files** (4 formats)
   - `.png` (transparent)
   - `.svg` (scalable)
   - Dark & light variants

4. **Founder bio** (Tushar Aggarwal)

5. **Stats sheet**
   - 400+ skills
   - 182+ agents
   - 42 workspace stacks
   - 19 plugin bundles
   - 5 languages
   - 100+ slash commands

6. **Screenshots** (10 key visuals)
   - Plugin marketplace
   - Skill installation
   - Workspace stacks
   - Agent roster
   - Hook system

7. **Video demo** (2-minute walkthrough)

---

## Email Templates

### Template 1: Major Publication Pitch (TechCrunch, VentureBeat, InfoQ)

```
Subject: Exclusive: Claudient — The 400+ Skill Marketplace Supercharging Claude Code

Hi [Journalist Name],

We're launching Claudient — the definitive open-source knowledge system for Claude Code.

In one month, we went from 0 to 400+ production-grade AI skills, 182 specialist agents, and a plugin marketplace that auto-installs domain expertise. Developers stop re-explaining their stack every session. Claude already knows your domain.

Here's the angle your readers care about:

**For CTOs/Architects**: Stop maintaining institutional knowledge. Claudient bundles 5 years of best practices per domain (Next.js, Kubernetes, FastAPI, legal compliance, fintech, etc.) into reusable skills.

**For Indie Hackers / Solo Founders**: Use the small-business pack (47 skills) for invoicing, lead follow-up, cash flow, customer FAQs — no coding required.

**For AI Product Teams**: 20 MCP server configs ready to drop in. Building a RAG system? Agent framework? Multi-agent orchestration? We have the templates.

**For Enterprises**: 182+ specialist agents + hook system for compliance workflows, security gates, approval chains.

We hit 400+ skills in one month. GitHub stars climbing. npm installs 15K+/month.

Would [Journalist Name / VentureBeat] be interested in an exclusive on how we're solving the "prompt fatigue" problem for developers?

I have:
- Live demo (real code, real workflows)
- Founder interview
- Press kit with screenshots, stats, video demo
- Comparison: why this matters vs ChatGPT / generic AI assistants

Availability: [Your availability]

Press kit: https://github.com/UitbreidenOS/Claudient/tree/main/press-kit

Best,
Tushar Aggarwal
CEO, Uitbreiden
hello@uitbreiden.com
```

### Template 2: Developer Community Post (Indie Hackers)

```
Title: I Built Claudient — 400+ Claude Code Skills in 30 Seconds (Now Open Source)

Body:

Hi Indie Hackers!

TL;DR: Claudient is an open-source marketplace that installs 400+ production skills, 182 agents, and 42 workspace stacks into Claude Code. No re-explaining your stack every session. Claude knows your domain on day one.

**The Problem I Solved**

Every time I started a new Claude Code session, I'd re-explain my tech stack, best practices, and domain rules. FastAPI patterns. Kubernetes deployment. DRizzle schemas. HubSpot CRM flows. Legal compliance gates.

After the 50th time, I realized: this is a solvable problem.

**What I Built**

Claudient is a plugin marketplace for Claude Code with:
- 400+ domain skills (auto-invoking based on your code)
- 182+ specialist agents
- 42 complete workspace stacks (CLAUDE.md + skills bundled)
- 19 domain plugins (pick what you need)
- 100+ slash commands
- 41 MCP server configs
- 40 hooks for automation
- 5 languages (EN, FR, DE, NL, ES)

**Real Example: Small Business Owner**

A Shopify seller runs `/invoice-chaser`. Claude reads her QuickBooks AR aging, drafts personalized payment reminders, schedules follow-ups. She saves 3 hours/week. No terminal. No coding. Repeat for 30+ small-business skills.

**Real Example: DevOps Engineer**

Install the `claudient-devops-infra` plugin. Run `/k8s-architect`. Claude writes production-grade Kubernetes manifests, Helm charts, NetworkPolicy rules, RBAC configs. One slash command replaces 2 hours of manual YAML templating.

**The Numbers**

- 400+ skills
- 182+ agents
- 42 workspace stacks
- 5 languages
- 100+ slash commands
- Free + open source (AGPL-3.0)
- Install in 30 seconds: `npx claudient add all`

**Why This Matters**

Claude Code is Anthropic's official CLI for software development. It reads codebases, runs commands, edits files, works autonomously. But it starts from zero context every session. Claudient solves that with domain expertise as code.

**What I Learned Building This**

1. **Reusability compounds**: One skill (FastAPI template) reused across 50 projects becomes invaluable. We have 400 of these.

2. **Agents > Prompts**: Giving Claude scoped tools + specialist personas beats general-purpose LLM advice.

3. **Multi-language from day one**: 60% of our audience is non-English. We translated all 400 skills into FR / DE / NL / ES.

4. **Plugin marketplace >> folder structure**: Claude Code now has native plugin support. We built the first real marketplace.

**Getting Started**

```bash
# Install everything
npx claudient add all

# Or by domain
npx claudient add skills backend
npx claudient add skills devops-infra
npx claudient add agents

# Or as a Claude Code plugin
/plugin marketplace add UitbreidenOS/Claudient
/plugin install claudient-gtm@claudient
```

**Open Source + Community**

- GitHub: https://github.com/UitbreidenOS/Claudient
- Reddit: https://www.reddit.com/r/uitbreiden/
- Discord: [Link]
- Press Kit: https://github.com/UitbreidenOS/Claudient/tree/main/press-kit

**What's Next**

- 500+ skills by Q3 2026
- Desktop app for non-developers
- HubSpot native app (CRM in Claude Code)
- Agent SDK certification program

**Ask for Help**

- Want to add a skill in your domain? [Contributing guide]
- Found a bug? [Issues]
- Want to chat? [Reddit AMA]

Looking forward to hearing from this community!

Tushar
CEO, Uitbreiden
GitHub: @Claudient
```

### Template 3: GitHub Trending & Hacker News Self-Post

```
Title: Claudient: 400+ Claude Code Skills, 182 Agents, Plugin Marketplace — Open Source, Install in 30 Seconds

Story URL: https://github.com/UitbreidenOS/Claudient

Text:

An open-source knowledge system for Anthropic's Claude Code CLI. Includes 400+ production skills, 182 specialist agents, 42 workspace stacks, 41 MCP server configs, 100+ slash commands, 40 hooks, and a native plugin marketplace.

Why it matters:

1. Claude Code is Anthropic's official AI CLI for software development. But it starts from zero context each session.

2. Claudient solves "context reset" by bundling domain expertise as markdown skills. Install once, Claude knows your domain forever.

3. Reusable across every project. One FastAPI skill works for FastAPI in 50 repos. One Kubernetes skill covers all k8s projects.

Real examples:

- `/nextjs-app` writes production Next.js with Server Components, Drizzle, tRPC
- `/sre-engineer` designs SLOs, error budgets, burn-rate alerts, runbooks
- `/invoice-chaser` automates AR follow-ups from QuickBooks (small business)
- `/rag-architect` designs chunking, embeddings, retrieval, reranking, eval pipelines
- `/kubernetes-architect` outputs manifests, Helm charts, RBAC, NetworkPolicy

Install: `npx claudient add all` or use the Claude Code plugin system

Open source, dual licensed (AGPL-3.0 code + CC-BY-SA-4.0 content).

Contributors welcome. Press kit: https://github.com/UitbreidenOS/Claudient/tree/main/press-kit
```

### Template 4: Reddit Post (r/Claude, r/SideProject)

```
Title: I built Claudient — Open-source marketplace of 400+ Claude Code skills. No more re-explaining your stack. Install in 30 seconds.

Body:

# Claudient: 400+ Skills for Claude Code

I got tired of re-explaining my tech stack to Claude every time I started a new session.

So I built Claudient — an open-source plugin marketplace for Claude Code with 400+ production skills, 182 agents, and 42 workspace stacks. One install command and Claude knows your domain.

## Quick Demo

Install:
```bash
npx claudient add all
```

Now try:
- `/nextjs-app` — writes production Next.js with Server Components
- `/sre-engineer` — designs SLOs and error budgets
- `/fastapi` — production FastAPI with tests and Docker
- `/invoice-chaser` — automates AR follow-ups (small business, no code)
- `/rag-architect` — designs RAG pipelines
- `/kubernetes-architect` — K8s manifests + Helm charts

## What's Included

- 400+ skills (auto-invoking based on what you're building)
- 182+ specialist agents
- 42 workspace stacks (complete CLAUDE.md + skills)
- 100+ slash commands
- 41 MCP server configs
- 40 event-driven hooks
- 5 languages (EN / FR / DE / NL / ES)
- Free & open source

## Real Use Cases

**Founder/Solo Dev**: Install the small-business pack (47 skills). No terminal required. Automate invoicing, lead follow-up, cash flow forecasts, customer FAQs.

**Backend Engineer**: Install backend plugin (40+ skills). One-command scaffolding for Next.js, FastAPI, Go, Rust, Rails, .NET, etc.

**DevOps/SRE**: Install devops-infra (36 skills). Kubernetes, Terraform, Docker, GitHub Actions, cost tracking, SLO design.

**AI Product Team**: Install ai-engineering (17 skills). Claude API, RAG, LangGraph, MCP builder, agent orchestration, prompt caching.

**Legal/Compliance**: Install legal (21 skills). Contract review, GDPR, SOC 2, EU AI Act, NDA, IP clearance (all gated with mandatory human review).

## Why Open Source?

Institutional knowledge shouldn't be locked in private repos. Developers benefit when we pool best practices across companies, domains, and years.

## Get Started

- GitHub: https://github.com/UitbreidenOS/Claudient
- Install: `npx claudient add all`
- Plugin system: `/plugin marketplace add UitbreidenOS/Claudient`
- Press kit (screenshots, stats, video demo): https://github.com/UitbreidenOS/Claudient/tree/main/press-kit
- Join the community: r/uitbreiden

Would love your feedback. Ask me anything!

—Tushar
```

### Template 5: Discord Community Announcement

```
Channel: #announcements

🚀 **Introducing Claudient — Open-Source Marketplace for Claude Code**

The definitive knowledge system for Anthropic's Claude Code CLI.

**What You Get:**
✅ 400+ production skills (auto-invoking by domain)
✅ 182+ specialist agents (scoped tools + expertise)
✅ 42 workspace stacks (complete CLAUDE.md + skills bundled)
✅ 100+ slash commands
✅ 41 MCP server configs
✅ 40 automation hooks
✅ 5 languages (EN / FR / DE / NL / ES)
✅ Free & open source

**Install in 30 seconds:**
```bash
npx claudient add all
```

Or use Claude Code's plugin system:
```
/plugin marketplace add UitbreidenOS/Claudient
/plugin install claudient-everything@claudient
```

**Real Examples:**
- `/nextjs-app` → production Next.js with Server Components
- `/sre-engineer` → SLO design, error budgets, runbooks
- `/invoice-chaser` → automate AR follow-ups (small business)
- `/rag-architect` → design RAG pipelines end-to-end
- `/kubernetes-architect` → K8s manifests + Helm charts

**Links:**
📦 GitHub: https://github.com/UitbreidenOS/Claudient
📘 Docs: https://github.com/UitbreidenOS/Claudient/tree/main/guides
🎥 Press Kit (video + screenshots): https://github.com/UitbreidenOS/Claudient/tree/main/press-kit
💬 Community: r/uitbreiden

Made by @Tushar2704 (Uitbreiden). Questions? Ask in thread!
```

---

## Journalist Targeting Strategy

### Step 1: Research Journalists

Find relevant writers at target publications:
- TechCrunch: [CrunchBase Tech Writers]
- VentureBeat: [Contributors page]
- InfoQ: [Editorial team]

### Step 2: Personalized Outreach

Example:

> Hi [Name],
>
> I noticed your recent piece on "[Claude Code / AI Developer Tools / LLM Integrations]." We're solving a related problem — Claudient ships 400+ production skills + a plugin marketplace for Claude Code, so developers stop re-explaining their stack every session.
>
> Your readers care about developer productivity. This matters because:
> - One-time install, infinite reuse across projects
> - Cuts prompt fatigue by 70%+
> - Covers every domain (Next.js, Kubernetes, legal, finance, small-biz)
>
> Would you be interested in an exclusive? I have live demo + press kit.
>
> Best, Tushar

### Step 3: Follow-Up Schedule

- Initial email: Day 1
- Follow-up #1: Day 3 (if no response)
- Follow-up #2: Day 7 (if no response)
- Move on: Day 10

---

## Community Strategy

### r/Claude

1. Post announcement + AMA
2. Link to GitHub + press kit
3. Offer to answer technical questions

### r/SideProject

1. Share founder story (30-60 day build)
2. Metrics: 400+ skills, 182 agents, 15K npm installs/month
3. Open source learnings (translations, plugin system, etc.)

### Indie Hackers

1. Full post with walkthrough
2. Answer every comment for 48 hours
3. Share ROI data (6-12 hours saved/week for small business)

### Product Hunt

1. Launch with founder story
2. Post video demo
3. Link to press kit
4. Offer limited-time bonus (e.g., "Tier 1" plugin free for first 100)

---

## Content Calendar

| Week | Action | Outlet |
|---|---|---|
| Week 1 | Send TechCrunch / VentureBeat exclusives | Tier 1 publications |
| Week 1 | Post to Hacker News | HN (organic) |
| Week 2 | Post to r/Claude + r/SideProject | Reddit |
| Week 2 | Indie Hackers post + AMA | Indie Hackers |
| Week 2 | Product Hunt launch | Product Hunt |
| Week 3 | Discord announcement + community engagement | Communities |
| Week 3-4 | Follow-up posts (feature highlights, use cases) | Dev.to, Hashnode |

---

## Press Kit Asset Checklist

- [ ] One-liner (1 sentence)
- [ ] Two-paragraph pitch
- [ ] Logo files (PNG + SVG, dark + light)
- [ ] Founder bio
- [ ] Stats sheet (numbers + context)
- [ ] 10 screenshots (marketplace, skills, agents, stacks)
- [ ] 2-minute video demo
- [ ] Comparison chart (vs ChatGPT / Copilot / other)
- [ ] FAQ document
- [ ] Sample skill (with frontmatter + instructions)
- [ ] Roadmap (transparency)

---

## Key Messages

**For Developers**: Stop re-explaining your stack. 400+ skills. Install once. One command. Reusable across every project.

**For Small Business**: No terminal required. Plain English skills. Automate invoicing, lead follow-up, cash flow, FAQs. Save 6-12 hours/week.

**For Enterprises**: 182+ specialist agents + governance. GDPR / SOC 2 / EU AI Act ready. Hook system for compliance workflows.

**For AI Teams**: 20+ MCP configs. RAG architect, agent teams, prompt caching examples. Build on proven patterns.

---

## Metric Tracking

Monitor these during and after outreach:

- GitHub stars (track trajectory)
- npm installs (weekly downloads)
- Discord / Reddit engagement
- Press mention tracking
- Plugin marketplace adoption
- Feature install rates (which domains are most popular?)

---

## FAQ for Journalists

**Q: What exactly is Claudient?**
A: An open-source marketplace that bundles 400+ production skills, 182 specialist agents, and 42 workspace stacks for Claude Code (Anthropic's official CLI for software development). One install command and Claude has domain expertise across your entire workflow.

**Q: Why does this matter?**
A: Claude Code starts from zero context every session. Developers have to re-explain their tech stack, best practices, and domain rules repeatedly. Claudient solves that. One install, infinite reuse.

**Q: Who's your audience?**
A: Developers (backend, DevOps, AI engineers), small business owners (invoicing, lead follow-up), enterprises (compliance, multi-agent workflows), indie hackers (solopreneurs, side projects).

**Q: How is this different from prompts or ChatGPT plugins?**
A: Claude Code is CLI-native (runs in terminal / IDE). Skills are markdown + YAML that invoke with slash commands. They auto-execute based on your codebase and context. ChatGPT plugins are web-only and lighter-weight.

**Q: Is it free?**
A: Yes. Open source (AGPL-3.0 code, CC-BY-SA-4.0 content). Enterprise tier available for teams 50+.

**Q: How many installs so far?**
A: 15K+ monthly npm installs. GitHub stars growing. Plugin marketplace live with 19 domain bundles.

---

## Contact Info for Outreach

**Founder**: Tushar Aggarwal (CEO, Uitbreiden)
**Email**: hello@uitbreiden.com
**GitHub**: @Claudient / @tushar2704
**Twitter**: @tushar2704
**Website**: https://uitbreiden.com
**Press Kit**: https://github.com/UitbreidenOS/Claudient/tree/main/press-kit

---

## Follow-Up Support

After media launch:
1. Respond to all journalist inquiries within 4 hours
2. Provide live demo for interested outlets
3. Share founder interview availability
4. Provide exclusive stats / usage data
5. Offer guest posts to major publications
