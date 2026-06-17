---
name: unreal-cpp
description: Unreal Engine C++ development — Actor/Component patterns, GameFramework, Blueprints integration, and UE5 best practices
allowed-tools: [Read, Write, Bash, Grep]
effort: high
---

## When to activate

- Building games with Unreal Engine 5
- Writing C++ gameplay classes with UPROPERTY/UFUNCTION macros
- Integrating C++ with Blueprint systems
- Using GAS (Gameplay Ability System) for abilities and effects
- Implementing Unreal's networking and replication model

## When NOT to use

- For Unity development (use unity-csharp)
- For Godot development (use godot-gdscript)
- For non-game Unreal projects

## Instructions

1. **Class hierarchy.** AActor → APawn → ACharacter → YourCharacter. Use components for functionality (UActorComponent).
2. **Reflection macros.** UPROPERTY for serialization/editor, UFUNCTION for Blueprint/networking. Always include generated.h.
3. **GameFramework.** GameMode (rules), GameState (match state), PlayerController (input), PlayerState (persistent data), HUD (UI).
4. **Blueprints integration.** Expose C++ to Blueprint with BlueprintReadWrite/Callable. Use BlueprintImplementableEvent for override points.
5. **Networking.** Server-authoritative. UFUNCTION(Server) for RPCs. Replicated properties with GetLifetimeReplicatedProps. OnRep for client notification.
6. **GAS.** GameplayAbility (actions), GameplayEffect (stat changes), GameplayTag (labels). Use for complex ability systems.
7. **Performance.** Object pooling (UPoolComponent), async loading (Soft References), Nanite for meshes, Lumen for lighting.

## Example

```cpp
// Unreal Actor Component with replication
UCLASS(ClassGroup=(Custom), meta=(BlueprintSpawnableComponent))
class MYGAME_API UHealthComponent : public UActorComponent {
    GENERATED_BODY()
    
    UPROPERTY(Replicated, BlueprintReadOnly, Category="Health", meta=(AllowPrivateAccess=true))
    float CurrentHealth = 100.f;
    
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Health")
    float MaxHealth = 100.f;
    
public:
    UFUNCTION(BlueprintCallable, Category="Health")
    void TakeDamage(float DamageAmount, AActor* DamageCauser);
    
    void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override {
        DOREPLIFETIME(UHealthComponent, CurrentHealth);
    }
};
```
