---
description: Supprimer le CSS mort, consolider les doublons, appliquer les tokens de design et corriger les problèmes de spécificité
argument-hint: "[file-or-directory]"
---
Nettoyer le CSS/styles dans : $ARGUMENTS

Si aucun argument n'est fourni, analyser tous les fichiers `.css`, `.scss`, `.module.css` et les chaînes de classes Tailwind dans `src/`.

**Étape 1 — Suppression du code mort**
Identifier et supprimer :
- Les règles CSS dont les sélecteurs ne correspondent à aucun élément dans le JSX/HTML du projet (analyse statique — signaler les noms de classes dynamiques comme incertains, ne pas les supprimer)
- Les déclarations `@keyframes` qui ne sont référencées par aucune propriété `animation` ou `animation-name`
- Les propriétés personnalisées CSS (variables) déclarées dans `:root` ou dans la portée d'un composant mais jamais lues via `var(--name)`
- Les blocs de règles commentés plus anciens que le code environnant (utiliser l'heuristique git blame si disponible)

**Étape 2 — Consolidation des doublons**
- Des ensembles de règles identiques ou quasi-identiques appliqués à différents sélecteurs → extraire une classe utilitaire partagée ou une propriété personnalisée CSS
- Les valeurs répétées de `margin`, `padding` ou `gap` qui correspondent à un token de design existant → remplacer par le token
- Les blocs de requête média avec le même point d'arrêt dispersés dans le fichier → fusionner dans un seul bloc

**Étape 3 — Application des tokens de design**
Analyser le projet pour trouver une source de tokens : des propriétés personnalisées CSS dans `:root`, un `theme.extend` de configuration Tailwind, un fichier `tokens.ts` / `theme.ts`, ou un import de système de design.
Pour chaque valeur en dur trouvée :
- Couleurs (hex, rgb, hsl) : remplacer par le token correspondant le plus proche s'il existe à moins de 5 % de distance perceptuelle ; signaler s'il n'y a pas de correspondance
- Espacement (valeurs px, rem) : remplacer par le token de l'échelle d'espacement correspondant
- Tailles de police : remplacer par le token de l'échelle typographique correspondant
- Ne pas remplacer les valeurs qui n'ont pas d'équivalent de token raisonnable — les signaler dans le résultat à la place

**Étape 4 — Problèmes de spécificité et de cascade**
- Les sélecteurs avec une spécificité supérieure à `(0, 2, 0)` (deux classes) → simplifier ou restructurer
- Les déclarations `!important` : supprimer chacune et vérifier que la cascade fonctionne sans ; si la suppression change le comportement, le noter mais laisser le `!important` en place avec un commentaire expliquant pourquoi
- SCSS profondément imbriqué (plus de 3 niveaux) → aplatir vers BEM ou des classes utilitaires correspondant à la convention du projet
- Sélecteur universel `*` avec des propriétés autres que reset → signaler pour examen

**Étape 5 — Résultat**
Appliquer tous les changements sûrs (code mort, doublons, substitutions de tokens) directement.
Pour les changements destructeurs ou incertains (suppression de sélecteur qui pourrait affecter les classes dynamiques, suppression de `!important`), émettre une liste :
`file:line | issue | recommended action | reason not auto-applied`

Signaler les totaux : lignes supprimées, règles consolidées, tokens substitués.
