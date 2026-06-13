> 🇫🇷 This is the French translation. [English version](../feature-development.md).

# Workflow de Développement de Fonctionnalité

Workflow de bout en bout pour mener une fonctionnalité de l'idée à la PR fusionnée avec Claude Code.

---

## Quand utiliser ce workflow
- Construire une nouvelle fonctionnalité qui touche plus d'un fichier
- Implémenter une spec ou un ticket qui doit être décomposé avant le code
- Toute fonctionnalité où vous voulez un processus structuré et révisable

---

## Étape 1 — Définir et valider la portée

Avant d'écrire du code, établissez exactement ce que vous construisez.

**Prompt Claude :**
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

**Ce qu'il faut chercher dans la réponse :**
- Fichiers que vous n'aviez pas envisagés
- Cas limites qui provoqueraient des bugs s'ils étaient manqués
- Décisions qui devraient aller dans CLAUDE.md une fois prises

---

## Étape 2 — Planifier l'implémentation

Une fois la portée claire, obtenez un plan séquencé.

**Prompt Claude :**
```
Based on the scope we just defined, create a numbered implementation plan.

Each step must be:
- A concrete, bounded action (not "implement auth" — "add JWT validation middleware to src/middleware/auth.ts")
- Completable in a single session
- Independently testable

Include which files change in each step. Note dependencies between steps.
```

Révisez le plan. Si une étape est trop grande, demandez à Claude de la décomposer davantage. Validez le plan avant de toucher au code.

---

## Étape 3 — Implémenter étape par étape

Exécutez une étape du plan à la fois. Ne sautez pas en avant.

**Pour chaque étape :**
```
Implement step [N]: [paste the step description]

Rules:
- Only change what's needed for this step
- Write or update tests for this step's behavior
- Do not refactor code outside the scope of this step
- Tell me when this step is complete and what to verify
```

**Après chaque étape :**
- Exécuter les tests : confirmer qu'ils passent avant de passer à l'étape suivante
- Relire le diff vous-même : est-ce ce que vous attendiez ?
- Si une étape révèle une nouvelle complexité, mettre à jour le plan avant de continuer

---

## Étape 4 — Vérification d'intégration

Une fois toutes les étapes terminées, vérifier que la fonctionnalité complète fonctionne de bout en bout.

**Prompt Claude :**
```
All implementation steps are complete. Now:

1. Run the full test suite — report any failures
2. Check that all edge cases from Step 1 are handled — list each one and confirm
3. Check for any TODOs or incomplete error handling introduced during implementation
4. Verify the feature works with [specific test scenario relevant to this feature]
```

Corriger tout problème trouvé avant de continuer.

---

## Étape 5 — Auto-révision

Avant de créer une PR, révisez vos propres changements.

**Prompt Claude :**
```
Review the changes on this branch against main.

Focus on:
1. CRITICAL issues (bugs, security, data loss risks)
2. Missing tests for changed behavior
3. Convention violations vs this project's CLAUDE.md
4. Anything that would confuse a reader in 6 months

Format: CRITICAL / SUGGESTED / NITPICK
```

Corriger tous les problèmes CRITICAL. Faire preuve de jugement sur les éléments SUGGESTED.

---

## Étape 6 — Description de PR

**Prompt Claude :**
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

## Liste de contrôle avant fusion

- [ ] Tous les tests passent
- [ ] Auto-révision terminée, pas de problèmes CRITICAL
- [ ] Les cas limites de l'Étape 1 sont tous gérés
- [ ] Description de PR rédigée
- [ ] CLAUDE.md mis à jour si de nouvelles décisions ont été prises
- [ ] CONTEXT.md mis à jour si de nouveaux termes de domaine ont été introduits

---
