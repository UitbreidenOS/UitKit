---
description: Draft a professional email from a topic, intent, and optional context
argument-hint: "[recipient, purpose, key points]"
---
Draft a professional email based on: $ARGUMENTS

Infer the following from $ARGUMENTS:
- **Recipient type**: executive, peer engineer, external vendor, customer, recruiter, etc.
- **Intent**: inform, request, escalate, decline, follow up, introduce, etc.
- **Tone**: formal, collegial, or direct — default to collegial unless context suggests otherwise.

Output format:

**Subject:** [concise, specific — no "Following up" or "Quick question"]

**Body:**
[email body]

Rules for the body:
- Open with the point, not with "I hope this email finds you well" or equivalent filler.
- State the ask or key information in the first two sentences.
- Use short paragraphs (2–4 sentences max). One idea per paragraph.
- If there is an action required from the recipient, make it explicit: what, by when.
- Close with one sentence — either a clear next step or a low-friction call to action.
- No sign-off platitudes ("Please don't hesitate to reach out," "Thanks in advance").
- Signature placeholder: `[Your name]`
- Target length: 80–200 words for most emails. Go longer only if the content requires it.

Tone calibration by recipient type:
- Executive: high signal, no fluff, lead with impact.
- Peer / teammate: direct, can use "we" framing, conversational is fine.
- External vendor: professional but not stiff; be specific about what you need.
- Customer: empathetic framing, avoid internal jargon.
- Recruiter: brief, confident, no desperation.

If $ARGUMENTS is ambiguous about intent or recipient, state your assumption at the top in one line, then produce the draft.

Output the subject line, body, and assumption note if applicable. No preamble.
