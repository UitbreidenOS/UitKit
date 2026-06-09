---
description: Voer een gestructureerde git bisect uit om de commit te vinden die een regressie heeft veroorzaakt
argument-hint: "[failing test, command, or behavior description]"
---
Vind de commit die deze regressie heeft veroorzaakt: $ARGUMENTS

Je voert een binaire zoekopdracht uit over git-geschiedenis. Wees methodisch.

1. **Stel het test oracle in** — voordat je git aanraakt, definieer exact hoe je goed vs slecht bepaalt:
   - Geef de voorkeur aan één opdracht die 0 afsluit bij goed en niet-nul bij slecht
   - Voorbeelden: `pytest tests/test_foo.py::test_bar`, `cargo test`, `node test.js`, `./check.sh`
   - Als de regressie visueel of gedragsmatig is (niet een test), schrijf je een script dat het waarneembare symptoom controleert
   - Het oracle moet snel zijn (< 30s bij voorkeur) en deterministisch

2. **Identificeer de bekende-goed en bekende-slecht commits**
   - Bekende-slecht: meestal HEAD of de eerste commit waar de regressie werd opgemerkt
   - Bekende-goed: een commit of tag waar het gedrag correct was (recente release tag, laatste implementatie, enz.)
   - Bevestig beide door het oracle tegen elk uit te voeren voordat je bisect start

3. **Voer de bisect uit**
   ```
   git bisect start
   git bisect bad <bad-commit>
   git bisect good <good-commit>
   ```
   Voer voor elke checkout het oracle uit en markeer:
   ```
   git bisect good   # als oracle slaagt
   git bisect bad    # als oracle mislukt
   ```
   Of automatiseer het: `git bisect run <oracle-command>`

4. **Interpreteer het resultaat** — wanneer bisect is voltooid, wijst git naar de eerste slechte commit. Lees:
   - Het commit-bericht en diff (`git show <sha>`)
   - De specifieke regels die zijn gewijzigd en met het oracle mislukken
   - De auteur en eventueel gekoppelde issue/PR voor context

5. **Bevestig de bevinding** — check de commit net vóór de slechte, voer het oracle uit,
   bevestig dat het slaagt. Check de slechte commit, bevestig dat het mislukt. Dit sluit een zwabbering oracle uit.

6. **Opschonen**
   ```
   git bisect reset
   ```

7. **Rapporteer** — samenvatting:
   - De SHA en bericht van de foutieve commit
   - De specifieke diff-chunk die de regressie heeft veroorzaakt
   - Of de wijziging opzettelijk was (de fix is een revert of een vervolgpatch)

Als de testsuite nog niet bestaat, stap 1 is het oracle eerst schrijven, dan doorgaan.
Sla de bevestigingsstap niet over — een verkeerd bisect-resultaat kost meer tijd dan het bespaart.
