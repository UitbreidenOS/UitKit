# Desarrollo de Juegos

## Cuándo activar
Tareas de desarrollo de juegos en Unity o Unreal — implementación de Unity DOTS/ECS para recuentos altos de entidades, diseño de bucles de juego, arquitectura multijugador con predicción del lado del cliente y reconciliación del servidor, optimización de presupuestos de fotogramas para alcanzar 60fps, perfilado con Unity Profiler, carga de activos asincronamente con Addressables, o diseño de trabajos paralelos compilados con Burst para sistemas de física y movimiento.

## Cuándo NO usar
Juegos basados en web usando Phaser o Three.js (motores de juegos JavaScript — conjunto de habilidades diferente). Prototipos 2D simples en Godot donde DOTS/ECS es excesivo. Visualización de datos o simulaciones que toman prestados conceptos de bucle de juego pero no son juegos interactivos. Animaciones de aplicaciones móviles que usan Unity como motor de renderizado sin lógica de juego.

## Instrucciones

### Comercio MonoBehaviour vs ECS

Usar MonoBehaviour para:
- Prototipado e interfaz de usuario (integración directa del editor de Unity, iteración rápida)
- Características con <100 entidades (gestores de escena, controladores de jugador, controladores de interfaz de usuario)
- Integración de SDK de terceros que asume ciclo de vida de MonoBehaviour

Usar ECS para:
- 1,000+ entidades que comparten el mismo comportamiento (balas, enemigos, partículas, proyectiles)
- Simulación de física con rendimiento predecible
- Escenarios donde asignaciones de GC causan picos de fotogramas

No mezclar arquitecturas descuidadosamente — usar un puente MonoBehaviour delgado para pasar entrada a sistemas ECS y leer estado ECS para renderizado de interfaz de usuario.

### Arquitectura ECS DOTS de Unity

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

Sistema con trabajo paralelo compilado con Burst:

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

**Requisitos del compilador Burst**: sin objetos manejados (sin `string`, sin `List<T>`, sin `Object` de Unity), sin estado mutable `static`, sin boxing. Usar `NativeArray<T>`, `NativeHashMap<K,V>` y `FixedString` en su lugar.

### Estructura del Bucle de Juego

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

Nunca llamar a `Physics.Simulate()` manualmente en Update — desincroniza de FixedUpdate y produce comportamiento no determinista.

### Agrupamiento de Objetos

Instantiate es costoso: ejecuta asignación, constructor, Awake, OnEnable, y puede desencadenar GC. Pre-asignar grupos al cargar escena:

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

Unity 2021+ tiene `ObjectPool<T>` integrado — usarlo para nuevos proyectos en lugar de implementar el tuyo.

### Multijugador: Predicción del Lado del Cliente y Reconciliación del Servidor

La predicción del lado del cliente previene retraso de entrada — el cliente aplica inmediatamente la entrada localmente y la envía al servidor. El servidor es autoritario; cuando el cliente recibe una posición corregida se reconcilia:

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

### Presupuesto de Fotogramas y Perfilado

60fps = 16.7ms por fotograma. Desglose de presupuesto:
- Renderizado: ~8ms
- Física (FixedUpdate): ~3ms
- Lógica de juego / ECS: ~3ms
- Audio + gastos generales: ~2ms

Usar Unity Profiler para identificar violaciones:
1. Abrir Profiler (Window > Analysis > Profiler), grabar 300 fotogramas en editor.
2. Ordenar por "Self ms" para encontrar los métodos individuales más costosos.
3. Buscar picos de GC Alloc — estos desencadenan pausas de GC.Collect. Eliminar asignaciones por fotograma (concatenación de strings, LINQ, `new` en Update).
4. Perfilar profundamente un fotograma específico para ver la pila de llamadas completa.
5. Usar Burst Inspector para verificar que trabajos compilados con Burst muestren sin advertencias de código manejado.

### Addressables para Carga Asincrónica de Activos

Cargar activos asincronamente para evitar interrupciones de fotogramas de `Resources.Load` síncrono:

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

Agrupar activos por patrón de uso en la ventana de Addressables Groups — agrupar activos cargados juntos para que una sola descarga traiga todos los recursos requeridos. Usar la herramienta Addressables Analyze para detectar duplicación de activos entre grupos.

## Ejemplo

Diseño de un sistema de movimiento ECS en Unity DOTS para 5,000 entidades simultáneas a 60fps:

1. Definir `MovementComponent` (Velocity, Speed) y `TransformComponent` (Position, Rotation) como structs `IComponentData`.
2. Implementar `MovementSystem : ISystem` con `MoveJob : IJobEntity` decorado con `[BurstCompile]`. El trabajo ejecuta `ScheduleParallel()` para distribuir trabajo entre hilos de trabajo.
3. Generar 5,000 entidades enemigas en `OnCreate` usando `EntityCommandBuffer` — cada una con `EnemyTag`, `MovementComponent` y `TransformComponent`.
4. Verificar en Unity Profiler: sistema ECS se completa dentro de 1ms/fotograma en hardware de escritorio. Cero asignaciones de GC en ruta `Update`.
5. Cablear un puente MonoBehaviour delgado que lea recuento de entidades ECS para el HUD y pase posición del jugador a un sistema de objetivo ECS vía `SystemAPI.SetSingleton`.

---
