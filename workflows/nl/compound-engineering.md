# Compound Engineering

Fout-naar-lessen-transformatie die toekomstige Claude Code-sessies progressief intelligenter maakt. Elke fout in een sessie wordt een gestructureerde invoer in `LESSONS.md`. Toekomstige sessies laden dit bestand en vermijden dezelfde fouten zonder hierom te worden gevraagd.

---

## Wanneer te gebruiken

- Elk langetermijnproject met terugkerende Claude Code-sessies
- Codebases met niet-voor-de-hand liggende conventies of valstrikken die Claude steeds laten struikelen
- Teams die Claude Code gebruiken in een gedeelde repo — lessen die eenmaal zijn geschreven, gelden voor alle inzenders
- Elke situatie waarin u merkt dat u dezelfde klasse fouten meer dan eenmaal corrigeert

---

## Kernidee

Kennis wordt samengesteld. Een enkele fout, eenmaal gedocumenteerd, wordt nooit herhaald. Na tien sessies gaat Claude in de codebasis met bewustzijn van elke valkuil die in de negen ervoor werd ontdekt. De kosten zijn seconden per les; de uitbetaling is cumulatief.

---

## Structuur

### `LESSONS.md` — alleen toevoegen logboek

Woont in de projectroot (of waar CLAUDE.md ook leeft). Ernaar gerefereerd in CLAUDE.md, dus wordt het aan het begin van elke sessie geladen:

```markdown
<!-- In CLAUDE.md -->
@LESSONS.md
```

### Lessentraagindeling

```markdown
## [Date] — [Brief title]
**Mistake:** [What went wrong — specific, not "Claude made an error"]
**Root cause:** [Why it happened — missing context, wrong assumption, ambiguous convention]
**Correct approach:** [What to do instead — concrete and actionable]
**Context:** [Scope — is this codebase-specific, language-specific, or universal?]
```

---

## Workflow

### Tijdens een sessie

Wanneer Claude een fout maakt en corrigeert, schrijf onmiddellijk de les:

```
"Update LESSONS.md: tried to import UserService from lib/users — correct path is services/users/UserService.ts (barrel exports not used in this project)."
```

Claude voegt de invoer in standaardindeling toe. De les is live voor de rest van de sessie en alle toekomstige sessies.

### Aan het einde van de sessie (optioneel maar waardevol)

Voordat u een lange sessie afsluit, vraagt u Claude om de sessie te controleren op niet-gedocumenteerde fouten:

```
"Review this session for any mistakes that aren't yet in LESSONS.md and add entries for them."
```

Claude scant het gesprek, identificeert correcties en koerswijzigingen en voegt gestructureerde vermeldingen voor elk toe. Dit duurt 30–60 seconden en legt lessen vast die in de werkstroom zijn ontsnapt.

### Bij sessiestart

Omdat CLAUDE.md verwijst naar `@LESSONS.md`, leest Claude het volledige lessen-logboek voordat hij op het eerste bericht antwoordt. Geen handmatige belasting nodig.

---

## Voorbeeld LESSONS.md

```markdown
# Lessons

## 2026-05-10 — Prisma schema location
**Mistake:** Looked for schema.prisma in the project root.
**Root cause:** Default Prisma assumption — project uses a non-standard layout.
**Correct approach:** Schema lives at infra/db/schema.prisma. Client config points there via prisma.schema in package.json.
**Context:** This project only.

## 2026-05-14 — API response envelope
**Mistake:** Returned { data: result } directly from route handlers.
**Root cause:** Generic REST convention assumed. This API uses { ok: true, payload: result }.
**Correct approach:** All route handlers must return the standard envelope. See src/lib/response.ts helpers.
**Context:** This project only.

## 2026-05-18 — Test database
**Mistake:** Tests were writing to the development database.
**Root cause:** DATABASE_URL not overridden in test setup.
**Correct approach:** vitest.setup.ts sets process.env.DATABASE_URL to TEST_DATABASE_URL. Check that TEST_DATABASE_URL is set before running tests.
**Context:** This project only.
```

---

## Regels

- **Alleen toevoegen.** Vermeldingen niet verwijderen of overschrijven. Als een les wordt vervangen, een nieuwe vermelding toevoegen met de correctie en datum.
- **Specifiek, niet generiek.** "Geen aannames doen" is geen les. "API-antwoorden gebruiken `{ ok, payload }` niet `{ data }`" is een les.
- **Contextbereik is vereist.** Markeer of de les van toepassing is op deze codebasis, deze taal of universeel. Dit voorkomt overfitting op projectspecifieke conventies.
- **Schrijf onmiddellijk.** Lessen geschreven op het moment van correctie zijn nauwkeuriger dan retrospectieve samenvattingen.

---
