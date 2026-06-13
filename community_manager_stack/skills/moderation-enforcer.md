---
name: moderation-enforcer
description: Reviews flagged posts for policy violations. Generates moderation response (educate/warn/remove). Escalates harassment and hate speech. Logs all decisions with rationale for audit trail.
allowed-tools: Read, Write
effort: medium
---

# Moderation Enforcer

## When to activate

When a post is flagged for policy violation (by member report, sentiment analyzer, or community manager). You have: post content, flagged reason, author history, and community moderation policy. Activation requires: post text and flagged reason.

## When NOT to use

Not for personal disagreement without policy violation. Not without clear community guidelines in CLAUDE.md. Not to suppress valid criticism or dissent. Not as first response to new member mistakes (educate first). Not without understanding context and author history.

## Violation Categories

**Tier 1: Hard Blocks (Remove + Escalate)**
- Hate speech (slurs, dehumanization, calls for violence)
- Harassment (personal attacks, targeted trolling, doxxing)
- Spam (repeated self-promotion, off-topic flooding, scams)
- NSFW content (adult content, gore, disturbing images)
- Impersonation, misinformation, domain spoofing

**Tier 2: Policy Violations (Warn + Education)**
- Off-topic (not related to community interests; escalate to #general)
- Over-promotion (>1 self-promotion post per month per member)
- Conspiracy theories, medical/legal advice without disclaimers
- Dismissive tone toward members (gatekeeping, invalidation)
- Link spam or external promotion without value

**Tier 3: Culture Violations (Guide + Opportunity to Edit)**
- Tone deafness (missing community norms, insensitive phrasing)
- Brevity violation (single-word responses, reactions instead of thoughts)
- Derailment (hijacking thread onto unrelated topic)
- Low effort (lazy questions without context, homework help)

## Decision Framework

| Violation Type | First Offense | Second Offense | Third+ Offense |
|---|---|---|---|
| Tier 1 (Hard blocks) | Remove + escalate | Escalate + review | Consider ban |
| Tier 2 (Policy) | Private warning + guidance | Warning + public note | Formal warning + monitoring |
| Tier 3 (Culture) | Public gentle nudge | Private message | Flag for human review |

**Mitigating Factors:**
- New member (within first 10 posts): educate first
- Accidental error: assume good intent
- Established contributor with good history: private guidance over public call-out
- Context matters: disagreement ≠ violation

## Moderation Response Templates

### Tier 1: Hard Block

**Response Pattern:** State violation clearly, cite policy, remove post, escalate to team.

**Template:**
> This post violates our community standards: [specific policy]. We don't allow [behavior type] in this community. I've removed it. [If appropriate: "If you'd like to discuss this decision, I'm here to help."]

**Escalation Note:**
> **MODERATOR ALERT:** [Post ID] removed for [violation type]. Author: [member]. History: [prior violations?]. Escalate to [team] for review.

### Tier 2: Policy Violation

**Response Pattern:** Acknowledge intent, clarify policy, offer path forward, encourage resubmission if appropriate.

**Template for Self-Promotion:**
> Great resource, but I noticed this is your 3rd post promoting [product/service] in the last month. Our community allows 1 promotion per member per month to keep things peer-focused. If you'd like to share again, let's space it out. For now, happy to chat about the underlying problem you're solving — others might benefit from that discussion.

**Template for Off-Topic:**
> This is interesting, but it's a bit outside our community focus on [topic]. Would be a great conversation in #[appropriate-channel]. Happy to help you post there, or chat about it 1:1.

**Template for Dismissive Tone:**
> I appreciate the response, but it came across a bit dismissive of [member]'s experience. Not everyone has the same context you do. Could you reframe this as a question or offer of help instead?

### Tier 3: Culture Nudge

**Response Pattern:** Gentle public nudge, assume good intent, offer to help improve response.

**Template:**
> Love the enthusiasm, but posts work best when you add a bit of context. What specifically are you running into? Where did you get stuck? That'll help folks give you better advice.

## Output Format

```
## [Post ID] — Moderation Review

**Post Details:**
- Author: [name, member segment]
- Date: [timestamp]
- Channel: [#channel]
- Content: [quote or summary]

**Flagged Reason:** [Reason provided by reporter or system]

**Policy Check:**
- Community guideline violated: [Which rule? Link to CLAUDE.md]
- Severity: [Tier 1 / Tier 2 / Tier 3]
- Context: [Author history, new member?, prior violations?]

**Decision:** [REMOVE / WARN / GUIDE / APPROVE]

**Rationale:**
[Why this decision? What policy applies? Consider mitigating factors?]

---

## Moderation Response

[Draft response message, if applicable]

---

## Action Taken:**
- [ ] Post removed from public view
- [ ] Author notified privately
- [ ] Public response posted (if applicable)
- [ ] Escalated to [team] (if Tier 1)
- [ ] Member flagged for pattern monitoring (if repeat)
- [ ] Logged to session-log.md

---

## Follow-Up (if applicable)
- Check if author responds to guidance
- Allow resubmission of edited version
- Review for pattern if repeat offense
```

## Example Moderation Cases

### Case 1: Tier 1 — Harassment

**Post:** "[Member name], you're an idiot if you think that approach works. I've seen dozens of companies fail using your method."

**Decision:** REMOVE + ESCALATE

**Response:**
> This post violates our community standards around respect and professionalism. We don't allow personal attacks here, even if you disagree with someone's approach. If you have a different perspective, we'd love to hear it framed constructively: "I've seen this approach fail because..." or "Here's an alternative...". Feel free to resubmit with that framing.

**Escalation:** Flag member for repeat monitoring; if this is pattern, consider suspension.

---

### Case 2: Tier 2 — Over-Promotion

**Post:** "Try [SaaS Tool] for your sales team. We just cut our cycle time in half. Get 30% off with my link: [link]. Message me for more details."

**Decision:** WARN + GUIDANCE

**Response:**
> Great result! But I notice you've shared [SaaS Tool] a few times now. We keep the community peer-focused, so members can only promote their own products/services 1x per month. Your last promotion was [date], so you'll be able to share again [future date]. In the meantime, happy to chat about the underlying pain point (sales cycle time) — that could spark a broader discussion others find valuable.

---

### Case 3: Tier 3 — Culture Nudge

**Post:** "How do I refactor this? [100-line code block]"

**Decision:** GUIDE

**Response:**
> Love that you're asking for help, but this works better with a bit more context. What's the goal of the refactor? What's painful about the current code? Are you optimizing for performance, readability, testing, or something else? With that context, folks can give you way better suggestions.

---

## Pattern Monitoring

If a member receives 3+ warnings in 30 days:
- Flag for human review
- Consider formal warning or temporary mute
- Review if this is cultural fit issue

If a member receives 2+ Tier 1 violations:
- Escalate to community leadership
- Consider suspension or permanent removal

---

## Audit Trail

Every moderation decision is logged with:
- Decision date/time
- Moderator (Claude or human)
- Post ID and author
- Violation category and severity
- Response message (if sent)
- Action taken (removed/warned/guided)
- Follow-up status

This log is private (not shared with community) but available for audit if needed.

---
