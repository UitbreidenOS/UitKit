# Thomson Reuters Juridisch Onderzoek via MCP

## Wanneer activeren
Juridisch onderzoek dat case law, statuten, regelgeving of Westlaw/Practical Law-inhoud vereist; gebruiker is advocaat of juridisch onderzoeker die Claude Code gebruikt met actief Thomson Reuters API-abonnement; taken die betrouwbare citaten van primaire en secundaire juridische bronnen vereisen.

## Wanneer NIET gebruiken
Gebruikers zonder Thomson Reuters API-abonnement — dit MCP is alleen voor ondernemingen, niet gratis beschikbaar; taken die geen betrouwbaar juridisch onderzoek vereisen; alles wat juridisch advies vereist (dit MCP biedt onderzoek, geen advies — markeer dit onderscheid altijd).

## Instructies

**Wat het is :**
Thomson Reuters lanceerde een officiële MCP-integratie (mei 2026) die Claude rechtstreeks verbindt met Westlaw, Practical Law en andere TR-databases. Zoekopdrachten gaan via uw TR API-sleutel naar live juridische databases.

**Setup :**
Voeg toe aan uw MCP-config met uw TR API-sleutel naar het TR MCP-eindpunt. Vereist een actief Thomson Reuters enterprise API-abonnement — neem contact op met uw TR-accountvertegenwoordiger voor toegang.

**Beschikbare gegevens :**
- Case law met volledige citaten (federale en staatse hoven, alle niveaus)
- Federale en staatse statuten, huidig en historisch
- Federale en staatse regelgeving (CFR, staatse administratieve codes)
- Secundaire bronnen via Practical Law: richtlijnnota's, standaarddocumenten, onderhandelingstips, jurisdictievergelijkingen
- Juridische formulieren en sjablonen

**Query-patronen die goed werken :**

Case law :
```
Vind zaken die force majeure-clausules in softwarecontracten van 2020-2026 interpreteren.
Retourneer citaten in Bluebook-indeling en een samenvatting van twee zinnen voor elk.
```

Statuut opzoeken :
```
Wat is de huidige tekst van 17 U.S.C. § 107 (fair use)?
Noteer eventuele wijzigingen sinds 2020.
```

Regelgeving :
```
Vat de nieuwste FTC-regel over informatieve toestemming voor AI-gegenereerde inhoud samen.
Voeg de CFR-verwijzing en effectieve datum in.
```

Practical Law secundaire bron :
```
Wat is de standaard onderhandelingspositie over aansprakelijkheidsbeperkingsgrenzen
in SaaS-overeenkomsten? Verwijs naar de relevante Practical Law-richtlijnnota.
```

**VERPLICHTE outputwaarschuwing — opnemen in elke onderzoeksoutput :**
> Alleen voor onderzoeksdoeleinden — verifieer met bevoegde raadsman voordat u op juridische analyse vertrouwt.

**Citaatformaat :** Vraag altijd om Bluebook-formaat. Controleer alle citaten onafhankelijk voordat u indient — MCP-opgehaalde citaten kunnen opmaakfouten bevatten en mogen niet rechtstreeks in gerechtelijke documenten gaan.

**Bevoegdheids-opmerking :** Bevestig of onderzoek voor een specifieke zaak van een cliënt (advocaat-cliënt bevoegdheid kan van toepassing zijn) of algemeen achtergrondonderzoek. Dit onderscheid beïnvloedt hoe de output moet worden opgeslagen en gedeeld.

**Combineer met CourtListener :** Voor uitgebreide dekking koppel je Thomson Reuters (secundaire bronnen, Westlaw-analyse) met Free Law Project MCP (gratis primaire bronnen voor bulk lookups). TR voor diepte; CourtListener voor breedte en volume.

## Voorbeeld

```
Vind alle circuit court zaken van 2022-2026 die de bepaling "overschrijdt geautoriseerde toegang"
van de CFAA interpreteren. Vat de circuit split samen en de huidige positie van het Supreme Court
na Van Buren tegen Verenigde Staten. Retourneer Bluebook-citaten voor elke zaak.
```

Claude vraagt Westlaw via het TR MCP, retourneert een gestructureerde circuit split-analyse met citaten, vlaggen gebieden van voortdurend meningsverschil, en voegt de verplichte onderzoekswaarschuwing in.

---
