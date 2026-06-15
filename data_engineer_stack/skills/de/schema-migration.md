# Schema-Migration

## Wann aktivieren

Spalten hinzufügen oder ändern, Datentypen ändern oder Breaking Schema Changes verwalten.

## Wann NICHT verwenden

Nicht für einmalige Datenkorrektionen; konzentrieren Sie sich auf strukturelle Änderungen.

## Anweisungen

1. Fenster für Rückwärtskompatibilität planen
2. Migrationstests schreiben
3. Feature Flags für neue Spalten hinzufügen
4. Rollback-Verfahren dokumentieren

## Beispiel

Spalte „user_premium" hinzufügen. Fenster: v1 (alte Code, liest nicht) und v2 (neue Code, ignoriert fehlende Spalte) parallel 2 Wochen. Test deckt NULL-Fall ab. Rollback: Spalte löschen und Code zurückrollen.
