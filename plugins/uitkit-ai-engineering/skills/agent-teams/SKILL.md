---
name: "agent-teams"
description: "Orchestrate multi-agent teams in Claude Code — set up coordinated sessions with task delegation, inter-agent communication, and parallel execution"
---

# Agent Teams Skill

## When to activate

- Complex features spanning multiple layers (frontend + backend + tests)
- Research tasks requiring parallel investigation of competing hypotheses
- Large refactors where multiple files can be changed independently
- Code review requiring simultaneous analysis from different perspectives
- Building new modules where each teammate owns a separate component

## When NOT to use

- Sequential tasks where each step depends on the previous (use a single session)
- Same-file edits — teammates will overwrite each other
- Simple tasks where spawning a team adds more overhead than value
- Tasks with many inter-task dependencies — coordination cost dominates

## Instructions

1. **Assess team viability.** Is the work parallelizable? Do tasks touch different files? If yes to both, proceed.

2. **Define roles.** Each teammate needs a clear role, scope, and boundary:
   ```
   Teammate 1: "Frontend Engineer" — React components, styling, client-side logic
   Teammate 2: "Backend Engineer" — API endpoints, database queries, validation
   Teammate 3: "QA Engineer" — Integration tests, edge cases, error handling
   ```

3. **Set up the lead session.** The lead coordinates — it does NOT write code:
   ```
   Create a task list with clear ownership. Assign each task to a specific teammate.
   Use the task list as the shared communication channel.
   ```

4. **Define communication protocol.** Teammates share findings via task updates, not direct messages:
   - Update task status when work is done
   - Add comments with key findings or blockers
   - Lead reviews progress and reassigns if needed

5. **Set conflict boundaries.** Prevent file collisions:
   ```
   Teammate 1 owns: src/components/**, src/styles/**
   Teammate 2 owns: src/api/**, src/models/**
   Teammate 3 owns: tests/**, src/utils/validation/**
   Shared (read-only): src/config/**, package.json
   ```

6. **Synthesize results.** After teammates complete their work, the lead:
   - Reviews all changes for consistency
   - Resolves any conflicts at boundaries
   - Runs integration tests to verify the pieces work together
   - Creates a unified commit with a clear message

7. **Common team patterns:**

   | Pattern | Teammates | Best for |
   |---------|-----------|----------|
   | Layer Split | Frontend + Backend + Tests | Feature development |
   | Hypothesis Race | 2-3 investigators | Debugging complex issues |
   | Research Panel | 3-4 researchers + synthesizer | Architecture decisions |
   | Review Panel | Security + Performance + DX | Code review |
   | Module Factory | N builders (1 per module) | Large scaffolding |

## Example

```
Lead: "Build a user authentication module. Teammate assignments:
- @frontend: Login form, auth context, protected routes (src/components/auth/**)
- @backend: Auth API, JWT generation, session management (src/api/auth/**)  
- @qa: Auth integration tests, token expiry tests (tests/auth/**)

Rules:
1. Don't touch files outside your scope
2. Update your task when done
3. If you need something from another teammate, add a comment — don't block

Let's go."

[Teammates work in parallel]

Lead (after all done):
"Reviewing changes... frontend and backend agree on the /auth/login contract.
Tests cover both success and failure paths. All integration tests pass.
Merging into single commit: feat(auth): add JWT authentication module"
```

---

Built with [Claudient](https://github.com/UitbreidenOS/Claudient) · [Claude Code](https://claude.com/claude-code)
