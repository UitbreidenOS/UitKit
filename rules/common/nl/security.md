> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../security.md).

# Beveiligingsregels

Kopieer de relevante secties naar de `CLAUDE.md` van je project.

---

## Secrets

- Zet nooit secrets in broncode — niet in opmerkingen, niet in testbestanden, niet in voorbeeldconfiguraties
- Log nooit secrets — controleer dat loggingaanroepen geen `password`-, `token`-, `key`-, `secret`- of `credential`-velden bevatten
- Gebruik omgevingsvariabelen voor alle secrets; lees ze bij opstarten, valideer dat ze bestaan
- Roteer secrets die per ongeluk zijn gecommit — behandel elk gecommit secret als gecompromitteerd

## Invoervalidatie

- Valideer alle invoer bij systeemgrenzen: API-parameters, querystrings, aanvraagbodies, bestandsuploads, omgevingsvariabelen
- Valideer type, formaat, lengte en bereik — niet alleen aanwezigheid
- Gebruik een allowlist (geldige waarden) in plaats van een denylist (geblokkeerde waarden) waar mogelijk
- Gebruik nooit gebruikersinvoer direct in SQL-queries, shell-commando's, bestandspaden of HTML zonder sanering

## Authenticatie en autorisatie

- Controleer authenticatie op elk verzoek dat dit vereist — vertrouw nooit op frontend-routing
- Controleer autorisatie (gebruiker kan DEZE actie uitvoeren) apart van authenticatie (gebruiker is ingelogd)
- Autorisatiecontroles moeten verwijzen naar de geauthenticeerde gebruiker uit de aanvraagcontext — nooit uit een queryparameter
- Token-vervaldatum moet server-side worden afgedwongen — vertrouw nooit client-verstrekte token-tijdstempels

## Databases

- Gebruik geparametriseerde queries of ORM — concateneer nooit SQL
- Databasegebruikers moeten minimaal vereiste rechten hebben — app-gebruiker mag geen DDL-toegang hebben
- Stel nooit interne databasefouten bloot aan clients — log server-side, retourneer generieke fout aan client

## Afhankelijkheden

- Pin afhankelijkheidsversies — gebruik nooit `*` of `latest` in productie
- Voer `npm audit` / `pip-audit` / `govulncheck` uit voor elke release
- Verwijder ongebruikte afhankelijkheden — elke afhankelijkheid is een potentieel aanvalsoppervlak
- Bekijk de bron van nieuwe afhankelijkheden voor ze toe te voegen

---
