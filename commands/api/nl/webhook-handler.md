---
description: Implementeer een veilige, idempotente webhook-ontvanger met handtekeningverificatie en tolerantie voor pogingen
argument-hint: "[provider] [event-types]"
---
Implementeer een webhook-handler voor: $ARGUMENTS

Parse als: webhook-providernaam (bijv. Stripe, GitHub, Twilio) en een door komma's gescheiden lijst met event-types die moeten worden afgehandeld. Als de provider onbekend is, bouw een generiek signed-webhook-patroon.

Beveiliging — niet-onderhandelbaar:
- Verifieer de handtekening van de provider voordat u een payload verwerkt. Lees het patroon in de documentatie van de provider voor de exacte header en HMAC-algoritme (meestal `HMAC-SHA256`)
- Vergelijk handtekeningen met een constant-time comparisonfunctie — nooit string equality
- Wijs verzoeken met ontbrekende of ongeldige handtekeningen direct af met `401` — log de fout
- Valideer het `timestamp`-veld als de provider dat bevat; wijs events ouder dan 5 minuten af om replay-aanvallen te voorkomen
- Secret moet uit een omgevingsvariabele komen — nooit hardcoded

Idempotentie:
- Elke webhook-aflevering heeft een unieke event ID in de header of payload — extraheer deze
- Controleer een deduplicatieopslagplaats (databasetabel of Redis-set met TTL) voordat u verwerkt
- Als de event ID al is verwerkt, retourneer onmiddellijk `200` — verwerk niet opnieuw
- Sla de event ID op met een TTL van minstens het retry-venster van de provider (meestal 72 uur)

Verwerkingspatroon:
- Bevestig onmiddellijk met `200` — laat de provider niet wachten op bedrijfslogica
- Plaats de geverifieerde, gedeserialiseerde payload in een taakwachtrij voor asynchrone verwerking
- Als er geen taakwachtrij bestaat, verwerk synchroniseren maar reageer toch binnen 5 seconden
- Log het event-type, event ID en verwerkingsresultaat voor elke event

Handler-structuur:
1. Middleware voor handtekeningverificatie (herbruikbaar, niet inline)
2. Deduplicatiecontrole
3. Payload-parsing en type-dispatch per event-type
4. Per-event handler-functies (één per event-type vermeld in $ARGUMENTS)
5. Foutafhandeling die 200 retourneert zelfs bij verwerkingsfout (om retries voor bugs te voorkomen)

Schrijf tests voor: geldige handtekening, ongeldige handtekening, duplicate event, elk event-type correct dispatched.
