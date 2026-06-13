> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../typescript.md).

# Reglas de TypeScript

## Aplicar a
Todos los archivos TypeScript (`*.ts`, `*.tsx`) en cualquier proyecto.

## Reglas

1. **`strict: true` en `tsconfig.json`** — siempre. Esto habilita `strictNullChecks`, `noImplicitAny` y `strictFunctionTypes`. Nunca deshabilites el modo estricto para silenciar errores; corrige los tipos.

2. **`unknown` sobre `any` para datos externos sin tipo** — `any` deshabilita la verificación de tipos completamente. `unknown` te obliga a reducir el tipo antes de usarlo. Parsea datos externos con Zod o similar.

3. **Operador `satisfies` para literales de objeto con verificación de tipos** — `const config = { port: 3000 } satisfies Config` detecta errores de tipo mientras preserva el tipo literal (sin ampliar a `Config`).

4. **Unions discriminadas sobre campos nullable** — prefiere:
   ```ts
   type Result = { status: "ok"; data: User } | { status: "error"; message: string }
   ```
   sobre `{ data?: User; error?: string }`. Las unions discriminadas hacen posible la verificación exhaustiva con `switch`.

5. **Sin aserciones de tipo `as` en código de producción** — `as SomeType` silencia al compilador sin verificar. Usa predicados de tipo o `satisfies` en su lugar. Excepción: consultas DOM donde TypeScript no puede inferir mejor.

6. **Predicados de tipo para reducción** — `function isUser(v: unknown): v is User { return typeof v === "object" && v !== null && "email" in v }`.

7. **`interface` para formas de objetos, `type` para unions y aliases** — `interface` soporta `extends` y fusión de declaraciones. `type` es necesario para unions y tipos mapeados.

8. **Aserciones `const` para tipos literales** — `const ROLES = ["admin", "user"] as const` da el tipo `readonly ["admin", "user"]` en lugar de `string[]`.

9. **Nunca uses el tipo `Function`** — usa firmas específicas: `(event: MouseEvent) => void`. `Function` acepta cualquier cosa y devuelve cualquier cosa.

10. **Zod para validación en tiempo de ejecución de datos externos** — cuerpos de solicitudes HTTP, respuestas de API, variables de entorno, archivos de configuración. Los tipos de TypeScript son solo en tiempo de compilación; Zod valida en tiempo de ejecución:
    ```ts
    const UserSchema = z.object({ email: z.string().email(), age: z.number().int().positive() })
    const user = UserSchema.parse(req.body)  // lanza ZodError si es inválido
    ```

11. **`readonly` en arrays y objetos que no deben mutarse** — `readonly string[]` previene push/splice. `Readonly<Config>` en objetos de configuración pasados a través de capas.

12. **Tipos de retorno explícitos en funciones públicas/exportadas** — ayuda a la legibilidad y detecta cambios accidentales en el tipo de retorno.

13. **`import type` para importaciones solo de tipos** — `import type { User } from './types'` se elimina en tiempo de ejecución y evita problemas de dependencia circular.

14. **`never` para asegurar el manejo exhaustivo** — en el caso por defecto de un switch sobre una union discriminada:
    ```ts
    default:
      const _exhaustive: never = status  // error de compilación si falta un caso
      throw new Error(`Unhandled: ${_exhaustive}`)
    ```

15. **Habilita `noUncheckedIndexedAccess`** — el acceso a arrays y objetos por índice devuelve `T | undefined` en lugar de `T`, forzando verificaciones de null donde se necesitan.


---
