---
name: level-design
description: Game level design — spatial composition, pacing, enemy placement, scripting events, and playtesting methodology
allowed-tools: [Read, Write, Grep]
effort: medium
---

## When to activate

- Designing game levels, dungeons, or maps
- Planning pacing curves and difficulty progression
- Scripting in-game events and triggers
- Setting up enemy encounters and spawn points
- Creating level design documentation and blockouts

## When NOT to use

- For procedural generation algorithms
- For environmental art and asset creation
- For narrative writing (use story skills)

## Instructions

1. **Define goals.** What does this level teach? What emotion should it evoke? What's the core challenge?
2. **Pacing curve.** Tension → Release → Escalation → Climax → Resolution. Alternate combat and exploration.
3. **Spatial composition.** Landmarks for navigation. Gating for progression. Loops and shortcuts for backtracking.
4. **Encounter design.** Enemy count, placement, and variety. Introduce → Develop → Master pattern. Safe rooms between encounters.
5. **Scripting.** Triggers (area enter, item pickup, time-based). State machines for complex sequences. Fail-safe conditions.
6. **Playtesting.** Record sessions. Track deaths, time-to-complete, confusion points. Iterate based on data, not assumptions.
7. **Documentation.** Top-down map with annotations. Encounter descriptions. Item placement rationale. Intended path vs alternatives.

## Example

```
Level Design Doc: "Abandoned Mine" (Level 3)

Theme: Claustrophobic, dark, discovering ancient ruins
Duration: 15-20 minutes
Difficulty: Medium (player has basic abilities)

Pacing:
  0-3min: Exploration, environmental storytelling (tutorial for flashlight)
  3-6min: First enemy encounter (2 weak enemies, teaches combat)
  6-9min: Puzzle section (power restoration, opens new areas)
  9-12min: Combat escalation (4 enemies + 1 elite)
  12-15min: Boss encounter (mine guardian)
  15-18min: Reward area, shortcut back to hub

Key Landmarks: Broken elevator (start), Power room (mid), Guardian chamber (end)
```
