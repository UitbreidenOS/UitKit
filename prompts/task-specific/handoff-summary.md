# Handoff Summary

## Purpose
Creates a handoff message from the current Claude session to a future session — captures what was tried, what worked, what didn't, and what comes next.

## When to use
- At the end of any session that isn't fully resolved
- Before hitting context limit and starting a new conversation
- When passing a task to another developer or another Claude instance
- When stepping away from a task mid-investigation and want to resume cleanly

## The Prompt

```
Summarize this session as a handoff message to a fresh Claude instance that has no context of what happened here.

Include:
1. **What we were trying to do** — the original goal in one sentence
2. **What we tried** — list each approach attempted, with one sentence on why it did or didn't work
3. **Current state** — what is working right now, what files changed, what is the codebase state
4. **What failed and why** — specific dead ends to avoid repeating
5. **What to do next** — the recommended next step, specific and actionable
6. **Key facts discovered** — any non-obvious insights about the codebase, API, or problem

Format as a message starting with: "Context for continuing this work:"

Keep it under 400 words. Be specific — name files, functions, and error messages.
```

## Variables

None — this prompt operates entirely on the current session context.

## Example

**Scenario:** A session spent debugging a failing webhook handler ends without a full resolution.

**Usage:** Paste the prompt as the final message before closing the session.

**Expected output:**

```
Context for continuing this work:

**Goal:** Fix the Stripe webhook handler that silently drops `payment_intent.succeeded` events.

**What we tried:**
- Added logging to `src/webhooks/stripe.ts` — confirmed events arrive but `handlePaymentSuccess()` returns early
- Checked the Stripe signature validation — it passes correctly
- Traced the early return to a null check on `event.data.object.customer` — Stripe omits this field on guest checkouts

**Current state:** `src/webhooks/stripe.ts` has added logging (lines 34–41, not committed). The root cause is identified. No changes are committed yet.

**What failed:** Attempting to patch the null check with an optional chain broke TypeScript because `customer` is typed as `string` not `string | null` in the Stripe SDK types.

**What to do next:** Update the type assertion on line 67 of `src/webhooks/stripe.ts` to `(event.data.object as Stripe.PaymentIntent).customer ?? null`, then re-run `npm test -- stripe` to confirm.

**Key facts:**
- Guest checkout Stripe events never include `customer` — this is documented in Stripe's API but not in our codebase anywhere
- The Stripe SDK version is 12.x — `PaymentIntent.customer` is typed as non-nullable there, fixed in 13.x
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.youtube.com/@UITBREIDEN)
