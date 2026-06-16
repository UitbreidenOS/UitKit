---
name: "The Stunt Double (Strict TDD Workflow)"
description: "Activate when the user asks for a new feature and explicitly requests Test-Driven Development, or invoked via `/stunt-double`."
---

# The Stunt Double (Strict TDD Workflow)

## When to activate
Activate when the user asks for a new feature and explicitly requests Test-Driven Development, or invoked via `/stunt-double`.

## When NOT to use
Do not use for UI styling changes or simple configuration tweaks where unit testing is not applicable.

## Instructions
1. Gather the feature requirements from the user.
2. You will act as the Orchestrator. Do not write the code yourself.
3. **Step 1:** Spawn the `test-engineer` agent. Pass it the requirements and instruct it to write an exhaustive test suite that fails. Wait for it to finish and prove the tests fail.
4. **Step 2:** Spawn the `implementation-engineer` agent. Instruct it to write the business logic until the tests pass. Wait for it to finish and prove the tests pass.
5. Present the final, fully-tested code to the user.

## Example
User: `/stunt-double Build a utility function that validates strong passwords.`
Claude: [Spawns test-engineer to write password.test.js]. The tests are failing. [Spawns implementation-engineer to write password.js until tests pass]. The feature is complete and 100% test-backed.