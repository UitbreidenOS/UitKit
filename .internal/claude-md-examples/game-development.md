# CLAUDE.md — Unity/Godot Game Project (Annotated Example)
> Game projects demand strict asset pipeline discipline, scene/prefab ownership rules, and physics/rendering constraints that generic templates miss entirely.

<!-- ANNOTATION: Opening lines set the hard boundaries fast. Game projects have two failure modes: Claude touching generated/binary assets it shouldn't, and Claude not knowing which engine version matters for API calls. State both immediately. -->
This is a Unity 6 / Godot 4.x project. Do NOT modify `.meta` files, generated `.import` files, binary assets (`.png`, `.wav`, `.fbx`, `.glb`), or any file under `Assets/ThirdParty/`. These are either engine-managed or licensed third-party — editing them breaks the asset pipeline or violates license terms.

Engine version: **Unity 6.0.0f1** (or Godot 4.3 if using the Godot branch).
Render pipeline: **URP** (Unity) / **Forward+** (Godot).
Target platforms: PC (primary), WebGL (secondary).

---

<!-- ANNOTATION: Stack section for game projects must go beyond language/framework. Claude needs to know the physics backend, audio system, and serialization format because these constrain which patterns are valid. A Unity project using DOTS is architecturally incompatible with MonoBehaviour advice. -->
## Stack and Tools

- **Engine:** Unity 6 (MonoBehaviour + URP) — not DOTS, not ECS
- **Language:** C# 10, .NET 7 (Unity-managed runtime)
- **Scripting backend:** IL2CPP for builds, Mono for Editor
- **Physics:** Unity PhysicsX (3D); no Havok
- **Audio:** FMOD Studio 2.02 via the FMOD Unity integration
- **UI:** UI Toolkit (not legacy uGUI or NGUI)
- **Version control:** Git + Git LFS for all binary assets
- **Build system:** Unity Cloud Build (CI); local builds via `build.sh`
- **Testing:** Unity Test Framework (EditMode + PlayMode)
- **Scene format:** YAML text serialization (force-text enabled)

---

<!-- ANNOTATION: Game projects need explicit scene ownership rules. Without them, Claude will cheerfully merge conflicting scene files or add objects to scenes it has no context for. Name the authoritative scenes and who/what owns them. -->
## Scene and Asset Ownership

- `Assets/Scenes/Main.unity` — production scene, do not restructure hierarchy
- `Assets/Scenes/Dev_Sandbox.unity` — safe for prototyping and throwaway tests
- Prefabs live in `Assets/Prefabs/` — always edit prefabs in Prefab Mode, never unpack in scene
- ScriptableObjects live in `Assets/Data/` — treat as read-only config unless explicitly asked to change values
- Animations live in `Assets/Animations/` — never hand-edit `.anim` or `.controller` files; use the Animator window

---

<!-- ANNOTATION: Conventions for game code differ from web code. Frame-rate dependency, Update() ordering, and GC pressure are game-specific correctness concerns, not style preferences. List them as hard rules, not suggestions. -->
## Key Conventions

**C# / Unity patterns:**
- Never use `Find`, `FindObjectOfType`, or `FindWithTag` at runtime — inject dependencies via Inspector or ServiceLocator
- All per-frame logic goes in `Update()` or `FixedUpdate()` — no `Task.Delay`, no `Thread.Sleep` on the main thread
- Use `Coroutine` for timed sequences; use `UniTask` (already imported) for async/await
- Avoid allocations in hot paths: no LINQ in `Update()`, no string concatenation in loops, no `new` in physics callbacks
- `[SerializeField] private` for Inspector-exposed fields — never `public` unless required by an interface
- All MonoBehaviours follow: fields → Unity callbacks (Awake/Start/OnEnable/Update/OnDisable) → public methods → private methods

**Scene/hierarchy conventions:**
- Root objects use PascalCase; child objects use lowercase-hyphen
- Every scene has exactly one `_GameManager` root object holding global state scripts
- Lighting and camera rigs live under `_Environment` — do not reparent them

**Godot (if on the Godot branch):**
- GDScript 2.0 only — no GDScript 1.x syntax
- Nodes follow the single-responsibility principle — one script per node, no god-node scripts over 200 lines
- Signals over direct node references for cross-tree communication
- `@export` for Inspector fields; `@onready` for node references cached in `_ready()`

---

<!-- ANNOTATION: Performance constraints are first-class in games. Listing draw call and memory budgets gives Claude a concrete optimization target rather than vague "be performant" guidance. Without numbers, it will over-engineer or under-optimize. -->
## Performance Budgets

- Draw calls (PC): < 300 per frame at 1080p
- Active GameObjects: < 2000 in any scene
- Texture memory: < 512 MB total loaded
- Physics rigidbodies: < 150 active simultaneously
- GC allocations per frame: 0 KB target in gameplay loop (use profiler markers to verify)

When generating code that runs per-frame or inside physics callbacks, explicitly reason about allocation and cache pressure before writing the implementation.

---

<!-- ANNOTATION: What-not-to-do sections in game projects need engine-specific anti-patterns. Generic "don't break prod" warnings don't help. The anti-patterns here would each silently corrupt the project in ways that take hours to debug. -->
## What Not To Do

- Do not modify `.meta` files — Unity uses these to track GUIDs; changing one breaks all references to that asset
- Do not add `using System.Linq` to MonoBehaviour files without confirming there are no `Update()` usages — LINQ allocates
- Do not use `Resources.Load` for new features — use Addressables instead (already configured)
- Do not change `ProjectSettings/` files except `InputManager.asset` and `TagManager.asset`
- Do not add packages via `manifest.json` without checking the URP compatibility matrix first
- Do not write shader code without asking — shaders must be hand-tested on the WebGL target

---

<!-- ANNOTATION: Input system choice is an unusual but critical call-out. Unity has two input systems and they are mutually exclusive at runtime. Getting this wrong means controls silently stop working in builds. -->
## Input System

This project uses the **new Unity Input System** (package: `com.unity.inputsystem`). Do NOT use the legacy `Input.GetKey` / `Input.GetAxis` API — it is disabled in project settings. All input is routed through `PlayerInput` components and `InputActionAsset` files in `Assets/Input/`.

---

<!-- ANNOTATION: Multiplayer/networking projects need explicit authority rules. If this were a networked game, you would add NetCode for GameObjects ownership rules here. This placeholder shows where that section lives. -->
## Networking (if applicable)

Currently single-player. If adding multiplayer: this project targets **Unity Netcode for GameObjects** (NGO). All state that crosses the network must live on a `NetworkObject` with explicit ownership. Do not use Mirror or Photon — they are not in the dependency tree.

---

<!-- ANNOTATION: Build and test instructions tailored to games need platform-specific notes. The WebGL build restriction is a real constraint — WebGL disallows threads and has a separate rendering path. Noting it here prevents Claude from suggesting threading patterns that only work on desktop. -->
## Building and Testing

```bash
# Editor tests (no headless build needed)
./test.sh editmode
./test.sh playmode

# Local PC build
./build.sh pc

# WebGL build (no threading, no unsafe code)
./build.sh webgl
```

WebGL builds: `unsafe` C# blocks are not allowed, `System.Threading.Thread` is not available, and all texture compression must be DXT/S3TC. Validate WebGL compatibility before suggesting any of those patterns.

---
