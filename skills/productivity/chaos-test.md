---
name: chaos-test
description: "Claude Code Chaos Test: adversarial test hardening. Spawns/orchestrates a Chaos Monkey agent to inject network drops, race conditions, and malformed inputs to harden infrastructure"
updated: 2026-06-17
---

# Chaos Test Workflow

## When to activate
- Hardening critical infrastructure code (databases, queues, client integrations).
- Testing system resilience against hardware, network, or external API failures.
- Designing high-reliability fallback routes and recovery strategies.
- Invoked via `/chaos-test` command.

## When NOT to use
- Simple front-end styles, static layout pages, or purely cosmetic components.
- Short utility scripts or mathematical algorithms with no external states.

## Instructions
1. Run the chaos validation sequence:
   - Load the target implementation file and its accompanying test suite.
   - Spawn the specialized `chaos-monkey` agent.
2. Instruct the `chaos-monkey` to rewrite the test suite with extreme adversarial conditions:
   - **Network Chaos:** Mock connection drops, latency spikes, and 500/503 errors.
   - **Concurrency Chaos:** Simulate race conditions and out-of-order execution.
   - **Data Chaos:** Inject unexpected nulls, malformed fields, and type violations.
3. Run the modified tests. If they fail (indicating vulnerabilities in the main code):
   - Spawn the `implementation-engineer` agent to refactor and harden the source file.
   - Repeat the loop until all chaos tests pass successfully.
4. Present the hardened, resilient code to the user.

## Example
User: `/chaos-test src/services/email-sender.ts`
Claude: [Spawns chaos-monkey to mock random network drops in email provider API. Tests fail. Spawns implementation-engineer to add exponential backoff and persistent retry queue. Tests pass.]
"I have hardened `email-sender.ts` using chaos testing. It now handles random API disconnects using a background retry queue."