---
description: Identifier et corriger les ruptures de mise en page réactive pour un fichier ou composant donné
argument-hint: "[file] [breakpoint: sm|md|lg|xl]"
---
Corriger les problèmes de mise en page réactive dans : $ARGUMENTS

Parser les arguments : le premier token est le fichier cible ; le nom du breakpoint optionnel restreint la portée à ce breakpoint uniquement. Si aucun breakpoint n'est donné, auditez tous les breakpoints standard.

**Étape 1 — Identifier le système de breakpoint**
Scannez le projet pour :
- Tailwind config (`tailwind.config.*`) pour extraire les breakpoints personnalisés
- Propriétés CSS personnalisées ou variables SCSS définissant les breakpoints
- Valeurs de media query utilisées dans les feuilles de style existantes
Utilisez les noms/valeurs de breakpoint du projet lui-même partout — ne les inventez pas ou ne les dépassez pas.

**Étape 2 — Auditez la mise en page à chaque breakpoint**
Recherchez ces modèles d'échec :

Débordement et écrêtage :
- Valeurs `width` ou `height` fixes sur les conteneurs qui devraient être fluides
- `min-width` plus grand que la fenêtre d'affichage à ce breakpoint
- `white-space: nowrap` sur du texte qui débordéra sur les petits écrans

Flexbox / Grid :
- `flex-wrap: nowrap` causant un débordement sur les petits écrans
- Colonnes Grid avec unités `fr` qui s'effondrent à des largeurs illisibles
- `min-width: 0` manquant sur les enfants flex/grid contenant du contenu qui déborde

Espacement :
- Valeurs `padding` ou `margin` fixes qui consomment une place disproportionnée sur mobile
- Éléments absolus positionnés avec des décalages fixes qui échappent à leur conteneur sur des largeurs étroites

Typographie :
- Valeurs `font-size` ne se réduisant pas — signalez si aucune `clamp()` ou classe responsive n'est utilisée
- Longueurs de ligne (`max-width`) non ajustées pour les petits écrans

Images et médias :
- `max-width: 100%` manquant sur les images à l'intérieur de conteneurs fluides
- `aspect-ratio` non défini sur les médias qui causent un décalage de mise en page

**Étape 3 — Appliquez les corrections**
Pour chaque problème trouvé :
- Modifiez le fichier directement
- Utilisez les classes utilitaires réactives du projet (par exemple, Tailwind `sm:`, `md:`) ou les media queries correspondant au modèle existant
- Ne réécrivez pas le code fonctionnant — éditions chirurgicales et minimales uniquement

**Étape 4 — Rapport**
Après application des corrections, listez : `file:line | breakpoint | issue | fix applied`

Si le composant nécessite une vérification visuelle, notez les breakpoints à vérifier manuellement dans le navigateur.
