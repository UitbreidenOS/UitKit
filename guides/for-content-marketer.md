# Claude for Content Marketers and SEO

Everything a Content Marketer or SEO Specialist needs to run AI-augmented content strategy, production, optimisation, and distribution in Claude Code.

---

## Who this is for

You are a content marketer, SEO manager, or growth marketer whose job is to build an audience, grow organic traffic, and convert readers into leads or customers. You spend too much time staring at blank pages, writing briefs, reformatting content for different channels, and pulling analytics into reports.

**Before Claude Code:** 90 minutes to research and brief a blog post. 45 minutes to write a social post series. Half a day to produce a monthly editorial calendar. Hours chasing writers for briefs that are still vague.

**After:** Full content brief in 5 minutes. Editorial calendar for the month in 15 minutes. Blog post outline with competitor analysis in under 10 minutes. Social repurposing for a single blog post in 3 minutes.

---

## 30-second install

```bash
# Install the full content marketing and SEO stack
npx claudient add skills marketing

# Or cherry-pick what you need:
npx claudient add skill marketing/content-strategy
npx claudient add skill marketing/content-brief
npx claudient add skill marketing/editorial-calendar
npx claudient add skill marketing/seo-audit
npx claudient add skill marketing/ai-seo
npx claudient add skill marketing/programmatic-seo
npx claudient add skill marketing/copywriting
npx claudient add skill marketing/social-media-manager
npx claudient add skill marketing/email-sequence
npx claudient add agents advisors/cmo-advisor
npx claudient add agents roles/competitive-analyst
```

---

## Your Claude Code content marketing stack

### Skills (slash commands)

| Skill | What it does | When to use |
|---|---|---|
| `/content-brief` | SEO-optimised content brief: keyword, outline, gaps, internal links, CTA | Before every piece of content |
| `/editorial-calendar` | Monthly calendar: topic clusters, publish schedule, content mix, distribution | Monthly planning |
| `/content-strategy` | Full content strategy: audience, goals, channels, topic clusters, KPIs | Quarterly planning or at brand launch |
| `/seo-audit` | Technical and on-page SEO audit: issues, opportunities, prioritised fix list | Monthly site audit |
| `/ai-seo` | AI-era SEO: optimising for ChatGPT, Perplexity, Bing AI, featured snippets | When refreshing existing content |
| `/programmatic-seo` | Programmatic page templates: schema, N-of-M patterns, scalable production | Scale content production |
| `/copywriting` | Landing pages, headlines, CTAs, ad copy — conversion-focused | Any conversion-critical copy |
| `/social-media-manager` | Platform-native post creation, scheduling strategy, engagement playbooks | Social content and channel management |
| `/email-sequence` | Drip sequences, newsletters, automated flows — full copywriting + logic | Email content and nurture flows |

### Agents

| Agent | Model | When to spawn |
|---|---|---|
| `cmo-advisor` | Opus | Strategy questions, channel prioritisation, content positioning |
| `competitive-analyst` | Sonnet | Competitor content audits, gap analysis, positioning intel |

---

## Daily workflow

### Morning — Analytics review (15 minutes)

**1. Performance pulse**
```
/seo-audit

Pull my key content metrics from yesterday:
- Top 5 pages by sessions
- Any new pages appearing in Google Search Console
- Any pages that dropped in ranking in the last 7 days
- Newsletter open rate from yesterday's send

Give me a 5-bullet briefing: what to celebrate, what to investigate, what to fix today.
```

**2. Opportunity scan**
```
/ai-seo

What keywords related to [my topic cluster] spiked in the last 7 days?
Are there any trending questions in my niche I should news-jack today?
Check: Google Trends, Reddit, LinkedIn trending topics.
```

---

### Content creation (variable — 1-4 hours)

**3. Brief a new piece**
```
/content-brief

Target keyword: [keyword]
Secondary keywords: [list]
Content type: [how-to / comparison / thought leadership]
Target audience: [specific person with specific problem]
Competing URLs: [top 3 ranking pages]
Our CTA: [what we want readers to do]
Word count target: [based on competitor average]
```

**4. Write or review content**
```
/copywriting

Write [content type] based on this brief:
[paste brief from above]

Tone: [conversational / authoritative / technical]
Brand voice: [brief description — or paste brand guidelines]
Must include: [specific points, data, or examples]
```

---

### SEO optimisation (20-30 minutes, several times per week)

**5. On-page optimisation**
```
/seo-audit

Review this draft before publishing:
[paste content]

Target keyword: [keyword]
Check: title tag, meta description, H1, H2 structure, internal links,
featured snippet opportunity, image alt text, schema markup.
Give me a publish checklist: what's good, what to fix.
```

---

### Social scheduling (15-30 minutes, daily or batched weekly)

**6. Repurpose published content**
```
/social-media-manager

I just published: [URL or paste content]

Create:
- 3 LinkedIn posts (text-only, carousel concept, and a poll)
- 5 X/Twitter posts (including a thread and 4 standalone)
- 1 Instagram caption
- 1 short-form video script (60 seconds)

Repurpose the core insight for each platform's native format.
Do not just copy the blog intro — extract the most shareable single idea from each section.
```

---

### Performance reporting (30-60 minutes, weekly)

**7. Weekly content report**
```
/content-strategy

Weekly performance review:
- Published this week: [list]
- Top performing content (sessions, time on page, conversions): [data]
- Newsletter stats: [sends, open rate, CTR]
- Social stats: [impressions, engagements, followers delta]

Summarise: what worked, what didn't, and what I should produce more of next week.
Output a 1-page report I can share with my manager.
```

---

## Monthly planning workflow

### Month-end: plan next month's calendar (60-90 minutes)

**Step 1 — Review last month**
```
/content-strategy

Last month's content audit:
- Which pieces drove the most organic traffic?
- Which drove the most leads/conversions?
- Which had the highest engagement on social?
- Any content that underperformed despite being high effort?

Give me: double-down list (more content like this), cut list (stop this format), and 3 new ideas based on what worked.
```

**Step 2 — Build next month's calendar**
```
/editorial-calendar

Build the editorial calendar for [next month].

Brand: [company name + one-line description]
Audience: [ICP description]
Goal: [traffic / leads / brand]
Channels: [blog / newsletter / LinkedIn / X]
Publishing cadence: [X/week blog, daily LinkedIn, weekly newsletter]
Current top keyword cluster: [main topic area]
```

**Step 3 — Brief each piece**
```
/content-brief

[Run for each planned piece in the calendar]
```

---

## 30-day ramp plan (new content marketers)

### Week 1 — Audit and understand
- Install all marketing skills: `npx claudient add skills marketing`
- Run `/seo-audit` on your entire site — know what you have before publishing more
- Run `/competitive-analyst` on your top 3 competitors — what are they writing about that you're not?
- Audit your email list: open rates, click rates, unsubscribes — what content performs?
- Map your topic clusters: use `/content-strategy` to define your 3 pillars

### Week 2 — System setup
- Build your first editorial calendar with `/editorial-calendar`
- Create brief templates for your 3 most common content types
- Set up your content distribution checklist (every post = 5-channel distribution)
- Define your internal linking map: which 10 pieces are your cornerstone content?

### Week 3 — Production launch
- Brief and produce your first 4 pieces using `/content-brief` + `/copywriting`
- Use `/social-media-manager` to repurpose each piece across channels
- Set up your weekly email with `/email-sequence`
- Publish, distribute, track results

### Week 4 — Analyse and optimise
- Run `/seo-audit` — what improved? What new opportunities appeared?
- Identify your best-performing piece and use `/content-brief` to produce 3 more like it
- Set up monthly analytics reporting template
- Present your first monthly content strategy report

---

## Tool integrations

### Ahrefs / Semrush

```
Paste keyword data directly into Claude:
1. Export keyword report from Ahrefs → Copy the top 100 rows
2. /seo-audit: paste the data and ask for prioritised opportunity list
3. Use /content-brief with the identified keywords

For competitor content gap:
1. Run "Content Gap" report in Ahrefs against top 3 competitors
2. Paste the gap keywords into /editorial-calendar
3. Map keywords to topic clusters and build the calendar
```

### Google Search Console

```bash
# Connect GSC data to Claude via MCP
# Add to ~/.claude/settings.json:
{
  "mcpServers": {
    "google-search-console": {
      "command": "npx",
      "args": ["-y", "@anthropic/gsc-mcp"],
      "env": {
        "GSC_CREDENTIALS": "path/to/credentials.json",
        "GSC_SITE_URL": "https://yourdomain.com"
      }
    }
  }
}
```

With this connected, Claude can:
- Pull your top queries and pages directly
- Identify keywords ranking 11-20 (quick-win optimisation targets)
- Track impressions vs. clicks to find CTR opportunities
- Monitor for ranking drops across your content

### HubSpot / Marketo (content attribution)

```json
{
  "mcpServers": {
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "your-token"
      }
    }
  }
}
```

With this connected:
- Ask Claude which blog posts are generating the most contact conversions
- Identify what content your best leads consumed before converting
- Build UTM-tracked distribution plans linked back to deal influence

### Notion / Airtable (editorial calendar)

```
Export your content calendar from Notion or Airtable as CSV or markdown.
Paste into Claude with:
"/editorial-calendar — here's my current calendar. Identify gaps in topic coverage,
over-indexing on any one content type, and pieces that need a priority refresh."
```

### n8n / Make (automation)

```
Automate the content production loop:
- New Ahrefs keyword alert → /content-brief auto-generated → Notion page created
- Published blog post → /social-media-manager → posts scheduled in Buffer/Hootsuite
- Email sent → open rate below threshold → /email-sequence → subject line variants generated
- Monthly: Google Analytics report → /content-strategy → monthly review doc created
```

---

## Benchmarks to track

Pull these from Google Analytics, GSC, and your email platform weekly:

| Metric | Early stage | Growth stage | Mature |
|---|---|---|---|
| Organic sessions/month | 1,000 | 10,000 | 50,000+ |
| MoM organic growth | >10% | 5-10% | 2-5% |
| Pieces published/month | 8 | 16 | 25+ |
| Email open rate | >25% | >30% | >35% |
| Email CTR | >2% | >3% | >4% |
| Social engagement rate (LinkedIn) | >2% | >3% | >4% |
| Content-attributed leads/month | 5 | 25 | 100+ |
| Time per content brief | <30 min | <15 min | <10 min |

---

## Common mistakes (and how Claude Code helps avoid them)

**Mistake 1: Writing without a brief**
`/content-brief` takes 5 minutes. Skipping it costs you 3 hours of rewrites when the piece misses intent.

**Mistake 2: Producing content without a distribution plan**
`/editorial-calendar` builds the distribution plan into the calendar. Every piece has a 5-channel plan before it's written.

**Mistake 3: Publishing without internal links**
`/content-brief` maps internal links as part of the brief. No more publishing orphan content.

**Mistake 4: Ignoring content decay**
`/seo-audit` surfaces pages that were ranking but have slipped. Refresh beats publishing new content for established sites.

**Mistake 5: Social posts that just share the link**
`/social-media-manager` rewrites content as platform-native posts. LinkedIn carousels, Twitter threads, Instagram captions — all distinct from the blog.

---

## Resources

- [Getting started with Claude Code](../getting-started.md)
- [Content creation workflow](../workflows/content-creation.md)
- [SEO audit skill](../skills/marketing/seo-audit.md)
- [Content brief skill](../skills/marketing/content-brief.md)
- [Editorial calendar skill](../skills/marketing/editorial-calendar.md)
- [Email sequence skill](../skills/marketing/email-sequence.md)

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
