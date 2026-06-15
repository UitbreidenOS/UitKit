# Uw Stack Certificeren

Deze gids leidt u stap voor stap door het proces van certificering van uw stack in de Claudient Marketplace.

## Vereisten

Voordat u certificering aanvraagt, zorg ervoor dat uw stack:

1. **Al is gepubliceerd** in de Claudient Marketplace met positieve feedback
2. **Aan basiscriteria voldoet** (zie VETTING.md)
3. **Een GitHub-repository heeft** (openbaar, actief, onderhouden)
4. **Aan minimumvereisten voldoet** voor uw doelniveau:
   - Brons: 10+ installaties, 3.5+ beoordeling
   - Zilver: 50+ installaties, 4.0+ beoordeling, 6+ maanden actieve ontwikkeling
   - Goud: 200+ installaties, 4.5+ beoordeling, officiële onderhoudersgoedkeuring

---

## Stap 1: Evalueer Uw Stack

Gebruik de kwaliteitsrubric in [certification-criteria.md](./certification-criteria.md) om de gereedheid van uw stack in te schatten.

### Checklist

**Codekwaliteit**
- [ ] Testdekking 50%+ (acceptabel) of 70%+ (zilver) of 90%+ (goud)
- [ ] Linting geslaagd; geen kritieke problemen
- [ ] Afhankelijkheden in afgelopen 3 maanden bijgewerkt
- [ ] Geen bekende beveiligingsproblemen

**Acceptatie**
- [ ] Brons: 10+ installaties
- [ ] Zilver: 50+ installaties gedurende 90 dagen
- [ ] Goud: 200+ installaties gedurende 180 dagen

**Tevredenheid**
- [ ] Brons: 3.5+ beoordeling (5+ beoordelingen)
- [ ] Zilver: 4.0+ beoordeling (10+ beoordelingen)
- [ ] Goud: 4.5+ beoordeling (20+ beoordelingen)

**Onderhoud**
- [ ] Bijgewerkt in afgelopen 6 maanden (brons), 3 maanden (zilver), 1 maand (goud)
- [ ] Gemiddelde reactietijd op problemen acceptabel
- [ ] Geen kritieke openstaande problemen

**Documentatie**
- [ ] README compleet en duidelijk
- [ ] Minstens 1 voorbeeld (brons), 2+ (zilver), 3+ (goud)
- [ ] CLAUDE.md aanwezig en nauwkeurig
- [ ] Zilver/Goud: Minstens één extra taal

---

## Stap 2: Bereken Uw Kwaliteitsscore

Gebruik de methodologie in [certification-criteria.md](./certification-criteria.md):

```
Quality Score = (0.20 × Code Quality) + (0.20 × Adoption) + (0.20 × Satisfaction) + (0.20 × Maintenance) + (0.20 × Documentation)
```

Registreer scores voor elke dimensie:

| Dimensie | Score (0-100) |
|-----------|---------------|
| Codekwaliteit | ___ |
| Acceptatie | ___ |
| Tevredenheid | ___ |
| Onderhoud | ___ |
| Documentatie | ___ |
| **Samengestelde Score** | **___** |

**Niveaugeschiktheid:**
- 80-100 → Goudkandidaat
- 60-79 → Zilverkandidaat
- 40-59 → Bronsvandidaat

---

## Stap 3: Certificeringsmaterialen Voorbereiding

Maak een document met:

### A. Stacksamenvatting
- Stacknaam en ID
- URL van GitHub-repository
- Installatieaantal (bron: npm, GitHub of marketplace tracking)
- Huidige gemiddelde beoordeling en beoordelingaantal
- Lijst van belangrijkste functies/vaardigheden

### B. Bewijs van Kwaliteit
- Links naar 2+ communitybeoordelingen of testimonials
- GitHub-activiteitenlogboek (afgelopen 6 maanden)
- Lijst met opgeloste problemen (met reactietijden)
- Testdekkingsrapport (indien beschikbaar)

### C. Onderhoudverplichting
- Naam(en) van auteur(s)
- Verbintenisseniveau: Brons/Zilver/Goud
- Geschatte onderhoudsuren per maand
- Ondersteuningskanalen (GitHub Issues, Discord, email, enz.)
- Plan voor afhandeling van kritieke problemen

### D. Unieke Waardepropositie
- Korte uitleg van wat deze stack waardevol maakt
- Hoe het verschilt van vergelijkbare stacks
- Bewijs van gemeenschapsacceptatie

### E. SLA-nalevingsverklaring

**Voor Brons:**
"Ik zeg toe op alle problemen binnen 2 weken te reageren en kritieke fouten binnen 2 weken op te lossen."

**Voor Zilver:**
"Ik zeg toe op alle problemen binnen 1 week te reageren en kritieke fouten binnen 2 weken op te lossen. Ik zal een maandelijks of driemaandelijks releasetempo handhaven."

**Voor Goud:**
"Ik zeg toe op alle problemen binnen 48 uur te reageren en kritieke fouten binnen 5 werkdagen op te lossen. Ik zal maandelijkse releases onderhouden en jaarlijkse beveiligingsaudits uitvoeren."

---

## Stap 4: Certificeringsreview Aanvragen

Stuur een e-mail naar **marketplace@claudient.dev** met onderwerpregel:

```
Certification Request: [Stack Name] - [Tier] Tier
```

Inclusief:
1. Alle materialen uit stap 3
2. Uw berekende kwaliteitsscore-uitsplitsing
3. Link naar deze stackvermelding in de marketplace
4. Aanvullende context of opmerkingen

**Reactietijdlijn:** Het kernteam erkent binnen 3 werkdagen en begint met de review.

---

## Stap 5: Reageer op Feedback van Kernteam

Het kernteam kan verzoeken om:

**Aanvullende Informatie:**
- Verduidelijking van metrischen
- Aanvullende voorbeelden of documentatie
- Beveiligingsaudit of afhankelijkheidsrapport

**Kleine Updates:**
- Documentatieverbeteringen
- Voorbeeldtoevoegingen
- README-duidelijkheidverbeteringen

**Voorwaardelijke Goedkeuring:**
- Voldoen aan specifieke metriek vóór definitieve goedkeuring
- Aanpak geïdentificeerde problemen en opnieuw aanvragen

**Opnieuw Aanvragen Na Verbeteringen:**
Indien geweigerd, kunt u opnieuw aanvragen na:
- Aanpak van feedback (minimaal 2+ weken)
- Verbetering van zwakke terreinen
- Opbouw van aanvullende acceptatie (indien nodig)

---

## Stap 6: Certificeringsgoedkeuring

Na goedkeuring:

1. **Marketplace-vermelding bijgewerkt** met certificeringsbadge
2. **Index van gecertificeerde stacks bijgewerkt** (marketplace/certified/README.md)
3. **Niveauaanwijzing gepubliceerd:**
   - Brons: In gecertificeerde stacks opgenomen
   - Zilver: In de categorie "Aanbevolen" weergegeven
   - Goud: Op de homepage van de marketplace weergegeven

4. **Auteur geïnformeerd** met:
   - Certificeringsbadge-asset (PNG, SVG)
   - Certificaatbewijs van certificering
   - Persberichtsjabloon (optioneel)
   - Marketingassets

---

## Stap 7: Behoud Uw Certificering

### Doorlopende Verantwoordelijkheden

**Brons (elke 6 maanden) :**
- Gemiddelde beoordeling boven 3.5 houden
- Minstens 10 installaties behouden
- Reageer op problemen binnen 2 weken
- Hercertificeer om badge te behouden

**Zilver (elke 12 maanden) :**
- Gemiddelde beoordeling boven 4.0 houden
- Minstens 50 installaties behouden
- Publish driemaandelijkse updates
- Reageer op problemen binnen 1 week
- Hercertificeer om badge te behouden

**Goud (elke 24 maanden) :**
- Gemiddelde beoordeling boven 4.5 houden
- Minstens 200 installaties behouden
- Publish maandelijkse updates
- Reageer op problemen binnen 48 uur
- Voer jaarlijkse beveiligingsaudit uit
- Hercertificeer om badge te behouden

### Jaarlijks Hercertificeringsproces

**30 dagen vóór vervaldatum:**
- U ontvangt kennisgeving van hercertificering
- Controleer of huidige metriek nog steeds aan niveau-vereisten voldoet
- Dien hercertificeringsbevestiging in bij marketplace@claudient.dev

**Als metriek is afgenomen:**
- Stack kan met één niveau worden gedowngraad
- U heeft 60 dagen om te verbeteren en bezwaar in te dienen
- Indien niet verbeterd, certificering wordt ingetrokken

---

## Certificeringvernieuwing

Uw certificeringsbadge blijft geldig tot de vervaldatum. Vernieuwing op korte termijn (binnen 60 dagen) kan worden geactiveerd door:
- Toevoeging van aanzienlijke functie
- Belangrijke onderhoudsmijlpaal
- Aanvraag voor niveau-upgrade

Het verlengingsproces is identiek aan eerste certificering.

---

## Niveauupgrades

Voor upgrade van Brons naar Zilver of Zilver naar Goud:

1. Zorg ervoor dat nieuwe metriek doelniveau bereikt
2. Stuur upgrade-aanvraag naar marketplace@claudient.dev met bijgewerkte kwaliteitsscore
3. Kernteam verifiëert metriek (2-3 werkdagen)
4. Na goedkeuring worden vermelding en badge bijgewerkt

---

## Decertificering en Bezwaren

Als uw certificering wordt ingetrokken:

1. **Kennisgeving van Reden:** U ontvangt gedetailleerde uitleg
2. **Bezwaarvak:** 2 weken voor extra context
3. **Bezwaarreview:** Onafhankelijk kernteamlid beoordeelt beslissing
4. **Opnieuw aanvragen:** Beschikbaar na 6 maanden verbeteringen

---

## Vragen?

- **Certificeringscriteria:** Zie [certification-criteria.md](./certification-criteria.md)
- **Niveaudetails:** Zie [../CERTIFICATION.md](../CERTIFICATION.md)
- **Algemene vragen:** marketplace@claudient.dev
- **Community-discussie:** [GitHub Discussions](https://github.com/claudients/claudient/discussions)

---

**Laatst bijgewerkt:** 15 juni 2026
