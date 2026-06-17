---
name: token-economics
description: Design token economics — supply models, vesting schedules, emission curves, and incentive alignment
allowed-tools: [Read, Write, Grep]
effort: medium
---

## When to activate

- Designing a new token's economic model
- Planning vesting schedules for team and investors
- Designing emission/deflation mechanisms
- Modeling staking rewards and yield distribution
- Evaluating existing tokenomics for investment decisions

## When NOT to use

- For simple ERC-20 token deployment without economic design
- For centralized points/rewards systems
- For regulatory compliance analysis

## Instructions

1. **Define token utility.** Governance, access, staking, payment, or multi-purpose. Each utility affects demand.
2. **Design supply model.** Fixed supply (deflationary), inflationary (ongoing emissions), or hybrid (halving).
3. **Plan distribution.** Team (vested 3-4 years, 1-year cliff), investors (lock + linear vest), community (airdrop, rewards).
4. **Design incentives.** Staking APY, liquidity mining, protocol revenue share, buyback-and-burn.
5. **Model value accrual.** How does protocol success → token value? Fee switches, burn mechanisms, staking locks.
6. **Simulate scenarios.** Model bull/bear markets. What happens at 10x and 0.1x adoption? Stress test emissions.
7. **Document tokenomics.** Whitepaper section with charts: supply schedule, vesting timeline, emission curve.

## Example

```
Token: $PROTOCOL
Total Supply: 1,000,000,000
Type: Fixed supply with protocol buyback

Distribution:
  Community Rewards:  40% (400M) — linear emission over 4 years
  Team:               20% (200M) — 1yr cliff, 4yr vesting
  Investors:          15% (150M) — 6mo lock, 2yr vesting
  Treasury:           15% (150M) — DAO governance controlled
  Liquidity:          10% (100M) — initial DEX liquidity

Value Accrual:
  - 10% of protocol fees → buyback and burn
  - Stakers earn 50% of protocol fees (ETH)
  - Target staking APY: 8-15% based on participation rate

Emission Curve:
  Year 1: 100M tokens released
  Year 2: 80M tokens released  
  Year 3: 60M tokens released
  Year 4: 40M tokens released (end of emissions)
```
