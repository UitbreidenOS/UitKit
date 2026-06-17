---
name: gas-optimization
description: Optimize Solidity smart contract gas costs — storage patterns, assembly, packing, and EVM-level tricks
allowed-tools: [Read, Grep]
effort: high
---

## When to activate

- Reducing gas costs for frequently-called functions
- Optimizing storage layout in Solidity contracts
- Implementing assembly (Yul) for performance-critical sections
- Reducing deployment costs for large contracts
- Optimizing NFT batch operations

## When NOT to use

- For contracts with low transaction volume
- When readability matters more than gas savings
- For prototype/audit-phase contracts

## Instructions

1. **Profile gas usage.** Use Hardhat gas reporter or Foundry gas snapshots. Identify hot functions.
2. **Storage optimization.** Pack variables (uint128 + uint128 = 1 slot). Use `immutable` and `constant` (compiled into bytecode).
3. **Minimize SSTOREs.** Batch state changes. Use memory for intermediate calculations. Write once, read many.
4. **Calldata optimization.** Use `calldata` over `memory` for function params. Shorter function selectors save gas.
5. **Loop optimization.** Avoid unbounded loops. Cache array length. Use unchecked arithmetic where safe.
6. **Assembly (Yul).** Inline assembly for critical paths. Custom error handling. Direct EVM operations.
7. **External optimization.** Multicall batching, permit (gasless approvals), meta-transactions.

## Example

```solidity
// Gas optimization: storage packing
contract Optimized {
    // BAD: 3 storage slots
    uint256 public valueA;    // slot 0
    uint8 public valueB;      // slot 1
    uint256 public valueC;    // slot 2
    
    // GOOD: 2 storage slots (packing)
    uint128 public valueA;    // slot 0 (first 128 bits)
    uint128 public valueC;    // slot 0 (last 128 bits)
    uint8 public valueB;      // slot 1
    
    // BEST: use constants and immutables (0 gas to read)
    uint256 public constant MAX_SUPPLY = 10000;
    address public immutable owner;
}

// Unchecked arithmetic (safe when overflow is impossible)
for (uint i; i < arr.length;) {
    sum += arr[i];
    unchecked { ++i; } // saves ~60 gas per iteration
}
```
