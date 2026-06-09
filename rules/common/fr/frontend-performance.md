# Règles de Performance Frontend

Appliquer lors de la création ou de l'examen d'une interface utilisateur livrée par navigateur.

## Chargement

- Servir le HTML à partir de l'edge ou d'un CDN — éliminer les allers-retours vers l'origine pour le document initial
- Utiliser `<link rel="preload">` pour les polices critiques et les images au-dessus de la ligne de flottaison ; utiliser `<link rel="prefetch">` pour les ressources de la page suivante
- Diviser les bundles aux limites des routes ; charger en lazy-load tout ce qui n'est pas nécessaire pour le premier rendu
- Intégrer le CSS critique (< 14 KB) dans `<head>` ; charger le reste de manière asynchrone
- Définir `Cache-Control: immutable` à long terme sur les ressources statiques hachées ; `no-cache` sur le HTML

## Images

- Utiliser des formats modernes : WebP avec fallback JPEG/PNG ; AVIF où pris en charge
- Toujours spécifier les attributs `width` et `height` pour éviter le décalage de mise en page (CLS)
- Utiliser `loading="lazy"` pour les images sous la ligne de flottaison ; jamais pour au-dessus
- Servir les images à la taille rendue — ne pas livrer une image de 2000 px pour un emplacement de 200 px
- Utiliser un service de transformation d'image CDN plutôt que redimensionner au moment de la compilation

## JavaScript

- Chaque octet de JS est analysé et exécuté — livrer uniquement ce dont la route actuelle a besoin
- Éviter les tâches longues synchrones (> 50 ms) sur le thread principal ; déplacer le travail lourd vers un Web Worker
- Débouncer les gestionnaires d'entrée ; limiter les écouteurs scroll et resize
- Supprimer les écouteurs d'événements et annuler les minuteurs au démontage du composant pour éviter les fuites mémoire
- Tree-shake les dépendances : importer les exportations nommées, pas des bibliothèques entières

## Rendu

- Mesurer les Core Web Vitals (LCP, INP, CLS) dans la surveillance des utilisateurs réels — pas seulement dans Lighthouse
- Cible LCP : < 2,5 s ; cible INP : < 200 ms ; cible CLS : < 0,1
- Éviter les mises en page synchrones forcées : ne pas lire les propriétés de mise en page immédiatement après les écrire
- Utiliser `content-visibility: auto` sur les sections hors écran des pages longues
- Virtualiser les listes longues — jamais rendre des milliers de nœuds DOM

## Polices

- Sous-ensemble les polices aux jeux de caractères que vous utilisez ; ne pas charger des plages Unicode complètes pour du contenu latin uniquement
- Utiliser `font-display: swap` pour le texte du corps ; `font-display: optional` pour les polices décoratives
- Préconnecter aux CDN de polices : `<link rel="preconnect" href="https://fonts.googleapis.com">`
- Auto-héberger les polices quand la latence vers un CDN tiers est mesurable

## Mesure

- Définir un budget de performance et échouer le CI quand il est dépassé (taille du bundle, LCP, score Lighthouse)
- Profiler avec de vrais appareils sur des connexions limitées — les machines de développement ne sont pas représentatives
- Utiliser `PerformanceObserver` pour collecter les données de terrain (métriques des utilisateurs réels), pas seulement les tests synthétiques
