---
name: "cold-start-interview"
description: "- First time using any legal skill for a new organization"
---

# Cold-Start Interview — Legal Plugin Setup

## When to activate

- First time using any legal skill for a new organization
- Legal plugin output contains `[PLACEHOLDER]` markers
- Output is too generic and not practice-specific
- Onboarding a new legal team to Claude Code

**Why this matters:** The cold-start interview is the most common leverage point for legal skill quality. Generic output is almost always traceable to a skipped or incomplete interview. A 10–15 minute interview transforms every downstream skill from generic to practice-specific.

## When NOT to use

- Interview already completed and an organization profile exists — check `~/.claude/plugins/config/legal/company-profile.md` before running again
- Quick one-off legal research tasks where personalization is not needed and no playbook decisions will be made

## Instructions

The interview gathers four categories of information and writes them to an organization profile. Work through each category sequentially — do not skip sections.

---

**1. Practice context (who you are)**

Collect:
- Organization name and entity type: law firm / in-house legal team / standalone legal department
- Practice areas handled (commercial contracts, employment, IP, M&A, data privacy, etc.)
- Jurisdiction(s) where you practice — specify primary governing law
- Typical deal size range (e.g., $50K–$2M vendor agreements)
- Risk posture: aggressive / market / conservative

---

**2. Team and escalation structure**

Collect:
- Team size and roles (paralegal → associate → counsel → GC / senior partner)
- Dollar authority limits per role — what each role can approve without escalating
- Escalation contacts: name and Slack handle or email per authority tier
- Preferred escalation channel: Slack / email / standing meeting

---

**3. Playbook positions (per contract type)**

For each contract type the team handles, document:

| Field | Collect |
|-------|---------|
| Side | Sales-side or purchasing-side |
| Limitation of liability | Preferred cap (e.g., 1× fees), acceptable fallbacks, never-accept list |
| Indemnification | Standard position, acceptable fallbacks, never-accept |
| Governing law and venue | Preferred, acceptable, never-accept |
| Data protection | DPA requirements, preferred standard clauses |
| Deal-breaker | The one clause that immediately requires escalation for this contract type |

Typical contract types to cover: SaaS vendor agreement, NDA, employment agreement, services agreement, data processing agreement, partnership agreement.

---

**4. Systems and integrations**

Collect:
- CLM system in use (if any) and integration status with Claude Code
- Contract storage location (shared drive, CLM, email archive)
- Other tools in the legal stack that Claude Code may need to interact with

---

**Output:** Write a profile to `~/.claude/plugins/config/legal/company-profile.md` (shared across all legal skills) and practice-specific sub-profiles per skill type in the same directory.

After the profile is written, confirm which legal skills are now active and how they will use the profile. All legal skills read this profile before processing any document.

**Safety:** Profile is stored locally only. Never send profile contents outside the local system.

## Example

**Input:** "Walk me through setting up the cold-start interview for our in-house legal team at a 200-person SaaS company. We handle mostly SaaS vendor agreements, NDAs, and employment matters. We're purchasing-side and prefer conservative positions."

**Expected behavior:**

The skill conducts the four-category interview as a structured conversation, collecting answers to each field. At the end it writes:

- `~/.claude/plugins/config/legal/company-profile.md` — organization identity, team structure, escalation contacts
- `~/.claude/plugins/config/legal/playbook-saas-vendor.md` — positions for SaaS vendor agreements
- `~/.claude/plugins/config/legal/playbook-nda.md` — positions for NDAs
- `~/.claude/plugins/config/legal/playbook-employment.md` — positions for employment matters

Then confirms: "Profile complete. Contract Reviewer, Escalation Flagger, and Redline Negotiator skills will now use this profile for all reviews."

---
