# Chaos Test Workflow

## When to activate
Invoked via `/chaos-test`. Used to harden critical infrastructure code.

## Instructions
1. You are the Orchestrator. The user provides a target file and its test suite.
2. Spawn the `chaos-monkey` agent. Instruct it to rewrite the test suite with extreme adversarial conditions (network drops, race conditions).
3. Run the new tests via `Bash`.
4. If they fail, spawn the `implementation-engineer` agent to harden the target file until the tests pass.
5. Present the hardened code to the user.