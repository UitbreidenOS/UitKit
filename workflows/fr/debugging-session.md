> 🇫🇷 This is the French translation. [English version](../debugging-session.md).

# Workflow de Session de Débogage

Workflow systématique pour diagnostiquer et corriger des bugs avec Claude Code — sans chasser les symptômes.

---

## Quand utiliser ce workflow
- Un bug qui n'est pas immédiatement évident à la lecture du code
- Un test en échec dont la cause n'est pas claire
- Une erreur de production que vous ne pouvez pas reproduire localement
- Des échecs intermittents

---

## Étape 1 — Construire une boucle de feedback d'abord

Avant d'investiguer, créez un moyen de reproduire le bug de façon fiable. Ne sautez pas cette étape.

**Prompt Claude :**
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

**Ne pas continuer sans une reproduction fiable.** Déboguer sans reproduction, c'est deviner.

---

## Étape 2 — Isoler le rayon de blast

Comprendre où le bug peut se trouver avant de lire tout code.

**Prompt Claude :**
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

## Étape 3 — Générer des hypothèses

**Prompt Claude :**
```
Based on the reproduction and the candidate files, generate 3–5 falsifiable hypotheses.

For each hypothesis:
- State it as a specific claim: "The bug occurs because [X] when [Y]"
- Describe how to test it: what would we observe if this hypothesis is true?
- Describe how to disprove it: what would we observe if it's false?

Do not start testing yet. List all hypotheses first.
```

Révisez les hypothèses. Ajoutez celles que vous avez pensées que Claude a manquées. Classez-les par probabilité.

---

## Étape 4 — Tester les hypothèses, par ordre de probabilité décroissante

**Pour chaque hypothèse :**
```
Test hypothesis [N]: "[paste the hypothesis]"

Add the minimal instrumentation needed to confirm or rule this out:
- A log statement at the right point
- A debug assertion
- A targeted test with a specific input

Do not add instrumentation for other hypotheses yet.
```

Après chaque test :
- Si confirmée : passer à l'Étape 5
- Si réfutée : passer à l'hypothèse suivante
- Si non concluante : affiner l'hypothèse et re-tester

---

## Étape 5 — Corriger et vérifier

Une fois la cause racine confirmée :

**Prompt Claude :**
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

## Étape 6 — Post-mortem (pour les bugs sérieux)

Pour les bugs qui ont causé un impact utilisateur, une perte de données ou qui ont pris plus de 2 heures à trouver :

**Prompt Claude :**
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

## Anti-patterns à éviter

- **Corriger le symptôme, pas la cause** — si vous ne comprenez pas pourquoi, vous ne l'avez pas corrigé
- **Changer plusieurs choses à la fois** — vous ne saurez pas quel changement a corrigé le bug
- **Déboguer sans reproduction** — vous devinez
- **Ajouter de l'instrumentation partout** — cibler des hypothèses spécifiques
- **Sauter le test de régression** — le bug reviendra

---
