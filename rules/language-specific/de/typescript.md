> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../typescript.md).

# TypeScript Regeln

## Anwenden auf
Alle TypeScript-Dateien (`*.ts`, `*.tsx`) in jedem Projekt.

## Regeln

1. **`strict: true` in `tsconfig.json`** — immer. Dies aktiviert `strictNullChecks`, `noImplicitAny` und `strictFunctionTypes`. Den Strict-Modus niemals deaktivieren, um Fehler zu unterdrücken; die Typen korrigieren.

2. **`unknown` statt `any` für ungetypte externe Daten** — `any` deaktiviert die Typprüfung vollständig. `unknown` erzwingt die Einschränkung des Typs vor der Verwendung. Externe Daten mit Zod oder ähnlichem parsen.

3. **`satisfies`-Operator für typgeprüfte Objekt-Literale** — `const config = { port: 3000 } satisfies Config` fängt Typfehler ab, während der Literal-Typ erhalten bleibt (keine Erweiterung auf `Config`).

4. **Diskriminierte Unions statt nullbarer Felder** — bevorzugen:
   ```ts
   type Result = { status: "ok"; data: User } | { status: "error"; message: string }
   ```
   statt `{ data?: User; error?: string }`. Diskriminierte Unions ermöglichen erschöpfende `switch`-Prüfung.

5. **Keine `as`-Typ-Assertions in Produktionscode** — `as SomeType` bringt den Compiler zum Schweigen ohne zu prüfen. Typ-Prädikate oder `satisfies` stattdessen verwenden. Ausnahme: DOM-Abfragen, wo TypeScript nicht besser inferieren kann.

6. **Typ-Prädikate für Einschränkung** — `function isUser(v: unknown): v is User { return typeof v === "object" && v !== null && "email" in v }`.

7. **`interface` für Objektformen, `type` für Unions und Aliase** — `interface` unterstützt `extends` und Deklarations-Merging. `type` wird für Unions und gemappte Typen benötigt.

8. **`const`-Assertions für Literal-Typen** — `const ROLES = ["admin", "user"] as const` gibt Typ `readonly ["admin", "user"]` statt `string[]`.

9. **Niemals den `Function`-Typ verwenden** — spezifische Signaturen verwenden: `(event: MouseEvent) => void`. `Function` akzeptiert alles und gibt alles zurück.

10. **Zod für Laufzeitvalidierung externer Daten** — HTTP-Request-Bodies, API-Antworten, Env-Vars, Konfigurationsdateien. TypeScript-Typen gelten nur zur Kompilierzeit; Zod validiert zur Laufzeit:
    ```ts
    const UserSchema = z.object({ email: z.string().email(), age: z.number().int().positive() })
    const user = UserSchema.parse(req.body)  // wirft ZodError wenn ungültig
    ```

11. **`readonly` auf Arrays und Objekten, die nicht verändert werden sollen** — `readonly string[]` verhindert push/splice. `Readonly<Config>` auf Konfigurationsobjekten, die durch Schichten weitergegeben werden.

12. **Explizite Rückgabetypen auf öffentlichen/exportierten Funktionen** — verbessert Lesbarkeit und erkennt versehentliche Rückgabetyp-Änderungen.

13. **`import type` für nur-Typ-Imports** — `import type { User } from './types'` wird zur Laufzeit gelöscht und vermeidet zirkuläre Abhängigkeitsprobleme.

14. **`never` zur erschöpfenden Behandlung** — im Default-Fall eines Switch über eine diskriminierte Union:
    ```ts
    default:
      const _exhaustive: never = status  // Kompilierfehler wenn ein Fall fehlt
      throw new Error(`Unhandled: ${_exhaustive}`)
    ```

15. **`noUncheckedIndexedAccess` aktivieren** — Array- und Objekt-Indexzugriff gibt `T | undefined` statt `T` zurück, was Null-Prüfungen erzwingt, wo sie benötigt werden.


---
