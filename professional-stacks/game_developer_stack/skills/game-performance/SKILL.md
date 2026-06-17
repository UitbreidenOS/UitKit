---
name: game-performance
description: Game performance profiling and optimization — frame budget management, draw calls, memory, and platform-specific tuning
allowed-tools: [Read, Grep]
effort: high
---

## When to activate

- Profiling game performance bottlenecks
- Reducing frame time to meet target FPS
- Optimizing draw calls and rendering pipeline
- Reducing memory usage and allocation spikes
- Preparing for platform-specific performance requirements

## When NOT to use

- During initial prototyping (premature optimization)
- For non-realtime applications
- For server-side game backend performance

## Instructions

1. **Profile first.** Use engine profiler (Unity/Unreal/Godot). Identify top 3 frame time consumers. Never optimize blindly.
2. **Frame budget.** 16.6ms (60fps) or 8.3ms (120fps). Allocate: physics, animation, AI, rendering, UI. Each gets a budget.
3. **Rendering.** Reduce draw calls (batching, GPU instancing, SRP Batcher). LOD for distant objects. Occlusion culling. Texture atlases.
4. **Memory.** Object pooling for bullets, effects, enemies. Avoid allocations in Update/GC pressure. Texture compression. Streaming.
5. **CPU.** Move heavy work to jobs/threads. Physics at fixed rate. AI at lower frequency (every 5 frames). Cache expensive lookups.
6. **Platform targets.** Mobile: reduce fill rate, simplify shaders. Console: use async compute. PC: scalable quality settings.
7. **Continuous profiling.** CI pipeline with automated performance tests. Track frame time regression. Budget alerts in editor.

## Example

```
Performance Profile: Mobile Action Game (target 60fps on mid-range)

Frame Budget (16.6ms):
  Rendering:    6.0ms (36%) — 45 draw calls, GPU instanced
  Physics:      2.5ms (15%) — fixed 30Hz, simplified colliders
  AI:           1.5ms (9%)  — 10Hz update rate, spatial hash
  Animation:    2.0ms (12%) — LOD animation (distant = lower quality)
  UI:           1.0ms (6%)  — cached canvases, no layout rebuild
  Scripts:      2.0ms (12%) — object pooling, no GC allocs in gameplay
  Other:        1.6ms (10%) — audio, input, system

Total: 16.6ms — on budget ✓
```
