---
name: game-dev
updated: 2026-06-13
---

# Game Development

## When to activate
Unity or Unreal game development tasks — implementing Unity DOTS/ECS for high entity counts, designing game loops, architecting multiplayer with client-side prediction and server reconciliation, optimizing frame budgets to hit 60fps, profiling with Unity Profiler, loading assets asynchronously with Addressables, or designing Burst-compiled parallel jobs for physics and movement systems.

## When NOT to use
Web-based games using Phaser or Three.js (JavaScript game engines — different skill set). Simple 2D prototypes in Godot where DOTS/ECS is overkill. Data visualization or simulations that borrow game-loop concepts but are not interactive games. Mobile app animations that use Unity as a rendering engine without gameplay logic.

## Instructions

### MonoBehaviour vs ECS Trade-off

Use MonoBehaviour for:
- Prototyping and UI (direct Unity editor integration, rapid iteration)
- Features with <100 entities (scene managers, player controllers, UI controllers)
- Third-party SDK integration that assumes MonoBehaviour lifecycle

Use ECS for:
- 1,000+ entities that share the same behavior (bullets, enemies, particles, projectiles)
- Physics simulation with predictable performance
- Scenarios where GC allocations cause frame spikes

Do not mix architectures carelessly — use a thin MonoBehaviour bridge to pass input to ECS systems and read ECS state for UI rendering.

### Unity DOTS ECS Architecture

```csharp
// Component — pure data, no logic, 4-byte aligned struct
public struct MovementComponent : IComponentData
{
    public float3 Velocity;
    public float  Speed;
}

public struct TransformComponent : IComponentData
{
    public float3 Position;
    public quaternion Rotation;
}

// Tag component — zero-size, used for filtering queries
public struct EnemyTag : IComponentData { }
```

System with Burst-compiled parallel job:

```csharp
[BurstCompile]
public partial struct MovementSystem : ISystem
{
    [BurstCompile]
    public void OnUpdate(ref SystemState state)
    {
        float deltaTime = SystemAPI.Time.DeltaTime;

        // Schedule parallel job across all entities with Movement + Transform
        new MoveJob { DeltaTime = deltaTime }
            .ScheduleParallel();
    }
}

[BurstCompile]
public partial struct MoveJob : IJobEntity
{
    public float DeltaTime;

    [BurstCompile]
    public void Execute(ref TransformComponent transform,
                        in MovementComponent movement)
    {
        transform.Position += movement.Velocity * movement.Speed * DeltaTime;
    }
}
```

**Burst compiler requirements**: no managed objects (no `string`, no `List<T>`, no Unity `Object`), no `static` mutable state, no boxing. Use `NativeArray<T>`, `NativeHashMap<K,V>`, and `FixedString` instead.

### Game Loop Structure

```csharp
// FixedUpdate — physics, deterministic simulation (default 50 Hz = 0.02s)
void FixedUpdate()
{
    // Rigidbody forces, collision response, physics queries
    // Run at fixed timestep — do NOT put input handling here
}

// Update — input, game logic, AI, animations (runs every frame)
void Update()
{
    ProcessInput();
    UpdateGameState(Time.deltaTime);
    // ECS systems auto-run here via World.Update()
}

// LateUpdate — camera follow, post-processing, UI position sync
// Guaranteed to run AFTER all Update() calls this frame
void LateUpdate()
{
    CameraFollow();
    UpdateHUD();
}
```

Never call `Physics.Simulate()` manually in Update — it desynchronizes from FixedUpdate and produces non-deterministic behavior.

### Object Pooling

Instantiate is expensive: it runs allocation, constructor, Awake, OnEnable, and can trigger GC. Pre-allocate pools at scene load:

```csharp
public class BulletPool : MonoBehaviour
{
    [SerializeField] private GameObject bulletPrefab;
    [SerializeField] private int poolSize = 200;

    private Queue<GameObject> _pool = new();

    void Awake()
    {
        for (int i = 0; i < poolSize; i++)
        {
            var obj = Instantiate(bulletPrefab);
            obj.SetActive(false);
            _pool.Enqueue(obj);
        }
    }

    public GameObject Get(Vector3 position, Quaternion rotation)
    {
        if (_pool.Count == 0) return null;   // or expand pool — never Instantiate at runtime
        var obj = _pool.Dequeue();
        obj.transform.SetPositionAndRotation(position, rotation);
        obj.SetActive(true);
        return obj;
    }

    public void Return(GameObject obj)
    {
        obj.SetActive(false);
        _pool.Enqueue(obj);
    }
}
```

Unity 2021+ has a built-in `ObjectPool<T>` — use it for new projects instead of rolling your own.

### Multiplayer: Client-Side Prediction and Server Reconciliation

Client-side prediction prevents input lag — the client immediately applies input locally and sends it to the server. The server is authoritative; when the client receives a corrected position it reconciles:

```csharp
public class PlayerController : MonoBehaviour
{
    private readonly Queue<InputSnapshot> _pendingInputs = new();
    private int _inputSequence = 0;

    void Update()
    {
        var input = new InputSnapshot
        {
            SequenceNumber = _inputSequence++,
            Move = new Vector2(Input.GetAxis("Horizontal"), Input.GetAxis("Vertical")),
            Timestamp = Time.time,
        };

        // Apply immediately (prediction)
        ApplyInput(input);
        _pendingInputs.Enqueue(input);

        // Send to server
        NetworkManager.SendInput(input);
    }

    // Called when server sends authoritative state
    public void OnServerStateReceived(ServerState state)
    {
        // Discard inputs the server has already processed
        while (_pendingInputs.Count > 0 &&
               _pendingInputs.Peek().SequenceNumber <= state.LastProcessedInput)
            _pendingInputs.Dequeue();

        // If server position diverges beyond threshold — reconcile
        if (Vector3.Distance(transform.position, state.Position) > 0.1f)
        {
            transform.position = state.Position;
            // Re-apply unacknowledged inputs on top of server state
            foreach (var pendingInput in _pendingInputs)
                ApplyInput(pendingInput);
        }
    }

    private void ApplyInput(InputSnapshot input)
    {
        transform.Translate(new Vector3(input.Move.x, 0, input.Move.y)
                            * Speed * Time.deltaTime);
    }
}
```

### Frame Budget and Profiling

60fps = 16.7ms per frame. Budget breakdown:
- Rendering: ~8ms
- Physics (FixedUpdate): ~3ms
- Game logic / ECS: ~3ms
- Audio + overhead: ~2ms

Use Unity Profiler to identify violations:
1. Open Profiler (Window > Analysis > Profiler), record 300 frames in-editor.
2. Sort by "Self ms" to find the most expensive individual methods.
3. Look for GC Alloc spikes — these trigger GC.Collect pauses. Eliminate per-frame allocations (string concatenation, LINQ, `new` in Update).
4. Deep profile a specific frame to see the full call stack.
5. Use Burst Inspector to verify Burst-compiled jobs show no managed code warnings.

### Addressables for Async Asset Loading

Load assets asynchronously to avoid frame hitches from synchronous `Resources.Load`:

```csharp
using UnityEngine.AddressableAssets;
using UnityEngine.ResourceManagement.AsyncOperations;

public class AssetLoader : MonoBehaviour
{
    [SerializeField] private AssetReferenceGameObject enemyRef;

    async void SpawnEnemy(Vector3 position)
    {
        var handle = enemyRef.LoadAssetAsync<GameObject>();
        await handle.Task;

        if (handle.Status == AsyncOperationStatus.Succeeded)
        {
            Instantiate(handle.Result, position, Quaternion.identity);
        }
        else
        {
            Debug.LogError($"Failed to load enemy asset: {handle.OperationException}");
        }
    }
}
```

Group assets by usage pattern in the Addressables Groups window — bundle assets loaded together so a single download fetches all required resources. Use the Addressables Analyze tool to detect asset duplication across bundles.

## Example

Design an ECS movement system in Unity DOTS for 5,000 simultaneous entities at 60fps:

1. Define `MovementComponent` (Velocity, Speed) and `TransformComponent` (Position, Rotation) as `IComponentData` structs.
2. Implement `MovementSystem : ISystem` with a `MoveJob : IJobEntity` decorated with `[BurstCompile]`. The job runs `ScheduleParallel()` to distribute work across worker threads.
3. Spawn 5,000 enemy entities in `OnCreate` using `EntityCommandBuffer` — each with `EnemyTag`, `MovementComponent`, and `TransformComponent`.
4. Verify in Unity Profiler: ECS system completes within 1ms/frame on desktop hardware. Zero GC allocations in `Update` path.
5. Wire a thin MonoBehaviour bridge that reads ECS entity count for the HUD and passes player position to an ECS targeting system via `SystemAPI.SetSingleton`.

---
