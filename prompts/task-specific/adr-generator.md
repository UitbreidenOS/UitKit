# Prompt: ADR Generator

Generate a properly structured Architecture Decision Record from a description of a decision made. Use when you want to document a decision without delegating to the adr-writer agent.

## Prompt template

```
Write an Architecture Decision Record for this decision.

**Decision made:** [What was decided — be specific]
**Context:** [What problem or situation prompted this decision?]
**Alternatives considered:** [What else was evaluated?]
**Why this option:** [The key reasons]
**Trade-offs:** [What are you giving up? What new complexity does this introduce?]
**Who decided:** [Role or team, not personal names]
**Date:** [Today]

Format as a proper ADR using the Nygard format:
- Title (ADR-NNN: Short Title)
- Status (Accepted)
- Context section
- Decision section (one sentence, active voice)
- Rationale section
- Alternatives Considered table
- Consequences (positive, negative, neutral)
- Review Date

Save to: docs/decisions/ADR-[next-number]-[kebab-case-title].md
```

## Quick version (from conversation context)

```
Write an ADR for the decision we just made.
Extract the context, decision, and rationale from our conversation.
Save to docs/decisions/ with the next sequential number.
```

## When to use this vs. the adr-writer agent

- **This prompt:** You want to quickly document a specific decision you describe
- **`/agents/roles/adr-writer`:** You want Claude to read the session context and extract decisions automatically

## Common decision types to document

- Database or ORM selection
- Authentication approach
- API design (REST vs GraphQL vs tRPC)
- State management (Zustand vs Redux vs Jotai)
- Hosting and deployment choices
- Caching strategy
- Testing approach (unit vs integration vs E2E ratio)
- Monolith vs microservices boundary decisions
- Third-party service selection (Stripe, Resend, Clerk, etc.)
