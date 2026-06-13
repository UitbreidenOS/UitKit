> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../performance.md).

# Prestatieregels

Kopieer de relevante secties naar de `CLAUDE.md` van je project.

---

## Database

- Voer nooit queries uit binnen lussen — batch met `IN (...)` of gebruik een join
- Pagineer altijd queries die onbegrensde resultaten kunnen retourneren — geen `SELECT *` zonder een `LIMIT`
- Voeg indexen toe voordat de query traag is in productie, niet daarna — analyseer queryplannen tijdens ontwikkeling
- Selecteer alleen de kolommen die je nodig hebt — `SELECT *` haalt ongebruikte data op en voorkomt index-only scans
- Gebruik aggregatie op databaseniveau (`COUNT`, `SUM`, `GROUP BY`) — laad geen rijen in geheugen om ze te tellen

## API en netwerk

- Cache antwoorden die duur zijn om te berekenen en zelden veranderen — stel expliciete TTL's in
- Pagineer lijst-endpoints — retourneer maximaal N items per verzoek met een cursor of offset
- Maak geen N+1-queries — batch gerelateerde data met DataLoader, `include` of een join
- Vermijd synchrone aanroepen naar externe services in verzoekhandlers — gebruik wachtrijen voor niet-kritiek werk
- Stel time-outs in op alle externe HTTP-aanroepen — laat nooit een trage afhankelijkheid je server ophangen

## Geheugen

- Laad geen grote datasets in geheugen om ze te verwerken — stream of pagineer
- Geef referenties vrij wanneer klaar — vermijd onbedoelde closures die garbage collection voorkomen
- Gebruik generators/iterators voor grote reeksen in plaats van volledige lijsten in geheugen te bouwen

## Meting

- Profileer voor optimalisatie — raad nooit waar de bottleneck zit
- Meet onder productie-achtige omstandigheden — lokale benchmarks zijn misleidend
- Stel een baseline vast voor het maken van wijzigingen — zonder baseline kun je verbetering niet bevestigen
- Prestatietests horen in CI thuis — regressie die codereview passeert maar het prestatiebudget misloopt moet automatisch worden gevangen

---
