> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../python.md).

# Python-regels

## Van toepassing op
Alle Python-bestanden (`*.py`) in elk project.

## Regels

1. **Type-hints op alle functiesignaturen** — parameters en retourtypen. Gebruik `from __future__ import annotations` voor voorwaartse verwijzingen. Geen ongetypeerde bare functies in productiecode.

2. **`pathlib.Path` boven `os.path`** — `Path("dir") / "file.txt"` is schoner en werkt cross-platform. `os.path` is verouderd.

3. **f-strings boven `.format()` en `%`** — `f"Hello {name}"` overal. `.format()` alleen als de sjabloon is opgeslagen als een stringvariabele.

4. **Gebruik nooit veranderlijke standaardargumenten** — `def fn(items: list = [])` maakt één lijst gedeeld over alle aanroepen. Gebruik `def fn(items: list | None = None)` en wijs binnenin toe.

5. **`dataclasses` voor datacontainers, `Pydantic` voor gevalideerde externe data** — als het een systeemgrens overschrijdt (HTTP, bestand, omgeving), gebruik Pydantic. Als het puur interne state is, is `@dataclass` lichter.

6. **Geef de voorkeur aan `with`-statements voor alle resourcebeheer** — bestanden, DB-verbindingen, locks, HTTP-sessies. Roep nooit handmatig `.close()` aan.

7. **Generator-expressies boven lijstbegrippen wanneer je slechts eenmaal itereert** — `sum(x*x for x in range(1000))` alloceert geen lijst.

8. **Definieer `__all__` in elke publieke module** — expliciete publieke API. Voorkomt `import *`-vervuiling en documenteert intentie.

9. **Gooi specifieke uitzonderingen, vang specifieke uitzonderingen** — `raise ValueError("message")` niet `raise Exception`. `except ValueError` niet `except Exception` tenzij je op een top-level foutgrens bent.

10. **`logging`-module voor productiecode, nooit `print()`** — `import logging; logger = logging.getLogger(__name__)`. `print()` alleen in CLI-outputcode.

11. **Gebruik `Enum` voor vaste sets van waarden** — geen stringconstanten. `class Status(str, Enum): ACTIVE = "active"` geeft typeveiligheid en IDE-aanvulling.

12. **`subprocess.run()` boven `os.system()`** — legt output vast, gooit bij mislukking met `check=True`, vermijdt shell-injectie met lijstargumenten: `subprocess.run(["git", "status"], check=True)`.

13. **`dict.get(key, default)` boven `key in dict` + `dict[key]`** — één opzoekactie in plaats van twee.

14. **Abstracte basisklassen via `abc.ABC`** — wanneer je afgedwongen interfacecontracten nodig hebt. `Protocol` voor structureel subtypen (duck typing met typecontrole).

15. **Altijd virtuele omgevingen, afhankelijkheden in `pyproject.toml`** — `uv` of `poetry` voor beheer. Geen `requirements.txt` voor nieuwe projecten.


---
