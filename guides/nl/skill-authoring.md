# Handleiding voor het schrijven van skills

Hoe u een Claude Code-skill schrijft die daadwerkelijk werkt — precieze triggers, echte patronen, geen opvulling.

---

## Wat een skill is

Een skill is een Markdown-bestand dat in `.claude/skills/` wordt geplaatst en een slash-commando wordt in Claude Code. Wanneer u `/skill-naam` typt, leest Claude het bestand en gebruikt de inhoud ervan om de sessie te sturen.

Een skill is **geen** prompt-template. Het is een gestructureerde set instructies die:
- Claude vertelt wanneer te activeren en wanneer zich terug te houden
- Domeinspecifieke patronen biedt die Claude standaard niet zou toepassen
- Beperkingen en anti-patronen vaststelt voor een specifiek taaktype

---

## Bestandslocatie en naamgeving

| Bereik | Pad |
|---|---|
| Projectniveau | `.claude/skills/<skill-naam>.md` |
| Persoonlijk (alle projecten) | `~/.claude/skills/<skill-naam>.md` |

Naamgevingsregels:
- Alleen `kebab-case.md`
- De naam moet overeenkomen met het gewenste slash-commando: `fastapi-crud.md` → `/fastapi-crud`
- Wees specifiek: `django-migrations.md` is beter dan `django.md`

---

## De vereiste structuur

Elke skill moet deze vier secties in deze volgorde hebben:

```markdown
# Skill-naam

## When to activate
[Specifieke triggercondities]

## When NOT to use
[Anti-patronen — wanneer deze skill het verkeerde gereedschap is]

## Instructions
[De skill-inhoud]

## Example
[Minimaal één concreet voorbeeld]
```

Voeg geen secties toe buiten deze zonder duidelijke reden. Beknoptheid is een functie.

---

## "When to activate" schrijven

Dit is de belangrijkste sectie. Het bepaalt of Claude de skill correct toepast of negeert.

**Slecht — te vaag:**
```markdown
## When to activate
When working with Python APIs.
```

**Goed — specifiek en uitvoerbaar:**
```markdown
## When to activate
- Building a new FastAPI endpoint (GET, POST, PUT, DELETE)
- Adding request validation with Pydantic models
- Implementing dependency injection in FastAPI routes
- Writing async route handlers with background tasks
```

Regels:
- Gebruik opsommingstekens, één trigger per regel
- Wees concreet over de taak, niet de technologie
- Als het alleen van toepassing is op nieuwe code versus bestaande code, zeg dat dan expliciet

---

## "When NOT to use" schrijven

Deze sectie voorkomt dat Claude de skill in de verkeerde context toepast. Laat het weg en de skill wordt ruis.

**Voorbeeld voor een FastAPI-skill:**
```markdown
## When NOT to use
- Existing Flask or Django projects — use the appropriate skill instead
- Simple scripts that don't need an API layer
- When the user has already defined their own router structure — follow it rather than imposing this pattern
- gRPC or GraphQL APIs — different paradigms, different skills
```

---

## De instructies schrijven

Hier ligt de waarde van de skill. Schrijf het als directe instructies aan Claude, niet als documentatie.

**Principes:**

1. **Wees directief, niet beschrijvend.** Vertel Claude wat hij moet *doen*, niet wat de technologie *is*.

   Slecht: "FastAPI uses Pydantic for validation."
   Goed: "Always define a Pydantic model for request bodies. Never accept raw dicts."

2. **Codeer beslissingen.** Een skill moet ambiguïteit oplossen, niet creëren.

   Slecht: "Use appropriate error handling."
   Goed: "Raise `HTTPException` with status 422 for validation errors, 404 for not-found, 500 only for unexpected failures. Never let exceptions propagate to the response."

3. **Neem het niet-voor-de-hand-liggende op.** Als een patroon voor de hand liggend is, weet Claude het al. Skills verdienen hun waarde door te coderen wat gemakkelijk fout gaat.

4. **Verwijs naar echte Claude Code-mogelijkheden.** Een skill kan Claude instrueren om specifieke tools te gebruiken, sub-agents te starten of hooks te triggeren — gebruik dat.

5. **Houd het scanbaar.** Gebruik headers, opsommingstekens en codeblokken. Claude leest het hele bestand maar past het beter toe wanneer de structuur duidelijk is.

---

## Het voorbeeld schrijven

Het voorbeeld is niet optioneel. Het verankert de skill in de realiteit en toont Claude de verwachte uitvoerkwaliteit.

Een goed voorbeeld bevat:
- De gebruikersprompt die de skill zou triggeren
- De verwachte uitvoerstructuur (niet noodzakelijk volledige code — structuur is belangrijker)
- Eventuele beperkingen die het voorbeeld demonstreert

---

## Skill-lengte

| Skill-type | Doellengte |
|---|---|
| Gerichte taak-skill | 50–150 regels |
| Domein-skill (breed) | 150–300 regels |
| Workflow-skill | 300–500 regels |

Als uw skill meer dan 500 regels heeft, splits het dan in twee gerichte skills. Lange skills verdunnen Claudes aandacht.

---

## Uw skill testen

Voordat u indient bij Claudient:

1. Kopieer de skill naar het `.claude/skills/` van een echt project
2. Open Claude Code en activeer het met het slash-commando
3. Geef Claude een taak die overeenkomt met uw "When to activate"-condities
4. Verifieer dat Claude de patronen uit uw Instructions-sectie toepast
5. Geef Claude een taak die overeenkomt met uw "When NOT to use"-condities
6. Verifieer dat Claude de patronen van de skill NIET toepast

Een skill die stap 5 haalt maar faalt bij stap 6 heeft een specifiekere trigger nodig.

---

## Veelgemaakte fouten

**De technologie beschrijven in plaats van het gedrag sturen**
Skills die lezen als documentatie helpen Claude niet. Claude weet al wat FastAPI is. Vertel het hoe *u* het gebruikt wilt hebben.

**Triggers die te breed zijn**
`## When to activate: When writing Python` zal op alles triggeren. Verfijn het.

**Ontbrekende anti-patronen**
Zonder "When NOT to use" kan Claude uw skill toepassen in contexten waar het schade veroorzaakt.

**Geen voorbeeld**
Voorbeelden zijn de snelste manier voor Claude om te kalibreren op uw verwachte uitvoerkwaliteit.

**Generieke best practices importeren**
Een skill vol algemeen coding-advies (gebruik type-annotaties, schrijf tests, behandel fouten) voegt ruis toe. Die horen in `rules/`, niet in skills.

---

## Werk met ons samen





---

## Skill-template

```markdown
# [Skill-naam]

## When to activate
- [Specifieke trigger 1]
- [Specifieke trigger 2]
- [Specifieke trigger 3]

## When NOT to use
- [Anti-patroon 1]
- [Anti-patroon 2]

## Instructions

### [Subonderwerp 1]
[Directieve instructies]

### [Subonderwerp 2]
[Directieve instructies]

## Example

**User:** [Voorbeeldprompt]

**Expected output:**
[Verwachte structuur of code]
```
