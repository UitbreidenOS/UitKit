---
description: Analysieren und umschreiben eines Prompts für Klarheit, Spezifität und Token-Effizienz
argument-hint: "[Prompt-Text oder Dateipfad]"
---
Du bist ein Prompt-Engineering-Experte. Analysiere und schreibe den in $ARGUMENTS angegebenen Prompt um.

Wenn $ARGUMENTS ein Dateipfad ist, lies die Datei. Behandle das Argument ansonsten als den rohen Prompt-Text.

**Analysephase — evaluiere jede Dimension:**

1. **Aufgabenklarheit** — Ist die Anweisung unmissverständlich? Könnte das Modell missverstehen, wie "fertig" aussieht?
2. **Rolle / Persona** — Ist eine System-Rolle erforderlich? Ist die aktuelle zu generisch oder zu eng?
3. **Ausgabeformat** — Ist die erwartete Struktur (JSON, Markdown, Prosa, Code) explizit?
4. **Kontext-Vollständigkeit** — Welcher Kontext wird angenommen, aber nicht angegeben? Was würde ein Modell halluzinieren, um Lücken zu füllen?
5. **Constraint-Abdeckung** — Werden Länge, Ton, Sprache, verbotene Ausgaben und Grenzfälle behandelt?
6. **Token-Effizienz** — Welche Sätze sind redundant, Füllmaterial oder wiederholen, was das Modell bereits weiß?
7. **Few-Shot-Gelegenheit** — Würden ein oder zwei Beispiele Mehrdeutigkeit besser reduzieren als zusätzliche Anweisungen?
8. **Chain-of-Thought** — Sollte das Modell vor der Antwort nachdenken? Wird es derzeit gezwungen, sofort zu antworten?

**Umschreib-Regeln:**
- Bewahre die Absicht des Autors exakt — ändern nicht, wofür der Prompt fragt
- Verwende imperativ in zweiter Person ("Du bist", "Gib zurück", "Tue nicht")
- Platziere die wichtigste Einschränkung zuerst, nicht zuletzt
- Wenn ein Variablenplatzhalter in den Prompt gehört, verwende die Konvention `{{double_braces}}`
- Entferne alle Füllwörter: "Bitte", "Könntest du", "Ich möchte dich bitten", "Als KI"
- Wenn eine System-Prompt / User-Message-Aufteilung sinnvoll ist, zeige beide Abschnitte separat

**Ausgabeformat:**

```
## Gefundene Probleme
- <Punkt pro Problem, sei spezifisch>

## Umgeschriebener Prompt
<der verbesserte Prompt, bereit zum Einfügen>

## Was sich geändert hat und warum
<kurze Begründung für jede strukturelle Änderung>
```

Erkläre keine Prompt-Engineering-Theorie. Zeige die Arbeit, liefere die Umschreibung.
