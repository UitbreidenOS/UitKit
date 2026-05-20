---
name: oss-license-review
description: "Open source-licentieclassificatie: permissief vs copyleft vs netwerkcopyleft, compatibiliteitsmatrix, verplichtingen implementatiemodel, attributie- en kennisgevingsvereisten"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../oss-license-review.md).

# Open source-licentiebeoordelingsvaardigheid

## Wanneer activeren
- Beoordeling van open source-licenties van afhankelijkheden voordat u een product verstuurt
- Bepalen of de licentie van een bibliotheek compatibel is met uw commerciële product
- Begrijpen wat verplichtingen u hebt bij distributie van software met OSS-componenten
- Controleren of het gebruik van een GPL-bibliotheek zou vereisen dat u uw eigen code open-source maakt
- Het bouwen van een software bill of materials (SBOM) voor compliance of enterprise sales

## Wanneer NIET gebruiken
- Formele juridische adviezen over licentiecompatibiliteit voor hoog-risicoituaties — raadpleeg een advocaat
- Patentlicentieën of patentschadevergoeding — ander gebied van IP-recht
- Handelsmerken gerelateerd aan open source-projectnamen — andere analyse

## Instructies

### Classificeer een enkele licentie

```
Classificeer deze licentie en leg uit wat dit voor mijn project betekent:

Licentie: [MIT / Apache 2.0 / GPL v2 / GPL v3 / LGPL / AGPL / MPL 2.0 / BSD 2-clause / BSD 3-clause / andere]

Mijn project:
- Type: [SaaS (geen binaire distributie) / mobiele app / desktop app / bibliotheek / embedded]
- Hoe ik deze bibliotheek gebruik: [gekoppeld / gebundeld / gewijzigd / ongewijzigd]
- Distributie: [ja — openbaar / alleen intern / geen distributie]

Vertel mij:
1. In welke categorie valt deze licentie (permissief / zwak copyleft / sterk copyleft / netwerkcopyleft)?
2. Wat zijn mijn specifieke verplichtingen?
3. Moet ik mijn broncode vrijgeven?
4. Welke attributie-/kennisgevingsvereisten gelden?
5. Is er een patentlicentie?
```

### Licentiecompatibiliteitsmatrix

```
Mijn project is gelicentieerd als: [MIT / Apache 2.0 / propriëtair commercieel / andere]

Ik wil deze open source-afhankelijkheden gebruiken:
1. [bibliotheeknaam] — [licentie]
2. [bibliotheeknaam] — [licentie]
3. [bibliotheeknaam] — [licentie]

Voor elke afhankelijkheid:
- Is deze licentie compatibel met de licentie van mijn project?
- Welke verplichtingen schept het?
- Kan ik mijn product distribueren zonder mijn broncode vrij te geven?
- Speciale overwegingen voor SaaS/cloud-implementatie?
```

### De sleutellicentiecategorieën

```
Leg de belangrijkste open source-licentiecategorieën en hun praktische implicaties uit:

PERMISSIEF (vrij gebruiken, minimale verplichtingen):
- MIT: vrij gebruiken, wijzigen, distribueren — alleen het copyrightbericht behouden
- Apache 2.0: hetzelfde als MIT + patentlicentie + wijzigingsdocumentatie vereist
- BSD 2/3-clause: vergelijkbaar met MIT, iets ander copyright-formulering

ZWAK COPYLEFT (wijzigingen in de bibliotheek moeten worden gedeeld, maar niet uw app):
- LGPL v2.1/v3: wijzigingen aan de LGPL-bibliotheek zelf moeten open-source zijn
  Dynamisch linken meestal veilig; statisch linken kan verplichtingen activeren
- MPL 2.0: bestand-level copyleft — aangepaste MPL-bestanden moeten open-source zijn

STERK COPYLEFT (geheel gekoppeld werk moet mogelijk open-source zijn):
- GPL v2: distributie activeert volledige broncodefreigave voor gekoppelde/gecombineerde werken
- GPL v3: hetzelfde als v2 + anti-tivoïsatie + patentbeëindigingsbepalingen

NETWERKCOPYLEFT (SaaS-gebruik activeert broncodefreigave):
- AGPL v3: een gewijzigd AGPL-programma uitvoeren als netwerkservice = distributie
  Het gebruik van AGPL-bibliotheek in uw SaaS kan vereisen dat u uw hele codebase vrijgeeft
```

### Afhankelijkheidsaudit

```
Audit uw projectafhankelijkheden op licentierisico's.

[uw package.json / requirements.txt / pom.xml / go.mod / Cargo.toml plakken]

Mijn projecttype: [SaaS / propriëtaire app / open source lib]
Mijn commerciële bedoeling: [verkopen als product / alleen intern / open source]

Vlag:
1. Alle copyleft-licenties die uw vermogen kunnen beperken om broncode gesloten te houden
2. Alle AGPL-licenties (hoogste risico voor SaaS)
3. Licenties die incompatibel zijn met elkaar
4. Alle licenties zonder duidelijke patentlicentie (relevant voor commercieel gebruik)
5. Licenties die specifieke attributie in uw product-UI of documentatie vereisen
```

### Attributie en kennisgevingsvereisten

```
Ik moet de juiste attributie in mijn product opnemen voor deze OSS-componenten:

[bibliotheek en hun licenties opsommen]

Genereer de attributiemededelingen die ik moet opnemen, in het format dat door elke licentie wordt vereist.
Vertel mij waar ik deze moet plaatsen: in de app-UI, in documentatie, in de gedistribueerde binary of in bronbestanden.
```

## Voorbeeld

**Gebruiker:** We bouwen een SaaS-product en ontdekten dat we een AGPL-gelicentieerde bibliotheek voor PDF-generatie gebruiken. We wisten dat niet. Wat betekent dit?

**Analyse van Claude:**

**Kritiek probleem — AGPL in een SaaS-product.**

AGPL v3 Sectie 13 breidt GPL-copyleft uit naar netwerkgebruik: "als u het programma wijzigt, moet uw gewijzigde versie alle gebruikers die er via een computernetwerk mee interactie hebben (als uw versie zulke interactie ondersteunt) prominent de gelegenheid bieden om de Corresponding Source te ontvangen."

**Wat dit voor uw SaaS betekent:**
- Als u de bibliotheek op enige manier hebt gewijzigd, moet u mogelijk uw volledige applicatiebroncode vrijgeven aan gebruikers die er over het netwerk mee interactie hebben
- Zelfs als u het ongewijzigd hebt gebruikt, worden AGPL's "corresponding source"-vereisten in sommige jurisdicties ruim uitgelegd

**Uw opties:**
1. **Vervang de bibliotheek** door een MIT/Apache-gelicentieerd alternatief (aanbevolen als u broncode gesloten wilt houden)
2. **Koop een commerciële licentie** als de bibliotheek een commerciële/enterprise-licentie zonder AGPL-beperkingen aanbiedt (gebruikelijk patroon — controleer hun website)
3. **Open-source uw SaaS** onder een compatibele licentie (zelden het gewenste resultaat)
4. **Raadpleeg een advocaat** om uw specifieke risico te beoordelen gegeven uw jurisdictie, use case en of u de bibliotheek hebt gewijzigd

**Onmiddellijke actie:** Stop met distribueren van het huidige product totdat u een oplossing hebt. [VERIFY] interpretatie met een IP-advocaat.

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
