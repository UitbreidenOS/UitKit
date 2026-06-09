---
description: Identifier et corriger les ruptures de mise en page réactive pour un fichier ou composant donné
argument-hint: "[file] [breakpoint: sm|md|lg|xl]"
---
Corriger les problèmes de mise en page réactive dans : $ARGUMENTS

Analyser les arguments : le premier token est le fichier cible ; le nom du breakpoint optionnel limite la portée à ce breakpoint uniquement. Si aucun breakpoint n'est donné, auditer tous les breakpoints standard.

**Étape 1 — Identifier le système de breakpoints**
Analyser le projet pour :
- Configuration Tailwind (`tailwind.config.*`) pour extraire les breakpoints personnalisés
- Propriétés CSS personnalisées ou variables SCSS définissant les breakpoints
- Valeurs de media query utilisées dans les feuilles de style existantes
Utiliser les noms et valeurs de breakpoints du projet tout au long — ne pas en inventer ni les remplacer.

**Étape 2 — Auditer la mise en page à chaque breakpoint**
Vérifier ces modèles d'échec :

Débordement et coupure :
- Valeurs fixes de `width` ou `height` sur des conteneurs qui devraient être fluides
- `min-width` plus grand que la largeur de la fenêtre à ce breakpoint
- `white-space: nowrap` sur du texte qui débordra sur des écrans étroits

Flexbox / Grid :
- `flex-wrap: nowrap` causant un débordement sur les petits écrans
- Colonnes Grid avec unités `fr` qui s'effondrent à des largeurs illisibles
- `min-width: 0` manquant sur les enfants flex/grid contenant du contenu débordant

Espacement :
- Valeurs fixes de `padding` ou `margin` qui consomment un espace disproportionné sur mobile
- Éléments positionnés en absolu avec offsets fixes qui s'échappent de leur conteneur à des largeurs étroites

Typographie :
- Valeurs de `font-size` qui ne réduisent pas — signaler si aucune fonction `clamp()` ou classe réactive n'est utilisée
- Longueurs de ligne (`max-width`) non ajustées pour les petits écrans

Images et médias :
- `max-width: 100%` manquant sur les images dans des conteneurs fluides
- `aspect-ratio` non défini sur les médias causant un changement de mise en page

**Étape 3 — Appliquer les corrections**
Pour chaque problème trouvé :
- Éditer le fichier directement
- Utiliser les classes d'utilitaire réactive du projet (par ex., Tailwind `sm:`, `md:`) ou les media queries correspondant au modèle existant
- Ne pas réécrire le code qui fonctionne — édits chirurgicaux et minimaux uniquement

**Étape 4 — Rapport**
Après avoir appliqué les corrections, lister : `file:line | breakpoint | issue | fix applied`

Si le composant nécessite une vérification visuelle, noter quels breakpoints vérifier manuellement dans le navigateur.
