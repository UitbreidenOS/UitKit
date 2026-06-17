---
name: "specify-wizard"
description: "Claude Code specify wizard (spec kit automation): workflow guidelines, best practices, instructions, and integration examples"
---

# Specify Wizard (Spec Kit Automation)

## When to activate
Activate when the user is starting a new feature using the GitHub Spec Kit framework, or when explicitly invoked via `/specify-wizard`.

## When NOT to use
Do not use if the user just wants a quick fix or is not following the formal Spec-Driven Development (SDD) process.

## Instructions
1. **Identify the Core Intent:** Ask the user: "What feature are we specifying for the GitHub Spec Kit?"
2. **Phase 1: Interrogation (Grill Me Mode):** Use our internal `/grill-me` logic. Ask 3-5 aggressive questions about edge cases, security, and dependencies that the user hasn't mentioned yet.
3. **Phase 2: The Specification:** Once you have the answers, generate a markdown file named `SPEC.md` (or `specification.md` as per Spec Kit standards).
4. **Required Structure:**
   - **User Story:** (As a... I want to... so that...)
   - **Functional Requirements:** (Bullet points of specific behaviors)
   - **Acceptance Criteria:** (How will we know it works?)
   - **External Dependencies:** (APIs, DB tables, Libraries)
5. **Phase 3: GitHub Integration:** If a GitHub MCP server is active, ask the user: "Shall I create a GitHub Issue for this specification and link it to our project board?"
6. **Next Steps:** Tell the user: "The specification is ready. You can now run the next GitHub Spec Kit command: `specify plan` (or `/speckit.plan`)."

## Example
User: `/specify-wizard Build a multi-tenant file uploader.`
Claude: I need to harden this spec. 1. Is there a per-tenant storage quota? 2. What happens if a file with the same name exists? 3. Do we need virus scanning on upload? 4. Are we generating signed URLs or proxying downloads? [Writes SPEC.md after answers].