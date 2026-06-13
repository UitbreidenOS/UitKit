---
name: churn-prevention
description: "Churnpreventie: identificeer risicopatiënten, interventiehandboeken, save-offer ontwerp, exit-survey analyse, terugwinningscampagnes"
---

# Churnpreventie Skill

## Wanneer inschakelen
- Klanten identificeren die risico lopen op annulering
- Een interventie ontwerpen wanneer een klant churn-signalen vertoont
- Exitsurvey-antwoorden analyseren om patronen te vinden
- Een terugwincampagne bouwen voor recent gechurned klanten
- Je maandelijkse churnsnelheid berekenen en verminderen

## Wanneer niet gebruiken
- Real-time churnvoorspelling — vereist een dedicated ML-model of tool (ChurnZero, Gainsight)
- Customer success management voor Enterprise-accounts — gebruik dedicated CS-platform

## Instructies

### Risicopatiënten identificeren

```
Help me risicopatiënten uit deze gebruiks-/engagementgegevens identificeren:

[plak of beschrijf de signalen waartoe je toegang hebt]:
- Veranderingen in inlogfrequentie
- Daling van functiegebruik
- Toename van supportticketvolume
- Factureringsproblemen / mislukte betalingen
- Ongebruikte sleutelfuncties (vooral als ze ervoor betaald hebben)
- Lage NPS-score (0-6 = detractoren)
- Reageert niet op CS-outreach

Zeg me voor elk signaal:
1. Hoe sterk is dit een churn-indicator?
2. Welke interventie moet ik triggeren?
3. Hoe dringend is de outreach?
```

### Interventiehandboek per signaal

```
Ontwerp een churninterventie-playbook.

Mijn product: [SaaS / abonnementsdienst / marktplaats]
Klantensegment: [KMO / mid-market / enterprise]
Gemiddelde contractwaarde: $[X]/maand
Churnsnelheid: [X]% maandelijks

Wat moet ik voor elk churnsignaal doen?

Signaal: Niet aangemeldt sinds 14 dagen
→ Trigger: [geautomatiseerde e-mail / CS-oproep / in-app bericht]
→ Berichthoek: [herengagement / waarde-herinnering / hulpaanbod]
→ Escalatie bij geen respons: [na X dagen → doen Y]

Signaal: Ingediend negatief NPS (0-6)
Signaal: 3+ keer support gecontacteerd in 30 dagen
Signaal: 3 van 5 zitplaatsen geannuleerd (deelannulering)
Signaal: Onboarding niet voltooid

Maak het playbook met specifieke berichtsjablonen voor elke trigger.
```

### Save-offer ontwerp

```
Ontwerp een save-offer voor klanten die annulering hebben geïnitieerd.

Als ze op "Annuleren" klikken, wil ik aanbieden:
Mijn productprijs: $[X]/maand
Churnreden (indien gevraagd): [prijs / niet gebruiken / concurrent / ontbrekende feature / begroting]

Ontwerp save-offers voor elke reden:
- Prijszorg: [X]% korting voor [X] maanden / downgrade-optie / pauseoptie
- Niet gebruiken: gratis 1:1 onboarding + gebruikscoaching
- Concurrent: [wat maakt ons beter / specifieke vergelijking]
- Ontbrekende functie: [roadmap / workaround / feedbackcapture]
- Begroting: pauzeer in plaats van annuleer (behoud relatie)

Voor elk: schrijf de save-offer messaging (< 150 woorden, eerlijk, niet wanhopig).
```

### Exit-survey analyse

```
Analyseer deze exit-survey-antwoorden en identificeer patronen:

[plak antwoorden of beschrijf distributie]
Gegeven topredenen: [lijst]
Woordelijke opmerkingen: [plak een voorbeeld]

Van deze analyse:
1. Wat zijn de top 3 vermijdbare churnredenen?
2. Welke product- of procesveranderingen zouden elk aanpakken?
3. Welke gechurned klanten kunnen waarschijnlijk het best teruggewonnen worden?
4. Wat moet ik in mijn onboarding veranderen om deze churn te voorkomen?
```

### Terugwinningscampagne

```
Ontwerp een terugwincampagne via e-mail voor klanten die [X] maanden geleden zijn gechurned.

Churnreden (indien bekend): [beschrijf]
Wat is veranderd sinds zij vertrokken: [nieuwe features / prijsverandering / verbeteringen]
Prikkel die ik kan aanbieden: [korting / verlengde proef / nieuwe feature-toegang]

Schrijf een 3-e-mail terugwinningsreeks:
E-mail 1 (week 4 na churn): Check-in — "Hoe gaat het met je?"
E-mail 2 (week 8): "Dit is nieuw sinds je vertrok"
E-mail 3 (maand 6): Uiteindelijke terugwinaanbod met prikkel

Elke e-mail zou zich persoonlijk en drukkeloos moeten voelen.
```

### Churnsnelheid analyse

```
Help me mijn churnsnelheid te begrijpen en te verminderen.

Huidige metrieke:
- Maandelijkse churnsnelheid: [X]%
- Gemiddelde klantlevensduur: [X] maanden
- Klant-LTV: $[X]
- CAC: $[X]

Als ik churn met 1% verlaag:
- Nieuwe maandelijkse churnsnelheid: [X]%
- Effect op LTV: $[X] → $[X]
- Effect op opbrengsten bij [X] klanten: $[X]/maand verbetering

Wat zijn de meest effectieve veranderingen die ik in de komende 90 dagen kan doorvoeren om churn met 1% te verminderen?
```

## Voorbeeld

**Gebruiker:** 8% maandelijkse churn op een $49/maand SaaS-tool. Exitsurveys tonen 42% zeggen "gebruik het niet genoeg".

**Claudes analyse:**

Grondoorzaak: Activeringsprobleems, geen productprobleems. "Gebruik het niet genoeg" = niet tot waarde gekomen.

**Top 3 interventies:**

1. **Onboarding repareren (hoogste leverage):** 42% churn vanwege niet-activering is een onboarding-probleem. Maak een verplichte "eerste waardemoment" voordat de gratis proef eindigt — zorg ervoor dat ze één kernactie voltooien die de productwaarde toont. Doel: dit segment terugbrengen naar 20%.

2. **Gebruiks-getriggerde outreach op dag 7:** Als een gebruiker de kernactie op dag 7 van de proef niet heeft voltooid, stuur een geautomatiseerde "vast?"-e-mail met een korte Loom-video of 15-minuten-oproepofferte. Wacht niet tot ze stoppen met gebruiken.

3. **Pauseoptie bij annulering:** "Gebruik het niet genoeg" betekent vaak druk, niet desinteressement. Een maandpauze (geen kosten, abonnement in wacht) zet 15-25% van potentiële churners om in behouden klanten.

**Geprojecteerde impact:** Deze 3 wijzigingen kunnen het "gebruik het niet genoeg"-segment van 42% met de helft verminderen = ~1,6% vermindering van totale maandelijkse churnsnelheid.

---
