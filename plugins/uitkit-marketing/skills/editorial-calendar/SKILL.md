---
name: "editorial-calendar"
description: "Monthly editorial calendar: topic clusters, publish schedule, content mix, distribution plan"
---

# Editorial Calendar Skill

## When to activate
- Planning a month or quarter of content for a blog, newsletter, or social media
- Mapping topic clusters to keywords and building a coherent publishing schedule
- Deciding the right content mix (how-to, thought leadership, case study, comparison, etc.)
- Creating distribution plans that match content type to channel
- Onboarding a new content hire and need a structured publishing system
- Launching a new brand or website and need to build topical authority fast

## When NOT to use
- Writing individual pieces of content — use `/content-brief` for that
- SEO auditing an existing site — use `/seo-audit` instead
- One-off social posts without a strategic publishing plan
- You already have a calendar and just need to fill content gaps — start with `/seo-audit` to find gaps first

## Instructions

### Core calendar generation prompt

```
Build a monthly editorial calendar for [BRAND/PUBLICATION].

Context:
- Brand: [company name, one-line description]
- Target audience: [ICP — job title, industry, pain points]
- Primary business goal: [e.g. organic traffic, newsletter subscribers, pipeline generation]
- Content channels: [blog, newsletter, LinkedIn, X, YouTube — list what applies]
- Publishing cadence: [e.g. 2 blog posts/week, daily LinkedIn, weekly newsletter]
- Domain authority / content maturity: [new site / 6-12 months old / established (DA 40+)]
- Main keyword cluster: [primary topic area, e.g. "B2B SaaS onboarding"]
- Competitor publishing at: [URL or name — optional]

Produce:

## 1. Topic cluster map
Build 3-5 pillar topics and 4-6 subtopics under each:
- Pillar 1: [broad topic] → subtopics: [list]
- Pillar 2: [broad topic] → subtopics: [list]
...

## 2. Content type mix (% of total content)
- Educational how-to: [X]%
- Thought leadership / opinion: [X]%
- Case study / customer story: [X]%
- Comparison / versus: [X]%
- Keyword-targeted (bottom of funnel): [X]%
- Topical news-jacking: [X]%

## 3. Monthly calendar — [MONTH YEAR]
For each week, specify:
- Blog posts (title, target keyword, content type, estimated traffic potential)
- Newsletter (subject line, theme, key CTA)
- LinkedIn posts (theme, format: text/image/carousel/poll/video)
- Other channel content

## 4. Distribution plan
For each published piece, list:
- Primary channel: [where it lives]
- Repurposing: [how you reuse across channels within 48 hours]
- Promotion: [outreach, communities, paid amplification if budget allows]

## 5. Internal linking strategy
Map which new pieces should link to existing cornerstone content and to each other.
```

### Topic cluster framework

```typescript
interface TopicCluster {
  pillar: {
    title: string
    targetKeyword: string
    searchVolume: string      // from Ahrefs/Semrush or estimated
    difficulty: number        // 0-100
    format: 'ultimate-guide' | 'hub-page' | 'long-form'
    wordCount: number         // target
  }
  spokes: Array<{
    title: string
    targetKeyword: string
    searchVolume: string
    intent: 'informational' | 'navigational' | 'commercial' | 'transactional'
    format: 'how-to' | 'listicle' | 'comparison' | 'case-study' | 'opinion'
    linksToPillar: boolean    // always true for hub-and-spoke
    priority: 'high' | 'medium' | 'low'
  }>
}

// Pillar content rules:
// - Target head keywords (1-2 words), high volume, high difficulty
// - 3,000-8,000 words — comprehensive, earns links
// - Updated quarterly
//
// Spoke content rules:
// - Target long-tail keywords (3-5 words), moderate volume, low-medium difficulty
// - 1,200-2,500 words — specific, actionable
// - Always link back to pillar and to 2-3 related spokes
```

### Content mix calculator

```
Calculate the optimal content mix for my situation:

Business stage: [early / growth / mature]
Goal: [traffic / leads / brand / community]
Publishing frequency: [X pieces/month]
Team size: [solo / 1-2 writers / small team / agency]

Early stage + traffic goal:
- 60% informational SEO (top-of-funnel, educational)
- 20% commercial SEO (comparison, best-of, alternatives)
- 20% thought leadership (builds authority + gets shared)
- Newsletter: weekly roundup, 500-800 words, high curation value

Growth stage + pipeline goal:
- 40% informational SEO
- 30% commercial/transactional SEO (bottom of funnel)
- 20% case studies + customer stories
- 10% thought leadership on buyer pain points
- Newsletter: weekly insight + one product CTA

Mature stage + brand goal:
- 30% SEO maintenance (updating top performers)
- 40% thought leadership + original research
- 20% community/audience collaboration
- 10% experimental formats (video, audio, interactive)
```

### Weekly content production schedule

```markdown
# Weekly Content Production Template

## Monday — Planning
- [ ] Pull last week's analytics (sessions, time on page, conversions by piece)
- [ ] Confirm this week's pieces are briefed and assigned
- [ ] Check trending topics in your space (Twitter/LinkedIn, Google Trends, Feedly)
- [ ] Brief any reactive pieces (news-jacking opportunities)

## Tuesday–Wednesday — Production
- [ ] Writer submits drafts
- [ ] Editor review: accuracy, structure, SEO, CTA
- [ ] Internal linking audit (does each piece link to 3+ others?)
- [ ] Meta title and description finalised

## Thursday — Publication & Distribution
- [ ] Publish blog post (confirm canonical URL, schema, OG tags)
- [ ] Send newsletter if weekly cadence
- [ ] LinkedIn post drafted from blog — format as carousel or text post
- [ ] Submit to relevant communities (HN Show, Reddit, Slack groups)

## Friday — Repurposing
- [ ] Convert blog sections into 3-5 LinkedIn posts (schedule for next 2 weeks)
- [ ] Extract quotes for X/Twitter thread
- [ ] Update content calendar with actual publish dates and analytics placeholders
- [ ] Add published piece to internal linking backlog for future pieces
```

### Distribution channel strategy by content type

```
Map each content type to its optimal distribution:

HOW-TO / TUTORIAL:
Primary: Blog (SEO) + YouTube (if video-friendly)
Repurpose: LinkedIn carousel → X thread → newsletter snippet → Reddit tutorial
Paid amplification: Only if ranking on page 2 and need a push

THOUGHT LEADERSHIP / OPINION:
Primary: LinkedIn (native long-form performs well) + Blog cross-post
Repurpose: Newsletter lead story → X thread → Podcast discussion topic
Amplification: Tag people mentioned, engage comments within first 60 minutes

CASE STUDY / CUSTOMER STORY:
Primary: Blog (cornerstone, gated optional) + Sales collateral
Repurpose: LinkedIn customer spotlight → Email to similar prospects → Sales deck slide
Amplification: Send to customer for them to share — their audience trust > yours

COMPARISON / VERSUS:
Primary: Blog (bottom-of-funnel, high buying intent)
Repurpose: Sales email attachment → chatbot response → PPC landing page
Amplification: DO NOT share on social — looks self-promotional; let SEO do the work

NEWS-JACKING / TREND:
Primary: LinkedIn (publish within 2 hours of news breaking) + X
Repurpose: Newsletter P.S. section → short blog post next day
Amplification: Speed is the amplification; distribute immediately or skip
```

### Editorial calendar template (copy-paste)

```markdown
# Editorial Calendar — [MONTH YEAR]

## Goals this month
- Traffic target: [X sessions]
- Newsletter target: [X subscribers / X% open rate]
- Pipeline target: [X content-sourced leads]
- Authority goal: [X backlinks / Y DA improvement]

## Week 1 ([Date range])

| Day | Channel | Title / Subject | Type | Keyword | CTA |
|---|---|---|---|---|---|
| Mon | Blog | [Title] | How-to | [keyword] | [subscribe / demo / download] |
| Wed | Newsletter | [Subject line] | Roundup | — | [CTA] |
| Thu | LinkedIn | [Post theme] | Carousel | — | [engage / visit] |
| Fri | LinkedIn | [Post theme] | Text | — | — |

## Week 2 ([Date range])
...

## Week 3 ([Date range])
...

## Week 4 ([Date range])
...

## Evergreen backlog (publish when capacity allows)
- [Title] — [Keyword] — [Priority: H/M/L]
- [Title] — [Keyword] — [Priority: H/M/L]

## Content audits due this month
- [URL] — last updated [date] — action: [refresh / consolidate / delete]
```

### Quarterly planning prompt

```
Run a quarterly content planning session.

Last quarter performance:
- Top 5 pieces by traffic: [list]
- Top 5 pieces by conversions: [list]
- Bottom 5 pieces (low traffic, no conversions): [list]
- New keywords ranking page 1: [list]
- Keywords that slipped from page 1: [list]

This quarter priorities:
1. Double down on: [what worked] — produce more content in these clusters
2. Refresh: [what slipped] — update, re-optimise, add internal links
3. Consolidate: [thin content] — merge into one strong piece
4. Attack: [new cluster] — new topic area to build authority in
5. Cut: [irreversible underperformers] — 301 redirect to related strong content

Output:
- Cluster priorities for Q[X]
- A 13-week publishing roadmap
- Team allocation: [X pieces/writer/week]
- Budget estimate if outsourcing: [X pieces × $[Y]/piece]
```

## Example

**User:** Build a monthly editorial calendar for a B2B SaaS startup (project management tool) targeting operations leaders at 50-500 employee companies. Publishing 2 blogs/week, weekly newsletter, daily LinkedIn. Month is June.

**Output:**
```markdown
# Editorial Calendar — June 2026
**Brand:** [Project Management SaaS] | **Audience:** Ops Directors, Chiefs of Staff | **Goal:** Organic traffic + newsletter growth

## Topic Clusters
**Pillar 1:** Operational Efficiency → spokes: remote team workflows, process documentation, meeting cadence templates, OKR tracking
**Pillar 2:** Project Management → spokes: resource planning, dependency mapping, cross-functional projects, status reporting
**Pillar 3:** Operations Scaling → spokes: SOPs for scaling, hiring ops playbook, tech stack audit, operations KPIs

## Content Mix
60% educational SEO | 20% thought leadership | 15% case studies | 5% comparison

## Week 1 (June 1-7)
| Day | Channel | Title | Type | Keyword | CTA |
|---|---|---|---|---|---|
| Mon 2 | Blog | "How to Run a Weekly Ops Review That Actually Works" | How-to | "ops review meeting" | Newsletter subscribe |
| Wed 4 | Newsletter | "The 5-meeting week that runs itself" | Insight | — | Read the blog |
| Thu 5 | LinkedIn | Meeting overload carousel: 5 ops meeting templates | Carousel | — | DM for template |
| Sat 7 | LinkedIn | "Unpopular opinion: most project management tools don't solve the real problem" | Text | — | Comment |

## Week 2 (June 8-14)
| Day | Channel | Title | Type | Keyword | CTA |
|---|---|---|---|---|---|
| Mon 9 | Blog | "Asana vs Monday vs [Your Tool]: Which Fits Ops Teams?" | Comparison | "asana vs monday for operations" | Free trial |
| Wed 11 | Newsletter | "How [Customer] cut their weekly reporting time by 70%" | Case study snippet | — | Read full story |
| Thu 12 | LinkedIn | 5-slide carousel: "Our customer's ops transformation in 90 days" | Carousel | — | Link in comments |
| Fri 13 | LinkedIn | "3 signs your project management tool is holding you back" | Text | — | — |

## Distribution Rules
- Every blog post → LinkedIn carousel within 48 hours
- Every case study → Sales team gets the link for their pipeline
- Newsletter subscriber click → Tagged in HubSpot as "engaged content lead"
```

---
