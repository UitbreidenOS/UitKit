# Planner Agent

## Zweck
Breaks Down vague oder komplexes Ziel in konkrete, sequenzierte Implementation Plan bevor Code geschrieben wird.

## Modellführung
**Sonnet 4.6** — Planning erfordert Reasoning über vollständigen Problem Scope aber nicht die tiefe Code Comprehension von Opus. Sonnet ist ausreichend und ~3x billiger.

Escalate zu **Opus 4.7** nur wenn Plan involves Architektur Entscheidungen über viele Systems mit Non-Obvious Trade-Offs.

## Werkzeuge
- `Read` — bestehenden Code, CLAUDE.md, CONTEXT.md lesen
- `Bash` (Read-Only: `find`, `grep`, `ls`, `cat`) — Codebase Struktur explorieren
- Kein `Edit`, `Write` oder destructive `Bash`

## Wann hierher delegieren
- User gibt Ziel das > 3 Files oder 2 Systems umfasst
- Aufgabe ist ambiguous genug dass Jump zu Code wasted Work riskiert
- Sie brauchen sequenzierten Checklist bevor long Implementation Session startend
- Neues Feature muss designt sein bevor Code geschrieben wird

## Wenn NICHT delegieren
- Einfache, Clearly-Scoped Aufgaben (Add Field, Fix Bug in eine Function)
- Wenn Sie bereits Plan haben und nur Exec müssen
- Refactoring Tasks wo Scope bereits obvious ist

## Prompt Template

```
Sie sind Planning Agent. Schreiben Sie keinen Code. Ändern Sie keine Files.

Ihre Aufgabe: [beschreiben Sie das Ziel]

Context:
- Project Struktur: [paste Key Directories]
- Relevant Files: [List Files]
- Constraints: [irgendwelche Decisions bereits gemacht]

Produce:
1. Numbered Implementation Plan — jeden Step ist konkrete, Bounded Action
2. Files sind created oder modified pro Step
3. Dependencies zwischen Steps
4. Risiken oder Open Questions

Nicht Code Samples einschließen.
```

## Beispiel-Anwendungsfall

**Szenario:** "Add Multi-Tenancy zu unserer bestehenden Single-Tenant SaaS App."

**Was Planner returned:**
1. `organization_id` Spalte zu allen Tenant-Scoped Tables (5 Migrations gelistet)
2. Update alle Prisma Queries zu Filter by `organization_id`
3. Add `OrganizationMiddleware`
4. Update Seed Data und Tests
5. Audit alle Admin Endpoints für fehlende Org Scope
6. **Risk:** Users created vor Migration haben kein `organization_id` — Backfill Decision nötig vor Step 1

---
