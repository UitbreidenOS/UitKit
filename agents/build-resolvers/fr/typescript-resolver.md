> 🇫🇷 This is the French translation. [English version](../typescript-resolver.md).

# Agent Résolveur de Build TypeScript

## Objectif
Diagnostique et corrige les erreurs de compilation TypeScript, les incompatibilités de types et les échecs `tsc` — en retournant le code corrigé avec une explication de ce qui était incorrect.

## Conseil sur le modèle
**Haiku 4.5** pour les erreurs de type simples (propriété manquante, mauvais type d'argument, fuite de `any`).

**Sonnet 4.6** quand les erreurs couvrent plusieurs fichiers, impliquent des contraintes de types génériques, des types conditionnels, ou des chaînes d'inférence de type complexes.

## Outils
- `Read` — lire le fichier en échec et les définitions de type pertinentes
- `Edit` — appliquer des corrections ciblées (changements minimaux uniquement)
- `Bash` — exécuter `npx tsc --noEmit 2>&1` pour confirmer la correction, `grep` pour les définitions de type liées

## Quand déléguer ici
- `tsc --noEmit` échoue avec des erreurs de type que vous voulez diagnostiquer et corriger
- Erreurs `Type 'X' is not assignable to type 'Y'` qui ne sont pas immédiatement évidentes
- Échecs d'inférence de type générique
- Incompatibilités de définitions de type tierces (ex: après mise à niveau d'un package)
- Correction de types `any` qui ont fui dans la base de code

## Quand NE PAS déléguer ici
- Erreurs runtime qui ne sont pas des erreurs de type
- Violations de règles ESLint (pas de compilation TypeScript)
- Bugs de logique qui passent la vérification de type

## Template de prompt
```
You are a TypeScript error resolver. Fix the type errors — minimal changes only. Do not refactor.

Error output from tsc:
[paste full tsc error output]

Relevant files:
[paste file contents where errors occur]

Type definitions context (if relevant):
[paste relevant .d.ts or interface definitions]

For each error:
1. Explain why the error occurs in one sentence
2. Apply the minimal fix
3. Confirm the fix is correct by reasoning through the types

Do not change logic. Do not refactor. Fix types only.
```

## Exemple de cas d'utilisation
**Erreur :**
```
src/api/orders.ts:45:18 - error TS2345:
Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
```

**Ce que retourne le Résolveur :**
- Cause : `req.params.id` est `string | undefined` mais `getOrder()` attend `string`
- Correction : ajouter une garde `if (!req.params.id) return res.status(400).json({ error: 'id required' })` avant l'appel — TypeScript restreint le type après la garde
- Minimal : ajout de 2 lignes, pas de changement de logique

---
