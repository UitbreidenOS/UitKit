---
description: Implementierung eines sicheren, idempotenten Webhook-Empfängers mit Signaturverifizierung und Wiederholungstoleranz
argument-hint: "[provider] [event-types]"
---
Implementiere einen Webhook-Handler für: $ARGUMENTS

Analysiere als: Name des Webhook-Providers (z. B. Stripe, GitHub, Twilio) und eine kommagetrennte Liste von Event-Typen, die verarbeitet werden sollen. Wenn der Provider unbekannt ist, erstelle ein generisches Muster für signierte Webhooks.

Sicherheit — nicht verhandelbar:
- Verifiziere die Signatur des Providers, bevor du einen Payload verarbeitest. Lies das Docu-Muster des Providers für den genauen Header und HMAC-Algorithmus (normalerweise `HMAC-SHA256`)
- Vergleiche Signaturen mit einer Constant-Time-Vergleichsfunktion — verwende niemals String-Gleichheit
- Lehne Anfragen mit fehlenden oder ungültigen Signaturen mit `401` sofort ab — protokolliere den Fehler
- Validiere das Feld `timestamp`, wenn der Provider eins enthält; lehne Events ab, die älter als 5 Minuten sind, um Replay-Angriffe zu verhindern
- Das Secret muss aus einer Umgebungsvariable kommen — niemals hartcodiert

Idempotenz:
- Jede Webhook-Lieferung hat eine eindeutige Event-ID in der Header oder Payload — extrahiere sie
- Prüfe einen Deduplizierungsspeicher (DB-Tabelle oder Redis-Set mit TTL), bevor du die Event verarbeitest
- Wenn die Event-ID bereits verarbeitet wurde, gib sofort `200` zurück — verarbeite nicht erneut
- Speichere die Event-ID mit einer TTL von mindestens dem Wiederholungsfenster des Providers (normalerweise 72 Stunden)

Verarbeitungsmuster:
- Quittiere sofort mit `200` — lass den Provider nicht auf die Geschäftslogik warten
- Entkette den validierten, deserialisierten Payload in eine Job-Warteschlange für asynchrone Verarbeitung
- Wenn keine Job-Warteschlange vorhanden ist, verarbeite synchron, aber antworte trotzdem innerhalb von 5 Sekunden
- Protokolliere den Event-Typ, die Event-ID und das Verarbeitungsergebnis für jedes Event

Handler-Struktur:
1. Middleware für Signaturverifizierung (wiederverwendbar, nicht inline)
2. Deduplizierungsprüfung
3. Payload-Parsing und Typ-Dispatch nach Event-Typ
4. Pro-Event-Handler-Funktionen (eine pro Event-Typ in $ARGUMENTS)
5. Fehlerbehandlung, die 200 zurückgibt, selbst bei Verarbeitungsfehlern (um Wiederholungen aufgrund von Bugs zu vermeiden)

Schreibe Tests für: gültige Signatur, ungültige Signatur, doppeltes Event, jeder Event-Typ wird korrekt verteilt.
