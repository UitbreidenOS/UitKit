---
description: Generiere Referenz-API-Dokumentation für öffentliche Module oder Endpunkte
argument-hint: "[Datei-oder-Verzeichnis]"
---
Generiere vollständige API-Referenzdokumentation für: $ARGUMENTS

Falls kein Argument angegeben wird, scanne das Repository auf öffentliche API-Oberflächen — exportierte Module, REST/GraphQL-Endpunkte, CLI-Schnittstellen — und dokumentiere alle davon.

Prozess:
1. Identifiziere die API-Oberfläche:
   - Für Bibliotheken: exportierte Funktionen, Klassen, Typen (lese Quellcode + beliebige Index/Barrel-Dateien).
   - Für HTTP-APIs: Route-Definitionen (Express, FastAPI, Django, Rails, usw.).
   - Für CLIs: Argument-Parser (argparse, click, cobra, yargs, usw.).
2. Für jedes öffentliche Symbol/jeden Endpunkt extrahiere: Name, Signatur/Route+Methode, Parameter mit Typen, Rückgabetyp, Beschreibung aus vorhandenen Docstrings/Kommentaren (falls vorhanden), Fehlerbedingungen.
3. Beachte beliebige Authentifizierungs-, Rate-Limiting- oder Versionierungsschemata, die im Code vorhanden sind.

Ausgabeformat — Markdown-Referenzdokument:

## API-Referenz

Für jedes Modul / jeden Namespace / jede Route-Gruppe:

### `<SymbolName>` / `<METHOD /path>`

**Beschreibung:** Was es tut (hergeleitet aus der Implementierung, falls kein Docstring vorhanden ist).

**Parameter / Anfrage:**
| Name | Typ | Erforderlich | Beschreibung |
|------|------|----------|-------------|
| ...  | ...  | ...      | ...         |

**Rückgabe / Antwort:** Typ und Form, oder HTTP-Statuscodes mit Body-Form.

**Fehler:** Liste bekannte Fehlerbedingungen und ihre Codes/Typen auf.

**Beispiel:**
```<lang>
// minimales funktionierendes Beispiel
```

Regeln:
- Dokumentiere nur das, was tatsächlich im Code vorhanden ist — erfinde keine Parameter.
- Falls der Typ eines Parameters mehrdeutig ist, gib den abgeleiteten Typ an und markiere ihn mit `<!-- verify -->`.
- Für HTTP-APIs zeige curl-Beispiele.
- Für Bibliotheksfunktionen zeige die Host-Sprache.
- Gruppiere nach logischem Namespace / Ressource / Modul — alphabetisch innerhalb jeder Gruppe.
- Falls das Ziel ein Verzeichnis ist, durchsuche alle Quelldateien rekursiv.

Schreibe die Ausgabe zu `docs/api-reference.md` (erstelle `docs/` falls nicht vorhanden), oder zu $ARGUMENTS, falls es auf `.md` endet. Bestätige den geschriebenen Pfad.
