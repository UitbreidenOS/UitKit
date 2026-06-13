---
name: legal-research
description: "Juridisch onderzoeksassistent: samenvattingen van jurisprudentie, regelgevingsbegeleiding, jurisdictievergelijking"
---

# Juridisch Onderzoek Vaardigheid

## Wanneer activeren
- Het samenvatten van jurisprudentie, regelgeving of begeleidingsdocumenten vóór een vergadering of memo
- Het vergelijken van hoe een juridische kwestie wordt behandeld in meerdere jurisdicties
- Het opstellen van een juridisch onderzoeksmemo met geciteerde bronnen en analyse
- Het begrijpen van de praktische gevolgen van een nieuwe wet of regelgevingswijziging
- Een eerste lezing van een wet of verordening voordat juridisch adviseurs worden ingelicht
- Het voorbereiden van vragen of een onderzoeksagenda voor externe advocaten

## Wanneer NIET gebruiken
- Het verlenen van juridisch advies aan cliënten — Claude is een onderzoeksassistent, geen juridisch raadsman
- Rechtbankstukken, processtukken of formele indieningen — vereisen een erkende advocaat
- Ingrijpende onomkeerbare beslissingen (ondertekenen van een contract, reactie op toezichthouder) — raadpleeg daadwerkelijk juridisch advies
- Jurisdicties waar Claude mogelijk beperkte trainingsdata heeft — valideer altijd met primaire bronnen
- Realtime jurisprudentie-updates — raadpleeg actuele databases (Westlaw, LexisNexis, Casetext, Free Law Project)

## BELANGRIJK

Claude is een juridisch onderzoeksassistent, geen advocaat. Alle uitvoer is uitsluitend voor intern onderzoek en moet worden gevalideerd aan de hand van gezaghebbende primaire bronnen vóór gebruik. Juridische analyse kan veranderen door nieuwe uitspraken, regelgevingsbegeleiding of wetswijzigingen. Verifieer altijd de actualiteit bij een erkende beroepsbeoefenaar in de relevante jurisdictie.

## Instructies

### Prompt voor juridisch onderzoeksmemo

```
Stel een juridisch onderzoeksmemo op over: [JURIDISCHE VRAAG]

Jurisdictie(s): [bijv. Engels en Welsh recht / New York / EU / federaal VS / meerdere jurisdicties]
Context: [waarom deze vraag relevant is — zakelijke beslissing, contractkwestie, nalevingszorg]
Rol aanvrager: [intern juridisch adviseur / compliance officer / zakelijke belanghebbende]
Diepte: [beknopt briefing (1-2 pagina's) / standaardmemo (4-6 pagina's) / diepgaand onderzoek (10+ pagina's)]

Memostructuur:
I. Gestelde vraag
II. Kort antwoord (1-2 alinea's — het antwoord met kernvoorbehouden)
III. Relevante feiten voor de analyse
IV. Bespreking
   - Juridisch kader / toepasselijke wetten en verordeningen
   - Relevante jurisprudentie (samenvatting van kernuitspraken)
   - Analyse van hoe het recht van toepassing is op onze feiten
   - Tegenargumenten of alternatieve interpretaties
V. Conclusie en aanbeveling
VI. Openstaande vragen / Aanvullend onderzoek nodig

Formatteer citaten als: [Zaaksnaam, [Jaar] Jurisdictiecitaat] of [Wet/Verordening, Artikel]
Markeer waar verificatie van primaire bronnen nodig is: [VERIFIEER - bron benodigd]
```

### Prompt voor samenvatting van jurisprudentie

```
Vat de volgende zaak samen voor een niet-juridisch publiek.

Zaak: [Zaaknaam / citaat / plak zaaktekst]
Context: We onderzoeken dit omdat [zakelijke/juridische context].

Stel op:
1. Eénzins-uitspraak (wat de rechtbank heeft beslist)
2. Kernfeiten (2-3 zinnen — alleen feiten die relevant zijn voor de uitspraak)
3. Vastgesteld juridisch beginsel (de rechtsregel uit deze zaak)
4. Praktische implicatie (hoe dit onze situatie beïnvloedt)
5. Precedentwaarde: [bindend / overtuigend / beperkt gezag — en in welke rechtbanken]
6. Eventuele latere behandeling (is het gevolgd, onderscheiden of vernietigd? — markeer indien onzeker)

Houd de taal toegankelijk voor een zakelijk publiek. Juridische termen moeten bij eerste gebruik worden toegelicht.
```

### Prompt voor jurisdictievergelijking

```
Vergelijk hoe [JURIDISCHE KWESTIE] wordt behandeld in [JURISDICTIES].

Kwestie: [beschrijving van de juridische vraag in begrijpelijke taal]
Te vergelijken jurisdicties: [bijv. EU, VK, VS-federaal, Californië, New York, Singapore]
Onze zakelijke context: [waarom we deze vergelijking nodig hebben — contractkeuze voor recht, naleving in meerdere markten, etc.]

Per jurisdictie:
1. Toepasselijke wet/verordening (citeer de naam van de wet of verordening)
2. De regel in die jurisdictie (2-4 zinnen)
3. Kernvereisten of drempels
4. Handhavingsinstantie en handhavingsgeschiedenis (beknopt)
5. Sancties bij niet-naleving
6. Belangrijkste verschillen met de andere vermelde jurisdicties

Uitvoerformaat: vergelijkingstabel + één alinea per jurisdictie voor details.
Markeer: [VERIFIEER] bij specifieke sanctiebedragen, drempels of datums — deze veranderen.

Sluit af met: "Praktische conclusie voor een bedrijf dat in al deze jurisdicties actief is" — wat is de aanpak met de hoogste gemeenschappelijke deler voor naleving?
```

### Prompt voor samenvatting van regelgevingsbegeleiding

```
Vat dit regelgevingsbegeleidingsdocument samen.

Bron: [Naam toezichthouder, titel begeleiding, publicatiedatum]
[Plak tekst of geef URL/beschrijving]

Stel op:
1. Wat de begeleiding omvat (scope en doel)
2. Op wie het van toepassing is (gereguleerde entiteiten)
3. Kernverplichtingen of verwachtingen (genummerde lijst — wat moeten of zouden gereguleerde entiteiten doen?)
4. Deadlines of overgangsperioden
5. Waar de toezichthouder op let bij handhaving
6. Hoe dit verschilt van of eerder beleid verduidelijkt
7. Praktische stappen voor naleving (wat een intern team moet doen na deze begeleiding)

[VERIFIEER]: Noteer bepalingen waar de begeleiding ambigu is of waar ik de primaire regelgeving moet raadplegen.
```

### Prompt voor analyse van wet en verordening

```
Analyseer [WET/VERORDENING] zoals die van toepassing is op [ONZE SITUATIE].

Wet: [volledig citeren — naam, jaar, artikel]
Onze situatie: [beschrijf de feiten]
Jurisdictie: [waar dit van toepassing is]

Analysestructuur:
1. Tekst van de relevante bepaling(en) — citeer letterlijk
2. Gedefinieerde termen — hoe definieert de wet de gebruikte kernbegrippen?
3. Scope — op wie en welke activiteiten is deze bepaling van toepassing?
4. Toepassing op onze feiten — valt onze situatie binnen de scope?
   - Elementen van de bepaling: [vermeld elk element]
   - Onze feiten per element: [analyseer één voor één]
   - Conclusie: [binnen scope / buiten scope / onzeker]
4. Uitzonderingen of veilige havens — zijn die voor ons beschikbaar?
5. Handhavingsmechanisme — wat kan de toezichthouder doen?
6. Praktische aanbeveling

[VERIFIEER] alle wettelijke verwijzingen aan de hand van de actuele versie van de wetgeving.
Opmerking: wetten worden vaak gewijzigd — bevestig de versie die van kracht is op de relevante datum.
```

### Prompt voor juridische risicomatrix

```
Maak een juridische risicomatrix voor [PROJECT/TRANSACTIE/ACTIVITEIT].

Context: [beschrijf wat we doen — nieuwe productlancering, betreden nieuwe markt, M&A, etc.]
Betrokken jurisdicties: [lijst]
Belanghebbenden: [betrokken zakelijke teams]

Per geïdentificeerd juridisch risico:
| Risico | Juridische grondslag | Waarschijnlijkheid | Impact | Eigenaar | Mitigatie |
|---|---|---|---|---|---|
| [Risicobeschrijving] | [Wet/verordening/zaak] | H/M/L | H/M/L | [Rol] | [Actie] |

Te scannen risicocategorieën:
1. Regelgeving: zijn we een gereguleerde entiteit in deze jurisdictie? Is deze activiteit gereguleerd?
2. Contract: welke contractuele verplichtingen of hiaten creëren blootstelling?
3. IP: schendt deze activiteit rechten van derden, of verzuimen we onze eigen rechten te beschermen?
4. Data/Privacy: welke verwerking van persoonsgegevens is hierbij betrokken? Welk kader is van toepassing?
5. Arbeidsrecht: nieuwe jurisdictie, nieuw activiteitstype of nieuwe werknemerscategorie?
6. Aansprakelijkheid: waar liggen de vrijwaringsrisico's? Is er sprake van onbeperkte aansprakelijkheid?
7. Naleving: exportcontroles, sancties, anti-omkoping, mededingingsrecht
8. Rechtszaken: zijn er lopende geschillen die deze activiteit kan triggeren of verergeren?

Markeer elk risico dat externe rechtsbijstand vereist vóór verdere actie.
```

### Prompt voor contractinterpretatie

```
Interpreteer deze contractclausule in de context van het volgende geschil.

Clausule: "[plak exacte clausuletekst]"
Contracttype: [SaaS / diensten / arbeidsovereenkomst / NDA / M&A]
Toepasselijk recht: [jurisdictie]
Feitelijke context: [wat er is gebeurd — de geschilfeiten in 3-5 zinnen]
Ons standpunt: [welke interpretatie ons begunstigt]
Waarschijnlijk standpunt wederpartij: [welke interpretatie hen begunstigt]

Analyse:
1. Letterlijke lezing — wat zegt de clausule op het eerste gezicht?
2. Gedefinieerde termen — zijn er woorden in het contract gedefinieerd? Hoe?
3. Contextuele lezing — hoe informeert de rest van het contract deze clausule?
4. Hoe rechtbanken in [jurisdictie] ambigue contracttaal in het algemeen interpreteren
   (bijv. contra proferentem, ejusdem generis, noscitur a sociis)
5. Welke interpretatie is sterker? Waarom?
6. Wat verliest de opsteller van deze clausule als onze interpretatie prevaleert?
7. Praktische aanbeveling: onderhandelen / accepteren / procederen / specialistisch advies inwinnen

[VERIFIEER]: Bij betwiste clausuleinterpretatie: geef externe rechtsbijstand opdracht vóór het innemen van een standpunt.
```

### Prompt voor onderzoeksagenda

```
Maak een juridische onderzoeksagenda voor [ONDERWERP].

Ik moet externe advocaten inlichten over [X dagen/weken] over [onderwerp].
Budget voor extern onderzoek: [X uur]
Vragen die ik al weet te stellen: [vermeld eventuele]

Stel op:
1. Te beantwoorden juridische vragen (gerangschikt op prioriteit)
2. Per vraag:
   - Het onderzoekstraject (wetten → jurisprudentie → secundaire bronnen)
   - Te behandelen jurisdicties
   - Waarschijnlijke complexiteit (hoog/gemiddeld/laag)
   - Aanbevolen onderzoekstool (Westlaw / LexisNexis / BAILII / EUR-Lex / Google Scholar / Free Law)
3. Vragen die ik intern kan beantwoorden (met Claude + open bronnen)
4. Vragen die externe rechtsbijstand vereisen
5. Een briefing voor externe advocaten: wat we nodig hebben, wat we al weten, waarvan de zakelijke beslissing afhangt

Geschatte onderzoekstijd voor externe advocaten: [X uur — uitgesplitst per vraag]
```

## Voorbeeld

**Gebruiker:** We zijn een VK-SaaS-bedrijf en willen weten of we klantgegevens mogen gebruiken om ons AI-model te trainen. Vat de juridische positie samen onder GDPR.

**Verwachte uitvoer:**
```markdown
# Juridisch Onderzoeksmemo

**Gestelde vraag:**
Kan een VK-SaaS-bedrijf persoonsgegevens van klanten gebruiken om een intern AI-model te trainen onder UK GDPR?

**Kort antwoord:**
Ja, maar alleen als er een geldige rechtsgrond voor de verwerking is, het doel verenigbaar is met het oorspronkelijke verzameldoel, en klanten worden geïnformeerd. In de praktijk vereist dit doorgaans: (a) expliciete toestemming, een gerechtvaardigde-belangen-beoordeling (LIA), of een contractuele grondslag; (b) een DPIA als AI-training hoog-risicoVerwerking vormt; en (c) bijgewerkte privacyberichten. Het gebruik van gegevens voor AI-training die klanten niet verwachtten — en waarover ze niet zijn geïnformeerd — creëert een significant GDPR-handhavingsrisico.
[VERIFIEER aan de hand van actuele ICO-begeleiding — AI- en gegevensbeschermingsbegeleiding bijgewerkt 2024]

**Bespreking:**

**1. Rechtsgrond (Art. 6 UK GDPR)**
Verwerking van klantgegevens voor AI-training vereist een rechtsgrond. De meest relevant toepasselijke grondslagen:

- **Gerechtvaardigd belang (Art. 6(1)(f)):** Beschikbaar als verwerking noodzakelijk is voor uw gerechtvaardigde belangen en niet wordt overschreden door de belangen van de betrokkene. Moet worden ondersteund door een gedocumenteerde LIA. De ICO verwacht dat de LIA overweegt: (i) de aard van het gerechtvaardigde belang; (ii) noodzakelijkheid; (iii) afweging tegenover individuele impact. Risico: klanten verwachten redelijkerwijs niet dat hun gegevens worden gebruikt voor AI-training.
[VERIFIEER - ICO AI- en gegevensbeschermingsbegeleiding, 2024]

- **Toestemming (Art. 6(1)(a)):** Geldig indien vrijelijk gegeven, specifiek, geïnformeerd en ondubbelzinnig. Vereist nieuwe toestemming als de oorspronkelijke toestemming AI-training niet specificeerde. Het recht om toestemming in te trekken moet worden gehandhaafd. Hoge lat — zelden werkbaar op schaal.

- **Uitvoering van contract (Art. 6(1)(b)):** Alleen beschikbaar als AI-training strikt noodzakelijk is voor de uitvoering van het contract. Onwaarschijnlijk van toepassing tenzij het product *een* AI-model is waarvoor de klant een contract heeft gesloten.

**2. Doelbinding (Art. 5(1)(b))**
Persoonsgegevens die voor één doel zijn verzameld (bijv. gebruik van uw SaaS-product) mogen alleen worden gebruikt voor een verenigbaar doel. AI-modeltraining is waarschijnlijk een nieuw doel. Verenigbaarheidstest (Art. 6(4)): overweeg verband tussen doelen, context, aard van gegevens, gevolgen, toegepaste waarborgen.
[VERIFIEER] Geen definitieve ICO-uitspraak over verenigbaarheid van AI-training — huidige positie is in ontwikkeling.

**3. DPIA-vereiste (Art. 35 UK GDPR)**
Grootschalige verwerking van persoonsgegevens met behulp van nieuwe technologie (AI/ML) wordt door de ICO vermeld als waarschijnlijk een DPIA vereisend. Bouw de DPIA vóór aanvang van de training.

**4. Bijwerken privacybericht (Art. 13-14)**
U moet betrokkenen informeren over deze nieuwe verwerking. Werk uw privacybericht bij met: het feit van AI-training, de gebruikte rechtsgrond, eventuele betrokkenheid van derden, en rechten van betrokkenen (inclusief het recht om bezwaar te maken als u vertrouwt op gerechtvaardigd belang).

**Praktische aanbeveling:**
Voordat klantgegevens worden gebruikt voor AI-training: (1) documenteer een Gerechtvaardigde-Belangen-Beoordeling; (2) werk privacyberichten bij; (3) voer een DPIA uit; (4) pas dataminimalisatie toe — gebruik gepseudonimiseerde of geanonimiseerde gegevens waar mogelijk (werkelijk geanonimiseerde gegevens vallen buiten de GDPR). Raadpleeg externe privacyadvocaten over de specifieke feiten vóór verdere actie.

**Openstaande vragen:**
- Betreft het bijzondere categorieën gegevens (Art. 9) — bijv. gezondheid, politieke opvattingen? Zo ja, Art. 9(2)-grond vereist, aanzienlijk hogere lat.
- Onthult de modeluitvoer ooit gegevens op individueel niveau? Zo ja, aanvullende waarborgen nodig.
- Zijn er niet-EU/VK-klanten betrokken? Controleer gelijkwaardige regels (CCPA, Zwitserse nFADP, etc.)
```

---
