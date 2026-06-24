---
name: "session-handoff"
description: "Claude Code Session Handoff: structured context export/import between sessions, state serialization, continuation prompts, cross-session knowledge transfer, and resumable workflows"
---

# Session Handoff — Cross-Session Context Transfer

## When to activate
- Ending a session but the task is not complete — need to continue in a new session
- Switching from one model to another (e.g., Sonnet → Opus for complex reasoning)
- Context window is nearly full and you need to start fresh without losing progress
- Handing off work between team members (each with their own Claude Code instance)
- Moving from exploration/planning session into an execution session
- Resuming work after a break (overnight, weekend) where context is lost

## When NOT to use
- The task fits comfortably within the current session's context window
- Starting a completely unrelated task that has no dependency on prior work
- When a simple summary sentence is sufficient to resume ("I was working on X")
- Stateless tasks that don't benefit from prior context

## Instructions

### 1. Handoff Document Structure

When ending a session, produce a structured handoff document:

```markdown
# Session Handoff: [Task Name]
**Date:** 2026-06-13
**Session duration:** 2h 14m
**Status:** In Progress (70% complete)

## What was accomplished
- [Completed item 1]
- [Completed item 2]
- [Completed item 3 with file path]

## Current state
- Working on: [specific file/function/concept]
- Last action: [what was just done]
- Blocker: [if any]

## Key decisions made
| Decision | Rationale | Alternative rejected |
|----------|-----------|---------------------|
| Used JWT over sessions | Stateless, scales horizontally | Sessions needed Redis |
| Chose PostgreSQL over MongoDB | Relational data, ACID needed | MongoDB faster for reads |

## Files modified
| File | Change | Status |
|------|--------|--------|
| src/auth/jwt.ts | Created — JWT token generation | Done |
| src/auth/middleware.ts | Modified — added auth check | Done |
| tests/auth.test.ts | In progress — 3 of 8 tests written | Resume here |

## Context that won't be obvious
- The API key for testing is in .env.test (not .env)
- The user prefers snake_case for database columns
- There's a known issue with the date parser on line 47 — needs fix

## Continuation prompt
Continue from where we left off:
1. Complete the remaining 5 tests in tests/auth.test.ts
2. Run the full test suite to verify nothing broke
3. Update the API documentation for the new auth endpoints
4. Commit with message: "feat(auth): implement JWT authentication"
```

### 2. Export Patterns

**Automatic handoff (on context overflow warning):**
```yaml
handoff:
  trigger: "context_window_80_percent"
  auto_export:
    - conversation_summary: true
    - files_modified: true
    - decisions_log: true
    - next_steps: true
  save_to: ".claude/handoff/{{date}}-{{task-slug}}.md"
```

**Manual handoff (user requests):**
```
User: "I need to stop here. Create a handoff doc so I can continue tomorrow."
Agent: Generate handoff document with all sections above, save to file
```

**Programmatic handoff (between sessions):**
```json
{
  "handoff_id": "hf_2026-06-13_auth-impl",
  "version": 1,
  "context": {
    "task": "Implement JWT authentication",
    "progress": 0.7,
    "files_modified": ["src/auth/jwt.ts", "src/auth/middleware.ts"],
    "files_to_modify": ["tests/auth.test.ts", "docs/api.md"],
    "decisions": [
      {"topic": "token_storage", "choice": "httpOnly_cookie", "reason": "XSS protection"}
    ],
    "environment": {
      "node_version": "20.11",
      "dependencies_added": ["jsonwebtoken@9.0.2"]
    }
  },
  "continuation": {
    "next_action": "Complete auth tests",
    "estimated_remaining": "45 minutes",
    "blockers": []
  }
}
```

### 3. Import Patterns

**New session picks up from handoff:**
```
User: "Continue from the handoff doc at .claude/handoff/2026-06-13-auth-impl.md"
Agent: 
  1. Read handoff document
  2. Verify files mentioned still exist and match expected state
  3. Resume from "next_action"
  4. Confirm with user before proceeding
```

**Verification on import:**
```yaml
on_import:
  verify:
    - files_exist: true        # check all referenced files still exist
    - git_clean: true          # warn if uncommitted changes conflict
    - dependencies_installed: true  # check node_modules, venv, etc.
    - state_match: true        # verify file contents match expected state
  on_mismatch: "warn_and_ask"  # don't silently proceed if state differs
```

### 4. Multi-Session Workflow

```
Session 1 (Planning):     Output → handoff-plan.md
Session 2 (Execution):    Input ← handoff-plan.md → Output → handoff-exec.md
Session 3 (Review):       Input ← handoff-exec.md → Output → handoff-review.md
Session 4 (Deployment):   Input ← handoff-review.md → Final deployment
```

### 5. Handoff Compression

For large sessions, compress context to essentials:

| Include | Exclude |
|---------|---------|
| Files modified (paths + diff summary) | Full file contents (can re-read) |
| Key decisions with rationale | Every conversation turn |
| Current blockers and next steps | Resolved issues |
| Environment setup details | Generic tool installation |
| Non-obvious context and gotchas | Information available in docs/code |

**Compression ratio target:** 200-line session → ~50-line handoff (75% reduction)

### 6. Team Handoff Protocol

When handing off between team members:

```yaml
team_handoff:
  metadata:
    from: "Alice (backend team)"
    to: "Bob (frontend team)"
    task: "API integration for user dashboard"
    
  api_contract:
    endpoints:
      - path: "GET /api/users/:id"
        response: {id: "string", name: "string", email: "string"}
        status: "implemented and tested"
      - path: "POST /api/users"
        body: {name: "string", email: "string"}
        status: "implemented, needs CORS config"
    
  known_issues:
    - "CORS not configured — will fail from localhost:3000"
    - "Rate limiting not implemented yet"
    
  environment:
    base_url: "http://localhost:8080"
    auth: "Bearer token from POST /api/auth/login"
    test_user: {email: "test@example.com", password: "test123"}
```

## Example

**Resuming a refactoring task from yesterday:**

```
User: "Resume the database refactoring from yesterday's handoff"

Agent reads .claude/handoff/2026-06-12-db-refactor.md:
  → 8 of 12 queries refactored to parameterized statements
  → 4 remaining: getUserOrders, getMonthlyRevenue, getTopProducts, searchItems
  → Blocker: getMonthlyRevenue uses a CTE that doesn't support parameters

Agent: "Picking up the database refactoring. 8/12 queries done. 
       4 remaining, starting with getUserOrders (simplest).
       Note: getMonthlyRevenue has a CTE blocker — I'll tackle that last 
       and propose a rewrite approach. Shall I proceed?"

User: "Yes, go"

Agent: Continues refactoring, completes all 4, resolves CTE blocker, runs tests
```

## Anti-Patterns

- **Dumping everything:** Including the full conversation in the handoff — compress to essentials only
- **No verification:** Importing a handoff without checking that referenced files still exist and match
- **Stale handoffs:** Using a handoff document from 2 weeks ago without accounting for interim changes
- **Missing gotchas:** Not recording non-obvious context (env vars, workarounds, known issues) — this is the most valuable part
- **No continuation prompt:** Handoff doc describes what was done but not what to do next — always end with explicit next steps
- **Circular handoffs:** Session A hands off to B, B hands off to C, C hands back to A — track the chain and consolidate
