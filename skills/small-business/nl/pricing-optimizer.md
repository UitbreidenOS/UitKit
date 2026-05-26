# Prijs Optimaliseerder

## Wanneer activeren
- Je overweegt een prijsverhoging en wil een gestructureerd kader in plaats van gissen
- Je hebt prijzen niet meer dan 18+ maanden herzien en inflatie alleen heeft je reële prijzen afgebroken
- Je lanceert een nieuw product of service en je hebt een verdedigbare prijs nodig in plaats van "wat voelt goed"
- Je services zijn anders geprijsd voor verschillende klanten zonder duidelijke logica — je vermoedleidt dat je je beste klanten onderprijst
- Een concurrent heeft prijzen verhoogd of verlaagd en je moet beslissen hoe je reageert

## Wanneer NIET te gebruiken
- Je bent in een commoditymarkt waar prijzen door de markt worden bepaald, niet door jou — race-to-the-bottom-dynamica overschrijft prijsstrategie
- Je hebt een CFO of prijsanalist die al gestructureerde prijsreviews uitvoert
- Je bent pre-product-market-fit — bereik eerst PMF, optimaliseer dan prijzen

## Instructies

### Stap 1: Stel je prijscontext in

Zeg:

"Ik runt een [bedrijfstype] dat [product/service] verkoopt. Mijn huidige prijzen zijn [lijst elke tier of product met zijn prijs]. Mijn gemiddelde customer LTV is [$X]. Mijn brutomarge is [Y%]. Mijn typische customer is [persona]. Mijn hoofdconcurrenten prijzen op [lijst — naam en ruw prijspunt]. Ik heb prijzen [Z] keer in de afgelopen 2 jaar gewijzigd."

### Stap 2: Prijsaudit

Vraag Claude om je huidige prijzen te auditeren.

Zeg:

"Auditeer mijn huidige prijsstructuur. Vlag: (1) elke tier die te dicht bij een ander tier is geprijsd (lage differentiatie), (2) elke tier die te ver van een ander is geprijsd (gat in de waardeladder), (3) elke tier die onder markt is geprijsd op basis van de concurrentenprijzen die ik heb gegeven, (4) elke tier waar de prijs rond is (vaak een teken dat het door gissing is ingesteld, niet door analyse), (5) elke service of product die niet schoon in de prijsladder past."

Lees het audit zorgvuldig. Claude zal soms een "rond getal" als probleem markeren wanneer het ronde getal het juiste is — ronde getallen verminderen besluitvormingswrijving bij de lagere tiers. Gebruik het audit als startpunt.

### Stap 3: Beslissingsframework voor prijsverhoging

Wanneer je een prijsverhoging overweegt:

Zeg:

"Ik overweeg een prijsverhoging op [tier/product] van [$X] naar [$Y] — een [Z%] verhoging. Mijn huidige customers op deze tier zijn [N]. Laatste verhoging was [datum]. Bouw het geval voor en tegen op: (1) wat is de verwachte churn van bestaande customers, (2) wat is de impact op de vraag van nieuwe customers, (3) wat is de impact op de merkpositioning, (4) wat zijn de operationele kosten voor het uitvoeren van twee prijstiers tijdens de overgang, (5) wat is het timingrisico (elk event in de volgende 6 maanden dat de verhoging slecht zou doen uitzien)?"

Je krijgt een gestructureerde voor/tegen. De output is een tool voor besluitondersteuning, niet de besluit zelf.

### Stap 4: Tier-herstructurering

Als je prijsaudit een behoefte aan herstructurering van tiers onthulde:

Zeg:

"Stel 3 alternatieve prijsstructuren voor mijn bedrijf voor: (1) een waardegebaseerde 3-tier ladder, (2) een per-stoel of per-unit structuur indien van toepassing, (3) een op resultaten gebaseerde of hybride structuur. Voor elke, toon: prijzen per tier, de waardeverschil tussen tiers, de doelcustomer voor elke tier, het migratieplan voor bestaande customers, de geprojecteerde omzetimpact in jaar 1."

Bekijk alle drie. Vaak is het "voor de hand liggend" antwoord (meer tiers) fout, en het juiste antwoord is minder, meer gedifferentieerde tiers.

### Stap 5: Migratieplan bestaande customer

Wanneer je prijzen voor bestaande customers verhoogt:

Zeg:

"Ik verhoog prijzen op [tier] van [$X] naar [$Y] effectief [datum]. Ik heb [N] bestaande customers op deze tier met gemiddelde ancienniteit van [Z] maanden. Ontwerp: (1) de aankondigingsmail — duidelijk, respectvol, leidt met reden en waarde in plaats van prijs, (2) een prijs-lockoutaanbieding voor langetermijnklanten die voor 12 maanden tegen het huidige tarief vastzetten, (3) de responssjabloon voor customers die tegengas geven, (4) de responssjabloon voor customers die kiezen om te annuleren."

De behoudsimpact van hoe je de prijsverhoging afhandelt, is vaak meer waard dan de prijsverhoging zelf. Een onhandige mail creëert vermijdbare churn.

### Stap 6: A/B prijstest

Als je bedrijfsvolume dit ondersteunt:

Zeg:

"Ontwerp een prijstest voor mijn [product/service]. Huidige prijs [$X]. Testvarianten: [$Y] en [$Z]. Mijn maandelijks traffic/lead volume is [N]. Design: (1) de teststructuur (welke customers zien welke prijs), (2) de steekproefomvang nodig voor statistische significantie, (3) de beslissingscriteria (conversiepercentage, totale omzet, LTV-implicaties), (4) de testduur, (5) het terugrolplan als de test een onverwachte daling onthult."

De meeste kleine bedrijven hebben niet het volume voor schone A/B prijstesten. De gestructureerde analyse vertelt je of je het doet.

### Stap 7: Concurrentreactie

Wanneer een concurrent hun prijzen wijzigt:

Zeg:

"Concurrent [naam] is net hun prijzen van [$X] naar [$Y] gewijzigd. Mijn huidige prijs is [$Z]. Hun positionering is [premium / mid-market / korting]. Mijn positionering is [hetzelfde / anders]. Analyseer: (1) de waarschijnlijke strategische bedoeling van hun zet, (2) de impact op mijn pipeline als ik niet reageer, (3) drie reactieopties (matchen, vasthouden en differentiëren, verhogen om de kloof te vergroten), (4) de aanbevolen reactie met rationale."

Volg concurrenten zetten niet reflexmatig. De gestructureerde analyse onthult vaak dat vasthouden de juiste oproep is.

## Voorbeeld

Je runt een klein B2B SaaS voor salesteams tegen $99/maand voor de Pro-tier. Je hebt 340 Pro-klanten — $34K MRR op deze tier. Je hebt prijzen niet gewijzigd sinds 28 maanden. Inflatie alleen heeft je reële prijs met ongeveer 12% in deze periode afgebroken.

Je stelt de prijsaudit in. Claude vlaggen:
- De Pro-tier ($99) is te dicht bij de Team-tier ($149) — slechts een 51% delta voor een betekenisvolle capabiliteitsgat
- De Pro-tier is duidelijk onder markt — concurrenten mid-tier aanbiedingen liggen tussen $129 en $199
- Je Enterprise-tier ($499) heeft een te brede gat van Team ($149)

Je besluit Pro van $99 naar $129 te verhogen — een 30% stijging, maar nog steeds onder markt.

Je voert de migratieplanworkflow uit. Claude ontwerpt:

**Aankondigingsmail (340 klanten):**
> Twee jaar geleden, toen we de Pro-tier op $99 lanceerden, had ons product [lijst 3 specifieke functies bij lancering]. Vandaag bevat dezelfde tier [lijst 6 functies sinds toegevoegd]. Vanaf [datum 60 dagen], zal de Pro-tier $129 zijn. Als je het huidge tarief van $99 voor de volgende 12 maanden wilt vastzetten door over te schakelen op jaarlijkse facturering, kun je dat hier doen: [link]. Dit is de eerste prijswijziging die we ooit op Pro hebben gemaakt. We verwachten dat het minstens 24 maanden de laatste is.

**Lockout-aanbieding:** Jaarlijkse facturering op $99/maand equivalent, vergrendeld tot [datum 12 maanden].

**Weerstandsreactie:** Erkent bezorgdheden, verwijzingen het lockoutaanbod, probeert niet op te vergroten.

**Annuleringsreactie:** Erkent, biedt een 30-dagen coulancetermijn, vraagt feedback.

Je stuurt. Over de volgende 30 dagen:
- 110 van 340 klanten (32%) nemen het jaarlijkse lockoutaanbod — vergrendeld op $99 gedurende 12 maanden
- 12 klanten (3,5%) annuleren — binnen het verwachte churnbereik van het model
- 218 klanten blijven maandelijks op de nieuwe prijs van $129

Netto MRR-impact: $34K → $40,2K na migratie voltooid. Dat is $74K van jaarlijkse incrementele opbrengsten. De 12 geannuleerde klanten vertegenwoordigen $14K verloren ARR, wat je toch in de loop van de tijd zou verliezen.

Je plant een 24-maandse herinneringskalender om Pro-prijsstelling te herzien. Dezelfde werkstroom handelt de volgende aanpassing af.
