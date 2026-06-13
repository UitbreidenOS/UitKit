---
description: Implementeer een veilige, idempotente webhook-ontvanger met handtekeningverificatie en retry-tolerantie
argument-hint: "[provider] [event-types]"
---
Implementeer een webhook-handler voor: $ARGUMENTS

Parse als: webhook provider naam (bijv. Stripe, GitHub, Twilio) en een komma-gescheiden lijst van event-typen om af te handelen. Als provider onbekend is, bouw een generiek ondertekend-webhook patroon.

Security — niet ter discussie:
- Verifieer de handtekening van de provider voordat u het bericht verwerkt. Lees het patroon in de documentatie van de provider voor de exacte header en HMAC-algoritme (meestal `HMAC-SHA256`)
- Vergelijk handtekeningen met een constant-time vergelijkingsfunctie — nooit string gelijkheid
- Wijs verzoeken af met ontbrekende of ongeldige handtekeningen met `401` onmiddellijk — log het falen
- Valideer het `timestamp` veld als de provider er een bevat; wijs events af die ouder zijn dan 5 minuten om replay-aanvallen te voorkomen
- Geheim moet uit een omgevingsvariabele komen — nooit hardcoded

Idempotentie:
- Elke webhook-bezorging heeft een unieke event-ID in de header of het bericht — extract deze
- Controleer een deduplicatie-opslag (DB-tabel of Redis-set met TTL) voordat u verwerkt
- Als de event-ID al is verwerkt, retourneer `200` onmiddellijk — verwerk niet opnieuw
- Sla de event-ID op met een TTL van minstens het retry-venster van de provider (meestal 72 uur)

Verwerkingspatroon:
- Bevestig onmiddellijk met `200` — laat de provider niet wachten op bedrijfslogica
- Plaats het gevalideerde, gedeserialiseerde bericht in een taakwachtrij voor asynchrone verwerking
- Als er geen taakwachtrij bestaat, verwerk synchroon maar reageer nog steeds binnen 5 seconden
- Log het event-type, event-ID en verwerkingsresultaat voor elk event

Handler-structuur:
1. Handtekeningverificatie middleware (herbruikbaar, niet inline)
2. Deduplicatie controle
3. Bericht parsing en type dispatching op event-type
4. Per-event handler functies (één per event-type vermeld in $ARGUMENTS)
5. Foutafhandeling die 200 retourneert zelfs bij verwerkingsfouten (om retries voor bugs te voorkomen)

Schrijf tests voor: geldige handtekening, ongeldige handtekening, dubbele event, elk event-type correct gewijzigd.
