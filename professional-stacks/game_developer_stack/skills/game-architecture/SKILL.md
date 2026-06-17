---
name: game-architecture
description: Design game architecture — ECS patterns, state machines, entity systems, and component composition
allowed-tools: [Read, Write, Grep]
effort: high
---

## When to activate

- Designing architecture for a new game project
- Choosing between OOP, ECS, or hybrid patterns
- Planning game state management and scene transitions
- Designing component/entity systems for scalability
- Structuring game logic for modding support

## When NOT to use

- For non-game application architecture
- For game art pipeline or audio design
- For engine-specific implementation details

## Instructions

1. **Choose architecture pattern.** OOP (Unity MonoBehaviour), ECS (Unity DOTS, custom), or hybrid. Consider team size and complexity.
2. **Define game loop.** Fixed update (physics) vs variable update (rendering) vs late update (camera follow). Input handling priority.
3. **State management.** Finite State Machine (FSM) for simple, Hierarchical FSM for complex, Behavior Trees for AI.
4. **Entity system.** Entities (ID), Components (data), Systems (logic). Data-driven design. Prefab/factory pattern for instantiation.
5. **Event system.** Observer pattern for loose coupling. Event bus for global events. Direct references for hot paths.
6. **Scene management.** Scene loading/unloading, object pooling, persistent managers (audio, save, UI).
7. **Modding hooks.** Expose data files (JSON/Lua), event hooks, asset override system.

## Example

```
Game Architecture: 2D Platformer

Pattern: Hybrid (OOP for gameplay, ECS for particle/bullet systems)
Game Loop:
  FixedUpdate (50Hz): Physics, collision, movement
  Update (variable): Input, animation, UI
  LateUpdate: Camera follow

State Machine:
  Player: Idle → Running → Jumping → Falling → Landing
  Game: Loading → Playing → Paused → GameOver

Systems:
  InputSystem → MovementSystem → CollisionSystem → DamageSystem → UISystem
```
