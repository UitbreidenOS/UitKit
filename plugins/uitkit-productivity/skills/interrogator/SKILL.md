---
name: "interrogator"
description: "Claude Code the interrogator (automated issue triaging): workflow guidelines, best practices, instructions, and integration examples"
---

# The Interrogator (Automated Issue Triaging)

## When to activate
Activate when a user wants to triage the backlog, or when explicitly invoked via `/interrogator [issue-url]`. Requires a configured GitHub or Linear MCP server.

## When NOT to use
Do not use on issues that already have reproduction steps, environment details, and expected behavior clearly defined.

## Instructions
1. **Connect via MCP:** Use the available MCP tools (e.g., `github_get_issue` or `linear_get_issue`) to fetch the title, description, and comments of the target ticket.
2. **Analyze Completeness:** Read the issue like a ruthless QA Engineer. Look for missing critical information:
   - What are the exact steps to reproduce?
   - What is the expected behavior vs. actual behavior?
   - What environment did this happen in (OS, Browser, App Version)?
   - Are there console logs or screenshots?
3. **Draft the Interrogation:** If information is missing, draft a polite but firm comment asking for the specific missing details.
4. **Take Action:** Ask the user: "This ticket is missing reproduction steps and environment details. Shall I post this comment on the ticket to request more information?"
5. If approved, use the MCP tool (e.g., `github_create_issue_comment`) to post the comment.

## Example
User: `/interrogator https://github.com/my-org/repo/issues/42`
Claude: [Fetches issue via MCP]. The issue just says "Login is broken." I have drafted a comment asking for the browser version, exact error message, and the time it occurred. Shall I post it?