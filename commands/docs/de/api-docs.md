---
description: Generieren Sie Referenz-API-Dokumentation für öffentliche Module oder Endpunkte
argument-hint: "[file-or-directory]"
---
Generieren Sie vollständige API-Referenzdokumentation für: $ARGUMENTS

Falls kein Argument angegeben wird, scannen Sie das Repository auf öffentliche API-Oberflächen — exportierte Module, REST/GraphQL-Endpunkte, CLI-Schnittstellen — und dokumentieren Sie alle davon.

Prozess:
1. Identifizieren Sie die API-Oberfläche:
   - Für Bibliotheken: exportierte Funktionen, Klassen, Typen (Quellcode lesen + Index-/Barrel-Dateien).
   - Für HTTP-APIs: Route-Definitionen (Express, FastAPI, Django, Rails, etc.).
   - Für CLIs: Argument-Parser (argparse, click, cobra, yargs, etc.).
2. Für jedes öffentliche Symbol/Endpunkt extrahieren Sie: Name, Signatur/Route+Methode, Parameter mit Typen, Rückgabetyp, Beschreibung aus vorhandenen Docstrings/Kommentaren (falls vorhanden), Fehlerbedingungen.
3. Notieren Sie alle Authentifizierungs-, Rate-Limiting- oder Versionierungsschemata, die im Code vorhanden sind.

Ausgabeformat — Markdown-Referenzdokument:

## API Reference

Für jeden Module / Namespace / Route-Gruppe:

### `<SymbolName>` / `<METHOD /path>`

**Description:** Was es macht (abgeleitet aus der Implementierung, falls kein Docstring vorhanden ist).

**Parameters / Request:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| ...  | ...  | ...      | ...         |

**Returns / Response:** Typ und Form, oder HTTP-Statuscodes mit Körperform.

**Errors:** Listet bekannte Fehlerbedingungen und deren Codes/Typen auf.

**Example:**
```<lang>
// minimal working example
```

Regeln:
- Dokumentieren Sie nur das, was tatsächlich im Code vorhanden ist — erfinden Sie keine Parameter.
- Falls der Typ eines Parameters mehrdeutig ist, geben Sie den abgeleiteten Typ an und kennzeichnen Sie ihn mit `<!-- verify -->`.
- Für HTTP-APIs zeigen Sie curl-Beispiele.
- Für Bibliotheksfunktionen zeigen Sie die Host-Sprache.
- Gruppieren Sie nach logischem Namespace / Ressource / Modul — alphabetisch innerhalb jeder Gruppe.
- Falls das Ziel ein Verzeichnis ist, rekurrieren Sie in alle Quelldateien.

Schreiben Sie die Ausgabe nach `docs/api-reference.md` (erstellen Sie `docs/`, falls nicht vorhanden), oder nach $ARGUMENTS, falls es auf `.md` endet. Bestätigen Sie den geschriebenen Pfad.
