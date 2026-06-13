---
name: "Cursor + Claude Code Tandem Workflow"
description: "User uses both Cursor and Claude Code and asks how to use them together effectively; user mentions switching between IDE and terminal AI; user wants to know which tool to use for a given task when bot"
---

# Cursor + Claude Code Tandem Workflow

## When to activate
User uses both Cursor and Claude Code and asks how to use them together effectively; user mentions switching between IDE and terminal AI; user wants to know which tool to use for a given task when both are available.

## When NOT to use
User only has one of the two tools; user is asking about one tool in isolation without reference to the other; user wants a comparison to decide which tool to buy.

## Instructions

**Tool roles — keep them distinct:**

- **Cursor** = intelligent IDE. Inline autocomplete, multi-file chat, codebase search, quick edits, component writing, reviewing diffs, exploring unfamiliar code.
- **Claude Code** = autonomous terminal agent. Runs shell commands, orchestrates subagents, handles multi-step tasks across many files, makes commits, sets up infrastructure.

**Task routing — which tool gets the job:**

Good Cursor tasks:
- Writing new components or functions
- Reviewing a diff before committing
- Exploring an unfamiliar codebase to understand structure
- Quick renames and local refactors
- Inline documentation

Good Claude Code tasks:
- Running the full test suite, then fixing failures
- Large refactors across 20+ files
- Setting up GitHub Actions, Dockerfiles, or CI/CD configs
- Database migrations
- Anything requiring bash commands or subagent orchestration
- End-to-end feature generation from spec to PR

**Shared context via CLAUDE.md:**
Both tools read `CLAUDE.md`. Write your conventions, naming rules, architecture decisions, and preferences there once — both tools respect them automatically. This is the single most important integration point.

**Critical rule — never let both edit the same file simultaneously.** This causes git conflicts that neither tool can resolve cleanly. Finish the Claude Code task, commit, then open in Cursor.

**Handoff pattern:**
1. Claude Code runs the multi-step task → commits the result
2. You open the commit in Cursor for fine-tuning, code review, or polish
3. Cursor edits go in a follow-up commit

**Parallel use pattern:**
Run Claude Code in background on a long task (test suite, migration, build) while you work in Cursor on unrelated files. Claude Code reports back when done without blocking your editor workflow.

## Example

"I use Cursor for writing React components and exploring the codebase. I switch to Claude Code terminal when I need to: run the full test suite, refactor across 30 files, set up GitHub Actions, or do a database migration. `CLAUDE.md` holds our shared conventions — both tools pick them up automatically without any extra configuration."

---
