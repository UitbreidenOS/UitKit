---
name: unity-csharp
description: Unity C# development — MonoBehaviour lifecycle, DOTS/ECS, URP/HDRP, ScriptableObjects, and Unity best practices
allowed-tools: [Read, Write, Bash, Grep]
effort: high
---

## When to activate

- Building games or tools with Unity Engine
- Writing performant C# scripts with Unity API patterns
- Using DOTS/ECS for high-performance entity systems
- Working with URP/HDRP shader graphs and render pipelines
- Implementing Unity addressables and asset management

## When NOT to use

- For Unreal Engine development (use unreal-cpp)
- For Godot development (use godot-gdscript)
- For non-game Unity tooling

## Instructions

1. **Lifecycle awareness.** Awake (once) → OnEnable (each activation) → Start (first frame) → Update (every frame) → OnDisable → OnDestroy.
2. **Performance.** Object pooling for frequent instantiate/destroy. Avoid `GetComponent` in Update (cache in Start). Use `CompareTag` not `==`.
3. **Data-driven design.** ScriptableObjects for config data. JSON/YAML for level data. Addressables for async asset loading.
4. **DOTS/ECS.** Use for systems with 1000+ entities. Burst compiler for native performance. Jobs system for parallel work.
5. **Input System.** New Input System (package) over legacy. Action-based input. Support gamepad, keyboard, touch simultaneously.
6. **Testing.** Unity Test Framework (NUnit). Play mode tests for gameplay logic. Edit mode tests for editor tools.
7. **Build optimization.** IL2CPP for production. Strip engine code. Minimize shader variants. Profile with Unity Profiler.

## Example

```csharp
// ScriptableObject-driven weapon config
[CreateAssetMenu(menuName = "Weapons/Weapon Config")]
public class WeaponConfig : ScriptableObject {
    public float damage = 10f;
    public float fireRate = 0.2f;
    public float range = 50f;
    public AudioClip fireSound;
    public GameObject muzzleFlashPrefab;
}

public class WeaponController : MonoBehaviour {
    [SerializeField] private WeaponConfig config;
    private float nextFireTime;
    
    void Update() {
        if (Input.GetButton("Fire") && Time.time >= nextFireTime) {
            Fire();
            nextFireTime = Time.time + config.fireRate;
        }
    }
}
```
