---
description: Générer un composant React typé et accessible avec interface de props et tests basiques
argument-hint: "[ComponentName] [variant: functional|compound] [framework: react|next]"
---
Générer un composant React prêt pour la production basé sur : $ARGUMENTS

Analyser les arguments :
- Le premier token est le nom du composant en PascalCase
- Variante optionnelle `functional` (par défaut) ou `compound`
- Framework optionnel `react` (par défaut) ou `next` pour les modèles spécifiques au framework

Exigences :
1. TypeScript avec interface Props explicite — pas de `any`, pas de types implicites
2. Export nommé uniquement — pas d'exports par défaut
3. Les Props doivent inclure `className?: string` pour l'extension de style et `children?: React.ReactNode` si le composant est un conteneur
4. Utiliser `forwardRef` si le composant enveloppe un élément DOM natif
5. Variante composée : exposer les sous-composants comme propriétés statiques (par exemple `Card.Header`, `Card.Body`)
6. Pas de styles en ligne — utiliser les CSS Modules ou les classes utilitaires Tailwind selon ce qui existe déjà dans le projet
7. Les rôles et attributs ARIA doivent être corrects pour le type de composant (button, dialog, listbox, etc.)
8. Support de la navigation au clavier le cas échéant (Échap ferme les superpositions, Entrée/Espace active les boutons)

Structure de fichier à émettre :
- `ComponentName.tsx` — implémentation du composant
- `ComponentName.test.tsx` — tests unitaires RTL couvrant : rendu, transmission des props, interaction au clavier, accessibilité via `@testing-library/jest-dom`
- `ComponentName.stories.tsx` — histoire Storybook CSF3 avec au moins une histoire par défaut et une histoire de variante

Avant d'écrire, scanner le dépôt pour :
- Les modèles de composants existants à faire correspondre (nommage, disposition des fichiers, style d'importation)
- Les fichiers de tokens de conception ou de thème pour en extraire les couleurs/espacements
- La configuration de test existante (config jest, utilitaires de test, wrappers de rendu)

Ne pas inventer un système de conception — correspondre à ce qui existe déjà dans la base de code. S'il n'en existe pas, utiliser un balisage minimaliste non stylisé et noter que le style est laissé au consommateur.
