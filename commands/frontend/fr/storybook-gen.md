---
description: Générer des stories Storybook CSF3 pour un composant couvrant tous les variants et états significatifs
argument-hint: "[ComponentFile.tsx]"
---
Générer des stories Storybook pour : $ARGUMENTS

Lire le fichier du composant avant d'écrire quoi que ce soit. Extraire l'interface des props, les variants et l'état de la source.

**Étape 1 — Analyser le composant**
Identifier :
- Tous les props et leurs types (drapeaux booléens, littéraux de chaîne union, optionnels vs requis)
- Le comportement contrôlé vs non contrôlé (accepte-t-il `value`/`onChange` ?)
- Les états de chargement, erreur, vide et désactivé s'ils existent
- Tous les sous-composants composés qui doivent être démontrés ensemble

**Étape 2 — Déterminer la couverture des stories**
Générer des stories pour :
1. `Default` — props requis minimaux, pas d'extras optionnels
2. Une story par prop booléen significatif qui change le rendu visible (par exemple, `isDisabled`, `isLoading`, `isError`)
3. Une story par variant de chaîne union (par exemple, `variant: "primary" | "secondary" | "danger"`)
4. `AllVariants` — une seule story rendant tous les variants côte à côte en utilisant une fonction render avec un wrapper flex/grid, utile pour les régressions visuelles
5. Une story d'état contrôlé si le composant accepte `value`/`onChange` — utiliser `useState` à l'intérieur de la fonction `render`
6. Cas limites : chaîne vide, débordement de texte très long, compte zéro, données optionnelles null/undefined — seulement si le composant est susceptible de les rencontrer

Ne pas générer de stories pour les détails d'implémentation interne ou les props qui affectent uniquement l'ergonomie des développeurs.

**Étape 3 — Écrire le fichier de story**
Règles de formatage :
- Utiliser CSF3 (`export default { ... }` objet meta + exports de story nommés)
- `satisfies Meta<typeof Component>` pour le type meta
- `satisfies StoryObj<typeof Component>` pour chaque story
- `args` au niveau meta pour les valeurs par défaut partagées ; remplacer par story seulement ce qui change
- Utiliser `argTypes` pour documenter les props union avec `control: { type: 'select' }`
- Importer le composant avec le même chemin d'import utilisé ailleurs dans le projet (vérifier les imports existants)
- Décorateurs : ajouter uniquement un décorateur `padding` si le composant le nécessite visuellement — ne pas envelopper dans des fournisseurs inutiles à moins que le composant n'ait explicitement besoin de contexte

**Étape 4 — Tests d'interaction (si @storybook/test est disponible)**
Pour la story `Default`, ajouter une fonction `play` qui :
- Vérifie que le composant se rend sans erreur
- Simule l'interaction utilisateur principale (clic, saisie, sélection)
- Affirme le résultat DOM attendu avec `expect()`

Fichier de sortie : placer le fichier de story adjacent au composant (`ComponentName.stories.tsx`). Ne pas créer de répertoire `__stories__` séparé à moins qu'il n'existe déjà.
