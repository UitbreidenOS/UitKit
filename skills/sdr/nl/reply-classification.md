# Antwoord Classificatie

## Wanneer activeren

Je ontvangt een antwoord van een prospect op een uitgaande e-mail, bericht of poging tot bellen. Je moet het antwoord classificeren, onmiddellijk een reactie opstellen en het naar de juiste actie in je verkoopworkflow routeren. Dit geldt voor SDR-workflows, founder-outreach en elke B2B-engagement waarbij het type antwoord bepaalt welke vervolgstrategie en tactiek nodig is.

## Wanneer NIET gebruiken

- Niet gebruiken voor inkomende leads met eerder vastgesteld belang — deze gaan rechtstreeks naar verkoepgesprek routering.
- Niet gebruiken voor warme introducties waarbij de introducent al vooraf gekwalificeerd heeft — route rechtstreeks naar WARM of HOT.
- Niet gebruiken voor automatische antwoorden, afwezigheidsnotificaties of bouncebacks — markeer deze als systeemruis.
- Niet gebruiken voor antwoorden ouder dan 10 minuten zonder de huidige context opnieuw door te nemen — de intentie van de prospect kan verschuiven.

## Instructies

### Zes-Categorie Classificatiesysteem

#### Categorie 1: HOT
**Definitie:** Expliciet belang + verzoek om meeting, gesprek, prijsgegevens of demo. Geen ambiguïteit.

**Indicatoren:**
- "Wanneer kunnen we een oproep doen?"
- "Stuur me een demo link."
- "Wat zijn je prijzen?"
- "Ik ben geïnteresseerd; laten we wat inplannen."
- "Kunnen we maandag praten?"

**Response SLA:** < 1 uur (ideaal binnen 15 minuten).

**CRM Tags:** `hot`, `demo_requested`, `meeting_booked` (of `calendar_pending`).

**Actiesjabloon:**
```
[Opening] Bedankt — blij om te chatten.

[Volgende Stap] Ik heb [specifiek moment, bijv. "dinsdag 14:00 uur CET"] gereserveerd — werkt dat?
Alternatief, [geef 2-3 andere opties, allemaal binnen 48 uur].

[Geloofwaardigheid] Ondertussen, [voeg 1 relevant casestudy of metriek in].

[Ondertekening] Ik kijk ernaar uit.
```

**Voorbeeldrespons op HOT:**
```
Prospect: "Dit ziet er interessant uit. Kunnen we deze week een afspraak inplannen?"

Jouw antwoord:
Hoi [Naam],

Uitstekend. Dinsdag 10:00 en donderdag 14:00 CET zijn beschikbaar voor mij — welke past beter voor jou?

Ondertussen heb ik een korte casestudy bijgevoegd van [vergelijkbare bedrijf in hun industrie] 
die een verbetering van 40% zag in [hun kernmetriek] in de eerste 90 dagen.

Ik kijk ernaar uit.

[Link naar agenda met 3 slots + voeg één-pager toe]
```

---

#### Categorie 2: WARM
**Definitie:** Geïnteresseerd maar heeft een beperking — timing, begrotingscyclus, concurrerende prioriteit of scopevraag.

**Indicatoren:**
- "Dit zou voor ons volgende kwartaal kunnen werken."
- "We verkennen dit, maar onze begroting is tot Q3 bevroren."
- "Interessant, maar we prioriteren X momenteel."
- "Ik hou ervan — ik moet eerst even met mijn team overleggen."
- "Dit ziet er goed uit. Kun je volgende maand opnieuw contact opnemen?"

**Response SLA:** Zelfde dag (binnen 4-6 uur).

**CRM Tags:** `warm`, `follow_up_scheduled`, `constraint_identified` (tag de specifieke beperking: `budget_cycle`, `timing`, `alignment_needed`, `stakeholder_involved`).

**Actiesjabloon:**
```
[Erkenning] Ik begrijp — [herhaalt de beperking eerlijk].

[Herkadering] Die timing komt eigenlijk goed uit omdat [verklaar waarom de beperking oplosbaar of voorbijgaand is].

[Specifieke Toezegging] Laten we [specifieke datum — bijv. "15 augustus"] vastleggen zodat dit op je radar blijft.
Ik zend je [specifieke waarde: 1 relevant gids, benchmark of checklist] ondertussen.

[Tactisch] Vraag: Wanneer je dit in [hun tijdskader] opnieuw bekijkt, wat zal de topprioriteit zijn om te valideren?
[Dit antwoord helpt je je bericht vooraf in te stellen.]

[CRM Taak] Ik heb dit in ons systeem genoteerd — je hoort van me op [datum].
```

**Voorbeeldrespons op WARM:**
```
Prospect: "Dit is interessant, maar we zijn vastgelegd op andere prioriteiten tot Q3. 
Misschien later?"

Jouw antwoord:
Hoi [Naam],

Begrepen — Q3 is perfect. Q2 is eigenlijk het moment waarop meeste teams tools voor 
Q3/Q4-implementatie gaan evalueren, dus we bevinden ons in een goede positie om ons voor te bereiden.

Laten we 15 augustus vastleggen voor een gesprek. Ondertussen zend ik je onze 
"[Industrie]-Gereedheidslijst" — 3 vragen om te valideren of [jouw oplossing] 
de juiste keus is voor jouw stack.

Snelle vraag: Wanneer je dit in augustus opnieuw bekijkt, zul je [kerngebruiksgeval] 
of [alternatief gebruiksgeval] evalueren? Helpt me aanpassen wat we bespreken.

Ik heb een herinnering voor 10 augustus ingesteld. Tot ziens.

[Checklist PDF]
```

---

#### Categorie 3: NEUTRAAL
**Definitie:** Beleefd maar niet-committal. Geen beperking, geen bezwaar — gewoon lauw belang.

**Indicatoren:**
- "Interessant, ik zal het onthouden."
- "Bedankt voor het bereiken — ziet nuttig uit."
- "Geen prioriteit op dit moment, maar bedankt."
- "Ik zal even kijken."
- [Geen antwoord na 3 dagen van initiële outreach — behandel als NEUTRAAL bij tweede contact.]

**Response SLA:** 24–48 uur.

**CRM Tags:** `neutral`, `one_follow_up_sent`, `interest_level_low`, `deprioritise_after_followup`.

**Actiestrategie:**
- Stuur exact ÉÉN vervolgbericht met een zeer specifieke vraag ontworpen om verborgen bezwaar of verborgen behoefte te ontdekken.
- Als de vraag ontkenning of stilte krijgt, deprioritiseer onmiddellijk.
- Loop NEUTRAAL prospects niet meer dan eenmaal — het verspilt pipelinesnelheid.

**Actiesjabloon:**
```
[Personalisering] Ik merkte dat je [specifieke actie — bijv. "onze prijspagina bezocht" / "mijn laatste e-mail opende"].

[Specifieke Vraag] Snelle vraag: Wanneer je nadenkt over [hun kernprobleem], 
is [specifiek wrijvingspunt] iets waar jouw team mee worstelt vandaag?

[Low-Pressure Sluiting] Als het niet bovenaan staat, geen probleem — ik ben er als dat verandert.
Antwoord met een enkel woord als je verbonden wilt blijven.
```

**Voorbeeldrespons op NEUTRAAL:**
```
Prospect (initieel antwoord): "Bedankt voor het bereiken. Ziet interessant uit — ik zal even kijken."

Jouw vervolgbericht (1 dag later):
Hoi [Naam],

Snelle vraag: Ik merkte dat je werkt in [afdeling]. Wanneer jouw team [kernproces] beheert, 
hoe ga je momenteel om met [specifieke knelpunt die je weet dat ze tegenkomen]?

Benieuwd of dat een wrijvingspunt voor je is. Indien niet, volledig begrijpelijk — ik zal over 6 maanden checken als dingen veranderen.

[Slechts één vraag — geen pitch]
```

---

#### Categorie 4: BEZWAAR
**Definitie:** Specifieke, gestelde tegenwerping — prijs te hoog, concurrentvoorkeur, timing niet aansluitend of gestelde behoefte-gat.

**Indicatoren:**
- "We gebruiken al [concurrent]."
- "Je prijzen zijn te hoog voor ons budget."
- "We zijn hier nog niet klaar voor."
- "Waarom zouden we dit nodig hebben als we [interne oplossing] hebben?"
- "Ik denk niet dat dit [specifiek probleem dat we hebben] oplost."

**Response SLA:** Zelfde dag (binnen 2 uur is ideaal — toont dat je bezwaren serieus neemt).

**CRM Tags:** `objection`, `objection_type:[price|timing|competitor|feature_gap|internal_solution]`.

**Kernprincipe:** NOOIT argumenteren of verdedigen. Erkennen, herkaderen met sociaal bewijs of logica, omleiden met een vraag die naar inzicht leidt.

**Actiesjabloon:**
```
[Erkenning — spiegel hun exact bezwaar terug]
"Ik begrijp — [herhaal bezwaar in hun woorden]. Dat is logisch."

[Herkadering — bied een nieuw perspectief of gegevenspunt, GEEN tegenargument]
"Hier is wat ik heb gevonden: [vergelijkbare bedrijven / gegevenspunt / customer inzicht dat hun bezwaar adresseert]."

[Vraag — leid om naar een nieuwe hoek of diepte]
"Vraag: [vraag iets dat onthult of het bezwaar echt is of een vertragingstactiek]?"

[Volgende Stap — voorwaardelijk, gebaseerd op wat ze nodig hebben om vooruit te gaan]
"Als we [hun bezwaar] konden adresseren, zou dat dingen veranderen?"
```

**Bezwaar-Specifieke Prompts:**

**Prijsbezwaar:**
```
Ik snap het — begroting is krap. Hier is wat ik heb gezien bij [vergelijkbare bedrijf naar grootte]:
ze begonnen met [1 specifiek gebruiksgeval] voor [X kosten] in plaats van volledige uitrol.
Zag [specifieke ROI] in 60 dagen, toen uitgebreid.

Zou een gefaseerde benadering voor jou logisch zijn?
```

**Concurrentbezwaar:**
```
[Concurrent] is solide — we zien ze in [X% van vergelijkbare bedrijven].
Hier is waar we anders zijn: [één specifiek, bewijsbaar verschil — geen functies, maar resultaten].

Hebben jullie [specifieke ding dat concurrent niet adresseert]?
```

**Timingbezwaar:**
```
Timing is belangrijk. De meeste teams die 6+ maanden uitstellen, hebben dit eerder dan verwacht nodig.
Vraag: Wat zou in de volgende 30 dagen moeten gebeuren om dit hoger op je lijst te zetten?
```

**Functiequabbezwaar:**
```
Dat is een goed punt — [erken gat]. Hier is wat we horen van vergelijkbare teams:
[leg uit hoe resultaat wordt bereikt ondanks het gat, OF leg roadmap uit].

Is dat specifieke gat een blokkeerder, of is er een workaround die in jouw workflow past?
```

**Voorbeeldrespons op BEZWAAR:**
```
Prospect: "Je prijzen zijn veel hoger dan [concurrent]. We kunnen dat uitgaven nu niet rechtvaardigen."

Jouw antwoord:
Hoi [Naam],

Ik begrijp — prijzen zijn echt een beperking. Ik zal direct zijn: we zijn niet de goedkoopste. 
Hier is waarom teams ons toch kiezen: [mediane klant] recupereerde hun jaarlijkse kosten 
in implementatiebespaarnis binnen 90 dagen.

Ik weet dat [concurrent] minder vooraf kost. Ze zijn goed. Ander afweging — 
ze vereisen 2-3x meer handmatige setup en voortdurend afstemmen.

Snelle vraag: Hoeveel tijd brengt jouw team momenteel door op [handmatig proces 
dat ons product automatiseert]? Als we zelfs een deel van die tijd konden terugwinnen, 
zou de ROI-wiskundige afweging kloppen?

Blij om opties te verkennen als je wilt graven.
```

---

#### Categorie 5: AFWIJZING
**Definitie:** Hard nee, expliciet desinteresse of gestelde irrelevantie voor hun bedrijf.

**Indicatoren:**
- "Niet geïnteresseerd."
- "We hebben dit niet nodig."
- "Verwijder me van je lijst."
- "Slechte timing — nooit voor ons."
- "Dit is niet van toepassing op ons bedrijf."

**Response SLA:** Binnen 1 uur (respecteer hun tijd en grens).

**CRM Tags:** `rejected`, `retirement_date:[6 maanden vanaf vandaag]`, `do_not_contact_until:[datum]`.

**Kernprincipe:** Bedank, respecteer de grens, GEEN poging om te overtuigen. Zet een auto-pensioensdatum in CRM in (6 maanden). Archiveer de thread.

**Actiesjabloon:**
```
[Respect] Geen probleem — ik waardeer dat je me laat weten.

[Sluiting] Mocht je situatie in de toekomst veranderen, je weet waar je me kunt vinden.

[Ondertekening] Veel succes met [hun kernbedrijf].
```

**Voorbeeldrespons op AFWIJZING:**
```
Prospect: "Niet geïnteresseerd. Stop met het bereiken."

Jouw antwoord:
Hoi [Naam],

Volledig begrepen. Ik zal je van mijn lijst verwijderen — geen e-mails meer van mij.

Mocht je situatie naar beneden veranderen, voel je vrij om me op elk moment te bereiken.

Veel succes met [hun gestelde focusgebied].
```

**CRM Actie:** Zet taak: `Reactiveer [Naam] op [datum 6 maanden vanaf nu]` met notitie: "Controleer of bedrijf is gegroeid of prioriteiten zijn verschoven."

---

#### Categorie 6: NIET ICP
**Definitie:** Verkeerde persoon, verkeerd bedrijfsstadium, verkeerde industrie of expliciet "niet relevant voor ons."

**Indicatoren:**
- "Ik ben niet de juiste persoon — praat met [Naam in andere afdeling]."
- "We zijn een [stadium] bedrijf — dit is voor [ander stadium]."
- "Onze industrie gebruikt dit type oplossing niet echt."
- "We outsourcen deze functie — praat met onze [leverancier/partner]."

**Response SLA:** Binnen 4 uur (gebruik het verwijzingsmomentum).

**CRM Tags:** `not_icp`, `referred_to:[nieuwe contactnaam + titel]`, `referral_source:[originele prospectnaam]`.

**Kernprincipe:** Behandel de verwijzing als een geschenk. Vraag toestemming, krijg het juiste e-mailadres, personaliseer de outreach met de verwijzingscontext.

**Actiesjabloon:**
```
[Dankbaarheid] Bedankt dat je me naar [juiste persoon] hebt gewezen.

[Toestemming] Mag ik vermelden dat je hen hebt voorgesteld, of geef je liever niet aan dat je hen hebt genaamd?

[Verbindingsverzoek] Zou het raar zijn als ik ze rechtstreeks bereik, of zou je liever introduceren?

[Fallback] Mocht direct beter zijn, kun je me hun e-mailadres doorsturen?
```

**Voorbeeldrespons op NIET ICP:**
```
Prospect: "Ik beheer begroting, maar dit is echt een operationele vraag. Praat met Sarah Chen — ze is onze VP Operations."

Jouw antwoord:
Hoi [Naam],

Bedankt daarvoor — Sarah is precies wie ik moet spreken.

Mag ik zeggen dat je haar hebt voorgesteld, of geef je liever niet aan dat je haar hebt genaamd?

Mocht je daar erg open voor zijn, ik kon een bericht opstellen en jij kon het doorsturen — 
of ik kan haar koud bereiken en je naam noemen. Beide werken prima voor me.

Ik waardeer de richting.
```

**Onmiddellijke CRM Actie:**
```
1. Maak nieuw prospectrecord: Sarah Chen, VP Operations, [Bedrijf], met notitie "Verwezen door [originele prospect]"
2. Tag origineel prospect: `referral_sent_to:[nieuw prospect], date:[vandaag]`
3. Personaliseer eerste outreach: "Hoi Sarah, [Origineel Prospect] stelde voor dat ik contact met je opneem over..."
```

---

### Classificatieprompt (Om met Claude te Gebruiken)

```
Je bent een B2B-verkoopantwoordclassificeerder. Een prospect heeft op een uitgaand bericht geantwoord. 
Classificeer hun antwoord in precies één van deze zes categorieën, stel een reactie op en 
identificeer CRM-acties.

Prospectantwoord:
---
[VOEG HIER PROSPECTANTWOORD IN]
---

Classificatietaak:
1. Bepaal de beste categorie: HOT, WARM, NEUTRAAL, BEZWAAR, AFWIJZING, NIET ICP
2. Leid 2–3 specifieke indicatoren op die deze classificatie ondersteunen
3. Identificeer de response SLA (tijd om te antwoorden)
4. Stel een reactie op met behulp van het goedgekeurd sjabloon voor die categorie
5. Specificeer CRM-tags en geplande vervolgactiviteiten

Uitvoerindeling:
**Classificatie:** [CATEGORIE]
**Indicatoren:** [leid 2-3 specifieke uitdrukkingen/signalen op uit hun antwoord]
**SLA:** [tijdvenster]
**CRM Tags:** [tags om toe te passen]
**Reactieconceptus:**
[Jouw volledige opgestelde reactie, klaar om te verzenden — geen bewerkingen nodig]
**CRM Acties:**
- [Actie 1]
- [Actie 2]

Onthoud: Nooit argumenteren met bezwaren. Altijd een verduidelijkingsvraag stellen voor NEUTRALE antwoorden. 
Altijd verwijzingsinformatie aanvragen voor NIET ICP. Altijd AFWIJZINGGRENZEN respecteren.
```

---

### Beslissingsboom (Snelle Referentie)

```
Prospect antwoordde. Vraag in volgorde:

1. Vragen ze om een meeting, gesprek, demo of prijzen?
   → JA: HOT (< 1 uur antwoord)
   → NEE: Volgende vraag

2. Drukken ze interesse uit maar noemen een timing-, begroting- of prioriteitsbeperking?
   → JA: WARM (zelfde dag antwoord, lock specifieke datum)
   → NEE: Volgende vraag

3. Is hun antwoord beleefd maar niet-committal, zonder gestelde beperking of bezwaar?
   → JA: NEUTRAAL (één vervolgbericht met specifieke vraag alleen)
   → NEE: Volgende vraag

4. Noemen ze een specifiek bezwaar (prijs, concurrent, behoefte, timing)?
   → JA: BEZWAAR (erkennen, herkaderen, omleiden met vraag)
   → NEE: Volgende vraag

5. Zeggen ze expliciet "nee", "niet geïnteresseerd" of "verwijder me"?
   → JA: AFWIJZING (bedank, respecteer grens, pensioensleeftijd 6 maanden)
   → NEE: Laatste vraag

6. Zijn ze het verkeerde contact, verkeerd bedrijfsstadium of expliciet buiten bereik?
   → JA: NIET ICP (vraag om verwijzing, bedank, escaleer via verwijzer)
   → NEE: Herlees het originele antwoord — je hebt mogelijk misclassificeerd.
```

---

### SLA en CRM Workflowsamenvatting

| Categorie | Response SLA | CRM Tag | Volgende CRM Actie | Vervolgactivateur |
|----------|--------------|---------|-----------------|------------------|
| **HOT** | < 1 uur | `hot` | Maak agendakoppeling + stuur bevestiging | Agendabevestiging of annulering |
| **WARM** | Zelfde dag (4–6 uur) | `warm` + beperkingstype | Zet taak: vervolgbericht op specifieke datum | Doelvervolgdatum of stilte na 3 dagen |
| **NEUTRAAL** | 24–48 uur | `neutral`, `one_follow_up_sent` | ÉÉN vervolgbericht alleen; geen antwoord = deprioritiseer | 7 dagen stilte = sluit lus, markeer `gedeprioritiseerd` |
| **BEZWAAR** | Zelfde dag (< 2 uur) | `objection` + type | Zet taak: vervolgbericht na reactie | Prospect antwoordt opnieuw of 5 dagen stilte = NEUTRAAL |
| **AFWIJZING** | Binnen 1 uur | `rejected`, `retire_date:[6m]` | Zet herinnering om in 6 maanden te reactiveren | Alleen reactivatiedatum |
| **NIET ICP** | Binnen 4 uur | `not_icp`, `referred_to:[naam]` | Bereik verwezen contact; tag bron | Verwijzingsoutreach verzonden |

---

### Valkuilen Waarschuwingen

**WARM verwarren met HOT:**
Prospect zegt: "Ziet goed uit — laten we volgende kwartaal praten."
Fout: Behandel als HOT omdat ze "laten we praten" zeiden.
Juist: Dit is WARM. Ze hebben een timingbeperking. Lock de specifieke datum (Q3), stuur waardinhoud ondertussen.

**Argumenteren met BEZWAAR:**
Fout: "Eigenlijk is onze prijsstelling eerlijk omdat..."
Juist: "Ik begrijp — prijs is een beperking. Hier is wat andere teams hebben gevonden..."

**NEUTRAAL eindeloos loopen:**
Fout: Stuur 3–4 vervolgberichten naar een "Ik zal het onthouden" prospect.
Juist: Één vervolgbericht met een peilende vraag. Stilte daarna = sluit, ga door.

**Vergeten om verwijzing voor NIET ICP te vragen:**
Fout: "Bedankt voor de context — veel succes."
Juist: "Kun je me introduceren bij [persoon die ze noemden]? Hoe bereik ik ze?"

**AFWIJZING respecteren maar 2 weken later checken:**
Fout: Je hebt een 6-maands pensioenering ingesteld, maar na 2 weken zeg je: "Even checken..."
Juist: Echt pensionering. Zet agendaherinnering voor 6 maanden. Niet opnieuw bezoeken.

---

## Voorbeeld

### Scenario 1: HOT Classificatie

**Prospectantwoord:**
```
Hoi [Jouw Naam],

Dit is precies wat we nodig hebben. Ons team zoekt al maanden naar een oplossing zoals deze. 
Wanneer kunnen we een demo inplannen? We zijn donderdag of vrijdag deze week beschikbaar.

Bedankt,
[Prospectnaam]
```

**Classificatie-uitvoer:**

**Classificatie:** HOT

**Indicatoren:**
- "precies wat we nodig hebben" (expliciete validatie)
- "zoekt al maanden naar een oplossing zoals deze" (gestelde pijn + validatie)
- "Wanneer kunnen we een demo inplannen?" (expliciete verzoek om vergadering)

**SLA:** < 1 uur (streef naar 15 minuten)

**CRM Tags:** `hot`, `demo_requested`, `meeting_pending`

**Reactieconceptus:**
```
Hoi [Prospectnaam],

Uitstekend — ik ben ook blij op deze match.

Ik heb donderdag 14:00 CET en vrijdag 10:00 CET gereserveerd. Welke past beter voor jou?

Ik zend voordien een beknopt overzicht van jouw gebruiksgeval. Ook bijgevoegd 
een casestudy van [vergelijkbaar bedrijf in hun industrie] — zij implementeerden in Q1 
en verminderden hun [kernmetriek waar ze om geven] met 30% in het eerste kwartaal.

Ik kijk ernaar uit om verbonden te raken.

[Link naar 15-min agendakiezer met beide tijdsloten]
[Één-pagina productoverzicht + 1 relevant casestudy PDF]
```

**CRM Acties:**
- Maak agendablok voor donderdag 14:00 en vrijdag 10:00
- Tag prospect: `hot`, `demo_requested`
- Indien bevestigd: maak taak "Stuur pre-call brief + casestudy" met 2-uur deadline
- Escaleer naar verkoopsmanager voor zichtbaarheid (als dit je proces is)

---

### Scenario 2: WARM Classificatie

**Prospectantwoord:**
```
Bedankt voor het bereiken. Dit staat zeker op onze roadmap, maar we hebben pas budget 
goedgekeurd in Q3. De timing is nu niet ideaal, maar ik hou van wat je doet.

Laat me weten hoe ik in de lus kan blijven voor later.

[Prospectnaam]
```

**Classificatie-uitvoer:**

**Classificatie:** WARM

**Indicatoren:**
- "staat zeker op onze roadmap" (gevalideerde behoefte)
- "we hebben pas budget goedgekeurd in Q3" (specifieke beperking + toekomstige intentie)
- "ik hou van wat je doet" (echt belang, geen beleefd verwijt)

**SLA:** Zelfde dag (binnen 6 uur)

**CRM Tags:** `warm`, `follow_up_scheduled`, `constraint_identified:budget_cycle`, `budget_approval_Q3`

**Reactieconceptus:**
```
Hoi [Prospectnaam],

Perfect — Q3 is eigenlijk ideaal timingwerk. De meeste teams evalueren leveranciers in Q2 
voor Q3-implementatie, dus je bent een stap voor.

Ik heb 15 augustus in mijn agenda gesloten om opnieuw verbinding te maken. Ondertussen zend ik 
je onze "Leverancier Evaluatiechecklist" — drie vragen om fit te valideren voordat 
je begrotingsbeoordeling van start gaat.

Snelle vraag: Wanneer je dit in Q3 opnieuw bekijkt, zul je naar [kerngebruiksgeval] 
of [alternatief gebruiksgeval] zoeken? Helpt me ervoor zorgen dat we je op wat telt meeste positioneren.

Ik kijk ernaar uit om in Q3 verbonden te raken.

[Checklist PDF]
```

**CRM Acties:**
- Maak taak: "Vervolgbericht met [Prospectnaam] op 15 augustus"
- Tag: `warm`, `follow_up_scheduled`, `budget_cycle_Q3`
- Zet herinnering: "Stuur waardeinhoud (checklist, gids, benchmark) binnen 24 uur"
- Notitie in thread: "Beperking: Begroting pas goedgekeurd in Q3. Geen bezwaar tegen product."

---

### Scenario 3: BEZWAAR Classificatie

**Prospectantwoord:**
```
Ik waardeer dat je bereikt. We hebben al [concurrentnaam] in plek, 
en overschakelingskosten zouden momenteel te hoog zijn. Het is een goed product, 
maar ik zie geen reden om te verplaatsen.

[Prospectnaam]
```

**Classificatie-uitvoer:**

**Classificatie:** BEZWAAR

**Indicatoren:**
- "hebben al [concurrent] in plek" (gestelde concurrentalternatief)
- "overschakelingskosten zouden te hoog zijn" (specifiek, gekwantificeerd bezwaar)
- "zie geen reden om te verplaatsen" (bevestigingsbehoefte, geen afwijzing)

**SLA:** Zelfde dag (< 2 uur)

**CRM Tags:** `objection`, `objection_type:competitor`, `incumbent:[concurrentnaam]`

**Reactieconceptus:**
```
Hoi [Prospectnaam],

[Concurrent] is solide — we zien hen in ongeveer 40% van de bedrijven waarmee we spreken. 
Geen tegenargument daar.

Hier is waar we anders zijn: We zijn gebouwd voor [specifiek resultaat dat concurrent niet prioriteert], 
wat meestal [concreet voordeel] betekent. De meeste teams waarmee we werkten, hadden [concurrent] 
eerst parallel draaiend, toen geleidelijk werkstromen overgezet.

Vraag: Behandelt jouw team momenteel [specifiek proces dat pijnlijk is met concurrent]? 
Mocht het geen pijnpunt zijn, blijf dan bij wat je hebt. Maar als het wel is, 
we hebben een 30-daags proefperiode die nulrisico is.

Waard een snel gesprek? Of zal ik over 6 maanden terugkomen?
```

**CRM Acties:**
- Tag: `objection`, `objection_type:competitor`, `incumbent:[concurrentnaam]`
- Zet taak: "Vervolgbericht mocht ze in 5 dagen niet antwoorden" (ze overwegen misschien)
- Notitie: "Overschakelingskosten zijn echt — leid met migratiebehulp in volgende bericht mocht zij zich verbinden"

---

### Scenario 4: NEUTRAAL Classificatie

**Prospectantwoord:**
```
Bedankt voor het bereiken. Ziet interessant uit. Ik zal even kijken en kom terug 
als ik denk dat het een goede match is.

[Prospectnaam]
```

**Classificatie-uitvoer:**

**Classificatie:** NEUTRAAL

**Indicatoren:**
- "Ziet interessant uit" (beleefd, niet-committal)
- "Ik zal even kijken" (geen tijdlijn, geen urgentie)
- Geen gestelde beperking, geen bezwaar, geen verzoek

**SLA:** 24–48 uur

**CRM Tags:** `neutral`, `one_follow_up_scheduled`

**Reactieconceptus (stuur 1 dag later):**
```
Hoi [Prospectnaam],

Snelle vraag: Wanneer jouw team [hun kernproces] behandelt, is [specifiek wrijvingspunt relevant voor jouw oplossing] 
iets dat je vertraagt?

Benieuwd of het op je radar staat. Mocht je dat niet doen, geen probleem — ik zal over 6 maanden terugkomen 
als dingen veranderen.

Één woord terug en ik zal verbonden blijven.
```

**CRM Acties:**
- Tag: `neutral`
- Zet één vervolgbericht slechts (ingepland 1 dag hierna)
- Mocht geen antwoord 7 dagen na vervolgbericht: tag `deprioritised`, sluit lus
- Loop NIET meer dan eenmaal

---

Dit vaardigheidssysteem zorgt ervoor dat elk antwoord met precisie wordt afgehandeld, elke prospect weet wat te verwachten, en geen energie wordt verspild aan antwoorden die niet converteren. Gebruik de beslissingsboom hierboven als je snelle referentie in real-time outreach.
