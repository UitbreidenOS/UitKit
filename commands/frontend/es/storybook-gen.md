---
description: Generar historias CSF3 de Storybook para un componente cubriendo todas las variantes y estados significativos
argument-hint: "[ComponentFile.tsx]"
---
Generar historias de Storybook para: $ARGUMENTS

Lee el archivo del componente antes de escribir nada. Extrae la interfaz de props, variantes y estado del código fuente.

**Paso 1 — Analizar el componente**
Identifica:
- Todos los props y sus tipos (banderas booleanas, uniones de literales string, opcionales vs requeridos)
- Comportamiento controlado vs no controlado (¿acepta `value`/`onChange`?)
- Estados de carga, error, vacío y deshabilitado si existen
- Cualquier subcomponente compuesto que necesite demostrarse junto a otros

**Paso 2 — Determinar la cobertura de historias**
Genera historias para:
1. `Default` — props mínimos requeridos, sin extras opcionales
2. Una historia por cada prop booleano significativo que cambie la salida visible (ej. `isDisabled`, `isLoading`, `isError`)
3. Una historia por cada variante de unión string (ej. `variant: "primary" | "secondary" | "danger"`)
4. `AllVariants` — una única historia que renderiza todas las variantes lado a lado usando una función render con un contenedor flex/grid, útil para regresión visual
5. Historia de estado controlado si el componente acepta `value`/`onChange` — usa `useState` dentro de la función `render`
6. Casos límite: string vacío, desbordamiento de texto muy largo, conteo cero, datos opcionales null/undefined — solo si el componente es probable que encuentre estos

No generes historias para detalles de implementación interna ni props que solo afecten la ergonomía del desarrollador.

**Paso 3 — Escribir el archivo de historia**
Reglas de formato:
- Usa CSF3 (`export default { ... }` objeto meta + exportaciones de historias nombradas)
- `satisfies Meta<typeof Component>` para el tipo meta
- `satisfies StoryObj<typeof Component>` para cada historia
- `args` en el nivel meta para valores por defecto compartidos; anula por historia solo lo que cambia
- Usa `argTypes` para documentar props de unión con `control: { type: 'select' }`
- Importa el componente con la misma ruta de importación usada en otros lugares del proyecto (revisa importaciones existentes)
- Decoradores: solo agrega un decorador `padding` si el componente visualmente lo requiere — no envuelvas en proveedores innecesarios a menos que el componente explícitamente necesite contexto

**Paso 4 — Pruebas de interacción (si @storybook/test está disponible)**
Para la historia `Default`, agrega una función `play` que:
- Verifica que el componente se renderiza sin error
- Simula la interacción primaria del usuario (clic, escritura, selección)
- Afirma el resultado DOM esperado con `expect()`

Archivo de salida: coloca el archivo de historia adyacente al componente (`ComponentName.stories.tsx`). No crees un directorio separado `__stories__` a menos que ya exista uno.
