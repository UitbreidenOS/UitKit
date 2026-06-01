# Claude for Email Marketers

Everything an email marketer needs to run AI-augmented campaigns — list hygiene, deliverability, A/B testing, automation flows, copywriting, and performance reporting.

---

## Who this is for

You are an email marketer, CRM manager, or lifecycle marketer whose job is to acquire, engage, and retain customers through email. You write campaigns, manage automation flows, maintain list health, run split tests, and report on programme performance.

**Before Claude Code:** Campaign brief to live: 2-3 days. A/B test analysis: 45 minutes of spreadsheet work. Deliverability audit: a ticket to your ESP's support team. Monthly report: 3 hours.

**After:** Campaign draft in 25 minutes. A/B test interpreted in 5 minutes. Deliverability audit done by you (no ticket needed). Monthly report in 30 minutes.

---

## 30-second install

```bash
# Install the full email marketing stack
npx claudient add skills marketing/email-sequence
npx claudient add skills small-business/email-campaign
npx claudient add skills marketing/onboarding-cro
npx claudient add skills marketing/analytics-tracking
npx claudient add skills marketing/email-deliverability
npx claudient add skills marketing/email-ab-tester
npx claudient add agents advisors/cmo-advisor
```

---

## Your Claude Code email marketing stack

### Skills (slash commands)

| Skill | What it does | When to use |
|---|---|---|
| `/email-deliverability` | Deliverability audit: SPF/DKIM/DMARC, spam triggers, list hygiene, warm-up schedule | When open rates drop, setting up a new domain, quarterly audit |
| `/email-ab-tester` | A/B test design, sample size calculation, results interpretation | Every campaign where you have split-test capability |
| `/email-sequence` | Automated sequences: welcome, nurture, re-engagement, post-purchase | Building or optimising automated flows |
| `/email-campaign` | One-off campaign copy, subject lines, preview text, CTA | Campaign creation |
| `/onboarding-cro` | Onboarding email optimisation — activation events, friction points | New user/customer onboarding flows |
| `/analytics-tracking` | Email performance analysis, attribution, cohort analysis | Weekly and monthly reporting |

### Agents

| Agent | Model | When to spawn |
|---|---|---|
| `cmo-advisor` | Sonnet | Programme strategy — channel mix, segmentation strategy, budget allocation |

---

## Daily workflow

### Morning campaign performance check (15 minutes)

Start every day knowing what's working:

```
/analytics-tracking

Email programme morning check — [DATE]:

Yesterday's metrics:
- Campaigns sent: [list + send volume each]
- Open rates: [X%] vs. [X% 30-day average]
- Click rates: [X%] vs. [X% 30-day average]
- Revenue attributed: [$X]
- Unsubscribes: [X] (flag if > 0.5% per campaign)
- Spam complaints: [X] (flag if > 0.1%)
- Hard bounces: [X] (flag if > 0.5%)

Automated flows (24-hour window):
- Welcome series: [emails sent, avg open rate]
- Abandoned cart: [emails sent, recovery rate]
- Post-purchase: [emails sent, avg click rate]

Flag anything requiring attention today.
```

---

### List management (10-15 minutes per week)

**Weekly hygiene check:**

```
/email-deliverability

List hygiene check for week of [date]:

Current list metrics:
- Total active subscribers: [X]
- New subscribers this week: [X]
- Unsubscribes this week: [X]
- Hard bounces this week: [X]
- Soft bounces (3+): [X]
- Inactive > 90 days (no open): [X]
- Inactive > 180 days (no open): [X]

Import from new source this week: [yes/no — if yes, describe source and volume]

Actions needed:
- What to suppress immediately
- What to put into re-engagement
- Whether any recent import needs verification
```

---

### Email drafting

**Campaign email:**

```
/email-campaign

Campaign: [name and objective]
Audience segment: [who, how many]
Goal: [specific action you want them to take]
Offer or key message: [what you're sending — promotion / content / announcement]
Brand voice: [formal / conversational / direct]

Produce:
- Subject line (+ A/B variant)
- Preview text (50 chars)
- Email draft (with header, body, CTA)
- Send time recommendation for this segment and goal
- Mobile preview notes (how this reads in 375px width)
```

**Automated sequence email:**

```
/email-sequence

Sequence: [name — e.g., Welcome Series, Post-Purchase, Re-engagement]
Email position: [Day X, Email N of N]
What came before: [previous email summary]
Goal of this email: [what stage of the journey this serves]
Segment: [who receives this]

Write this email in the context of the full sequence — reference what we've established, build on it, move them to the next stage.
```

---

### A/B test work

**Design a new test:**

```
/email-ab-tester

Campaign: [describe]
What I want to test: [subject line / CTA / send time / email length / offer framing]
List size available: [X subscribers]
Baseline metric I'm trying to improve: [open rate X% / click rate X% / conversion X%]
My hypothesis: [If/Then/Because format]

Design the test: isolate the variable, calculate sample size, define success criteria, set the decision rule.
```

**Interpret results:**

```
/email-ab-tester

Interpret these results:
Test: [what was tested]
Variant A: [description] — [X% metric] — [N sends]
Variant B: [description] — [X% metric] — [N sends]

Is this significant? What should I do with this result? What principle does it teach me?
```

---

## Weekly rhythm

### Monday — Campaign planning

```
/email-campaign

Plan this week's emails:

Business context: [any promotions, product launches, seasonal events this week?]
Segments to target: [list segments and their last send date]
Email frequency goal: [X emails this week to main list, X to segments]
Active A/B tests this week: [list — don't send to test audiences until test concludes]

Produce: campaign calendar for the week with send dates, segments, objectives, and subject line options.
```

### Wednesday — Automation audit

Pick one automation flow to review each week:

```
/email-sequence

Audit mode — [FLOW NAME]:

Current flow stats:
- Email 1: [subject, open rate, click rate, unsubscribe rate]
- Email 2: [subject, open rate, click rate]
- [etc.]

Conversion from email 1 to goal completion: [X%]

What's the weakest link in this sequence? Where are people dropping off? What should I test or rewrite?
```

### Friday — Weekly performance report

```
/analytics-tracking

Weekly email programme report for [week]:

Campaign metrics:
[List each campaign: name, segment, opens, clicks, revenue, unsubscribes]

Automation flow performance:
[List key flows: emails sent, open rate, conversion rate vs. prior week]

List health:
- Net new subscribers: [X] (gross new minus unsubscribes)
- List growth rate: [X%]
- Active engagement rate (opened in last 90 days / total): [X%]

Deliverability:
- Bounce rate: [X%]
- Spam complaint rate: [X%]
- Inbox placement (if tracked): [X%]

A/B tests concluded this week: [results and learnings]

Produce: weekly summary (3 bullets for leadership) + detailed section for my records.
What do I need to prioritise next week?
```

---

## 30-day ramp plan

### Week 1 — Deliverability foundation

- Install all email marketing skills
- Run a full deliverability audit with `/email-deliverability` — authentication, list hygiene, spam scores
- Check SPF/DKIM/DMARC records and fix any gaps immediately
- Establish your list segmentation: active (< 90 days) / lightly active (90-180 days) / inactive (180+ days)
- Never send to inactive mixed with active until you've run a re-engagement campaign

### Week 2 — Automation review

- Audit your welcome sequence with `/email-sequence` — this is your highest-ROI flow
- Identify the one automation with the worst drop-off rate — rewrite it
- Review your re-engagement sequence (or create one if it doesn't exist)
- Set up your weekly list hygiene ritual

### Week 3 — Testing programme

- Build your first 90-day A/B testing backlog with `/email-ab-tester`
- Launch your first properly designed A/B test (subject line — easiest to start)
- Set up your statistical significance decision rule before you look at results
- Document your first "email learnings" note (principles you'll test against)

### Week 4 — Reporting and optimisation

- Establish your weekly performance reporting template
- Review the last 3 months of campaigns: which segments, subjects, and send times perform best?
- Present your first programme health report to your manager
- Identify the one automation flow that, if improved by 20%, would have the biggest revenue impact

---

## Tool integrations

### Klaviyo (lifecycle email)

```json
{
  "mcpServers": {
    "klaviyo": {
      "command": "npx",
      "args": ["-y", "@klaviyo/mcp-server"],
      "env": {
        "KLAVIYO_API_KEY": "your-private-api-key"
      }
    }
  }
}
```

With Klaviyo connected: segment data, flow analytics, and list health directly in Claude Code.

### HubSpot (B2B email)

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

### Mailchimp / Brevo / Postmark

Export your campaign reports as CSV → paste into `/analytics-tracking` for trend analysis and benchmarking.

### Google Postmaster Tools

Free tool from Google — connect your sending domain and monitor domain reputation, spam rates, and inbox placement for Gmail recipients. Check weekly as part of your deliverability review.

### Litmus / Email on Acid

Preview rendering across clients → paste issues into `/email-campaign` for quick HTML fixes.

---

## Metrics to track

| Metric | Target | Red flag |
|---|---|---|
| Open rate | > 25% (industry varies) | < 15% |
| Click rate | > 2% | < 1% |
| Click-to-open rate (CTOR) | > 10% | < 6% |
| Unsubscribe rate (per campaign) | < 0.2% | > 0.5% |
| Spam complaint rate | < 0.05% | > 0.1% (Google blocks at 0.1%) |
| Hard bounce rate | < 0.5% | > 1% |
| List growth rate | Positive month-over-month | Declining 2+ months |
| Active engagement rate | > 40% of list | < 25% |
| Welcome email open rate | > 50% | < 35% |
| Automation flow conversion | Depends on flow — set goal per flow | Below set goal for 60+ days |

Note: Apple Mail Privacy Protection inflates open rates for iOS users (marked as "opened" when preloaded). Treat click rate and CTOR as your primary engagement metrics for iOS-heavy lists.

---

## Common mistakes and how Claude Code helps avoid them

**Mistake 1: Sending to inactive subscribers without a re-engagement campaign first**
This is the fastest way to tank deliverability. Inactive subscribers who don't engage signal to providers that you're sending spam — they penalise your entire domain. Run a sunset campaign first.

**Mistake 2: Declaring A/B test winners based on 6 hours of data**
`/email-ab-tester` calculates whether your result is statistically significant. If it isn't, it's noise — not a winner.

**Mistake 3: No DMARC record on your sending domain**
`/email-deliverability` catches this in the first audit. Without DMARC, your domain is spoofable and providers trust it less.

**Mistake 4: Writing welcome emails as a one-email send**
`/email-sequence` designs 3-5 email welcome series. A single welcome email is a missed activation opportunity.

**Mistake 5: Testing subject lines without a hypothesis**
`/email-ab-tester` requires a hypothesis before it designs the test. "Testing different subject lines" is not a hypothesis — it's random variation that teaches you nothing even when you win.

---

## Resources

- [Getting started with Claude Code](./getting-started.md)
- [Email deliverability skill](../skills/marketing/email-deliverability.md)
- [Email A/B tester skill](../skills/marketing/email-ab-tester.md)
- [Email sequence skill](../skills/marketing/email-sequence.md)
- [Email campaign workflow](../workflows/email-campaign.md)
- [CMO advisor agent](../agents/advisors/cmo-advisor.md)

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
