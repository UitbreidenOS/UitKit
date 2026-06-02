# Online Course Business — Project Structure

> A course creator or educator workspace for designing curricula, launching knowledge products, managing student communities, and tracking enrollment revenue — driven by slash commands and per-course context.

## Stack

- **Teachable** / **Kajabi** / **Thinkific** — course hosting, drip content, student progress tracking, certificates
- **ConvertKit** / **ActiveCampaign** — email sequences, subscriber tagging, broadcast campaigns, automation rules
- **Loom** / **Descript** — async video recording, screen capture, transcript editing, overdub corrections
- **Circle** / **Skool** — student community, cohort spaces, discussion threads, member milestones
- **Stripe** — payment processing, subscription billing, coupon codes, refund management
- **Canva** — course graphics, sales page mockups, social media assets, certificate templates
- **Notion** — curriculum planning boards, lesson scripting, launch calendars, SOPs
- **Calendly** — 1:1 coaching call booking, office hours scheduling, onboarding calls
- **Zapier** — cross-platform automations (new purchase → welcome email, community invite, tag in ConvertKit)

## Directory tree

```
online-course-business/
├── .claude/
│   ├── CLAUDE.md                                        # workspace instructions for Claude Code
│   ├── settings.json                                    # MCP servers, hooks, permissions
│   └── commands/
│       ├── new-course.md                                # /new-course <title> — scaffolds full courses/ subdirectory
│       ├── lesson-script.md                             # /lesson-script <module> <lesson-title> — writes full lesson script with intro hook, teaching points, CTA
│       ├── email-sequence.md                            # /email-sequence <sequence-name> <num-emails> — drafts nurture or launch sequence
│       ├── launch-plan.md                               # /launch-plan <course-slug> <launch-date> — full pre/during/post launch calendar
│       ├── sales-page.md                                # /sales-page <course-slug> — drafts long-form sales page copy from curriculum outline
│       ├── support-reply.md                             # /support-reply <ticket-summary> — drafts empathetic, policy-aligned support response
│       ├── weekly-prompt.md                             # /weekly-prompt <community-platform> — generates this week's community engagement prompt
│       └── revenue-snapshot.md                         # /revenue-snapshot — reads analytics files and summarizes enrollment + revenue trends
├── courses/
│   ├── _template/                                       # copy this directory when creating a new course
│   │   ├── curriculum-outline.md                        # module and lesson map with learning objectives per lesson
│   │   ├── student-guide.md                             # student-facing welcome doc: what to expect, how to navigate, next steps
│   │   ├── assessment-rubric.md                         # grading criteria for any assignments or project submissions
│   │   ├── lesson-scripts/
│   │   │   └── m01-l01-template.md                      # lesson script template: hook, teach, demonstrate, practice, CTA
│   │   └── slides-notes/
│   │       └── m01-l01-slides-notes.md                  # slide-by-slide speaker notes keyed to lesson script
│   ├── accelerate-with-ai/                              # example course: "Accelerate With AI"
│   │   ├── curriculum-outline.md                        # 6-module map: setup → prompting → automation → content → ops → scale
│   │   ├── student-guide.md                             # onboarding doc linked from welcome email
│   │   ├── assessment-rubric.md                         # capstone project rubric: use case clarity, prompt quality, output value
│   │   ├── lesson-scripts/
│   │   │   ├── m01-l01-what-is-ai-for-business.md       # hook: "You're already behind" → context → Claude demo → assignment
│   │   │   ├── m01-l02-setting-up-claude-code.md
│   │   │   ├── m02-l01-prompt-fundamentals.md
│   │   │   ├── m02-l02-chain-of-thought-prompting.md
│   │   │   ├── m02-l03-prompt-templates.md
│   │   │   ├── m03-l01-zapier-ai-automations.md
│   │   │   ├── m03-l02-make-scenarios.md
│   │   │   ├── m04-l01-content-at-scale.md
│   │   │   ├── m04-l02-social-repurposing.md
│   │   │   ├── m05-l01-ai-for-ops.md
│   │   │   └── m06-l01-building-your-ai-stack.md
│   │   └── slides-notes/
│   │       ├── m01-l01-slides-notes.md
│   │       ├── m01-l02-slides-notes.md
│   │       ├── m02-l01-slides-notes.md
│   │       ├── m02-l02-slides-notes.md
│   │       └── m02-l03-slides-notes.md
│   └── freelance-to-agency/                             # second course: "Freelance to Agency"
│       ├── curriculum-outline.md                        # 5-module map: positioning → offers → hiring → systems → scale
│       ├── student-guide.md
│       ├── assessment-rubric.md
│       ├── lesson-scripts/
│       │   ├── m01-l01-positioning-statement.md
│       │   ├── m01-l02-niche-selection-framework.md
│       │   ├── m02-l01-packaging-your-offer.md
│       │   ├── m02-l02-pricing-strategy.md
│       │   ├── m03-l01-your-first-hire.md
│       │   └── m04-l01-client-delivery-sop.md
│       └── slides-notes/
│           ├── m01-l01-slides-notes.md
│           └── m01-l02-slides-notes.md
├── marketing/
│   ├── launch-plan.md                                   # master launch calendar: pre-launch → cart open → cart close → post-launch
│   ├── sales-page-copy.md                               # long-form sales page: headline, VSL script, benefits, FAQs, guarantee, CTAs
│   ├── social-calendar.md                               # 30-day content grid: platform, post type, copy angle, asset needed
│   ├── email-sequences/
│   │   ├── welcome-sequence.md                          # 5-email welcome: day 0 login, day 1 quick win, day 3 module 1, day 7 check-in, day 14 milestone
│   │   ├── pre-launch-waitlist.md                       # 7-email waitlist build: problem agitation → solution teasing → social proof → early-bird CTA
│   │   ├── launch-sequence.md                           # 10-email cart-open sequence: open → value → faq → close → last-chance
│   │   ├── post-purchase-nurture.md                     # 4-email post-buy sequence: confirm → access → first win → upsell to coaching
│   │   ├── re-engagement.md                             # 3-email win-back for subscribers inactive 90+ days
│   │   └── affiliate-onboarding.md                      # 4-email sequence for new affiliates: assets → swipe copy → tracking links → bonus structure
│   └── webinar-scripts/
│       ├── masterclass-free.md                          # free training script: 60-min value-heavy presentation with pitch at minute 45
│       └── sales-webinar.md                             # live launch webinar: backstory → framework → case studies → offer → Q&A
├── community/
│   ├── onboarding-message.md                            # pinned welcome post for Circle/Skool: rules, how to navigate, first post prompt
│   ├── weekly-prompts.md                                # 52-week log of community engagement prompts — one per week
│   ├── member-milestones.md                             # milestone celebration templates: module 1 complete, halfway, graduation, testimonial ask
│   └── moderation-guidelines.md                        # community rules, violation tiers, ban criteria, escalation path
├── operations/
│   ├── student-support-templates.md                     # canned responses: login issues, refund requests, billing questions, access extensions
│   ├── refund-policy.md                                 # 30-day satisfaction guarantee terms, how to request, processing timeline
│   ├── affiliate-program.md                             # commission structure (30%), cookie window, payout schedule, prohibited promo methods
│   ├── pricing-strategy.md                              # tier logic, payment plans, coupon strategy, evergreen vs launch pricing
│   ├── onboarding-sop.md                                # step-by-step: new student → Teachable access → Circle invite → ConvertKit tag → Calendly link
│   └── zapier-automations.md                            # documented Zap inventory: trigger → filter → action for each live automation
├── analytics/
│   ├── enrollment-tracker.md                            # monthly enrollment counts by course, channel, campaign source
│   ├── completion-rates.md                              # module-by-module completion % and drop-off points by cohort
│   ├── revenue-dashboard.md                             # MRR, LTV, refund rate, affiliate payouts — updated monthly
│   └── email-metrics.md                                 # open rates, CTRs, unsubscribes by sequence and broadcast — tracked weekly
└── assets/
    ├── canva-templates.md                               # links to shared Canva library: thumbnails, social posts, certificate, sales-page graphics
    ├── brand-guide.md                                   # hex colors, fonts, logo usage, tone of voice, do/don't examples
    └── loom-recordings-log.md                           # inventory of Loom links by module and lesson with recording date and status
```

## Key files explained

| Path | Purpose |
|---|---|
| `.claude/commands/lesson-script.md` | Slash command that reads the course `curriculum-outline.md` and the target module's learning objective, then writes a full lesson script with a pattern-interrupt hook, three teaching points, a demonstration segment, a practice exercise, and a clear CTA — ready to record in Loom or Descript |
| `.claude/commands/email-sequence.md` | Accepts a sequence name and email count, reads the matching `courses/` outline for context, and drafts every email with subject line, preview text, body, and CTA — ConvertKit-ready formatting |
| `.claude/commands/sales-page.md` | Reads a course's `curriculum-outline.md`, `student-guide.md`, and `assessment-rubric.md`, then drafts a long-form sales page with VSL script, benefit bullets, module-by-module breakdown, FAQs, guarantee block, and multiple CTAs |
| `.claude/commands/support-reply.md` | Takes a ticket summary, reads `operations/refund-policy.md` and `operations/student-support-templates.md`, and drafts a policy-aligned, empathetic reply — flags edge cases that need human escalation |
| `courses/<slug>/curriculum-outline.md` | Source of truth for every course: module titles, lesson titles, and a one-line learning objective per lesson — all other commands read this file first |
| `marketing/launch-plan.md` | Master launch calendar with pre-launch (30 days), cart open (7 days), and post-launch (14 days) phases — each day has a channel, task, and copy angle |
| `operations/zapier-automations.md` | Living inventory of every active Zap: trigger event, filters, and action steps — prevents duplicate automations and makes debugging fast |
| `analytics/revenue-dashboard.md` | Monthly revenue snapshot: gross revenue, refunds, net, MRR by course, LTV by acquisition channel — the `/revenue-snapshot` command reads and summarizes this |

## Quick scaffold

```bash
# Create workspace root and Claude config
mkdir -p online-course-business/.claude/commands

# Create course template
mkdir -p online-course-business/courses/_template/lesson-scripts
mkdir -p online-course-business/courses/_template/slides-notes

# Create example course directories
mkdir -p online-course-business/courses/accelerate-with-ai/lesson-scripts
mkdir -p online-course-business/courses/accelerate-with-ai/slides-notes
mkdir -p online-course-business/courses/freelance-to-agency/lesson-scripts
mkdir -p online-course-business/courses/freelance-to-agency/slides-notes

# Create marketing directories
mkdir -p online-course-business/marketing/email-sequences
mkdir -p online-course-business/marketing/webinar-scripts

# Create community, operations, analytics, and assets directories
mkdir -p online-course-business/community
mkdir -p online-course-business/operations
mkdir -p online-course-business/analytics
mkdir -p online-course-business/assets

# Stub out slash commands
touch online-course-business/.claude/commands/new-course.md
touch online-course-business/.claude/commands/lesson-script.md
touch online-course-business/.claude/commands/email-sequence.md
touch online-course-business/.claude/commands/launch-plan.md
touch online-course-business/.claude/commands/sales-page.md
touch online-course-business/.claude/commands/support-reply.md
touch online-course-business/.claude/commands/weekly-prompt.md
touch online-course-business/.claude/commands/revenue-snapshot.md

# Stub out course template files
touch online-course-business/courses/_template/curriculum-outline.md
touch online-course-business/courses/_template/student-guide.md
touch online-course-business/courses/_template/assessment-rubric.md
touch online-course-business/courses/_template/lesson-scripts/m01-l01-template.md
touch online-course-business/courses/_template/slides-notes/m01-l01-slides-notes.md

# Stub out marketing files
touch online-course-business/marketing/launch-plan.md
touch online-course-business/marketing/sales-page-copy.md
touch online-course-business/marketing/social-calendar.md
touch online-course-business/marketing/email-sequences/welcome-sequence.md
touch online-course-business/marketing/email-sequences/pre-launch-waitlist.md
touch online-course-business/marketing/email-sequences/launch-sequence.md
touch online-course-business/marketing/email-sequences/post-purchase-nurture.md
touch online-course-business/marketing/email-sequences/re-engagement.md
touch online-course-business/marketing/email-sequences/affiliate-onboarding.md
touch online-course-business/marketing/webinar-scripts/masterclass-free.md
touch online-course-business/marketing/webinar-scripts/sales-webinar.md

# Stub out community files
touch online-course-business/community/onboarding-message.md
touch online-course-business/community/weekly-prompts.md
touch online-course-business/community/member-milestones.md
touch online-course-business/community/moderation-guidelines.md

# Stub out operations files
touch online-course-business/operations/student-support-templates.md
touch online-course-business/operations/refund-policy.md
touch online-course-business/operations/affiliate-program.md
touch online-course-business/operations/pricing-strategy.md
touch online-course-business/operations/onboarding-sop.md
touch online-course-business/operations/zapier-automations.md

# Stub out analytics files
touch online-course-business/analytics/enrollment-tracker.md
touch online-course-business/analytics/completion-rates.md
touch online-course-business/analytics/revenue-dashboard.md
touch online-course-business/analytics/email-metrics.md

# Stub out assets files
touch online-course-business/assets/canva-templates.md
touch online-course-business/assets/brand-guide.md
touch online-course-business/assets/loom-recordings-log.md

# Install relevant skills
npx claudient add skill productivity/lesson-planner
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/exec-briefing
npx claudient add skill data-ml/de/stakeholder-report
```

## CLAUDE.md template

```markdown
# Online Course Business — Claude Code Instructions

## What this is

This is a course creator workspace. It contains curricula for multiple courses, marketing
copy and email sequences, community management content, student support operations, and
revenue analytics. Claude Code operates here as a curriculum writer, launch copywriter,
support drafter, and analytics summarizer — always reading per-course context before
generating any output.

Never invent curriculum structure. Always read the relevant curriculum-outline.md first.

## Stack

- Course platform: Teachable / Kajabi / Thinkific — hosting, drip, progress tracking
- Email: ConvertKit / ActiveCampaign — sequences, broadcasts, subscriber tagging
- Video: Loom / Descript — lesson recording, transcript editing, overdub
- Community: Circle / Skool — discussions, cohort spaces, milestones
- Payments: Stripe — one-time, payment plans, subscriptions, refunds
- Graphics: Canva — thumbnails, sales assets, certificates
- Planning: Notion — curriculum boards, launch calendars, SOPs
- Scheduling: Calendly — coaching calls, office hours, onboarding calls
- Automation: Zapier — cross-platform triggers (purchase → access → email → community)

## Common tasks and exact commands

Scaffold a new course:
  /new-course <title>
  → Creates courses/<slug>/ with curriculum-outline.md, student-guide.md, assessment-rubric.md,
    lesson-scripts/, and slides-notes/ from the _template directory

Write a lesson script:
  /lesson-script <course-slug> <module-number> <lesson-title>
  → Reads courses/<slug>/curriculum-outline.md for the lesson objective, then writes a full
    script: pattern-interrupt hook, three teaching points, demo, practice exercise, CTA

Draft an email sequence:
  /email-sequence <sequence-name> <num-emails>
  → Reads relevant course outline for context; drafts each email with subject, preview text,
    body, and CTA in ConvertKit-compatible formatting

Write a launch plan:
  /launch-plan <course-slug> <launch-date>
  → Reads marketing/launch-plan.md for structure; outputs a dated pre-launch/cart-open/
    post-launch calendar with task, channel, and copy angle for each day

Draft a sales page:
  /sales-page <course-slug>
  → Reads curriculum-outline.md, student-guide.md; writes long-form copy with VSL script,
    benefit bullets, module breakdown, FAQs, guarantee block, and CTAs

Reply to a support ticket:
  /support-reply <ticket-summary>
  → Reads operations/refund-policy.md and operations/student-support-templates.md; drafts a
    policy-aligned empathetic reply; flags escalation triggers

Generate a community prompt:
  /weekly-prompt <platform>
  → platform is one of: circle / skool / slack
  → Writes this week's engagement prompt referencing the community's current course phase

Summarize revenue:
  /revenue-snapshot
  → Reads analytics/revenue-dashboard.md, analytics/enrollment-tracker.md; outputs a clean
    MRR/enrollment/refund summary with trend callouts

## Curriculum design workflow

1. Draft curriculum-outline.md — modules, lessons, one-line objective per lesson
2. Write lesson-scripts/ in order — use /lesson-script for each lesson
3. Add slides-notes/ keyed to the lesson script line by line
4. Write student-guide.md — navigation, expectations, quick-win first step
5. Write assessment-rubric.md — criteria and point weights for any assignments
6. Record in Loom or Descript — log link in assets/loom-recordings-log.md

## Launch sequence order

1. marketing/email-sequences/pre-launch-waitlist.md — activate 30 days before open cart
2. marketing/webinar-scripts/masterclass-free.md — run 7 days before open cart
3. marketing/sales-page-copy.md — publish on cart open day
4. marketing/email-sequences/launch-sequence.md — activate on cart open
5. marketing/launch-plan.md — daily task execution through cart close
6. marketing/email-sequences/post-purchase-nurture.md — activate on purchase trigger in Stripe/Zapier

## Student support triage

Level 1 — self-serve (use /support-reply): login issues, access delays, billing receipts,
  how-to-navigate questions → match to operations/student-support-templates.md canned response

Level 2 — judgment required (draft + flag for review): refund requests within 30-day window,
  access extension requests, technical playback issues → read refund-policy.md before drafting

Level 3 — escalate immediately (do not draft): chargebacks, legal complaints, harassment
  reports, affiliate fraud → note in ticket and route to human

## Workspace conventions

- Course directories are named with kebab-case slugs matching the Teachable/Kajabi URL slug
- Lesson scripts are named m<module-number>-l<lesson-number>-<slug>.md (e.g., m02-l03-prompt-templates.md)
- Slides notes are named identically to lesson scripts with -slides-notes suffix
- Email sequences use numbered prefixes when order matters: 01-day0-welcome.md, 02-day1-quick-win.md
- All launch dates in marketing/ use ISO 8601 (YYYY-MM-DD) — no ambiguous date formats
- Log every new Zapier automation in operations/zapier-automations.md on the day it goes live

## Do not

- Do not write lesson scripts without first reading the curriculum-outline.md for that course
- Do not draft a sales page without reading what the course actually teaches — no fabricated claims
- Do not approve refunds or grant access extensions — /support-reply drafts only, human sends
- Do not store student email addresses, Stripe customer IDs, or payment data in any workspace file
- Do not commit analytics/ files containing individual student records to any remote repository
```

## MCP servers

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/Users/$USER/online-course-business/courses",
        "/Users/$USER/online-course-business/marketing",
        "/Users/$USER/online-course-business/operations",
        "/Users/$USER/online-course-business/analytics"
      ]
    },
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/mcp-server-notion"],
      "env": {
        "NOTION_API_KEY": "${NOTION_API_KEY}"
      }
    },
    "convertkit": {
      "command": "npx",
      "args": ["-y", "@convertkit/mcp-server"],
      "env": {
        "CONVERTKIT_API_KEY": "${CONVERTKIT_API_KEY}",
        "CONVERTKIT_API_SECRET": "${CONVERTKIT_API_SECRET}"
      }
    },
    "stripe": {
      "command": "npx",
      "args": ["-y", "@stripe/mcp-server"],
      "env": {
        "STRIPE_SECRET_KEY": "${STRIPE_SECRET_KEY}"
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
            "command": "if echo \"$CLAUDE_TOOL_INPUT\" | python3 -c \"import sys,json; p=json.load(sys.stdin).get('path',''); print(p)\" 2>/dev/null | grep -q 'lesson-scripts/'; then echo '[course-business] Lesson script written — confirm a matching slides-notes/ file exists and the Loom recording is logged in assets/loom-recordings-log.md.'; fi"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "if echo \"$CLAUDE_TOOL_INPUT\" | python3 -c \"import sys,json; p=json.load(sys.stdin).get('path',''); print(p)\" 2>/dev/null | grep -q 'email-sequences/'; then echo '[course-business] Email sequence written — verify subject lines are under 50 characters and each email has a single clear CTA before loading into ConvertKit.'; fi"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo '[course-business] Session ended. Reminder: update analytics/enrollment-tracker.md if any new enrollments were processed, and log any new Zapier automations in operations/zapier-automations.md.'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
npx claudient add skill productivity/lesson-planner
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/doc-site-builder
npx claudient add skill data-ml/stakeholder-report
```

## Related

- [Course Creator Guide](../guides/for-course-creator.md)
- [Course Launch Workflow](../workflows/course-launch.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
