# Vertical Slice Planner

## Cuándo activar

- Planificar una nueva característica o proyecto antes de que comience la construcción
- El usuario quiere desglosar una característica en unidades de trabajo antes de escribir código
- Claude pasó a un plan secuencial "base de datos → API → frontend" y quiere cortes de capas cruzadas en su lugar
- Necesita ordenar trabajo por riesgo o valor en lugar de por capa técnica
- El alcance de la característica es poco claro y necesita descomposición en incrementos entregables de forma independiente

## Cuándo no usar

- Tareas simples de un solo punto final o correcciones de errores pequeñas limitadas a una capa
- Tareas que ya son una unidad vertical única (por ejemplo, "agregar un nuevo campo a este formulario")
- Tareas muy pequeñas por debajo de medio día de trabajo estimado — fusionarlas, no dividirlas
- Cuando el equipo ya se ha comprometido con un contrato de entrega por fases específico y no puede reordenar el trabajo

## Instrucciones

**El problema con las fases secuenciales:**

Los modelos de IA predeterminados a: Fase 1 = esquema de base de datos, Fase 2 = puntos finales de API, Fase 3 = frontend. Esto retrasa la retroalimentación de integración de extremo a extremo hasta la última fase, donde los problemas arquitectónicos aparecen demasiado tarde para corregirlos de manera económica. No ve una ruta de trabajo a través del sistema hasta que la fase 3 está hecha.

**Enfoque de corte vertical:**

Cada corte es un corte delgado en todas las capas — base de datos + API + frontend + criterios de aceptación — que entrega una capacidad de extremo a extremo funcional y comprobable. Cada corte se envía de forma independiente. Un corte está terminado cuando un usuario puede interactuar con él, no cuando una capa está terminada.

---

**Paso 1 — Identificar las acciones de usuario principales (no componentes técnicos)**

Pregunte: "¿Qué puede realmente *hacer* el usuario?" — no "¿Qué tablas necesitamos?"

Mala descomposición: `tabla de usuarios → punto final /users → componente UserList`
Buena descomposición: `usuario puede buscar por nombre → usuario puede filtrar por estado → usuario puede exportar resultados`

Enumere cada acción de usuario distinta. Estos se convierten en sus candidatos de corte.

---

**Paso 2 — Ordenar cortes por valor y riesgo**

Calificar cortes:
- Mayor valor empresarial primero — ¿qué desbloquea la mayor cantidad de trabajo aguas abajo o prueba de usuario?
- Mayor riesgo de integración primero — ¿qué tiene más incógnitas en todas las capas?
- Bala de rastreador primero en ejecución — el camino más delgado posible que valida la arquitectura antes de construir contenido

---

**Paso 3 — Definir cada corte**

Use esta plantilla para cada corte:

```
Slice: [Nombre]
User action: [Lo que el usuario hace — escrito como una acción de usuario, no una tarea técnica]
Layers:
  Database: [cambio de esquema, migración o consulta involucrada]
  API:      [punto(s) final — método, ruta, forma de solicitud/respuesta]
  Frontend: [componente(s) afectado(s)]
  Integration: [llamadas de servicio externo, colas o emisiones de eventos]
Acceptance criteria:
  - [Condición específica y comprobable — comportamiento observable, no detalle de implementación]
  - [Condición adicional]
Definition of done: [Cómo verificar que este corte está completamente completado y listo para fusionar]
Estimate: [días]
```

---

**Paso 4 — Tamaño cada corte**

Objetivo 1–3 días de trabajo por corte. Si un corte lleva más tiempo, divídalo. Señales un corte es demasiado grande:
- Más de dos puntos finales de API creados en un corte
- Migración de esquema y lógica empresarial en el mismo corte
- Frontend y un nuevo trabajo de fondo en el mismo corte

Los cortes más cortos que medio día son demasiado granulares — fusionarlos con un corte adyacente.

---

**Paso 5 — Comience con una bala de rastreador**

El primer corte a ejecutar es el camino más delgado posible en todas las capas — incluso si devuelve resultados vacíos o datos stub. Esto valida:
- La base de datos se puede consultar desde la API
- La respuesta de la API llega al frontend
- El frontend puede renderizar la forma de una respuesta real

Si la bala de rastreador se rompe, ha encontrado su problema más difícil en el día uno — cuando es más barato arreglarlo.

Construya contenido (consultas reales, interfaz de usuario real, validación real) en cortes posteriores sobre una base comprobada.

---

**Formato de salida:**

```
VERTICAL SLICE PLAN — [Nombre de la característica]

User actions identified: [lista]
Slice order rationale: [una oración sobre por qué este orden]

Slice 1 (Tracer): [nombre] — [descripción de una línea]
Slice 2: [nombre] — [descripción de una línea]
...

[Definición de corte completa para cada corte usando la plantilla anterior]
```

## Ejemplo

**Entrada:** "Planificar la función de búsqueda para nuestro catálogo de productos. Desglosarlo en cortes verticales ordenados por riesgo."

**Salida esperada:**

```
VERTICAL SLICE PLAN — Product Catalog Search

User actions identified: buscar por palabra clave, filtrar por categoría/precio, ordenar resultados, paginar resultados
Slice order rationale: bala de rastreador primero para validar infraestructura de búsqueda, búsqueda principal siguiente, filtros últimos (mayor complejidad de implementación)

Slice 1 (Tracer): Punto final de búsqueda básico devuelve resultados vacíos
Slice 2: La búsqueda de palabras clave devuelve productos coincidentes
Slice 3: Filtrar por categoría y rango de precios
Slice 4: Paginación

---

Slice 1 (Tracer): Punto final de búsqueda básico devuelve resultados vacíos
User action: El usuario envía una consulta de búsqueda y recibe una respuesta (el vacío es aceptable)
Layers:
  Database: Agregar tabla de productos con columnas nombre, descripción, precio, categoría; sembrar 10 registros
  API:      GET /search?q= → devuelve { results: [], total: 0 }
  Frontend: Cuadro de búsqueda + lista de resultados renderiza mensaje de estado vacío
  Integration: ninguno
Acceptance criteria:
  - El envío de cualquier consulta devuelve HTTP 200 con la forma de respuesta correcta
  - El frontend se renderiza sin errores cuando la matriz de resultados está vacía
Definition of done: La solicitud de extremo a extremo desde el cuadro de búsqueda a la base de datos y de regreso se completa sin errores
Estimate: 0.5 días

Slice 2: La búsqueda de palabras clave devuelve productos coincidentes
User action: El usuario busca por palabra clave y ve productos coincidentes
Layers:
  Database: Índice de texto completo en columnas de nombre y descripción
  API:      GET /search?q= → devuelve { results: [{ id, name, price, category }], total: N }
  Frontend: La lista de resultados renderiza tarjetas de producto con nombre y precio
  Integration: ninguno
Acceptance criteria:
  - La búsqueda "laptop" devuelve productos con "laptop" en nombre o descripción
  - Los resultados se ordenan por relevancia (coincidencia de nombre clasificada por encima de coincidencia de descripción)
  - Una consulta vacía devuelve todos los productos hasta el tamaño de página
Definition of done: La búsqueda devuelve resultados precisos para 10 consultas de prueba; las tarjetas de resultados se representan correctamente
Estimate: 2 días

Slice 3: Filtrar por categoría y rango de precios
User action: El usuario reduce resultados usando el menú desplegable de categoría y las entradas de rango de precios
Layers:
  Database: Consulta actualizada para aceptar parámetros de categoría y precio_min/precio_max
  API:      GET /search?q=&category=&price_min=&price_max=
  Frontend: Panel de filtro con menú desplegable de categoría e entradas de rango de precios; los resultados se actualizan al aplicar
  Integration: ninguno
Acceptance criteria:
  - La aplicación de un filtro de categoría devuelve solo productos en esa categoría
  - El filtro de rango de precios devuelve solo productos dentro del rango
  - Los filtros se combinan correctamente con la búsqueda de palabras clave
Definition of done: Se prueban todas las combinaciones de filtros; el estado del filtro persiste en la actualización de página
Estimate: 1.5 días

Slice 4: Paginación
User action: El usuario navega a través de múltiples páginas de resultados
Layers:
  Database: LIMIT/OFFSET aplicado a consulta
  API:      GET /search?q=&page=&page_size= → agrega { page, total_pages } a respuesta
  Frontend: Controles de paginación se renderizan; el estado de página actualiza URL
  Integration: ninguno
Acceptance criteria:
  - La página 2 devuelve el desplazamiento correcto de los resultados
  - Las páginas totales reflejan el recuento de resultados real
  - La navegación a una URL paginada directamente devuelve la página correcta
Definition of done: La paginación funciona en todas las combinaciones de filtro y búsqueda
Estimate: 1 día
```

---
