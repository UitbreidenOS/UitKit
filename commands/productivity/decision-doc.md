---
description: Draft an architectural or technical decision record (ADR) from a description
argument-hint: "[decision topic and context]"
---
Draft a decision document for the following: $ARGUMENTS

Use this structure:

**Status:** Proposed | Accepted | Deprecated | Superseded  
(Default to "Proposed" unless $ARGUMENTS specifies otherwise.)

**Context**  
What situation forces a decision now. Include constraints, prior art, and why the status quo is insufficient. 3–6 sentences.

**Decision**  
One paragraph. State the decision directly in the first sentence. Do not bury the lede.

**Options Considered**

For each option (2–4 total, including the chosen one):
- **Option N: [Name]** — one sentence description
  - Pro: ...
  - Pro: ...
  - Con: ...
  - Con: ...

**Consequences**

Positive consequences (what improves or becomes possible).  
Negative consequences / trade-offs (what gets harder, what is lost).  
Risks (what could go wrong, and mitigation if known).

**Revisit Conditions**  
Bullet list: specific conditions under which this decision should be revisited. Be concrete — not "if requirements change" but "if request volume exceeds 10k/s" or "if vendor X deprecates API Y."

Rules:
- Write for a reader who will encounter this doc 18 months from now with no other context.
- Do not recommend the "obviously correct" option without listing real cons.
- Do not pad with background that is common knowledge for a senior engineer.
- If $ARGUMENTS does not provide enough context to name real options, state the two most common industry alternatives and note that the reader should validate them.
- Keep total length under 600 words unless the decision is unusually complex.

Output the document only.
