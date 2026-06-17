---
name: cross-chain-bridge
description: Build cross-chain messaging and asset bridging — lock-and-mint, liquidity networks, and message verification
allowed-tools: [Read, Write, Grep]
effort: high
---

## When to activate

- Building token bridges between EVM chains
- Implementing cross-chain messaging protocols
- Designing wrapped asset mechanisms (wrapped ETH on Polygon, etc.)
- Integrating existing bridges (LayerZero, Wormhole, Axelar)
- Building cross-chain NFT bridges

## When NOT to use

- For single-chain applications
- For centralized exchange transfers
- For off-chain cross-database synchronization

## Instructions

1. **Choose bridge pattern.** Lock-and-mint (canonical), liquidity network (fast), or message-passing (general).
2. **Select verification.** Validators (centralized), optimistic (fraud proofs), or light client (trustless but expensive).
3. **Implement lock side.** Deposit contract, event emission, nonce tracking, replay protection.
4. **Implement mint side.** Verification of source chain event, mint/claim function, replay protection.
5. **Handle edge cases.** Source chain reorgs, validator downtime, stuck transactions, partial fills.
6. **Security.** Multi-sig for validators, rate limiting, maximum bridge amounts, emergency pause.
7. **Testing.** Simulate both chains with Foundry. Test reorg scenarios, validator failures, concurrent bridges.

## Example

```
Lock-and-Mint Bridge Flow:

Source Chain (Ethereum):
1. User deposits 1 ETH to Bridge contract
2. Bridge emits LockedEvent(user, amount, destinationChain, nonce)
3. Relayer picks up event

Destination Chain (Polygon):
4. Relayer submits proof of LockedEvent
5. Verifier confirms event authenticity (validator signatures)
6. Bridge mints 1 WETH on Polygon to user
7. User can redeem WETH back to ETH via reverse flow
```
