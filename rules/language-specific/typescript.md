# TypeScript Rules

## Apply to
All TypeScript files (`*.ts`, `*.tsx`) in any project.

## Rules

1. **`strict: true` in `tsconfig.json`** — always. This enables `strictNullChecks`, `noImplicitAny`, and `strictFunctionTypes`. Never disable strict mode to silence errors; fix the types.

2. **`unknown` over `any` for untyped external data** — `any` disables type checking entirely. `unknown` forces you to narrow the type before use. Parse external data with Zod or similar.

3. **`satisfies` operator for type-checked object literals** — `const config = { port: 3000 } satisfies Config` catches type errors while preserving the literal type (not widening to `Config`).

4. **Discriminated unions over nullable fields** — prefer:
   ```ts
   type Result = { status: "ok"; data: User } | { status: "error"; message: string }
   ```
   over `{ data?: User; error?: string }`. Discriminated unions make exhaustive `switch` checking possible.

5. **No `as` type assertions in production code** — `as SomeType` silences the compiler without checking. Use type predicates or `satisfies` instead. Exception: DOM queries where TypeScript can't infer better.

6. **Type predicates for narrowing** — `function isUser(v: unknown): v is User { return typeof v === "object" && v !== null && "email" in v }`.

7. **`interface` for object shapes, `type` for unions and aliases** — `interface` supports `extends` and declaration merging. `type` is needed for unions and mapped types.

8. **`const` assertions for literal types** — `const ROLES = ["admin", "user"] as const` gives type `readonly ["admin", "user"]` instead of `string[]`.

9. **Never use the `Function` type** — use specific signatures: `(event: MouseEvent) => void`. `Function` accepts anything and returns anything.

10. **Zod for runtime validation of external data** — HTTP request bodies, API responses, env vars, config files. TypeScript types are compile-time only; Zod validates at runtime:
    ```ts
    const UserSchema = z.object({ email: z.string().email(), age: z.number().int().positive() })
    const user = UserSchema.parse(req.body)  // throws ZodError if invalid
    ```

11. **`readonly` on arrays and objects that shouldn't be mutated** — `readonly string[]` prevents push/splice. `Readonly<Config>` on config objects passed through layers.

12. **Explicit return types on public/exported functions** — aids readability and catches accidental return type changes.

13. **`import type` for type-only imports** — `import type { User } from './types'` is erased at runtime and avoids circular dependency issues.

14. **`never` to ensure exhaustive handling** — in the default case of a switch over a discriminated union:
    ```ts
    default:
      const _exhaustive: never = status  // compile error if a case is missing
      throw new Error(`Unhandled: ${_exhaustive}`)
    ```

15. **Enable `noUncheckedIndexedAccess`** — array and object index access returns `T | undefined` instead of `T`, forcing null checks where they're needed.


---
