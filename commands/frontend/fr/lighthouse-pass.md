---
description: Auditez le code par rapport aux cibles de performance, d'accessibilité et de bonnes pratiques de Lighthouse et appliquez les corrections
argument-hint: "[file-or-route] [target-score: 90|95|100]"
---
Optimisez $ARGUMENTS pour passer les audits Lighthouse au score cible spécifié (par défaut : 90).

Cette commande effectue une analyse de code statique — elle n'exécute pas de navigateur. Appliquez les corrections qui traitent les motifs d'échec connus de Lighthouse.

**Performance — Core Web Vitals**

LCP (Largest Contentful Paint):
- Ajoutez `fetchpriority="high"` à l'image hero au-dessus de la ligne de flottaison ou au bloc de texte le plus grand
- Supprimez `loading="lazy"` de toute image susceptible d'être au-dessus de la ligne de flottaison
- Assurez-vous que le CSS critique est inséré ou chargé de manière synchrone ; auditez les `<link rel="stylesheet">` bloquant le rendu dans `<head>`
- Remplacez `<img src="...">` par `<Image>` (Next.js) ou ajoutez `width`/`height` explicites pour éviter le décalage de disposition

CLS (Cumulative Layout Shift):
- Chaque `<img>`, `<video>` et `<iframe>` doit avoir des attributs `width` et `height` explicites ou une propriété CSS `aspect-ratio`
- Chargement des polices : ajoutez `font-display: swap` à toutes les déclarations `@font-face`
- Évitez d'insérer du contenu au-dessus du contenu existant après le chargement de la page (annonces, bannières, avis de cookies)

INP / TBT (Interaction to Next Paint / Total Blocking Time):
- Déplacez les calculs coûteux en dehors du thread principal ou enveloppez-les dans `startTransition`
- Divisez les grands composants avec `React.lazy` + `Suspense` s'ils sont en dessous de la ligne de flottaison
- Débottez ou limitez les gestionnaires d'événements sur le défilement, le redimensionnement et l'entrée

**Bonnes pratiques**
- Tous les cibles `<a>` avec `target="_blank"` doivent avoir `rel="noopener noreferrer"`
- Aucun appel `console.log` / `console.error` n'est laissé dans les chemins de code de production
- Aucun attribut HTML obsolète (`border`, `align`, `bgcolor` sur les éléments)
- `<meta name="viewport">` doit être présent et ne doit pas désactiver la mise à l'échelle par l'utilisateur

**SEO**
- Chaque page/route doit avoir un unique `<title>` et `<meta name="description">`
- La hiérarchie des en-têtes doit commencer par `<h1>` sans niveaux sautés
- Les liens doivent avoir un texte descriptif — signalez les ancres "click here" et "read more"

**Accessibilité (sous-ensemble Lighthouse)**
- Étiquettes de bouton et de lien : chaque élément interactif doit avoir un nom accessible
- Texte alternatif d'image : toutes les images non décoratives ont besoin d'une `alt` descriptive
- Étiquettes de formulaire : chaque entrée a un `<label>` associé ou `aria-label`

**Sortie**
Pour chaque problème trouvé, émettez : `file:line | audit category | issue | fix applied`
Appliquez toutes les corrections directement. Si une correction nécessite une modification à l'exécution (par exemple, un fractionnement de bundle réel), notez-la comme une action manuelle avec la modification exacte requise.
