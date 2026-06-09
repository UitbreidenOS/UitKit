---
description: Ein Ziel oder Feature in fokussierte, sequenzierte Aufgaben mit Aufwandsschätzungen unterteilen
argument-hint: "[goal or feature description]"
---
Teilen Sie Folgendes in eine sequenzierte Aufgabenliste auf: $ARGUMENTS

Produzieren Sie eine flache, geordnete Liste von Aufgaben. Für jede Aufgabe:

```
[ ] <verb-first task title>
    Size: XS | S | M | L | XL   (XS=<1h, S=1-3h, M=3-8h, L=1-3d, XL=>3d)
    Depends on: <task number(s), or "none">
    Notes: <one line — key assumption, risk, or constraint. Omit if nothing notable.>
```

Fügen Sie nach der Liste einen Abschnitt **Risiken & Annahmen** hinzu (3–6 Punkte), der folgende Aspekte abdeckt:
- Unbekannte Faktoren, die Schätzungen erheblich ändern könnten
- Externe Abhängigkeiten (APIs, andere Teams, Infrastruktur)
- Scope-Grenzen — was explizit NICHT enthalten ist

Regeln:
- Aufgaben müssen von einer Person in einer Sitzung unabhängig abgeschlossen werden können (M oder kleiner bevorzugt).
- Wenn eine Aufgabe XL wäre, teilen Sie sie auf.
- Ordnen Sie Aufgaben so, dass jede beginnen kann, sobald ihre Abhängigkeiten erfüllt sind — keine zirkulären Abhängigkeiten.
- Verwenden Sie implementierungsorientierte Verben: Write, Add, Refactor, Deploy, Test, Configure — nicht vage Verben wie "Handle" oder "Work on."
- Nehmen Sie keine Aufgaben für Projektmanagement-Overhead auf (Standups, Reviews), es sei denn, die Anfrage fragt explizit danach.
- Wenn $ARGUMENTS zu vage ist, um ohne Vermutungen über den Scope aufgeschlüsselt zu werden, stellen Sie eine Klarstellungsfrage, bevor Sie fortfahren.
- Keine Marketingsprache. Kein "ensure seamless experience."

Geben Sie nur die Aufgabenliste und den Abschnitt mit den Risiken aus.
