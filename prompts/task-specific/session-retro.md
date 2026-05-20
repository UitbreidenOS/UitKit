# Prompt: Session Retrospective

Use at the end of a Claude Code session to capture learnings and turn them into durable improvements — updating CLAUDE.md, creating new rules, identifying skill opportunities, and writing ADRs.

## System prompt

```
You are doing a session retrospective. Review the conversation history from this session and categorise every learning into the right output format.

Categories to check (only include categories with actual content):

**1. CLAUDE.md UPDATES** — persistent project context that should survive this session
Format: "Add to CLAUDE.md: [exact text to add]"
Include: new commands discovered, architecture insights, conventions established, things Claude should always know

**2. NEW RULES** — coding standards or patterns worth formalising
Format: "Add to rules/[category].md: [rule statement]"
Include: conventions established, patterns that should always be followed, things that should never be done

**3. SKILL IDEAS** — repetitive workflows that deserve a /skill
Format: "Create skill: /[name] — [what it does in one sentence]"
Include: any workflow you typed out 3+ times, multi-step processes with a consistent pattern

**4. ADRs** — architectural decisions with meaningful trade-offs
Format: "Write ADR: [short title] — Decision: [what was decided]"
Include: technology choices, approach selections, anything future engineers should understand

**5. UNFIXED BUGS** — issues encountered that aren't resolved yet
Format: "Bug: [description] — Location: [file or area] — Impact: [who/what it affects]"

**6. NEXT SESSION TODO** — concrete tasks to start with next time
Format: "Next: [specific task]"

Be specific and actionable. Do not include vague observations. If a category has nothing worth capturing, omit it entirely.
```

## Usage

At the end of any significant session, run:

```
"Do a session retrospective on everything we worked on today. 
Categorise all learnings using the retrospective format."
```

## Automating with the session-retro hook

The `session-retro` hook creates a `.claude/retro-pending.md` file automatically at session end. At the start of the next session, paste the retrospective prompt and process the file.

## Acting on the output

For each output:

| Category | Action |
|---|---|
| CLAUDE.md update | Edit CLAUDE.md directly |
| New rule | Create or append to `rules/common/[topic].md` |
| Skill idea | Add to development backlog |
| ADR | Delegate to `adr-writer` agent |
| Bug | Add to `bugs.md` or create a GitHub issue |
| Next session | Start the next session with these tasks |

## Example output

```
## Session Retrospective — May 20, 2026

**CLAUDE.md UPDATES:**
- Add to CLAUDE.md: "Use `npx drizzle-kit generate` before any DB migration — always preview the migration SQL before running"
- Add to CLAUDE.md: "The payments service uses idempotency keys on all Stripe calls — pass `idempotencyKey: requestId` on every charge"

**NEW RULES:**
- Add to rules/common/error-handling.md: "All Stripe webhook handlers must verify the signature before processing — use `stripe.webhooks.constructEvent()`"

**SKILL IDEAS:**
- Create skill: /stripe-webhook — Set up a complete Stripe webhook handler with signature verification, event routing, and idempotency

**ADRS:**
- Write ADR: "Use Stripe Connect instead of direct charges for marketplace payments" — Decision: Stripe Connect chosen to handle multi-party payouts without building custom ledger logic

**UNFIXED BUGS:**
- Bug: Payment confirmation email sends twice on retry — Location: `src/webhooks/stripe.ts:87` — Impact: Some users receive duplicate confirmation emails

**NEXT SESSION:**
- Next: Fix the duplicate email bug in the payment webhook handler
- Next: Write the Stripe webhook skill based on the patterns established today
```
