---
name: product-roadmap
description: "Product roadmap bouwen: priorisatie frameworks (RICE, MoSCoW, opportunity scoring), roadmap formaten, OKR alignment, stakeholder communicatie, en kwartaalplanning"
---

# Product Roadmap Vaardigheid

## Wanneer activeren
- Bouwen of herstructureren van een product roadmap
- Priorisatie van een backlog van features en kansen
- Alignment van de roadmap met company OKRs
- Roadmap communicatie naar verschillende stakeholders (engineering, sales, executives, customers)
- Uitvoering van een kwartaalplanningsproces
- Bepalen wat te snijden als capaciteit beperkt is

## Wanneer NIET gebruiken
- Sprint-level taakplanning — dat is delivery management, niet roadmap
- Discovery (bepalen welke problemen op te lossen) — use the product-discovery vaardigheid
- Schrijven van technische specs of user stories — dat komt na de roadmap beslissing
- A/B-test design — use the experiment-designer vaardigheid

## Instructies

### Priorisatie framework

```
Prioriseer deze backlog met [RICE / MoSCoW / opportunity scoring].

Items om te prioriseren: [lijst — kunnen features, projecten of probleemgebieden zijn]
Beperkingen: [team grootte, tijdshorizon, budget]
Strategische doelen dit kwartaal: [OKRs of top prioriteiten]

RICE scoring (voor feature besluiten):
| Item | Reach | Impact | Confidence | Effort | RICE Score |
|---|---|---|---|---|---|
| Feature A | 500 users/q | 3 (hoog) | 80% | 3 weken | (500×3×0,8)/3 = 400 |
| Feature B | 1000 users/q | 1 (laag) | 90% | 1 week | (1000×1×0,9)/1 = 900 |

Reach: gebruikers beïnvloed per kwartaal
Impact: massaal=3 / hoog=2 / gemiddeld=1 / laag=0,5 / minimaal=0,25
Confidence: % zekerheid over reach en impact schattingen
Effort: engineering weken voor één engineer

MoSCoW (voor vaste-scope releases):
- Must have: zonder dit mislukt de release
- Should have: hoge waarde, opnemen als capaciteit toestaat
- Could have: nice-to-have, eerst te snijden
- Won't have: expliciet buiten scope (voorkomt scope creep)

Opportunity scoring (probleem-level priorisatie):
Score = Importantie + (Importantie − Tevredenheid)
Items met score > 10 = sterke kans

Pas [gekozen framework] toe op mijn backlog en geef een geprioriteerde lijst met redenatie.
```

### Roadmap format design

```
Ontwerp een roadmap format voor [publiek en tijdshorizon].

Publiek: [interne engineering / sales team / customers / executive team / all]
Tijdshorizon: [kwartaal / jaarlijks / rolling 6-maand]
Verbindingsniveau: [committed / directioneel / aspirationeel]
Hudigelijk tool: [Linear / Jira / Notion / ProductBoard / spreadsheet]

Roadmap formaten per publiek:

Engineering roadmap (hoge trouw, committed near-term):
| Thema | Feature | Kwartaal | Status | Eigenaar | Afhankelijkheden |
|---|---|---|---|---|---|
Hoog vertrouwen in Q1, directioneel voor Q2-Q3, placeholder voor Q4.

Sales roadmap (directioneel, geen datums):
"Nu / Volgende / Later" format — vermijdt specifieke data commitments met customers.
Nu: wat in actieve development is
Volgende: wat daarna komt (dit kwartaal of volgende — geen specifieke datum)
Later: wat we overwegen (geen verplichting)

Executive roadmap (outcome-gericht, geen feature lijsten):
Toon OKRs → initiatieven → verwachte resultaten
Niet: "Bouw feature X"
Ja: "Verminder tijd-naar-activatie met 40% → onboarding redesign + email sequence"

Customer-facing roadmap:
Alleen thema's, geen datums ("binnenkort" / "gepland" / "verkennen")
Voeg nooit datums toe tenzij de feature weken weg is
Veiligheid: sta niet publiekelijk in voor features die mogelijk kunnen worden geschrapt

Ontwerp het roadmap format voor mijn specifieke publiek en genereer een template.
```

### OKR alignment

```
Alignment roadmap items naar OKRs.

Company OKRs voor [kwartaal/jaar]: [lijst — objective + key results]
Product OKRs (als apart): [lijst]
Roadmap items huidiging gepland: [lijst van features of initiatieven]

Alignment check:

Voor elk roadmap item:
- Welke OKR draagt het bij? (moet linken met minstens één)
- Welke key result beweegt het? (wees specifiek)
- Hoe zeker zijn we dat het die KR zal verplaatsen? (hoog / gemiddeld / laag)
- Items zonder OKR link: snijden of deprioritiseren tenzij overtuigende uitzondering

Voor elke OKR:
- Welke roadmap items dragen bij? (moet 1-3 items per KR zijn)
- Bestaat er een KR zonder roadmap coverage? (gap — initiatief nodig toevoegen)
- Bestaat er een KR met over-coverage? (te veel items achtervolgen dezelfde outcome — focus)

Output: 
- Roadmap-naar-OKR mapping table
- Gaps (OKRs zonder coverage)
- Over-investeringen (te veel items op één KR)
- Aanbevelingen voor snijdingen of toevoegingen

Alignment mijn roadmap naar de OKRs die ik geef.
```

### Kwartaal planning proces

```
Run een kwartaal planning proces voor [product team].

Team grootte: [X engineers + X PMs + X designers]
Planning horizon: [Q3 2026 — juli tot september]
Hudiige OKRs: [plak]
Capaciteit: [X engineering weken beschikbaar na on-call, tech debt, bugs]

Kwartaal planning tijdlijn (4-week proces):

Week 1 — Input verzameling:
□ Compileer: customer feedback, support tickets, NPS verbatims, sales lost/won reasons
□ Run: data review (welke metrics zijn gezond / ongezond?)
□ Verzamel: stakeholder verzoeken (van sales, CS, marketing)
□ Identificeer: tech debt dat het team actief vertraagt

Week 2 — Opportunity sizing:
□ Cluster inputs in thema's (nog geen features — problemen)
□ Score elk thema: user impact × frequency × strategic fit
□ Identificeer de top 3-5 kansen voor het kwartaal

Week 3 — Scoping en sequencing:
□ Voor elk opportunity: rough T-shirt size (S/M/L/XL)
□ Capaciteit fit: X engineering weken total
□ Sequence: wat moet eerst gaan (afhankelijkheden, risico)?
□ Onderhandel: snijden totdat capaciteit is gehaald + 20% buffer

Week 4 — Alignment en communicatie:
□ Engineering review: technische haalbaarheid check
□ Executive sign-off: OKR alignment bevestigd
□ Sales/CS briefing: wat komt, wat niet
□ Publiceer: interne roadmap updated
□ Team kickoff: Q3 planning voltooid

Output: ingevulde kwartaal plan template met items, eigenaars, en capaciteit toewijzing.
```

## Voorbeeld

**Gebruiker:** We hebben 8 engineers, 2 PMs, Q3 OKRs gericht op activation rate (+30%) en NPS (+10pts). Backlog heeft 23 items. Help me prioriseren.

**Claude's proces:**

Eerst — filter hard voordat je scored.

**Filter 1 — OKR relevantie:**
Van uw 23 items, split in:
- Activation impact: [items die time-to-value, onboarding, first week engagement beïnvloeden]
- NPS impact: [items die klanten expliciet hebben aangevraagd of geklaagd hebben]
- Geen van beide: [items die technisch interessant zijn maar deze twee KRs niet verplaatsen]

De "geen van beide" stapel moet worden gesneden of naar Q4 verplaatst voordat je zelfs scores.

**Filter 2 — Effort reality check:**
Bij 8 engineers voor 13 weken = ~104 engineering weken. Reserve 20% voor bugs/incidents = ~83 weken beschikbaar.
XL items (>8 weken elk) = kan alleen 2-3 per kwartaal doen. Snij de rest of scoop down.

**RICE scoring de shortlist (voorbeeld):**

| Item | Reach | Impact | Confidence | Effort | RICE | OKR |
|---|---|---|---|---|---|---|
| Onboarding checklist redesign | 400 | 3 | 85% | 3w | 340 | Activation |
| Email sequence improvement | 800 | 2 | 70% | 2w | 560 | Activation |
| In-app NPS survey | 1000 | 1 | 90% | 1w | 900 | NPS |
| Bulk export feature | 200 | 2 | 60% | 6w | 40 | Geen van beide |

**Aanbeveling:**
In-app NPS survey (1w, hoog RICE) eerst — snelle winst, maakt meting van je NPS OKR mogelijk.
Email sequence (2w) tweede — hoogste activation ROI per week.
Onboarding redesign (3w) derde — meest strategische activation verbetering.
Bulk export — push naar Q4 tenzij sales deals verliest over dit.

---
