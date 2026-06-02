# Content Marketer Workspace — Project Structure

> For content marketers managing the full production lifecycle — from keyword research and briefs through drafting, SEO review, publishing, distribution, and repurposing — in a single Claude Code workspace.

## Stack

- **CMS:** HubSpot CMS Hub or WordPress 6.x with Yoast SEO / RankMath
- **SEO:** Ahrefs (Site Explorer, Keywords Explorer, Content Explorer) or Semrush (Keyword Magic, Position Tracking)
- **Planning:** Notion (editorial calendar database, content tracker)
- **Social scheduling:** Buffer (multi-channel) or Sprout Social (enterprise teams)
- **Visuals:** Canva (social graphics, featured images, infographics)
- **Analytics:** Google Analytics 4 (traffic, engagement, conversions), HubSpot reporting (pipeline attribution)
- **Communication:** Slack (editorial Slack channel, publishing alerts)
- **Docs-as-code:** GitHub (content versioning, draft reviews via pull requests)
- **Claude Code skills:** marketing/content-brief, marketing/content-strategy, marketing/copywriting, marketing/editorial-calendar, marketing/ai-seo, marketing/programmatic-seo, marketing/social-media-manager, small-business/content-repurposer

## Directory tree

```
content-marketer-workspace/
├── .claude/
│   ├── CLAUDE.md                        # Workspace instructions for Claude Code
│   ├── settings.json                    # MCP servers, hooks, permissions
│   └── commands/
│       ├── content-brief.md             # /content-brief — generate full SEO brief from keyword
│       ├── draft-post.md                # /draft-post — write long-form post from brief
│       ├── seo-audit.md                 # /seo-audit — on-page SEO check before publish
│       ├── social-copy.md               # /social-copy — generate social variants from post
│       ├── repurpose.md                 # /repurpose — break long-form into newsletter, threads, clips
│       ├── editorial-calendar.md        # /editorial-calendar — plan and fill a monthly calendar
│       └── performance-review.md        # /performance-review — pull GA4 metrics, flag underperformers
├── briefs/
│   ├── _template.md                     # Master content brief template (copy-paste to start)
│   ├── 2026-06-best-ai-tools-marketers/ # One directory per piece
│   │   ├── brief.md                     # Brief with keyword research, outline, competitor gaps
│   │   ├── competitor-notes.md          # Manual notes from reading the top 3-5 ranking URLs
│   │   └── keyword-data.csv             # Exported Ahrefs/Semrush keyword data for this topic
│   ├── 2026-06-content-strategy-guide/
│   │   ├── brief.md
│   │   ├── competitor-notes.md
│   │   └── keyword-data.csv
│   └── 2026-07-programmatic-seo-primer/
│       ├── brief.md
│       └── keyword-data.csv
├── drafts/
│   ├── best-ai-tools-marketers.md       # WIP draft — maps to brief in briefs/
│   ├── content-strategy-guide.md        # WIP, currently in editor review
│   └── programmatic-seo-primer.md       # Just started — rough outline stage
├── published/
│   ├── 2026-05/
│   │   ├── editorial-calendar-template/ # Published piece archive
│   │   │   ├── post.md                  # Final published copy
│   │   │   ├── metrics.md               # GA4 + HubSpot metrics pulled at 30/60/90 days
│   │   │   └── social-posts.md          # Social copy used for distribution
│   │   └── seo-audit-checklist/
│   │       ├── post.md
│   │       ├── metrics.md
│   │       └── social-posts.md
│   └── 2026-04/
│       └── content-brief-guide/
│           ├── post.md
│           ├── metrics.md
│           └── social-posts.md
├── research/
│   ├── keyword-clusters/
│   │   ├── seo-cluster.csv              # Topic cluster: SEO skills, tools, audits
│   │   ├── content-ops-cluster.csv      # Topic cluster: editorial, production, workflows
│   │   └── ai-marketing-cluster.csv     # Topic cluster: AI tools for marketers
│   ├── competitor-content/
│   │   ├── competitor-a-content-map.md  # Mapped content from primary competitor
│   │   ├── competitor-b-content-map.md
│   │   └── gap-analysis.md              # Our coverage vs. competitor coverage
│   └── serp-snapshots/
│       ├── 2026-06-snapshot.md          # Monthly SERP position log for tracked keywords
│       └── 2026-05-snapshot.md
├── templates/
│   ├── brief-template.md                # Blank content brief (H2 outline, meta, ILP)
│   ├── blog-post-format.md              # Standard blog post structure (intro, H2s, CTA, footer)
│   ├── listicle-format.md               # Numbered listicle skeleton
│   ├── comparison-format.md             # "[A] vs [B]" post structure
│   ├── how-to-format.md                 # Tutorial / step-by-step structure
│   └── pillar-page-format.md            # Long-form pillar (3000+ words, internal link hub)
├── assets/
│   ├── ctas/
│   │   ├── blog-ctas.md                 # 10 reusable end-of-post CTAs by goal (lead, demo, sub)
│   │   └── inline-ctas.md               # Mid-post CTA variations (content upgrades, trials)
│   ├── author-bios/
│   │   ├── author-bio-short.md          # 50-word bio for bylines
│   │   └── author-bio-long.md           # 150-word bio for guest posts
│   ├── boilerplate/
│   │   ├── company-description.md       # 1-sentence, 1-paragraph, and full company bios
│   │   ├── product-descriptions.md      # Key product/feature descriptions for embedding
│   │   └── disclaimer-legal.md          # Standard legal / affiliate disclaimers
│   └── social/
│       ├── linkedin-profile-copy.md     # Reusable LinkedIn company page copy
│       └── twitter-bio.md               # Twitter/X bio variants
└── editorial-calendar.md                # Master calendar — monthly view, status, assignees
```

## Key files explained

| Path | Purpose |
|---|---|
| `.claude/commands/content-brief.md` | Slash command that takes a keyword/topic as input and produces a full SEO-optimised brief including competitor gap analysis, H2 outline, meta copy, and internal link plan |
| `.claude/commands/draft-post.md` | Slash command that reads the brief in `briefs/<slug>/brief.md` and writes a complete draft to `drafts/<slug>.md`, following the post format template for the content type |
| `.claude/commands/seo-audit.md` | Pre-publish checklist: validates title tag length, meta description, slug, H1/H2 keyword presence, image alt text, internal links, and schema eligibility |
| `.claude/commands/social-copy.md` | Takes a published URL or draft and outputs LinkedIn post, Twitter/X thread, Instagram caption, and newsletter blurb — all channel-native, not copy-pasted |
| `.claude/commands/repurpose.md` | Breaks a long-form post into a newsletter section, a LinkedIn carousel outline, a short-form video script, and a Twitter/X thread |
| `.claude/commands/performance-review.md` | Pulls 30/60/90-day GA4 metrics for published pieces, flags underperformers vs. traffic targets, and suggests quick-win CRO or SEO fixes |
| `briefs/_template.md` | Master brief template — copy this before starting any new piece; contains keyword block, competitor table, full H2 outline scaffold, meta fields, and internal link plan |
| `editorial-calendar.md` | Single-file master calendar with month-by-month tables, per-piece status (brief / draft / review / published), keyword, target publish date, and assignee |

## Quick scaffold

```bash
# Create workspace root
mkdir -p content-marketer-workspace && cd content-marketer-workspace

# Claude Code directories
mkdir -p .claude/commands

# Content lifecycle directories
mkdir -p briefs/_template
mkdir -p drafts
mkdir -p published/2026-05
mkdir -p published/2026-04

# Research directories
mkdir -p research/keyword-clusters
mkdir -p research/competitor-content
mkdir -p research/serp-snapshots

# Templates and assets
mkdir -p templates
mkdir -p assets/ctas
mkdir -p assets/author-bios
mkdir -p assets/boilerplate
mkdir -p assets/social

# Initialize CLAUDE.md
touch .claude/CLAUDE.md
touch .claude/settings.json

# Install all content marketing skills
npx claudient add skill marketing/content-brief
npx claudient add skill marketing/content-strategy
npx claudient add skill marketing/copywriting
npx claudient add skill marketing/editorial-calendar
npx claudient add skill marketing/ai-seo
npx claudient add skill marketing/programmatic-seo
npx claudient add skill marketing/social-media-manager
npx claudient add skill small-business/content-repurposer

# Copy slash commands into .claude/commands/
npx claudient add command content-brief
npx claudient add command draft-post
npx claudient add command seo-audit
npx claudient add command social-copy
npx claudient add command repurpose
npx claudient add command editorial-calendar
npx claudient add command performance-review

# Create brief template placeholder
touch briefs/_template.md

# Create editorial calendar
touch editorial-calendar.md

echo "Content marketer workspace ready."
```

## CLAUDE.md template

```markdown
# Content Marketer Workspace — Claude Instructions

## What this is

This workspace manages the full content marketing production cycle: keyword research,
content briefs, long-form drafting, SEO audits, publishing, social distribution,
repurposing, and performance measurement. All content targets SEO-driven organic traffic
for a B2B audience.

## Stack

- CMS: HubSpot CMS (primary) / WordPress with Yoast SEO (secondary)
- SEO tool: Ahrefs — use for keyword volume, KD, SERP analysis, and competitor research
- Planning: Notion editorial calendar database (synced manually to editorial-calendar.md here)
- Social scheduling: Buffer — LinkedIn, Twitter/X, and Instagram queues
- Analytics: Google Analytics 4 — all traffic and engagement metrics
- Visuals: Canva — featured images at 1200x630px, social cards at 1080x1080px
- Communication: Slack #content-team channel for status updates

## Directory conventions

- briefs/<slug>/ — one directory per piece; always start here before drafting
- drafts/<slug>.md — active WIP; filename matches the brief directory name
- published/<YYYY-MM>/<slug>/ — post.md + metrics.md + social-posts.md
- templates/ — never edit these directly; copy to drafts/ before modifying
- assets/ — reusable copy blocks; cite the file when inserting boilerplate

## Common tasks — exact commands

**Start a new content piece:**
/content-brief keyword="[primary keyword]" audience="[ICP description]" type="[blog/guide/comparison]"

**Draft from a finished brief:**
/draft-post brief=briefs/[slug]/brief.md format=templates/[format].md

**Pre-publish SEO check:**
/seo-audit draft=drafts/[slug].md keyword="[primary keyword]"

**Generate social distribution copy:**
/social-copy source=published/[YYYY-MM]/[slug]/post.md channels="linkedin,twitter,newsletter"

**Repurpose a published post:**
/repurpose source=published/[YYYY-MM]/[slug]/post.md formats="newsletter,thread,carousel"

**Monthly editorial planning:**
/editorial-calendar month="[Month YYYY]" goal="[traffic/leads/brand]" slots=[number]

**Performance review:**
/performance-review period=90d published=published/[YYYY-MM]/

## Brief conventions

- Always run /content-brief before touching drafts/ — never draft without a brief
- Competitor gap analysis must reference at least 3 ranking URLs
- Every brief must include an internal link plan (3 outbound, 3 inbound)
- Keyword difficulty above 70: only proceed if domain authority supports it

## SEO conventions

- Title tags: 55-60 characters, primary keyword included, power word included
- Meta descriptions: 150-158 characters, keyword + value prop + soft CTA
- URL slugs: 2-4 words, lowercase hyphenated, primary keyword, no stop words
- Minimum internal links per post: 4 (2 contextual + 2 related reading)
- Every image: alt text that is descriptive and keyword-relevant where natural
- Schema: Article schema on every post; FAQ schema when H2s are questions

## Publishing workflow

1. Brief approved in briefs/<slug>/brief.md
2. Draft written to drafts/<slug>.md
3. /seo-audit run and all checklist items resolved
4. Published to CMS (HubSpot or WordPress)
5. Post archived to published/<YYYY-MM>/<slug>/post.md
6. /social-copy run; posts scheduled in Buffer
7. editorial-calendar.md status updated to "published"
8. Metrics logged to published/<YYYY-MM>/<slug>/metrics.md at 30, 60, 90 days
```

## MCP servers

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "${SLACK_TEAM_ID}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/${USER}/content-marketer-workspace"
      ]
    },
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/mcp-server-notion"],
      "env": {
        "NOTION_API_KEY": "${NOTION_API_KEY}"
      }
    }
  }
}
```

## Recommended hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_OUTPUT_FILE_PATH\"; if [[ \"$FILE\" == */drafts/*.md ]]; then echo \"[hook] Draft saved: $FILE — run /seo-audit before publishing\"; fi'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$FILE\" == */published/*.md ]]; then echo \"[hook] Writing to published/ — ensure seo-audit has been run and brief exists in briefs/\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR}\" && UNPUBLISHED=$(find drafts/ -name \"*.md\" -newer editorial-calendar.md 2>/dev/null | wc -l | tr -d \" \"); [ \"$UNPUBLISHED\" -gt 0 ] && echo \"[reminder] $UNPUBLISHED draft(s) modified since last calendar update — update editorial-calendar.md\" || true'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
npx claudient add skill marketing/content-brief
npx claudient add skill marketing/content-strategy
npx claudient add skill marketing/copywriting
npx claudient add skill marketing/editorial-calendar
npx claudient add skill marketing/ai-seo
npx claudient add skill marketing/programmatic-seo
npx claudient add skill marketing/social-media-manager
npx claudient add skill small-business/content-repurposer
npx claudient add skill marketing/seo-audit
```

## Related

- [Guide: Claude for Content Marketers](../guides/for-content-marketer.md)
- [Workflow: Content Creation end-to-end](../workflows/content-creation.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
