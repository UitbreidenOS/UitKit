> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../debugging-session.md).

# Debugging Session Workflow

Systematische workflow voor het diagnosticeren en oplossen van bugs met Claude Code — zonder symptomen na te jagen.

---

## Wanneer deze workflow te gebruiken
- Een bug die niet direct duidelijk is bij het lezen van de code
- Een falende test waarbij de oorzaak niet duidelijk is
- Een productiefout die je lokaal niet kunt reproduceren
- Intermitterende fouten

---

## Stap 1 — Bouw eerst een feedbacklus

Maak een manier om de bug betrouwbaar te reproduceren voor je onderzoekt. Sla deze stap niet over.

**Vraag Claude:**
```
I have a bug: [describe the symptom exactly — error message, unexpected behavior, what you expected]

Before we investigate, help me build a reliable way to reproduce it.

Options to consider:
- A failing test that captures the bug
- A curl command or script that triggers it
- A minimal code snippet that demonstrates it
- Steps to reproduce via the UI

Which is most appropriate here, and write it now.
```

**Ga niet door totdat je een betrouwbare reproductie hebt.** Debuggen zonder reproductie is raden.

---

## Stap 2 — Isoleer de blaststraal

Begrijp waar de bug mogelijk kan leven voor je code leest.

**Vraag Claude:**
```
Here is the reproduction: [paste the reproduction from Step 1]

Without looking at code yet, answer:
1. What is the earliest point in the call stack where this could go wrong?
2. What external systems are involved (DB, cache, third-party API, queue)?
3. What changed recently that could have introduced this? (check git log)
4. What is the smallest unit of code that, if wrong, would cause this symptom?

List the files most likely to contain the bug, ranked by probability.
```

---

## Stap 3 — Genereer hypothesen

**Vraag Claude:**
```
Based on the reproduction and the candidate files, generate 3–5 falsifiable hypotheses.

For each hypothesis:
- State it as a specific claim: "The bug occurs because [X] when [Y]"
- Describe how to test it: what would we observe if this hypothesis is true?
- Describe how to disprove it: what would we observe if it's false?

Do not start testing yet. List all hypotheses first.
```

Bekijk de hypothesen. Voeg toe welke je zelf mist die Claude miste. Rangschik ze op waarschijnlijkheid.

---

## Stap 4 — Test hypothesen, hoogste waarschijnlijkheid eerst

**Voor elke hypothese:**
```
Test hypothesis [N]: "[paste the hypothesis]"

Add the minimal instrumentation needed to confirm or rule this out:
- A log statement at the right point
- A debug assertion
- A targeted test with a specific input

Do not add instrumentation for other hypotheses yet.
```

Na elke test:
- Als bevestigd: ga naar Stap 5
- Als uitgesloten: ga naar de volgende hypothese
- Als niet-concludent: verfijn de hypothese en hertest

---

## Stap 5 — Repareer en verifieer

Zodra de hoofdoorzaak is bevestigd:

**Vraag Claude:**
```
Root cause confirmed: [describe what you found]

Now:
1. Apply the minimal fix — change only what's needed to fix this specific bug
2. Do not refactor surrounding code
3. Update the reproduction from Step 1 to be a regression test
4. Run the full test suite — confirm nothing else broke

Explain in one sentence why this fix works.
```

---

## Stap 6 — Postmortem (voor ernstige bugs)

Voor bugs die gebruikersinvloed hadden, dataverlies veroorzaakten, of meer dan 2 uur duurden om te vinden:

**Vraag Claude:**
```
Write a brief post-mortem for this bug:

1. What was the bug? (one sentence)
2. What was the root cause?
3. How long did it take to find and why?
4. What would have caught this earlier? (missing test, missing monitoring, code review gap)
5. What should we add/change to prevent this class of bug?

Keep it under 200 words. No blame, no fluff.
```

---

## Te vermijden antipatronen

- **Het symptoom repareren, niet de oorzaak** — als je niet begrijpt waarom, heb je het niet gerepareerd
- **Meerdere dingen tegelijk wijzigen** — je weet niet welke wijziging het heeft gerepareerd
- **Debuggen zonder reproductie** — je raadt
- **Instrumentatie overal toevoegen** — richt je op specifieke hypothesen
- **De regressietest overslaan** — de bug komt terug

---
