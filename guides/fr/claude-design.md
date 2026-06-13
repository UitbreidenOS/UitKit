# Claude Design — Agent de conception visuelle par Anthropic Labs

Claude Design est un agent de conception visuelle — pas un outil de design traditionnel — qui génère du travail visuel soigné à partir de descriptions en langage naturel. Il lit votre système de conception existant, votre base de code et vos fichiers de marque pour produire un résultat en marque, puis empaquète le résultat en un bundle de remise que Claude Code peut utiliser directement.

---

## Ce qu'est Claude Design

- **Texte vers conception** : décrivez ce dont vous avez besoin, Claude construit une première version
- **Sensible au système de conception** : lit votre base de code et vos fichiers de conception pour appliquer automatiquement les couleurs, la typographie et les composants existants
- **Raffinement conversationnel** : commentaires en ligne, éditions directes, curseurs d'ajustement personnalisés
- **Export multi-format** : URLs internes, Canva, PDF, PPTX, HTML
- **Bundle de remise Claude Code** : empaquète la conception en un bundle de développement que Claude Code peut consommer
- **Disponibilité** : Aperçu de recherche pour les abonnés Pro, Max, Team et Enterprise (à partir du 17 avril 2026)

---

## Comment cela s'intègre dans un flux de travail Claude Code

1. Commencez dans Claude Design — décrivez l'interface utilisateur ou l'élément visuel nécessaire
2. Attachez vos jetons de système de conception (couleurs, typographie, bibliothèque de composants)
3. Affinez conversationnellement jusqu'à ce que le résultat corresponde à l'intention
4. Export → « Send to Claude Code » génère un bundle de remise
5. Dans Claude Code : référencez le bundle de remise pour implémenter la conception en tant que code

Le bundle de remise contient les spécifications de mise en page, les jetons de conception extraits, les annotations de composants et les notes de point d'arrêt réactif — suffisant pour que Claude Code implémenter sans interprétation de conception supplémentaire.

---

## Motif de remise de conception vers code

```bash
# Exportez depuis Claude Design, puis :
unzip checkout-v2.bundle -d design-handoffs/checkout-v2/

# Ouvrez Claude Code et référencez le bundle
claude "Implement the checkout page from design-handoffs/checkout-v2/ using shadcn/ui components"
```

Structure de projet recommandée :

```
project-root/
├── design-handoffs/
│   ├── checkout-v2/
│   │   ├── layout.json          # Component tree and positioning
│   │   ├── tokens.json          # Colors, spacing, typography
│   │   ├── components.md        # Component annotations
│   │   └── preview.png          # Visual reference
│   └── landing-v1/
└── src/
```

---

## Joindre un système de conception

Claude Design lit le contexte de conception à partir de trois sources :

| Source | Comment l'attacher | Ce que Claude lit |
|--------|---------------|-------------------|
| Fichier de jeton | Téléchargez `tokens.json` ou collez les variables CSS | Couleurs, espacement, rayons, échelles de polices |
| Bibliothèque de composants | Liez l'URL Storybook ou téléchargez les captures d'écran de composants | Noms de composants existants et variantes |
| Fichier de marque | Téléchargez le PDF de marque ou le guide de style | Utilisation du logo, hiérarchie typographique, ton |
| Base de code | Collez `tailwind.config.js` ou le fichier de thème | Mappages de classe utilitaire, points d'arrêt |

Plus vous fournissez de contexte, moins la boucle de raffinement nécessite de correction.

---

## Cas d'usage

- Maquettes de produits et prototypes interactifs avant la planification de sprint
- Pitch decks et matériaux pour investisseurs sans concepteur dans l'équipe
- Matériel marketing : one-pagers, concepts de page d'accueil, cartes sociales
- Exploration d'interface utilisateur avant implémentation complète — explorez 3 directions à bon marché
- Éléments visuels cohérents avec la marque rapides pour les équipes sans concepteur dédié
- Écrans d'intégration rapides, états vides et conceptions d'état d'erreur

---

## Raffinement conversationnel

Claude Design prend en charge les éditions en langage naturel lors du raffinement :

```
"Move the CTA button above the fold"
"Make the heading larger and use our primary brand color"
"Try a version with less whitespace — this is for a dense data dashboard"
"Add a dark mode variant"
"Match the typography from the homepage we uploaded"
```

Chaque instruction produit une nouvelle version ; les versions précédentes sont conservées dans l'historique des versions.

---

## Formats d'export

| Format | Meilleur pour |
|--------|---------|
| Bundle de remise (`.bundle`) | Implémentation Claude Code |
| HTML | Maquette statique dans un navigateur |
| PDF | Examen des parties prenantes, impression |
| PPTX | Pitch decks, présentations |
| Export Canva | Édition par l'équipe marketing |
| URL interne | Partage au sein de claude.ai |

---

## Limitations (Aperçu de recherche)

- Statut d'aperçu de recherche — les fonctionnalités et les formats d'export peuvent changer sans préavis
- Pas un éditeur vectoriel — aucune manipulation de nœud équivalente à Figma ou outils de disposition précise
- Le bundle de remise est une aide au développement, pas une spécification pixel-parfait ; Claude Code peut avoir besoin d'adapter la mise en page pour la réactivité
- Nécessite un compte claude.ai sur un plan Pro, Max, Team ou Enterprise
- Ne convient pas comme seule source de vérité pour les systèmes de conception de production
- Les conceptions complexes avec de nombreux composants personnalisés peuvent nécessiter un affinement de prompt important

---
