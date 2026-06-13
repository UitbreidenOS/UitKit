> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../feature-development.md).

# Feature Development Workflow

End-to-end workflow voor het nemen van een feature van idee tot samengevoegde PR met Claude Code.

---

## Wanneer deze workflow te gebruiken
- Een nieuwe feature bouwen die meer dan één bestand aanraakt
- Een spec of ticket implementeren dat opgesplitst moet worden voor het coderen
- Elke feature waarbij je een gestructureerd, beoordeelbaar proces wilt

---

## Stap 1 — Definieer en valideer reikwijdte

Stel exact vast wat je bouwt voordat je code schrijft.

**Vraag Claude:**
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

**Waar op te letten in het antwoord:**
- Bestanden die je niet had overwogen
- Randgevallen die bugs zouden veroorzaken als ze worden gemist
- Beslissingen die in CLAUDE.md moeten zodra ze zijn genomen

---

## Stap 2 — Plan de implementatie

Zodra de reikwijdte duidelijk is, krijg je een gesequentieerd plan.

**Vraag Claude:**
```
Based on the scope we just defined, create a numbered implementation plan.

Each step must be:
- A concrete, bounded action (not "implement auth" — "add JWT validation middleware to src/middleware/auth.ts")
- Completable in a single session
- Independently testable

Include which files change in each step. Note dependencies between steps.
```

Bekijk het plan. Als een stap te groot is, vraag Claude om het verder op te splitsen. Vergrendel het plan voor je code aanraakt.

---

## Stap 3 — Implementeer stap voor stap

Voer één planstap tegelijk uit. Sla niet vooruit.

**Voor elke stap:**
```
Implement step [N]: [paste the step description]

Rules:
- Only change what's needed for this step
- Write or update tests for this step's behavior
- Do not refactor code outside the scope of this step
- Tell me when this step is complete and what to verify
```

**Na elke stap:**
- Voer tests uit: bevestig groen voor de volgende stap
- Bekijk de diff zelf: is dit wat je bedoelde?
- Als een stap nieuwe complexiteit onthult, werk het plan bij voor te doorgaan

---

## Stap 4 — Integratiecontrole

Zodra alle stappen zijn voltooid, verifieer dat de volledige feature end-to-end werkt.

**Vraag Claude:**
```
All implementation steps are complete. Now:

1. Run the full test suite — report any failures
2. Check that all edge cases from Step 1 are handled — list each one and confirm
3. Check for any TODOs or incomplete error handling introduced during implementation
4. Verify the feature works with [specific test scenario relevant to this feature]
```

Los eventuele gevonden problemen op voor je doorgaat.

---

## Stap 5 — Zelfreview

Bekijk je eigen wijzigingen voor het aanmaken van een PR.

**Vraag Claude:**
```
Review the changes on this branch against main.

Focus on:
1. CRITICAL issues (bugs, security, data loss risks)
2. Missing tests for changed behavior
3. Convention violations vs this project's CLAUDE.md
4. Anything that would confuse a reader in 6 months

Format: CRITICAL / SUGGESTED / NITPICK
```

Los alle CRITICAL-problemen op. Gebruik oordeel voor SUGGESTED-items.

---

## Stap 6 — PR-beschrijving

**Vraag Claude:**
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

## Checklist voor samenvoegen

- [ ] Alle tests slagen
- [ ] Zelfreview voltooid, geen CRITICAL-problemen
- [ ] Randgevallen uit Stap 1 zijn allemaal afgehandeld
- [ ] PR-beschrijving geschreven
- [ ] CLAUDE.md bijgewerkt als nieuwe beslissingen zijn genomen
- [ ] CONTEXT.md bijgewerkt als nieuwe domaintermen zijn geïntroduceerd

---
