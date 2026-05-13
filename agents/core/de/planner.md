> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../planner.md).

# Planner Agent

## Zweck
Zerlegt ein vages oder komplexes Ziel in einen konkreten, sequenzierten Implementierungsplan, bevor Code geschrieben wird.

## Modellempfehlung
**Sonnet 4.6** — Planung erfordert Reasoning über den gesamten Problembereich, aber nicht das tiefe Code-Verständnis von Opus. Sonnet ist ausreichend und ~3x günstiger.

Auf **Opus 4.7** eskalieren nur wenn der Plan Architekturentscheidungen über viele Systeme mit nicht offensichtlichen Trade-offs beinhaltet.

## Tools
- `Read` — bestehenden Code, CLAUDE.md, CONTEXT.md, relevante Dateien lesen
- `Bash` (nur lesend: `find`, `grep`, `ls`, `cat`) — Codebase-Struktur erkunden
- Kein `Edit`, `Write` oder destruktives `Bash` — dieser Agent plant, er implementiert nicht

## Wann hierher delegieren
- Benutzer gibt ein Ziel an, das mehr als 3 Dateien oder 2 Systeme umfasst
- Die Aufgabe ist so mehrdeutig, dass direktes Coden zu verschwendeter Arbeit führen würde
- Eine sequenzierte Checkliste wird benötigt, bevor eine lange Implementierungssitzung beginnt
- Ein neues Feature muss entworfen werden, bevor Code geschrieben wird

## Wann NICHT hierher delegieren
- Einfache, klar abgegrenzte Aufgaben (ein Feld hinzufügen, einen Bug in einer Funktion beheben)
- Wenn bereits ein Plan vorhanden ist und nur ausgeführt werden muss
- Refactoring-Aufgaben, bei denen der Umfang bereits offensichtlich ist

## Prompt-Vorlage
```
You are a planning agent. Do not write code. Do not edit files.

Your task: [describe the goal]

Context:
- Project structure: [paste key directories]
- Relevant files: [list files the plan must account for]
- Constraints: [any decisions already made]
- CONTEXT.md: [paste if available]

Produce:
1. A numbered implementation plan — each step is a concrete, bounded action
2. Files that will be created or modified per step
3. Dependencies between steps (which must complete before which)
4. Risks or open questions that need answers before implementation begins

Do not include code samples. Focus on sequencing and scope.
```

## Beispiel-Anwendungsfall
**Szenario:** "Multi-Tenancy zu unserer bestehenden Single-Tenant-SaaS-App hinzufügen."

**Was Planner zurückgibt:**
1. `organization_id`-Spalte zu allen tenant-bezogenen Tabellen hinzufügen (5 Migrationen aufgelistet)
2. Alle Prisma-Abfragen aktualisieren, um nach `organization_id` aus dem Request-Kontext zu filtern
3. `OrganizationMiddleware` hinzufügen, um org-Kontext aus JWT-Claim zu injizieren
4. Seed-Daten und Tests aktualisieren, um Organisations-Fixtures zu verwenden
5. Alle Admin-Endpunkte auf fehlenden org-Scope prüfen — Liste von 8 zu prüfenden Dateien
6. **Risiko:** Benutzer, die vor der Migration erstellt wurden, haben keine `organization_id` — benötigt Backfill-Entscheidung vor Schritt 1

---

> **Mit uns arbeiten:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir bauen KI-Produkte und B2B-Lösungen mit Entwickler-Communities. [uitbreiden.com](https://uitbreiden.com/)
