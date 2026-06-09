# Regels voor gegevensprivacy

Pas toe bij het omgaan met persoonlijke, gevoelige of gereglementeerde gegevens.

## Gegevensminimalisering

- Verzamel alleen gegevens waarvoor je een specifiek, gedocumenteerd doel hebt — gegevens "voor het geval dat" verzamelen is een risico
- Stel retentieperiodes vast op het moment van verzameling; verwijder of anonimiseer gegevens wanneer de periode afloopt
- Log geen persoonlijke gegevens (namen, e-mailadressen, IP's, apparaat-ID's) tenzij operationeel noodzakelijk — en zelfs dan beperkt
- Geef voorkeur aan het opslaan van een afgeleid kenmerk boven de ruwe waarde: leeftijdscategorie in plaats van geboortedatum, gehashte ID in plaats van e-mailadres

## Classificatie

- Classificeer alle gegevensvelden voordat je ze opslaat: openbaar / intern / vertrouwelijk / beperkt
- Beperkte gegevens (PII, betalingsgegevens, gezondheidsgegevens) vereisen versleuteling in rust en in transit
- Sla wachtwoorden nooit in herstelbare vorm op — gebruik bcrypt, Argon2 of scrypt met voldoende kostenfactor
- Behandel sessietokens, API-sleutels en JWT's als beperkte gegevens

## Toegangsbeheer

- Pas het principe van minimale bevoegdheid toe: services en gebruikers hebben alleen toegang tot wat zij nodig hebben
- Implementeer beveiliging op rijniveau voor multi-tenant gegevens — vertrouw niet alleen op filters op toepassingsniveau
- Log toegang tot gevoelige records: wie heeft wat geopend en wanneer
- Trek toegang onmiddellijk in bij rolverandering of uitdiensttreding — wacht niet op de volgende inrichtingscyclus

## Grensoverschrijdend en regelgeving

- Weet welke regelgeving van toepassing is: GDPR (EU-inwoners), CCPA (Californische inwoners), HIPAA (gezondheidsgegeven in de VS), PCI DSS (betaalkaarten)
- Rechten van betrokkenen (toegang, verwijdering, overdraagbaarheid) moeten implementeerbaar zijn — ontwerp het schema zodat je alle gegevens voor een bepaalde gebruiker kunt vinden en verwijderen
- Stuur persoonlijke gegevens niet over naar jurisdicties zonder adequate wettelijke basis (SCC's, adequaatbeslissing)
- Documenteer je gegevensstromen: welke gegevens gaan waar heen, verwerkt door wie, onder welke wettelijke basis

## Integratie van derden

- Controleer derdenverwerkers voordat je persoonlijke gegevens naar hen stuurt — controleer hun DPA en certificeringen
- Gebruik tokenisering bij het doorgeven van gebruikers-ID's aan analytics- of advertentieplatforms — nooit ruwe PII
- Respect Do Not Track / opt-out signalen op de integratiegrenscode, niet alleen op de UI-laag

## Incidentrespons

- Definieer wat een meldingsplichtig inbreuk is voordat dit gebeurt
- GDPR vereist melding aan de toezichthoudende autoriteit binnen 72 uur na ontdekking
- Heb een gedocumenteerde werkwijze voor: inperking, beoordeling, melding en nabespreking
- Probeer nooit een inbreuk te verbergen — dit vergroot de wettelijke blootstelling

## Testen

- Gebruik synthetische of geanonimiseerde gegevens in niet-productieomgevingen — kopieer nooit productie-PII naar staging
- Redigeer of maskeer gevoelige velden in logboeken en foutmeldingen voordat ze de systeemgrens verlaten
