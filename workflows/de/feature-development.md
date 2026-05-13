> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../feature-development.md).

# Feature-Entwicklungs-Workflow

End-to-End-Workflow für die Umsetzung eines Features von der Idee bis zum gemergten PR mit Claude Code.

---

## Wann diesen Workflow verwenden
- Ein neues Feature bauen, das mehr als eine Datei berührt
- Eine Spezifikation oder ein Ticket implementieren, das vor dem Coden zerlegt werden muss
- Jedes Feature, bei dem ein strukturierter, überprüfbarer Prozess gewünscht wird

---

## Schritt 1 — Umfang definieren und validieren

Bevor Code geschrieben wird, genau festlegen, was gebaut wird.

**Claude fragen:**
```
I need to build: [describe the feature in one paragraph]

Read the relevant files first:
- [list key files: routes, models, services]
- CLAUDE.md and CONTEXT.md if present

Then tell me:
1. What files will need to change?
2. What new files will be created?
3. What are the edge cases I should handle?
4. What decisions do I need to make before we start?
5. Are there any risks or dependencies I'm missing?

Do not write code yet.
```

**Worauf in der Antwort achten:**
- Dateien, die noch nicht bedacht wurden
- Edge Cases, die zu Bugs führen würden, wenn sie nicht beachtet werden
- Entscheidungen, die nach ihrer Treffen in CLAUDE.md einfließen sollten

---

## Schritt 2 — Die Implementierung planen

Sobald der Umfang klar ist, einen sequenzierten Plan erstellen.

**Claude fragen:**
```
Based on the scope we just defined, create a numbered implementation plan.

Each step must be:
- A concrete, bounded action (not "implement auth" — "add JWT validation middleware to src/middleware/auth.ts")
- Completable in a single session
- Independently testable

Include which files change in each step. Note dependencies between steps.
```

Den Plan überprüfen. Wenn ein Schritt zu groß ist, Claude bitten, ihn weiter aufzuteilen. Den Plan festlegen, bevor Code berührt wird.

---

## Schritt 3 — Schritt für Schritt implementieren

Einen Plan-Schritt nach dem anderen ausführen. Nicht überspringen.

**Für jeden Schritt:**
```
Implement step [N]: [paste the step description]

Rules:
- Only change what's needed for this step
- Write or update tests for this step's behavior
- Do not refactor code outside the scope of this step
- Tell me when this step is complete and what to verify
```

**Nach jedem Schritt:**
- Tests ausführen: grün bestätigen, bevor zum nächsten Schritt übergegangen wird
- Eigenes Diff überprüfen: ist das das Beabsichtigte?
- Wenn ein Schritt neue Komplexität aufdeckt, den Plan aktualisieren, bevor fortgefahren wird

---

## Schritt 4 — Integrationsprüfung

Sobald alle Schritte abgeschlossen sind, das vollständige Feature end-to-end verifizieren.

**Claude fragen:**
```
All implementation steps are complete. Now:

1. Run the full test suite — report any failures
2. Check that all edge cases from Step 1 are handled — list each one and confirm
3. Check for any TODOs or incomplete error handling introduced during implementation
4. Verify the feature works with [specific test scenario relevant to this feature]
```

Alle gefundenen Probleme beheben, bevor fortgefahren wird.

---

## Schritt 5 — Selbstüberprüfung

Vor dem Erstellen eines PRs die eigenen Änderungen überprüfen.

**Claude fragen:**
```
Review the changes on this branch against main.

Focus on:
1. CRITICAL issues (bugs, security, data loss risks)
2. Missing tests for changed behavior
3. Convention violations vs this project's CLAUDE.md
4. Anything that would confuse a reader in 6 months

Format: CRITICAL / SUGGESTED / NITPICK
```

Alle CRITICAL-Probleme beheben. Bei SUGGESTED-Elementen nach eigenem Urteil vorgehen.

---

## Schritt 6 — PR-Beschreibung

**Claude fragen:**
```
Write a PR description for these changes.

Include:
- What this PR does (one paragraph)
- Why it's needed (the problem it solves)
- How to test it (specific steps a reviewer can follow)
- Any decisions made and why (reference CLAUDE.md or ADRs if relevant)
- Screenshots or output if applicable

Do not include a list of files changed — the diff covers that.
```

---

## Checkliste vor dem Mergen

- [ ] Alle Tests bestehen
- [ ] Selbstüberprüfung abgeschlossen, keine CRITICAL-Probleme
- [ ] Edge Cases aus Schritt 1 sind alle behandelt
- [ ] PR-Beschreibung geschrieben
- [ ] CLAUDE.md aktualisiert, wenn neue Entscheidungen getroffen wurden
- [ ] CONTEXT.md aktualisiert, wenn neue Domain-Begriffe eingeführt wurden

---

> **Mit uns arbeiten:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir bauen KI-Produkte und B2B-Lösungen mit Entwickler-Communities. [uitbreiden.com](https://uitbreiden.com/)
