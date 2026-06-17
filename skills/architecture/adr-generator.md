---
name: adr-generator
description: "Claude Code architecture decision record (adr) generator: workflow guidelines, best practices, instructions, and integration examples"
updated: 2026-06-17
---

# Architecture Decision Record (ADR) Generator

## When to activate
Activate when the user asks to document an architectural decision, or automatically suggest using it when you observe a significant change in the codebase (e.g., introducing a new database, switching state management libraries, changing API protocols, or making security trade-offs). Invoked via `/adr`.

## When NOT to use
Do not use for trivial bug fixes, refactoring a single function, or minor styling changes. Only use for decisions that impact the system's architecture, dependencies, or data models.

## Instructions
1. When invoked, gather the context of the decision being made. If the user hasn't provided enough detail, ask clarifying questions:
    *   What is the specific context or problem?
    *   What alternative options were considered?
    *   Why was this specific option chosen?
    *   What are the consequences or trade-offs of this decision?
2. Create a new markdown file in the `docs/adr/` directory (or the project's standard ADR folder). Name it using a sequential number and a kebab-case title (e.g., `docs/adr/0012-use-redis-for-caching.md`). If the folder doesn't exist, create it.
3. Use the standard MADR (Markdown Architectural Decision Records) format:
    *   **Title:** (e.g., Use Redis for Session Caching)
    *   **Date:** (Current Date)
    *   **Status:** (Proposed, Accepted, or Superseded)
    *   **Context:** (The problem or driver for the decision)
    *   **Decision:** (The chosen solution)
    *   **Consequences:** (Positive and negative impacts, trade-offs)
4. Use the `WriteFile` tool to save the document.
5. Provide a brief summary of the generated ADR to the user.

## Example
User: `/adr We've decided to use Zustand instead of Redux for state management because it's lighter and has less boilerplate.`
Claude: [Gathers context, creates `docs/adr/004-use-zustand-for-state.md`]
I have created the ADR documenting the move to Zustand. I noted the context (reducing boilerplate), the decision (Zustand), and the consequences (faster onboarding, but potentially less middleware ecosystem than Redux).