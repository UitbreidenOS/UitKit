# Plannotator Hook

Intercepts `ExitPlanMode` to let you review, annotate, approve, or abort Claude's plan before any execution begins. Displays each plan step in a simple CLI UI with per-step controls.

---

## What it does

When Claude finishes planning and is about to start executing, this hook pauses the session and presents every plan step interactively. You can approve the step, skip it, attach a note, or abort the entire plan. Skipped steps are flagged so Claude does not execute them. Notes are appended to the relevant step so Claude carries your constraints forward.

**Fires on:** `ExitPlanMode`

---

## settings.json

```json
{
  "hooks": {
    "ExitPlanMode": [{
      "hooks": [{"type": "command", "command": "python3 ~/.claude/hooks/plannotator.py"}]
    }]
  }
}
```

---

## Script: `~/.claude/hooks/plannotator.py`

```python
#!/usr/bin/env python3
import json
import sys

HELP = "[Enter] approve  [s] skip  [n] add note  [q] abort plan"

def prompt_step(index: int, total: int, step: str) -> tuple[str, str | None]:
    """
    Returns (action, note) where action is 'approve', 'skip', or 'abort'.
    """
    print(f"\n── Step {index}/{total} ──────────────────────────────────", flush=True)
    print(step, flush=True)
    print(f"\n{HELP}", flush=True)

    while True:
        try:
            choice = input("> ").strip().lower()
        except (EOFError, KeyboardInterrupt):
            return "abort", None

        if choice == "":
            return "approve", None
        elif choice == "s":
            return "skip", None
        elif choice == "n":
            try:
                note = input("Note: ").strip()
            except (EOFError, KeyboardInterrupt):
                note = ""
            return "approve", note if note else None
        elif choice == "q":
            return "abort", None
        else:
            print("Unrecognised input. " + HELP, flush=True)

def main():
    raw = sys.stdin.read()
    if not raw.strip():
        sys.exit(0)

    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        sys.exit(0)

    # Plan steps may arrive as a list or as a single text block
    plan = data.get("plan", [])
    if isinstance(plan, str):
        steps = [s.strip() for s in plan.strip().splitlines() if s.strip()]
    elif isinstance(plan, list):
        steps = [str(s) for s in plan if str(s).strip()]
    else:
        sys.exit(0)

    if not steps:
        sys.exit(0)

    print(f"\nPlannotator — reviewing {len(steps)} step(s)", flush=True)

    annotated = []
    for i, step in enumerate(steps, start=1):
        action, note = prompt_step(i, len(steps), step)

        if action == "abort":
            result = {
                "decision": "block",
                "reason": f"Plan aborted by user at step {i}/{len(steps)}."
            }
            print(json.dumps(result))
            return

        entry = {"step": step, "action": action}
        if note:
            entry["note"] = note
        annotated.append(entry)

    # Rebuild plan with skips and notes surfaced for Claude
    modified_steps = []
    for entry in annotated:
        if entry["action"] == "skip":
            modified_steps.append(f"[SKIP — do not execute] {entry['step']}")
        else:
            line = entry["step"]
            if "note" in entry:
                line += f"\n  [User note: {entry['note']}]"
            modified_steps.append(line)

    print(json.dumps({"plan": modified_steps}))

if __name__ == "__main__":
    main()
```

---

## Setup

1. Copy the script to `~/.claude/hooks/plannotator.py`
2. Make it executable: `chmod +x ~/.claude/hooks/plannotator.py`
3. Add the `settings.json` snippet to your global or project Claude settings
4. Enter Plan Mode (`/plan`) and submit a request — when Claude is ready to execute you will see the step-by-step prompt

**Skipped steps** are passed back to Claude with a `[SKIP]` prefix. Claude will not execute them.

**Notes** are appended inline so Claude reads your constraint before acting on that step.

**Aborting** (`q`) sends a block decision — Claude stops and waits for a new instruction.

---
