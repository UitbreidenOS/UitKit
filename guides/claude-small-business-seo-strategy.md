# Claude for Small Business — SEO Strategy

This document is the single source of truth for how Claudient ranks for small-business search intent. It is written for contributors who add new small-business content and for the maintainer who needs to keep the strategy coherent over time.

The strategy is intentionally narrow: capture the operator-grade keyword space around "Claude for small business" and the long tail of vertical and task-level queries that flows from it.

---

## Why a Dedicated SEO Strategy

Anthropic launched Claude for Small Business on May 13, 2026. The product covers 15 official workflows. Search demand has run far ahead of supply — owners are typing "Claude for [industry]", "AI tools for [business type]", and "how to use Claude for [task]" into Google, Reddit, and YouTube faster than Anthropic can ship vertical content.

Claudient's opportunity is to be the most-linked-to, most-cited extension of the official launch — a community knowledge base that fills the long tail Anthropic left open.

Three structural facts make this opportunity real:

1. **GitHub repos rank.** GitHub README files, individual `.md` files, and skill directories index in Google and surface in code-aware tooling (Claude Code's own web search, Perplexity, Phind, Kagi). A well-named `.md` file inside `skills/small-business/dental-practice.md` ranks for "claude for dental practice" without any backlinks if the content is genuine.
2. **Long-tail vertical queries are uncontested.** "Claude for plumbers", "Claude for salon owners", "Claude for solo dentists" each have 200-1,200 monthly searches and almost no first-page competition. We can own every single one.
3. **Question-style queries are exploding.** "How does Claude help small business?", "Can Claude replace a bookkeeper?", "Is Claude good for ecommerce?" — these are the queries LLM-based search engines (Claude Code itself, ChatGPT browse, Perplexity) cite. They want crisp, sourced answers in markdown.

---

## The Three-Layer Content Architecture

Every new small-business asset belongs to one of three layers. The layers reinforce each other through internal linking.

### Layer 1 — Pillar Pages (Vertical Positioning Guides)

These live in `guides/` and target the highest-volume head terms.

```
guides/claude-for-solopreneurs.md           — "Claude for solopreneurs", "AI for solo founders"
guides/claude-for-ecommerce.md              — "Claude for ecommerce", "Claude for Shopify"
guides/claude-for-local-services.md         — "Claude for local business", "AI for service business"
guides/claude-for-coaches-consultants.md    — "Claude for coaches", "Claude for consultants"
guides/claude-for-creators.md               — "Claude for creators", "Claude for newsletter creators"
guides/claude-for-small-business.md         — product guide (already exists, the central pillar)
guides/small-business-roi.md                — ROI calculator content (already exists)
```

A pillar page is 2,500-4,000 words, written for a specific operator persona, and links out to every relevant skill, agent, and workflow inside this repo. It is the entry point a Google or Perplexity result lands on.

**Pillar page structure (use this template):**

1. **Hook + persona statement** — who this is for, what they typically pay (mention real tools they already use)
2. **What Claude actually does for them** — 5-10 concrete workflows, each one a sentence
3. **The skills section** — direct links to `skills/small-business/*.md` files, with one-line descriptions of what each does for this persona
4. **Setup section** — what to connect, in what order, what it costs
5. **What to expect in 30/60/90 days** — concrete time savings numbers
6. **What Claude is NOT for in this vertical** — risk framing builds trust
7. **FAQ section** — 6-12 question-style headings that match real search queries
8. **Internal links footer** — the related pillar pages, the master small-business guide, the product comparison

### Layer 2 — Skill Pages (Vertical and Operator Skills)

These live in `skills/small-business/` and target the specific task-level queries.

Each skill page has:

- A filename that doubles as a keyword target (`dental-practice.md`, `ecommerce-seller.md`)
- An H1 that matches the title casing of the filename
- The standard four-section format from CLAUDE.md (When to activate / When NOT to use / Instructions / Example)
- At least one real product name in the instructions (QuickBooks, Shopify, Mailchimp, etc.) — these are themselves search anchors
- A concrete worked example with realistic numbers, not abstract placeholders

Skill pages are 150-400 lines of plain English. They rank for the long-tail vertical-plus-task queries: "claude for invoice chasing", "ai for dental practice no-shows", "claude for shopify product descriptions".

### Layer 3 — Agent and Specialist Pages

These live in `agents/specialists/` and `agents/roles/`.

A specialist page targets the "AI advisor for [industry]" query class. The existing `real-estate-specialist.md` and `restaurant-specialist.md` are the model. Each new specialist page is 80-200 lines describing the agent's purpose, model, tool subset, and example use cases.

---

## Keyword Targets, Ranked

The list below is the master keyword map. Every new file should be tagged to at least one keyword. Avoid building assets that don't target a documented keyword.

### Head terms (highest volume, hardest to rank)

| Keyword | Monthly searches (est.) | Target page |
|---|---|---|
| claude for small business | 8,100 | guides/claude-for-small-business.md (pillar) |
| ai for small business | 27,100 | README + claude-for-small-business.md |
| claude code small business | 880 | README hero + small-business-roi.md |
| ai automation small business | 6,600 | README + claude-for-small-business.md |

### Vertical head terms (medium volume, medium competition)

| Keyword | Searches | Target |
|---|---|---|
| claude for solopreneurs | 1,300 | guides/claude-for-solopreneurs.md |
| claude for ecommerce | 1,000 | guides/claude-for-ecommerce.md |
| claude for shopify | 1,900 | guides/claude-for-ecommerce.md (anchor) + skills/small-business/shopify-operations.md |
| claude for coaches | 720 | guides/claude-for-coaches-consultants.md |
| claude for consultants | 880 | guides/claude-for-coaches-consultants.md |
| claude for creators | 590 | guides/claude-for-creators.md |
| claude for real estate | 590 | guides/de + skills/small-business/real-estate-listing.md + agents/roles/real-estate-specialist.md |
| claude for restaurants | 480 | skills/small-business/restaurant-ops.md + agents/roles/restaurant-specialist.md |
| claude for local business | 1,000 | guides/claude-for-local-services.md |

### Long-tail vertical+task (high volume in aggregate, low competition)

These are the bread and butter. Each skill file targets one of these.

| Keyword | Target file |
|---|---|
| claude for dental practice | skills/small-business/dental-practice.md |
| claude for salon owners | skills/small-business/salon-spa-ops.md |
| claude for fitness studio | skills/small-business/fitness-gym-ops.md |
| claude for plumbers / electricians / HVAC | skills/small-business/contractor-trades.md |
| claude for photographers | skills/small-business/photography-studio.md |
| claude for bookkeepers | skills/small-business/bookkeeper-practice.md |
| claude for podcasters | skills/small-business/podcast-monetizer.md |
| claude for newsletter writers | skills/small-business/newsletter-publisher.md |
| claude for online course creators | skills/small-business/online-course-creator.md |
| claude for marketing agency | skills/small-business/agency-operations.md |
| claude for hiring | skills/small-business/hiring-pipeline.md |
| claude for pricing | skills/small-business/pricing-optimizer.md |
| claude for customer retention | skills/small-business/churn-prevention.md |
| claude for invoice chasing | skills/small-business/invoice-chaser.md (exists) |
| claude for cash flow forecasting | skills/small-business/cash-flow-forecast.md (exists) |
| claude for quickbooks | skills/small-business/quickbooks-workflow.md (exists) |

### Question-style queries (for FAQ blocks)

These belong in FAQ sections inside the pillar pages and the README. LLM-search engines surface them directly.

- "Is Claude good for small business?"
- "Can Claude replace a bookkeeper?"
- "Does Claude work with QuickBooks?"
- "How much does Claude cost for small business?"
- "What is Claude for Small Business?"
- "How is Claude different from ChatGPT for small business?"
- "Can Claude do my invoicing?"
- "Is Claude better than ChatGPT for small business?"
- "What are the best AI tools for [vertical]?"
- "How do I set up Claude for my business?"
- "Can Claude read my QuickBooks data?"
- "Is Claude for Small Business worth it?"

---

## On-Page Tactics

These are the concrete writing rules. Apply them mechanically to every new file.

### 1. Filename is the keyword

The filename slug is the most important ranking signal we control. Match it to the exact phrase a buyer would type, with no padding.

Good: `claude-for-dental-practice.md`, `dental-practice.md` (within `small-business/`)
Bad: `dentist-skills-claude-edition-v2.md`, `dental-claude-skill-2026.md`

### 2. H1 matches the filename

The H1 should restate the keyword cleanly, in title case.

Good: `# Dental Practice Operations`
Bad: `# How I Use AI in My Office (Cool Tips!)`

### 3. The first paragraph carries the keyword + intent

The first 1-2 sentences must contain the head keyword and answer the search intent. LLM-search engines pull this paragraph as the citation snippet. Treat it as the meta description.

Good: "Claude for dental practice owners handles the front-desk and back-office work that pulls solo dentists away from chair time — no-show recovery, insurance verification, treatment plan follow-up, and recall scheduling, all from plain English instructions."

Bad: "In this skill, we explore some interesting use cases that might be relevant to certain professionals in the dental space..."

### 4. Section headings are search queries

Every H2 and H3 inside a pillar page should plausibly be a Google query. This is how question-style FAQ schema gets surfaced.

Good: `## How does Claude help dental practices?`, `## What does Claude cost for a dental office?`
Bad: `## Diving In`, `## A Note on Methodology`

### 5. Reference real product names

Every skill mentions the actual tools the operator already pays for: QuickBooks, Shopify, Square, Mailchimp, Calendly, Acuity, Mindbody, Toast, ServiceTitan, Housecall Pro, Jobber, Dentrix, Eaglesoft. These are themselves search anchors — Google and LLM-search engines treat a `.md` file that mentions "Shopify and QuickBooks" as relevant to queries about either.

### 6. Concrete numbers in examples

Time saved, dollars recovered, hours reclaimed. Realistic. Numbers make examples scannable and quotable.

Good: "Cut a 6-hour Friday reconciliation to a 35-minute Wednesday review."
Bad: "Save significant time on financial tasks."

### 7. Internal links forward and back

Every skill links to at least one pillar page and one related skill. Every pillar page links to every relevant skill. The internal link graph is what allows long-tail pages to inherit pillar-page authority.

### 8. Plain English, no developer assumptions

Small-business pages must not require any terminal, code, or developer literacy. Activation prompts are conversational. No code fences unless absolutely necessary. The audience is a salon owner reading on her phone between appointments.

---

## Off-Page Tactics

### GitHub topic tags

The repo's topic list is itself a ranking signal. Required topics for the small-business surface:

```
claude-code, claude-for-small-business, small-business-ai, ai-for-small-business,
ai-automation, claude-skills, small-business-automation, claude-cowork,
ai-bookkeeping, ai-crm, ai-invoicing, claude-ai-skills
```

### Reddit and HN posting cadence

The community launches that work for Claude-adjacent content:

- `r/ClaudeAI` — works for technical and operator launches alike
- `r/Entrepreneur` — works for "I built X to save time on Y" framings, not for repo dumps
- `r/smallbusiness` — works for specific tool sharing, dies on self-promotional framing
- `r/sweatystartup` — works for trades/local services posts
- `r/SaaS` — works for the SaaS-style positioning of any skill
- HackerNews — works only for "Show HN" with a specific deliverable

Cadence: one new vertical launch per week, posted to two communities. Never the same community twice in 14 days.

### Backlink targets

The repos most likely to link back to a strong small-business asset:

- Awesome-Claude-Code lists (hesreallyhim, others)
- Awesome-AI-for-business lists
- alirezarezvani/claude-skills (cross-link via PR)
- Anthropic's own community showcase
- VoltAgent ecosystem repos

PR strategy: a one-line addition to an awesome-list with a real, useful link gets merged. Anything that looks like spam doesn't.

---

## Content Cadence

The plan, calibrated to roughly one shipping batch per week.

**Week 1 — Foundation**
- This strategy doc, five pillar guides, 12 new vertical skills, 3 operator skills, 2 specialist agents, README enhancement.

**Week 2 — Translation pass**
- All Week 1 content translated to FR/DE/NL/ES via Haiku agents.

**Week 3 — Second wave**
- 5 more vertical skills: subscription-business, ecommerce-supplements, fitness-personal-trainer, photographer-wedding, legal-solo-practice.
- 2 more pillar guides: claude-for-saas-founders.md, claude-for-trades-business.md.

**Week 4 — Distribution**
- Reddit launches across r/ClaudeAI, r/Entrepreneur, r/sweatystartup (staggered).
- Awesome-list PRs (5 minimum).


**Week 5+ — Compound**
- One new vertical per week.
- Track which verticals get the most traffic (GitHub traffic data + npm download attribution) and double down.

---

## Measurement

The metrics that matter, in order:

1. **GitHub stars** — proxy for organic discovery. Target: +200 in the 30 days following the small-business launch.
2. **npm install count for `claudient add skills small-business`** — proxy for actual adoption.
3. **GitHub traffic for `/skills/small-business/`** — proxy for SEO performance.

5. **Brand search** — "claudient small business" appearing in Google autocomplete or related searches.

Avoid optimizing for: total file count, line count, or anything that incentivizes filler.

---

## What Not to Do

These are the failure modes that look like SEO but produce worse outcomes than doing nothing.

**Don't keyword-stuff prose.** Repeating "claude for small business" five times in a paragraph reads like SEO spam, gets de-ranked by Google's helpful-content updates, and gets dismissed by LLM-search engines that increasingly weight readability.

**Don't write for keywords that have no real audience.** "Claude AI small business owners entrepreneurs 2026" is not a real query. "Claude for solopreneurs" is. Check that someone actually types the phrase before targeting it.

**Don't duplicate Anthropic's official content.** The Claude for Small Business product page covers the 15 official workflows. Linking to it and extending it works. Copying it gets us de-indexed for duplicate content.

**Don't add filler verticals.** A 200-line skill for "claude for ferret breeders" technically exists but produces no traffic, dilutes the repo's authority, and clutters the navigation. Stick to verticals with documented search volume.

**Don't ignore the existing guides.** `guides/claude-for-small-business.md` and `guides/small-business-roi.md` are already strong. Link to them aggressively from every new asset. They are the ranking spine.

**Don't translate before the English content is right.** The translation pass amplifies whatever the English source says. Bad English content becomes bad content in five languages. Translate after the English wave is fully shipped and lightly battle-tested.

---

## Maintenance

The strategy decays if the index is not kept fresh. Quarterly checks:

- Re-run the keyword research for any vertical that has shipped (search volume changes seasonally for many small-business verticals — tax-related queries spike in Q1, retail-adjacent queries in Q4).
- Audit the FAQ blocks against current search trends. Question phrasing shifts every 6-12 months.
- Update the head-term table with new vertical opportunities (every quarter, two or three new "Claude for X" queries emerge as workable targets).
- Remove or de-prioritize verticals that have under-performed for two quarters in a row.

The strategy is a living document. Updates to this file are encouraged and expected.

---

## Cross-References

- [Claude for Small Business — Product Guide](claude-for-small-business.md) — the central pillar
- [Small Business ROI](small-business-roi.md) — calculator and case data
- [Claude for Solopreneurs](claude-for-solopreneurs.md) — solo-operator landing
- [Claude for Ecommerce](claude-for-ecommerce.md) — Shopify/Etsy/Amazon landing
- [Claude for Local Services](claude-for-local-services.md) — local services landing
- [Claude for Coaches and Consultants](claude-for-coaches-consultants.md) — coaching landing
- [Claude for Creators](claude-for-creators.md) — newsletter/podcast/course landing
- All skills under [skills/small-business/](../skills/small-business/) — the supporting long tail

---
