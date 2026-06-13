# Escalatie-Vlag

## Wanneer activeren

- Nadat contractbeoordeling problemen identificeert die de gezag van de beoordelaar kunnen overschrijden
- Elke contractclausule veroorzaakt een automatische escalatievoorwaarde (zie Stap 1 hieronder)
- Onzekerheid over of een term medewerking van hoger niveau vereist voordat verder gegaan wordt

## Wanneer NIET gebruiken

- Als vervanging voor het lezen van het contract — deze vaardigheid vlaggen problemen in een beoordeeld contract, geen vervanging voor het lezen van een
- Voor juridisch advies — deze vaardigheid stuurt problemen naar het juiste autoriseringsniveau ; het geeft geen juridisch advies over de wenselijkheid van een term

## Instructies

Pas de escalasiebeslissingsboom in volgorde toe. Stop bij de eerste trigger die afvuurt — eerdere stappen vervangen latere stappen.

---

**Stap 1 — Automatische triggers (altijd escaleren ongeacht contractwaarde of dienstigheid van beoordelaar)**

De volgende voorwaarden vereisen escalatie naar General Counsel of Senior Partner ongeacht contractwaarde of dienstigheid van beoordelaar :

- Onbeperkte aansprakelijkheidclausule (elke vorm)
- IP-toewijzing aan de wederpartij, inclusief work-for-hire-clausules die kern product-IP dekken
- Eeuwigdurende exclusieve licentie op de technologie of gegevens van de organisatie
- Elke voorwaarde op de gedocumenteerde « nooit accepteren » -lijst van de organisatie (van playbook-profiel)
- Bevestigde sanctiontreffer op de wederpartij

Indien automatische trigger afvuurt → `Vereiste escalatie : JA` en `Escalatie naar : General Counsel / Senior Partner` stellen.

---

**Stap 2 — Dollarautoriteit controle**

Overschrijdt de contractwaarde de autoriteitsgrens van de beoordelaar ?

Standaarddrempels (overschrijf met organisatieprofiel indien beschikbaar) :

```
Juridisch medewerker :  <$50K, alleen standaardbegrippen
Counsel :    <$500K, standaardbegrippen + gedocumenteerde reserves
General Counsel :         onbeperkt, alle begrippen inclusief non-standaard
```

Indien contractwaarde de gezag van beoordelaar overschrijdt → escaleer naar volgende autorisatieniveau.

---

**Stap 3 — Non-standaard begrippen**

Is een onderhandelde begripuit de gedocumenteerde reserve-posities in het organisatieplaybook ?

Indien ja → escaleer naar het autorisatieniveau gedefinieerd voor non-standaard begrippen in playbook. Documenteer welke begripenen hoe het afwijkt.

---

**Stap 4 — Playbook-stilte**

Verschijnt een materiële begripdie het playbook helemaal niet behandelt ?

Indien ja → oppervlak als GEEL. Niet doorgaan. Vraag het team een positie voor dat begriptype te definiëren voordat het contract voortgaat. Onbehandelde materiële begrippen zijn niet veilig om standaard goed te keuren.

---

**Uitvoerformat :**

```
ESCALATIEBEOORDELINGS — [Contractnaam]
Wederpartij : [naam]
Contractwaarde : $[X]
Beoordelaar : [rol]

Automatische triggers :   [geen / lijst elke gevonden trigger]
Dollarautoriteit :     $[contractwaarde] vs $[beoordelaarslimiet] → [binnen limiet / OVERSCHRIJDT]
Non-standaard begrippen :   [geen / lijst elke afwijking van playbook]
Playbook-hiaten :        [geen / lijst elke onbehandelde materiële begripop]

Vereiste escalatie :  [JA / NEE]
Escalatie naar :          [rol en naam uit org-profiel]
Kanaal :              [Slack / email]

---
Conceptescalatiebericht :

Hallo [naam],

Ik controleer [contractnaam] met [wederpartij]. Ik heb uw goedkeuring nodig voordat ik voortga op :

1. [Begripop 1] — [wat het zegt] — [waarom het uw goedkeuring vereist]
2. [Begripop 2] — [wat het zegt] — [waarom het uw goedkeuring vereist]

Contractwaarde : $[X]. Wederpartij : [naam]. Deadline : [indien bekend, anders « niet opgegeven »].

Kunt u beoordelen en advies geven ?
```

**Kosten-batenregel :** De kosten van een onnodige escalatie (ongeveer 30 seconden aandacht van een senior beoordelaar) is altijd minder dan de kosten van doorgaan met ongoedgekeurde non-standaard begrippen. Bij twijfel, vlag.

**Opmerking :** Deze vaardigheid conceptualiseert het escalatiebericht. Het verzendt het niet — de beoordelaar leest het concept, bevestigt nauwkeurigheid en verzendt.

## Voorbeeld

**Invoer :** « Een leveranciercontract heeft een wederzijdse NDA-sectie, aansprakelijkheidsbeperkung geplafoneerd op 1× honoraria (onze standaard reserve-positie), maar bevat een clausule die alle IP ontwikkeld tijdens betrokkenheid aan leverancier toewijst. Vlag adequaat. »

**Verwachte uitvoer :**

```
ESCALATIEBEOORDELINGS — Leverancier-dienstverleningsovereenkomst (Acme Corp)
Wederpartij : Acme Corp
Contractwaarde : $120.000
Beoordelaar : Counsel

Automatische triggers :   IP-TOEWIJZING — Sectie 8.3 wijst alle werkproducten en IP die tijdens betrokkenheid zijn ontwikkeld aan Leverancier toe. Dit is een automatische escalasiertrigger ongeacht transactiegrootte.
Dollarautoriteit :     $120.000 vs $500.000 (Counsel-limiet) → binnen limiet
Non-standaard begrippen :   IP-toewijzing staat op de nooit-accepteren-lijst
Playbook-hiaten :        geen

Vereiste escalatie :  JA
Escalatie naar :          General Counsel
Kanaal :              Slack (#legal-escalations)

---
Conceptescalatiebericht :

Hallo [GC-naam],

Ik controleer de Leverancier-dienstverleningsovereenkomst met Acme Corp ($120K betrokkenheid). Ik heb uw goedkeuring nodig voordat ik voortga op :

1. Sectie 8.3 — IP-toewijzing — wijst alle werkproducten en IP die tijdens betrokkenheid zijn ontwikkeld aan Acme Corp toe. Dit veroorzaakt automatische escalatie onder ons playbook (nooit-accepteren-lijstitem).

Contractwaarde : $120.000. Wederpartij : Acme Corp. Deadline : niet opgegeven.

Kunt u beoordelen en advies geven ?
```

---
