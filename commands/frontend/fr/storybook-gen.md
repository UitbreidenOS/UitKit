---
description: Générer des histoires Storybook CSF3 pour un composant couvrant toutes les variantes et états significatifs
argument-hint: "[ComponentFile.tsx]"
---
Générer des histoires Storybook pour : $ARGUMENTS

Lisez le fichier de composant avant d'écrire quoi que ce soit. Extrayez l'interface des props, les variantes et l'état de la source.

**Étape 1 — Analyser le composant**
Identifiez :
- Tous les props et leurs types (drapeaux booléens, littéraux de chaîne union, facultatifs vs obligatoires)
- Comportement contrôlé vs non contrôlé (accepte-t-il `value`/`onChange` ?)
- États de chargement, erreur, vide et désactivé s'ils existent
- Tous les sous-composants composites qui doivent être démontrés ensemble

**Étape 2 — Déterminer la couverture des histoires**
Générez des histoires pour :
1. `Default` — props minimaux requis, pas d'extras facultatifs
2. Une histoire par prop booléen significatif qui change la sortie visible (par exemple, `isDisabled`, `isLoading`, `isError`)
3. Une histoire par variante d'union de chaîne (par exemple, `variant: "primary" | "secondary" | "danger"`)
4. `AllVariants` — une seule histoire rendant toutes les variantes côte à côte en utilisant une fonction de rendu avec un wrapper flex/grid, utile pour la régression visuelle
5. Une histoire d'état contrôlé si le composant accepte `value`/`onChange` — utilisez `useState` à l'intérieur de la fonction `render`
6. Cas limites : chaîne vide, débordement de texte très long, nombre zéro, données facultatives null/undefined — seulement si le composant est susceptible de les rencontrer

Ne générez pas d'histoires pour les détails d'implémentation interne ou les props qui n'affectent que l'ergonomie des développeurs.

**Étape 3 — Écrivez le fichier d'histoires**
Règles de format :
- Utilisez CSF3 (objet meta `export default { ... }` + exports d'histoires nommées)
- `satisfies Meta<typeof Component>` pour le type meta
- `satisfies StoryObj<typeof Component>` pour chaque histoire
- `args` au niveau meta pour les défauts partagés ; remplacez par histoire seulement ce qui change
- Utilisez `argTypes` pour documenter les props union avec `control: { type: 'select' }`
- Importez le composant avec le même chemin d'importation utilisé ailleurs dans le projet (vérifiez les importations existantes)
- Décorateurs : n'ajoutez un décorateur `padding` que si le composant en a visuellement besoin — ne l'enveloppez pas dans des fournisseurs inutiles à moins que le composant n'ait explicitement besoin de contexte

**Étape 4 — Tests d'interaction (si @storybook/test est disponible)**
Pour l'histoire `Default`, ajoutez une fonction `play` qui :
- Vérifie que le composant s'affiche sans erreur
- Simule l'interaction utilisateur principale (clic, saisie, sélection)
- Affirme le résultat DOM attendu avec `expect()`

Fichier de sortie : placez le fichier d'histoire adjacent au composant (`ComponentName.stories.tsx`). Ne créez pas de répertoire séparé `__stories__` à moins qu'il n'existe déjà.
