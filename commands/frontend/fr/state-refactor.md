---
description: Refactorisez la gestion d'état des composants pour réduire la complexité, fusionner/localiser correctement et éliminer le forage de props
argument-hint: "[file-or-component-name]"
---
Refactorisez la gestion d'état dans: $ARGUMENTS

Lisez le fichier cible (et ses consommateurs immédiats s'ils sont identifiables) avant de proposer des modifications.

**Étape 1 — Classifiez l'état existant**
Pour chaque `useState`, `useReducer`, `useRef`, `useContext` ou sélecteur de store trouvé, étiquetez-le:
- `local` — utilisé uniquement dans ce composant
- `shared` — passé en tant que props à 2+ enfants
- `derived` — peut être calculé à partir d'un autre état ou de props, n'a pas besoin d'être stocké
- `server` — données provenant d'une API et qui doivent vivre dans un cache de requête, pas dans l'état du composant
- `url` — état qui appartient à l'URL (filtres, pagination, IDs sélectionnés)

**Étape 2 — Identifiez les problèmes**
- Forage de props: props passées via 2+ composants intermédiaires qui ne les utilisent pas → candidate pour un contexte ou une colocalisation
- État dérivé stocké en tant que `useState` qui est défini à l'intérieur de `useEffect` → remplacez par `useMemo` ou calcul inline
- État qui se réinitialise à chaque rendu parce que l'initialiseur est recréé (littéral objet/tableau dans l'appel useState) → stabilisez avec un initialiseur `useRef` ou une constante au niveau du module
- État redondant qui duplique les props ou peut être calculé à partir d'un autre état
- Fermetures obsolètes: `useEffect` manquant des dépendances ou utilisant `deps: []` avec des références à des valeurs mutables

**Étape 3 — Appliquez les refactorisations**
Ordre de priorité:
1. Supprimez d'abord l'état dérivé — simplification pure, zéro risque
2. Colocalisez l'état qui a été levé plus haut que nécessaire — déplacez-le vers le composant feuille qui le possède
3. Levez l'état qui est réellement partagé — déplacez vers l'ancêtre commun le plus bas, pas arbitrairement plus haut
4. Remplacez les chaînes de forage de props par un contexte étroit (pas un store global) limité au sous-arbre qui en a besoin
5. Déplacez les données serveur vers la bibliothèque de requête existante (React Query, SWR, RTK Query — utilisez celle qui est déjà dans le projet)
6. Déplacez l'état de type URL vers le routeur (Next.js `useSearchParams`, React Router `useSearchParams`)

**Étape 4 — Sortie**
Appliquez tous les changements directement aux fichiers. Après les modifications, résumez:
- Variables d'état supprimées: N
- Props supprimées des composants intermédiaires: N
- Appels `useEffect` supprimés: N
- Toute décision architecturale qui nécessite une prise de conscience de l'équipe (par exemple, nouveau contexte introduit)

N'ajoutez pas une bibliothèque de gestion d'état qui n'est pas déjà dans le projet.
