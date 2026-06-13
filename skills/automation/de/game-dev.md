# Game Development

## Wann aktivieren
Unity- oder Unreal-Game-Entwicklungsaufgaben — Implementierung von Unity DOTS/ECS für hohe Entity-Counts, Design von Game Loops, Architekturierung von Multiplayer mit Client-Side-Prediction und Server-Reconciliation, Optimierung von Frame-Budgets zum Erreichen von 60fps, Profiling mit Unity Profiler, asynchrones Laden von Assets mit Addressables, oder Designen von Burst-kompilierten parallelen Jobs für Physik- und Bewegungssysteme.

## Wann NICHT verwenden
Web-basierte Spiele mit Phaser oder Three.js (JavaScript-Game-Engines — verschiedene Skillset). Einfache 2D-Prototypen in Godot, bei denen DOTS/ECS Übertreibung ist. Datenvisualisierung oder Simulationen, die Game-Loop-Konzepte borgen, aber keine interaktiven Spiele sind. Mobile-App-Animationen, die Unity als Rendering-Engine verwenden, ohne Gameplay-Logik.

## Anweisungen

### MonoBehaviour vs ECS Trade-off

Verwenden Sie MonoBehaviour für:
- Prototyping und UI (direkte Unity-Editor-Integration, schnelle Iteration)
- Features mit <100 Entities (Scene Manager, Player Controller, UI Controller)
- Integration von Drittanbieter-SDK, die MonoBehaviour-Lebenszyklus voraussetzt

Verwenden Sie ECS für:
- 1.000+ Entities, die das gleiche Verhalten teilen (Bullets, Enemies, Particles, Projectiles)
- Physik-Simulation mit vorhersehbarer Leistung
- Szenarien, bei denen GC-Zuordnungen Frame-Spikes verursachen

Mischen Sie Architekturen nicht achtlos — verwenden Sie eine dünne MonoBehaviour-Brücke, um Input an ECS-Systeme zu übergeben, und lesen Sie ECS-Status für UI-Rendering.

### Unity DOTS ECS-Architektur

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

System mit Burst-kompiliertem parallelem Job:

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

**Burst-Compiler-Anforderungen**: keine verwalteten Objekte (kein `string`, kein `List<T>`, kein Unity `Object`), kein `static`-veränderbarer Zustand, kein Boxing. Verwenden Sie `NativeArray<T>`, `NativeHashMap<K,V>` und `FixedString` stattdessen.

### Game-Loop-Struktur

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

Rufen Sie niemals `Physics.Simulate()` manuell in Update auf — dies desynchronisiert mit FixedUpdate und erzeugt nicht-deterministisches Verhalten.

### Object Pooling

Instantiate ist teuer: es führt Zuordnung, Konstruktor, Awake, OnEnable aus und kann GC auslösen. Pools beim Scene-Load vorbelegen:

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

Unity 2021+ hat einen eingebauten `ObjectPool<T>` — verwenden Sie ihn statt Ihren eigenen für neue Projekte.

### Multiplayer: Client-Side-Prediction und Server-Reconciliation

Client-Side-Prediction verhindert Input-Latenz — der Client wendet Input sofort lokal an und sendet es zum Server. Der Server ist autoritativ; wenn der Client eine korrigierte Position erhält, wird sie abgeglichen:

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

### Frame-Budget und Profiling

60fps = 16,7ms pro Frame. Budget-Aufschlüsselung:
- Rendering: ~8ms
- Physik (FixedUpdate): ~3ms
- Game-Logik / ECS: ~3ms
- Audio + Overhead: ~2ms

Verwenden Sie Unity Profiler, um Verstöße zu identifizieren:
1. Öffnen Sie Profiler (Window > Analysis > Profiler), nehmen Sie 300 Frames im Editor auf.
2. Sortieren Sie nach "Self ms", um die teuersten einzelnen Methoden zu finden.
3. Suchen Sie nach GC-Alloc-Spitzen — diese triggern GC.Collect-Pausen. Eliminieren Sie Pro-Frame-Zuordnungen (String-Verkettung, LINQ, `new` in Update).
4. Profilieren Sie einen spezifischen Frame in die Tiefe, um die vollständige Call-Stack zu sehen.
5. Verwenden Sie Burst Inspector, um zu überprüfen, dass Burst-kompilierte Jobs keine verwalteten Code-Warnungen zeigen.

### Addressables für asynchrones Asset-Laden

Laden Sie Assets asynchron, um Frame-Ruckler durch synchrones `Resources.Load` zu vermeiden:

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

Gruppieren Sie Assets nach Verwendungsmuster im Addressables-Groups-Fenster — bündeln Sie gemeinsam geladene Assets, damit ein einzelner Download alle erforderlichen Ressourcen abruft. Verwenden Sie das Addressables-Analyze-Tool, um Asset-Duplizierung über Bundles hinweg zu erkennen.

## Beispiel

Design eines ECS-Bewegungssystems in Unity DOTS für 5.000 gleichzeitige Entities bei 60fps:

1. Definieren Sie `MovementComponent` (Velocity, Speed) und `TransformComponent` (Position, Rotation) als `IComponentData`-Structs.
2. Implementieren Sie `MovementSystem : ISystem` mit einem `MoveJob : IJobEntity`, das mit `[BurstCompile]` dekoriert ist. Der Job führt `ScheduleParallel()` aus, um Arbeit über Worker-Threads zu verteilen.
3. Spawnen Sie 5.000 Enemy-Entities in `OnCreate` unter Verwendung von `EntityCommandBuffer` — jede mit `EnemyTag`, `MovementComponent` und `TransformComponent`.
4. Überprüfen Sie in Unity Profiler: ECS-System wird innerhalb von 1ms/Frame auf Desktop-Hardware abgeschlossen. Null GC-Zuordnungen in `Update`-Pfad.
5. Verbinden Sie eine dünne MonoBehaviour-Brücke, die die ECS-Entity-Zahl für die HUD liest und die Player-Position an ein ECS-Targeting-System über `SystemAPI.SetSingleton` übergibt.

---
