---
description: Zerlegen Sie ein Ziel oder Feature in begrenzte, sequenzierte Aufgaben mit Aufwandsschätzungen
argument-hint: "[Ziel- oder Feature-Beschreibung]"
---
Zerlegen Sie folgendes in eine sequenzierte Aufgabenliste: $ARGUMENTS

Erstellen Sie eine flache, geordnete Liste von Aufgaben. Für jede Aufgabe:

```
[ ] <Verb-zuerst Aufgabentitel>
    Größe: XS | S | M | L | XL   (XS=<1h, S=1-3h, M=3-8h, L=1-3d, XL=>3d)
    Abhängig von: <Aufgabennummer(n) oder "keine">
    Notizen: <eine Zeile – Schlüsselannahme, Risiko oder Beschränkung. Weglassen falls nichts Besonderes.>
```

Nach der Liste fügen Sie einen Abschnitt **Risiken & Annahmen** hinzu (3–6 Punkte), der folgendes abdeckt:
- Unbekannte Faktoren, die Schätzungen sprengen könnten
- Externe Abhängigkeiten (APIs, andere Teams, Infrastruktur)
- Scope-Grenzen – was ausdrücklich NICHT enthalten ist

Regeln:
- Aufgaben müssen von einer Person in einer Sitzung unabhängig abgeschlossen sein (M oder kleiner bevorzugt).
- Wenn eine Aufgabe XL wäre, teilen Sie sie auf.
- Ordnen Sie Aufgaben so, dass jede starten kann, sobald ihre Abhängigkeiten erfüllt sind – keine zirkulären Abhängigkeiten.
- Verwenden Sie implementierungsorientierte Verben: Schreiben, Hinzufügen, Refaktorisieren, Bereitstellen, Testen, Konfigurieren – nicht vage Verben wie „Handhaben" oder „Arbeiten an".
- Fügen Sie keine Aufgaben für Projektmanagement-Overhead ein (Standups, Reviews), es sei denn, die Anfrage verlangt es ausdrücklich.
- Wenn $ARGUMENTS zu vage ist, um ohne zu spekulieren zerlegt zu werden, stellen Sie eine Klärungsfrage, bevor Sie fortfahren.
- Keine Marketing-Sprache. Kein „nahtloses Erlebnis gewährleisten".

Geben Sie nur die Aufgabenliste und den Abschnitt Risiken aus.
