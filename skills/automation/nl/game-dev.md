# Game Development

## Wanneer activeren
Unity of Unreal game development taken — implementeren van Unity DOTS/ECS voor hoge entity counts, ontwerpen van game loops, architecting multiplayer met client-side prediction en server reconciliation, optimaliseren frame budgets om 60fps te raken, profiling met Unity Profiler, async loading assets met Addressables, of ontwerpen van Burst-compiled parallel jobs voor physics en movement systems.

## Wanneer NIET gebruiken
Web-gebaseerde games met Phaser of Three.js (JavaScript game engines — ander skill set). Eenvoudige 2D prototypes in Godot waarbij DOTS/ECS overkill is. Data visualization of simulations die game-loop concepts lenen maar geen interactive games zijn. Mobile app animations die Unity als rendering engine gebruiken zonder gameplay logic.

## Instructies

### MonoBehaviour vs ECS Trade-off

Gebruik MonoBehaviour voor:
- Prototyping en UI (direct Unity editor integratie, rapid iteration)
- Features met <100 entities (scene managers, player controllers, UI controllers)
- Third-party SDK integratie dat MonoBehaviour lifecycle aanneemt

Gebruik ECS voor:
- 1.000+ entities die dezelfde behavior delen (bullets, enemies, particles, projectiles)
- Physics simulatie met predictable performance
- Scenario's waarbij GC allocations frame spikes veroorzaken

Meng architectures niet onzorgvuldig — gebruik thin MonoBehaviour bridge om input naar ECS systems door te geven en ECS state voor UI rendering te lezen.

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

System met Burst-compiled parallel job:

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

**Burst compiler vereisten**: geen managed objects (geen `string`, geen `List<T>`, geen Unity `Object`), geen `static` mutable state, geen boxing. Gebruik `NativeArray<T>`, `NativeHashMap<K,V>`, en `FixedString` in plaats daarvan.

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

Roep nooit `Physics.Simulate()` handmatig aan in Update — het desynchroniseert van FixedUpdate en produceer non-deterministic behavior.

### Object Pooling

Instantiate is duur: het voert allocation, constructor, Awake, OnEnable uit, en kan GC triggeren. Pre-allocate pools bij scene load:

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

Unity 2021+ heeft ingebouwde `ObjectPool<T>` — gebruik het voor nieuwe projects in plaats van het zelf te rollen.

### Multiplayer: Client-Side Prediction and Server Reconciliation

Client-side prediction voorkomt input lag — client past input onmiddellijk lokaal toe en stuurt naar server. Server is authoritative; wanneer client gecorrigeerde positie ontvangt het reconcilieert:

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

Gebruik Unity Profiler om violations te identificeren:
1. Open Profiler (Window > Analysis > Profiler), record 300 frames in-editor.
2. Sort op "Self ms" om meest dure individuele methods te vinden.
3. Zoeken naar GC Alloc spikes — deze triggeren GC.Collect pauses. Elimineer per-frame allocations (string concatenation, LINQ, `new` in Update).
4. Deep profile een specifieke frame om volledige call stack te zien.
5. Gebruik Burst Inspector om te verifiëren Burst-compiled jobs tonen geen managed code warnings.

### Addressables for Async Asset Loading

Laad assets asynchroon om frame hitches van synchrone `Resources.Load` te vermijden:

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

Groepeer assets per usage pattern in Addressables Groups window — bundle assets geladen samen zodat download alle vereiste resources haalt. Gebruik Addressables Analyze tool om asset duplication over bundles te detecteren.

## Voorbeeld

Ontwerp ECS movement system in Unity DOTS voor 5.000 gelijktijdige entities op 60fps:

1. Definieer `MovementComponent` (Velocity, Speed) en `TransformComponent` (Position, Rotation) als `IComponentData` structs.
2. Implementeer `MovementSystem : ISystem` met `MoveJob : IJobEntity` gedecoreerd met `[BurstCompile]`. Job voert `ScheduleParallel()` uit om work over worker threads te distribueren.
3. Spawn 5.000 enemy entities in `OnCreate` met `EntityCommandBuffer` — elk met `EnemyTag`, `MovementComponent`, en `TransformComponent`.
4. Verifieer in Unity Profiler: ECS system compleet binnen 1ms/frame op desktop hardware. Zero GC allocations in `Update` path.
5. Wire thin MonoBehaviour bridge dat ECS entity count voor HUD leest en player position naar ECS targeting system passed via `SystemAPI.SetSingleton`.

---
