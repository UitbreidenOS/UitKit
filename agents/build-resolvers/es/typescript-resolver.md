> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../typescript-resolver.md).

# Agente Resolvedor de Builds TypeScript

## Propósito
Diagnostica y corrige errores de compilación de TypeScript, incompatibilidades de tipos y fallos de `tsc` — devolviendo código corregido con una explicación de lo que estaba mal.

## Orientación sobre el modelo
**Haiku 4.5** para errores de tipos simples (propiedad faltante, tipo de argumento incorrecto, `any` que se filtra).

**Sonnet 4.6** cuando los errores abarcan múltiples archivos, involucran restricciones de tipos genéricos, tipos condicionales o cadenas complejas de inferencia de tipos.

## Herramientas
- `Read` — leer el archivo fallido y las definiciones de tipos relevantes
- `Edit` — aplicar correcciones específicas (solo cambios mínimos)
- `Bash` — ejecutar `npx tsc --noEmit 2>&1` para confirmar la corrección, `grep` para definiciones de tipos relacionadas

## Cuándo delegar aquí
- `tsc --noEmit` falla con errores de tipos que quieres diagnosticar y corregir
- Errores `Type 'X' is not assignable to type 'Y'` que no son inmediatamente obvios
- Fallos de inferencia de tipos genéricos
- Incompatibilidades de definiciones de tipos de terceros (p.ej., tras actualizar un paquete)
- Corrección de tipos `any` que se han filtrado al codebase

## Cuándo NO delegar aquí
- Errores en tiempo de ejecución que no son errores de tipos
- Violaciones de reglas de ESLint (no compilación de TypeScript)
- Bugs lógicos que pasan la verificación de tipos

## Plantilla de prompt
```
You are a TypeScript error resolver. Fix the type errors — minimal changes only. Do not refactor.

Error output from tsc:
[paste full tsc error output]

Relevant files:
[paste file contents where errors occur]

Type definitions context (if relevant):
[paste relevant .d.ts or interface definitions]

For each error:
1. Explain why the error occurs in one sentence
2. Apply the minimal fix
3. Confirm the fix is correct by reasoning through the types

Do not change logic. Do not refactor. Fix types only.
```

## Caso de uso de ejemplo
**Error:**
```
src/api/orders.ts:45:18 - error TS2345:
Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
```

**Lo que devuelve el Resolvedor:**
- Causa: `req.params.id` es `string | undefined` pero `getOrder()` espera `string`
- Corrección: agregar una guarda `if (!req.params.id) return res.status(400).json({ error: 'id required' })` antes de la llamada — TypeScript reduce el tipo después de la guarda
- Mínimo: adición de 2 líneas, sin cambio de lógica

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores. [uitbreiden.com](https://uitbreiden.com/)
