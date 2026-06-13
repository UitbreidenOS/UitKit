# Développement de jeux

## Quand activer
Tâches de développement de jeux Unity ou Unreal — implémenter Unity DOTS/ECS pour des comptages d'entités élevés, concevoir les boucles de jeu, architecturer les multijoueurs avec prédiction côté client et réconciliation serveur, optimiser les budgets de frame pour atteindre 60fps, profiler avec Unity Profiler, charger les ressources de manière asynchrone avec Addressables, ou concevoir les jobs Burst compilés parallèles pour les systèmes de physique et de mouvement.

## Quand ne PAS utiliser
Jeux basés sur le web utilisant Phaser ou Three.js (moteurs de jeux JavaScript — ensemble de compétences différent). Simples prototypes 2D dans Godot où DOTS/ECS est excessif. Visualisation de données ou simulations qui empruntent les concepts de boucle de jeu mais ne sont pas des jeux interactifs. Animations d'applications mobiles qui utilisent Unity comme moteur de rendu sans logique de gameplay.

## Instructions

### Compromis MonoBehaviour vs ECS

Utiliser MonoBehaviour pour :
- Le prototypage et l'interface utilisateur (intégration directe de l'éditeur Unity, itération rapide)
- Les fonctionnalités avec <100 entités (gestionnaires de scène, contrôleurs de joueur, contrôleurs d'interface utilisateur)
- L'intégration du SDK tiers qui suppose le cycle de vie MonoBehaviour

Utiliser ECS pour :
- 1 000+ entités qui partagent le même comportement (balles, ennemis, particules, projectiles)
- Simulation physique avec performance prévisible
- Les scénarios où les allocations GC causent des pics de frame

Ne pas mélanger les architectures à la légère — utiliser un pont MonoBehaviour mince pour passer les entrées aux systèmes ECS et lire l'état ECS pour le rendu d'interface utilisateur.

### Architecture Unity DOTS ECS

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

Système avec job Burst compilé parallèle :

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

**Exigences du compilateur Burst** : pas d'objets gérés (pas de `string`, pas de `List<T>`, pas d'`Object` Unity), pas d'état mutable `static`, pas de boxing. Utiliser `NativeArray<T>`, `NativeHashMap<K,V>`, et `FixedString` à la place.

### Structure de la boucle de jeu

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

Ne jamais appeler `Physics.Simulate()` manuellement dans Update — cela désynchronise de FixedUpdate et produit un comportement non déterministe.

### Pooling d'objets

Instantiate est coûteux : il exécute l'allocation, le constructeur, Awake, OnEnable, et peut déclencher GC. Pré-allouer des pools au chargement de scène :

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

Unity 2021+ a un `ObjectPool<T>` intégré — l'utiliser pour les nouveaux projets au lieu de créer le vôtre.

### Multijoueurs : prédiction côté client et réconciliation serveur

La prédiction côté client empêche le lag d'entrée — le client applique immédiatement l'entrée localement et l'envoie au serveur. Le serveur est autoritaire ; quand le client reçoit une position corrigée, il se réconcilie :

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

### Budget de frame et profilage

60fps = 16,7ms par frame. Ventilation du budget :
- Rendu : ~8ms
- Physique (FixedUpdate) : ~3ms
- Logique de jeu / ECS : ~3ms
- Audio + surcoût : ~2ms

Utiliser Unity Profiler pour identifier les violations :
1. Ouvrir Profiler (Window > Analysis > Profiler), enregistrer 300 frames dans l'éditeur.
2. Trier par « Self ms » pour trouver les méthodes individuelles les plus coûteuses.
3. Chercher les pics GC Alloc — ce sont eux qui déclenchent les pauses GC.Collect. Éliminer les allocations par frame (concaténation de chaîne, LINQ, `new` dans Update).
4. Profiler en profondeur un frame spécifique pour voir la pile d'appels complète.
5. Utiliser Burst Inspector pour vérifier que les jobs compilés Burst ne montrent pas d'avertissements de code géré.

### Addressables pour le chargement asynchrone d'actifs

Charger les actifs de manière asynchrone pour éviter les hoquets de frame à partir de `Resources.Load` synchrone :

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

Regrouper les actifs par modèle d'utilisation dans la fenêtre Addressables Groups — regrouper les actifs chargés ensemble afin qu'un seul téléchargement récupère toutes les ressources requises. Utiliser l'outil Addressables Analyze pour détecter la duplication d'actifs sur les bundles.

## Exemple

Concevoir un système de mouvement ECS dans Unity DOTS pour 5 000 entités simultanées à 60fps :

1. Définir `MovementComponent` (Velocity, Speed) et `TransformComponent` (Position, Rotation) en tant que structs `IComponentData`.
2. Implémenter `MovementSystem : ISystem` avec un `MoveJob : IJobEntity` décoré avec `[BurstCompile]`. Le job exécute `ScheduleParallel()` pour distribuer le travail sur les threads de travail.
3. Générer 5 000 entités ennemies dans `OnCreate` en utilisant `EntityCommandBuffer` — chacune avec `EnemyTag`, `MovementComponent`, et `TransformComponent`.
4. Vérifier dans Unity Profiler : le système ECS se termine dans les 1ms/frame sur le matériel de bureau. Zéro allocations GC dans le chemin `Update`.
5. Câbler un pont MonoBehaviour mince qui lit le compte d'entités ECS pour l'HUD et passe la position du joueur à un système de ciblage ECS via `SystemAPI.SetSingleton`.

---
