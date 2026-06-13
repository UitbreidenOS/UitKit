# Regels voor Code Review

## Van toepassing op
Alle pull request-beoordelingen — gedrag van auteur en reviewer.

## Regels

### Als Auteur

1. **Houd PRs klein en gericht** — één logische wijziging per PR. Een PR die tegelijk auth, billing en routing aanraakt, is drie PRs. Kleinere PRs krijgen beter review, worden sneller gemerged en kunnen schoon worden teruggezet.

2. **Schrijf de PR-beschrijving voor de reviewer, niet voor jezelf** — leg uit wat is gewijzigd, waarom het is gewijzigd en wat het risico is. Voeg een testplan toe. "Bug opgelost" is geen beschrijving.

3. **Controleer jezelf voordat je om review vraagt** — lees je eigen diff alsof je hem niet hebt geschreven. Vang typfouten, debug-artefacten, commentaar-code en gemiste randgevallen op voordat je anderen vraagt.

4. **Reageer op elk commentaar** — bevestig, los op of bespreek. Stilte geeft desinteresse aan. Als je het niet eens bent, zeg het met uitleg. Als je akkoord bent, breng de wijziging aan en markeer als opgelost.

5. **Annoteer niet-voor-de-hand-liggende keuzes** — als je iets verrassends hebt gedaan en de reden staat niet in een code-opmerking, leg het uit in de PR-beschrijving of als antwoord op de verwachte "waarom?"-vraag.

### Als Reviewer

6. **Onderscheid blokkeerders van suggesties** — geef commentaar duidelijk aan met voorvoegsel: `blocking:`, `nit:`, `question:`, `suggestion:`. Reviewers die alles als blokkering markeren, vertragen de levering. Bewaar blokkering voor correctheid en veiligheid.

7. **Controleer de bedoeling, niet alleen de regels** — bereikt de wijziging wat de PR-beschrijving beweert? Zijn er randgevallen die de tests niet dekken? Zou je comfortabel zijn om deze code te bezitten?

8. **Suggereer, geef geen stijldirectieven** — opmerkingen over stijl moeten naar een gedocumenteerde regel verwijzen. "Ik zou het op deze manier hebben gedaan" is geen blokkering tenzij de regel bestaat. Stijl zonder regel is voorkeur.

9. **Keur goed wanneer het goed genoeg is, niet perfect** — de kosten van een geblokkeerde PR nemen toe. Als resterende nits klein en niet-blokkering zijn, keur goed en laat de auteur beslissen. Perfect is de vijand van verzonden.

10. **Beoordeel geen verouderde PRs zonder de rebase op te merken** — als een PR sinds je laatste beoordeling is rebased, noteer het en beoordeel het diff opnieuw van scratch. Verouderde beoordelingen creëren onterecht vertrouwen.

### Proces

11. **Eerste review binnen één werkdag** — PRs verzuren. Context vervaagt. Vertraagde reviews demotiveren auteurs en blokkeren afhankelijk werk. Stel teamverwachtingen in en handhaaf ze.

12. **Vermijd review-door-commissie voor elke PR** — één vereiste reviewer is meestal genoeg. Meerdere vereiste goedkeuringen voor elke wijziging creëert bottlenecks. Reserveer multi-reviewer-vereisten voor high-risk-paden (auth, payments, data migrations).

13. **Controleer geautomatiseerde signalen voordat je beoordeelt** — CI moet slagen voordat menselijke review. Als tests mislukken of linting is verbroken, stuur de PR terug naar de auteur. Controleer geen code die de machine al heeft afgewezen.

14. **Keur niet goed wat je niet begrijpt** — "LGTM" voor code die je niet kunt uitleggen is een risico. Stel vragen totdat je de wijziging begrijpt. Een vraag is geen blokkering.

15. **Documenteer patronen die het herhalen waard zijn** — als een review een patroon aan het licht brengt dat breed moet worden afgedwongen, repareer het niet alleen in deze PR. Dien een regel in, voeg een lint toe of werk de codeerhandleiding bij.


---
