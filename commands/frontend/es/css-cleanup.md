---
description: Eliminar CSS muerto, consolidar duplicados, reforzar design tokens y corregir problemas de especificidad
argument-hint: "[file-or-directory]"
---
Limpiar CSS/estilos en: $ARGUMENTS

Si no se proporciona argumento, escanear todos los archivos `.css`, `.scss`, `.module.css` y las cadenas de clases Tailwind en `src/`.

**Paso 1 — Eliminación de código muerto**
Identificar y eliminar:
- Reglas CSS cuyos selectores no coinciden con ningún elemento en el JSX/HTML de este proyecto (análisis estático — marcar como inciertos los nombres de clase dinámicos, no eliminarlos)
- Declaraciones `@keyframes` que no son referenciadas por ninguna propiedad `animation` o `animation-name`
- Propiedades CSS personalizadas (variables) declaradas en `:root` o en el ámbito de un componente pero nunca leídas mediante `var(--name)`
- Bloques de reglas comentados más antiguos que el código circundante (usar heurística de git blame si está disponible)

**Paso 2 — Consolidación de duplicados**
- Conjuntos de reglas idénticos o casi idénticos aplicados a diferentes selectores → extraer una clase de utilidad compartida o una propiedad CSS personalizada
- Valores repetidos de `margin`, `padding` o `gap` que coincidan con un design token existente → reemplazar con el token
- Bloques de media query con el mismo breakpoint dispersos en el archivo → fusionar en un único bloque

**Paso 3 — Refuerzo de design tokens**
Escanear el proyecto para encontrar una fuente de tokens: propiedades CSS personalizadas en `:root`, una configuración de Tailwind `theme.extend`, un archivo `tokens.ts` / `theme.ts` o una importación de sistema de diseño.
Para cada valor codificado encontrado:
- Colores (hex, rgb, hsl): reemplazar con el token coincidente más cercano si existe dentro de una distancia perceptual del 5%; marcar si no existe coincidencia
- Espaciado (valores px, rem): reemplazar con el token de escala de espaciado coincidente
- Tamaños de fuente: reemplazar con el token de escala de tipos coincidente
- No reemplazar valores que no tengan un equivalente de token razonable — marcarlos en la salida

**Paso 4 — Problemas de especificidad y cascada**
- Selectores con especificidad superior a `(0, 2, 0)` (dos clases) → simplificar o reestructurar
- Declaraciones `!important`: eliminar cada una y verificar que la cascada funcione sin ella; si la eliminación cambia el comportamiento, anotarlo pero dejar `!important` en su lugar con un comentario explicando el motivo
- SCSS profundamente anidado (más de 3 niveles) → aplanar a BEM o clases de utilidad que coincidan con la convención del proyecto
- Selector universal `*` con propiedades que no sean de restablecimiento → marcar para revisión

**Paso 5 — Salida**
Aplicar todos los cambios seguros (código muerto, duplicados, sustituciones de tokens) directamente.
Para cambios destructivos o inciertos (eliminación de selectores que puede afectar clases dinámicas, eliminación de `!important`), emitir una lista:
`file:line | issue | recommended action | reason not auto-applied`

Reportar totales: líneas eliminadas, reglas consolidadas, tokens sustituidos.
