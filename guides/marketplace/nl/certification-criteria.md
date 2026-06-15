# Certificeringsmiddelen voor Marketplace Stack

Deze gids beschrijft de gekwantificeerde criteria, kwaliteitsrubrieken en meetmethodologieën voor Claudient Stack-certificering.

## Overzicht

Stack-certificering heeft drie niveaus: Brons, Zilver en Goud. Elk niveau heeft meetbare criteria over vijf dimensies: codekwaliteit, gebruikersacceptatie, gebruikerstevredenheid, onderhoud en documentatie.

---

## Berekening van de Kwaliteitsscore

Elke stack ontvangt een samengestelde kwaliteitsscore (0-100) berekend als:

```
Quality Score = (0.20 × Code Quality) + (0.20 × Adoption) + (0.20 × Satisfaction) + (0.20 × Maintenance) + (0.20 × Documentation)
```

Scorebereiken:
- 80-100: Goudkandidaat
- 60-79: Zilverkandidaat
- 40-59: Bronsvandidaat
- Onder 40: Niet geschikt voor certificering

---

## 1. Codekwaliteit (20%)

**Meting:** Testdekking, linting-naleving, afhankelijkheidsfrisheid, beveiligingsauditresultaten.

| Metriek | Uitstekend (90-100) | Goed (70-89) | Acceptabel (50-69) | Zwak (Onder 50) |
|--------|-------------------|--------------|-------------------|-----------------|
| **Testdekking** | 80%+ | 60-79% | 40-59% | Onder 40% |
| **Linting** | Geen problemen | ≤2 kleine problemen | 3-5 kleine problemen | 6+ problemen of kritieke problemen |
| **Afhankelijkheden** | Alles actueel; automatische updates | 1-2 verouderd; updateplan aanwezig | 3+ verouderd; plan nodig | 5+ ernstig verouderd; kritieke beveiligingsproblemen |
| **Beveiliging** | Jaarlijkse controle; geen problemen | Geen bekende beveiligingsproblemen | 1-2 problemen met lage ernst | Niet-gepatched beveiligingsproblemen |

**Bronsvereiste:** 50+ (acceptabel) in elke metriek
**Zilververeiste:** 70+ (goed) in elke metriek
**Goudrequirement:** 90+ (uitstekend) in elke metriek

---

## 2. Gebruikersacceptatie (20%)

**Meting:** Installatieaantal, wekelijks actieve gebruikers, trendsnelheid, opdrachtgebruik.

| Metriek | Goud | Zilver | Brons |
|--------|------|--------|--------|
| **Totale Installaties (90-daagse venster)** | 200+ | 50+ | 10+ |
| **Wekelijks Actieve Gebruikers** | 25+ | 10+ | 3+ |
| **Trendsnelheid** | +20% week na week | +10% week na week | Stabiel of groeiend |
| **Opdracht-/Vaardigheidsgebruik** | 70%+ functies regelmatig gebruikt | 50%+ functies regelmatig gebruikt | 30%+ functies gebruikt |

**Acceptatiescore = (Installaties / Doel) × 25 + (WAU / Doel) × 25 + (Trendbonus) + (Gebruiksbonus)**

Installatiedoelstellingen: Brons=10, Zilver=50, Goud=200. Indien overschreden, beperkt tot 100 punten.

---

## 3. Gebruikerstevredenheid (20%)

**Meting:** Gemiddelde beoordeling, beoordelingsstemminggevoel, probleemoplossingspercentage, NPS.

| Metriek | Goud | Zilver | Brons |
|--------|------|--------|--------|
| **Gemiddelde Beoordeling** | 4.5+ | 4.0+ | 3.5+ |
| **Beoordelingsaantal** | 20+ beoordelingen | 10+ beoordelingen | 5+ beoordelingen |
| **Probleemoplossingspercentage** | 95%+ problemen opgelost | 85%+ problemen opgelost | 70%+ problemen opgelost |
| **Sentiment (Positieve Beoordelingen)** | 80%+ positief | 70%+ positief | 60%+ positief |
| **NPS (indien beschikbaar)** | 50+ | 40+ | 30+ |

**Tevredenheidsscore = (Beoordeling × 25) + (Oplossingspercentage × 25) + (Sentiment × 25) + (NPS-bonus × 25)**

---

## 4. Onderhoud (20%)

**Meting:** Actualiteit van updates, afhankelijkheidsfrisheid, reactietijd op problemen, commitfrequentie.

| Metriek | Goud | Zilver | Brons |
|--------|------|--------|--------|
| **Dagen Sinds Laatste Update** | 30 dagen | 90 dagen | 180 dagen |
| **Afhankelijkheidsleeftijd** | 90% huidige versies | 80% huidige versies | 70% huidige versies |
| **Gemiddelde Reactietijd op Problemen** | 48 uur | 1 week | 2 weken |
| **Commitfrequentie** | Maandelijks of vaker | Driemaandelijks of vaker | Halfjaarlijks of vaker |
| **Kritieke Openstaande Problemen** | 0 | 0 | 0 (ouder dan 60 dagen) |

**Onderhoudsscore = (Actualiteitsbonus × 25) + (Afhankelijkheidsfrisheid × 25) + (Reactietijd × 25) + (Commitfrequentie × 25)**

Reactietijdscore:
- ≤48 uur: 100 punten
- ≤1 week: 80 punten
- ≤2 weken: 60 punten
- >2 weken: 40 punten

---

## 5. Documentatie (20%)

**Meting:** README-volledigheid, voorbeeldkwaliteit, inlinecommentaren, duidelijkheid, nauwkeurigheid.

| Component | Uitstekend (90-100) | Goed (70-89) | Acceptabel (50-69) | Zwak (Onder 50) |
|-----------|-------------------|--------------|-------------------|-----------------|
| **README** | Complete secties; duidelijke usecases; installatie 5 min | Meeste secties aanwezig; enkele hiaten; installatie 10 min | Basisgegevens aanwezig; onduidelijke secties; installatie 15+ min | Onvolledig; verwarrend; niet functioneel |
| **Voorbeelden** | 3+ uitgebreide voorbeelden met uitleg | 2 werkende voorbeelden; enige uitleg | 1 voorbeeld; minimale uitleg | Voorbeelden ontbreken of niet functioneel |
| **CLAUDE.md** | Duidelijke instructies; alle functies uitgelegd | Meeste instructies aanwezig; enkele hiaten | Basisinstructies; onvolledig | Ontbreekt of onduidelijk |
| **Codecommentaar** | Functies/algoritmen gedocumenteerd; intentie duidelijk | Belangrijke secties opgemerkt | Schaarse commentaren | Geen significante commentaren |
| **Nauwkeurigheid** | Huidige best practices; geen fouten | Licht verouderde elementen; meestal nauwkeurig | Enkele verouderde patronen; kleine onnauwkeurigheden | Aanzienlijk verouderd; grote fouten |

**Documentatiescore = (README × 25) + (Voorbeelden × 25) + (CLAUDE.md × 25) + (Commentaar × 15) + (Nauwkeurigheid × 10)**

---

## Drempels Gebruiken

### Installatiedubbels

Certificering vereist minimale installatieaantallen over een meetvenster:

**Brons:** 10+ installaties (willekeurige periode)
**Zilver:** 50+ installaties gedurende 90 dagen
**Goud:** 200+ installaties gedurende 180 dagen

Installaties worden bijgehouden via:
- npm-pakketdownloads (voor CLI-gebaseerde stacks)
- GitHub-repository klonen
- Claude Code marketplace-installatietracking
- Direct door auteur gerapporteerde installaties (met verificatie)

### Beoordeling Minimumwaarden

**Brons:** Gemiddelde van 3.5+ (5+ beoordelingen vereist voor berekening)
**Zilver:** Gemiddelde van 4.0+ (10+ beoordelingen vereist voor berekening)
**Goud:** Gemiddelde van 4.5+ (20+ beoordelingen vereist voor berekening)

Beoordelingen worden genormaliseerd naar een 5-puntenschaal. Het beoordelingsaantal moet het minimum halen voordat de score als geldig wordt beschouwd.

### Activiteitsdrempels

**Brons:** Bijgewerkt binnen 6 maanden
**Zilver:** Bijgewerkt binnen 3 maanden
**Goud:** Bijgewerkt binnen 1 maand

Updates omvatten:
- Code-commits naar de hoofdtak
- Documentatieupdates
- Afhankelijkheidsbumps
- Reacties op problemen

---

## SLA's voor Onderhoud

### Brons SLA

- Reageert op alle problemen binnen 2 weken
- Corrigeert kritieke fouten binnen 2 weken
- Past brekende afhankelijkheidsupdates toe binnen 1 maand
- Werkt documentatie bij voor API-wijzigingen binnen 2 weken

### Zilver SLA

- Reageert op alle problemen binnen 1 week
- Corrigeert kritieke fouten binnen 2 weken
- Evalueert alle afhankelijkheidsupdates binnen 2 weken
- Houdt documentatie actueel met functiewijzigingen
- Maandelijkse of driemaandelijkse releases

### Goud SLA

- Reageert op alle problemen binnen 48 uur
- Corrigeert kritieke fouten binnen 5 werkdagen
- Evalueert en past alle afhankelijkheidsupdates toe binnen 1 week
- Houdt documentatie gesynchroniseerd met code (binnen 1 week)
- Maandelijkse releases of actieve ontwikkeling
- Proactieve beveiligingscontroles (minstens jaarlijks)

---

## Meetperiode

**Eerste Certificering:** Gebaseerd op de laatste 90 dagen activiteit
**Hercertificering:** Gebaseerd op schuifvenster van 365 dagen

---

## Randgevallen

### Nieuwe Stacks

Stacks onder 90 dagen kunnen Bronscertificering aanvragen als:
- Codekwaliteitsscore is 50+
- Documentatie is volledig
- Handmatige review bevestigt kwaliteit

Op installatiegebaseerde criteria wordt verzaakt voor de eerste 90 dagen.

### Taal en Lokalisatie

Documentatie in het Engels is verplicht voor alle niveaus.

**Zilver en Goud:** Vereisen minstens één extra taal (FR, DE, ES of NL)

### Communitymatige versus Officiële Stacks

Certificeringscriteria zijn identiek ongeacht onderhoudsmodel. Officiële status (tushar2704-onderhoud) verleent geen automatische certificering.

---

## Controle en Verificatie

Het kernteam voert spot audits uit:
- Download en test stackfunctionaliteit
- Verifieer installatieaantal en beoordelingen
- Bekijk recente commits en probleemreacties
- Bevestig documentatieacturaliteit
- Beveiligingsscan op veelvoorkomende beveiligingsproblemen

Audits vinden plaats:
- Voor aanvaarding van eerste certificering
- Driemaandelijks voor Goud-tier stacks
- Jaarlijks voor Zilver-tier stacks
- Elke 18 maanden voor Brons-tier stacks

---

## Bezwaren

Als een stack certificering wordt geweigerd of gedowngradeerd:

1. Auteur kan verduidelijking aanvragen (binnen 1 week)
2. Kernteam biedt gedetailleerde scoreopschatting
3. Auteur kan opnieuw aanvragen na aanpak van geïdentificeerde problemen (na 2 weken)
4. Indien ontevreden met feedback, escaleren naar marketplace@claudient.dev voor onafhankelijke beoordeling

---

**Laatst bijgewerkt:** 15 juni 2026
