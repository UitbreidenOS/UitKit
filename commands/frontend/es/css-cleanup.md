---
description: Eliminar CSS muerto, consolidar duplicados, aplicar design tokens y corregir problemas de especificidad
argument-hint: "[archivo-o-directorio]"
---
Limpiar CSS/estilos en: $ARGUMENTS

Si no se proporciona un argumento, escanear todos los archivos `.css`, `.scss`, `.module.css` y cadenas de clases Tailwind en `src/`.

**Paso 1 — Eliminación de código muerto**
Identificar y eliminar:
- Reglas CSS cuyos selectores no coinciden con ningún elemento en el JSX/HTML de este repositorio (análisis estático — marcar nombres de clases dinámicos como inciertos, no eliminarlos)
- Declaraciones `@keyframes` que no son referenciadas por ninguna propiedad `animation` o `animation-name`
- Propiedades personalizadas CSS (variables) declaradas en `:root` o en el ámbito de un componente pero nunca leídas a través de `var(--nombre)`
- Bloques de reglas comentados más antiguos que el código circundante (usar heurística de git blame si está disponible)

**Paso 2 — Consolidación de duplicados**
- Conjuntos de reglas idénticos o casi idénticos aplicados a diferentes selectores → extraer una clase utilidad compartida o propiedad personalizada CSS
- Valores repetidos de `margin`, `padding` o `gap` que coinciden con un design token existente → reemplazar con el token
- Bloques de media query con el mismo punto de quiebre dispersos en el archivo → fusionar en un único bloque

**Paso 3 — Aplicación de design tokens**
Escanear el proyecto para una fuente de tokens: propiedades personalizadas CSS en `:root`, una configuración Tailwind `theme.extend`, un archivo `tokens.ts` / `theme.ts` o una importación del sistema de diseño.
Para cada valor codificado encontrado:
- Colores (hex, rgb, hsl): reemplazar con el token coincidente más cercano si existe dentro de un 5% de distancia perceptual; marcar si no hay coincidencia
- Espaciado (valores px, rem): reemplazar con el token de escala de espaciado coincidente
- Tamaños de fuente: reemplazar con el token de escala tipográfica coincidente
- No reemplazar valores que no tienen un equivalente razonable de token — marcarlos en el resultado en su lugar

**Paso 4 — Problemas de especificidad y cascada**
- Selectores con especificidad superior a `(0, 2, 0)` (dos clases) → simplificar o reestructurar
- Declaraciones `!important`: eliminar cada una y verificar que la cascada funcione sin ella; si la eliminación cambia el comportamiento, anotarlo pero dejar `!important` en su lugar con un comentario explicando por qué
- SCSS profundamente anidado (más de 3 niveles) → aplanar a BEM o clases utilidad que coincidan con la convención del proyecto
- Selector universal `*` con propiedades que no son de reinicio → marcar para revisión

**Paso 5 — Salida**
Aplicar todos los cambios seguros (código muerto, duplicados, sustituciones de tokens) directamente.
Para cambios destructivos o inciertos (eliminación de selectores que pueden afectar clases dinámicas, eliminación de `!important`), emitir una lista:
`archivo:línea | problema | acción recomendada | razón para no aplicar automáticamente`

Reportar totales: líneas eliminadas, reglas consolidadas, tokens sustituidos.
