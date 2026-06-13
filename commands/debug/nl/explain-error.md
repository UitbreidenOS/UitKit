---
description: Leg een foutmelding of exception uit met rootcauseanalyse en reparatierichtlijnen
argument-hint: "[foutmelding of plaksel]"
---
Je krijgt een fout of exception. Analyseer dit grondig en produceer een gestructureerde uitleg.

Fout of exception om te analyseren:
$ARGUMENTS

Volg dit proces:

1. **Identificeer het fouttype** — classificeer het (runtime, compile, netwerk, permissie, logica, OOM, enz.) en noem de exacte foutklasse of -code als aanwezig.

2. **Rootcauseanalyse** — leg uit wat werkelijk fout ging op mechanisch niveau. Stop niet bij de oppervlakkige boodschap; trace naar de onderliggende oorzaak. Als de fout een stack trace bevat, volg elk frame en identificeer de oorspronkelijke oproep.

3. **Contextaanwijzingen** — extraheer alle bestandspaden, regelnummers, modulenamen, versietekenreeksen of omgevingshints die in de fout zijn ingebed. Leg uit wat elk ons vertelt.

4. **Veelvoorkomende triggers** — noem de 3–5 meest waarschijnlijke scenario's die deze exact fout produceren, gerangschikt op frequentie. Voor elk, geef aan hoe je het kunt bevestigen of uitsluiten.

5. **Reparatiestrategie** — geef voor elke waarschijnlijke oorzaak de concrete fix. Wees specifiek: voeg configuratietoetsen, codepatronen, opdrachten of bestandswijzigingen in waar van toepassing. Verkies de minimale juiste fix boven brede herschrijvingen.

6. **Preventie** — als deze foutklasse systematisch vermeidbaar is (bijv. met een linterregel, een typeannotatie, een retry-beleid, een null-controle), vermeld dat kort.

Beperkingen:
- Vul niet aan met generiek advies dat op elke fout van toepassing is.
- Als de fouттekst onduidelijk of onvolledig is, vermeld welke aanvullende context je analyse zou veranderen en hoe.
- Wanneer de fix codewijzigingen betreft, toon een before/after diff of een concreet codefragment, geen beschrijving van een fragment.
- Hou het antwoord compact. Senior engineers lezen snel.
