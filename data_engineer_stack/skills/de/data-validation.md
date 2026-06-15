# Datenvalidierung

## Wann aktivieren

Erstellen von Qualitätsprüfungen, Anomalieerkennung oder Null-/Kardinalitätsassertionen.

## Wann NICHT verwenden

Nicht für explorative Datenanalyse; konzentrieren Sie sich auf betriebliche Sicherungsvorkehrungen.

## Anweisungen

1. Assertionstypen definieren (Schema, Kardinalität, Bereich, Eindeutigkeit)
2. Schwellwerte für Benachrichtigungen festlegen
3. Wiederverwendbare Validierungsregeln erstellen
4. In Pipeline integrieren

## Beispiel

Validierungsregel für Orders: Schema-Check auf erforderliche Felder (order_id, customer_id), Bereichsprüfung für Werte > 0, Kardinalität auf eindeutige order_ids, Schwellenwert auf NULL-Prozentsatz < 1%.
