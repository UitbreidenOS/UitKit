# RPI — Research, Plan, Implement

Der RPI-Workflow ist ein 3-Phasen-Multi-Agent-Prozess für Feature-Entwicklung. Jede Phase hat definierte Agenten, ein konkretes Output-Artefakt und ein Gate, das vor der nächsten Phase bestehen muss. Das Ziel ist die Elimination der zwei häufigsten Ursachen für verschwendete Engineering-Anstrengungen: das Bauen des falschen Dings (überspungenes Research) und das falsche Bauen (überspungenes Planning).

---

## Wann RPI vs einfach zu coden verwenden

**RPI verwenden für:**
- Neue Features, die mehr als 1 Tag dauern
- Änderungen, die mehrere Systeme oder Teams betreffen
- Arbeit in unfamilärer Codebase
- Cross-Cutting-Concerns (Auth, Caching, Observability), bei denen falsche Architektur teuer zu reparieren ist

**RPI überspringen für:**
- Hotfixes und Incident Response
- Konfigurationsänderungen ohne Logic-Impact
- Aufgaben, geschätzt unter 2 Stunden
- Pure Refactors in einer einzelnen gut verstandenen Datei

Der Overhead von RPI beträgt ungefähr 20–30% der Gesamtzeit. Für alles unter 2 Stunden übersteigt der Overhead den Nutzen.

---

## Ordner-Struktur

```
rpi/
└── {feature-slug}/
    ├── RESEARCH.md        ← Phase 1 output
    ├── plan/
    │   ├── pm.md          ← User stories
    │   ├── ux.md          ← User flows
    │   └── eng.md         ← File-by-file implementation plan
    ├── PLAN.md            ← Phase 2 summary (gate artifact)
    └── IMPLEMENT.md       ← Phase 3 decision log
```

Alle RPI-Artefakte leben unter `rpi/{feature-slug}/`. Verteilen Sie nicht Research und Plan-Dokumente über die Codebase.

---

## Phase 1: Research

### Agenten

- **requirement-parser**: extrahiert funktionale und nicht-funktionale Anforderungen aus der Feature-Anfrage, identifiziert Mehrdeutigkeiten und produziert eine strukturierte Anforderungsliste
- **codebase-explorer** (Explore tool): mappt die relevanten Teile der Codebase — vorhandene Patterns, Einstiegspunkte, Abhängigkeiten, ähnliche Features bereits implementiert
- **product-manager**: reviewed die Anforderungsliste und Codebase-Findings, dann renders ein GO/NO-GO Verdikt

### Was wird produziert

`rpi/{feature-slug}/RESEARCH.md` — strukturiertes Dokument enthaltend:

```markdown
# Research: {Feature Name}

## Requirements
### Functional
- [list]
### Non-functional
- [latency, security, scale, etc.]

## Ambiguities
- [open questions that need answers before planning]

## Codebase Findings
- [relevant files, patterns, existing abstractions]
- [similar features and how they were built]
- [potential conflict points]

## GO / NO-GO
**Verdict:** GO | NO-GO
**Rationale:** [3–5 sentences]
**Blockers (if NO-GO):** [what must be resolved before re-evaluating]
```

### Was macht ein gutes GO/NO-GO

Der PM-Agent bewertet vier Dimensionen:

| Dimension | GO Signal | NO-GO Signal |
|-----------|-----------|--------------|
| Market Need | Klare Benutzerneed, unterstützt durch Daten oder explizite Anfrage | Vage oder angenommene Need |
| Technical Feasibility | Vorhandene Patterns unterstützen es; keine unbekannten Blocker | Requires Tech noch nicht validiert |
| Scope Clarity | Anforderungen sind spezifisch und begrenzt | Open-ended oder expandierender Scope |
| Resource Cost | Passt in Sprint-Kapazität | Requires mehr als verfügbare Kapazität |

Ein NO-GO ist keine Ablehnung — es ist eine Retention. Der Blockers-Abschnitt definiert, was es löst.

---

## Phase 2: Plan

**Gate:** RESEARCH.md muss existieren mit GO-Verdikt. Niemals planen ohne Research. Niemals implementieren ohne Plan.

### Agenten

- **product-manager**: konvertiert Anforderungen in User Stories mit Acceptance Criteria (`plan/pm.md`)
- **ux-agent**: mappt User Flows End-to-End, identifiziert Edge Cases, definiert Empty States und Error States (`plan/ux.md`)
- **engineering-agent**: produziert einen File-by-File-Implementierungs-Plan — jede Datei, die erstellt oder modifiziert wird, in der Reihenfolge, in der Änderungen stattfinden sollten, mit Beschreibung jeder Änderung (`plan/eng.md`)
- **cto-advisor**: reviewed den Engineering-Plan für Architektur-Qualität, Scalability-Concerns und Alignment mit vorhandenen Patterns — genehmigt oder fordert Überprüfung an

### Output-Struktur

**`plan/pm.md`:**
```markdown
# User Stories

## Story 1: {title}
As a {role}, I want {capability} so that {benefit}.

**Acceptance criteria:**
- [ ] criterion 1
- [ ] criterion 2
```

**`plan/ux.md`:**
```markdown
# User Flows

## Happy path
[step-by-step flow]

## Edge cases
- [empty state: what user sees]
- [error state: what user sees]
- [loading state]
```

**`plan/eng.md`:**
```markdown
# Engineering Plan

## Files to create
1. `src/features/payments/charge.ts` — new charge handler implementing X interface
2. `src/api/routes/payments.ts` — new route, delegates to charge handler

## Files to modify
3. `src/api/router.ts` — register new payments route
4. `src/types/index.ts` — add ChargeRequest and ChargeResponse types

## Implementation order
Execute in the order listed. File 4 (types) before files 1 and 2.

## Dependencies
- Requires: Stripe SDK already installed (verify first)
- Creates: no new external dependencies
```

**`PLAN.md`** — eine 1-Seiten-Zusammenfassung mit allen drei Plan-Dokumenten. Die CTO-Advisor Sign-Off geht hier hin. Dies ist das Gate-Artefakt.

### Gate-Regel

Implementation beginnt nicht, bis `PLAN.md` existiert und der CTO-Advisor ihn genehmigt hat. Wenn der Advisor Änderungen fordert, überarbeitete `plan/eng.md` und regenerieren Sie `PLAN.md`. Keine Ausnahmen — Implementation vor Sign-Off von PLAN.md zu starten ist die Primärquelle für Rework in agentischer Entwicklung.

---

## Phase 3: Implement

**Gate:** PLAN.md muss unterzeichnet sein.

### Wie eng.md folgen

Führen Sie Änderungen in der exakten Reihenfolge aus, die in `plan/eng.md` aufgelistet ist. Reordnen Sie nicht basierend auf was praktisch scheint — die Reihenfolge reflektiert Abhängigkeits-Sequenzierung und Build-Stabilität bei jedem Schritt.

Für jede Datei:
1. Lesen Sie die Beschreibung in eng.md
2. Implementieren Sie die Änderung
3. Führen Sie alle relevanten Tests aus
4. Kreuzen Sie die Datei in eng.md ab (markieren Sie `[x]`)

### Code-Reviewer Gate

Nach Abschluss von 3–5 Dateien (oder bei einer natürlichen Grenze wie dem Abschluss einer Layer), spawnen Sie einen Code-Reviewer-Agent, um die abgeschlossene Arbeit gegen die Acceptance Criteria in pm.md und den Engineering-Plan in eng.md zu überprüfen. Warten Sie nicht, bis die vollständige Implementierung — Probleme spät zu finden ist teuer.

Der Reviewer outputs ein einfaches pass/fail mit spezifischem Line-Level Feedback. Bei Fehler, beheben Sie, bevor Sie weitermachen.

### Decision Log

`IMPLEMENT.md` erfasst Entscheidungen während der Implementierung, die vom Plan abweichen oder in Planung nicht behandelte Mehrdeutigkeiten lösen:

```markdown
# Implementation Log: {Feature Name}

## Decisions

### [2026-05-23] Changed charge handler interface
Plan specified X interface. During implementation found X conflicts with existing session middleware.
Decision: used Y interface instead. Updated plan/eng.md to reflect change.

### [2026-05-23] Added retry logic not in plan
Found Stripe SDK throws intermittent 503s. Added exponential backoff (3 retries).
No plan change needed — this is additive and within scope.
```

Entscheidungen, die den Scope oder Design ändern, sollten zu Überprüfung zum Engineering-Agent flagged werden, bevor sie implementiert werden. Entscheidungen, die rein Implementierungs-Details sind, gehen in IMPLEMENT.md ohne Plan-Update-Anforderung.

---

## RPI für Solo vs Team anpassen

| Phase | Solo | Team |
|-------|------|------|
| Research | Führen Sie requirement-parser + explorer aus; überspringen Sie PM, wenn Feature Ihre eigene ist | Alle Agenten; PM-Agent Output reviewed von Mensch-PM |
| Plan | Überspringen Sie UX-Agent für Backend-Only-Features | Alle Agenten; eng.md reviewed von zweitem Engineer |
| Implement | Single Engineer folgt eng.md | Weisen Sie Dateien Engineern durch eng.md-Abschnitt zu; Reviewer-Agent läuft nach jedem Abschnitt |

Die Kernregel bleibt in beiden Fällen gleich: Keine überspringenden Phasen und keine Implementierung ohne unterzeichneten Plan. Solo-Entwicklung ist nicht ein Grund, Research zu überspringen — es ist der Primärgrund, mehr diszipliniert darüber zu sein.

---
