> 🇫🇷 This is the French translation. [English version](../typescript.md).

# Règles TypeScript

## S'applique à
Tous les fichiers TypeScript (`*.ts`, `*.tsx`) dans n'importe quel projet.

## Règles

1. **`strict: true` dans `tsconfig.json`** — toujours. Cela active `strictNullChecks`, `noImplicitAny` et `strictFunctionTypes`. Ne jamais désactiver le mode strict pour faire taire des erreurs ; corriger les types.

2. **`unknown` plutôt que `any` pour les données externes non typées** — `any` désactive complètement la vérification de type. `unknown` vous oblige à restreindre le type avant utilisation. Analyser les données externes avec Zod ou similaire.

3. **Opérateur `satisfies` pour les littéraux d'objets vérifiés par type** — `const config = { port: 3000 } satisfies Config` détecte les erreurs de type tout en préservant le type littéral (sans l'élargir à `Config`).

4. **Unions discriminées plutôt que champs nullable** — préférer :
   ```ts
   type Result = { status: "ok"; data: User } | { status: "error"; message: string }
   ```
   plutôt que `{ data?: User; error?: string }`. Les unions discriminées permettent une vérification exhaustive avec `switch`.

5. **Pas d'assertions de type `as` dans le code de production** — `as SomeType` fait taire le compilateur sans vérifier. Utiliser des prédicats de type ou `satisfies` à la place. Exception : requêtes DOM où TypeScript ne peut pas inférer mieux.

6. **Prédicats de type pour la restriction** — `function isUser(v: unknown): v is User { return typeof v === "object" && v !== null && "email" in v }`.

7. **`interface` pour les formes d'objets, `type` pour les unions et les alias** — `interface` supporte `extends` et la fusion de déclarations. `type` est nécessaire pour les unions et les types mappés.

8. **Assertions `const` pour les types littéraux** — `const ROLES = ["admin", "user"] as const` donne le type `readonly ["admin", "user"]` plutôt que `string[]`.

9. **Ne jamais utiliser le type `Function`** — utiliser des signatures spécifiques : `(event: MouseEvent) => void`. `Function` accepte tout et retourne tout.

10. **Zod pour la validation à l'exécution des données externes** — corps de requêtes HTTP, réponses API, variables d'env, fichiers de config. Les types TypeScript ne sont que temps de compilation ; Zod valide à l'exécution :
    ```ts
    const UserSchema = z.object({ email: z.string().email(), age: z.number().int().positive() })
    const user = UserSchema.parse(req.body)  // lève ZodError si invalide
    ```

11. **`readonly` sur les tableaux et objets qui ne doivent pas être mutés** — `readonly string[]` empêche push/splice. `Readonly<Config>` sur les objets de config passés à travers les couches.

12. **Types de retour explicites sur les fonctions publiques/exportées** — aide à la lisibilité et détecte les changements accidentels de type de retour.

13. **`import type` pour les imports uniquement de type** — `import type { User } from './types'` est effacé à l'exécution et évite les problèmes de dépendances circulaires.

14. **`never` pour assurer une gestion exhaustive** — dans le cas par défaut d'un switch sur une union discriminée :
    ```ts
    default:
      const _exhaustive: never = status  // erreur de compilation si un cas manque
      throw new Error(`Unhandled: ${_exhaustive}`)
    ```

15. **Activer `noUncheckedIndexedAccess`** — l'accès par index aux tableaux et objets retourne `T | undefined` plutôt que `T`, forçant les vérifications null là où elles sont nécessaires.


---
