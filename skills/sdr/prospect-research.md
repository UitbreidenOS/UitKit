---
name: prospect-research
updated: 2026-06-13
---

# Prospect Research

## When to activate

When building a cold outreach sequence and you need to personalize the first touch with a specific individual — not when running list scraping, not for generic email templates. Trigger: you have a LinkedIn URL (or name + company) and 2–3 hours before the outreach deadline, and you want hooks that will clear the 3-C test (Credible, Complimentary, Connected).

## When NOT to use

- Do not use for personal hobbies, vacation photos, sports team affiliations, or family details — these feel creepy in B2B cold outreach and erode trust.
- Do not use if you only have a first name and generic title ("John at TechCorp") — insufficient signal.
- Do not use for list-level profiling (if you need to score 100 prospects in bulk, use a different tool).
- Do not use if your value prop is generic or unclear; prospect research only works when you can draw a clear bridge between their context and your specific offer.

## Instructions

### The 4-Source Prospect Research Stack

Every strong prospect dossier rests on four research buckets. Rank sources by recency and signal strength (recent actions = higher intent).

**1. LinkedIn Profile**
- Headline (reveals current role, seniority, department)
- Summary (self-positioning, priorities, language they use)
- Recent activity (posts, comments, shares — reveals what they care about right now)
- Endorsements (skill emphasis tells you what they want to be known for)
- Education (school pedigree, graduation year, degree type)
- Groups and memberships (professional communities, industry affiliations)

*What to extract:* Current pain points inferred from their stated focus. Language patterns (if they use "transformation" or "modernization," they care about change). Gaps between headline claim and actual content (if they say "innovative" but never post, there's a mismatch).

**2. Content Authored**
Search for: articles (Medium, company blog, LinkedIn articles), podcast appearances, conference talk recordings, YouTube videos, guest posts, comments on industry forums.

- Themes (What problems do they publicly care about? Scaling? Security? Retention?)
- Recency (A talk from 6 months ago is fresher than a blog post from 2 years ago.)
- Depth (A 20-minute podcast appearance reveals more than a 2-sentence comment.)

*What to extract:* Explicit problem statements they've articulated. Frameworks they champion. Audiences they address (if they speak at startup events, they may be venture-minded; if at enterprise conferences, they're aligned with scale). Tone and expertise level.

**3. Career Trajectory**
Assemble: all past employers (in reverse chronological order), tenure at each role, title progression, promotion velocity.

- Tenure per role (< 2 years = runner, > 4 years = settler; matters for receptiveness to change)
- Company trajectory (growth-stage startup → FAANG → scaleup tells a story)
- Title change velocity (if they moved from Manager → Director → VP in 5 years, they're ambitious)

*What to extract:* What priorities do they reveal through role choices? Scaling operations → process and efficiency matter. Joined a Series B startup → they bet on execution and founder vision. Stayed at one company 7+ years → loyalty, or risk-averse. Moved functions (engineering → product → founder) → broad thinking, or restlessness.

**4. Digital Footprint**
Search: Twitter/X account, personal blog, company website (for founder/executive), conference talk videos, GitHub (for technical roles), Reddit participation.

- Tweet frequency and themes (What do they engage with unprompted?)
- Blog topics and cadence (Writing every month ≠ writing once per year)
- Podcast guest appearance frequency (Are they building personal brand?)

*What to extract:* Authentic interests outside the corporate biography. Positions they hold strongly (watch for contrarian takes — these often reveal what they value). Audience size (10k followers vs. 10 followers changes the story).

---

### The Personalisation Paragraph Formula

A strong cold-outreach opening follows this three-part structure:

**[Hook from highest-value bucket] + [Bridge sentence connecting to your value prop] + [One specific open question]**

**Hook selection logic:**
1. Rank the 4 buckets by recency (most recent content first) and emotional signal (explicit problem statement > inferred pain > generic biography).
2. Choose a hook from the highest-ranked bucket that satisfies the 3-C test (see below).
3. If no clear hook emerges from one bucket, blend two (e.g., LinkedIn post + career trajectory).

**Example structure:**
> "I noticed you published [specific insight from recent talk/post] on [topic] — the [specific claim they made] resonates with how [parallel problem exists in your domain]. Quick question: when you think about [open question that reveals their priority], how do you currently [decision they need to make]?"

**The 3-C Test for a Good Hook**

Every hook must pass all three criteria:

- **Credible:** Based on something they said, posted, or did. Not inferred; not guessed. ("You spoke at SaaStr about" ✓ | "I imagine you care about cost savings" ✗)
- **Complimentary:** Positions them well without being saccharine. ("Your approach to retention is thoughtful" ✓ | "You're brilliant" ✗)
- **Connected:** Bridges naturally to your value prop in one sentence. Not: "You care about X, I sell Y" (broken bridge). Yes: "You care about X; teams using Y solve X, and you likely face Z as a result." (Clear bridge.)

---

### The Quick Research Prompt

When you have 15–30 minutes and need a ranked list of hooks fast, use this Claude prompt:

```
You are a B2B outreach researcher. Analyze the prospect and generate 3 personalisation hooks ranked by strength.

PROSPECT DATA:
LinkedIn URL: [URL or full profile summary]
Company: [Company name]
Role: [Title]
Industry: [Industry]

YOUR VALUE PROP:
[One sentence: what you do, who you help, what problem you solve]

TASK:
1. Research the prospect using the 4 sources: LinkedIn profile (headline, summary, recent activity, endorsements), content authored (articles, podcasts, conference talks), career trajectory (role progression, company history), digital footprint (Twitter, blog, public talks).
2. For each hook, state which bucket it comes from and explain the 3-C score (Credible, Complimentary, Connected).
3. Rank by strength: Hook 1 (strongest) to Hook 3 (useful if you can't use the top two).
4. For the strongest hook, draft a one-sentence opening.

OUTPUT FORMAT:
Hook 1: [Hook text] (Source: [Bucket])
- Credible: [Why it's factual]
- Complimentary: [How it positions them well]
- Connected: [How it bridges to your value prop]
- Opening line: "[Actual outreach sentence]"

Hook 2: ...
Hook 3: ...
```

---

### The One-Page Prospect Brief Template

After research, distill findings into a brief that your outreach team uses. Format:

**PROSPECT BRIEF**

**Name:** [Full name]  
**Title:** [Current role + company]  
**Tenure:** [How long in current role]  
**Research date:** [Date]

**BACKGROUND (2–3 sentences)**
[Role, company, industry. Why did we identify them? What's their context?]

**KEY INSIGHT (1–2 sentences)**
[The single strongest finding from the 4-source stack. What did you learn that others might miss?]

**PERSONALISATION HOOK**
[The hook. Which bucket did it come from? How does it pass the 3-C test?]

**RECOMMENDED OPENING LINE**
[Full first sentence of the email.]

**RESEARCH SOURCES**
- LinkedIn profile: [URL]
- Recent content: [Article/talk title + URL]
- [Any other key source]

---

### Decision Tree: Should You Send to This Prospect?

Before committing time to personalized outreach, use this gate:

1. **Can you articulate their pain point in their own words?** (From their recent content, career moves, or public statements.)  
   - NO → insufficient signal. Move on. (Or invest 30 more minutes in research.)
   - YES → proceed to 2.

2. **Does your value prop solve a problem they publicly stated or implied?**  
   - NO → wrong prospect, wrong timing, or weak fit.
   - YES → proceed to 3.

3. **Can you craft a hook that passes the 3-C test without guessing?**  
   - NO → you have insufficient data. (Move on; not every prospect is researchable.)
   - YES → proceed to 4.

4. **Is this prospect's buyer type aligned with your ICP?** (Check: company size, growth stage, industry, role seniority.)  
   - NO → wrong persona. (Or right prospect, wrong persona to contact.)
   - YES → write the brief and queue for outreach.

---

### Benchmarks

**Research time allocation:**
- Quick research (one-source hook, familiar industry): 10–15 minutes
- Standard research (2–3 sources, moderate depth): 20–30 minutes
- Deep research (all 4 sources, executive tier, hot prospect): 40–60 minutes

**Hook quality thresholds:**
- Weak: Hook is generic, inferred, or disconnected. (Skip or rewrite.)
- Strong: Hook is credible, complimentary, and bridges to value prop. (Send.)
- Exceptional: Hook references specific, recent content and creates genuine intrigue. (Top priority.)

**Response rate correlation (B2B SaaS benchmark):**
- Weak personalization: 2–4% response rate
- Strong personalization (3-C test): 8–15% response rate
- Exceptional personalization + clear value prop: 15–25% response rate

**Recency heuristic:**
- Content from the last 3 months: high signal
- Content from 3–12 months ago: medium signal
- Content from 12+ months ago: low signal (only use if no fresher hook exists)

---

## Example

### Scenario: SaaS Sales Infrastructure Company

**Company:** Apollo (sales intelligence platform)  
**ICP:** VP of Sales at mid-market B2B SaaS (20–500M ARR)  
**Target prospect:** Alex Chen, VP of Sales at Notion (hypothetical)

**INPUT: LinkedIn URL + Value Prop**

LinkedIn profile summary:
- Headline: "VP of Sales at Notion | Building go-to-market for a 10M+ user product"
- Recent posts: Thread on "Why outbound doesn't scale without data truth" (posted 6 days ago, 2.3k likes)
- Career: Sales Development Manager at Salesforce (2 years) → VP of Sales at 6sense (4 years) → VP of Sales at Notion (1 year)
- Speaking: SaaStr Annual 2024 talk: "How we built a $10M net new ARR motion without outbound hell"

Value prop: "Apollo gives sales leaders real-time visibility into prospect intent and engagement, reducing prospecting time by 40%."

**RESEARCH OUTPUT**

**Hook 1: LinkedIn Post (Source: LinkedIn profile + recent activity)**
> "Your recent post on 'outbound not scaling without data truth' nails the core problem we see with teams winging it on prospect research. Given your scale at Notion, I'd imagine that visibility gap compounds — you're likely managing multiple GTM motions with limited signal on which paths are actually working."

- Credible: Quote is from their real post, 6 days old.
- Complimentary: Positions them as a thoughtful GTM leader.
- Connected: The "visibility gap" is the exact problem Apollo solves.
- Opening line: "I saw your recent post on outbound scaling, and it seems like you're thinking deeply about the data layer that separates successful prospecting from noise."

**Hook 2: Career Trajectory (Source: Career trajectory + speaking)**
> "You scaled sales motions at 6sense (early-stage intent data company) and now you're applying that at Notion across a massive user base. That's a rare position — you know what intent-driven selling looks like, and you're managing the challenges of scaling it. I'd bet the biggest friction point now is picking which prospects matter most across your 10M+ user base."

- Credible: Public career history (6sense → Notion).
- Complimentary: Acknowledges their rare expertise and current challenge.
- Connected: Apollo solves the "which prospects matter most" problem.
- Opening line: "Your background at 6sense is notable — you've already lived the intent-first sales motion. At Notion's scale, I'd imagine the bottleneck shifted from 'Do we have signal?' to 'Which signal actually predicts a close?'"

**Hook 3: Speaking Activity (Source: SaaStr talk)**
> "Your SaaStr talk on building $10M ARR without 'outbound hell' implies you've systematized prospecting. The phrasing suggests you've had to cut through chaos to find what works. With that level of rigor, you probably demand better data inputs than most teams — and you likely wish your stack gave you that reliably."

- Credible: Public SaaStr talk title (verifiable).
- Complimentary: Positions them as systematized and rigorous.
- Connected: Apollo is a data-input tool for exactly that rigor.
- Opening line: "Your SaaStr talk on building ARR without outbound hell stood out because you clearly don't tolerate random prospecting. I'd be curious: in your current stack, where do you find yourself making gut calls when you'd prefer data?"

---

**PROSPECT BRIEF**

**Name:** Alex Chen  
**Title:** VP of Sales, Notion  
**Tenure:** 1 year (in current role)  
**Research date:** 2026-06-02

**BACKGROUND**
Alex is scaling Notion's go-to-market function after 4 years at 6sense (an intent-data startup), where he built sales processes from the ground up. He's now managing multiple GTM motions across a 10M+ user base—an unusually large and complex sales challenge.

**KEY INSIGHT**
He has lived the intent-driven sales motion and publicly stated that "outbound doesn't scale without data truth." This indicates he's personally experienced the gap between aspirational and actual sales data. His recent post had high engagement (2.3k likes), meaning the broader market resonates with this frustration. His move from a data-startup to a 10M-user product suggests he's moving toward scale and execution—likely feeling the limits of intent data at volume.

**PERSONALISATION HOOK**
"Your recent post on outbound scaling and data truth hits a nerve—most sales leaders realize they're flying blind, but you've articulated why. At Notion's scale, I imagine that visibility gap compounds across motions. Apollo gives you the insight layer you're probably building manually right now."

(Source: LinkedIn post. Passes 3-C: Credible [real post, 6 days old], Complimentary [positions him as a thoughtful leader], Connected [Apollo = visibility tool].)

**RECOMMENDED OPENING LINE**
"I saw your recent post on why outbound doesn't scale without data truth—and it's clear you're thinking deeply about this at Notion's scale. Quick question: when you're managing multiple GTM motions with limited signal on which are actually working, what's your current system for separating signal from noise?"

**RESEARCH SOURCES**
- LinkedIn profile: linkedin.com/in/alexchen
- Recent post: "Why outbound doesn't scale without data truth" (6 days ago)
- SaaStr talk: "How we built a $10M net new ARR motion without outbound hell" (2024)
- Career history: Salesforce → 6sense → Notion

---

### Quick Wins: Checklists

**Before you research, confirm these:**
- [ ] You have a LinkedIn URL or full name + company
- [ ] You have a clear value prop you can state in one sentence
- [ ] The prospect's role matches your ICP (don't waste time on wrong personas)
- [ ] You have 15+ minutes to spend on this prospect

**After research, before outreach:**
- [ ] Hook passes 3-C test (Credible, Complimentary, Connected)
- [ ] Opening line is specific, not generic
- [ ] You can articulate their pain point in their own words
- [ ] You didn't pull from personal hobbies, vacation photos, or family details
- [ ] Subject line or opening doesn't sound like "I've been stalking you"

