> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../typescript.md).

# TypeScript-regels

## Van toepassing op
Alle TypeScript-bestanden (`*.ts`, `*.tsx`) in elk project.

## Regels

1. **`strict: true` in `tsconfig.json`** — altijd. Dit schakelt `strictNullChecks`, `noImplicitAny` en `strictFunctionTypes` in. Schakel strict-modus nooit uit om fouten te onderdrukken; herstel de typen.

2. **`unknown` boven `any` voor ongetypeerde externe data** — `any` schakelt typecontrole volledig uit. `unknown` dwingt je het type te vernauwen voor gebruik. Parseer externe data met Zod of vergelijkbaar.

3. **`satisfies`-operator voor gecontroleerde objectliteralen** — `const config = { port: 3000 } satisfies Config` vangt typefouten terwijl het letterlijke type behouden blijft (niet verbreed naar `Config`).

4. **Gediscrimineerde unions boven nullable velden** — geef de voorkeur aan:
   ```ts
   type Result = { status: "ok"; data: User } | { status: "error"; message: string }
   ```
   boven `{ data?: User; error?: string }`. Gediscrimineerde unions maken uitputtende `switch`-controle mogelijk.

5. **Geen `as`-typebeweringen in productiecode** — `as SomeType` maakt de compiler stil zonder te controleren. Gebruik type-predicaten of `satisfies` in plaats daarvan. Uitzondering: DOM-queries waarbij TypeScript niet beter kan afleiden.

6. **Type-predicaten voor vernauwen** — `function isUser(v: unknown): v is User { return typeof v === "object" && v !== null && "email" in v }`.

7. **`interface` voor objectvormen, `type` voor unions en aliassen** — `interface` ondersteunt `extends` en declaratiesamenvoegen. `type` is nodig voor unions en gemapte typen.

8. **`const`-beweringen voor letterlijke typen** — `const ROLES = ["admin", "user"] as const` geeft type `readonly ["admin", "user"]` in plaats van `string[]`.

9. **Gebruik nooit het `Function`-type** — gebruik specifieke signaturen: `(event: MouseEvent) => void`. `Function` accepteert alles en retourneert alles.

10. **Zod voor runtime-validatie van externe data** — HTTP-verzoekbodies, API-antwoorden, omgevingsvariabelen, configuratiebestanden. TypeScript-typen zijn alleen compilatie-tijd; Zod valideert tijdens runtime:
    ```ts
    const UserSchema = z.object({ email: z.string().email(), age: z.number().int().positive() })
    const user = UserSchema.parse(req.body)  // gooit ZodError als ongeldig
    ```

11. **`readonly` op arrays en objecten die niet gemuteerd mogen worden** — `readonly string[]` voorkomt push/splice. `Readonly<Config>` op configuratieobjecten die door lagen worden doorgegeven.

12. **Expliciete retourtypen op publieke/geëxporteerde functies** — bevordert leesbaarheid en vangt onbedoelde retourtype-wijzigingen.

13. **`import type` voor alleen-type imports** — `import type { User } from './types'` wordt gewist tijdens runtime en vermijdt circulaire afhankelijkheidsproblemen.

14. **`never` om uitputtende afhandeling te garanderen** — in het standaardgeval van een switch over een gediscrimineerde union:
    ```ts
    default:
      const _exhaustive: never = status  // compilatiefout als een geval ontbreekt
      throw new Error(`Unhandled: ${_exhaustive}`)
    ```

15. **Schakel `noUncheckedIndexedAccess` in** — array- en objectindextoegang retourneert `T | undefined` in plaats van `T`, waardoor null-controles worden afgedwongen waar nodig.


---
