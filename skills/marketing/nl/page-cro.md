---
name: page-cro
description: "Landing page conversie-optimalisatie: boven-de-vouw audit, CTA-analyse, vertrouwenssignalen, A/B-test hypothesen, heatmap-interpretatie"
---

# Pagina CRO Skill

## Wanneer inschakelen
- Een landing page controleren op conversie-problemen
- A/B-test hypothesen genereren om aanmeldingen of aankopen te verbeteren
- Heatmap- / sessie-opname-gegevens interpreteren
- Uw homepage, prijspagina of productpagina controleren
- Begrijpen waarom traffic hoog is maar conversies laag

## Wanneer niet gebruiken
- E-mailcampagne-optimalisatie — ander kanaal
- Betaalde advertentietekst — gebruik de campaign-brief skill
- UX-onderzoek vanaf nul — CRO is gebaseerd op bestaande gegevens

## Instructies

### Volledige landing page audit

```
Controleer deze landing page op conversieproblemen.

URL of beschrijving: [beschrijf of plak belangrijkste secties]
Doel: [aanmelding / aankoop / demoaanvraag / download]
Huidige conversiesnelheid: [X]% (als bekend)
Verkeersbon: [betaald / organisch / e-mail / referentie]

Evaluatie:

BOVEN DE VOUW (eerste scherm, geen scroll)
- Is de waardepropositie in < 5 seconden duidelijk?
- Spreekt de kop het probleem of verlangen van de bezoeker aan?
- Is er één duidelijke CTA?
- Ondersteunt de hero-afbeelding/video het bericht of leidt het af?
- Is er wrijving (te veel velden, geforceerde accountcreatie)?

VERTROUWEN EN GELOOFWAARDIGHEID
- Sociaal bewijs aanwezig? (reviews, getuigenissen, logo's, casestudy's)
- Is sociaal bewijs specifiek en geloofwaardig (niet alleen "5 sterren")?
- Beveiligingsbadges / garanties bij aankoop/aanmelding?
- Wie heeft dit gebouwd? (Over/team-sectie of oprichterverhaal)

WAARDEPROPOSITIE
- Is het voordeel (resultaat voor gebruiker) duidelijk vs. alleen functies?
- Is er duidelijke differentiatie van alternatieven?
- Is prijsgeving zichtbaar of is er angst voor verborgen kosten?
- Is er risicoomkering? (gratis proef, geld-terug-garantie, geen creditcard)

CTA-ANALYSE
- Hoeveel CTA's op de pagina? (1-2 is ideaal voor gerichte landing pages)
- CTA-tekst: specifiek ("Gratis proef starten") of generiek ("Indienen")?
- CTA-plaatsing: zichtbaar zonder scrollen? Herhaald bij natuurlijke stoppunten?
- CTA-contrast: springt het visueel in het oog?

WRIJVINGSPUNTEN
- Formulierlengte: minder velden = hogere conversie (alleen essentiële gegevens vragen)
- Laadsnelheid: trage pagina's vernietigen conversies (elke seconde = ~7% daling)
- Mobiele ervaring: geoptimaliseerd voor duimschuiven?
- Afleidingen: navigatielinks, sociale feeds die mensen wegsturen?

Resultaat: gerangschikte lijst met problemen met A/B-test hypothesen voor elk.
```

### A/B-test hypothesegenerator

```
Genereer A/B-test hypothesen voor deze pagina.

Huidige pagina: [beschrijf koptekst, CTA, lay-out]
Geïdentificeerde grote wrijvingspunten: [lijst]
Huidige conversiesnelheid: [X]%

Voor elke hypothese:
- Element om te testen: [wat veranderen]
- Controle: [huidige versie]
- Variant: [voorgestelde verandering]
- Verwachte effect: [waarom dit conversie moet verbeteren]
- Hoe meten: [primaire metriek, secundaire metrieke]
- Minimaal vereiste steekproefgrootte: [geschat]
- Prioriteit: [Hoog / Gemiddeld / Laag]
```

### Heatmap-interpretatie

```
Interpreteer deze heatmap- / scrollkaartbevindingen:

Klikgegevens: [beschrijf waar mensen klikken]
Scrolldiepte: [X]% bezoekers bereiken [sectie], [X]% bereiken CTA
Rage clicks: [elementen die herhaaldelijk gefrustreerd worden geklikt?]
Dead clicks: [niet-klikbare elementen worden aangeklikt?]

Diagnose:
1. Wat vertellen de scrollgegevens ons over interesse/uitval?
2. Klikken mensen waar wij willen?
3. Wat verwarde of frustreerde gebruikers (rage clicks)?
4. Wat wordt genegeerd dat niet zou moeten?
5. Top 3 wijzigingen gebaseerd op deze gegevens
```

### Prijspagina-audit

```
Controleer deze prijspagina:

[beschrijf lagen, prijzen, functies, CTA's]

Doelklant: [voor wie is dit]
Grootste bezwaar in dit stadium: [prijs / waarde / risico / complexiteit]

Controleer:
- Is het aanbevolen plan duidelijk? (markering, badge, "Meest populair")
- Worden functies beschreven in termen van resultaten, niet alleen selectievakjes?
- Is er een gratis proef of freemium-instappunt?
- Wordt jaarlijkse vs. maandelijkse prijsstelling duidelijk gepresenteerd?
- Is er een vergelijkingstabel vs. concurrenten of DIY-alternatieven?
- Veelgestelde vragen sectie: beantwoord deze de echte bezwaren?
- Wat gebeurt er als ik op de CTA klik? (wrijving in volgende stap?)
```

## Voorbeeld

**Gebruiker:** Mijn SaaS-prijspagina heeft een conversiesnelheid van 2,1%. 82% van de bezoekers verlaat zonder op een CTA te klikken.

**Claudes CRO-audit:**

Sleutelproblemen op prioriteit:
1. **Hero — geen duidelijke aanbeveling:** 3 gelijk gewogen lagen zonder "hier starten"-signaal → beslissingsverlamming. Fix: Badge "Meest populair" toevoegen aan middelste laag, ondernemingslaag dimmen voor KMO-verkeer.
2. **CTA's zeggen "Aan de slag":** Generiek — geen differentiatie tussen lagen. Fix: Test "Gratis proef starten" (Starter) vs. "Demo plannen" (Pro) vs. "Contacteer verkoop" (Enterprise).
3. **Jaarlijkse/maandelijkse toggle-standaard is jaarlijks:** Bezoekers zien eerst hogere prijs = schokeffect. Fix: A/B-test standaard ingesteld op maandelijkse prijzen.
4. **Geen risicocorrectie:** Geen proefvermelding boven de vouw. Fix: Voeg "14-daagse gratis proef, geen creditcard" regel direct onder CTA's toe.
5. **Veelgestelde vragen beantwoordt prijsbezwaar niet:** "Is dit het waard?" wordt niet beantwoord. Fix: Voeg "Hoe verhoudt dit zich tot [hoofdalternatief]?" en ROI-calculator toe.

**Top A/B-test om eerst uit te voeren:** Wijzig CTA-tekst van "Aan de slag" naar "Gratis proef starten — Geen creditcard" → geschatte verhoging van 20-35% op basis van vergelijkbare SaaS-gegevens.

---
