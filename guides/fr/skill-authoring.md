# Guide de création de compétences

Comment écrire une compétence Claude Code qui fonctionne réellement — déclencheurs précis, patterns réels, sans remplissage.

---

## Qu'est-ce qu'une compétence

Une compétence est un fichier Markdown placé dans `.claude/skills/` qui devient une commande slash dans Claude Code. Lorsque vous tapez `/nom-competence`, Claude lit le fichier et utilise son contenu pour guider la session.

Une compétence n'est **pas** un modèle de prompt. C'est un ensemble structuré d'instructions qui :
- Indique à Claude quand s'activer et quand rester en retrait
- Fournit des patterns spécifiques au domaine que Claude n'appliquerait pas par défaut
- Établit des contraintes et des anti-patterns pour un type de tâche spécifique

---

## Emplacement et nommage des fichiers

| Portée | Chemin |
|---|---|
| Niveau projet | `.claude/skills/<nom-competence>.md` |
| Personnel (tous projets) | `~/.claude/skills/<nom-competence>.md` |

Règles de nommage :
- `kebab-case.md` uniquement
- Le nom doit correspondre à la commande slash souhaitée : `fastapi-crud.md` → `/fastapi-crud`
- Soyez spécifique : `django-migrations.md` est mieux que `django.md`

---

## La structure requise

Chaque compétence doit avoir ces quatre sections dans cet ordre :

```markdown
# Nom de la compétence

## When to activate
[Conditions de déclenchement spécifiques]

## When NOT to use
[Anti-patterns — quand cette compétence est le mauvais outil]

## Instructions
[Le contenu de la compétence]

## Example
[Au moins un exemple concret]
```

N'ajoutez pas de sections au-delà de celles-ci sans raison claire. La concision est une fonctionnalité.

---

## Écrire "When to activate"

C'est la section la plus importante. Elle détermine si Claude applique correctement la compétence ou l'ignore.

**Mauvais — trop vague :**
```markdown
## When to activate
When working with Python APIs.
```

**Bon — spécifique et actionnable :**
```markdown
## When to activate
- Building a new FastAPI endpoint (GET, POST, PUT, DELETE)
- Adding request validation with Pydantic models
- Implementing dependency injection in FastAPI routes
- Writing async route handlers with background tasks
```

Règles :
- Utilisez des points de liste, un déclencheur par ligne
- Soyez concret sur la tâche, pas sur la technologie
- Si cela s'applique uniquement au nouveau code par rapport au code existant, dites-le explicitement

---

## Écrire "When NOT to use"

Cette section empêche Claude d'appliquer la compétence dans le mauvais contexte. Sans elle, la compétence devient du bruit.

**Exemple pour une compétence FastAPI :**
```markdown
## When NOT to use
- Existing Flask or Django projects — use the appropriate skill instead
- Simple scripts that don't need an API layer
- When the user has already defined their own router structure — follow it rather than imposing this pattern
- gRPC or GraphQL APIs — different paradigms, different skills
```

---

## Écrire les instructions

C'est là que réside la valeur de la compétence. Rédigez-les comme des instructions directes à Claude, pas comme de la documentation.

**Principes :**

1. **Soyez directif, pas descriptif.** Dites à Claude ce qu'il doit *faire*, pas ce qu'est la technologie.

   Mauvais : "FastAPI uses Pydantic for validation."
   Bon : "Always define a Pydantic model for request bodies. Never accept raw dicts."

2. **Encodez les décisions.** Une compétence doit résoudre l'ambiguïté, pas en créer.

   Mauvais : "Use appropriate error handling."
   Bon : "Raise `HTTPException` with status 422 for validation errors, 404 for not-found, 500 only for unexpected failures. Never let exceptions propagate to the response."

3. **Incluez ce qui n'est pas évident.** Si un pattern est évident, Claude le connaît déjà. Les compétences tirent leur valeur en encodant ce qui est facile de mal faire.

4. **Référencez les vraies capacités de Claude Code.** Une compétence peut instruire Claude d'utiliser des outils spécifiques, de lancer des sous-agents ou de déclencher des hooks — utilisez-le.

5. **Gardez-le scannable.** Utilisez des en-têtes, des puces et des blocs de code. Claude lit l'intégralité du fichier mais l'applique mieux quand la structure est claire.

---

## Écrire l'exemple

L'exemple n'est pas optionnel. Il ancre la compétence dans la réalité et montre à Claude la qualité de sortie attendue.

Un bon exemple inclut :
- Le prompt utilisateur qui déclencherait la compétence
- La structure de sortie attendue (pas nécessairement du code complet — la structure compte plus)
- Toutes les contraintes que l'exemple démontre

---

## Longueur de la compétence

| Type de compétence | Longueur cible |
|---|---|
| Compétence de tâche ciblée | 50–150 lignes |
| Compétence de domaine (large) | 150–300 lignes |
| Compétence de workflow | 300–500 lignes |

Si votre compétence dépasse 500 lignes, divisez-la en deux compétences ciblées. Les compétences longues diluent l'attention de Claude.

---

## Tester votre compétence

Avant de soumettre à Claudient :

1. Copiez la compétence dans le `.claude/skills/` d'un vrai projet
2. Ouvrez Claude Code et déclenchez-la avec la commande slash
3. Donnez à Claude une tâche correspondant à vos conditions "When to activate"
4. Vérifiez que Claude applique les patterns de votre section Instructions
5. Donnez à Claude une tâche correspondant à vos conditions "When NOT to use"
6. Vérifiez que Claude n'applique PAS les patterns de la compétence

Une compétence qui réussit l'étape 5 mais échoue à l'étape 6 nécessite un déclencheur plus spécifique.

---

## Erreurs courantes

**Décrire la technologie au lieu de guider le comportement**
Les compétences qui ressemblent à de la documentation n'aident pas Claude. Claude sait déjà ce qu'est FastAPI. Dites-lui comment *vous* voulez qu'il l'utilise.

**Déclencheurs trop larges**
`## When to activate: When writing Python` se déclenchera sur tout. Affinez-le.

**Anti-patterns manquants**
Sans "When NOT to use", Claude peut appliquer votre compétence dans des contextes où elle cause des problèmes.

**Pas d'exemple**
Les exemples sont le moyen le plus rapide pour Claude de se calibrer à votre niveau de qualité attendu.

**Importation de bonnes pratiques génériques**
Une compétence pleine de conseils de codage généraux (utiliser les annotations de type, écrire des tests, gérer les erreurs) ajoute du bruit. Ceux-ci appartiennent à `rules/`, pas aux compétences.

---

## Travaillez avec nous





---

## Modèle de compétence

```markdown
# [Nom de la compétence]

## When to activate
- [Déclencheur spécifique 1]
- [Déclencheur spécifique 2]
- [Déclencheur spécifique 3]

## When NOT to use
- [Anti-pattern 1]
- [Anti-pattern 2]

## Instructions

### [Sous-sujet 1]
[Instructions directives]

### [Sous-sujet 2]
[Instructions directives]

## Example

**User:** [Exemple de prompt]

**Expected output:**
[Structure ou code attendu]
```
