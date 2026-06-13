# TDD Guard Hook

Blocks file writes that create new implementation files without a corresponding test file existing first. Fires on `PostToolUse` for `Write` and `Edit` tool calls. Allows updates to existing files and always permits test files, config files, and documentation.

---

## What it does

When Claude writes or edits a file in `src/` or `lib/`, the hook checks whether a matching test file exists. If this is a net-new implementation file and no test file is found under any standard naming convention, the hook returns a block decision — stopping the write and telling Claude to create the tests first.

**Fires on:** `PostToolUse` — `Write`, `Edit`

---

## settings.json

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{"type": "command", "command": "python3 ~/.claude/hooks/tdd-guard.py"}]
    }]
  }
}
```

---

## Script: `~/.claude/hooks/tdd-guard.py`

```python
#!/usr/bin/env python3
import json
import os
import sys
from pathlib import Path

def find_test_file(file_path: str) -> bool:
    p = Path(file_path)
    stem = p.stem
    suffix = p.suffix
    parent = p.parent

    candidates = [
        parent / f"{stem}.test{suffix}",
        parent / f"{stem}.spec{suffix}",
        parent / "__tests__" / f"{stem}{suffix}",
        parent / f"{stem}_test{suffix}",
        parent.parent / "tests" / f"{stem}{suffix}",
        parent.parent / "__tests__" / f"{stem}{suffix}",
        parent.parent / "test" / f"{stem}{suffix}",
    ]
    return any(c.exists() for c in candidates)

def is_implementation_file(file_path: str) -> bool:
    p = Path(file_path)
    parts = p.parts

    # Only enforce inside src/ or lib/
    if not any(part in ("src", "lib") for part in parts):
        return False

    name = p.name
    # Skip test/spec/config/doc files
    skip_patterns = [
        ".test.", ".spec.", "_test.", ".config.", ".d.ts",
        "README", "CHANGELOG", ".md", ".json", ".yaml", ".yml",
        ".env", ".toml", ".lock",
    ]
    for pat in skip_patterns:
        if pat in name:
            return False

    # Only check source-like extensions
    impl_exts = {".ts", ".tsx", ".js", ".jsx", ".py", ".go", ".rb", ".rs", ".java", ".kt", ".swift"}
    return p.suffix in impl_exts

def file_is_new(file_path: str) -> bool:
    return not Path(file_path).exists()

def main():
    raw = sys.stdin.read()
    if not raw.strip():
        sys.exit(0)

    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        sys.exit(0)

    tool_input = data.get("tool_input", {})
    file_path = tool_input.get("file_path", "")

    if not file_path:
        sys.exit(0)

    if not is_implementation_file(file_path):
        sys.exit(0)

    if not file_is_new(file_path):
        # Updating an existing file — allow
        sys.exit(0)

    if find_test_file(file_path):
        sys.exit(0)

    stem = Path(file_path).stem
    ext = Path(file_path).suffix
    suggestion = f"tests/{stem}.test{ext}"

    result = {
        "decision": "block",
        "reason": (
            f"No test file found for new file '{file_path}'. "
            f"Create '{suggestion}' (or equivalent) before writing the implementation. "
            "TDD guard is active. Disable by removing the PostToolUse hook entry."
        )
    }
    print(json.dumps(result))

if __name__ == "__main__":
    main()
```

---

## Setup

1. Copy the script to `~/.claude/hooks/tdd-guard.py`
2. Make it executable: `chmod +x ~/.claude/hooks/tdd-guard.py`
3. Add the `settings.json` snippet to your project or global Claude settings
4. Verify: ask Claude to write a new `src/feature.ts` — it should be blocked until `src/feature.test.ts` exists

**To disable per-project:** remove the hook entry from the project's `.claude/settings.json`.

**To disable for a single file:** create an empty test file first, then ask Claude to write the implementation.

---
