---
name: dao-governance
description: Build DAO governance systems — voting mechanisms, treasury management, delegation, and proposal lifecycle
allowed-tools: [Read, Write, Bash, Grep]
effort: high
---

## When to activate

- Designing DAO governance structures and voting systems
- Building treasury management contracts with multi-sig
- Implementing token-weighted or quadratic voting
- Creating proposal lifecycle (draft → vote → execute)
- Setting up governance delegation and representative systems

## When NOT to use

- For centralized organization management
- For simple multi-sig wallets without governance
- For off-chain voting tools (Snapshot is sufficient alone)

## Instructions

1. **Define governance model.** Token-weighted (1 token = 1 vote), quadratic (sqrt), conviction voting, or hybrid.
2. **Design proposal lifecycle.** Draft → Discussion → Voting → Timelock → Execution. Define quorum and thresholds.
3. **Implement voting.** Governor contract (OpenZeppelin), delegation, vote snapping, late quorum extension.
4. **Treasury management.** Multi-sig (Gnosis Safe), timelock controller, spending limits, budget allocation.
5. **Delegation.** Delegate votes without transferring tokens. Partial delegation. Liquid democracy patterns.
6. **Execution.** Timelock for approved proposals. Optimistic governance (execute unless vetoed). Module-based execution.
7. **Security.** Prevent vote buying (snapshot at proposal time), flash loan governance attacks, delegation cycles.

## Example

```solidity
// OpenZeppelin Governor with Timelock
contract MyDAO is Governor, GovernorSettings, GovernorCountingSimple, GovernorVotes, GovernorVotesQuorumFraction, GovernorTimelockControl {
    constructor(IVotes _token, TimelockController _timelock)
        Governor("MyDAO")
        GovernorSettings(1, 50400, 1000e18)  // 1 block delay, 1 week voting, 1000 token threshold
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(4)  // 4% quorum
        GovernorTimelockControl(_timelock)
    {}
}
```
