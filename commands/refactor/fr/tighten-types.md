---
description: Renforcer les annotations de type faibles ou manquantes dans un fichier
argument-hint: "[file]"
---
Resserrez les types dans $ARGUMENTS.

1. Lisez le fichier. Identifiez chaque endroit où les types sont plus faibles qu'ils ne devraient l'être :
   - `any` en TypeScript — remplacez par le type le plus étroit correct, une union, ou un générique
   - Paramètres de fonction ou valeurs de retour sans type
   - Types trop larges (`object`, `Record<string, any>`, `dict`, `interface{}`) où une forme concrète est connue
   - Optionnel (`T | undefined`, `T | None`) utilisé là où la valeur est toujours présente
   - Non-optionnel utilisé là où la valeur peut légitimement être absente — ajoutez l'optionnel et gérez-le aux sites d'appel
   - Énumérations ou types union qui pourraient remplacer les littéraux `string` ou `number` nus
   - Casts `as` / assertions de type qui pourraient être remplacés par un véritable narrowing de type ou des gardes

2. Pour chaque type faible trouvé :
   - Déduisez le type correct à partir de l'utilisation, du contexte environnant et de toute documentation existante
   - Appliquez le type plus étroit au site de déclaration
   - Corrigez toute erreur de type en aval que le resserrement expose — ne laissez pas de sites d'appel cassés
   - Si le resserrement nécessite un nouvel alias de type ou une interface, définissez-le près du haut du fichier (ou dans un fichier de types existant si le projet en a un)

3. Ne changez pas le comportement à l'exécution. Changements de type uniquement.

4. N'ajoutez pas de types juste pour ajouter des types — si le type d'une variable locale est évident à partir d'une assignation littérale et le langage l'infère correctement, laissez l'inférence seule.

5. Si le type de retour d'une fonction est actuellement inféré et l'inférence est correcte et stable, laissez-le. N'annotez que là où le type inféré est trop large ou susceptible de dériver.

6. Après toutes les modifications, vérifiez que le fichier passerait conceptuellement le vérificateur de type du projet (`tsc --noEmit`, `mypy`, `cargo check`, etc.). Si vous ne pouvez pas vérifier, signalez tout changement qui pourrait introduire une erreur de type.

7. Résultat : liste de tous les types resserrés, type original, nouveau type et localisation.
