---
description: Implementieren Sie einen sicheren, idempotenten Webhook-Receiver mit Signaturverifizierung und Fehlertoleranz
argument-hint: "[provider] [event-types]"
---
Webhook-Handler implementieren für: $ARGUMENTS

Analysieren als: Webhook-Provider-Name (z.B. Stripe, GitHub, Twilio) und eine durch Kommas getrennte Liste von Ereignistypen, die verarbeitet werden sollen. Wenn der Provider unbekannt ist, erstellen Sie ein generisches signiertes Webhook-Muster.

Sicherheit — nicht verhandelbar:
- Überprüfen Sie die Signatur des Providers vor der Verarbeitung einer Nutzlast. Lesen Sie das Provider-Dokumentationsmuster für den genauen Header und HMAC-Algorithmus (normalerweise `HMAC-SHA256`)
- Vergleichen Sie Signaturen mit einer konstanten Zeitvergleichsfunktion – niemals String-Gleichheit
- Lehnen Sie Anfragen mit fehlenden oder ungültigen Signaturen sofort mit `401` ab – melden Sie den Fehler
- Validieren Sie das `timestamp`-Feld, falls der Provider eines enthält; lehnen Sie Ereignisse ab, die älter als 5 Minuten sind, um Wiederholungsangriffe zu verhindern
- Das Secret muss aus einer Umgebungsvariablen kommen – niemals fest codiert

Idempotenz:
- Jede Webhook-Bereitstellung hat eine eindeutige Ereignis-ID im Header oder Payload – extrahieren Sie sie
- Überprüfen Sie einen Deduplizierungsspeicher (Datenbanktabelle oder Redis-Set mit TTL) vor der Verarbeitung
- Wenn die Ereignis-ID bereits verarbeitet wurde, geben Sie sofort `200` zurück – verarbeiten Sie sie nicht erneut
- Speichern Sie die Ereignis-ID mit einer TTL von mindestens dem Wiederholungsfenster des Providers (normalerweise 72 Stunden)

Verarbeitungsmuster:
- Bestätigen Sie sofort mit `200` – zwingen Sie den Provider nicht zu warten auf Geschäftslogik
- Reihen Sie die validierte, deserialisierte Nutzlast in eine Job-Queue für asynchrone Verarbeitung ein
- Wenn es keine Job-Queue gibt, verarbeiten Sie synchron, aber antworten Sie trotzdem innerhalb von 5 Sekunden
- Protokollieren Sie den Ereignistyp, die Ereignis-ID und das Verarbeitungsergebnis für jedes Ereignis

Handler-Struktur:
1. Signaturverifizierungs-Middleware (wiederverwendbar, nicht inline)
2. Deduplizierungsprüfung
3. Nutzlast-Parsing und Typ-Dispatch nach Ereignistyp
4. Pro-Ereignis-Handler-Funktionen (eine pro Ereignistyp aufgelistet in $ARGUMENTS)
5. Fehlerbehandlung, die 200 zurückgibt, auch bei Verarbeitungsfehlern (um Wiederholungen bei Bugs zu vermeiden)

Schreiben Sie Tests für: gültige Signatur, ungültige Signatur, dupliziertes Ereignis, jeder Ereignistyp wird korrekt verteilt.
