# Docs-Sprint-Workflow

Ein schrittweiser Workflow für einen fokussierten Dokumentations-Sprint — von der Inhalts-Prüfung über das Schreiben und Review bis zur Veröffentlichung — unter durchgehendem Einsatz von Claude Code-Skills.

---

## Wann dieser Workflow ausgeführt werden sollte

- Ein neues Produkt oder Feature wird veröffentlicht und benötigt Dokumentation vor der Ankündigung
- Du hast eine Docs-Lücke durch Analytics identifiziert (hohe Absprungraten, fehlgeschlagene Suchen, Korrelation mit Support-Tickets)
- Quartalsweise: geplanter Docs-Verbesserungs-Sprint zur Reduzierung der Support-Last
- Migration: Umzug von einem Wiki zu einer dedizierten Docs-Website

---

## Sprint-Übersicht

Ein Standard-Docs-Sprint dauert 1 Woche bei fokussiertem Umfang (5–10 Seiten):

| Tag | Aktivität |
|---|---|
| Tag 1 | Inhalts-Prüfung und Umfangsdefinition |
| Tag 2 | Architektur und Vorlagen |
| Tage 3–4 | Schreib-Sprint |
| Tag 5 | Review, Veröffentlichung und Feedback-Setup |

Bei größerem Umfang (20+ Seiten) wird dies als 2-wöchiger Sprint mit derselben Struktur durchgeführt.

---

## Schritt 1 — Inhalts-Prüfung (Tag 1, Vormittag)

Bevor du irgendetwas schreibst, verstehe den Stand des Vorhandenen.

**Prüfungs-Prompt:**
```
/doc-site-builder

Run a content audit for our docs site.

Product: [name]
Current doc inventory (paste page titles and URLs or descriptions):
[list all existing pages]

Product changes in the last [90 days / 6 months]:
[paste recent release notes, changelog, or feature announcements]

Analytics data (if available):
- Top 10 pages by pageviews: [paste]
- Top 10 search queries with 0 results: [paste — this is your content gap list]
- Pages with highest exit rate: [paste]

Classify each existing page by Diátaxis type: Tutorial / How-to / Reference / Explanation.
Flag mixed-type pages (pages that try to be two types at once — split these).
Flag stale pages (content that likely changed with recent product updates).
Flag missing content (topics that should exist based on the product and user needs but don't).

Output: prioritised content backlog for this sprint.
```

**Umfangsentscheidung:** Wähle aus dem Prüfungsergebnis 5–10 Seiten zum Schreiben oder Aktualisieren in diesem Sprint. Sei konsequent beim Umfang — 5 ausgezeichnete Seiten sind mehr wert als 15 mittelmäßige.

---

## Schritt 2 — Sprint-Umfang und Priorisierung (Tag 1, Nachmittag)

**Backlog priorisieren:**

| Priorität | Inhaltstyp | Wann zuerst schreiben |
|---|---|---|
| P1 | Fehlende Getting Started / Quick Start | Nutzer scheitern beim ersten Kontaktpunkt |
| P1 | Defekter oder veralteter Referenzinhalt | Falsche Docs sind schlimmer als keine |
| P2 | Fehlende How-to-Guides für häufige Aufgaben | Hohes Support-Frageaufkommen |
| P2 | Neue Feature-Dokumentation | Feature ohne Docs veröffentlicht |
| P3 | Konzeptuelle / erklärende Docs | Nutzer brauchen ein mentales Modell, nicht nur Anweisungen |
| P3 | Kosmetische Verbesserungen | Geringe Wirkung — kein Sprint dafür |

**Sprint-Backlog-Format:**

```markdown
## Docs Sprint — [Date] — Backlog

| Priority | Page | Type | Current state | Why now |
|---|---|---|---|---|
| P1 | Getting Started / Quick Start | Tutorial | Missing | First-touch drop-off |
| P1 | Authentication guide | How-to | Stale (v1 → v2 migration broke it) | Support ticket volume |
| P2 | POST /v1/events endpoint | Reference | Incomplete (no examples) | New endpoint shipped |
| P2 | How to set up webhooks | How-to | Missing | Top failed search query |
| P3 | What is [core concept] | Explanation | Missing | Users ask this in support |
```

---

## Schritt 3 — Architektur-Abstimmung (Tag 2, Vormittag)

Falls dieser Sprint die Nav-Struktur ändert oder neue Abschnitte hinzufügt, kläre die IA vor dem Schreiben.

```
/doc-site-builder

Propose an updated navigation structure for these new pages.

Existing nav: [paste current nav structure]
New pages to add: [list from sprint backlog]

Constraints:
- Maximum nav depth: 2 levels (don't create new top-level sections unless necessary)
- Platform: [Docusaurus / MkDocs / Mintlify]
- Audience: [developers / end users / admins]

Recommendation: where to place each new page, whether to create any new sections,
and whether any existing pages should be moved.

Include: a before/after nav comparison.
```

---

## Schritt 4 — Vorlagenauswahl (Tag 2, Nachmittag)

Verwende die richtige Vorlage für jeden Diátaxis-Inhaltstyp. Aus `/doc-site-builder` abrufen oder diese verwenden:

**Tutorial (Getting Started):**
- Einleitung: was du erstellen / erreichen wirst — der Endzustand, 1–2 Sätze
- Voraussetzungen: nummerierte Liste — Versionen explizit angeben
- Schritte: nummeriert, jeder produziert ein sichtbares Ergebnis
- Erfolgsprüfung: der Befehl oder Check, der den Erfolg bei jedem Schritt bestätigt
- Was gerade passiert ist: 1–2 Sätze, die erklären, was das Tutorial erreicht hat
- Nächste Schritte: maximal 3 Links — wohin von hier aus

**How-to-Guide:**
- Titel: „Wie man [Aufgabe erledigt]" — muss umsetzbar sein
- Einleitung: 1 Satz — für wen es ist und was es erreicht
- Voraussetzungen
- Schritte: imperativische Stimme („Führe den Befehl aus", nicht „Der Nutzer sollte ausführen")
- Fehlerbehebung: die 2–3 wahrscheinlichsten Fehler und deren Lösungen
- Verwandt: 2–3 Links zu verwandten How-tos und Referenzen

**Referenzseite:**
- Was das ist (1 Satz)
- Syntax / Signatur
- Alle Parameter / Optionen in einer Tabelle
- Minimales funktionierendes Beispiel
- Hinweise / Grenzfälle
- Siehe auch

**Erklärung / Konzept:**
- Was das ist und warum es existiert
- Wie es funktioniert (mentales Modell, Diagramm falls hilfreich)
- Wann es vs. Alternativen zu verwenden ist
- Häufige Missverständnisse
- Verwandte Referenz

---

## Schritt 5 — Schreib-Sprint (Tage 3–4)

**Für API-Dokumentation:**
```
/api-doc-writer

Document this API endpoint.

[paste the route handler code, OpenAPI snippet, or endpoint description]

Output: full reference doc with:
- Request parameters table (path, query, body)
- Response fields table
- All error codes with explanation
- Code examples in curl, Python, TypeScript
- Gotchas and edge cases (if any are known)
```

**Für README oder Getting Started:**
```
/readme-generator

Write a Getting Started guide for [product/library].

Product: [name and 1-sentence description]
User type: [developers / non-technical users]
Starting point: [what they have when they begin]
End state: [what they have when this guide is complete — the value moment]

Include: prerequisites, installation, first working example, common configuration,
and 3 links to next steps.

Language: [TypeScript / Python / any — match the primary SDK]
```

**Für operative Runbooks:**
```
/runbook-generator

Write a runbook for [process or incident type].

Process / incident type: [describe]
Audience: on-call engineer who may never have seen this before
Trigger: [what condition causes this runbook to be needed]

Include:
- Symptoms and detection
- Diagnosis steps (ordered — start with the most likely cause)
- Remediation steps (exact commands, with expected output)
- Escalation: who to page if this doesn't resolve in X minutes
- Prevention: what to check to avoid this next time
```

**Für Changelogs:**
```
/changelog-writer

Write the changelog for [version / release name].

git log:
[paste git log --oneline for this release]

Audience: [developers / end users]
Filter out: internal changes, dependency upgrades, test-only changes.
Group: Breaking changes → New → Improvements → Fixes.
Include: links to docs for each new feature if docs exist.
```

---

## Schritt 6 — Engineering-Review (Tag 4, Nachmittag)

Jede technische Docs-Seite muss vor der Veröffentlichung von einem Ingenieur geprüft werden. Das Review deckt auf:
- Falsche technische Details (falsche Parameternamen, veraltete Syntax)
- Fehlende Schritte (etwas, das der Autor als offensichtlich voraussetzte, es aber nicht ist)
- Code-Beispiele, die nicht ausführbar sind (der häufigste und schädlichste Docs-Fehler)

**Review-Anfrage-Vorlage:**

```markdown
Hi [engineer name], 

I've drafted documentation for [feature/endpoint]. Can you review for technical accuracy?

Specifically:
1. Are all parameter names and types correct?
2. Do the code examples actually work? (If you can run them, please do — they should produce the documented output.)
3. Am I missing any important error cases or edge cases?
4. Is the described behaviour accurate for the current version?

[Link to draft or paste draft here]

ETA needed: [date]. This is blocking publication.
```

Ziel: 24-Stunden-Rücklauf von Ingenieuren. Wenn eine Seite mehr als 2 Runden technischer Review benötigt, einen 30-minütigen Anruf ansetzen.

---

## Schritt 7 — Style-Review (Tag 5, Vormittag)

```
Review this docs page for style and clarity.

Page: [paste content]

Check:
1. Is the title actionable / descriptive — does it match what a user would search for?
2. Does it start with user benefit, not product description?
3. Are all code examples runnable (no placeholder values that break them)?
4. Is it written in second person ("you") — no "the user" or passive voice?
5. Are sentences under 25 words on average?
6. Is there anything that could be cut without losing meaning?
7. Are error messages explained with cause + fix?

Output: specific line-level edits. No general feedback — specific changes only.
```

---

## Schritt 8 — Veröffentlichung und Feedback-Setup (Tag 5, Nachmittag)

**Checkliste vor der Veröffentlichung:**
- [ ] Technisches Review von Ingenieur genehmigt
- [ ] Alle Code-Beispiele getestet und erzeugen die dokumentierte Ausgabe
- [ ] Alle internen Links überprüft (keine 404s)
- [ ] Frontmatter vollständig: title, description, last_updated, tags
- [ ] Seite erscheint korrekt in der Navigation
- [ ] Suchindex aktualisiert (neu aufbauen bei Algolia, pagefind o. Ä.)

**Feedback-Instrumentierung:**

Füge auf jeder neuen Seite ein „War das hilfreich?"-Widget ein. Die minimale Implementierung:

```html
<!-- Minimal feedback widget — bottom of every page -->
<div class="feedback">
  <p>Was this page helpful?</p>
  <button onclick="sendFeedback('yes')">Yes</button>
  <button onclick="sendFeedback('no')">No</button>
</div>
```

Verfolge: positive Rate pro Seite. Ziel: >70 % positiv. Seiten unter 50 % müssen untersucht werden.

---

## Schritt 9 — Sprint-Retrospektive (Ende von Tag 5)

```
Review this docs sprint and identify improvements for next time.

Pages written: [list]
Pages not completed: [list with reason]
Review cycles per page: [average]
Blocking issues: [list — e.g. "waited 2 days for API spec", "no staging environment to verify examples"]
Time per page type: [Tutorial: Xh, How-to: Xh, Reference: Xh]

Questions to answer:
1. Which pages took longer than expected — why?
2. Which review bottlenecks can be eliminated with process changes?
3. What content should have been in scope but wasn't?
4. What's the highest-impact next sprint?
```

---

## Zeitbox-Regeln

- Inhalts-Prüfung: maximal 3 Stunden. Analytics-Daten zur Priorisierung nutzen — nicht jede Seite auditieren.
- Pro Seite schreiben (mit Claude Code): Tutorial: 90 Min | How-to: 45 Min | Reference: 60 Min | Explanation: 60 Min
- Engineering-Review: 24-Stunden-SLA von Ingenieuren. Bei Verzögerung eskalieren oder Sync-Anruf ansetzen.
- Code-Beispiele testen: nicht verhandelbar. Jedes Code-Beispiel muss vor der Veröffentlichung ausgeführt werden.
- Sprint-Umfang: 5–10 Seiten pro Woche. Alles mehr bedeutet, der Umfang ist zu weit.

---

## Docs-as-Code CI-Setup

Diese zu deinem Repo hinzufügen, um Qualität bei jedem PR durchzusetzen:

```yaml
# .github/workflows/docs-quality.yml
name: Docs Quality

on: [pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Markdown lint
        uses: DavidAnson/markdownlint-cli2-action@v14
        
      - name: Spell check
        uses: streetsidesoftware/cspell-action@v6
        
      - name: Check broken links
        uses: lycheeverse/lychee-action@v1
        with:
          args: --verbose --no-progress './docs/**/*.md'
          
      - name: Check frontmatter
        run: |
          # Verify all .md files have required frontmatter: title, description, last_updated
          python scripts/check_frontmatter.py docs/
```

Dies erzwingt Konsistenz, ohne bei jedem PR ein Style-Guide-Review zu benötigen.

---
