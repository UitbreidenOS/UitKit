---
description: Entwerfen Sie ein Architecture Decision Record für eine spezifische technische Entscheidung
argument-hint: "[decision topic]"
---
Entwerfen Sie ein Architecture Decision Record (ADR) für: $ARGUMENTS

Vorbereitungen:
1. Überprüfen Sie auf ein vorhandenes Verzeichnis `docs/decisions/`, `docs/adr/` oder `adr/`, um
   die verwendete Nummerierungskonvention und das Dateibenennungsschema zu bestimmen. Stimmen Sie exakt überein.
2. Wenn bereits eine ADR-Vorlage im Repository vorhanden ist, verwenden Sie diese. Andernfalls verwenden Sie das folgende Format.
3. Lesen Sie relevante Quelldateien, um die Abschnitte „Context" und „Consequences" auf
   tatsächlichem Code zu begründen, nicht auf Hypothetischen.

ADR-Format:

# ADR-NNN: [Title — Nominalphrase, die die Entscheidung beschreibt, nicht das Problem]

## Status
Proposed | Accepted | Deprecated | Superseded by ADR-NNN

## Date
YYYY-MM-DD

## Context
Welche Situation, Einschränkung oder Anforderung hat diese Entscheidung erzwungen?
Umfassen Sie: Skalierung, Teamgröße, bestehende Systemeinschränkungen, externe Anforderungen.
Halten Sie sich an Fakten — keine Befürwortung hier.

## Decision
Geben Sie die Entscheidung in einem Satz an, der mit „Wir werden…" beginnt.
Erklären Sie dann den Mechanismus: was wird gebaut, geändert oder übernommen, und wie.

## Considered Alternatives
Für jede in Betracht gezogene Alternative:
- **Optionsname**: Was es ist, warum es in Betracht gezogen wurde, warum es abgelehnt wurde.
Mindestens zwei Alternativen. Führen Sie keine Optionen auf, die nie ernsthaft in Betracht gezogen wurden.

## Consequences
**Positiv:**
- Konkrete, überprüfbare Vorteile (Leistung, Einfachheit, Kosten, Team-Geschwindigkeit).

**Negativ:**
- Echte Kompromisse, die akzeptiert werden. Minimieren Sie sie nicht.

**Risiken:**
- Was könnte schiefgehen. Was würde dazu führen, diese Entscheidung zu überdenken.

## References
Links zu relevanten PRs, Issues, Benchmarks oder externen Dokumenten, die die Entscheidung beeinflusst haben.

Schreibregeln:
- Seien Sie präzise und neutral. Ein ADR ist ein historisches Dokument, kein Verkaufsvortrag.
- Schreiben Sie in der Vergangenheit für akzeptierte Entscheidungen, in der Zukunft für vorgeschlagene.
- Vermeiden Sie vague Adjektive: „einfach", „flexibel", „skalierbar" bedeuten ohne Beweise nichts.
- Wenn $ARGUMENTS vage ist, stellen Sie eine Klärungsfrage, bevor Sie fortfahren: Welche spezifische
  Entscheidung muss aufgezeichnet werden, und was wurde gewählt?
- Geben Sie die Datei im korrekten ADR-Verzeichnis mit der nächsten verfügbaren Nummer aus.
  Bestätigen Sie den vollständigen Ausgabepfad nach dem Schreiben.
