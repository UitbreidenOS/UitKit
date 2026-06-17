---
name: godot-gdscript
description: Godot game development — GDScript/C# patterns, scene system, signals, and Godot 4 best practices
allowed-tools: [Read, Write, Bash, Grep]
effort: medium
---

## When to activate

- Building games with Godot 4 engine
- Designing scene trees and node compositions
- Using GDScript or C# for game logic
- Implementing Godot's signal-based event system
- Working with Godot's built-in editor and export pipeline

## When NOT to use

- For Unity or Unreal development
- For non-game Godot applications
- For Godot 3.x (API has changed significantly)

## Instructions

1. **Scene system.** Scenes are node trees. Compose complex scenes from smaller scenes. Use `PackedScene.instantiate()`.
2. **Node patterns.** `@onready` for cached nodes. `_ready()` for init. `_process()` for per-frame, `_physics_process()` for fixed-rate.
3. **Signals.** Decouple with signals: `signal health_changed(new_value)`. Connect in editor or code. Use `await` for signal sequences.
4. **Export variables.** `@export var speed: float = 200.0` for editor-editable. `@export_range`, `@export_enum` for constraints.
5. **State machines.** Use child nodes as states. `TransitionTo("running")` pattern. Consider LimboHSM plugin for complex FSMs.
6. **Performance.** Object pooling with `@onready var pool: Array`. Avoid `_process` on inactive objects. Use `call_deferred` for expensive ops.
7. **Export.** Configure export presets per platform. Use `Export Debug` to catch issues. Test on target hardware regularly.

## Example

```gdscript
# Character controller with state machine
extends CharacterBody2D

@export var speed: float = 200.0
@export var jump_force: float = -400.0
@export var gravity: float = 980.0

@onready var anim_player: AnimationPlayer = $AnimationPlayer

signal state_changed(new_state: String)

func _physics_process(delta: float) -> void:
    # Apply gravity
    if not is_on_floor():
        velocity.y += gravity * delta
    
    # Handle jump
    if Input.is_action_just_pressed("jump") and is_on_floor():
        velocity.y = jump_force
    
    # Horizontal movement
    var direction = Input.get_axis("move_left", "move_right")
    velocity.x = direction * speed
    
    move_and_slide()
```
