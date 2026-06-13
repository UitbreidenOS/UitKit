---
name: onboarding-cro
description: "Optimalisatie van gebruikersinvoering: activatieflows, identificatie van het aha-moment, lege toestanden, e-mailreeksen, in-app checklists — verminder time-to-value en verbeter trial-conversie"
---

# Onboarding CRO Skill

## Wanneer activeren
- Verbeteren van trial-naar-betaald conversie door het corrigeren van de onboarding-flow
- Identificatie en versnelling van het "aha-moment" voor nieuwe gebruikers
- Ontwerpen van lege toestanden, checklists en in-app nudges
- Schrijven van onboarding e-mailreeksen (activeringsdrip)
- Controle van een aanmeldings-naar-activatie trechter op drop-offs

## Wanneer NIET gebruiken
- Algemene trechter-analytics setup — gebruik de analytics-tracking skill
- A/B test framework design — gebruik de experiment-designer skill
- Marketing landing pages — gebruik de copywriting skill
- Betaalde acquisitie — gebruik de paid-ads skill

## Instructies

### Identificeer het aha-moment

```
Help me het aha-moment voor [product] te identificeren.

Product: [beschrijf wat het doet]
Kernwaardepropositie: [welk probleem lost het op?]
Gebruikerstype: [wie zijn je beste klanten?]
Huiden gevolgd activatiegebeurtenis: [de gebeurtenis die je "geactiveerd" noemt — of geen]

Raamwerk voor het vinden van het aha-moment:

1. Correlatiemethode (als je gegevens hebt):
   Kijk naar gebruikers die naar betaald hebben geconverteerd versus gebruikers die zijn weggegaan.
   Welke actie ondernamen converteren die weggegaans niet?
   Voer uit in Mixpanel/Amplitude: "Gebruikers die X hebben gedaan binnen 7 dagen hebben Y% hogere retentie"

2. Interviewmethode (kwalitatief):
   Vraag aan 5-10 power users: "Vertel me over het moment waarop je wist dat dit product het waard was om voor te betalen."
   Zoek naar een specifieke actie, geen gevoel.

3. Productlogica methode (als geen gegevens):
   Wijs de gebruikersreis in kaart: inschrijving → [stap 1] → [stap 2] → ... → waarde
   Het aha-moment = de eerste stap waar de gebruiker JOUW kernwaarde ervaart, niet alleen setup.

Algemene aha-moment patronen:
- Slack: eerste bericht in een kanaal verzonden (team aanwezig)
- Dropbox: eerste bestand vanuit meerdere apparaten opgeslagen (synchronisatie werkt)
- Loom: antwoord ontvangen op een opgenomen video (waardelus compleet)

Voor mijn product is het aha-moment waarschijnlijk: [identificeer de specifieke actie]

Definieer het activatiegebeurtenis: [gebruiker voltooit X binnen Y dagen na inschrijving]
```

### Onboarding-flow ontwerp

```
Ontwerp een onboarding-flow voor [product].

Gebruikerstype: [solo / team / enterprise]
Tijd tot aha-moment momenteel: [onbekend / X dagen / X minuten]
Doel: bereik aha-moment in < [X] minuten voor [X]% van de gebruikers
Inschrijvingsmethode: [e-mail / Google OAuth / alleen uitnodiging]
Huiden onboarding: [geen / alleen e-mail / in-app checklist / begeleide tour]

Onboarding-flow blauwdruk:

Stap 1 — Wrijvingsloze inschrijving:
□ Sociale aanmelding voorkeur (verwijdert e-mail/wachtwoord wrijving)
□ Verzamel alleen wat nodig is voor personalisatie (niet bedrijfsgrootte voor een solo-tool)
□ Duidelijke voortgangsindicator als multi-stap

Stap 2 — Personalisatievraag (maximaal 1-2 vragen):
"Wat zul je [product] primair voor gebruiken?" → routes naar relevante lege toestand
Waarom: maakt het product relevant voordat ze iets hebben gedaan

Stap 3 — Eerste actieprompt (lege toestand):
□ Toon ÉÉN ding te doen, niet vijf
□ Gebruik actiewerkwoorden: "Maak je eerste X" niet "Welkom bij [product]"
□ Vooraf invullen met een voorbeeld zodat ze zien wat goed eruit ziet
□ Bied een "snelle demo" of voorbeeldproject aan voor aarzelende gebruikers

Stap 4 — Aha-moment levering:
□ Het scherm/moment waar de kernwaarde wordt ervaren
□ Vier het met een micro-winst animatie of bevestiging
□ Oppervlak volgende actie onmiddellijk (laat momentum niet sterven)

Stap 5 — Gewoontevorming:
□ Nodig een teamlid uit (als teamproduct)
□ Verbindingsintegratie (Slack, GitHub, enz. — de "plakkerige" haak)
□ Stel een herhalende herinnering of workflow in

Anti-patronen om te vermijden:
- Functietours (gebruikers slaan ze over — laat ze doen, niet kijken)
- Creditcard vragen voordat waarde wordt ervaren
- Lange setup-wizards voordat waarde wordt geleverd

Ontwerp de flow voor mijn product met specifieke kopie voor elke stap.
```

### Onboarding e-mailreeks

```
Schrijf een onboarding e-mailreeks voor [product].

Triallengte: [X dagen / geen vervaldatum]
Activatiedefinitie: [gebruiker voltooit X]
Conversiepercentage geactiveerde gebruikers: [X%]
Conversiepercentage niet-geactiveerde gebruikers: [X%]
Naam van afzender: [oprichter / productteam / ondersteuning]

E-mailreeks:

E-mail 1 — Welkom (verzenden: onmiddellijk na inschrijving):
Onderwerp: [Kom snel bij het aha-moment — niet "Welkom bij [Product]"]
Doel: stimuleer eerste login en eerste actie
Inhoud: 1 zin over wat ze vandaag kunnen doen + één CTA-knop
Lengte: < 100 woorden

E-mail 2 — Activeringstoets (verzenden: Dag 2, indien niet geactiveerd):
Onderwerp: [Heb je X al geprobeerd?]
Doel: verwijder de blokkade die de eerste actie stopt
Inhoud: noem het #1 ding waarop de meeste gebruikers vast lopen + hoe het op te lossen
CTA: directe link naar de stap die ze niet hebben voltooid

E-mail 3 — Sociaal bewijs (verzenden: Dag 3, indien niet geactiveerd):
Onderwerp: [Hoe [bedrijf] [X] bespaard met [product]]
Doel: verlevendig de intentie met een relevant geval
Inhoud: 3-zins verhaal van het resultaat van een vergelijkbare gebruiker
CTA: "Zie hoe ze het deden" → link terug naar product

E-mail 4 — Functiehoogtepunt (verzenden: Dag 5, indien geactiveerd):
Onderwerp: [Je hebt X gedaan. Dit is wat je vervolgens moet proberen.]
Doel: verdiep engagement richting aha-moment of upgrade-intentie
Inhoud: de ene functie die gratis gebruikers naar betalende gebruikers converteert
CTA: probeer de functie met een diepe link

E-mail 5 — Waarschuwing voor trialvervaldatum (verzenden: Dag [trial_length - 3]):
Onderwerp: [3 dagen resterend — hier is wat je zult verliezen]
Doel: converteren of verlengen
Inhoud: noem specifiek wat ze niet meer kunnen openen
CTA: upgrade nu + "Heb je meer tijd nodig?" verlengingsoptie

E-mail 6 — Laatste dag (verzenden: Dag [trial_length]):
Onderwerp: [Laatste kans — je [product] trial eindigt vanmiddag]
Doel: finale conversiepoging
Inhoud: moeilijkste aanbod (korting indien budget toestaat), of verleng 7 dagen
CTA: upgrade + "niet nu" optie die om feedback vraagt

Schrijf elke e-mail voor mijn product. Inclusief onderwerp, voorbeeldtekst en lichaam.
```

### In-app checklist ontwerp

```
Ontwerp een onboarding-checklist voor [product].

Doel van checklist: bereik aha-moment / kom aan de eerste waarde / voltooi setup
Gebruikerspersona: [beschrijf]
Items om te voltooien: [lijst de stappen op die je gebruikers wilt nemen]
Beloningmechanisme: [voortgangsbalk / viering / ontgrendel een functie]

Ontwerp principes voor checklist:
1. Maximum 5 items — meer dan 5 voelt als huiswerk
2. Eerste item: af te ronden in < 2 minuten (bouwt momentum)
3. Toon vinkjes naarmate items worden voltooid (voltooiingspsychologie)
4. Het "ontgrendelen" gebeurt op item 3-4, niet het laatste item (hou ze betrokken)
5. Samenvouwen eenmaal voltooid, niet verdwijnen (referentiewaarde)

Checklist voor mijn product:
□ [Item 1] — [X mins] — voltooid wanneer: [gebeurtenis geactiveerd]
□ [Item 2] — [X mins] — voltooid wanneer: [gebeurtenis geactiveerd]
□ [Item 3] — [X mins] — ontgrendel: [functie of inhoudsbeloning]
□ [Item 4] — [X mins] — voltooid wanneer: [gebeurtenis geactiveerd]
□ [Item 5] — [X mins] — voltooiing: [viering + volgende stapverzoek]

Voortgangsberichten op 0%, 40%, 80%, 100%:
[Schrijf 4 berichten die voltooiing motiveren]

Kopie voor elk checklist-item (taaktitel + 1-regel beschrijving).
```

## Voorbeeld

**Gebruiker:** Onze projectbeheersoftware voor engineeringteams heeft een conversie van 18% van trial naar betaald. Het aha-moment is wanneer een team hun eerste sprint voltooit. Slechts 31% van de trials halen dit ooit. Los het onboarding op.

**Diagnose van Claude:**

31% die het aha-moment bereikt is het echte probleem — niet de 18% conversie. Los eerst activering op; conversie volgt.

**Grondoorzaak:** "Complete a sprint" vereist te veel vereisten — team-uitnodigingen, projectinstellingen, tickets gemaakt, sprint gestart, sprint voltooid. Dat zijn 5 stappen, waarschijnlijk verspreid over dagen. De meeste solo trialstarters nodigen hun team nooit uit.

**3 wijzigingen met het hoogst verwachte effect:**

1. **Wijzig het activatiegebeurtenis tijdelijk:** Definieer "aha-moment" als "eerste sprint gestart met 3+ tickets" in plaats van "sprint voltooid." Dat is haalbaar in 30 minuten, niet 2 weken. Meet de trial-conversie vanaf dit eerdere punt.

2. **Voeg vroeg een team-uitnodigingsgate toe:** Op dag 1, na het eerste project gemaakt, prompt: "Engineeringteams bewegen 3x sneller samen — nodig je team nu uit." Maak het makkelijk (linkdeling, niet alleen e-mail). Non-inviters zijn 4x minder waarschijnlijk om te converteren.

3. **Voorgebouwde sprintsjabloon:** In plaats van leeg project → tickets maken → sprint starten, bied: "Begin met onze 2-weken sprintsjabloon" → 5 voorbeeldtickets vooraf ingevuld voor een typisch engineeringteam. Gebruikers kunnen bewerken, niet van nul af aan bouwen. Vermindert de tijd tot eerste sprint gestart van ~3 dagen naar ~15 minuten.

Verwacht resultaat: verhoog activering van 31% naar 50% → geschatte verbetering van trial-naar-betaald conversie van 18% naar ~28%.

---
