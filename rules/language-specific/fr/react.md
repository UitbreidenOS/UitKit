# Règles React

## S'applique à
Tous les fichiers React (`*.tsx`, `*.jsx`) dans n'importe quel projet.

## Règles

1. **Un composant par fichier** — nommez le fichier d'après le composant. `UserCard.tsx` exporte `UserCard`. Les fichiers barrel (`index.ts`) sont acceptables pour réexporter, pas pour colocaliser plusieurs composants.

2. **Préférez les composants fonctionnels avec hooks aux composants de classe** — les composants de classe sont hérités. La seule raison valide d'utiliser un composant de classe est une error boundary basée sur les classes.

3. **Limitez les composants à ~150 lignes** — si un composant nécessite plus, extrayez des sous-composants ou déplacez la logique dans des hooks personnalisés. Les composants longs violent le principe de responsabilité unique.

4. **Levez l'état au plus proche ancêtre commun — pas plus haut** — ne remontez pas l'état vers un parent juste parce que c'est pratique. L'état global (Context, Zustand, etc.) est pour les données véritablement globales : auth, theme, locale.

5. **Hooks personnalisés pour la logique, composants pour le rendu** — la récupération de données, l'état dérivé, la gestion d'événements appartiennent aux hooks `use*`, pas en ligne dans JSX. Le corps du composant devrait être principalement du JSX.

6. **Ne mutez jamais l'état directement** — retournez toujours de nouveaux objets/arrays. `setState(prev => ({ ...prev, key: value }))` et non `state.key = value; setState(state)`.

7. **Spécifiez les clés sur les éléments de liste — n'utilisez jamais l'index du array comme clé pour les listes dynamiques** — les clés d'index cassent la réconciliation lorsque les éléments se réorganisent ou sont insérés/supprimés. Utilisez des IDs stables et uniques.

8. **Mémoïsez correctement ou pas du tout** — `useMemo` et `useCallback` ajoutent une surcharge. Utilisez-les lorsqu'un calcul est véritablement coûteux ou lorsqu'un changement d'identité de référence provoque des re-rendus inutiles des enfants. Testez avant d'ajouter.

9. **Collocalisez l'état, les effects et leur UI** — ne dispersez pas l'état connexe en haut d'un fichier. Groupez les paires `useState`/`useEffect` près du JSX qu'ils affectent, ou extrayez dans un hook.

10. **Évitez `useEffect` pour l'état dérivé** — si une valeur peut être calculée à partir de l'état/props existant de manière synchrone, calculez-la en ligne. `useEffect` pour l'état dérivé introduit un cycle de rendu et une fenêtre de lecture obsolète.

11. **Typez toutes les props avec les interfaces TypeScript, pas `any`** — `React.FC<Props>` est optionnel ; typer le paramètre directement (`({ name }: Props) => ...`) est tout aussi valide et évite le piège implicite `children` de `FC`.

12. **Gérez explicitement les états de chargement, erreur et vide** — chaque UI pilotée par async a trois chemins non-heureux. Rendez-les intentionnellement, pas par défaut.

13. **Gardez les tableaux de dépendances `useEffect` précis** — `eslint-plugin-react-hooks` applique cela. Ne supprimez jamais l'avertissement exhaustive-deps sans un commentaire expliquant pourquoi.

14. **Évitez le prop drilling au-delà de deux niveaux** — passez via Context ou un gestionnaire d'état. Trois niveaux de threading de props est le signe d'une abstraction manquante.

15. **Testez le comportement, pas l'implémentation** — utilisez React Testing Library. Affirmez sur ce que l'utilisateur voit et peut interagir, pas sur l'état interne ou la structure de l'arbre des composants.


---
