---
description: Supprimer le CSS mort, consolider les doublons, appliquer les design tokens et corriger les problèmes de spécificité
argument-hint: "[file-or-directory]"
---
Nettoyer le CSS/styles dans : $ARGUMENTS

Si aucun argument n'est donné, analyser tous les fichiers `.css`, `.scss`, `.module.css` et les chaînes de classes Tailwind dans `src/`.

**Étape 1 — Suppression du code mort**
Identifier et supprimer :
- Les règles CSS dont les sélecteurs ne correspondent à aucun élément dans le JSX/HTML de ce codebase (analyse statique — marquer les noms de classes dynamiques comme incertains, ne pas les supprimer)
- Les déclarations `@keyframes` qui ne sont référencées par aucune propriété `animation` ou `animation-name`
- Les propriétés personnalisées CSS (variables) déclarées dans `:root` ou dans la portée d'un composant mais jamais lues via `var(--name)`
- Les blocs de règles commentés plus anciens que le code environnant (utiliser l'heuristique de git blame si disponible)

**Étape 2 — Consolidation des doublons**
- Ensembles de règles identiques ou quasi-identiques appliqués à différents sélecteurs → extraire une classe utilitaire partagée ou une propriété personnalisée CSS
- Valeurs répétées de `margin`, `padding` ou `gap` qui correspondent à un design token existant → remplacer par le token
- Blocs de media query avec le même breakpoint dispersés dans le fichier → fusionner dans un seul bloc

**Étape 3 — Application des design tokens**
Analyser le projet pour trouver une source de tokens : propriétés personnalisées CSS dans `:root`, une configuration Tailwind `theme.extend`, un fichier `tokens.ts` / `theme.ts`, ou une importation de système de design.
Pour chaque valeur en dur trouvée :
- Couleurs (hex, rgb, hsl) : remplacer par le token correspondant le plus proche s'il existe dans une distance perceptuelle de 5 % ; marquer s'il n'y a pas de correspondance
- Espacement (valeurs px, rem) : remplacer par le token d'échelle d'espacement correspondant
- Tailles de police : remplacer par le token d'échelle typographique correspondant
- Ne pas remplacer les valeurs qui n'ont pas d'équivalent token raisonnable — les signaler dans la sortie

**Étape 4 — Problèmes de spécificité et de cascade**
- Sélecteurs avec une spécificité supérieure à `(0, 2, 0)` (deux classes) → simplifier ou restructurer
- Déclarations `!important` : supprimer chacune et vérifier que la cascade fonctionne sans elle ; si la suppression change le comportement, le noter mais laisser le `!important` en place avec un commentaire expliquant pourquoi
- SCSS profondément imbriqué (plus de 3 niveaux) → aplatir selon les conventions BEM ou classes utilitaires du projet
- Sélecteur universel `*` avec des propriétés autres que reset → marquer pour révision

**Étape 5 — Sortie**
Appliquer tous les changements sûrs (code mort, doublons, substitutions de tokens) directement.
Pour les changements destructifs ou incertains (suppression de sélecteur qui peut affecter les classes dynamiques, suppression de `!important`), émettre une liste :
`file:line | issue | action recommandée | raison de non-application automatique`

Signaler les totaux : lignes supprimées, règles consolidées, tokens substitués.
