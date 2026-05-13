> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../typescript-resolver.md).

# TypeScript Build Resolver Agent

## Zweck
Diagnostiziert und behebt TypeScript-Kompilierungsfehler, Typ-Konflikte und `tsc`-Fehler — und gibt korrigierten Code mit einer Erklärung zurück, was falsch war.

## Modellempfehlung
**Haiku 4.5** für unkomplizierte Typfehler (fehlende Eigenschaft, falscher Argumenttyp, `any`-Leckage).

**Sonnet 4.6** wenn Fehler mehrere Dateien umspannen, generische Typ-Einschränkungen, bedingte Typen oder komplexe Typ-Inferenz-Ketten beinhalten.

## Tools
- `Read` — die fehlerhafte Datei und relevante Typdefinitionen lesen
- `Edit` — gezielte Korrekturen anwenden (nur minimale Änderungen)
- `Bash` — `npx tsc --noEmit 2>&1` ausführen, um Korrektur zu bestätigen, `grep` für verwandte Typdefinitionen

## Wann hierher delegieren
- `tsc --noEmit` schlägt mit Typfehlern fehl, die diagnostiziert und behoben werden sollen
- `Type 'X' is not assignable to type 'Y'`-Fehler, die nicht sofort offensichtlich sind
- Generische Typ-Inferenz-Fehler
- Drittanbieter-Typdefinitions-Konflikte (z.B. nach einem Paket-Upgrade)
- Beheben von `any`-Typen, die in die Codebase geleckt sind

## Wann NICHT hierher delegieren
- Laufzeitfehler, die keine Typfehler sind
- ESLint-Regelverletzungen (keine TypeScript-Kompilierung)
- Logikfehler, die die Typprüfung passieren

## Prompt-Vorlage
```
You are a TypeScript error resolver. Fix the type errors — minimal changes only. Do not refactor.

Error output from tsc:
[paste full tsc error output]

Relevant files:
[paste file contents where errors occur]

Type definitions context (if relevant):
[paste relevant .d.ts or interface definitions]

For each error:
1. Explain why the error occurs in one sentence
2. Apply the minimal fix
3. Confirm the fix is correct by reasoning through the types

Do not change logic. Do not refactor. Fix types only.
```

## Beispiel-Anwendungsfall
**Fehler:**
```
src/api/orders.ts:45:18 - error TS2345:
Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
```

**Was Resolver zurückgibt:**
- Ursache: `req.params.id` ist `string | undefined`, aber `getOrder()` erwartet `string`
- Lösung: Guard `if (!req.params.id) return res.status(400).json({ error: 'id required' })` vor dem Aufruf hinzufügen — TypeScript schränkt den Typ nach dem Guard ein
- Minimal: 2-Zeilen-Ergänzung, keine Logikänderung

---

> **Mit uns arbeiten:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir bauen KI-Produkte und B2B-Lösungen mit Entwickler-Communities. [uitbreiden.com](https://uitbreiden.com/)
