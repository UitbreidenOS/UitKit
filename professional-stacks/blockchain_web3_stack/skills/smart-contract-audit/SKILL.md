---
name: smart-contract-audit
description: Security audit for Solidity smart contracts — reentrancy, access control, integer overflow, and EVM-specific vulnerabilities
allowed-tools: [Read, Grep, Glob]
effort: high
---

## When to activate

- Auditing Solidity or Vyper contracts before deployment
- Reviewing DeFi protocol code for economic attack vectors
- Checking upgradeable proxy patterns for storage collisions
- Evaluating access control patterns across a contract system
- Preparing for a professional security audit engagement

## When NOT to use

- For off-chain application code (use standard code review)
- For blockchain explorer or indexer code
- For frontend Web3 dApp code

## Instructions

1. **Map attack surface.** List all external-facing functions. Identify state-modifying functions. Map call paths to sensitive operations (transfers, mints, admin actions).

2. **Check critical vulnerabilities:**
   - **Reentrancy:** External calls before state updates? Use checks-effects-interactions. CEI pattern.
   - **Access control:** Missing `onlyOwner`/role checks? Unprotected `selfdestruct`? Unrestricted delegatecall?
   - **Integer overflow:** Pre-0.8.0 without SafeMath? Underflow in balance calculations?
   - **Oracle manipulation:** Using spot prices from DEX as oracle? Flash loan price manipulation?
   - **Front-running:** Transaction ordering dependencies? Sandwich attack vectors?
   - **Denial of service:** Unbounded loops? External calls in loops? Push vs pull payments?

3. **Review economic logic.** Does the math preserve invariants? Total supply == sum of balances? Collateral ratio maintained?

4. **Check upgrade patterns.** Proxy storage layout matches? Function selectors don't collide? Initializer called?

5. **Generate audit report.** Severity: Critical, High, Medium, Low, Informational. Include PoC for critical findings.

## Example

```
Audit Finding: CRITICAL — Reentrancy in withdraw()

Contract: Vault.sol, Line 42
Issue: Ether transfer occurs before balance update.

Vulnerable:
  function withdraw() external {
    uint amount = balances[msg.sender];
    (bool ok,) = msg.sender.call{value: amount}(""); // external call first
    require(ok);
    balances[msg.sender] = 0; // state update after
  }

Fix:
  function withdraw() external nonReentrant {
    uint amount = balances[msg.sender];
    balances[msg.sender] = 0; // state update first (effects)
    (bool ok,) = msg.sender.call{value: amount}(""); // external call last
    require(ok, "Transfer failed");
  }
```
