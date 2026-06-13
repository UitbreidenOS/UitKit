---
description: Générer un composant React typé, accessible avec une interface de props et des tests basiques
argument-hint: "[ComponentName] [variant: functional|compound] [framework: react|next]"
---
Générer un composant React prêt pour la production basé sur : $ARGUMENTS

Analyser les arguments :
- Le premier token est le nom du composant en PascalCase
- Variante optionnelle `functional` (défaut) ou `compound`
- Optionnel `react` (défaut) ou `next` pour les patterns spécifiques au framework

Exigences :
1. TypeScript avec interface Props explicite — pas de `any`, pas de types implicites
2. Exporter uniquement avec named export — pas d'export par défaut
3. Les Props doivent inclure `className?: string` pour l'extension de style et `children?: React.ReactNode` si le composant est un conteneur
4. Utiliser `forwardRef` si le composant enveloppe un élément DOM natif
5. Variante compound : exposer les sous-composants comme propriétés statiques (ex. `Card.Header`, `Card.Body`)
6. Pas de styles inline — utiliser les CSS Modules ou les classes utilitaires Tailwind selon ce qui existe déjà dans le projet
7. Les rôles et attributs ARIA doivent être corrects pour le type de composant (button, dialog, listbox, etc.)
8. Support de la navigation au clavier le cas échéant (Escape ferme les overlays, Enter/Space active les boutons)

Structure de fichier à émettre :
- `ComponentName.tsx` — implémentation du composant
- `ComponentName.test.tsx` — tests unitaires RTL couvrant : rendu, propagation des props, interaction au clavier, accessibilité via `@testing-library/jest-dom`
- `ComponentName.stories.tsx` — histoire Storybook CSF3 avec au moins un story Default et un story variant

Avant d'écrire, analyser le repo pour :
- Les patterns de composants existants à reproduire (nommage, disposition des fichiers, style d'import)
- Les fichiers de tokens de design ou de thème pour extraire les couleurs/espacements
- La configuration de test existante (config jest, utilitaires de test, wrappers de rendu)

Ne pas inventer un système de design — reproduire ce qui existe déjà dans la base de code. S'il n'en existe aucun, utiliser un balisage minimal non stylisé et noter que le style est laissé au consommateur.
