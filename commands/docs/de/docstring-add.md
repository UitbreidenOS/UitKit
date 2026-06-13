---
description: Docstrings/JSDoc/Typannotationen für alle öffentlichen Symbole in einer Datei hinzufügen oder verbessern
argument-hint: "<file>"
---
Dokumentationskommentare für jedes öffentliche Symbol in hinzufügen oder verbessern: $ARGUMENTS

Regeln, was als öffentliches Symbol zählt:
- Python: alle Funktionen/Klassen/Methoden ohne `_`-Präfix, plus Module-Level-Konstanten in `__all__`, falls definiert.
- TypeScript/JavaScript: alle exportierten Funktionen, Klassen, Schnittstellen, Typ-Aliase und Konstanten.
- Go: alle exportierten Bezeichner (großgeschrieben).
- Rust: alle `pub`-Elemente.
- Andere Sprachen: wenden Sie die sprachübliche öffentlich/privat-Unterscheidung an.

Für jedes öffentliche Symbol, das undokumentiert ist oder nur schwache/Platzhalter-Docs hat:

1. Lesen Sie die vollständige Implementierung — nicht nur die Signatur.
2. Schreiben Sie einen Docstring, der abdeckt:
   - **Was** die Funktion tut (ein Satz, Imperativ: "Analysiert...", "Gibt zurück...", "Validiert...").
   - **Parameter**: Name, Typ (falls nicht in Signatur), Bedeutung, Einschränkungen, Standard falls relevant.
   - **Rückgabewert**: was es ist und unter welchen Bedingungen (einschließlich `null`/`None`/`undefined`/`error`-Rückgaben).
   - **Wirft/Throws**: alle Ausnahme- oder Fehlertypen, die der Aufrufer behandeln muss.
   - **Nebenwirkungen**: I/O, Mutationen, Netzwerk-Aufrufe — falls vorhanden.
   - **Beispiel**: ein minimales Nutzungsbeispiel, falls die Funktion nicht trivial ist.
3. Verwenden Sie das idiomatische Format für die Sprache der Datei:
   - Python: Google-Style-Docstrings (Args / Returns / Raises Abschnitte).
   - TypeScript/JavaScript: JSDoc (`@param`, `@returns`, `@throws`).
   - Go: godoc (Satz, der mit dem Symbolnamen beginnt).
   - Rust: `///` Doc-Kommentare mit `# Examples` Abschnitt für nicht-triviale Elemente.
4. Ändern Sie KEINE Logik, Signaturen oder Formatierung außerhalb der Doc-Kommentare.
5. Fügen Sie KEINE Docs zu privaten/internen Symbolen hinzu, es sei denn, sie haben bereits einen Kommentar, den Sie verbessern müssen.
6. Falls ein Docstring bereits existiert und korrekt ist, lassen Sie ihn unverändert. Falls er ungenau oder unvollständig ist, ersetzen Sie nur die mangelhaften Teile.

Nach dem Bearbeiten geben Sie eine kompakte Zusammenfassung aus:
- Wie viele Symbole wurden dokumentiert (neu).
- Wie viele wurden verbessert.
- Führen Sie alle übersprungenen Symbole und deren Gründe auf.
