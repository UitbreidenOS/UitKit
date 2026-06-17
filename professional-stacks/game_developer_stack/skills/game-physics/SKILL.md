---
name: game-physics
description: Game physics systems — collision detection, rigid body simulation, raycasting, and custom physics implementations
allowed-tools: [Read, Write, Grep]
effort: medium
---

## When to activate

- Implementing custom physics behaviors beyond engine defaults
- Designing collision layers and filtering systems
- Optimizing physics performance for large numbers of bodies
- Building custom raycasting and spatial query systems
- Creating character controllers with precise movement

## When NOT to use

- For simple trigger-based interactions
- For visual-only animations without physical simulation
- For particle effects (use VFX systems)

## Instructions

1. **Collision layers.** Define clear layers: Player, Enemy, Projectile, Environment, Pickup. Use masks for filtering.
2. **Rigid body tuning.** Mass, drag, friction, restitution. Continuous collision for fast objects. Sleep thresholds for performance.
3. **Character controller.** Kinematic (manual movement) vs dynamic (force-based). Kinematic gives more control. Custom gravity for game feel.
4. **Raycasting.** Use for ground detection, line-of-sight, aiming. Layer masks to filter hits. Batch raycasts when possible.
5. **Joints and constraints.** Hinge, spring, slider joints for mechanical systems. Breakable joints for destruction.
6. **Performance.** Physics at fixed timestep. LOD physics (simple colliders far away). Disable sleeping bodies. Limit solver iterations.
7. **Custom physics.** For non-standard needs. AABB collision detection, spatial partitioning (quadtree/octree), custom gravity fields.

## Example

```
Physics Setup: 2D Platformer

Collision Layers:
  Layer 0: Environment (walls, floors, platforms)
  Layer 1: Player (collides with 0, 2, 3)
  Layer 2: Enemies (collides with 0, 1, 3)
  Layer 3: Projectiles (collides with 0, 1, 2)

Character Controller: Kinematic
  - Custom gravity (higher fall speed for snappy feel)
  - Coyote time (100ms grace after leaving edge)
  - Jump buffer (queue jump input 100ms before landing)
  - Ground check: downward raycast + capsule overlap
```
