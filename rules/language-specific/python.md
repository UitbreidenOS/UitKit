# Python Rules

## Apply to
All Python files (`*.py`) in any project.

## Rules

1. **Type hints on all function signatures** — parameters and return types. Use `from __future__ import annotations` for forward references. No bare untyped functions in production code.

2. **`pathlib.Path` over `os.path`** — `Path("dir") / "file.txt"` is cleaner and works cross-platform. `os.path` is legacy.

3. **f-strings over `.format()` and `%`** — `f"Hello {name}"` everywhere. `.format()` only when the template is stored as a string variable.

4. **Never use mutable default arguments** — `def fn(items: list = [])` creates one list shared across all calls. Use `def fn(items: list | None = None)` and assign inside.

5. **`dataclasses` for data containers, `Pydantic` for validated external data** — if it crosses a system boundary (HTTP, file, env), use Pydantic. If it's purely internal state, `@dataclass` is lighter.

6. **Prefer `with` statements for all resource management** — files, DB connections, locks, HTTP sessions. Never call `.close()` manually.

7. **Generator expressions over list comprehensions when you only iterate once** — `sum(x*x for x in range(1000))` doesn't allocate a list.

8. **Define `__all__` in every public module** — explicit public API. Prevents `import *` pollution and documents intent.

9. **Raise specific exceptions, catch specific exceptions** — `raise ValueError("message")` not `raise Exception`. `except ValueError` not `except Exception` unless you're at a top-level error boundary.

10. **`logging` module for production code, never `print()`** — `import logging; logger = logging.getLogger(__name__)`. `print()` only in CLI output code.

11. **Use `Enum` for fixed sets of values** — not string constants. `class Status(str, Enum): ACTIVE = "active"` gives type safety and IDE completion.

12. **`subprocess.run()` over `os.system()`** — captures output, raises on failure with `check=True`, avoids shell injection with list args: `subprocess.run(["git", "status"], check=True)`.

13. **`dict.get(key, default)` over `key in dict` + `dict[key]`** — one lookup instead of two.

14. **Abstract base classes via `abc.ABC`** — when you need enforced interface contracts. `Protocol` for structural subtyping (duck typing with type checking).

15. **Virtual environments always, dependencies in `pyproject.toml`** — `uv` or `poetry` for management. No `requirements.txt` for new projects.


---
