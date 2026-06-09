---
description: Verklaar een foutmelding of uitzondering met analyse van de hoofdoorzaak en reparatierichtlijnen
argument-hint: "[error message or paste]"
---
Je krijgt een fout of uitzondering. Analyseer deze grondig en produceer een gestructureerde uitleg.

Fout of uitzondering om te analyseren:
$ARGUMENTS

Volg dit proces:

1. **Identificeer het fouttype** — classificeer het (runtime, compile, network, permission, logic, OOM, enz.) en noem de exacte foutklasse of code indien aanwezig.

2. **Analyse van de hoofdoorzaak** — leg uit wat werkelijk op mechanisch niveau fout ging. Blijf niet steken bij de oppervlakkige boodschap; trace naar de onderliggende oorzaak. Als de fout een stack trace bevat, volg elk frame en identificeer de oorspronkelijke call.

3. **Context hints** — extraheer alle bestandspaden, regelnummers, modulenamen, versietekenreeksen of omgevingshints die in de fout zijn ingebed. Leg uit wat elk ons vertelt.

4. **Veelvoorkomende triggers** — noem de 3–5 meest waarschijnlijke scenario's die deze exacte fout produceren, gerangschikt op frequentie. Voor elk scenario, geef aan hoe je het kunt bevestigen of uitsluiten.

5. **Reparatiestrategie** — geef voor elk waarschijnlijke scenario de concrete reparatie. Wees specifiek: voeg configuratiesleutels, codepatronen, commando's of bestandswijzigingen in voor zover van toepassing. Geef voorkeur aan de minimale juiste reparatie boven brede herschrijvingen.

6. **Preventie** — als deze foutklasse systematisch vermijdbaar is (bijv. met een linterregel, een typeannotatie, een herhaalbeleidsregel, een nulcontrole), zeg dat dan kort.

Beperkingen:
- Vul niet in met generiek advies dat op elke fout van toepassing is.
- Als de fouttekst dubbelzinnig of onvolledig is, geef aan welke aanvullende context je analyse zou veranderen en hoe.
- Wanneer de reparatie codewijzigingen omvat, toon een before/after diff of een concreet fragment, geen beschrijving van een fragment.
- Houd de reactie compact. Senior engineers lezen snel.
