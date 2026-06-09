---
description: Generieren Sie Storybook CSF3-Stories für eine Komponente, die alle aussagekräftigen Varianten und Zustände abdecken
argument-hint: "[ComponentFile.tsx]"
---
Generieren Sie Storybook-Stories für: $ARGUMENTS

Lesen Sie die Komponentendatei, bevor Sie etwas schreiben. Extrahieren Sie Props-Interface, Varianten und Status aus der Quelle.

**Schritt 1 — Komponente analysieren**
Identifizieren Sie:
- Alle Props und ihre Typen (boolesche Flags, Union-String-Literale, optional vs erforderlich)
- Kontrolliertes vs unkontrolliertes Verhalten (akzeptiert es `value`/`onChange`?)
- Lade-, Fehler-, leere und deaktivierte Zustände, falls vorhanden
- Alle zusammengesetzten Sub-Komponenten, die zusammen demonstriert werden müssen

**Schritt 2 — Story-Abdeckung bestimmen**
Generieren Sie Stories für:
1. `Default` — minimale erforderliche Props, keine optionalen Extras
2. Eine Story pro aussagekräftiger boolescher Prop, die die sichtbare Ausgabe ändert (z. B. `isDisabled`, `isLoading`, `isError`)
3. Eine Story pro String-Union-Variante (z. B. `variant: "primary" | "secondary" | "danger"`)
4. `AllVariants` — eine einzelne Story, die alle Varianten nebeneinander mit einer Render-Funktion und einem Flex/Grid-Wrapper rendert, nützlich für visuelle Regression
5. Kontrollierte State-Story, falls die Komponente `value`/`onChange` akzeptiert — verwenden Sie `useState` in der `render`-Funktion
6. Edge Cases: leerer String, sehr langer Text-Overflow, Null-Anzahl, null/undefined optionale Daten — nur wenn die Komponente wahrscheinlich auf diese trifft

Generieren Sie keine Stories für interne Implementierungsdetails oder Props, die nur die Ergonomie für Entwickler beeinflussen.

**Schritt 3 — Story-Datei schreiben**
Formatierungsregeln:
- Verwenden Sie CSF3 (`export default { ... }` Meta-Objekt + benannte Story-Exporte)
- `satisfies Meta<typeof Component>` für den Meta-Typ
- `satisfies StoryObj<typeof Component>` für jede Story
- `args` auf Meta-Ebene für gemeinsame Standards; überschreiben Sie pro Story nur das, was sich ändert
- Verwenden Sie `argTypes` zur Dokumentation von Union-Props mit `control: { type: 'select' }`
- Importieren Sie die Komponente mit demselben Import-Pfad, der an anderer Stelle im Projekt verwendet wird (überprüfen Sie vorhandene Importe)
- Decorators: Fügen Sie nur einen `padding`-Decorator hinzu, wenn die Komponente dies optisch erfordert — wickeln Sie nicht unnötig in Provider ein, es sei denn, die Komponente benötigt explizit einen Context

**Schritt 4 — Interaktionstests (falls @storybook/test verfügbar ist)**
Für die `Default`-Story fügen Sie eine `play`-Funktion hinzu, die:
- Überprüft, dass die Komponente ohne Fehler rendert
- Die primäre Benutzerinteraktion simuliert (Klick, Eingabe, Auswahl)
- Das erwartete DOM-Ergebnis mit `expect()` assertiert

Ausgabedatei: Platzieren Sie die Story-Datei neben der Komponente (`ComponentName.stories.tsx`). Erstellen Sie kein separates `__stories__`-Verzeichnis, es sei denn, es existiert bereits.
