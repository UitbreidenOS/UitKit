# AI Writing Detection

## When to activate
Auditing documentation, blog posts, or marketing copy for AI-pattern text; when the user wants content to sound more human; reviewing a README or public-facing document before publishing.

## When NOT to use
- Technical specifications or API docs where precision matters more than voice
- Internal tooling docs where the audience doesn't care about register
- Content that has already been reviewed and approved — do not re-litigate

## Instructions

### Common AI Text Patterns to Flag

**Filler hedges — remove entirely:**
- "It's worth noting that..."
- "It's important to understand that..."
- "Certainly!" / "Absolutely!" / "Of course!" (opener responses)
- "I'd be happy to help with that."

**Transition overuse — replace with a direct sentence or nothing:**
- "In conclusion, ..." — just end the paragraph
- "Furthermore, ..." — just say the next thing
- "Moreover, ..." — same
- "Additionally, ..." — same
- "In summary, ..." — only valid if summarizing >5 items

**Em-dash overuse:** more than one em-dash per paragraph is a strong signal; use a period or comma instead.

**Unearned enthusiasm:** sentences that use exclamation points for unremarkable statements ("This makes development faster!"). Reserve `!` for genuinely surprising results.

**Preamble before answering:** restating the question before answering it ("You asked about X. X is an important topic because..."). Cut to the answer.

**Buzzword stacking without substance:**
- "leveraging cutting-edge AI-powered solutions"
- "synergistic value-add for stakeholders"
- "robust and scalable architecture"
These phrases contain no information. Replace with a concrete claim or delete.

**Over-qualification:** "might potentially", "could possibly", "may perhaps". Pick one hedge or none.

### Rewriting Principles

1. **Lead with the fact.** Bad: "It's important to note that authentication requires a valid token." Good: "Requests require a valid token."

2. **Cut preamble.** Delete any sentence that restates context the reader already has.

3. **Prefer concrete nouns.** Bad: "the system processes the data." Good: "the API validates and stores the request body."

4. **Active voice.** Bad: "The configuration is loaded by the application on startup." Good: "The application loads configuration on startup."

5. **Match vocabulary to the reader.** A developer audience does not need "in other words" explanations of REST or JSON. A non-technical audience does not need unexplained acronyms.

6. **Cut anything that doesn't add information.** Read each sentence and ask: if I removed this, would the reader know less? If no, remove it.

### What Not to Change
- Technical terms, even if they sound formal — "idempotent", "deserialization", "mutex" are precise
- Code examples — never rewrite code as part of a prose cleanup
- Accurate facts — only rewrite the prose around them, not the claims themselves
- Structured lists — if a list is clear and correct, leave it; do not convert to prose

### Detection Checklist
Run through this list when reviewing a document:
- [ ] Does any sentence start with "It's worth noting" or "It's important to"?
- [ ] Are there more than 2 em-dashes per page?
- [ ] Do any paragraphs begin with "Certainly", "Absolutely", or "Of course"?
- [ ] Is "In conclusion" used anywhere except after a multi-item summary?
- [ ] Are "furthermore", "moreover", or "additionally" used more than once per section?
- [ ] Are there exclamation points on unremarkable statements?
- [ ] Does the opening paragraph restate the document title or the question being answered?
- [ ] Are there phrases like "robust", "scalable", "cutting-edge", "powerful" without supporting evidence?

### Severity Levels
- **Remove:** hedges, preamble, unearned enthusiasm, buzzwords without substance — these add no value
- **Rewrite:** over-qualified statements, passive voice, buried facts — restructure the sentence
- **Review:** em-dashes, transition words — one per section may be fine; overuse is the problem

## Example

**Original (AI-pattern text):**
> It's worth noting that our platform leverages cutting-edge AI to deliver robust and scalable solutions. Furthermore, the system is designed to handle large volumes of data efficiently. In conclusion, this makes it an excellent choice for enterprise customers.

**After applying this skill:**
> The platform processes up to 10,000 requests per second and scales horizontally across regions. Enterprise customers can deploy it without infrastructure changes.

Changes made: removed "it's worth noting", replaced "cutting-edge AI / robust / scalable" with a concrete throughput number, removed "furthermore" and "in conclusion", converted to active voice, and cut the redundant closing sentence.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
