> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../coding-style.md).

# Coding Style Regeln

Relevante Abschnitte in die `CLAUDE.md` des Projekts kopieren.

---

## Benennung

- Variablen und Funktionen: `camelCase` (JS/TS), `snake_case` (Python, Go, Rust)
- Klassen und Typen: `PascalCase` in allen Sprachen
- Konstanten: `SCREAMING_SNAKE_CASE` nur für echte Konstanten, die sich nie ändern
- Boolesche Variablen: Präfix mit `is`, `has`, `can`, `should` — `isActive`, `hasPermission`
- Namen nicht abkürzen, außer die Abkürzung ist allgemein bekannt (`id`, `url`, `db`, `ctx`)

## Funktionen

- Eine Verantwortlichkeit pro Funktion — wenn "und" in der Beschreibung benötigt wird, aufteilen
- Maximal 40 Zeilen pro Funktion; bei längeren Unterfunktionen extrahieren
- Keine booleschen Parameter — ein Options-Objekt oder zwei separate Funktionen verwenden
- Frühzeitig bei Guard-Klauseln zurückkehren — den Happy Path nicht innerhalb von Bedingungen verschachteln

## Kommentare

- Keine Kommentare schreiben, außer das WARUM ist nicht offensichtlich
- Niemals Kommentare schreiben, die beschreiben, was der Code tut (das macht der Code bereits)
- Kommentar schreiben wenn: eine versteckte Einschränkung vorhanden ist, ein Workaround für einen bestimmten Bug, oder Verhalten, das einen Leser überraschen würde
- Niemals TODO-Kommentare schreiben — stattdessen ein nachverfolgbares Issue erstellen

## Fehlerbehandlung

- Fehler niemals stillschweigend schlucken (`catch (e) {}` ist immer falsch)
- Fehler immer an der Grenze behandeln, wo eine Aktion möglich ist
- Fehler nach oben propagieren mit Kontext — mit der relevanten ID oder dem Operationsnamen umschließen
- Kein `console.error` in Produktionscode verwenden — den Logger des Projekts verwenden

## Dateiorganisation

- Ein primärer Export pro Datei
- Dateinamen passen zu ihrem primären Export: `UserService.ts` exportiert `UserService`
- Keine Barrel-Dateien (`index.ts`-Re-Exports) — direkt aus der Quelldatei importieren
- Imports gruppieren: zuerst externe Pakete, dann interne Module, dann relative Imports

---
