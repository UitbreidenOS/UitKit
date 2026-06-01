# Claude for Real Estate Agents

Everything a residential real estate agent needs to run AI-augmented listing management, buyer work, CMA presentations, outreach, and client communications in Claude Code.

---

## Who this is for

You are a real estate agent — solo or on a team — who earns by converting relationships into closed transactions. Your time is eaten by writing listing descriptions, researching comps, drafting offer letters, following up on leads, and keeping 20 active clients informed. Claude Code eliminates the repetitive writing work so you can be in front of clients instead of behind a keyboard.

**Before Claude Code:** 45 minutes to write a CMA narrative. 20 minutes per listing description. 15 minutes per showing follow-up. Hours of market research per week.

**After:** CMA narrative in 3 minutes. Listing description in 90 seconds. Showing follow-up in 60 seconds. Weekly market update in 5 minutes.

---

## 30-second install

```bash
# Install all real estate skills
npx claudient add skill small-business/real-estate-listing
npx claudient add skill small-business/cma-report
npx claudient add skill small-business/buyer-offer-writer
npx claudient add skill small-business/cold-outreach
npx claudient add skill small-business/customer-inquiry

# Install the real estate specialist agent
npx claudient add agent roles/real-estate-specialist
```

---

## Your Claude Code real estate stack

### Skills (slash commands)

| Skill | What it does | When to use |
|---|---|---|
| `/real-estate-listing` | MLS descriptions, showing follow-ups, lead nurture sequences, social posts — Fair Housing compliant | New listing, post-showing, social content |
| `/cma-report` | Full CMA narrative: comps selection, adjustment analysis, pricing tiers, seller presentation | Every listing appointment |
| `/buyer-offer-writer` | Personal cover letters and agent-to-agent letters for offers — emotional and competitive scenarios | Any offer submission |
| `/cold-outreach` | Farming letters, FSBO outreach, expired outreach, sphere-of-influence touches | Prospecting campaigns |
| `/customer-inquiry` | Respond to inbound buyer/seller inquiries — qualify, nurture, convert | New leads from Zillow, Realtor.com, referrals |

### Agent

| Agent | Model | When to spawn |
|---|---|---|
| `real-estate-specialist` | Sonnet | Full listing prep sessions, buyer consultation prep, market research |

---

## Daily workflow

### Morning (20-30 minutes)

**1. Lead follow-up — new inquiries from overnight**
```
/customer-inquiry

I have [X] new leads from [Zillow / referral / open house]. Here are the details:

Lead 1:
Name: [name]
Source: [source]
Message: [what they said]
Property they inquired about: [address or price range]
Timeline: [what you know]

Draft responses for each. Warm, professional, move toward a phone call or showing.
```

**2. Showing follow-ups — yesterday's showings**
```
/real-estate-listing

Post-showing follow-up for:
- Buyer name: [name]
- Property: [address]
- What they liked: [notes from showing]
- Concerns raised: [notes]
- Their timeline: [X months]
- Competition: [other properties they've seen]

Draft a personalized follow-up email. Reference something specific from the showing. Soft next step.
```

---

### Listing appointment prep (60-90 minutes ahead)

**3. CMA report — full seller presentation**
```
/cma-report

Subject property: [beds/baths, sq ft, neighborhood, year built, updates]

Comparable sales:
Comp 1: [details]
Comp 2: [details]
Comp 3: [details]

Active competition:
Active 1: [details]
Active 2: [details]

Market context: [absorption rate, avg DOM, list-to-sale ratio]
Seller's timeline: [X weeks]
My recommended price range: $[X] – $[X]

Generate the full CMA report and seller presentation narrative.
```

**4. Listing marketing — MLS copy and social**
```
/real-estate-listing

New listing — write MLS description and social media posts.

Property: [beds/baths, sq ft, key features, neighborhood]
Top 5 features: [list]
Target buyer lifestyle: [describe]
MLS character limit: [X words]
```

---

### Offer situations

**5. Buyer offer letter — competitive scenario**
```
/buyer-offer-writer

Buyer: [first names]
Offer: $[X] on $[X] list
Seller profile: [what you know — long-time owner, cares about legacy, etc.]
What buyers love about the property: [specific features]
Buyer strengths: [pre-approval, down payment, contingency waivers]
Competitive context: [multiple offers expected]

Generate personal cover letter (Fair Housing compliant) + agent cover letter.
```

---

### Weekly tasks (Friday — 30 minutes)

**6. Market update for active clients**
```
/cold-outreach

Write a weekly market update email for my active buyer clients.

Market stats this week:
- New listings in their price range: [X]
- Price reductions: [X]
- Sold this week: [X]
- Average sale price: $[X]
- Average DOM: [X] days
- Interest rate update: [X]%

My clients' search criteria: [price range, area, property type]
Tone: Informative, expert, not alarmist. Position me as their trusted advisor.
```

**7. Sphere of influence touch — monthly farming**
```
/cold-outreach

Monthly farming email to my sphere of influence.

Topic this month: [market update / home maintenance tip / local event / listing announcement]
My farm area: [neighborhood]
Goal: Stay top of mind, not sell.

Draft a 150-word email that sounds personal, not like a newsletter. Include one useful fact and one soft CTA (coffee catch-up, home value check, referral ask).
```

---

## 30-day ramp plan (new agents or new market)

### Week 1 — Setup and market knowledge
- Install all real estate skills via `npx claudient add skill small-business/[name]`
- Run `/cma-report` on 5 recent sales in your farm area to calibrate your comp-reading
- Use `/real-estate-listing` to rewrite 3 of your past listing descriptions — compare quality
- Map your sphere of influence: 50 contacts → run `/cold-outreach` on your first touch

### Week 2 — Listing and buyer workflows
- Run a full listing appointment simulation with `/cma-report` on a neighbor's home (exercise)
- Write your first 10 showing follow-ups with `/real-estate-listing` — set a timer: target <3 min each
- Build a 4-touch buyer nurture sequence with `/real-estate-listing` for a 6-month buyer

### Week 3 — Prospecting
- Launch your first FSBO outreach campaign with `/cold-outreach` — 10 FSBOs in your area
- Expired outreach: identify 5 recently expired listings, draft personalized outreach
- Run a geographic farm: 100-home area, monthly touch, track reply rate

### Week 4 — Competitive situations
- Practice `/buyer-offer-writer` on your next buyer's offer before submission
- Run the escalation clause prompt — understand the mechanics before you need them in the moment
- Track your metrics: showings per listing, follow-up response rate, CMA appointment conversion

---

## Tool integrations

### Your CRM

```json
// Add to ~/.claude/settings.json for CRM-connected workflow
// Most agents use Follow Up Boss, LionDesk, or KVCore
{
  "mcpServers": {
    "followupboss": {
      "command": "npx",
      "args": ["-y", "@followupboss/mcp-server"],
      "env": {
        "FUB_API_KEY": "your-key-here"
      }
    }
  }
}
```

With CRM connected, Claude can:
- Pull up a contact's full history before drafting follow-up
- Log interactions after each client communication
- Flag contacts who haven't been touched in 30+ days

### MLS data
Export your comp data as CSV or paste directly from your MLS → Claude reads it and formats for CMA analysis. No special integration needed.

### DocuSign / DotLoop
Claude drafts the language and talking points — you paste into your transaction management platform. Future: webhook triggers to auto-draft when a form is opened.

### Canva / marketing materials
Use Claude to generate the copy → paste into Canva templates for listing flyers, social posts, and farming mailers. Claude matches character limits when you specify them.

---

## Metrics to track

| Metric | Baseline (manual) | Target with Claude |
|---|---|---|
| Time per listing description | 45 min | 5 min |
| Time per CMA narrative | 60 min | 10 min |
| Time per showing follow-up | 15 min | 3 min |
| Sphere touch frequency | Monthly (if you remember) | Weekly (automated drafts) |
| Listing appointment conversion | Track from first CMA | Benchmark after 10 CMAs |
| Offer acceptance rate (buyer side) | Track | Track letter vs. no-letter |

---

## Common mistakes (and how Claude Code prevents them)

**Mistake 1: Fair Housing violations in listing copy**
Claude flags and removes protected class language automatically. You still do final review — Claude is a safeguard, not a guarantee.

**Mistake 2: Generic showing follow-ups that go ignored**
`/real-estate-listing` requires you to provide specific notes from the showing. No notes = no email. Forces you to listen during showings.

**Mistake 3: Presenting a CMA without a narrative**
Sellers don't remember data — they remember stories. `/cma-report` generates the narrative you read aloud. It's the difference between a price and a conversation.

**Mistake 4: Over-personalising a buyer letter and triggering Fair Housing liability**
`/buyer-offer-writer` reviews for protected class language before you submit.

**Mistake 5: Letting sphere contacts go cold**
Set a weekly reminder → `/cold-outreach` → monthly sphere touch in 5 minutes.

---

## Resources

- [Getting started with Claude Code](getting-started.md)
- [Real estate listing skill](../skills/small-business/real-estate-listing.md)
- [CMA report skill](../skills/small-business/cma-report.md)
- [Buyer offer writer skill](../skills/small-business/buyer-offer-writer.md)
- [Cold outreach skill](../skills/small-business/cold-outreach.md)

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
