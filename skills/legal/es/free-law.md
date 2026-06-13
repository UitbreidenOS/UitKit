# Free Law Project (CourtListener) — Investigación Legal Gratuita de EE.UU.

## Cuándo activar
Investigación de decisiones judiciales federales y estatales estadounidenses sin suscripción de pago; búsqueda de presentaciones PACER, números de expedientes o registros de jueces; búsquedas masivas de jurisprudencia donde un servicio pagado sería prohibitivamente costoso; investigación legal de acceso abierto para trabajo académico o de interés público.

## Cuándo NO usar
Investigación que requiera fuentes secundarias (análisis de law review, notas de orientación de Practical Law, notas de encabezado de Westlaw) — usa MCP Thomson Reuters para esos; investigación fuera de tribunales federales estadounidenses donde la cobertura de CourtListener es escasa o ausente; trabajo sensible al tiempo que requiere cobertura de opiniones garantizada el mismo día (algunas opiniones recientes tienen retrasos de publicación).

## Instrucciones

**Lo que es :**
Free Law Project ejecuta CourtListener — la base de datos legal estadounidense más grande, gratuita y de acceso abierto. La integración de MCP (mayo de 2026) no requiere suscripción, compra de clave API ni facturación por consulta.

**Cobertura :**
- Opiniones de tribunales de apelación y distritales federales (completas)
- Opiniones de la Corte Suprema de EE.UU. (completas)
- Presentaciones y datos de expedientes PACER (tribunales federales)
- Registros biográficos de jueces, historial de recusación, divulgaciones financieras
- Grabaciones de argumentos orales (donde disponibles)
- La cobertura de tribunales estatales varía significativamente por estado — verifica antes de confiar en la integridad del tribunal estatal

**Límites de velocidad :**
El nivel gratuito tiene límites de velocidad. Estructura las consultas para ser específicas y enfocadas — evita consultas amplias rápidas. Agrupa búsquedas relacionadas en solicitudes únicas cuando sea posible.

**Tipos de consulta :**

Búsqueda de casos por palabra clave :
```
Encuentre opiniones del Circuito 9 de 2023-2026 que involucren contenido generado por IA
e infracción de derechos de autor. Devuelva citas y un resumen de conclusión de un párrafo.
```

Búsqueda de citación :
```
Recupere el texto completo de Twitter, Inc. v. Taamneh, 598 U.S. 471 (2023).
```

Registros de jueces :
```
¿Qué casos ha decidido la jueza Jacqueline Scott Corley que involucren
la Sección 230 desde 2021?
```

Búsqueda de expediente :
```
Encuentre el expediente actual de FTC v. Meta Platforms en el Distrito
Norte de California. Enumere las mociones pendientes.
```

**Limitaciones — sepa antes de consultar :**
- Los tribunales federales estadounidenses son la fortaleza principal; la cobertura de tribunales estatales es inconsistente
- Sin fuentes secundarias, sin artículos de law review, sin contenido de Practical Law
- Algunas opiniones recientes tienen retraso en la publicación (días a semanas)
- La cobertura completa del expediente PACER requiere una cuenta PACER para algunas presentaciones selladas o restringidas

**Combine con MCP Thomson Reuters :**
CourtListener para volumen de fuente primaria gratuita + MCP TR para análisis de fuente secundaria y profundidad de Westlaw. Flujo de trabajo de ejemplo: use CourtListener para identificar casos relevantes en masa, luego extraiga análisis de Westlaw en los casos clave a través de MCP TR.

**Advertencia de salida OBLIGATORIA — incluir en cada salida de investigación :**
> Solo para propósitos de investigación — verifique con abogado autorizado antes de confiar en cualquier análisis legal.

**Formato de citación :** Siempre incluya cita completa: nombre del caso, volumen, reportero, primera página, tribunal, año. Ejemplo: `NetChoice, LLC v. Paxton, 49 F.4th 439 (5th Cir. 2022)`.

## Ejemplo

```
Encuentre todas las opiniones del Circuito 9 de 2023-2026 que involucren contenido generado por IA
e infracción de derechos de autor. Devuelva citas Bluebook y un resumen
de una oración de cada conclusión.
```

Claude consulta CourtListener a través de MCP, devuelve una lista de opiniones coincidentes con citas y resúmenes de conclusiones, observa qué casos tienen peticiones de certificación pendientes e incluye la advertencia obligatoria de investigación.

---
