---
description: Summarize raw meeting notes into decisions, actions, and open questions
argument-hint: "[raw notes or transcript]"
---
Summarize the following meeting notes into a structured document: $ARGUMENTS

Produce exactly four sections:

**Context** (2–4 sentences)
Who attended, what the meeting was about, what triggered it. Infer from notes if not explicit.

**Decisions Made**
Bulleted list. Each bullet is a concrete decision, not a topic discussed. Omit anything that was discussed but not resolved. If zero decisions were made, write "None."

**Action Items**
Bulleted list. Format: `[Owner] — Action — Due date (if mentioned)`. If no owner is explicit, write `[TBD]`. If no due date, omit it.

**Open Questions**
Bulleted list of unresolved questions or items explicitly deferred. If none, omit the section.

Rules:
- Do not editorialize — stay factual to the source material.
- Do not invent owners, decisions, or deadlines not present in the notes.
- If the notes are too sparse to produce a useful summary, say so and list what is missing.
- Collapse duplicate or redundant items.
- Keep total output under 400 words unless the meeting was unusually complex.
- Use plain Markdown — no HTML, no tables unless the action items are too many to read linearly.

Output the summary only. No preamble.
