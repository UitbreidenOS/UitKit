# Waarom Claude Code — Harnas vs Prompt

Een veel voorkomende misvatting: « Naarmate modellen verbeteren, worden functies prompts — dus een goed geschreven prompt is gelijk aan een volledig geconfigureerd harnas. » Dat is fout. Het begrijpen waarom dit belangrijk is, helpt u het meeste uit Claude Code te halen en te bepalen wat in een prompt hoort versus wat in configuratie hoort.

---

## De 10 dingen die een harnas doet die prompts niet kunnen

| # | Mogelijkheid | Harnas | Prompt |
|---|---|---|---|
| 1 | **Context-isolatie** | Sub-agenten in aparte context-vensters | Prompts delen één context — alles lekt samen |
| 2 | **Tool-restricties** | Harnas dwingt af welke tools een agent kan aanroepen — op runtime-niveau geblokkeerd | Prompts kunnen alleen vragen; het model kan zich houden of niet |
| 3 | **Lazy loading** | Vaardigheden laden alleen bij semantische overeenkomst — startup-context blijft klein | Prompts moeten alle instructies vooraf laden — groot context vanaf het begin |
| 4 | **Hooks** | Shell-commando's activeren op events (PreToolUse, Stop, PostCompact) ongeacht modeluitvoer | Prompts instrueren; het model beslist of volgen |
| 5 | **Model-routing** | Verschillende taken routeren naar Haiku, Sonnet of Opus op basis van agentdefinitie | Eén prompt draait op één model — geen routing |
| 6 | **Parallellisme** | Meerdere agenten draaien gelijktijdig in aparte processen | Opeenvolgende prompts kunnen niet paralleliseren — één beurt tegelijkertijd |
| 7 | **Sessiepersistentie** | CLAUDE.md, regels en geheugen blijven automatisch in elke sessie behouden | Prompts resetten bij sessieverlenging — context moet elke keer opnieuw worden ingespoten |
| 8 | **Modulaire systeemprompt** | Honderden voorwaardelijke fragmenten activeren op basis van projectconfiguratie | Eén platte prompt — alles is altijd aanwezig of nooit |
| 9 | **Automatische vaardigheidsactivering** | Domain-expertise activeert bij bestandsmatch of semantische trigger | Vaardigheden moeten handmatig worden aangeroepen — niets is automatisch |
| 10 | **Permissiegates** | Harnas dwingt af `allow`/`deny` regels voor destructieve operaties op runtime-niveau | Prompts kunnen alleen beleefd vragen — geen handhaving |

---

## De token-asymmetrie

Uw prompt is typisch 6–60 tokens. Het harnas beheert 5.000–50.000+ tokens modelinvoer via lazy loading, voorwaardelijke activering en prompts-caching.

Een « sterke prompt » werkt op de gebruikersinvoerniveau — een fractie van wat het model werkelijk ziet. Het kan niet bereiken:

- De systeemprompfragmenten ingespoten voor uw bericht
- De toolbeschrijvingen geladen door het harnas
- De vaardigheidsinhoud geactiveerd door bestandscontext
- De regelbestanden die overeenkomen met het huiwerkt pad
- De gecachte CLAUDE.md-inhoud uit vorige sessies

Schrijven van een lange, gedetailleerde gebruikersinvoer om ontbrekende configuratie te compenseren, is als het verhogen van het signaal door te schreeuwen terwijl u de ruis-vloer negeert.

---

## Praktische gevolgen

**Herhaal niet het harnasgedrag in prompts.**

Prompts die toolbeperkingen willen handhaven (« gebruik Bash niet ») of persistente voorkeuren willen instellen (« gebruik altijd TypeScript voor nieuwe bestanden ») zijn niet betrouwbaar. Het model kan ze meestal volgen, maar er is geen garantie. Harnashandhaving; prompts vragen.

| Wat u wilt | Verkeerde aanpak | Juiste aanpak |
|---|---|---|
| Persistente codingsstandaarden | In elke prompt herhalen | `CLAUDE.md` |
| Agent beperken tot alleen-lezen | « Schrijf alstublieft geen bestanden » | Agent `tools:` whitelist |
| Linter na elke bewerking uitvoeren | « Voer alstublieft linterlint na bewerkingen uit » | `PostToolUse` hook |
| Domain-expertise voor een taak | Docs in prompt plakken | Vaardigheidsbestand |
| Gegarandeerde bijwerkingen | « Stuur mij een melding na voltooiing » | `Stop` hook |
| Veiligheidsgrenzen | « Raak prod-referenties niet aan » | `deny` machtigingsregel |

---

## Wanneer prompts het juiste gereedschap zijn

Prompts zijn het juiste gereedschap voor:

- **Eenvoudige taakguidance** — specifieke, eenmalige richtlijnen die niet generaliseren
- **Dynamische context** — informatie die alleen bij runtime bekend is (een URL, een gebruikersverstrekt bestandspad, een specifiek versienummer)
- **Gespreksrichting** — omleiden halverwege sessie op basis van wat u zojuist zag
- **Onduidelijkheid verduidelijken** — uitleggen hoe « correct gedrag » voor dit specifieke geval eruit ziet

Alles anders — standaards, standaarden, patronen, restricties, automatisering, persistentie — behoort tot de harnasniveau.

---

## Het samengestelde effect

Harnas-configuratie samengesteld. Een project met goed gestructureerde CLAUDE.md, drie gerichte vaardigheden, twee hook-automatiseringen en correct beperkte agenten werkt op dag 100 beter dan op dag 1, omdat elke sessie profiteert van de geaccumuleerde configuratie zonder extra prompttechnieken.

Een project dat op prompts leunt, verslechtert zich in de loop van de tijd. Naarmate de codebase groeit, worden prompts langer, wordt de context luider, en neemt de overhead voor het herstellen van context aan het begin van elke sessie toe.

De investering in harnasconfiguratie levert dividenden op bij elke toekomstige sessie. De investering in een lange systeemprompt levert dividenden op alleen op de huidge.

---
