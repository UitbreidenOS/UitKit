---
name: investor-update
description: "Maandelijkse investeerdersupdate per e-mail: MRR, burn, hoogtepunten, dieptepunten, verzoek — in 10 minuten gedaan"
---

# Vaardigheid: Investeerdersupdate

## Wanneer activeren
- Je maandelijkse investeerdersupdate-e-mail schrijven
- Een voortgangsnotitie halverwege de maand aan een hoofdinvesteerder voorbereiden
- Opvolging na een bestuursvergadering met schriftelijke context
- Slecht nieuws op de juiste toon en structuur aan investeerders overbrengen
- Investeerders om specifieke introducties of hulp vragen zonder vaag te zijn

## Wanneer NIET gebruiken
- Formeel bestuursdeck — gebruik `/board-deck-builder`
- Eerste pitch aan een nieuwe investeerder — gebruik `/pitch-deck`
- Juridische / SAFe / financieringsdocumenten — dit is geen sjabloonvaardigheid
- Kwartaals bestuursvergaderingsverhaal — ander formaat en diepgang

## Instructies

### Standaard maandelijkse investeerdersupdateprompt

```
Schrijf mijn maandelijkse investeerdersupdate voor [MAAND JAAR].

Bedrijf: [naam]
Fase: [Seed / Series A / Series B]
Investeerders die dit ontvangen: [lijst typen — angels, seed fund, Series A lead, etc.]

Gegevens voor deze maand:
- MRR / ARR: [huidig] vs. [vorige maand] vs. [zelfde maand vorig jaar indien beschikbaar]
- Nieuwe MRR: [verloren MRR, uitbreidings-MRR, nieuwe logo MRR]
- Burn: [maandelijkse burn] | Resterende kas: [$X] | Startbaan: [X maanden]
- Personeelsbestand: [huidig] vs. [vorige maand]
- Belangrijkste overwinningen: [lijst 3-5 bullet points]
- Belangrijkste uitdagingen: [lijst 2-3 bullet points — eerlijk, niet begraven]
- Verzoek: [1-3 specifieke dingen waarbij investeerders kunnen helpen]

Toon: direct, zelfverzekerd, transparant. Geen spin. Investeerders hebben honderden van deze gezien.
Lengte: 300-500 woorden. Als ze meer willen, vragen ze het wel.
Formaat: e-mailklaar, inclusief onderwerpregel.

Raamwerk:
1. Onderwerpregel: [Maand] Update — [1 krachtige metriek of narratief signaal]
2. Één-regelig overzicht van het bedrijf (de eerlijke samenvatting)
3. Metriekentabel (maximaal 5-7 rijen — alleen metrieke die je elke maand bijhoudt)
4. Hoogtepunten (3-5 bullets — specifiek, toewijsbaar, concreet)
5. Dieptepunten (2-3 bullets — eerlijk, met hoofdoorzaak en wat je doet)
6. Verzoek (1-3 specifieke, uitvoerbare verzoeken — nooit "eventuele introducties zouden geweldig zijn")
7. Één-regelig einde

Genereer de update met mijn gegevens.
```

### Metriekentabelsjablonen

```
Bouw de metriekentabel voor mijn investeerdersupdate.

Fase-passende metrieke om op te nemen:

SEED (pre-PMF):
| Metriek | Deze maand | Vorige maand | MoM verandering |
|---|---|---|---|
| MRR | $X | $X | +X% |
| Betalende klanten | X | X | +X |
| Maandelijkse burn | $X | $X | |
| Startbaan | X maanden | | |
| Top klant ACV | $X | | |
| Activeringspercentage | X% | X% | |

SERIES A (opschaling):
| Metriek | Deze maand | Vorige maand | Doel | Status |
|---|---|---|---|---|
| ARR | $X | $X | $X | ✅/🟡 |
| MoM groei | X% | X% | X% | |
| NRR | X% | X% | >110% | |
| Nieuwe ARR | $X | $X | | |
| Brutomarge | X% | X% | >70% | |
| Maandelijkse burn | $X | $X | | |
| Startbaan | X maanden | | >18m | |
| Personeelsbestand | X | X | | |

SERIES B (efficiëntie):
| Metriek | Deze maand | Vorige maand | JoJ | Doel |
|---|---|---|---|---|
| ARR | $X | $X | +X% | $X |
| NRR | X% | X% | | >120% |
| Burn multiple | Xx | Xx | | <1,5x |
| CAC terugverdientijd | X maanden | | | <12m |
| Brutomarge | X% | X% | | >75% |
| Startbaan | X maanden | | | >24m |

Neem alleen metrieke op die je elke maand bijhoudt — verzin nooit gegevens of maak schattingen zonder dit te vermelden.
```

### Hoogtepunten en dieptepunten inkaderen

```
Schrijf hoogtepunten en dieptepunten voor de investeerdersupdate.

Hoogtepunten:
- Specifiek is goed. Generiek is ruis.
- "Acme Corp getekend ($28K ACV, 2-jarig contract, eerste FSI-logo)" niet "Nog een enterprise deal gesloten"
- Schrijf toe aan mensen: "Maria heeft de nieuwe onboarding in 6 dagen verzonden, waardoor de time-to-value met 40% is gedaald"
- Neem signalen op ook als je nog niet zeker bent: "Drie enterprise pilots converteren sneller dan onze vorige cohort — te vroeg om te concluderen, maar we houden het in de gaten"

Dieptepunten:
- Elke investeerdersupdate moet een dieptepuntensectie hebben. Zonder één ervan nemen investeerders aan dat je dingen verbergt.
- 2-3 bullets. Volgorde: grootste probleem eerst.
- Formaat: [wat er is gebeurd] → [waarom het is gebeurd] → [wat je eraan doet]
- Wijs nooit externe factoren aan de schuld zonder interne te erkennen
- Eindig een dieptepunt nooit zonder een volgende actie

Voorbeelden van goede dieptepunten:
"De verkoopcyclus wordt langer — het gemiddelde aantal dagen om te sluiten groeide van 31 naar 47. Hoofdoorzaak: we gaan sneller omhoog in de markt dan onze juridische documenten en inkoopplaybook kunnen ondersteunen. We werven in Q3 een RevOps-lead om dit op te lossen."

"We verloren onze Head of Engineering aan een beter aanbod. Transitieplan is aanwezig — twee senior IC's dekken 60 dagen terwijl we recruteren. We hebben twee sterke kandidaten in de laatste fase."

"Klantchurn steeg van 1,2% naar 2,8% in juni — geconcentreerd bij 4 klanten in de retailverticaal. Rode draad: implementatie sloeg niet aan. We zijn een speciaal CS check-in programma gestart voor alle retailklanten."

Schrijf hoogtepunten en dieptepunten van mijn gegevens in dit formaat.
```

### De verzoeksectie

```
Schrijf het verzoek voor mijn investeerdersupdate.

Regel: Zeg nooit "eventuele introducties worden gewaardeerd." Wees specifiek.

Goed verzoekformaat:
"Ik zoek [specifiek type introductie]: [wie je probeert te bereiken], [waarom nu], [wat een warme introductie mogelijk zou maken], [ken je iemand?]"

Verzoek categorieën:

INTRODUCTIE VERZOEK:
"Zoek naar introducties bij VP's Engineering bij Series B SaaS-bedrijven met 50-200 engineers — specifiek in fintech of gezondheidszorg. We hebben drie enterprise deals waarbij een peer-referentie van een vergelijkbaar stadium bedrijf de beslissing zou versnellen. Ken je 2-3 mensen die bereid zouden zijn een gesprek te voeren?"

WERVINGSHULP:
"We recruteren een Head of Revenue — 5+ jaar SaaS-verkoopmanagement, comfortabel met $80K-$200K ACV, idealiter van een PLG-naar-enterprise-transitiebedrijf. Ken je iemand? We bieden [compensatiebereik]."

INVESTEERDERSINTRODUCTIE:
"Vroege gesprekken starten met Series A-leads voor een Q4-ronde. We willen graag [fondsttype — enterprise SaaS-specialisten, Midwest-gericht, etc.] ontmoeten. Als je een partner bij [fondsnamen] kent, zou een introductie nu ons helpen om voor de ronde te komen. Graag een one-pager sturen als eerste stap."

ADVIESVERZOEK:
"We beslissen tussen [Optie A] en [Optie B] voor [beslissing]. Heb je oprichters dit eerder zien navigeren? Een gesprek van 20 minuten hierover zou ik waarderen."

KLANTINTRODUCTIE:
"Proberen door te breken in [verticaal]. Op zoek naar beslissers bij [bedrijfstype / rol]. Heb je contacten bij [specifieke bedrijven of soorten bedrijven]?"

Regel: Maximaal 3 verzoeken per update. Investeerders helpen met 1-2 dingen; meer dan dat en geen enkel wordt afgehandeld.

Schrijf mijn verzoeksectie op basis van de context die ik verstrek.
```

### Moeilijke updatesjablonen

```
Schrijf een moeilijke investeerdersupdate voor [situatie].

Sjablonen per situatie:

GEMISTE MAAND:
Onderwerp: [Maand] Update — Doel Gemist, Dit Is Waarom en Wat Er Verandert

We hebben ons [MRR/ARR]-doel deze maand gemist. [Huidig: $X vs. doel: $X — een $X tekort.]

Diagnose (geen excuses):
De primaire drijfveer was [specifieke oorzaak]. We identificeerden dit [wanneer] en hebben [ondernomen actie].

Wat is veranderd:
[Specifieke verandering 1 — bijv. aangescherpte ICP-definitie, gewijzigde commissiestructuur, overgeschakeld naar outbound-first]
[Specifieke verandering 2]

Ons doel voor [volgende maand] is [$X]. Dit is waarom het haalbaar is: [op gegevens gebaseerde reden, geen optimisme].

Verzoek: [specifiek]

---

UITSTEL FONDSENWERVING:
Onderwerp: [Maand] Update — Aanpassen Tijdlijn Fondsenwerving

We verschuiven onze [Series X] tijdlijn van [oorspronkelijke datum] naar [nieuwe datum].

Reden: [eerlijk — marktomstandigheden / metrieke hebben meer tijd nodig / hoofdinvesteerder vroeg om meer gegevens / gewijzigde strategie]

Impact op startbaan: We hebben [X maanden] startbaan bij huidige burn. Dit geeft ons voldoende tijd om het proces goed uit te voeren. [Als krap: we nemen ook [kostenactie] om de startbaan te verlengen naar [nieuwe startbaan] maanden.]

Plan: [wat we doen tussen nu en de ronde — welke mijlpalen we eerst zullen bereiken]

Verzoek: [specifiek — eventuele warme introducties bij [fondsttype] zouden wezenlijk helpen]

---

PIVOT / STRATEGISCHE VERANDERING:
Onderwerp: [Maand] Update — Richting Veranderen op [X]

We maken een significante verandering die ik wil dat je van mij hoort, niet van de markt.

Wat verandert: [de specifieke verandering — productrichting, ICP, go-to-market, prijsmodel]
Waarom: [het specifieke bewijs dat dit dreef — klantdata, conversiepercentages, concurrentsignaal]
Wat hetzelfde blijft: [de kernthese, het team, de marktkans]
Tijdlijn: [wanneer de verandering van kracht wordt, hoe het eerste 60-dagenplan eruit ziet]
Impact op startbaan: [verlengt of verkort dit de startbaan?]

Ik ben beschikbaar om dit te bespreken — antwoord gewoon of boek tijd hier: [kalenderlink]

---

Genereer mijn moeilijke update voor de specifieke situatie waarmee ik te maken heb.
```

## Voorbeeld

**Gebruiker:** Juni-update. MRR $87K (was $79K in mei). Verbrand $92K. Heb $710K kas. Twee overwinningen: Rethink Inc getekend ($6K MRR), betalingsintegratie verzonden. Eén dieptepunt: CTO-medeoprichter verloren — ik moet investeerders dit zorgvuldig vertellen. Ophaalpiijplijn: 4 investeerdersvergaderingen geboekt voor Series A.

**Uitvoer:**

**Onderwerp:** Juni Update — $87K MRR, CTO-overgang, Series A-gesprekken Gestart

---

Hallo iedereen,

Korte juni-update. Er gebeurt veel.

| Metriek | Juni | Mei | Verandering |
|---|---|---|---|
| MRR | $87.000 | $79.000 | +10,1% |
| Maandelijkse burn | $92.000 | $88.000 | |
| Resterende kas | $710.000 | | ~7,7 maanden |
| Betalende klanten | 14 | 12 | +2 |

**Hoogtepunten**

- Rethink Inc getekend voor $6K MRR — onze tweede logistieke klant. De verticaal converteert beter dan verwacht.
- Betalingsintegratie verzonden — 3 klanten wachtten hierop; verwacht uitbreidingsgesprekken in juli.
- 4 Series A investeerdersvergaderingen geboekt voor juli. Vroege gesprekken, nog geen formeel proces.

**Dieptepunten**

- Onze CTO en medeoprichter, Jamie, vertrekt eind juli. Dit is wederzijds en gepland — Jamie keert terug naar Europa en we hebben dit gesprek gevoerd sinds april. We hebben een overgang van 60 dagen gestructureerd, het team is stabiel, en ik interview momenteel fractional CTO's om de komende 6 maanden te dekken terwijl we een permanente vervanger recruteren. Spreek graag live door als dat nuttig is.
- Startbaan is krapper dan ik zou willen met 7,7 maanden. We zijn in kostenbeoordelingsmodus en richten ons op 9+ maanden tegen augustus via een combinatie van omzetversnelling en één personeelsvertraging.

**Verzoek**

- Ken je sterke engineeringleiders (VP Eng / CTO, ervaring bij startups van 50-150 personen, bij voorkeur SaaS of fintech) die willen deelnemen in een vroege fase? We bouwen de pipeline nu.
- Series A: als je partners kent bij fintech-gerichte seed- of vroege-fase-fondsen die actief $3-5M-cheques schrijven, zou een introductie in juli goed getimed zijn terwijl we gesprekken starten.

Tot snel,
[Naam]

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
