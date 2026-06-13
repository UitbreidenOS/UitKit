---
name: candidate-sourcer
description: "Passive candidate sourcing: LinkedIn search strings, Boolean search, outreach message sequences, and pipeline tracking for recruiters"
updated: 2026-06-13
---

# Candidate Sourcer Skill

## When to activate
- You have an open role with no applicants yet and need to proactively source
- Your inbound applicant quality is low and you need to find passive candidates
- You need a Boolean search string to find specific profiles on LinkedIn Recruiter or Google
- Writing the first outreach message for a passive candidate who isn't actively looking
- Building a sourcing pipeline — you need to find 50+ profiles to work from
- Tracking a sourcing campaign across multiple roles simultaneously

## When NOT to use
- Writing the job description — use `/job-description` for that
- Screening or interviewing candidates — use `/interview-scorecard`
- Compensation offers — use `/comp-benchmarker`
- Internal mobility or rehire situations — different conversation and process

## Instructions

### LinkedIn search string builder

```
Build a LinkedIn search string to find [role] candidates.

Role: [Job title]
Must-have qualifications:
- [Skill or experience 1]
- [Skill or experience 2]
- [Credential, tool, or industry experience]

Nice-to-have:
- [Differentiator 1]
- [Differentiator 2]

Target companies (where they might work now or previously):
- Direct competitors: [list]
- Adjacent companies with transferable skills: [list]
- Industries that produce strong backgrounds for this role: [list]

Exclude:
- [Companies you don't want to hire from — e.g., your own company, companies known for bad practices]
- [Locations to exclude]

Seniority / experience range:
- Years of experience: [X-Y years]
- Level: [IC / Manager / Director / VP]

Produce:

## LinkedIn Recruiter Boolean String
(Use in LinkedIn Recruiter Search → Keywords field)

("job title variant 1" OR "job title variant 2" OR "job title variant 3")
AND ("skill 1" OR "skill 2")
AND ("company name" OR "company name 2")
NOT ("excluded term")

## Google X-Ray Search
(For finding LinkedIn profiles without Recruiter access)
site:linkedin.com/in "[job title]" "[skill]" "[location]" -intitle:"profiles" -inurl:"dir/"

## Boolean logic explained
Use AND to require both terms
Use OR to find either term (broader)
Use NOT to exclude terms
Use quotes for exact phrases
Use parentheses to group logic

## Refinements
If search returns too many results: add AND with another required skill
If too few results: replace AND with OR between key terms, or remove company filter
Target: 50-200 strong profiles for active sourcing campaign — not thousands

## Search variations to run in parallel
Variation 1: [title focus]
Variation 2: [skills focus]
Variation 3: [company/background focus]
```

### Outreach message templates

```
Write outreach messages for passive candidate sourcing.

Role: [Job title]
Company: [Your company name]
What makes this role compelling: [3 specific things — not generic]
Candidate background: [describe who you're sending this to — their likely background and current role]
Channel: [LinkedIn InMail / Email / mutual connection intro]
Tone: [professional / conversational — match to role seniority]

Message framework:

STRUCTURE (in order):
1. Pattern interrupt — don't start with "Hi, my name is [Recruiter] from [Company]"
2. Relevance signal — why them, specifically
3. Role hook — 1 specific compelling thing about the role
4. Light ask — low-pressure next step, not "Are you interested in applying?"

---

TEMPLATE A — LinkedIn InMail (under 150 words — get straight to it)

Subject: [Role] at [Company] — saw your work at [their company]

Hi [Name],

[Specific observation about their background — "Your experience leading [X] at [Company] caught my attention because..."] — not "I came across your profile."

We're building [one compelling sentence about what the company is doing — stage, mission, momentum].

The [role] I'm working on would own [specific impactful thing], and given your background in [specific match], I think it's worth a conversation.

Would a 20-minute call this week make sense to see if there's a fit worth exploring?

[Your name]

---

TEMPLATE B — Warm intro through mutual connection (email)

Subject: [Mutual contact] suggested I reach out

Hi [Name],

[Mutual contact] mentioned you might be open to hearing about what we're building at [Company] — I hope it's alright I reach out directly.

[One sentence on the company — be specific, not boilerplate.]

The [role] I'm trying to fill is [specific pitch — what they'd own, who they'd work with, why now].

I know these conversations work best when there's a real fit on both sides, so I'd rather talk before sending anything formal. Would 20 minutes this week work?

[Your name]

---

TEMPLATE C — Follow-up (if no response to first message after 7 days)

Hi [Name],

I know you're not staring at InMail all day — just wanted to bump this once in case it was buried.

If the timing isn't right, no problem at all. If you're curious about what we're building, I'm happy to share more context first before any kind of formal conversation.

[Your name]

---

Rules:
- Personalise the first line — if you can't say something specific about them, don't send it
- One clear ask at the end — 20-minute call, not "let me know your thoughts"
- Never attach a job description in the first message — it signals form letter
- Follow up once — after that, move on

Generate outreach messages for [role] tailored to the [candidate type] I'm targeting.
```

### Sourcing pipeline tracker

```
Build a sourcing pipeline tracker for [role].

Role: [Job title]
Sourcing goal: [X qualified candidates in pipeline to produce 1 hire]
Target first hire by: [date]

Pipeline math (rule of thumb for recruiting conversion rates):
- Profiles identified → Outreach sent: 30-50% (filter for quality before outreach)
- Outreach sent → Responded: 15-30% (passive candidates have low response rates)
- Responded → Interested in call: 50-70% (of those who respond, most are curious)
- Phone screen passed → Advance to panel: 40-60%
- Panel → Offer: 30-50%
- Offer → Accept: 70-90%

For 1 hire, work backwards:
Target hire date in [X weeks]
Offers to extend: ~1.5 (assume 1 decline)
Panel passes needed: ~3-4
Phone screens: ~7-10
Interested responses: ~12-15
Outreach sent: ~50-80
Profiles identified and qualified: ~100-150

Pipeline stage tracker (build in Notion, Airtable, or Google Sheets):

| Candidate | Company | Role | Source | Stage | Last Touch | Next Action | Notes |
|---|---|---|---|---|---|---|---|
| [Name] | [Company] | [Title] | [LinkedIn / Referral / Job board] | [Identified / Outreach sent / Responded / Screen / Panel / Offer / Declined / Hired] | [date] | [action + date] | [notes] |

Stage definitions:
1. Identified — found on LinkedIn, haven't contacted
2. Outreach sent — first message sent, awaiting reply
3. Responded — they replied, positive or asking for more info
4. Phone screen — scheduled or completed
5. Advanced — moving to panel interview
6. Panel — in interview process
7. Offer — offer extended
8. Hired / Declined / Paused

Weekly sourcing cadence:
- Monday: review pipeline, advance or close out stale candidates
- Tuesday-Thursday: new outreach — batch send 15-20 messages
- Friday: follow up on non-responders (1 follow-up only, after 7 days)

Produce a sourcing plan with timeline, pipeline targets, and outreach schedule.
```

### Candidate research brief

```
Research this candidate before I reach out or interview them.

Candidate: [Name]
Current company: [Company]
Current role: [Title]
LinkedIn: [URL or profile details]

Produce a candidate brief:

BACKGROUND SUMMARY
- Current role and tenure: [X years at Company — is this a typical tenure or unusually short/long?]
- Career trajectory: [is this person moving up, sideways, or down in seniority?]
- Industry experience: [which industries have they worked in?]
- Company types: [startup / scale-up / enterprise / agency — which environments are they native to?]
- Skills and tools: [what technical or domain skills are visible from profile?]

ROLE FIT SIGNALS
- Relevant experience for [your open role]: [strong / partial / gap]
- Gap to fill in interview: [what can't you tell from the profile?]
- Potential concern: [anything in the trajectory that needs explaining?]

PERSONALISATION HOOKS FOR OUTREACH
- Something specific to reference: [recent post / company milestone / career move / shared connection]
- What might make them receptive right now: [their company just laid off / they were just promoted — new role = likely not moving soon]
- What they probably care about: [career advancement / technical challenge / mission / compensation — infer from trajectory]

INTELLIGENCE FOR INTERVIEW
- What to probe on: [specific transitions or gaps in the profile]
- Likely motivations: [why might they be open to moving?]
- Likely competing offers: [who else might be hiring similar profiles right now?]

Produce the candidate brief for [name].
```

## Example

**User:** I'm sourcing for a Growth Marketing Manager at my B2B SaaS company in Amsterdam. They need to have experience with paid acquisition (Google/Meta), some SEO, and ideally come from a SaaS background. Help me build my search and outreach.

**Claude's sourcing plan:**

**LinkedIn Boolean Search:**

```
("Growth Marketing Manager" OR "Performance Marketing Manager" OR "Digital Marketing Manager" OR "Growth Manager")
AND ("Google Ads" OR "paid acquisition" OR "PPC" OR "SEM")
AND ("SaaS" OR "B2B" OR "software")
AND (Amsterdam OR Netherlands OR "The Netherlands")
```

**Google X-Ray (no LinkedIn Recruiter needed):**
```
site:linkedin.com/in "growth marketing" ("google ads" OR "paid acquisition") "saas" "amsterdam"
```

**Target companies to search within:**
Companies in Amsterdam with SaaS business models where growth marketers commonly come from: Booking.com (performance marketing talent), Adyen, MessageBird (now Bird), Sendcloud, Picnic, Mews — also look at Amsterdam-based agencies that do paid for SaaS clients.

**Outreach message — LinkedIn InMail:**

Subject: Growth Marketing role in Amsterdam — your SaaS background stood out

Hi [Name],

Your time at [their company] running [specific channel] caught my eye — particularly the [specific thing they've done if visible on profile].

We're scaling growth at [your company] — [one-sentence company pitch: "a B2B SaaS tool used by 2,000+ logistics companies across Europe"] — and I'm looking for a Growth Marketing Manager to own our paid acquisition and SEO motion end to end. Real ownership, not execution for an agency.

Would a 20-minute call make sense to see if there's something here?

[Name]

**Pipeline target:**
- Identify 80-100 profiles this week
- Send 30-40 outreach messages (filter for quality before sending)
- Expect 6-10 responses in 2 weeks
- Phone screen 5-7, advance 2-3 to panel
- Hire 1 in 6-8 weeks from start of active sourcing

---
