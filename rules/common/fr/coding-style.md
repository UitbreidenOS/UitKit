> 🇫🇷 This is the French translation. [English version](../coding-style.md).

# Règles de Style de Code

Copiez les sections pertinentes dans le `CLAUDE.md` de votre projet.

---

## Nommage

- Variables et fonctions : `camelCase` (JS/TS), `snake_case` (Python, Go, Rust)
- Classes et types : `PascalCase` dans tous les langages
- Constantes : `SCREAMING_SNAKE_CASE` uniquement pour les vraies constantes qui ne changent jamais
- Variables booléennes : préfixer avec `is`, `has`, `can`, `should` — `isActive`, `hasPermission`
- Ne pas abréger les noms sauf si l'abréviation est universellement connue (`id`, `url`, `db`, `ctx`)

## Fonctions

- Une responsabilité par fonction — si vous avez besoin de "et" dans la description, séparez-la
- Maximum 40 lignes par fonction ; si plus long, extraire des sous-fonctions
- Pas de paramètres booléens — utiliser un objet d'options ou deux fonctions séparées
- Retourner tôt pour les clauses de garde — ne pas imbriquer le chemin heureux dans des conditionnels

## Commentaires

- N'écrire aucun commentaire sauf si le POURQUOI n'est pas évident
- Ne jamais écrire des commentaires qui décrivent ce que fait le code (le code le fait déjà)
- Écrire un commentaire quand : il y a une contrainte cachée, un contournement pour un bug spécifique, ou un comportement qui surprendrait un lecteur
- Ne jamais écrire des commentaires TODO — créer un problème suivi à la place

## Gestion des erreurs

- Ne jamais avaler silencieusement les erreurs (`catch (e) {}` est toujours faux)
- Toujours gérer les erreurs à la limite où vous pouvez agir
- Propager les erreurs vers le haut avec du contexte — envelopper avec l'ID ou le nom d'opération pertinent
- Ne pas utiliser `console.error` dans le code de production — utiliser le logger du projet

## Organisation des fichiers

- Un export primaire par fichier
- Les noms de fichiers correspondent à leur export primaire : `UserService.ts` exporte `UserService`
- Pas de fichiers barrel (`index.ts` qui réexporte) — importer directement depuis le fichier source
- Grouper les imports : packages externes d'abord, puis modules internes, puis imports relatifs

---
