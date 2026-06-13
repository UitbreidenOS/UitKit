---
description: Auditer le code par rapport aux cibles Lighthouse de performance, d'accessibilité et de bonnes pratiques, et appliquer les correctifs
argument-hint: "[file-or-route] [target-score: 90|95|100]"
---
Optimiser $ARGUMENTS pour passer les audits Lighthouse avec le score cible spécifié (par défaut : 90).

Cette commande effectue une analyse de code statique — elle n'exécute pas de navigateur. Appliquer les correctifs qui adressent les modèles d'échec Lighthouse connus.

**Performance — Core Web Vitals**

LCP (Largest Contentful Paint) :
- Ajouter `fetchpriority="high"` à l'image héroïque au-dessus de la limite ou au bloc de texte le plus grand
- Supprimer `loading="lazy"` de toute image susceptible d'être au-dessus de la limite
- S'assurer que le CSS critique est intégré ou chargé de manière synchrone ; auditer les `<link rel="stylesheet">` bloquant le rendu dans `<head>`
- Remplacer `<img src="...">` par `<Image>` (Next.js) ou ajouter des attributs `width`/`height` explicites pour éviter le décalage de mise en page

CLS (Cumulative Layout Shift) :
- Chaque `<img>`, `<video>` et `<iframe>` doit avoir des attributs `width` et `height` explicites ou une propriété CSS `aspect-ratio`
- Chargement des polices : ajouter `font-display: swap` à toutes les déclarations `@font-face`
- Éviter d'insérer du contenu au-dessus du contenu existant après le chargement de la page (publicités, bannières, avis sur les cookies)

INP / TBT (Interaction to Next Paint / Total Blocking Time) :
- Déplacer les calculs coûteux en dehors du thread principal ou encapsuler dans `startTransition`
- Diviser les grands composants avec `React.lazy` + `Suspense` s'ils se trouvent sous la limite
- Débounce ou throttle les gestionnaires d'événements sur le défilement, le redimensionnement et l'entrée

**Bonnes pratiques**
- Toutes les cibles `<a>` avec `target="_blank"` doivent avoir `rel="noopener noreferrer"`
- Aucun appel `console.log` / `console.error` ne doit rester dans les chemins de code de production
- Pas d'attributs HTML dépréciés (`border`, `align`, `bgcolor` sur les éléments)
- `<meta name="viewport">` doit être présent et ne doit pas désactiver la mise à l'échelle utilisateur

**SEO**
- Chaque page/route doit avoir un `<title>` unique et une `<meta name="description">`
- La hiérarchie des titres doit commencer par `<h1>` sans niveaux ignorés
- Les liens doivent avoir un texte descriptif — signaler les ancres « cliquez ici » et « en savoir plus »

**Accessibilité (sous-ensemble Lighthouse)**
- Étiquettes des boutons et des liens : chaque élément interactif doit avoir un nom accessible
- Texte alternatif des images : toutes les images non décoratives ont besoin d'un `alt` descriptif
- Étiquettes de formulaire : chaque entrée a un `<label>` associé ou `aria-label`

**Résultat**
Pour chaque problème trouvé, émettre : `file:line | audit category | issue | fix applied`
Appliquer tous les correctifs directement. Si un correctif nécessite un changement à l'exécution (par exemple, le fractionnement réel du bundle), le noter comme une action manuelle avec le changement exact nécessaire.
