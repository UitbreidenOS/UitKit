> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../python.md).

# Python Regeln

## Anwenden auf
Alle Python-Dateien (`*.py`) in jedem Projekt.

## Regeln

1. **Type Hints auf allen Funktionssignaturen** — Parameter und Rückgabetypen. `from __future__ import annotations` für Forward-Referenzen verwenden. Keine ungetypten Funktionen ohne Type Hints in Produktionscode.

2. **`pathlib.Path` statt `os.path`** — `Path("dir") / "file.txt"` ist sauberer und funktioniert plattformübergreifend. `os.path` ist Legacy.

3. **f-Strings statt `.format()` und `%`** — `f"Hello {name}"` überall. `.format()` nur wenn das Template als String-Variable gespeichert ist.

4. **Niemals veränderliche Standardargumente verwenden** — `def fn(items: list = [])` erstellt eine Liste, die über alle Aufrufe geteilt wird. `def fn(items: list | None = None)` verwenden und innen zuweisen.

5. **`dataclasses` für Daten-Container, `Pydantic` für validierte externe Daten** — wenn es eine Systemgrenze überquert (HTTP, Datei, Env), Pydantic verwenden. Wenn es rein interner State ist, ist `@dataclass` leichtgewichtiger.

6. **`with`-Anweisungen für alle Ressourcenverwaltung bevorzugen** — Dateien, DB-Verbindungen, Locks, HTTP-Sessions. Niemals `.close()` manuell aufrufen.

7. **Generator-Ausdrücke statt List-Comprehensions, wenn nur einmal iteriert wird** — `sum(x*x for x in range(1000))` alloziert keine Liste.

8. **`__all__` in jedem öffentlichen Modul definieren** — explizite öffentliche API. Verhindert `import *`-Verschmutzung und dokumentiert die Absicht.

9. **Spezifische Ausnahmen werfen, spezifische Ausnahmen abfangen** — `raise ValueError("message")` nicht `raise Exception`. `except ValueError` nicht `except Exception`, außer an einer Top-Level-Fehlergrenze.

10. **`logging`-Modul für Produktionscode, niemals `print()`** — `import logging; logger = logging.getLogger(__name__)`. `print()` nur in CLI-Ausgabecode.

11. **`Enum` für feste Wertmengen verwenden** — keine String-Konstanten. `class Status(str, Enum): ACTIVE = "active"` gibt Typensicherheit und IDE-Vervollständigung.

12. **`subprocess.run()` statt `os.system()`** — erfasst Ausgabe, wirft bei Fehler mit `check=True`, vermeidet Shell-Injection mit Listen-Args: `subprocess.run(["git", "status"], check=True)`.

13. **`dict.get(key, default)` statt `key in dict` + `dict[key]`** — eine Abfrage statt zwei.

14. **Abstrakte Basisklassen via `abc.ABC`** — wenn erzwungene Interface-Verträge benötigt werden. `Protocol` für strukturelles Subtyping (Duck Typing mit Typ-Prüfung).

15. **Virtuelle Umgebungen immer, Abhängigkeiten in `pyproject.toml`** — `uv` oder `poetry` für Verwaltung. Kein `requirements.txt` für neue Projekte.


---
