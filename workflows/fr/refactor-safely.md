> 🇫🇷 This is the French translation. [English version](../refactor-safely.md).

# Workflow de Refactoring Sécurisé

Comment refactoriser du code avec Claude Code sans casser le comportement — en utilisant les tests comme filet de sécurité tout au long.

---

## Quand utiliser ce workflow
- Extraire des fonctions d'une grande méthode
- Renommer et réorganiser des modules
- Remplacer un pattern par un meilleur à travers plusieurs fichiers
- Réduire la duplication dans la base de code
- Améliorer la structure d'un module sans changer son comportement externe

---

## La règle d'or

**Ne jamais refactoriser et changer le comportement dans le même commit.** Un refactoring préserve le comportement externe. Si les tests cassent, vous avez soit changé le comportement soit les tests testaient des détails d'implémentation (les deux sont des problèmes).

---

## Étape 1 — Établir une baseline de test

Avant de changer quoi que ce soit, confirmez que vous avez une couverture de test adéquate.

**Prompt Claude :**
```
I want to refactor: [describe what you're refactoring and why]

First, assess the current test coverage:
1. Read the relevant files: [list files]
2. What behaviors are currently tested?
3. What behaviors are NOT tested that could break during refactoring?
4. Write any missing tests now, before we touch production code

Do not change production code yet. Tests only.
```

**Committez les ajouts de test avant de refactoriser.** Cela rend clair quels tests existaient avant vs. ont été ajoutés dans le cadre du refactoring.

---

## Étape 2 — Définir la portée du refactoring

**Prompt Claude :**
```
Here is what I want to refactor: [describe the goal]

Read the relevant files: [list files]

Define the scope:
1. What will change structurally? (function signatures, file locations, module boundaries)
2. What will NOT change? (external behavior, API contracts, database schema)
3. What are the riskiest parts of this refactor?
4. What is the smallest first step that makes progress without risk?

Do not start the refactor yet.
```

---

## Étape 3 — Refactoriser en petits incréments testables

Décomposez le refactoring en étapes suffisamment petites pour que les tests puissent vérifier chacune.

**Pour chaque incrément :**
```
Refactor step [N]: [describe the specific structural change]

Rules:
- Change only what's needed for this step
- Do not change any behavior
- After this change, all existing tests must still pass
- Tell me what to verify after this step
```

**Après chaque incrément :**
```bash
# Exécuter les tests — doivent être verts avant l'étape suivante
npm test  # or pytest, go test, etc.
```

Si les tests échouent après un changement purement structurel : arrêter, comprendre pourquoi, corriger avant de continuer. Un test en échec après un refactoring signifie que soit le refactoring a changé le comportement soit le test testait l'implémentation (les deux sont des problèmes à corriger maintenant).

---

## Étape 4 — Vérifier que le comportement externe est inchangé

Après tous les incréments :

**Prompt Claude :**
```
The refactor is structurally complete. Verify that external behavior is unchanged:

1. Run the full test suite
2. Check that all public APIs/interfaces are identical to before (same inputs, same outputs)
3. Check that database queries produce identical results
4. Check that error cases still produce the same errors
5. If there are integration tests or end-to-end tests, run them

Report any behavioral differences — even small ones.
```

---

## Étape 5 — Nettoyage

**Prompt Claude :**
```
Before committing, clean up:

1. Remove any debugging code or temporary comments added during refactoring
2. Remove any dead code that the refactor made unreachable
3. Update any documentation or comments that referenced the old structure
4. Check that import paths are clean (no unused imports)

Do not introduce new logic in this step.
```

---

## Étape 6 — Committer avec un message clair

Structurez le ou les commits de refactoring pour raconter une histoire claire :

```
refactor: extract payment processing into PaymentService

Moves payment logic out of OrderController into a dedicated service.
No behavior change — all existing tests pass.
Motivation: OrderController was 600 lines; this makes both units testable in isolation.
```

Ne jamais mélanger un commit de refactoring avec un commit de fonctionnalité ou de correction de bug. Les garder séparés.

---

## Anti-patterns de refactoring

- **"Pendant que j'y suis..."** — faire un refactoring et une fonctionnalité en même temps. Arrêter. Terminer le refactoring d'abord.
- **Refactoriser sans tests** — vous allez casser quelque chose et ne pas le savoir
- **Refactoring big-bang** — tout changer d'un coup. Faire de façon incrémentale.
- **Renommer en dernière étape** — renommer d'abord (mécanique, faible risque), puis restructurer
- **Sauter la baseline** — supposer que les tests sont adéquats sans vérifier d'abord

---
