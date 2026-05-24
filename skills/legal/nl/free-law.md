# Free Law Project (CourtListener) — Gratis Juridisch US-onderzoek

## Wanneer activeren
Onderzoek van Amerikaanse federale en staatsgerechts-uitspraken zonder betaald abonnement; opzoeken van PACER-indieningen, dossier-nummers of rijterrecords; bulk case law lookups waar een betaalde service onbetaalbaar zou zijn; open-access juridisch onderzoek voor academisch of openbaar belang werk.

## Wanneer NIET gebruiken
Onderzoek dat secundaire bronnen vereist (law review analyse, Practical Law richtlijnnota's, Westlaw headnotes) — gebruik Thomson Reuters MCP daarvoor; onderzoek buiten Amerikaanse federale hoven waar CourtListener-dekking schaars of afwezig is; tijdgevoelig werk dat garanteerde dezelfde-dag opinion dekking vereist (sommige recente meningen hebben publicatievertragingen).

## Instructies

**Wat het is :**
Free Law Project voert CourtListener uit — de grootste gratis, open-access Amerikaanse juridische database. De MCP-integratie (mei 2026) vereist geen abonnement, geen API-sleutel-aankoop en geen per-query facturering.

**Dekking :**
- Federale circuit- en districtsgerechtsuitsraken (uitgebreid)
- US Supreme Court-uitspraken (uitgebreid)
- PACER-indieningen en dossiergegevens (federale hoven)
- Rechterlijke biografische records, afwijzingsgeschiedenis, financiële openbaarmakingen
- Mondelinge argumentgeluidsopnamen (indien beschikbaar)
- Staatsgerechts-dekking varieert aanzienlijk per staat — verifieer voordat u op staatsgerechts-volledigheid vertrouwt

**Rate limieten :**
Gratis tier is rate-gelimiteerd. Structuur vragen om specifiek en gericht te zijn — vermijd snelle brede zoekopdrachten. Groepeer gerelateerde lookups in enkele verzoeken waar mogelijk.

**Querytypen :**

Case-zoekopdracht op trefwoord :
```
Vind 9e Circuit-uitspraken van 2023-2026 met AI-gegenereerde inhoud
en auteursrechtsschending. Retourneer citaten en een samenvatting van een alinea.
```

Citation lookup :
```
Haal de volledige tekst op van Twitter, Inc. v. Taamneh, 598 U.S. 471 (2023).
```

Rechterrecords :
```
Welke zaken heeft rechter Jacqueline Scott Corley uitgesproken met betrekking tot
Sectie 230 sinds 2021?
```

Dossier-zoekopdracht :
```
Vind het huidige dossier voor FTC tegen Meta Platforms in het Noordelijk
Arrondissement van Californië. Vermeld hangende motie's.
```

**Beperkingen — weet voordat u vraagt :**
- Amerikaanse federale hoven zijn de primaire sterkte; staatsgerechts-dekking is inconsistent
- Geen secundaire bronnen, geen law review artikelen, geen Practical Law-inhoud
- Sommige recente uitspraken hebben een publicatievertragingen (dagen tot weken)
- Volledige PACER dossier-dekking vereist PACER-account voor sommige verzegelde of beperkte indieningen

**Combineer met Thomson Reuters MCP :**
CourtListener voor gratis primair bronnenvolume + TR MCP voor secundaire bronnenstrategie en Westlaw-diepte. Voorbeeldworkflow: gebruik CourtListener om relevante zaken in bulk te identificeren, haal dan Westlaw-analyse op de sleutelzaken via TR MCP.

**VERPLICHTE outputwaarschuwing — opnemen in elke onderzoeksoutput :**
> Alleen voor onderzoeksdoeleinden — verifieer met bevoegde raadsman voordat u op juridische analyse vertrouwt.

**Citaatformaat :** Altijd volledige citaat opnemen: zaaksnaam, volume, reporter, eerste pagina, hof, jaar. Voorbeeld: `NetChoice, LLC v. Paxton, 49 F.4th 439 (5th Cir. 2022)`.

## Voorbeeld

```
Vind alle 9e Circuit-uitspraken van 2023-2026 met AI-gegenereerde inhoud
en auteursrechtsschending. Retourneer Bluebook-citaten en samenvatting van één zin
van elke uitkomst.
```

Claude vraagt CourtListener via MCP aan, retourneert een lijst van overeenkomende uitspraken met citaten en samenvattingen van uitkomsten, merkt welke zaken cert-verzoeken in behandeling hebben, en voegt de verplichte onderzoekswaarschuwing in.

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
