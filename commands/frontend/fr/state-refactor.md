---
description: Refactoriser la gestion d'état des composants pour réduire la complexité, élever/colocaliser correctement et éliminer le prop drilling
argument-hint: "[file-or-component-name]"
---
Refactoriser la gestion d'état dans : $ARGUMENTS

Lisez le fichier cible (et ses consommateurs immédiats si identifiables) avant de proposer des modifications.

**Étape 1 — Classifier l'état existant**
Pour chaque `useState`, `useReducer`, `useRef`, `useContext`, ou sélecteur de store trouvé, étiquetez-le :
- `local` — utilisé uniquement dans ce composant
- `shared` — passé en tant que props à 2+ enfants
- `derived` — peut être calculé à partir d'un autre état ou des props, n'a pas besoin d'être stocké
- `server` — données provenant d'une API et qui devraient vivre dans un cache de requête, pas dans l'état du composant
- `url` — état qui appartient à l'URL (filtres, pagination, IDs sélectionnés)

**Étape 2 — Identifier les problèmes**
- Prop drilling : props passés à travers 2+ composants intermédiaires qui ne les utilisent pas → candidat pour un contexte ou une colocalisation
- État dérivé stocké comme `useState` qui est défini à l'intérieur d'un `useEffect` → remplacer par `useMemo` ou calcul en ligne
- État qui se réinitialise à chaque rendu car l'initialiseur est recréé (littéral objet/tableau dans l'appel useState) → stabiliser avec un initialiseur `useRef` ou une constante au niveau du module
- État redondant qui duplique les props ou peut être calculé à partir d'un autre état
- Closures obsolètes : `useEffect` manquant les dépendances ou utilisant `deps: []` avec des références à des valeurs mutables

**Étape 3 — Appliquer les refactorisations**
Ordre de priorité :
1. Supprimer d'abord l'état dérivé — simplification pure, zéro risque
2. Colocaliser l'état qui a été élevé plus haut que nécessaire — le ramener au composant feuille qui le possède
3. Élever l'état qui est véritablement partagé — le déplacer au plus proche ancêtre commun, pas arbitrairement plus haut
4. Remplacer les chaînes de prop drilling par un contexte étroit (pas un store global) limité au sous-arbre qui en a besoin
5. Déplacer les données du serveur vers la bibliothèque de requête existante (React Query, SWR, RTK Query — utilisez celle qui est déjà dans le projet)
6. Déplacer l'état en forme d'URL vers le routeur (Next.js `useSearchParams`, React Router `useSearchParams`)

**Étape 4 — Output**
Appliquer tous les changements directement aux fichiers. Après les modifications, résumez :
- Variables d'état supprimées : N
- Props éliminées des composants intermédiaires : N
- Appels `useEffect` supprimés : N
- Toute décision architecturale qui nécessite une sensibilisation de l'équipe (par exemple, nouveau contexte introduit)

N'ajoutez pas de bibliothèque de gestion d'état qui n'est pas déjà dans le projet.
