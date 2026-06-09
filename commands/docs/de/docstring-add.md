---
description: Docstrings/JSDoc/Typ-Annotationen für alle öffentlichen Symbole in einer Datei hinzufügen oder verbessern
argument-hint: "<file>"
---
Dokumentationskommentare für jedes öffentliche Symbol hinzufügen oder verbessern in: $ARGUMENTS

Regeln für öffentliche Symbole:
- Python: alle Funktionen/Klassen/Methoden ohne `_`-Präfix, plus Konstanten auf Modulebene in `__all__` falls definiert.
- TypeScript/JavaScript: alle exportierten Funktionen, Klassen, Interfaces, Typ-Aliase und Konstanten.
- Go: alle exportierten Identifizierer (großgeschrieben).
- Rust: alle `pub` Items.
- Andere Sprachen: die konventionelle öffentliche/private Unterscheidung der Sprache anwenden.

Für jedes öffentliche Symbol, das nicht dokumentiert oder mit schwacher/Platzhalter-Doku versehen ist:

1. Die vollständige Implementierung lesen — nicht nur die Signatur.
2. Eine Docstring schreiben, die abdeckt:
   - **Was** die Funktion macht (ein Satz, Imperativ: "Parsed...", "Returns...", "Validates...").
   - **Parameter**: Name, Typ (falls nicht in Signatur), Bedeutung, Einschränkungen, Standardwert falls relevant.
   - **Rückgabewert**: was es ist und unter welchen Bedingungen (`null`/`None`/`undefined`/`error` Rückgaben).
   - **Raises/throws**: alle Exception- oder Error-Typen, die der Aufrufer handhaben muss.
   - **Nebeneffekte**: E/A, Mutationen, Netzwerkaufrufe — falls vorhanden.
   - **Beispiel**: ein minimales Verwendungsbeispiel, falls die Funktion nicht trivial ist.
3. Das idiomatische Format für die Sprache der Datei verwenden:
   - Python: Google-Style Docstrings (Args / Returns / Raises Sektionen).
   - TypeScript/JavaScript: JSDoc (`@param`, `@returns`, `@throws`).
   - Go: godoc (Satz, der mit dem Symbol-Namen beginnt).
   - Rust: `///` Doc-Kommentare mit `# Examples` Sektion für nicht-triviale Items.
4. NICHT irgendwelche Logik, Signaturen oder Formatierung außerhalb der Doc-Kommentare ändern.
5. NICHT Docs zu privaten/internen Symbolen hinzufügen, es sei denn, sie haben bereits einen Kommentar, den du verbessern musst.
6. Falls eine Docstring bereits existiert und genau ist, sie unverändert lassen. Falls sie ungenau oder unvollständig ist, nur die defizitären Teile ersetzen.

Nach dem Bearbeiten eine kompakte Zusammenfassung drucken:
- Wie viele Symbole wurden dokumentiert (neu).
- Wie viele wurden verbessert.
- Alle übersprungenen Symbole und warum auflisten.
