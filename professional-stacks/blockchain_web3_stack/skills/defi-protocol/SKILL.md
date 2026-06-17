---
name: defi-protocol
description: Design and implement DeFi protocols — AMMs, lending markets, yield aggregators, and stablecoin mechanisms
allowed-tools: [Read, Write, Bash, Grep]
effort: high
---

## When to activate

- Building automated market makers (AMMs) or DEXes
- Implementing lending/borrowing protocols
- Designing yield farming or liquidity mining strategies
- Creating stablecoin mechanisms or synthetic assets
- Building liquid staking derivatives

## When NOT to use

- For simple token transfers or payments
- For centralized exchange backends
- For traditional financial applications

## Instructions

1. **Define protocol type.** AMM (Uniswap-style), Lending (Aave-style), Yield (Yearn-style), Stablecoin (Maker-style).
2. **Model economics.** Constant product formula (x*y=k), interest rate model (utilization-based), yield source identification.
3. **Implement core contracts.** Pool, Router, Token, Oracle. Use OpenZeppelin for standard components.
4. **Design incentive structure.** LP rewards, governance tokens, fee distribution, impermanent loss mitigation.
5. **Security hardening.** Oracle selection (Chainlink vs TWAP), flash loan protection, slippage controls, circuit breakers.
6. **Testing.** Fork mainnet tests with Foundry. Simulate flash loan attacks, oracle manipulation, edge cases.
7. **Deployment.** Deterministic deployment (CREATE2), multi-sig ownership, timelock for parameter changes.

## Example

```solidity
// Simplified AMM Pool (constant product)
contract SimplePool {
    uint256 public reserveA;
    uint256 public reserveB;
    
    function swap(address tokenIn, uint256 amountIn) external returns (uint256 amountOut) {
        // 0.3% fee
        uint256 amountInWithFee = amountIn * 997;
        
        if (tokenIn == tokenA) {
            amountOut = (reserveB * amountInWithFee) / (reserveA * 1000 + amountInWithFee);
            reserveA += amountIn;
            reserveB -= amountOut;
        } else {
            amountOut = (reserveA * amountInWithFee) / (reserveB * 1000 + amountInWithFee);
            reserveB += amountIn;
            reserveA -= amountOut;
        }
    }
}
```
