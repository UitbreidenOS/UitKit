---
description: Renforcer les annotations de types faibles ou manquantes dans un fichier
argument-hint: "[file]"
---
Resserrer les types dans $ARGUMENTS.

1. Lisez le fichier. Identifiez chaque endroit où les types sont plus faibles qu'ils ne devraient l'être :
   - `any` en TypeScript — remplacez par le type le plus étroit correct, une union, ou un générique
   - Paramètres de fonction ou valeurs de retour non typés
   - Types trop larges (`object`, `Record<string, any>`, `dict`, `interface{}`) où une forme concrète est connue
   - Optionnel (`T | undefined`, `T | None`) utilisé là où la valeur est toujours présente
   - Non-optionnel utilisé là où la valeur peut légitimement être absente — ajoutez l'optionnel et gérez-le aux sites d'appel
   - Les énumérations ou les types d'union qui pourraient remplacer les littéraux `string` ou `number` nus
   - Les casts `as` / assertions de type qui pourraient être remplacés par un véritable narrowing de type ou des gardes

2. Pour chaque type faible trouvé :
   - Déduisez le type correct à partir de l'utilisation, du contexte environnant et de toute documentation existante
   - Appliquez le type plus resserré au site de déclaration
   - Corrigez les erreurs de type en aval que le resserrement expose — ne laissez pas de sites d'appel cassés
   - Si le resserrement nécessite un nouvel alias de type ou une nouvelle interface, définissez-le près du haut du fichier (ou dans un fichier de types existant si le projet en a un)

3. Ne modifiez pas le comportement à l'exécution. Les modifications de type uniquement.

4. N'ajoutez pas de types juste pour ajouter des types — si le type d'une variable locale est évident à partir d'une affectation de littéral et le langage le déduit correctement, laissez l'inférence seule.

5. Si le type de retour d'une fonction est actuellement déduit et que l'inférence est correcte et stable, laissez-le. Annotez uniquement là où le type déduit est trop large ou susceptible de dériver.

6. Après tous les changements, vérifiez que le fichier passerait le vérificateur de type du projet (`tsc --noEmit`, `mypy`, `cargo check`, etc.) conceptuellement. Si vous ne pouvez pas vérifier, signalez tout changement qui pourrait introduire une erreur de type.

7. Résultat : liste de chaque type resserré, type original, nouveau type et emplacement.
