---
description: Refactorizar la gestión de estado del componente para reducir la complejidad, elevar/colocar correctamente y eliminar el prop drilling
argument-hint: "[file-or-component-name]"
---
Refactorizar la gestión de estado en: $ARGUMENTS

Lee el archivo de destino (y sus consumidores inmediatos si son identificables) antes de proponer cambios.

**Paso 1 — Clasificar el estado existente**
Para cada `useState`, `useReducer`, `useRef`, `useContext` o selector de store encontrado, etiquétalo como:
- `local` — utilizado solo dentro de este componente
- `shared` — pasado como props a 2+ componentes hijos
- `derived` — puede calcularse a partir de otro estado o props, no necesita ser almacenado
- `server` — datos que provienen de una API y deben vivir en un cache de consulta, no en el estado del componente
- `url` — estado que pertenece a la URL (filtros, paginación, IDs seleccionados)

**Paso 2 — Identificar problemas**
- Prop drilling: props pasadas a través de 2+ componentes intermedios que no las usan → candidato para context o colocación
- Estado derivado almacenado como `useState` que se establece dentro de `useEffect` → reemplazar con `useMemo` o cálculo en línea
- Estado que se restablece en cada renderizado porque el inicializador se recrea (literal de objeto/array en llamada a useState) → estabilizar con inicializador `useRef` o constante a nivel de módulo
- Estado redundante que duplica props o puede calcularse a partir de otro estado
- Closures obsoletos: `useEffect` sin deps o usando `deps: []` con referencias a valores mutables

**Paso 3 — Aplicar refactores**
Orden de prioridad:
1. Eliminar el estado derivado primero — simplificación pura, riesgo cero
2. Colocar el estado que fue elevado más de lo necesario — moverlo hacia abajo al componente hoja que lo posee
3. Elevar el estado que es genuinamente compartido — mover al ancestro común más bajo, no arbitrariamente más alto
4. Reemplazar cadenas de prop drilling con un context estrecho (no un store global) con alcance al subárbol que lo necesita
5. Mover datos del servidor a la biblioteca de consultas existente (React Query, SWR, RTK Query — usar la que ya está en el proyecto)
6. Mover el estado con forma de URL al enrutador (Next.js `useSearchParams`, React Router `useSearchParams`)

**Paso 4 — Salida**
Aplicar todos los cambios directamente a los archivos. Después de las ediciones, resumir:
- Variables de estado eliminadas: N
- Props eliminadas de componentes intermedios: N
- Llamadas de `useEffect` eliminadas: N
- Cualquier decisión arquitectónica que necesite conciencia del equipo (por ejemplo, nuevo context introducido)

No añadas una biblioteca de gestión de estado que no esté ya en el proyecto.
