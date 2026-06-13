# Compound Engineering

Fehler-zu-Lektion-Transformation, die zukünftige Claude Code-Sitzungen progressiv intelligenter macht. Jeder Fehler in einer Sitzung wird zu einem strukturierten Eintrag in `LESSONS.md`. Zukünftige Sitzungen laden diese Datei und vermeiden die gleichen Fehler, ohne dazu aufgefordert zu werden.

---

## Wann zu verwenden

- Jedes langfristige Projekt mit wiederkehrenden Claude Code-Sitzungen
- Codebases mit nicht-offensichtlichen Konventionen oder Fallgruben, die Claude immer wieder stolpern lassen
- Teams, die Claude Code in einem gemeinsamen Repo verwenden — Lektionen, die einmal geschrieben sind, gelten für alle Mitwirkenden
- Jede Situation, in der Sie feststellen, dass Sie mehr als einmal die gleiche Fehlklasse korrigieren

---

## Kernidee

Wissen sammelt sich an. Ein einzelner Fehler, einmal dokumentiert, wird nie wiederholt. Nach zehn Sitzungen geht Claude in die Codebasis mit Bewusstsein für jeden Fallstrick ein, der in den neun zuvor entdeckt wurde. Die Kosten sind Sekunden pro Lektion; der Gewinn ist kumulativ.

---

## Struktur

### `LESSONS.md` — nur Anhängen Log

Lebt in der Projekt-Root (oder wo auch immer CLAUDE.md lebt). Referenziert in CLAUDE.md, daher wird es am Anfang jeder Sitzung geladen:

```markdown
<!-- In CLAUDE.md -->
@LESSONS.md
```

### Lektions-Eintragsformat

```markdown
## [Date] — [Brief title]
**Mistake:** [What went wrong — specific, not "Claude made an error"]
**Root cause:** [Why it happened — missing context, wrong assumption, ambiguous convention]
**Correct approach:** [What to do instead — concrete and actionable]
**Context:** [Scope — is this codebase-specific, language-specific, or universal?]
```

---

## Workflow

### Während einer Sitzung

Wenn Claude einen Fehler macht und ihn korrigiert, schreiben Sie die Lektion sofort:

```
"Update LESSONS.md: tried to import UserService from lib/users — correct path is services/users/UserService.ts (barrel exports not used in this project)."
```

Claude fügt den Eintrag im Standard-Format an. Die Lektion ist lebendig für den Rest der Sitzung und alle zukünftigen Sitzungen.

### Am Sitzungsende (optional aber hochwertig)

Bevor Sie eine lange Sitzung beenden, bitten Sie Claude, die Sitzung auf nicht dokumentierte Fehler zu überprüfen:

```
"Review this session for any mistakes that aren't yet in LESSONS.md and add entries for them."
```

Claude scannt die Unterhaltung, identifiziert Korrektionen und Kursänderungen und fügt strukturierte Einträge für jede hinzu. Dies dauert 30–60 Sekunden und erfasst Lektionen, die während der Arbeitsarbeit entgangen sind.

### Bei Sitzungsbeginn

Da CLAUDE.md `@LESSONS.md` referenziert, liest Claude die vollständige Lektionslogs, bevor er auf die erste Nachricht antwortet. Keine manuelle Ladung erforderlich.

---

## Beispiel LESSONS.md

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

## Regeln

- **Nur Anhängen.** Einträge nicht löschen oder überschreiben. Wenn eine Lektion ersetzt wird, einen neuen Eintrag hinzufügen, der die Korrektur und das Datum notiert.
- **Spezifisch, nicht generisch.** "Machen Sie keine Annahmen" ist keine Lektion. "API-Antworten verwenden `{ ok, payload }` nicht `{ data }`" ist eine Lektion.
- **Kontext-Umfang ist erforderlich.** Markieren Sie, ob die Lektion für diese Codebasis, diese Sprache oder universell gilt. Dies verhindert Überfitting bei projektspezifischen Konventionen.
- **Sofort schreiben.** Lektionen, die zum Zeitpunkt der Korrektur geschrieben werden, sind genauer als retrospektive Zusammenfassungen.

---
