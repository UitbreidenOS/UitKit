> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../performance.md).

# Reglas de Rendimiento

Copia las secciones relevantes en el `CLAUDE.md` de tu proyecto.

---

## Base de datos

- Nunca ejecutes consultas dentro de bucles — agrupa con `IN (...)` o usa un join
- Siempre pagina las consultas que pueden devolver resultados ilimitados — sin `SELECT *` sin `LIMIT`
- Agrega índices antes de que la consulta sea lenta en producción, no después — analiza los planes de consulta durante el desarrollo
- Selecciona solo las columnas que necesitas — `SELECT *` obtiene datos no usados e impide escaneos solo de índice
- Usa agregación a nivel de base de datos (`COUNT`, `SUM`, `GROUP BY`) — no cargues filas en memoria para contarlas

## API y red

- Cachea las respuestas que son costosas de calcular y cambian poco — establece TTLs explícitos
- Pagina los endpoints de lista — devuelve un máximo de N elementos por solicitud con un cursor u offset
- No hagas consultas N+1 — agrupa los datos relacionados con DataLoader, `include` o un join
- Evita llamadas síncronas a servicios externos en los manejadores de solicitudes — usa colas para el trabajo no crítico
- Establece timeouts en todas las llamadas HTTP externas — nunca dejes que una dependencia lenta bloquee tu servidor

## Memoria

- No cargues grandes conjuntos de datos en memoria para procesarlos — usa streaming o paginación
- Libera las referencias cuando termines — evita closures accidentales que impidan la recolección de basura
- Usa generadores/iteradores para secuencias grandes en lugar de construir listas completas en memoria

## Medición

- Perfila antes de optimizar — nunca adivines dónde está el cuello de botella
- Mide en condiciones similares a producción — los benchmarks locales son engañosos
- Establece una línea base antes de hacer cambios — sin una línea base, no puedes confirmar la mejora
- Las pruebas de rendimiento pertenecen al CI — las regresiones que pasan la revisión de código pero fallan el presupuesto de rendimiento deben detectarse automáticamente

---
