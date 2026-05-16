> 🇳🇱 Nederlandse versie. [Engelse versie](CONTRIBUTING.md).

# Bijdragen aan Claudient

Claudient groeit door bijdragen van de community. Als u een skill, agent, hook, workflow of prompt heeft die Claude Code voor u aanzienlijk beter heeft gemaakt — dan hoort het hier.

---

## Wat u kunt bijdragen

| Type | Locatie | Beschrijving |
|---|---|---|
| Skill | `skills/<category>/` | Een slash-commando dat domeinspecifiek gedrag activeert |
| Agent | `agents/<category>/` | Een gespecialiseerde subagent-definitie |
| Hook | `hooks/<trigger>/` | Een door een gebeurtenis geactiveerde automatisering |
| Rule | `rules/common/` of `rules/<language>/` | Een altijd te volgen richtlijn |
| Workflow | `workflows/` | Een end-to-end meerstaps proces |
| Prompt | `prompts/<category>/` | Een herbruikbare prompt-sjabloon |
| Guide | `guides/` | Een uitgebreid documentatiestuk |
| Vertaling | `guides/<lang>/` | Een vertaling van een bestaande Engelstalige guide |

---

## Kwaliteitsstandaard

Controleer vóór het indienen of uw bijdrage aan de standaard voldoet:

**Skills**
- [ ] Heeft een duidelijke sectie „When to activate" met specifieke triggervoorwaarden
- [ ] Heeft een sectie „When NOT to use" met ten minste één anti-patroon
- [ ] Bevat ten minste één concreet voorbeeld
- [ ] Verwijst naar echte Claude Code-functies — geen generieke LLM-adviezen
- [ ] U heeft het getest in ten minste één echte sessie

**Agents**
- [ ] Specificeert een deelverzameling van tools (niet alle tools)
- [ ] Bevat modelbegeleiding (Haiku / Sonnet / Opus) met redenering
- [ ] Bevat een concreet voorbeeld van een use case

**Hooks**
- [ ] Bevat het exacte JSON-fragment voor `settings.json`
- [ ] Bevat het script (indien van toepassing) met installatie-instructies
- [ ] Beschrijft duidelijk wat het activeert en wat het doet

**Guides**
- [ ] Geschreven voor een senior ontwikkelaarsaudience
- [ ] Geen tijdelijke secties
- [ ] Accuraat ten opzichte van het huidige gedrag van Claude Code

---

## Skill-sjabloon

Kopieer dit bij het toevoegen van een nieuwe skill:

```markdown
# Skill Name

## When to activate
[Specific trigger conditions]

## When NOT to use
[Anti-patterns]

## Instructions
[Skill content]

## Example
[Concrete example]
```

---

## Bestandsnaming

- Gebruik `kebab-case.md` voor alle Markdown-bestanden
- Gebruik `kebab-case.sh` of `kebab-case.py` voor scripts
- Plaats bestanden in de juiste submap — raadpleeg `README.md` voor de overzichtskaart

---

## Een PR indienen

1. Fork de repository en maak een branch aan: `git checkout -b add/fastapi-skill`
2. Voeg uw bestand(en) toe volgens het bovenstaande formaat
3. Als u een nieuwe guide in het Engels heeft toegevoegd, vermeld dan in de PR-beschrijving welke vertalingen nodig zijn
4. Open een PR met een titel zoals: `add: FastAPI skill` of `fix: token-optimization guide`
5. Vul de PR-beschrijving in — wat het is, waarom het nuttig is, hoe u het heeft getest

---

## Vertalingen

Een bestaande Engelstalige guide vertalen:

1. Kopieer het Engelse bestand: `cp guides/getting-started.md guides/fr/getting-started.md`
2. Vertaal de inhoud — bewaar alle codeblokken, bestandspaden en technische termen in het Engels
3. Dien een PR in met de titel: `translate: getting-started guide (French)`

Ondersteunde talen: Engels (primair), Frans (`fr/`), Duits (`de/`), Nederlands (`nl/`), Spaans (`es/`).

---

## Wat wordt afgewezen

- Inhoud die een bestaand bestand dupliceert zonder duidelijke verbetering
- Voorlopige of onvolledige bijdragen (secties met „coming soon")
- Skills die generiek LLM-gedrag beschrijven in plaats van Claude Code-specifieke functies
- Applicatiecode (deze repository bevat uitsluitend documentatie en configuratie)
- Alles wat in strijd is met de naamgevings- of formaatconventies in `CLAUDE.md`

---

## Vragen

Open een GitHub Discussion als u niet zeker weet waar iets thuishoort of als u feedback wilt voordat u begint. Issues zijn bedoeld voor bugs en concrete hiaten in de dekking.

---

## Met ons samenwerken

Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — wij bouwen AI-producten samen met ontwikkelaarsgemeenschappen en leveren B2B-AI-oplossingen. Als u verder wilt gaan dan bijdragen aan deze repository en daadwerkelijk AI-producten of B2B-oplossingen met ons wilt bouwen, neem dan contact op.

**[uitbreiden.com](https://uitbreiden.com/)**
