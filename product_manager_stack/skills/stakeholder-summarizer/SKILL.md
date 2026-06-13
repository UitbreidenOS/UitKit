---
name: stakeholder-summarizer
description: Converts a PRD into one-page summaries tailored to each stakeholder group: engineering (what to build and why), sales (customer benefits and positioning), support (new features and edge cases), and executives (business case and ROI). Each summary is jargon-free and outcome-focused.
allowed-tools: Read, Write
effort: low
---

# Stakeholder Summarizer

## When to activate
2 weeks before launch. Use this to prepare stakeholder communication so no team is surprised on launch day.

## When NOT to use
Do not use before the PRD is final. Do not use for features with no cross-functional impact.

## Instructions

1. Read the final PRD.
2. Create four summaries, each tailored to its audience:

**Engineering:** What to build, why it matters, what changes, dependencies. Focus on technical requirements and effort.

**Sales:** What value customers get, how to position vs. competitors, which customer segments benefit most. Focus on customer outcome.

**Support:** New features, how to explain them to customers, common questions, edge cases. Focus on customer education.

**Executives:** Business case (revenue impact, customer retention, competitive advantage), timeline, and ROI. Focus on business outcome.

3. Each summary is one page max, written for its audience (no product jargon for sales, no business jargon for engineers).
4. Include a launch checklist specific to each function (eng: code review, sales: collateral ready, support: docs ready).

## Output Format

```
# Stakeholder Summaries — [Feature Name]

---

## For Engineering

**What we're building:** [1-sentence description]
**Why:** [Business outcome; who benefits; revenue impact]
**Timeline:** [Estimate; critical path]
**Key changes:** [APIs, schema, infrastructure]
**Dependencies:** [What eng needs from others]

**Launch checklist:**
- [ ] Code review complete
- [ ] Unit + integration tests passing
- [ ] Load test results confirm performance targets
- [ ] Feature flag enabled in staging
- [ ] Ready for gradual rollout

---

## For Sales

**Customer value:** [What customer gets in their own words]
**Who benefits most:** [Customer profile / segment]
**Positioning vs. competitors:** [How we're different]
**Key selling points:** [3 customer benefits]
**Launch date:** [When customers can start using]

**Launch checklist:**
- [ ] Customer-facing one-pager written
- [ ] Sales training call scheduled
- [ ] Sales collateral in CRM updated
- [ ] Top 10 at-risk accounts notified (expansion upsell angle)

---

## For Support

**What's new:** [Feature + capabilities]
**How to explain to customers:** [Customer benefit statement]
**Common questions:** [Q&A from beta users / design review]
**Edge cases customers might hit:** [Gotchas + workarounds]
**Self-service resources:** [Docs URL, video, FAQ]

**Launch checklist:**
- [ ] Help article written and published
- [ ] Support trained on [feature]
- [ ] FAQ updated in knowledge base
- [ ] Chatbot / help widget updated

---

## For Executives

**Business case:** [Revenue, retention, or competitive impact]
**ROI:** [Expected return; payback period if applicable]
**Risk:** [Downside if something goes wrong]
**Timeline:** [When shipping; time to impact]
**Key metrics to watch:** [Monitoring dashboard after launch]

**Launch checklist:**
- [ ] Board/stakeholder briefing complete
- [ ] Press release or customer announcement ready
- [ ] Success metrics dashboard live
- [ ] Post-launch review scheduled for [date]
```

---
