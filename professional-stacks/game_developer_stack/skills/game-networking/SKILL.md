---
name: game-networking
description: Multiplayer game networking — client-server architecture, state synchronization, rollback, and lag compensation
allowed-tools: [Read, Write, Grep]
effort: high
---

## When to activate

- Designing multiplayer networking architecture
- Implementing client-server synchronization
- Building rollback netcode for fighting/action games
- Implementing lag compensation and hit validation
- Choosing between state sync, lockstep, or rollback models

## When NOT to use

- For single-player games
- For turn-based games with simple state sync
- For MMO server infrastructure (different scale)

## Instructions

1. **Choose model.** Authoritative server (FPS, competitive), Lockstep (RTS, fighting), P2P (co-op, small player count).
2. **State sync.** Server sends world state at tick rate (10-60Hz). Clients interpolate between snapshots. Predict locally.
3. **Client prediction.** Client runs game logic immediately, server validates. Reconcile on server correction (rubber-banding).
4. **Rollback netcode.** Predict opponent input, roll back and re-simulate on correction. Used in fighting games. Frame advantage ≤ 3 frames.
5. **Lag compensation.** Server rewinds to client's perceived time for hit validation. `ServerRewind(clientTimestamp) → check hit → restore`.
6. **Bandwidth.** Delta compression (only send changed data). Priority system (nearby > far). Interest management (AOI).
7. **Security.** Server-authoritative for all critical logic. Client is display only. Validate all client inputs. Anti-cheat at server level.

## Example

```
Networking Model: Competitive FPS (12 players)

Architecture: Authoritative server at 64 tick
Client: Predicts movement, reconciles on server correction
Interpolation: 100ms buffer for other players (smooth at cost of latency)
Hit Detection: Server-side lag compensation (rewind to client time)
Bandwidth: ~30KB/s per client (delta compressed state updates)
```
